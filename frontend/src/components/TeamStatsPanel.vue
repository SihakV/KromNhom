<template>
  <!-- Two Cards Side by Side -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    
    <!-- Goal Statistics Card -->
    <div class="card bg-base-100 shadow-lg border border-base-300">
      <div class="card-body p-4">
        <h2 class="card-title text-xl mb-4 font-sans">📊 Goal Progress</h2>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <span class="loading loading-spinner loading-md"></span>
        </div>
        
        <!-- Goal Statistics Display -->
        <div v-else-if="statistics" class="space-y-4">
          <!-- Goal Completion -->
          <div class="stat">
            <div class="stat-title">Completion Rate</div>
            <div class="stat-value text-primary text-4xl font-mono">
              {{ animatedPercentage.toFixed(1) }}%
            </div>
            <div class="stat-desc">
              {{ Math.round(animatedCompletedGoals) }} of {{ statistics.totalGoals }} goals completed
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full">
            <div class="flex justify-between text-xs mb-2">
              <span class="font-medium">Progress</span>            </div>
            <progress 
              class="progress progress-primary w-full h-3" 
              :value="animatedCompletedGoals" 
              :max="statistics.totalGoals"
            ></progress>
          </div>

          <!-- Team Size -->
          <div class="stat">
            <div class="stat-title">Team Size</div>
            <div class="stat-value text-sm">{{ statistics.teamMemberCount }} members</div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-8 text-base-content/50">
          <div class="text-4xl mb-2">📊</div>
          <p>Goal statistics unavailable</p>
        </div>
      </div>
    </div>

    <!-- Team Mood Card -->
    <div class="card bg-base-100 shadow-lg border border-base-300">
      <div class="card-body p-4">
        <h2 class="card-title text-xl mb-4 font-sans">😊 Team Mood</h2>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <span class="loading loading-spinner loading-md"></span>
        </div>
        
        <!-- Mood Distribution Display -->
        <div v-else-if="statistics && statistics.moodDistribution" class="space-y-4">
          <!-- Mood Grid -->
          <div class="grid grid-cols-3 gap-4 text-center">
            <div v-for="(count, mood) in statistics.moodDistribution" :key="mood" class="text-center">
              <div class="text-3xl mb-2">{{ getMoodEmoji(mood as any) }}</div>
              <div class="text-sm font-medium">{{ count }}</div>
              <div class="text-xs text-base-content/60 capitalize">{{ getMoodLabel(mood as any) }}</div>
            </div>
          </div>

          <!-- Overall Mood Indicator -->
          <div class="divider">Overall Vibe</div>
          <div class="text-center">
            <div class="text-4xl mb-2">{{ getDominantMood() }}</div>
            <div class="text-sm text-base-content/70">{{ getDominantMoodLabel() }}</div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-8 text-base-content/50">
          <div class="text-4xl mb-2">😊</div>
          <p>Mood data unavailable</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Last Updated Info -->
  <div v-if="statistics" class="text-xs text-base-content/50 text-center mb-4">
    Last updated: {{ formatLastUpdated(statistics.lastUpdated) }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTransition, TransitionPresets } from '@vueuse/core';
import type { TeamStatistics, MoodType } from '../types';
import { getMoodEmoji, MOOD_OPTIONS } from '../types';

interface Props {
  statistics: TeamStatistics | null;
  loading?: boolean;
}

const props = defineProps<Props>();

// Source refs for the target animation values
const sourcePercentage = ref(0);
const sourceCompletedGoals = ref(0);

// Transitioned refs that will be animated
const animatedPercentage = useTransition(sourcePercentage, {
  duration: 800,
  transition: TransitionPresets.easeOutCubic,
});

const animatedCompletedGoals = useTransition(sourceCompletedGoals, {
  duration: 800,
  transition: TransitionPresets.easeOutCubic,
});

// Watch for changes in the statistics and update the source refs
watch(() => props.statistics, (newStats) => {
  if (newStats) {
    sourcePercentage.value = newStats.completionPercentage;
    sourceCompletedGoals.value = newStats.completedGoals;
  } else {
    sourcePercentage.value = 0;
    sourceCompletedGoals.value = 0;
  }
}, { immediate: true });


const formatLastUpdated = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  } catch {
    return 'Unknown';
  }
};

const getMoodLabel = (mood: MoodType): string => {
  return MOOD_OPTIONS.find(option => option.value === mood)?.label || 'Unknown';
};

const getDominantMood = (): string => {
  if (!props.statistics?.moodDistribution) return '😐';
  
  let maxCount = 0;
  let dominantMood = 'neutral';
  
  for (const [mood, count] of Object.entries(props.statistics.moodDistribution)) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
    }
  }
  
  return getMoodEmoji(dominantMood as MoodType);
};

const getDominantMoodLabel = (): string => {
  if (!props.statistics?.moodDistribution) return 'Balanced';
  
  let maxCount = 0;
  let dominantMood = 'neutral';
  
  for (const [mood, count] of Object.entries(props.statistics.moodDistribution)) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
    }
  }
  
  const totalMembers = Object.values(props.statistics.moodDistribution).reduce((sum, count) => sum + count, 0);
  const percentage = Math.round((maxCount / totalMembers) * 100);
  
  return `${getMoodLabel(dominantMood as MoodType)} (${percentage}%)`;
};
</script>