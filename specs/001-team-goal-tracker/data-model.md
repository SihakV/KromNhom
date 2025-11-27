# Data Model: Team Daily Goal Tracker

**Date**: 2025-11-26  
**Phase**: 1 - Design

## Core Entities

### TeamMember

Represents an individual team member with their current mood status.

**Fields**:
- `Id` (int, primary key) - Unique identifier
- `Name` (string, required, max 50 chars) - Team member display name
- `CurrentMood` (string, required) - Current mood emoji (😀 😊 😐 😞 😤)
- `CreatedAt` (DateTime) - Record creation timestamp
- `UpdatedAt` (DateTime) - Last modification timestamp

**Relationships**:
- One-to-many with Goal (one member can have multiple goals)

**Validation Rules**:
- Name must be unique across team members
- Name cannot be empty or whitespace
- CurrentMood must be one of the predefined mood values
- Default mood is neutral (😐) for new members

**State Transitions**:
- Mood can be updated at any time to any valid mood emoji
- Name can be modified but must remain unique

### Goal

Represents a daily goal assigned to a team member with completion tracking.

**Fields**:
- `Id` (int, primary key) - Unique identifier
- `TeamMemberId` (int, foreign key) - References TeamMember.Id
- `Description` (string, required, max 200 chars) - Goal description text
- `IsCompleted` (bool, default false) - Completion status
- `CreatedAt` (DateTime) - Goal creation timestamp
- `CompletedAt` (DateTime, nullable) - Goal completion timestamp

**Relationships**:
- Many-to-one with TeamMember (multiple goals belong to one member)

**Validation Rules**:
- Description cannot be empty or whitespace
- TeamMemberId must reference existing team member
- CompletedAt can only be set when IsCompleted is true
- Duplicate descriptions allowed (same goal can exist for different members)

**State Transitions**:
- Goal starts as incomplete (IsCompleted = false)
- Can be marked complete (IsCompleted = true, CompletedAt = current timestamp)
- Can be unmarked as complete (IsCompleted = false, CompletedAt = null)
- Goals can be deleted at any time

### Mood (Enumeration)

Predefined emotional states represented by emojis for team morale tracking.

**Values**:
- `Happy` = "😀" - Very positive mood
- `Content` = "😊" - Positive mood  
- `Neutral` = "😐" - Neither positive nor negative
- `Sad` = "😞" - Negative mood
- `Stressed` = "😤" - Very negative/frustrated mood

**Usage**:
- Stored as string values in TeamMember.CurrentMood
- Used in UI for mood selection and display
- Used in statistics calculation for mood distribution

### TeamStatistics (Computed)

Aggregated data showing team-wide goal completion rates and mood distribution.

**Fields** (all computed, not persisted):
- `TotalGoals` (int) - Sum of all goals across team members
- `CompletedGoals` (int) - Sum of completed goals across team members  
- `CompletionPercentage` (decimal) - (CompletedGoals / TotalGoals) * 100
- `MoodDistribution` (Dictionary<string, int>) - Count of each mood across team members
- `TeamMemberCount` (int) - Total number of team members
- `LastUpdated` (DateTime) - Timestamp of statistics calculation

**Calculation Logic**:
- Recalculated on every request (no caching for simplicity)
- CompletionPercentage returns 0 if TotalGoals is 0
- MoodDistribution includes count for each of the 5 mood types

## Database Schema

### TeamMembers Table (SQL Server)
```sql
CREATE TABLE TeamMembers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    CurrentMood NVARCHAR(10) NOT NULL DEFAULT '😐',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

### Goals Table (SQL Server)
```sql
CREATE TABLE Goals (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TeamMemberId INT NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    IsCompleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CompletedAt DATETIME2 NULL,
    FOREIGN KEY (TeamMemberId) REFERENCES TeamMembers(Id) ON DELETE CASCADE
);
```

### Indexes (SQL Server)
```sql
CREATE NONCLUSTERED INDEX IX_Goals_TeamMemberId ON Goals(TeamMemberId);
CREATE INDEX IX_Goals_IsCompleted ON Goals(IsCompleted);
CREATE INDEX IX_TeamMembers_Name ON TeamMembers(Name);
```

## Sample Data

### Initial Team Members
```sql
INSERT INTO TeamMembers (Name, CurrentMood) VALUES 
('Alice Johnson', '😊'),
('Bob Smith', '😐'),
('Carol Davis', '😀'),
('Dave Wilson', '😞');
```

### Sample Goals
```sql
INSERT INTO Goals (TeamMemberId, Description, IsCompleted) VALUES
(1, 'Complete user authentication module', 1),
(1, 'Write unit tests for login service', 0),
(1, 'Review pull requests from team', 0),
(2, 'Design database schema for reports', 1),
(2, 'Implement report generation API', 0),
(3, 'Fix critical bug in payment processor', 1),
(3, 'Update deployment documentation', 1),
(4, 'Research performance optimization tools', 0),
(4, 'Conduct code review session', 0);
```

## Data Access Patterns

### Read Operations
- **Dashboard View**: Join TeamMembers with Goals to get complete team status
- **Statistics**: Aggregate queries across Goals and TeamMembers tables
- **Single Member**: Select TeamMember with related Goals

### Write Operations  
- **Add Goal**: Insert into Goals table with validation
- **Update Mood**: Update TeamMember.CurrentMood and UpdatedAt
- **Complete Goal**: Update Goal.IsCompleted and CompletedAt
- **Delete Goal**: Delete from Goals table (cascading deletes handled by FK)

### Performance Considerations
- Indexes on foreign keys and frequently queried columns
- Small dataset size (10+ members, 5 goals each) requires no optimization
- Real-time updates use simple polling (no WebSocket complexity for 45-minute constraint)