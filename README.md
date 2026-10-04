# UniTask — University Academic Task & Course Manager

**UniTask** is a modern, responsive, and full-featured academic productivity application designed specifically for university students, teaching assistants, and learners. It balances academic rigor (syllabus weightings, credit hours, 4.0 GPA scales) with daily task agility (Kanban, Pomodoro study focus with Web Audio ambient noise, interactive weekly schedule, and 14-day deadline forecasting).

---

## 🌟 Key Academic Features

1. **Academic Dashboard**:
   - Live countdowns for imminent deadlines (due in 24h/48h).
   - Real-time estimated semester GPA tracker based on course credits and completed assignment scores.
   - Day-at-a-glance showing today's lectures, labs, and room numbers.
   - Quick action shortcuts (Create Task, View Kanban, Launch Focus Session).

2. **Multi-View Workflow**:
   - **Kanban Board**: Drag-and-drop or 1-click status progression between *To Do*, *In Progress*, *Review & Polish*, and *Submitted & Done*. Shows subtask checklist progress, priority tags, and group members.
   - **Assignments & Exams Table**: Filter by enrolled course, deliverable type (Assignment, Lab, Project, Quiz, Midterm, Final, Reading, Presentation), priority, and status. Supports multi-selection, bulk completion, and bulk deletion.
   - **Eisenhower Priority Matrix**: Automatically classifies academic tasks into 4 quadrants (*Do First*, *Schedule*, *Quick Wins*, and *Backlog*) based on deadlines and syllabus weightings to prevent last-minute cramming.
   - **14-Day Deadline & Exam Forecast**: Visual day-by-day sequence showing upcoming academic load with intensity indicators (*Light*, *Moderate*, *Exam Day*).

3. **Courses & Syllabus Hub**:
   - Enrolled courses with credit hours, professor contact info (click-to-email, office location, office hours).
   - Real-time grade calculation and letter grade mappings ($A$, $A-$, $B+$, etc.).
   - Visual syllabus weight distribution bar (e.g. Assignments 25%, Midterm 35%, Final 40%).
   - Class session timetable and direct LMS portal links (Canvas, Moodle, Blackboard).

4. **Weekly Class & Lab Timetable**:
   - Day-by-day weekly grid (Monday through Friday) showing lectures, labs, and tutorials with room locations and times.
   - "Today" live highlight.

5. **Integrated Pomodoro Study Timer**:
   - 25m Focus / 5m Short Break / 15m Long Break intervals.
   - Direct assignment linking: automatically credits focused study minutes to the selected assignment.
   - **Built-in Ambient Sound Synthesizer** (Gentle Rain, White Noise, 10Hz Binaural Alpha Waves) powered purely by the browser's Web Audio API — works 100% offline with zero external audio assets.
   - Completion chimes and celebration confetti upon finishing sessions.

6. **Interactive GPA & "What-If" Forecaster**:
   - Model hypothetical scores on upcoming exams and projects with interactive sliders to see the exact impact on semester and cumulative GPA.
   - Cumulative GPA calculator factoring in prior completed credit hours and target honors standing (*Summa Cum Laude*, *Magna Cum Laude*, *Dean's List*).
   - Reference guide for the standard 4.0 academic grading scale.

7. **Study Analytics & Insights**:
   - Throughput metrics and on-time turn-in percentage.
   - Course time allocation chart comparing hours spent per subject.
   - Academic advisory recommendations highlighting imminent high-weight assignments.
   - Focus study session logs history.

8. **Calendar Sync & Data Portability**:
   - **iCalendar (.ics) Export**: 1-click download of all university deadlines compatible with Google Calendar, Apple Calendar, and Outlook, including 24-hour reminder alarms.
   - **JSON Backup & Restore**: Full export and import capabilities for complete data ownership.
   - **Reset to Sample Data**: 1-click sample dataset restoration for immediate exploration.
   - **Persistent Local Storage**: All tasks, courses, and timer sessions persist across page refreshes.

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` or `/` | Open quick search across tasks, courses, and notes |
| `N` | Open Create Task / Assignment modal |
| `P` | Open Pomodoro study timer |
| `Esc` | Close any open modal |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.14+ or v18+)
- npm

### Installation & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
   The compiled bundle will be generated in `dist/`.

---

## 🛠️ Tech Stack
- **Framework**: React 18 (Vite 4)
- **Styling**: Tailwind CSS 3 (Dark & Light mode, custom color themes)
- **Icons**: Lucide React
- **Audio**: Web Audio API (ambient noise synthesizer & chime generator)
- **Animations**: Canvas Confetti
- **Storage**: Browser LocalStorage
