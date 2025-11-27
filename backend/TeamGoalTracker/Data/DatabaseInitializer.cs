using TeamGoalTracker.Services;

namespace TeamGoalTracker.Data;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(IDatabaseService databaseService)
    {
        await databaseService.InitializeDatabaseAsync();
    }
}