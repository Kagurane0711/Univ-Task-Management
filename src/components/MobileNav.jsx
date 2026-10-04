import React from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  CheckSquare, 
  BookOpen, 
  CalendarDays,
  Menu
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function MobileNav() {
  const { activeTab, setActiveTab, tasks } = useTasks();
  const pendingCount = tasks.filter(t => t.status !== 'done').length;

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban', icon: KanbanSquare, badge: pendingCount },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'timetable', label: 'Schedule', icon: CalendarDays },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-1 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center py-1.5 px-3 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {tab.badge > 0 && (
                <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
