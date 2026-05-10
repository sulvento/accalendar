# Software Final Report: Accalendar Version 0.0.1

**AJ, Owen, Aleni**  
**May 7th, 2026**

## Table of Contents
- User Report: Project Overview, Problem Statement, User Manual, Key Features for Students
- Technical Report: System Overview, Tech Stack, Deployment, Functional & Non-Functional Requirements
- Testing and Quality Assurance: Unit Testing, User Acceptance Testing, Code Quality
- Stakeholder Involvement & Future Plans: Stakeholder Feedback, Future Roadmap
- Visual Aids: Figures and Tables

## User Report

### Project Overview
Accalendar is a calendar application that automatically synchronizes with the Canvas API to increase productivity and eliminate the need for students to manually transfer assignments, deadlines, and events.

The application supports:
- General calendar functionality (event creation, recurring events)
- Automatic fetching and importing of Canvas assignments
- A unified academic and personal scheduling interface

### Problem Statement
Students often switch between Canvas and other scheduling platforms. Accalendar solves this by creating automation and seamless integration between systems. At this stage, the application functions as a prototype importing data exclusively from Canvas.

### User Manual

#### 1. Getting Started
- **Secure Access:** Users sign in through a protected gateway using their Ursinus username and password.
- **Dashboard:** Interactive calendar with Month, Week, and Day views.

#### 2. Automation Features
- No manual assignment entry required.
- Automatic Canvas synchronization every 30 minutes.

#### 3. Personal Event Management
- Add work shifts, gym sessions, club meetings, and other personal events.
- Drag-and-drop scheduling adjustments.

#### 4. Assignment Details
- Click assignments for due dates, grading type, and submission status.
- Offline reliability with cached schedule information.

#### 5. Personalization
- Light and Dark mode support.

## Technical Report

### System Overview and Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | Interactive UI |
| UI Styling | Tailwind CSS | Responsive design |
| Calendar Library | FullCalendar.js | Interactive calendar |
| Backend | Node.js / Express | Server logic and API handling |
| API Integration | Canvas REST / GraphQL | Assignment/course data |
| Database | PostgreSQL | Persistent storage |

### Deployment Instructions
1. Install Node.js, PostgreSQL, and Git
2. Clone repository and run `npm install`
3. Create `.env` with DB credentials and Canvas API token
4. Initialize PostgreSQL schema
5. Run `npm run start`

### Functional Requirements
- FR1: Automatic Canvas sync
- FR2: Personal event management
- FR3: Notifications and alerts
- FR4: Unified schedule interface
- FR5: Multiple calendar views
- FR6: Drag-and-drop interaction
- FR7: Navigation controls
- FR8: Data labeling and color coding
- FR9: Protected login
- FR10: Light/Dark mode support

### Non-Functional Requirements
- Login validation under 3 seconds
- Persistent database storage
- Data refresh within 60 seconds
- Secure credential/API token protection
- Default 30-minute sync interval

## Testing and Quality Assurance

### Unit Testing
Implemented with Vitest to validate `canvasapi.js`:
- API request construction
- Authentication headers
- Active course filtering
- Mocked Canvas API responses

### User Acceptance Testing
- UAT-1: View Active Courses
- UAT-3: View Assignment Details
- UAT-6: Error Handling

## Stakeholder Involvement and Future Plans

### Stakeholder Feedback
Student interviews indicated the need for:
- Better assignment warning systems
- Reduced platform switching

### Future Roadmap
- AI integration for smarter scheduling
- Document scanner for physical calendars
- TODO checklist
- Lo-fi music player

## Visual Aids

### MVP Breakdown

| Task | Estimated Hours |
|---|---|
| Login Setup | 25 hrs |
| Canvas API Integration | 45 hrs |
| Assignment Data Management | 30 hrs |
| Calendar UI Development | 40 hrs |
| Sync Logic Implementation | 20 hrs |
| UI/UX Polishing | 25 hrs |
| Testing and Debugging | 35 hrs |
