namespace TeamGoalTracker.Models;

public class CreateTeamMemberRequest
{
    public string Name { get; set; } = string.Empty;
    public string CurrentMood { get; set; } = "neutral";
}