-- Team Daily Goal Tracker Database Schema
-- SQL Server version

-- Create database (run this manually if needed)
-- CREATE DATABASE TeamGoalTracker;
-- GO
-- USE TeamGoalTracker;
-- GO

-- TeamMembers table
CREATE TABLE TeamMembers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    CurrentMood VARCHAR(20) NOT NULL DEFAULT 'neutral',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Goals table
CREATE TABLE Goals (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TeamMemberId INT NOT NULL,
    Description NVARCHAR(500) NOT NULL,
    IsCompleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CompletedAt DATETIME2 NULL,
    FOREIGN KEY (TeamMemberId) REFERENCES TeamMembers(Id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE NONCLUSTERED INDEX IX_Goals_TeamMemberId ON Goals(TeamMemberId);
CREATE INDEX IX_Goals_IsCompleted ON Goals(IsCompleted);
CREATE INDEX IX_TeamMembers_Name ON TeamMembers(Name);

-- Sample data
INSERT INTO TeamMembers (Name, CurrentMood) VALUES 
('Alice Johnson', 'very-happy'),
('Bob Smith', 'happy'),
('Carol Davis', 'neutral'),
('David Wilson', 'sad');

-- Sample goals
INSERT INTO Goals (TeamMemberId, Description, IsCompleted) VALUES 
(1, 'Complete user authentication module', 0),
(1, 'Review pull request #123', 1),
(2, 'Fix payment gateway bug', 0),
(2, 'Update API documentation', 0),
(3, 'Implement dashboard analytics', 0),
(4, 'Setup CI/CD pipeline', 1);