namespace TeamGoalTracker.Models;

public static class MoodType
{
    public const string VeryHappy = "very-happy";
    public const string Happy = "happy";
    public const string Neutral = "neutral";
    public const string Sad = "sad";
    public const string Stressed = "stressed";

    public static readonly string[] AllMoods = 
    {
        VeryHappy,
        Happy,
        Neutral,
        Sad,
        Stressed
    };

    public static bool IsValid(string mood)
    {
        return AllMoods.Contains(mood);
    }
}