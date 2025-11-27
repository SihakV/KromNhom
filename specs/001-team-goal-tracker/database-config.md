# Database Configuration: SQL Server on Docker

**Container**: `teamgoal-sqlserver`  
**Created**: 2025-11-26  
**Status**: ✅ Running

## Connection Details

### Docker Container
```bash
# Container already started with:
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=MyStrongPassword123!" -p 1433:1433 --name teamgoal-sqlserver -d mcr.microsoft.com/mssql/server:2022-latest

# Verify container is running:
docker ps

# Check container logs if needed:
docker logs teamgoal-sqlserver
```

### Connection String (.NET)
```csharp
// For appsettings.json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=TeamGoalTracker;User Id=sa;Password=MyStrongPassword123!;TrustServerCertificate=true;"
}

// For DatabaseService.cs
private readonly string _connectionString = "Server=localhost,1433;Database=TeamGoalTracker;User Id=sa;Password=MyStrongPassword123!;TrustServerCertificate=true;";
```

### Database Credentials
- **Server**: `localhost,1433`
- **Database**: `TeamGoalTracker` (will be created by application)
- **Username**: `sa`
- **Password**: `MyStrongPassword123!`
- **SSL**: `TrustServerCertificate=true` (for local development)

## Database Initialization

### 1. Create Database
```sql
CREATE DATABASE TeamGoalTracker;
```

### 2. Use Database
```sql
USE TeamGoalTracker;
```

### 3. Create Schema (from data-model.md)
```sql
CREATE TABLE TeamMembers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    CurrentMood NVARCHAR(10) NOT NULL DEFAULT '😐',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE TABLE Goals (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TeamMemberId INT NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    IsCompleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CompletedAt DATETIME2 NULL,
    FOREIGN KEY (TeamMemberId) REFERENCES TeamMembers(Id) ON DELETE CASCADE
);

CREATE NONCLUSTERED INDEX IX_Goals_TeamMemberId ON Goals(TeamMemberId);
```

### 4. Seed Test Data
```sql
-- Insert sample team members
INSERT INTO TeamMembers (Name, CurrentMood) VALUES 
('Alice Johnson', '😀'),
('Bob Smith', '😊'),
('Carol Davis', '😐'),
('David Wilson', '😞');

-- Insert sample goals
INSERT INTO Goals (TeamMemberId, Description, IsCompleted) VALUES 
(1, 'Complete user authentication module', 0),
(1, 'Review pull request #123', 1),
(2, 'Fix payment gateway bug', 0),
(2, 'Update API documentation', 0),
(3, 'Implement dashboard analytics', 0),
(4, 'Setup CI/CD pipeline', 1);
```

## Connection Testing

### Using SQL Server Management Studio (SSMS)
- **Server name**: `localhost,1433`
- **Authentication**: SQL Server Authentication
- **Login**: `sa`
- **Password**: `MyStrongPassword123!`

### Using Azure Data Studio
- **Connection type**: Microsoft SQL Server
- **Server**: `localhost,1433`
- **Authentication type**: SQL Login
- **User name**: `sa`
- **Password**: `MyStrongPassword123!`

### Using .NET Connection Test
```csharp
using Microsoft.Data.SqlClient;

var connectionString = "Server=localhost,1433;Database=master;User Id=sa;Password=MyStrongPassword123!;TrustServerCertificate=true;";
using var connection = new SqlConnection(connectionString);
await connection.OpenAsync();
Console.WriteLine("Connection successful!");
```

## Container Management

### Start Container
```bash
docker start teamgoal-sqlserver
```

### Stop Container
```bash
docker stop teamgoal-sqlserver
```

### Remove Container (if needed)
```bash
docker rm -f teamgoal-sqlserver
```

### View Container Status
```bash
docker ps -a | grep teamgoal
```

## Notes

- Container persists data until explicitly removed
- Default SQL Server port 1433 is mapped to host
- Use `TrustServerCertificate=true` for local development
- Database `TeamGoalTracker` will be created by application startup
- SA password meets SQL Server complexity requirements