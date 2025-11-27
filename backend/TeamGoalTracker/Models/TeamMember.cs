namespace TeamGoalTracker.Models;

public class TeamMember
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CurrentMood { get; set; } = "neutral";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}