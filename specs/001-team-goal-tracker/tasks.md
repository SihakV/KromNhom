# Tasks: Team Daily Goal Tracker with Mood Sync

**Input**: Design documents from `/specs/001-team-goal-tracker/`
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅)
**Timeline**: 45-minute development window
**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure
**Time**: Minutes 0-10

- [X] T001 Create backend project structure: `dotnet new webapi -n TeamGoalTracker` in backend/ directory
- [X] T002 Add backend dependencies: Dapper, Microsoft.Data.SqlClient, Microsoft.AspNetCore.Cors to backend/TeamGoalTracker/
- [X] T003 [P] Create Vue 3 TypeScript frontend: `npm create vue@latest frontend` with TypeScript=Yes, Router=No, Testing=No
- [X] T004 [P] Add frontend dependencies: `npm install -D tailwindcss postcss autoprefixer daisyui` and `npm install axios` in frontend/
- [X] T005 [P] Initialize Tailwind CSS: `npx tailwindcss init -p` and configure DaisyUI in frontend/tailwind.config.js
- [X] T006 [P] Configure Tailwind CSS main entry in frontend/src/style.css with @tailwind directives

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented
**Time**: Minutes 10-20

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create database schema file: backend/TeamGoalTracker/database.sql with TeamMembers and Goals tables for SQL Server per data-model.md
- [X] T008 [P] Create TeamMember model: backend/TeamGoalTracker/Models/TeamMember.cs with Id, Name, CurrentMood, CreatedAt, UpdatedAt properties
- [X] T009 [P] Create Goal model: backend/TeamGoalTracker/Models/Goal.cs with Id, TeamMemberId, Description, IsCompleted, CreatedAt, CompletedAt properties
- [X] T010 [P] Create TeamStatistics model: backend/TeamGoalTracker/Models/TeamStatistics.cs with computed properties for aggregation
- [X] T011 Create IDatabaseService interface: backend/TeamGoalTracker/Services/IDatabaseService.cs for database abstraction
- [X] T012 Implement DatabaseService: backend/TeamGoalTracker/Services/DatabaseService.cs with SQL Server connection and Dapper queries
- [X] T013 Create ITeamService interface: backend/TeamGoalTracker/Services/ITeamService.cs for business logic abstraction
- [X] T014 Implement TeamService: backend/TeamGoalTracker/Services/TeamService.cs with CRUD operations for team members and goals
- [X] T015 Configure CORS policy in backend/TeamGoalTracker/Program.cs to allow frontend localhost access
- [X] T016 Setup database initialization in backend/TeamGoalTracker/Data/DatabaseInitializer.cs with sample data seeding
- [X] T017 [P] Create TypeScript types file: frontend/src/types.ts based on contracts/types.ts for API models

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Team Dashboard (Priority: P1) 🎯 MVP

**Goal**: Team members can see all team members' daily goals, moods, and completion status in unified dashboard view

**Independent Test**: Load application and verify all team member cards display with current mood, goals list, and completion statistics

**Time**: Minutes 20-28

### Implementation for User Story 1

- [X] T018 [P] [US1] Create TeamMembersController: backend/TeamGoalTracker/Controllers/TeamMembersController.cs with GET /api/teammembers endpoint
- [X] T019 [P] [US1] Create TeamDashboard component: frontend/src/components/TeamDashboard.vue with grid layout and API integration
- [X] T020 [P] [US1] Create TeamMemberCard component: frontend/src/components/TeamMemberCard.vue with DaisyUI card styling
- [X] T021 [P] [US1] Create API service: frontend/src/services/api.ts with axios instance and teammembers endpoint
- [X] T022 [US1] Integrate TeamDashboard with API service: fetch team members data and display in card grid
- [X] T023 [US1] Add goal completion counting logic in TeamMemberCard: display "X/Y completed" format
- [X] T024 [US1] Add mood emoji display in TeamMemberCard: show current mood with proper emoji rendering
- [X] T025 [US1] Update App.vue: integrate TeamDashboard as main component with proper DaisyUI layout classes

**Checkpoint**: User Story 1 should be fully functional - complete team dashboard with member cards, moods, and goal counts

---

## Phase 4: User Story 2 - Add Daily Goals (Priority: P1)

**Goal**: Team members can add new daily goals for themselves or others through simple input form

**Independent Test**: Use add goal form to create goals and verify they appear on appropriate team member cards

**Time**: Minutes 28-33

### Implementation for User Story 2

- [X] T026 [P] [US2] Create GoalsController: backend/TeamGoalTracker/Controllers/GoalsController.cs with POST /api/goals endpoint
- [X] T027 [P] [US2] Create AddGoalForm component: frontend/src/components/AddGoalForm.vue with team member dropdown and text input
- [X] T028 [US2] Add createGoal method to API service: frontend/src/services/api.ts for POST /api/goals requests
- [X] T029 [US2] Integrate AddGoalForm with TeamDashboard: add form above team member grid with proper event handling
- [X] T030 [US2] Add real-time dashboard refresh: update team member cards after goal creation without page reload
- [X] T031 [US2] Add form validation: ensure team member selection and non-empty goal description

**Checkpoint**: User Stories 1 AND 2 should both work - view dashboard AND add goals with immediate updates

---

## Phase 5: User Story 3 - Update Mood Status (Priority: P1)

**Goal**: Team members can update mood status using emoji selector to communicate current state

**Independent Test**: Use mood update form to change team members' moods and verify changes reflect on dashboard cards

**Time**: Minutes 33-37

### Implementation for User Story 3

- [X] T032 [P] [US3] Add mood update endpoint to TeamMembersController: PUT /api/teammembers/{id}/mood in backend/TeamGoalTracker/Controllers/TeamMembersController.cs
- [X] T033 [P] [US3] Create MoodSelector component: frontend/src/components/MoodSelector.vue with emoji buttons for 5 mood states
- [X] T034 [US3] Add updateMood method to API service: frontend/src/services/api.ts for PUT mood requests
- [X] T035 [US3] Integrate MoodSelector with TeamDashboard: add mood update form with team member dropdown
- [X] T036 [US3] Add real-time mood updates: refresh team member cards after mood changes
- [X] T037 [US3] Update TeamMemberCard: make mood emoji clickable for quick mood updates

**Checkpoint**: User Stories 1, 2, AND 3 should all work - view dashboard, add goals, and update moods

---

## Phase 6: User Story 4 - Mark Goals Complete (Priority: P2)

**Goal**: Team members can mark individual goals as completed using checkboxes directly on dashboard cards

**Independent Test**: Check goal completion boxes and verify completion counts and statistics update correctly

**Time**: Minutes 37-40

### Implementation for User Story 4

- [X] T038 [US4] Add goal completion endpoint to GoalsController: PUT /api/goals/{id}/complete in backend/TeamGoalTracker/Controllers/GoalsController.cs
- [X] T039 [US4] Add toggleGoalComplete method to API service: frontend/src/services/api.ts for PUT completion requests
- [X] T040 [US4] Add goal checkboxes to TeamMemberCard: DaisyUI checkbox components for each goal with click handlers
- [X] T041 [US4] Implement goal completion toggle: update goal status and refresh completion counts immediately
- [X] T042 [US4] Add completed goal styling: cross-through text and visual completion indicators

**Checkpoint**: Goals can be marked complete with immediate UI feedback and count updates

---

## Phase 7: User Story 5 - Monitor Team Statistics (Priority: P3)

**Goal**: Users can view aggregated team statistics including goal completion percentage and mood distribution

**Independent Test**: Add goals and moods for multiple members and verify statistics panel shows accurate percentages and counts

**Time**: Minutes 40-43

### Implementation for User Story 5

- [X] T043 [P] [US5] Create StatsController: backend/TeamGoalTracker/Controllers/StatsController.cs with GET /api/stats endpoint
- [X] T044 [P] [US5] Create TeamStatsPanel component: frontend/src/components/TeamStatsPanel.vue with completion percentage and mood distribution display
- [X] T045 [US5] Add getStats method to API service: frontend/src/services/api.ts for GET /api/stats requests
- [X] T046 [US5] Integrate TeamStatsPanel with TeamDashboard: display statistics sidebar with real-time updates
- [X] T047 [US5] Add statistics calculation logic: implement team completion percentage and mood counting in TeamService

**Checkpoint**: All user stories functional - complete team management with statistics monitoring

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, testing, and deployment preparation
**Time**: Minutes 43-45

- [X] T048 Configure database initialization in Program.cs: ensure database and sample data creation on startup
- [X] T049 Add error handling: basic try/catch in API controllers with user-friendly error messages
- [X] T050 [P] Add loading states: spinner components in frontend during API calls
- [X] T051 [P] Verify all API endpoints: test each endpoint with sample requests using browser dev tools or Postman
- [X] T052 Run production builds: `dotnet publish -c Release` for backend and `npm run build` for frontend
- [X] T053 Final integration test: complete user workflow from dashboard view through goal creation, mood updates, and completion tracking

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories  
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if multiple developers)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but independently testable
- **User Story 4 (P2)**: Depends on User Stories 1 & 2 for goal display and creation
- **User Story 5 (P3)**: Can start after Foundational but benefits from all other stories for complete statistics

### Within Each User Story

- Models before services (Foundation phase ensures this)
- Controllers after services  
- Frontend components can be parallel with backend endpoints
- API integration after both frontend and backend components exist
- Real-time updates after basic functionality works
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: T003, T004, T005, T006 (frontend setup) can run parallel to T001, T002 (backend setup)
- **Foundational Phase**: T008, T009, T010 (models) and T017 (types) can run in parallel
- **User Stories**: Once foundational complete, US1, US2, US3 can start in parallel
- **Within Stories**: Frontend components and backend controllers can be built simultaneously

---

## Parallel Example: User Story 1

```bash
# Launch backend and frontend work together for User Story 1:
Task T018: "Create TeamMembersController: backend/TeamGoalTracker/Controllers/TeamMembersController.cs"
Task T019: "Create TeamDashboard component: frontend/src/components/TeamDashboard.vue"
Task T020: "Create TeamMemberCard component: frontend/src/components/TeamMemberCard.vue"
Task T021: "Create API service: frontend/src/services/api.ts"

# Then integrate them:
Task T022: "Integrate TeamDashboard with API service"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only) - Core 45-Minute Goal

1. Complete Phase 1: Setup (0-10 min)
2. Complete Phase 2: Foundational (10-20 min) - CRITICAL
3. Complete Phase 3: User Story 1 (20-28 min) - Dashboard view
4. Complete Phase 4: User Story 2 (28-33 min) - Add goals  
5. Complete Phase 5: User Story 3 (33-37 min) - Update moods
6. **STOP and VALIDATE**: Test core functionality independently
7. Deploy/demo basic team goal tracker with mood sync

### Extended Version (If time permits)

8. Complete Phase 6: User Story 4 (37-40 min) - Mark complete
9. Complete Phase 7: User Story 5 (40-43 min) - Statistics  
10. Complete Phase 8: Polish (43-45 min) - Final integration

### Incremental Delivery

1. **Foundation** (Phases 1-2): Project structure and core models → Ready for development
2. **MVP Core** (Phases 3-5): Dashboard + Goal creation + Mood updates → Functional team tracker
3. **Enhanced** (Phases 6-7): Goal completion + Statistics → Full feature set
4. **Production** (Phase 8): Error handling + Builds → Deployment ready

Each increment adds value without breaking previous functionality.

---

## Success Metrics

At completion, you should have:
- ✅ **53 total tasks** organized across 8 phases
- ✅ **User Story 1**: 8 tasks (complete team dashboard)
- ✅ **User Story 2**: 6 tasks (goal creation)
- ✅ **User Story 3**: 6 tasks (mood updates)
- ✅ **User Story 4**: 5 tasks (goal completion)
- ✅ **User Story 5**: 5 tasks (team statistics)
- ✅ **14 parallel opportunities** identified for efficient execution
- ✅ **Independent test criteria** for each user story
- ✅ **MVP scope**: User Stories 1-3 (core 45-minute goal)
- ✅ **Format validation**: All tasks follow `- [ ] [ID] [P?] [Story?] Description with file path`

**Ready for immediate execution** - each task is specific enough for LLM implementation without additional context.