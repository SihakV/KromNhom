using System.Data;

namespace TeamGoalTracker.Services;

public interface IDatabaseService
{
    Task<IDbConnection> GetConnectionAsync();
    Task InitializeDatabaseAsync();
}