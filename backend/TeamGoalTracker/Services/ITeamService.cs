using TeamGoalTracker.Models;

namespace TeamGoalTracker.Services;

public interface ITeamService
{
    Task<List<TeamMemberWithGoals>> GetAllTeamMembersAsync();
    Task<TeamMember?> GetTeamMemberAsync(int id);
    Task<bool> UpdateMoodAsync(int teamMemberId, string mood);
    Task<Goal> CreateGoalAsync(CreateGoalRequest request);
    Task<bool> CompleteGoalAsync(int goalId, bool isCompleted);
    Task<bool> DeleteGoalAsync(int goalId);
    Task<TeamMember> CreateTeamMemberAsync(CreateTeamMemberRequest request);
    Task<bool> DeleteTeamMemberAsync(int teamMemberId);
    Task<TeamStatistics> GetTeamStatisticsAsync();
}