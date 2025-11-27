/**
 * TypeScript definitions for Team Daily Goal Tracker
 * Generated from OpenAPI specification
 */

// Mood enumeration
export type MoodType = '😀' | '😊' | '😐' | '😞' | '😤';

// Core entities
export interface TeamMember {
  id: number;
  name: string;
  currentMood: MoodType;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: number;
  teamMemberId: number;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface TeamMemberWithGoals extends TeamMember {
  goals: Goal[];
}

export interface TeamStatistics {
  totalGoals: number;
  completedGoals: number;
  completionPercentage: number;
  moodDistribution: Record<MoodType, number>;
  teamMemberCount: number;
  lastUpdated: string;
}

// Request/Response types
export interface MoodUpdateRequest {
  mood: MoodType;
}

export interface CreateGoalRequest {
  teamMemberId: number;
  description: string;
}

export interface CompleteGoalRequest {
  isCompleted: boolean;
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Error response type
export interface ApiError {
  error: string;
  details?: string[];
}

// UI State types
export interface TeamDashboardState {
  teamMembers: TeamMemberWithGoals[];
  statistics: TeamStatistics | null;
  loading: boolean;
  error: string | null;
}

export interface AddGoalFormState {
  selectedMemberId: number | null;
  description: string;
  isSubmitting: boolean;
}

export interface MoodSelectorState {
  selectedMemberId: number | null;
  selectedMood: MoodType | null;
  isSubmitting: boolean;
}

// Constants
export const MOOD_OPTIONS: { value: MoodType; label: string; description: string }[] = [
  { value: '😀', label: 'Very Happy', description: 'Excited and energetic' },
  { value: '😊', label: 'Happy', description: 'Content and positive' },
  { value: '😐', label: 'Neutral', description: 'Neither good nor bad' },
  { value: '😞', label: 'Sad', description: 'Feeling down' },
  { value: '😤', label: 'Stressed', description: 'Frustrated or overwhelmed' }
];

// API endpoints configuration
export const API_ENDPOINTS = {
  TEAM_MEMBERS: '/api/teammembers',
  MOOD_UPDATE: (id: number) => `/api/teammembers/${id}/mood`,
  GOALS: '/api/goals',
  COMPLETE_GOAL: (id: number) => `/api/goals/${id}/complete`,
  DELETE_GOAL: (id: number) => `/api/goals/${id}`,
  STATISTICS: '/api/stats'
} as const;

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncOperation<T> {
  state: LoadingState;
  data: T | null;
  error: string | null;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
}

// Event payload types for component communication
export interface GoalCompletedEvent {
  goalId: number;
  isCompleted: boolean;
  teamMemberId: number;
}

export interface MoodUpdatedEvent {
  teamMemberId: number;
  newMood: MoodType;
}

export interface GoalAddedEvent {
  goal: Goal;
}

export interface GoalDeletedEvent {
  goalId: number;
  teamMemberId: number;
}

// Component prop types
export interface TeamMemberCardProps {
  member: TeamMemberWithGoals;
  onGoalComplete: (event: GoalCompletedEvent) => void;
  onGoalDelete: (event: GoalDeletedEvent) => void;
  onMoodUpdate: (event: MoodUpdatedEvent) => void;
}

export interface TeamStatsProps {
  statistics: TeamStatistics | null;
  loading: boolean;
}

export interface AddGoalFormProps {
  teamMembers: TeamMember[];
  onGoalAdd: (event: GoalAddedEvent) => void;
}

export interface MoodSelectorProps {
  teamMembers: TeamMember[];
  onMoodUpdate: (event: MoodUpdatedEvent) => void;
}