using Dapper;
using TeamGoalTracker.Models;

namespace TeamGoalTracker.Services;

public class TeamService : ITeamService
{
    private readonly IDatabaseService _databaseService;

    public TeamService(IDatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public async Task<List<TeamMemberWithGoals>> GetAllTeamMembersAsync()
    {
        using var connection = await _databaseService.GetConnectionAsync();
        
        var sql = @"
            SELECT tm.Id, tm.Name, tm.CurrentMood, tm.CreatedAt, tm.UpdatedAt,
                   g.Id, g.TeamMemberId, g.Description, g.IsCompleted, g.CreatedAt, g.CompletedAt
            FROM TeamMembers tm
            LEFT JOIN Goals g ON tm.Id = g.TeamMemberId
            ORDER BY tm.Name, g.CreatedAt";

        var teamMemberDict = new Dictionary<int, TeamMemberWithGoals>();

        await connection.QueryAsync<TeamMember, Goal, TeamMemberWithGoals>(
            sql,
            (teamMember, goal) =>
            {
                if (!teamMemberDict.TryGetValue(teamMember.Id, out var teamMemberWithGoals))
                {
                    teamMemberWithGoals = new TeamMemberWithGoals
                    {
                        Id = teamMember.Id,
                        Name = teamMember.Name,
                        CurrentMood = teamMember.CurrentMood,
                        CreatedAt = teamMember.CreatedAt,
                        UpdatedAt = teamMember.UpdatedAt,
                        Goals = new List<Goal>()
                    };
                    teamMemberDict.Add(teamMember.Id, teamMemberWithGoals);
                }

                if (goal?.Id > 0)
                {
                    teamMemberWithGoals.Goals.Add(goal);
                }

                return teamMemberWithGoals;
            },
            splitOn: "Id"
        );

        return teamMemberDict.Values.ToList();
    }

    public async Task<TeamMember?> GetTeamMemberAsync(int id)
    {
        using var connection = await _databaseService.GetConnectionAsync();
        
        var sql = "SELECT * FROM TeamMembers WHERE Id = @Id";
        return await connection.QueryFirstOrDefaultAsync<TeamMember>(sql, new { Id = id });
    }

    public async Task<bool> UpdateMoodAsync(int teamMemberId, string mood)
    {
        using var connection = await _databaseService.GetConnectionAsync();
        
        var sql = @"
            UPDATE TeamMembers 
            SET CurrentMood = @Mood, UpdatedAt = GETUTCDATE() 
            WHERE Id = @TeamMemberId";
        
        var affectedRows = await connection.ExecuteAsync(sql, new { Mood = mood, TeamMemberId = teamMemberId });
        return affectedRows > 0;
    }

    public async Task<Goal> CreateGoalAsync(CreateGoalRequest request)
    {
        using var connection = await _databaseService.GetConnectionAsync();
        
        var sql = @"
            INSERT INTO Goals (TeamMemberId, Description, IsCompleted, CreatedAt)
            VALUES (@TeamMemberId, @Description, 0, GETUTCDATE());
            SELECT CAST(SCOPE_IDENTITY() as int);";
        
        var goalId = await connection.QuerySingleAsync<int>(sql, request);
        
        return new Goal
        {
            Id = goalId,
            TeamMemberId = request.TeamMemberId,
            Description = request.Description,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };
    }

    public async Task<bool> CompleteGoalAsync(int goalId, bool isCompleted)
    {
        using var connection = await _databaseService.GetConnectionAsync();
        
        var sql = @"
            UPDATE Goals 
            SET IsCompleted = @IsCompleted, 
                CompletedAt = CASE WHEN @IsCompleted = 1 THEN GETUTCDATE() ELSE NULL END
            WHERE Id = @GoalId";
        
        var affectedRows = await connection.ExecuteAsync(sql, new { IsCompleted = isCompleted, GoalId = goalId });
        return affectedRows > 0;
    }

    public async Task<bool> DeleteGoalAsync(int goalId)
    {
        using var connection = await _databaseService.GetConnectionAsync();
        
        var sql = "DELETE FROM Goals WHERE Id = @GoalId";
        
        var affectedRows = await connection.ExecuteAsync(sql, new { GoalId = goalId });
        return affectedRows > 0;
    }

    public async Task<TeamStatistics> GetTeamStatisticsAsync()
    {
        using var connection = await _databaseService.GetConnectionAsync();
        
        var goalStatsQuery = @"
            SELECT 
                COUNT(*) as TotalGoals,
                ISNULL(SUM(CASE WHEN IsCompleted = 1 THEN 1 ELSE 0 END), 0) as CompletedGoals
            FROM Goals";
        
        var moodStatsQuery = @"
            SELECT CurrentMood, COUNT(*) as Count
            FROM TeamMembers
            GROUP BY CurrentMood";
        
        var memberCountQuery = "SELECT COUNT(*) FROM TeamMembers";

        var goalStats = await connection.QuerySingleAsync(goalStatsQuery);
        var moodStats = await connection.QueryAsync(moodStatsQuery);
        var memberCount = await connection.QuerySingleAsync<int>(memberCountQuery);

        var totalGoals = goalStats.TotalGoals != null ? (int)goalStats.TotalGoals : 0;
        var completedGoals = goalStats.CompletedGoals != null ? (int)goalStats.CompletedGoals : 0;
        var completionPercentage = totalGoals > 0 ? (decimal)completedGoals / totalGoals * 100 : 0;

        var moodDistribution = new Dictionary<string, int>();
        foreach (var mood in moodStats)
        {
            var moodKey = mood.CurrentMood?.ToString() ?? "unknown";
            var count = mood.Count != null ? (int)mood.Count : 0;
            moodDistribution[moodKey] = count;
        }

        return new TeamStatistics
        {
            TotalGoals = totalGoals,
            CompletedGoals = completedGoals,
            CompletionPercentage = Math.Round(completionPercentage, 1),
            MoodDistribution = moodDistribution,
            TeamMemberCount = memberCount,
            LastUpdated = DateTime.UtcNow
        };
    }
}