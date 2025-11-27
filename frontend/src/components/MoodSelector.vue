<template>
  <!-- Modal Backdrop -->
  <div class="modal modal-open">
    <div class="modal-box relative">
      <!-- Close Button -->
      <button 
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="$emit('close')"
      >
        ✕
      </button>

      <!-- Modal Header -->
      <h3 class="font-bold text-lg mb-4">
        Update Mood for {{ selectedMember?.name }}
      </h3>

      <!-- Current Mood Display -->
      <div v-if="selectedMember" class="mb-6 p-4 bg-base-200 rounded-lg">
        <div class="flex items-center gap-3">
          <span class="text-3xl">{{ getMoodEmoji(selectedMember.currentMood) }}</span>
          <div>
            <p class="font-medium">Current Mood</p>
            <p class="text-sm text-base-content/70">
              {{ getCurrentMoodLabel(selectedMember.currentMood) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Mood Selection -->
      <div class="space-y-3 mb-6">
        <h4 class="font-medium text-base-content/80">Select New Mood:</h4>
        <div class="grid grid-cols-1 gap-2">
          <button
            v-for="mood in MOOD_OPTIONS"
            :key="mood.value"
            class="btn btn-ghost justify-start gap-3 h-auto py-3"
            :class="{ 
              'btn-active': selectedMood === mood.value,
              'bg-primary/10 border-primary': selectedMood === mood.value 
            }"
            @click="selectedMood = mood.value"
          >
            <span class="text-2xl">{{ mood.emoji }}</span>
            <div class="text-left">
              <div class="font-medium">{{ mood.label }}</div>
              <div class="text-xs opacity-70">{{ mood.description }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="modal-action">
        <button 
          class="btn btn-ghost" 
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button 
          class="btn btn-primary"
          :disabled="!selectedMood || isSubmitting"
          @click="handleUpdateMood"
        >
          <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
          <span v-else>Update Mood</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../composables/useTeamStore';
import type { MoodType } from '../types';
import { MOOD_OPTIONS, getMoodEmoji } from '../types';

interface Props {
  selectedMemberId: number;
}

interface Emits {
  (e: 'moodUpdated', memberId: number, mood: MoodType): void;
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedMood = ref<MoodType | null>(null);
const isSubmitting = ref(false);

// Use team store
const { getMemberById } = useTeamStore();

const selectedMember = computed(() => 
  getMemberById(props.selectedMemberId)
);

const getCurrentMoodLabel = (mood: MoodType): string => {
  return MOOD_OPTIONS.find(option => option.value === mood)?.label || 'Unknown';
};

const handleUpdateMood = async () => {
  if (!selectedMood.value || !selectedMember.value || isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    if (!selectedMood.value || !selectedMember.value) return;
    
    emit('moodUpdated', selectedMember.value.id, selectedMood.value);
  } catch (error) {
    console.error('Error updating mood:', error);
    // Could add toast notification here
  } finally {
    isSubmitting.value = false;
  }
};
</script>