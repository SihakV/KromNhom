using Microsoft.Data.SqlClient;
using System.Data;

namespace TeamGoalTracker.Services;

public class DatabaseService : IDatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Server=localhost,1433;Database=TeamGoalTracker;User Id=sa;Password=MyStrongPassword123!;TrustServerCertificate=true;";
    }

    public async Task<IDbConnection> GetConnectionAsync()
    {
        var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        return connection;
    }

    public async Task InitializeDatabaseAsync()
    {
        try
        {
            using var connection = await GetConnectionAsync();
            
            // Read and execute database schema
            var schemaPath = Path.Combine(Directory.GetCurrentDirectory(), "database.sql");
            if (File.Exists(schemaPath))
            {
                var schema = await File.ReadAllTextAsync(schemaPath);
                var commands = schema.Split(new[] { "GO" }, StringSplitOptions.RemoveEmptyEntries);
                
                foreach (var command in commands)
                {
                    if (!string.IsNullOrWhiteSpace(command))
                    {
                        using var cmd = (SqlCommand)connection.CreateCommand();
                        cmd.CommandText = command.Trim();
                        try
                        {
                            await cmd.ExecuteNonQueryAsync();
                        }
                        catch (Exception ex)
                        {
                            // Ignore table already exists errors
                            if (!ex.Message.Contains("already exists") && !ex.Message.Contains("duplicate"))
                            {
                                Console.WriteLine($"Database initialization warning: {ex.Message}");
                            }
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database initialization error: {ex.Message}");
        }
    }
}