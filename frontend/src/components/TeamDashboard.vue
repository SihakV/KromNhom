<template>
  <div class="min-h-screen bg-base-200 p-4">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-8">
      <h1 class="text-4xl font-bold text-base-content mb-3 text-display">Team Daily Goal Tracker</h1>
      <p class="text-lg text-base-content/70 text-body max-w-2xl">Monitor your team's daily goals and mood in real-time</p>
    </div>



    <!-- Loading State -->
    <div v-if="store.loading.value" class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg"></span>
      <div class="ml-4">Loading team data...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error.value" class="max-w-7xl mx-auto">
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ store.error.value }}</span>
        <div>
          <button class="btn btn-sm" @click="store.loadTeamData">Retry</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto">
      <!-- Statistics Panel -->
      <TeamStatsPanel 
        :statistics="store.statistics.value" 
        :loading="store.statisticsLoading.value"
      />

      <!-- Team Members Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <TeamMemberCard
          v-for="member in store.teamMembers.value"
          :key="member.id"
          :member="member"
          @toggle-goal="handleToggleGoal"
          @delete-goal="handleDeleteGoal"
          @open-mood-selector="handleOpenMoodSelector"
          @delete-member="handleDeleteMember"
        />
      </div>

      <!-- Empty State -->
      <div v-if="store.teamMembers.value.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-xl font-semibold mb-2">No team members found</h2>
        <p class="text-base-content/70">Your team will appear here once data is loaded.</p>
      </div>
    </div>

    <!-- Speed Dial with Add Goal/Member -->
    <AddGoalForm 
      @goal-added="handleGoalAdded"
      @member-added="handleMemberAdded"
    />

    <!-- Mood Selector Modal -->
    <MoodSelector
      v-if="selectedMemberId"
      :selected-member-id="selectedMemberId"
      @mood-updated="handleMoodUpdated"
      @close="selectedMemberId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTeamStore } from '../composables/useTeamStore';
import TeamMemberCard from './TeamMemberCard.vue';
import AddGoalForm from './AddGoalForm.vue';
import MoodSelector from './MoodSelector.vue';
import TeamStatsPanel from './TeamStatsPanel.vue';

const selectedMemberId = ref<number | null>(null);

// Use the team store
const store = useTeamStore();



const handleToggleGoal = async (goalId: number, isCompleted: boolean) => {
  try {
    await store.toggleGoalCompletion(goalId, isCompleted);
  } catch (err) {
    console.error('Error toggling goal:', err);
    // Could add toast notification here
  }
};

const handleOpenMoodSelector = (memberId: number) => {
  selectedMemberId.value = memberId;
};

const handleGoalAdded = async (goalData: any) => {
  try {
    await store.addGoal(goalData);
  } catch (err) {
    console.error('Error adding goal:', err);
    // Could add toast notification here
  }
};

const handleMemberAdded = async (memberData: any) => {
  try {
    await store.addMember(memberData);
  } catch (err) {
    console.error('Error adding member:', err);
    // Could add toast notification here
  }
};

const handleDeleteGoal = async (goalId: number) => {
  try {
    await store.deleteGoal(goalId);
  } catch (err) {
    console.error('Error deleting goal:', err);
    // Could add toast notification here
  }
};

const handleDeleteMember = async (memberId: number) => {
  try {
    await store.deleteMember(memberId);
  } catch (err) {
    console.error('Error deleting member:', err);
    // Could add toast notification here
  }
};

const handleMoodUpdated = async (memberId: number, newMood: any) => {
  try {
    await store.updateMemberMood(memberId, newMood);
    selectedMemberId.value = null;
  } catch (err) {
    console.error('Error updating mood:', err);
    // Could add toast notification here
  }
};

onMounted(() => {
  store.loadTeamData();
});
</script>