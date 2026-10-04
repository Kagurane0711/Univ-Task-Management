import React from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

// View components
import DashboardOverview from './components/Dashboard/DashboardOverview';
import KanbanBoard from './components/Tasks/KanbanBoard';
import TaskList from './components/Tasks/TaskList';
import CourseList from './components/Courses/CourseList';
import WeeklySchedule from './components/Timetable/WeeklySchedule';
import EisenhowerMatrix from './components/Tasks/EisenhowerMatrix';
import TimelineView from './components/Tasks/TimelineView';
import GpaCalculator from './components/Gpa/GpaCalculator';
import StudyAnalytics from './components/Analytics/StudyAnalytics';
import ProfilePage from './components/Profile/ProfilePage';

// Modals
import TaskModal from './components/Tasks/TaskModal';
import TaskDetailModal from './components/Tasks/TaskDetailModal';
import CourseModal from './components/Courses/CourseModal';
import PomodoroModal from './components/Pomodoro/PomodoroModal';
import SearchModal from './components/Common/SearchModal';
import ExportModal from './components/Common/ExportModal';

function MainApp() {
  const { activeTab } = useTasks();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex flex-1">
        {/* Left Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'kanban' && <KanbanBoard />}
          {activeTab === 'tasks' && <TaskList />}
          {activeTab === 'courses' && <CourseList />}
          {activeTab === 'timetable' && <WeeklySchedule />}
          {activeTab === 'matrix' && <EisenhowerMatrix />}
          {activeTab === 'timeline' && <TimelineView />}
          {activeTab === 'gpa' && <GpaCalculator />}
          {activeTab === 'analytics' && <StudyAnalytics />}
          {activeTab === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Modals */}
      <TaskModal />
      <TaskDetailModal />
      <CourseModal />
      <PomodoroModal />
      <SearchModal />
      <ExportModal />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <MainApp />
    </TaskProvider>
  );
}
