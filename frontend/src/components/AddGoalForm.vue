<template>
  <div class="fixed bottom-6 right-6 z-10">
    <!-- FAB Speed Dial - first button is for transition animation -->
    <div class="fab fab-flower">
      <!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
      <div tabindex="0" role="button" class="btn btn-lg btn-primary btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- First button is used for animation transition - make it invisible -->
      <button class="btn btn-lg btn-circle" style="opacity: 0; pointer-events: none;"></button>
      
      <!-- Actual speed dial buttons -->
      <div class="tooltip tooltip-left" data-tip="Add Goal">
        <button class="btn btn-lg btn-circle btn-secondary" @click="openGoalForm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <div class="tooltip tooltip-left" data-tip="Add Team Member">
        <button class="btn btn-lg btn-circle btn-accent" @click="openMemberForm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Goal Form Modal -->
    <Transition name="modal">
      <div 
        v-if="showGoalForm"
        class="card bg-base-100 shadow-xl border border-base-300 w-80 transform-gpu absolute bottom-20 right-20 origin-bottom-right"
      >
        <div class="card-body p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="card-title text-lg font-sans">Add New Goal</h3>
            <button 
              class="btn btn-sm btn-ghost btn-circle focus:outline-none focus:ring-2 focus:ring-base-300"
              @click="closeGoalForm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleGoalSubmit" class="space-y-4">
            <!-- Team Member Selection -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Team Member</span>
              </label>
              <select 
                v-model="goalForm.teamMemberId" 
                class="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary !outline-none"
                style="outline: none !important; box-shadow: none !important;"
                required
              >
                <option value="">Select team member</option>
                <option 
                  v-for="member in teamMembers"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                </option>
              </select>
            </div>

            <!-- Goal Description -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Goal Description</span>
              </label>
              <textarea 
                v-model="goalForm.description"
                class="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="What needs to be accomplished today?"
                rows="3"
                maxlength="200"
                required
              ></textarea>
              <label class="label">
                <span class="label-text-alt">{{ goalForm.description.length }}/200</span>
              </label>
            </div>

            <!-- Submit Button -->
            <div class="card-actions justify-end pt-2">
              <button 
                type="button" 
                class="btn btn-ghost btn-sm focus:outline-none focus:ring-2 focus:ring-base-300"
                @click="closeGoalForm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary btn-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                :disabled="isGoalSubmitting || !isGoalFormValid"
              >
                <span v-if="isGoalSubmitting" class="loading loading-spinner loading-xs"></span>
                <span v-else>Add Goal</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Member Form Modal -->
    <Transition name="modal">
      <div 
        v-if="showMemberForm"
        class="card bg-base-100 shadow-xl border border-base-300 w-80 transform-gpu absolute bottom-20 right-20 origin-bottom-right"
      >
        <div class="card-body p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="card-title text-lg font-sans">Add Team Member</h3>
            <button 
              class="btn btn-sm btn-ghost btn-circle focus:outline-none focus:ring-2 focus:ring-base-300"
              @click="closeMemberForm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleMemberSubmit" class="space-y-4">
            <!-- Member Name -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Full Name</span>
              </label>
              <input 
                v-model="memberForm.name"
                type="text"
                class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Enter team member's name"
                maxlength="100"
                required
              />
            </div>

            <!-- Initial Mood -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Initial Mood</span>
              </label>
              <select 
                v-model="memberForm.currentMood" 
                class="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent !outline-none"
                style="outline: none !important; box-shadow: none !important;"
                required
              >
                <option 
                  v-for="mood in moodOptions"
                  :key="mood.value"
                  :value="mood.value"
                >
                  {{ mood.emoji }} {{ mood.label }}
                </option>
              </select>
            </div>

            <!-- Submit Button -->
            <div class="card-actions justify-end pt-2">
              <button 
                type="button" 
                class="btn btn-ghost btn-sm focus:outline-none focus:ring-2 focus:ring-base-300"
                @click="closeMemberForm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-accent btn-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50"
                :disabled="isMemberSubmitting || !isMemberFormValid"
              >
                <span v-if="isMemberSubmitting" class="loading loading-spinner loading-xs"></span>
                <span v-else>Add Member</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useTeamStore } from '../composables/useTeamStore';
import type { CreateGoalRequest, MoodType } from '../types';
import { MOOD_OPTIONS } from '../types';

interface CreateMemberRequest {
  name: string;
  currentMood: MoodType;
}

interface Emits {
  (e: 'goalAdded', goal: CreateGoalRequest): void;
  (e: 'memberAdded', member: CreateMemberRequest): void;
}

const emit = defineEmits<Emits>();

// Get team members from the store
const teamStore = useTeamStore();
const { teamMembers } = teamStore;

// DaisyUI FAB handles open/close state automatically

// Form states
const showGoalForm = ref(false);
const showMemberForm = ref(false);
const isGoalSubmitting = ref(false);
const isMemberSubmitting = ref(false);

// Goal form data
const goalForm = reactive({
  teamMemberId: '',
  description: ''
});

// Member form data
const memberForm = reactive({
  name: '',
  currentMood: 'neutral' as MoodType
});

// Mood options for member form
const moodOptions = MOOD_OPTIONS;

// Computed properties
const isGoalFormValid = computed(() => {
  return goalForm.teamMemberId !== '' && 
         goalForm.description.trim().length >= 5 &&
         goalForm.description.trim().length <= 200;
});

const isMemberFormValid = computed(() => {
  return memberForm.name.trim().length >= 2 && 
         memberForm.name.trim().length <= 100 &&
         memberForm.currentMood !== '';
});

// Speed dial methods  
const toggleSpeedDial = () => {
  // DaisyUI FAB handles toggle automatically, we just need to close forms if open
  if (showGoalForm.value || showMemberForm.value) {
    closeAllForms();
  }
};

const openGoalForm = () => {
  // Close any other open modals first
  showMemberForm.value = false;
  resetMemberForm();
  
  // Open goal form
  showGoalForm.value = true;
};

const openMemberForm = () => {
  // Close any other open modals first
  showGoalForm.value = false;
  resetGoalForm();
  
  // Open member form
  showMemberForm.value = true;
};

// Form methods
const resetGoalForm = () => {
  goalForm.teamMemberId = '';
  goalForm.description = '';
};

const resetMemberForm = () => {
  memberForm.name = '';
  memberForm.currentMood = 'neutral';
};

const closeGoalForm = () => {
  showGoalForm.value = false;
  resetGoalForm();
};

const closeMemberForm = () => {
  showMemberForm.value = false;
  resetMemberForm();
};

const closeAllForms = () => {
  showGoalForm.value = false;
  showMemberForm.value = false;
  resetGoalForm();
  resetMemberForm();
};

const handleGoalSubmit = async () => {
  if (!isGoalFormValid.value || isGoalSubmitting.value) return;

  try {
    isGoalSubmitting.value = true;

    const goalRequest: CreateGoalRequest = {
      teamMemberId: Number(goalForm.teamMemberId),
      description: goalForm.description.trim()
    };

    emit('goalAdded', goalRequest);
    closeGoalForm();
  } catch (error) {
    console.error('Error creating goal:', error);
  } finally {
    isGoalSubmitting.value = false;
  }
};

const handleMemberSubmit = async () => {
  if (!isMemberFormValid.value || isMemberSubmitting.value) return;

  try {
    isMemberSubmitting.value = true;

    const memberRequest: CreateMemberRequest = {
      name: memberForm.name.trim(),
      currentMood: memberForm.currentMood
    };

    emit('memberAdded', memberRequest);
    closeMemberForm();
  } catch (error) {
    console.error('Error creating member:', error);
  } finally {
    isMemberSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Floating Action Button Animation */
.fab-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s; /* Slight delay to appear after modal closes */
}

.fab-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.fab-enter-from, .fab-leave-to {
  transform: scale(0) rotate(45deg);
  opacity: 0;
}

.fab-enter-to, .fab-leave-from {
  transform: scale(1) rotate(0deg);
  opacity: 1;
}

/* Modal Animation */
.modal-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.modal-enter-from {
  transform: scale(0.7) translateY(10px);
  opacity: 0;
}

.modal-leave-to {
  transform: scale(0.8) translateY(-5px);
  opacity: 0;
}

.modal-enter-to, .modal-leave-from {
  transform: scale(1) translateY(0px);
  opacity: 1;
}

/* Remove default browser outlines and add custom focus styles */
button:focus,
select:focus,
textarea:focus,
input:focus,
button:active,
select:active,
textarea:active,
input:active,
button:focus-visible,
select:focus-visible,
textarea:focus-visible,
input:focus-visible {
  outline: none !important;
  outline-width: 0 !important;
  outline-style: none !important;
  outline-color: transparent !important;
}

/* Specifically target the select element in this component */
.select {
  outline: none !important;
  box-shadow: none !important;
}

.select:focus {
  outline: none !important;
  box-shadow: 0 0 0 2px hsl(var(--p)) !important;
  border-color: hsl(var(--p)) !important;
}



/* Ensure no CSS conflicts with DaisyUI FAB */
.fab.fab-flower {
  /* Let DaisyUI handle all positioning */
}

/* Remove any conflicting styles */
.fab * {
  /* Reset any inherited positioning */
  position: static !important;
}

.fab .btn {
  /* Ensure buttons don't have conflicting positioning */
  position: relative !important;
}
</style>