import axios from 'axios';
import { 
  TeamMemberWithGoals, 
  TeamStatistics, 
  Goal,
  CreateGoalRequest, 
  MoodUpdateRequest,
  ApiResponse,
  API_ENDPOINTS 
} from '../types';

const API_BASE_URL = 'http://localhost:5082';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle API responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const api = {
  // Team Members endpoints
  async getTeamMembers(): Promise<TeamMemberWithGoals[]> {
    const response = await apiClient.get<ApiResponse<TeamMemberWithGoals[]>>(API_ENDPOINTS.TEAM_MEMBERS);
    return response.data.data || [];
  },

  async updateMood(teamMemberId: number, mood: MoodUpdateRequest): Promise<boolean> {
    const response = await apiClient.put<ApiResponse<boolean>>(
      API_ENDPOINTS.MOOD_UPDATE(teamMemberId),
      mood
    );
    return response.data.success;
  },

  // Goals endpoints
  async createGoal(goalRequest: CreateGoalRequest): Promise<Goal> {
    const response = await apiClient.post<ApiResponse<Goal>>(API_ENDPOINTS.GOALS, goalRequest);
    return response.data.data!;
  },

  async completeGoal(goalId: number, isCompleted: boolean): Promise<boolean> {
    const response = await apiClient.put<ApiResponse<boolean>>(
      API_ENDPOINTS.COMPLETE_GOAL(goalId),
      { isCompleted }
    );
    return response.data.success;
  },

  async deleteGoal(goalId: number): Promise<boolean> {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      API_ENDPOINTS.DELETE_GOAL(goalId)
    );
    return response.data.success;
  },

  // Statistics endpoint
  async getStatistics(): Promise<TeamStatistics | null> {
    try {
      const response = await apiClient.get<ApiResponse<TeamStatistics>>(API_ENDPOINTS.STATISTICS);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return null;
    }
  },
};

export default api;