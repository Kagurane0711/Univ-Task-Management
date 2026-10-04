import React from 'react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  Timer, 
  Download, 
  Sparkles, 
  Calendar,
  Command
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { calculateSemesterGpa } from '../utils/academicUtils';

export default function Navbar() {
  const { 
    theme, 
    toggleTheme, 
    profile, 
    courses, 
    tasks, 
    openCreateTaskModal, 
    setIsSearchOpen, 
    setIsExportOpen,
    setIsPomodoroOpen 
  } = useTasks();

  const gpaInfo = calculateSemesterGpa(courses, tasks);
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white">
              UniTask
            </span>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
              S2 MM Untirta
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-none">
            {profile.university} &bull; {profile.currentSemester}
          </p>
        </div>
      </div>

      {/* Center Search Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-sm text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850/60 dark:hover:border-slate-700"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Search tasks, courses, notes...</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <kbd className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Ctrl K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* GPA Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-1.5 dark:border-indigo-900/40 dark:bg-indigo-950/40">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Est. GPA: <span className="font-bold text-indigo-600 dark:text-indigo-400">{gpaInfo.gpa.toFixed(2)}</span>
            <span className="text-slate-400 font-normal ml-1">/ 4.0</span>
          </div>
        </div>

        {/* Pomodoro Focus Button */}
        <button
          onClick={() => setIsPomodoroOpen(true)}
          title="Pomodoro Study Focus (Shortcut: P)"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400 sm:px-3 sm:py-2"
        >
          <Timer className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden md:inline text-xs font-semibold">Focus Timer</span>
        </button>

        {/* Calendar / Backup Export */}
        <button
          onClick={() => setIsExportOpen(true)}
          title="Export iCalendar (.ics) or Backup"
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-3 sm:py-2 flex items-center gap-1.5"
        >
          <Download className="h-4 w-4" />
          <span className="hidden xl:inline text-xs font-semibold">Export .ics</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-amber-400"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>

        {/* New Task Button */}
        <button
          onClick={() => openCreateTaskModal()}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="font-semibold">New Task</span>
          <kbd className="hidden lg:inline ml-1 text-[10px] bg-indigo-700/60 px-1 py-0.2 rounded font-normal">N</kbd>
        </button>
      </div>
    </header>
  );
}
