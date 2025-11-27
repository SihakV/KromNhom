# Quick Start: Team Daily Goal Tracker

**Development Timeline**: 45 minutes  
**Target**: Working full-stack application with Vue 3 + .NET 8

## Prerequisites

- Node.js 18+ with npm
- .NET 8 SDK
- Git (for project initialization)
- Code editor (VS Code recommended)

## 45-Minute Development Plan

### Phase 1: Project Setup (0-10 minutes)

#### Backend Setup (5 minutes)
```bash
# Create and setup .NET Web API project
mkdir backend
cd backend
dotnet new webapi -n TeamGoalTracker
cd TeamGoalTracker

# Add required packages
dotnet add package Microsoft.Data.Sqlite
dotnet add package Dapper
dotnet add package Microsoft.AspNetCore.Cors

# Run to verify setup
dotnet run
```

#### Frontend Setup (5 minutes)
```bash
# Create Vue 3 TypeScript project
cd ../..
npm create vue@latest frontend
cd frontend

# Select: TypeScript=Yes, Router=No, Testing=Vitest, Others=No

# Add DaisyUI and Tailwind
npm install -D tailwindcss postcss autoprefixer daisyui
npm install axios

# Initialize Tailwind
npx tailwindcss init -p

# Run to verify setup
npm run dev
```

### Phase 2: Database & Backend Core (10-20 minutes)

#### Database Schema (2 minutes)
Create `backend/TeamGoalTracker/database.sql`:
```sql
-- From data-model.md
CREATE TABLE TeamMembers (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL UNIQUE,
    CurrentMood TEXT NOT NULL DEFAULT '😐',
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    UpdatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE Goals (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    TeamMemberId INTEGER NOT NULL,
    Description TEXT NOT NULL,
    IsCompleted BOOLEAN NOT NULL DEFAULT 0,
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    CompletedAt TEXT NULL,
    FOREIGN KEY (TeamMemberId) REFERENCES TeamMembers(Id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO TeamMembers (Name, CurrentMood) VALUES 
('Alice Johnson', '😊'), ('Bob Smith', '😐'), ('Carol Davis', '😀'), ('Dave Wilson', '😞');

INSERT INTO Goals (TeamMemberId, Description, IsCompleted) VALUES
(1, 'Complete user authentication module', 1),
(1, 'Write unit tests for login service', 0),
(2, 'Design database schema for reports', 1),
(2, 'Implement report generation API', 0);
```

#### Models (3 minutes)
Create models in `Models/` directory following data-model.md structure.

#### Services & Controllers (5 minutes)
Implement core API endpoints from contracts/api-spec.yml:
- `GET /api/teammembers` - Dashboard data
- `POST /api/goals` - Add goals
- `PUT /api/teammembers/{id}/mood` - Update mood
- `PUT /api/goals/{id}/complete` - Toggle completion
- `GET /api/stats` - Team statistics

### Phase 3: Frontend Components (20-30 minutes)

#### Tailwind Configuration (1 minute)
Update `tailwind.config.js`:
```js
module.exports = {
  content: ['./src/**/*.{vue,js,ts}'],
  plugins: [require('daisyui')],
  daisyui: { themes: ['light'] }
}
```

#### Core Components (9 minutes)
1. **TeamDashboard.vue** (3 min) - Main layout, data fetching
2. **TeamMemberCard.vue** (3 min) - Individual member display with goals
3. **AddGoalForm.vue** (1.5 min) - Goal creation form
4. **MoodSelector.vue** (1.5 min) - Mood update interface

#### API Service Layer (3 minutes)
Create `services/api.ts` implementing all endpoint calls using contracts/types.ts.

### Phase 4: Integration & Testing (30-40 minutes)

#### Backend Integration (5 minutes)
- Database initialization on startup
- CORS configuration for frontend
- Error handling and validation
- Test all API endpoints with sample data

#### Frontend Integration (3 minutes)
- Component wiring and event handling
- Real-time updates (polling every 5 seconds)
- Error handling and loading states

#### End-to-End Testing (2 minutes)
Manual verification of all user scenarios from spec.md:
- View team dashboard ✓
- Add daily goals ✓
- Update mood status ✓
- Mark goals complete ✓
- Monitor team statistics ✓

### Phase 5: Deployment Prep (40-45 minutes)

#### Production Build (3 minutes)
```bash
# Backend
cd backend/TeamGoalTracker
dotnet publish -c Release

# Frontend
cd ../../../frontend
npm run build
```

#### Documentation (2 minutes)
- Update README with setup instructions
- Document API endpoints and usage
- Add deployment notes

## Key Development Shortcuts

### Backend Shortcuts
- Use Dapper raw SQL instead of Entity Framework (faster setup)
- SQLite in-memory for development, file-based for production
- Minimal validation - focus on happy path
- No authentication/authorization (per requirements)

### Frontend Shortcuts
- DaisyUI components for instant styling
- Simple polling instead of WebSockets for real-time updates
- Minimal error handling - basic try/catch with user messages
- No routing - single-page application

### Testing Shortcuts
- Manual testing only for 45-minute constraint
- Unit tests for critical business logic only
- Integration testing via API calls from frontend

## File Structure Summary

```
backend/
├── TeamGoalTracker/
│   ├── Models/           # TeamMember, Goal, DTOs
│   ├── Services/         # TeamService, DatabaseService
│   ├── Controllers/      # API endpoints
│   ├── Data/            # Database initialization
│   └── database.sql     # Schema + sample data

frontend/
├── src/
│   ├── components/      # Vue components
│   ├── services/        # API client
│   ├── types.ts         # TypeScript definitions
│   └── App.vue         # Main application
└── package.json

specs/001-team-goal-tracker/
├── spec.md             # Requirements
├── plan.md            # This implementation plan
├── research.md        # Technical decisions
├── data-model.md      # Database design
├── contracts/         # API specification
└── quickstart.md      # This file
```

## Success Metrics

At the end of 45 minutes, you should have:
- ✅ Working REST API with all required endpoints
- ✅ Responsive Vue 3 SPA with DaisyUI styling
- ✅ SQLite database with sample team data
- ✅ Real-time dashboard updates (polling)
- ✅ All user scenarios functional
- ✅ Production-ready builds generated

## Troubleshooting

**Backend won't start**: Check .NET SDK version and port conflicts
**Frontend build errors**: Verify Node.js version and dependency installation
**CORS issues**: Ensure backend CORS policy includes frontend URL
**Database errors**: Check SQLite file permissions and schema syntax
**Styling issues**: Verify Tailwind/DaisyUI installation and configuration