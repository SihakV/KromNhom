# Team Daily Goal Tracker with Mood Sync

A full-stack web application for small teams to track daily goals and monitor team morale through a unified dashboard.

## 🚀 Features

- **Team Dashboard**: View all team members with their current moods and daily goals
- **Goal Management**: Add new goals for team members with real-time updates
- **Mood Tracking**: Update team member moods using emoji-based mood selector
- **Goal Completion**: Mark goals as complete with immediate UI feedback
- **Team Statistics**: Monitor goal completion percentage and mood distribution
- **Real-time Updates**: Automatic dashboard refresh every 30 seconds

## 🏗️ Architecture

**Frontend**: Vue 3 + TypeScript + DaisyUI + Tailwind CSS
**Backend**: .NET 8 Web API + Dapper ORM
**Database**: SQL Server running in Docker
**Development**: Hot reload for both frontend and backend

## 📋 Prerequisites

- Node.js 18+ with npm
- .NET 8 SDK
- Docker (for SQL Server)
- Git

## ⚡ Quick Start

### 1. Start SQL Server Container
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=MyStrongPassword123!" -p 1433:1433 --name teamgoal-sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

### 2. Create Database
```bash
docker exec -it teamgoal-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P MyStrongPassword123! -C -Q "CREATE DATABASE TeamGoalTracker;"
```

### 3. Start Backend API
```bash
cd backend/TeamGoalTracker
dotnet run
```
Backend will be available at: http://localhost:5082

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at: http://localhost:5173

## 📊 API Endpoints

- `GET /api/teammembers` - Get all team members with goals
- `POST /api/goals` - Create a new goal
- `PUT /api/teammembers/{id}/mood` - Update team member mood
- `PUT /api/goals/{id}/complete` - Toggle goal completion
- `GET /api/stats` - Get team statistics

## 🎯 User Stories Implemented

### ✅ User Story 1: View Team Dashboard (Priority: P1)
Team members can see all team members' daily goals, moods, and completion status in a unified dashboard view.

### ✅ User Story 2: Add Daily Goals (Priority: P1)  
Team members can add new daily goals for themselves or others through a simple input form.

### ✅ User Story 3: Update Mood Status (Priority: P1)
Team members can update mood status using an emoji selector to communicate their current state.

### ✅ User Story 4: Mark Goals Complete (Priority: P2)
Team members can mark individual goals as completed using checkboxes directly on dashboard cards.

### ✅ User Story 5: Monitor Team Statistics (Priority: P3)
Users can view aggregated team statistics including goal completion percentage and mood distribution.

## 🛠️ Technology Stack

### Frontend
- **Vue 3** with Composition API and TypeScript
- **DaisyUI v5.0.50** for component styling
- **Tailwind CSS** for utility-first CSS
- **Axios** for HTTP client
- **Vite** for development and building

### Backend  
- **.NET 8 Web API** with minimal APIs
- **Dapper** micro-ORM for database access
- **Microsoft.Data.SqlClient** for SQL Server connectivity
- **CORS** configured for frontend access

### Database
- **SQL Server 2022** running in Docker container
- **Sample data** with 4 team members and goals
- **Indexed queries** for performance

## 📁 Project Structure

```
KromNhom/
├── backend/
│   └── TeamGoalTracker/
│       ├── Controllers/          # API controllers
│       ├── Models/              # Data models and DTOs
│       ├── Services/            # Business logic services
│       ├── Data/                # Database initialization
│       └── database.sql         # Database schema
├── frontend/
│   └── src/
│       ├── components/          # Vue components
│       ├── services/            # API service layer
│       ├── types.ts            # TypeScript definitions
│       └── style.css           # Tailwind imports
└── specs/
    └── 001-team-goal-tracker/   # Project specifications
```

## 🚀 Production Deployment

### Backend
```bash
cd backend/TeamGoalTracker
dotnet publish -c Release
```
Published files will be in `bin/Release/net9.0/publish/`

### Frontend
```bash
cd frontend
npm run build
```
Built files will be in `dist/` directory

## 🔧 Configuration

### Database Connection
The application uses the following SQL Server connection:
- **Server**: localhost,1433
- **Database**: TeamGoalTracker
- **Username**: sa  
- **Password**: MyStrongPassword123!
- **Connection String**: `Server=localhost,1433;Database=TeamGoalTracker;User Id=sa;Password=MyStrongPassword123!;TrustServerCertificate=true;`

### Environment Configuration
- Backend automatically initializes database schema and sample data on startup
- CORS is configured to allow localhost:5173 (frontend) access
- Frontend API base URL is set to localhost:5082 (backend)

## ⏱️ Development Timeline

This application was built following a 45-minute development plan:
- **Phase 1**: Project setup (0-10 min) ✅
- **Phase 2**: Foundation & core infrastructure (10-20 min) ✅  
- **Phase 3**: User Story 1 - Dashboard view (20-28 min) ✅
- **Phase 4**: User Story 2 - Add goals (28-33 min) ✅
- **Phase 5**: User Story 3 - Mood updates (33-37 min) ✅
- **Phase 6**: User Story 4 - Goal completion (37-40 min) ✅
- **Phase 7**: User Story 5 - Statistics (40-43 min) ✅
- **Phase 8**: Polish & deployment (43-45 min) ✅

All 53 tasks completed successfully with MVP functionality delivered.

## 🎨 UI Components

The application uses DaisyUI components for a clean, accessible interface:
- **Cards** for team member display
- **Badges** for completion counts
- **Checkboxes** for goal completion
- **Modals** for mood selection
- **Progress bars** for statistics
- **Loading spinners** for async operations

## 🔄 Real-time Features

- **Auto-refresh**: Dashboard updates every 30 seconds
- **Immediate feedback**: Goal completion and mood updates refresh instantly
- **Loading states**: Spinners during API calls
- **Error handling**: User-friendly error messages

## 📈 Performance

- **Fast initial load**: Optimized bundle sizes
- **Efficient queries**: Indexed database operations
- **Minimal API calls**: Batch operations where possible
- **Responsive design**: Works on desktop and mobile

## 🎯 Success Metrics

✅ All 5 user stories implemented and functional
✅ Real-time dashboard with team member cards
✅ Goal creation and completion tracking
✅ Mood selection and display
✅ Team statistics with completion percentages
✅ Production-ready builds generated
✅ Full-stack integration working
✅ 53 development tasks completed

**Status: COMPLETE** - Ready for deployment and use by teams of 10+ members.