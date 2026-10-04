import React from 'react';
import {
  LayoutDashboard,
  KanbanSquare,
  CheckSquare,
  BookOpen,
  CalendarDays,
  LayoutGrid,
  Clock,
  Calculator,
  BarChart3,
  RotateCcw,
  User,
  GraduationCap
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    tasks, 
    courses, 
    profile, 
    resetToSampleData 
  } = useTasks();

  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;
  const overdueTasksCount = tasks.filter(t => {
    if (t.status === 'done' || !t.dueDate) return false;
    return new Date(t.dueDate).getTime() < Date.now();
  }).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban Board', icon: KanbanSquare, badge: pendingTasksCount },
    { id: 'tasks', label: 'Assignments', icon: CheckSquare, badge: overdueTasksCount > 0 ? `${overdueTasksCount} overdue` : null, badgeColor: 'bg-rose-500 text-white' },
    { id: 'courses', label: 'Courses & Syllabus', icon: BookOpen, count: courses.length },
    { id: 'timetable', label: 'Class Timetable', icon: CalendarDays },
    { id: 'matrix', label: 'Priority Matrix', icon: LayoutGrid },
    { id: 'timeline', label: 'Deadline Forecast', icon: Clock },
    { id: 'gpa', label: 'GPA Forecaster', icon: Calculator },
    { id: 'analytics', label: 'Study Analytics', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 flex flex-col justify-between hidden md:flex">
      {/* Navigation Links */}
      <div className="p-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Academic Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : item.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && !item.badge && (
                <span className={`text-xs ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Course Quick Access in Sidebar */}
      <div className="px-4 py-2 flex-1 overflow-y-auto max-h-48 border-t border-slate-100 dark:border-slate-800/60">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex justify-between items-center">
          <span>Active Subjects</span>
          <span className="text-[10px] text-indigo-500 font-semibold">{courses.length} enrolled</span>
        </div>
        <div className="space-y-1 mt-1">
          {courses.map(course => (
            <div
              key={course.id}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition"
              onClick={() => setActiveTab('courses')}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${
                course.color === 'indigo' ? 'bg-indigo-500' :
                course.color === 'cyan' ? 'bg-cyan-500' :
                course.color === 'amber' ? 'bg-amber-500' :
                course.color === 'emerald' ? 'bg-emerald-500' :
                course.color === 'rose' ? 'bg-rose-500' : 'bg-purple-500'
              }`} />
              <span className="font-semibold text-slate-800 dark:text-slate-200">{course.code}</span>
              <span className="truncate text-slate-500 dark:text-slate-400 text-[11px]">{course.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-sm">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
              {profile.name}
            </div>
            <div className="truncate text-[11px] text-slate-400">
              {profile.major}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all courses, tasks, and logs back to default university sample data?')) {
              resetToSampleData();
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-1.5 text-xs text-slate-400 hover:border-slate-300 hover:text-slate-600 dark:border-slate-800 dark:hover:text-slate-300 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </aside>
  );
}
