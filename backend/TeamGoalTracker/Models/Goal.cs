namespace TeamGoalTracker.Models;

public class Goal
{
    public int Id { get; set; }
    public int TeamMemberId { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}