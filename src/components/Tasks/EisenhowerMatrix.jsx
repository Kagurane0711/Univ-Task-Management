import React from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  getDeadlineInfo,
  COURSE_COLOR_MAP
} from '../../utils/academicUtils';

export default function EisenhowerMatrix() {
  const { tasks, courses, toggleTaskStatus, setViewingTask, startPomodoroForTask } = useTasks();
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  // Active tasks only
  const activeTasks = tasks.filter(t => t.status !== 'done');

  // Categorize tasks into 4 quadrants
  // Q1: Urgent & High Weight/Priority (Urgent/High priority + due within 3 days or weight >= 10%)
  // Q2: Important & Not Urgent (Weight >= 10% or High priority, but due > 3 days)
  // Q3: Urgent & Low Weight (Due within 3 days, but lower weight/priority)
  // Q4: Neither (Low priority, no immediate deadline)

  const now = Date.now();
  const isImminent = (dueDate) => {
    if (!dueDate) return false;
    const diffDays = (new Date(dueDate).getTime() - now) / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  };

  const isImportant = (task) => {
    return task.priority === 'urgent' || task.priority === 'high' || (task.weightPercentage || 0) >= 15;
  };

  const q1Tasks = activeTasks.filter(t => isImminent(t.dueDate) && isImportant(t));
  const q2Tasks = activeTasks.filter(t => !isImminent(t.dueDate) && isImportant(t));
  const q3Tasks = activeTasks.filter(t => isImminent(t.dueDate) && !isImportant(t));
  const q4Tasks = activeTasks.filter(t => !isImminent(t.dueDate) && !isImportant(t));

  const quadrants = [
    {
      id: 'q1',
      title: 'Do First (Urgent & Important)',
      subtitle: 'Critical deadlines & high-weight exam prep',
      tasks: q1Tasks,
      badgeColor: 'bg-rose-500 text-white',
      cardBg: 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60',
      icon: Zap
    },
    {
      id: 'q2',
      title: 'Schedule (Important, Not Urgent)',
      subtitle: 'Term projects, long-term research, study prep',
      tasks: q2Tasks,
      badgeColor: 'bg-indigo-600 text-white',
      cardBg: 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60',
      icon: Calendar
    },
    {
      id: 'q3',
      title: 'Quick Wins (Urgent, Lower Weight)',
      subtitle: 'Short homeworks, weekly lab check-offs, quizzes',
      tasks: q3Tasks,
      badgeColor: 'bg-amber-500 text-white',
      cardBg: 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60',
      icon: Clock
    },
    {
      id: 'q4',
      title: 'Backlog (Low Priority)',
      subtitle: 'Optional readings, formatting, organization',
      tasks: q4Tasks,
      badgeColor: 'bg-slate-500 text-white',
      cardBg: 'bg-slate-50/40 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Eisenhower Academic Priority Matrix
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Separate urgent academic fires from high-impact semester priorities to prevent exam cramming
        </p>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {quadrants.map(q => {
          const Icon = q.icon;
          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-4 shadow-sm min-h-[380px] flex flex-col ${q.cardBg}`}
            >
              {/* Quadrant Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60 mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${q.badgeColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {q.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {q.subtitle}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white dark:bg-slate-800 px-2.5 py-0.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/60 dark:border-slate-700">
                  {q.tasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-2.5">
                {q.tasks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No active tasks in this quadrant.
                  </div>
                ) : (
                  q.tasks.map(task => {
                    const course = courseMap[task.courseId] || { code: 'GEN', name: 'Course', color: 'indigo' };
                    const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;
                    const deadline = getDeadlineInfo(task.dueDate, false);

                    return (
                      <div
                        key={task.id}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-850 transition"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${colorTheme.bg} ${colorTheme.text} border ${colorTheme.border}`}>
                              {course.code}
                            </span>
                            {task.weightPercentage > 0 && (
                              <span className="text-[10px] font-semibold text-slate-400">
                                {task.weightPercentage}%
                              </span>
                            )}
                          </div>

                          <div
                            onClick={() => setViewingTask(task)}
                            className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate cursor-pointer"
                          >
                            {task.title}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${deadline.badgeBg}`}>
                            {deadline.label}
                          </span>

                          <button
                            onClick={() => startPomodoroForTask(task.id)}
                            title="Focus on this"
                            className="p-1 rounded hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 dark:hover:bg-slate-700"
                          >
                            <Play className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
