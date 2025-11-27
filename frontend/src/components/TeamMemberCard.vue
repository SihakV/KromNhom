<template>
  <div class="card bg-base-100 shadow-lg border border-base-300">
    <div class="card-body p-4">
      <!-- Member Header -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="card-title text-lg font-sans font-semibold">{{ member.name }}</h3>
        <div class="flex items-center gap-2">
          <span class="text-2xl" :title="`Current mood: ${getMoodLabel(member.currentMood)}`">
            {{ getMoodEmoji(member.currentMood) }}
          </span>
          <div class="badge badge-outline badge-sm font-mono whitespace-nowrap">
            {{ completedGoals }}/{{ totalGoals }}
          </div>
        </div>
      </div>

      <!-- Goals List -->
      <div class="space-y-2">
        <h4 class="text-sm font-medium text-base-content/70 mb-2">Today's Goals:</h4>
        <div v-if="member.goals.length === 0" class="text-sm text-base-content/50 italic">
          No goals for today
        </div>
        <div v-else class="space-y-1">
          <div 
            v-for="goal in member.goals" 
            :key="goal.id"
            class="flex items-center gap-2 hover:bg-base-200/50 p-2 rounded group"
          >
            <input 
              type="checkbox" 
              :checked="goal.isCompleted"
              class="checkbox checkbox-sm cursor-pointer"
              @change="toggleGoalCompletion(goal)"
            />
            <span 
              class="text-sm flex-1 cursor-pointer"
              :class="{ 'line-through text-base-content/50': goal.isCompleted }"
              @click="toggleGoalCompletion(goal)"
            >
              {{ goal.description }}
            </span>
            <span v-if="goal.isCompleted" class="text-xs text-success">✓</span>
            <button
              class="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity text-error hover:bg-error/20"
              @click.stop="deleteGoal(goal.id)"
              :title="`Delete goal: ${goal.description}`"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card-actions justify-end mt-4 pt-2 border-t border-base-300">
        <button 
          class="btn btn-sm btn-ghost"
          @click="$emit('openMoodSelector', member.id)"
        >
          Change Mood
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TeamMemberWithGoals, Goal, MoodType } from '../types';
import { MOOD_OPTIONS, getMoodEmoji } from '../types';

interface Props {
  member: TeamMemberWithGoals;
}

interface Emits {
  (e: 'toggleGoal', goalId: number, isCompleted: boolean): void;
  (e: 'deleteGoal', goalId: number): void;
  (e: 'openMoodSelector', memberId: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const totalGoals = computed(() => props.member.goals.length);
const completedGoals = computed(() => props.member.goals.filter(g => g.isCompleted).length);

const getMoodLabel = (mood: MoodType): string => {
  return MOOD_OPTIONS.find(option => option.value === mood)?.label || 'Unknown';
};

const toggleGoalCompletion = (goal: Goal) => {
  emit('toggleGoal', goal.id, !goal.isCompleted);
};

const deleteGoal = (goalId: number) => {
  emit('deleteGoal', goalId);
};
</script>