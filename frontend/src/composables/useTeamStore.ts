import { ref, computed } from 'vue';
import { api } from '../services/api';
import type { TeamMemberWithGoals, TeamStatistics, MoodType, CreateGoalRequest, MoodUpdateRequest, CreateTeamMemberRequest } from '../types';
import { getMoodEmoji } from '../types';

// Simple global refs - this will work
const teamMembers = ref<TeamMemberWithGoals[]>([]);
const statistics = ref<TeamStatistics | null>(null);
const loading = ref(false);
const statisticsLoading = ref(false);
const error = ref<string | null>(null);

export function useTeamStore() {

  // Computed values
  const totalMembers = computed(() => teamMembers.value.length);
  const totalGoals = computed(() => teamMembers.value.reduce((sum, member) => sum + member.goals.length, 0));
  const completedGoals = computed(() => 
    teamMembers.value.reduce((sum, member) => 
      sum + member.goals.filter(goal => goal.isCompleted).length, 0
    )
  );

  // Actions
  const loadTeamData = async () => {
    try {
      loading.value = true;
      statisticsLoading.value = true;
      error.value = null;
      
      const [teamData, statsData] = await Promise.allSettled([
        api.getTeamMembers(),
        api.getStatistics()
      ]);

      if (teamData.status === 'fulfilled') {
        teamMembers.value = teamData.value;
      } else {
        throw teamData.reason;
      }

      if (statsData.status === 'fulfilled') {
        statistics.value = statsData.value;
      }
    } catch (err) {
      console.error('Error loading team data:', err);
      error.value = 'Failed to load team data. Please try again.';
    } finally {
      loading.value = false;
      statisticsLoading.value = false;
    }
  };

  const refreshStatistics = async () => {
    try {
      statisticsLoading.value = true;
      const stats = await api.getStatistics();
      statistics.value = stats;
    } catch (err) {
      console.error('Error refreshing statistics:', err);
    } finally {
      statisticsLoading.value = false;
    }
  };

  const updateMemberMood = async (memberId: number, newMood: MoodType) => {
    const member = teamMembers.value.find(m => m.id === memberId);
    const oldMood = member?.currentMood;
    
    try {
      // Optimistic update - update local state immediately
      if (member) {
        member.currentMood = newMood;
        member.updatedAt = new Date().toISOString();
      }

      // Update local statistics immediately (no server call)
      updateLocalMoodStatistics(oldMood, newMood);

      // API call in background (don't await if we want fire-and-forget)
      const moodRequest: MoodUpdateRequest = { currentMood: newMood };
      api.updateMood(memberId, moodRequest).catch(err => {
        console.error('Error updating mood on server:', err);
        // Revert optimistic update on error
        if (member && oldMood) {
          member.currentMood = oldMood as MoodType;
          member.updatedAt = new Date().toISOString();
          updateLocalMoodStatistics(newMood, oldMood); // Revert stats too
        }
      });
      
      return true;
    } catch (err) {
      console.error('Error updating mood:', err);
      
      // Revert optimistic update on error
      if (member && oldMood) {
        member.currentMood = oldMood as MoodType;
        updateLocalMoodStatistics(newMood, oldMood); // Revert stats
      }
      
      throw err;
    }
  };

  const toggleGoalCompletion = async (goalId: number, isCompleted: boolean) => {
    let targetGoal: any = null;
    let oldCompleted: boolean;
    let oldCompletedAt: string | null | undefined;
    
    try {
      // Find the goal and update optimistically
      for (const member of teamMembers.value) {
        const goal = member.goals.find(g => g.id === goalId);
        if (goal) {
          targetGoal = goal;
          oldCompleted = goal.isCompleted;
          oldCompletedAt = goal.completedAt;
          
          // Optimistic update
          goal.isCompleted = isCompleted;
          goal.completedAt = isCompleted ? new Date().toISOString() : null;
          break;
        }
      }

      if (!targetGoal) {
        throw new Error('Goal not found');
      }

      // Update local statistics immediately
      updateLocalGoalStatistics(isCompleted ? 1 : -1);

      // API call in background
      api.completeGoal(goalId, isCompleted).catch(err => {
        console.error('Error updating goal on server:', err);
        // Revert optimistic update on error
        if (targetGoal) {
          targetGoal.isCompleted = oldCompleted!;
          targetGoal.completedAt = oldCompletedAt;
          updateLocalGoalStatistics(isCompleted ? -1 : 1); // Revert stats
        }
      });
      
      return true;
    } catch (err) {
      console.error('Error toggling goal:', err);
      
      // Revert optimistic update on error
      if (targetGoal) {
        targetGoal.isCompleted = oldCompleted!;
        targetGoal.completedAt = oldCompletedAt;
      }
      
      throw err;
    }
  };

  const addGoal = async (goalRequest: CreateGoalRequest) => {
    try {
      // Find the target member
      const member = teamMembers.value.find(m => m.id === goalRequest.teamMemberId);
      if (!member) {
        throw new Error('Team member not found');
      }

      // Create a temporary goal with a negative ID (will be replaced by server response)
      const tempGoal = {
        id: -Date.now(), // Temporary negative ID
        teamMemberId: goalRequest.teamMemberId,
        description: goalRequest.description,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      };

      // Optimistic update - add goal to local state immediately
      member.goals.push(tempGoal);

      // Update local statistics
      if (statistics.value) {
        const newTotalGoals = statistics.value.totalGoals + 1;
        const newCompletionPercentage = Math.round(
          (statistics.value.completedGoals / newTotalGoals) * 100 * 10
        ) / 10;
        
        statistics.value = {
          ...statistics.value,
          totalGoals: newTotalGoals,
          completionPercentage: newCompletionPercentage,
          lastUpdated: new Date().toISOString(),
        };
      }

      try {
        // API call to get the real ID
        const realGoal = await api.createGoal(goalRequest);
        
        // Replace the temporary goal with the real goal data
        const goalIndex = member.goals.findIndex(g => g.id === tempGoal.id);
        if (goalIndex !== -1) {
          member.goals[goalIndex] = realGoal;
        }
      } catch (err) {
        console.error('Error creating goal on server:', err);
        // Revert optimistic update on error
        const goalIndex = member.goals.findIndex(g => g.id === tempGoal.id);
        if (goalIndex !== -1) {
          member.goals.splice(goalIndex, 1);
        }
        
        // Revert statistics
        if (statistics.value) {
          const newTotalGoals = statistics.value.totalGoals - 1;
          const newCompletionPercentage = newTotalGoals > 0 
            ? Math.round((statistics.value.completedGoals / newTotalGoals) * 100 * 10) / 10
            : 0;
            
          statistics.value = {
            ...statistics.value,
            totalGoals: newTotalGoals,
            completionPercentage: newCompletionPercentage,
            lastUpdated: new Date().toISOString(),
          };
        }
        throw err;
      }
      
      return true;
    } catch (err) {
      console.error('Error adding goal:', err);
      throw err;
    }
  };

  const deleteGoal = async (goalId: number) => {
    let removedGoal: any = null;
    let targetMember: TeamMemberWithGoals | null = null;
    let goalIndex: number = -1;
    
    try {
      // Find the goal and remove it optimistically
      for (const member of teamMembers.value) {
        const index = member.goals.findIndex(g => g.id === goalId);
        if (index !== -1) {
          removedGoal = member.goals[index];
          targetMember = member;
          goalIndex = index;
          
          // Optimistic update - remove goal from local state immediately
          member.goals.splice(index, 1);
          break;
        }
      }

      if (!removedGoal || !targetMember) {
        throw new Error('Goal not found');
      }

      // Update local statistics
      if (statistics.value) {
        const newTotalGoals = statistics.value.totalGoals - 1;
        const newCompletedGoals = removedGoal.isCompleted ? statistics.value.completedGoals - 1 : statistics.value.completedGoals;
        const newCompletionPercentage = newTotalGoals > 0 
          ? Math.round((newCompletedGoals / newTotalGoals) * 100 * 10) / 10
          : 0;
          
        statistics.value = {
            ...statistics.value,
            totalGoals: newTotalGoals,
            completedGoals: newCompletedGoals,
            completionPercentage: newCompletionPercentage,
            lastUpdated: new Date().toISOString(),
        };
      }

      // API call in background
      api.deleteGoal(goalId).catch(err => {
        console.error('Error deleting goal on server:', err);
        
        // Revert optimistic update on error
        if (targetMember && removedGoal) {
          targetMember.goals.splice(goalIndex, 0, removedGoal); // Re-insert at original position
        }
        
        // Revert statistics - a full refresh is easier here
        refreshStatistics();
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting goal:', err);
      throw err;
    }
  };

  const addMember = async (memberRequest: CreateTeamMemberRequest) => {
    try {
      // Optimistic update - add member to local state immediately
      const tempMember = {
        id: -Date.now(), // Temporary negative ID
        name: memberRequest.name,
        currentMood: memberRequest.currentMood,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        goals: []
      };

      teamMembers.value.push(tempMember);

      // Update local statistics
      if (statistics.value) {
        const newMoodDistribution = { ...statistics.value.moodDistribution };
        if (newMoodDistribution[memberRequest.currentMood]) {
          newMoodDistribution[memberRequest.currentMood]++;
        } else {
          newMoodDistribution[memberRequest.currentMood] = 1;
        }

        statistics.value = {
          ...statistics.value,
          teamMemberCount: statistics.value.teamMemberCount + 1,
          moodDistribution: newMoodDistribution,
          lastUpdated: new Date().toISOString(),
        };
      }

      // API call
      try {
        const realMember = await api.createTeamMember(memberRequest);
        
        // Replace temp member with real data from server
        const memberIndex = teamMembers.value.findIndex(m => m.id === tempMember.id);
        if (memberIndex !== -1) {
          // Ensure the object has the `goals` property to be reactive
          teamMembers.value[memberIndex] = { ...realMember, goals: [] };
        }
        
      } catch (err) {
        console.error('Error creating member on server:', err);
        // Revert optimistic update on error
        const memberIndex = teamMembers.value.findIndex(m => m.id === tempMember.id);
        if (memberIndex !== -1) {
          teamMembers.value.splice(memberIndex, 1);
        }
        
        // Revert statistics
        if (statistics.value) {
            const newMoodDistribution = { ...statistics.value.moodDistribution };
            if (newMoodDistribution[memberRequest.currentMood]) {
                newMoodDistribution[memberRequest.currentMood]--;
                if (newMoodDistribution[memberRequest.currentMood] <= 0) {
                    delete newMoodDistribution[memberRequest.currentMood];
                }
            }
            statistics.value = {
                ...statistics.value,
                teamMemberCount: statistics.value.teamMemberCount - 1,
                moodDistribution: newMoodDistribution,
                lastUpdated: new Date().toISOString(),
            };
        }
        throw err;
      }
      
      return true;
    } catch (err) {
      console.error('Error adding member:', err);
      throw err;
    }
  };

  const deleteMember = async (teamMemberId: number) => {
    const memberIndex = teamMembers.value.findIndex(m => m.id === teamMemberId);
    if (memberIndex === -1) {
      throw new Error('Team member not found');
    }

    const removedMember = teamMembers.value[memberIndex];
    
    // Optimistic update
    teamMembers.value.splice(memberIndex, 1);

    // Update local statistics
    if (statistics.value) {
      const newMoodDistribution = { ...statistics.value.moodDistribution };
      if (newMoodDistribution[removedMember.currentMood]) {
        newMoodDistribution[removedMember.currentMood]--;
        if (newMoodDistribution[removedMember.currentMood] <= 0) {
          delete newMoodDistribution[removedMember.currentMood];
        }
      }

      const newTotalGoals = statistics.value.totalGoals - removedMember.goals.length;
      const newCompletedGoals = statistics.value.completedGoals - removedMember.goals.filter(g => g.isCompleted).length;
      const newCompletionPercentage = newTotalGoals > 0
        ? Math.round((newCompletedGoals / newTotalGoals) * 100 * 10) / 10
        : 0;

      statistics.value = {
        ...statistics.value,
        teamMemberCount: statistics.value.teamMemberCount - 1,
        totalGoals: newTotalGoals,
        completedGoals: newCompletedGoals,
        moodDistribution: newMoodDistribution,
        completionPercentage: newCompletionPercentage,
        lastUpdated: new Date().toISOString(),
      };
    }

    try {
      await api.deleteTeamMember(teamMemberId);
    } catch (err) {
      console.error('Error deleting member on server:', err);
      // Revert optimistic update
      teamMembers.value.splice(memberIndex, 0, removedMember);
      // A full statistics refresh is easier and safer here
      await refreshStatistics(); 
      throw err;
    }
  };

  const getMemberById = (id: number): TeamMemberWithGoals | undefined => {
    return teamMembers.value.find(member => member.id === id);
  };

  // Local statistics update helpers (no server calls)
  const updateLocalMoodStatistics = (oldMood: MoodType | undefined, newMood: MoodType) => {
    if (!statistics.value) return;

    const newMoodDistribution = { ...statistics.value.moodDistribution };

    // Decrease old mood count
    if (oldMood && newMoodDistribution[oldMood]) {
      newMoodDistribution[oldMood]--;
      if (newMoodDistribution[oldMood] <= 0) {
        delete newMoodDistribution[oldMood];
      }
    }
    
    // Increase new mood count
    if (newMoodDistribution[newMood]) {
      newMoodDistribution[newMood]++;
    } else {
      newMoodDistribution[newMood] = 1;
    }

    statistics.value = {
      ...statistics.value,
      moodDistribution: newMoodDistribution,
      lastUpdated: new Date().toISOString(),
    };
  };

  const updateLocalGoalStatistics = (completedGoalsDelta: number) => {
    if (!statistics.value) return;

    const newCompleted = statistics.value.completedGoals + completedGoalsDelta;
    const newPercentage = statistics.value.totalGoals > 0
      ? Math.round((newCompleted / statistics.value.totalGoals) * 100 * 10) / 10
      : 0;

    statistics.value = {
      ...statistics.value,
      completedGoals: newCompleted,
      completionPercentage: newPercentage,
      lastUpdated: new Date().toISOString(),
    };
  };

  const getMoodDistributionWithEmojis = computed(() => {
    if (!statistics.value?.moodDistribution) return {};
    
    const result: Record<string, { count: number; emoji: string }> = {};
    
    for (const [mood, count] of Object.entries(statistics.value.moodDistribution)) {
      result[mood] = {
        count,
        emoji: getMoodEmoji(mood as MoodType)
      };
    }
    
    return result;
  });

  return {
    // State - return the actual refs
    teamMembers,
    statistics,
    loading,
    statisticsLoading,
    error,
    
    // Computed
    totalMembers,
    totalGoals,
    completedGoals,
    getMoodDistributionWithEmojis,
    
    // Actions
    loadTeamData,
    refreshStatistics,
    updateMemberMood,
    toggleGoalCompletion,
    addGoal,
    addMember,
    deleteGoal,
    deleteMember,
    getMemberById,
    
    // Utilities
    clearError: () => { error.value = null; }
  };
}