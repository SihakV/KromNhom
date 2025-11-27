/**
 * TypeScript definitions for Team Daily Goal Tracker
 * Generated from OpenAPI specification
 */

// Mood enumeration
export type MoodType = 'very-happy' | 'happy' | 'neutral' | 'sad' | 'stressed';

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
  moodDistribution: Record<string, number>;
  teamMemberCount: number;
  lastUpdated: string;
}

// Request/Response types
export interface MoodUpdateRequest {
  currentMood: MoodType;
}

export interface CreateGoalRequest {
  teamMemberId: number;
  description: string;
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

// Constants
export const MOOD_OPTIONS: { value: MoodType; label: string; description: string; emoji: string }[] = [
  { value: 'very-happy', label: 'Very Happy', description: 'Excited and energetic', emoji: '😀' },
  { value: 'happy', label: 'Happy', description: 'Content and positive', emoji: '😊' },
  { value: 'neutral', label: 'Neutral', description: 'Neither good nor bad', emoji: '😐' },
  { value: 'sad', label: 'Sad', description: 'Feeling down', emoji: '😞' },
  { value: 'stressed', label: 'Stressed', description: 'Frustrated or overwhelmed', emoji: '😤' }
];

// Helper function to get emoji from mood type
export const getMoodEmoji = (mood: MoodType): string => {
  return MOOD_OPTIONS.find(option => option.value === mood)?.emoji || '😐';
};

// API endpoints configuration
export const API_ENDPOINTS = {
  TEAM_MEMBERS: '/api/teammembers',
  MOOD_UPDATE: (id: number) => `/api/teammembers/${id}/mood`,
  GOALS: '/api/goals',
  COMPLETE_GOAL: (id: number) => `/api/goals/${id}/complete`,
  DELETE_GOAL: (id: number) => `/api/goals/${id}`,
  STATISTICS: '/api/stats'
} as const;