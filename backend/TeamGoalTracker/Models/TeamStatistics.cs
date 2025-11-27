namespace TeamGoalTracker.Models;

public class TeamStatistics
{
    public int TotalGoals { get; set; }
    public int CompletedGoals { get; set; }
    public decimal CompletionPercentage { get; set; }
    public Dictionary<string, int> MoodDistribution { get; set; } = new();
    public int TeamMemberCount { get; set; }
    public DateTime LastUpdated { get; set; }
}