namespace TeamGoalTracker.Models;

public class TeamMemberWithGoals : TeamMember
{
    public List<Goal> Goals { get; set; } = new();
}

public class MoodUpdateRequest
{
    public string CurrentMood { get; set; } = string.Empty;
}

public class CreateGoalRequest
{
    public int TeamMemberId { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class ApiResponse<T>
{
    public bool Success { get; set; } = true;
    public T? Data { get; set; }
    public string Message { get; set; } = string.Empty;
}