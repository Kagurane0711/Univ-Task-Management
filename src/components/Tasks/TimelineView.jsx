import React from 'react';
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Play,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { COURSE_COLOR_MAP, PRIORITY_META } from '../../utils/academicUtils';

export default function TimelineView() {
  const { tasks, courses, setViewingTask, startPomodoroForTask } = useTasks();
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  // Build 14 upcoming days array
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    // Find tasks due on this date
    const dayTasks = tasks.filter(t => {
      if (!t.dueDate) return false;
      const tDate = new Date(t.dueDate).toISOString().split('T')[0];
      return tDate === dateStr;
    });

    const isToday = i === 0;
    const isTomorrow = i === 1;

    days.push({
      date: d,
      dateStr,
      dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
      formattedDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      isToday,
      isTomorrow,
      tasks: dayTasks
    });
  }

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            14-Day Deadline & Exam Forecast
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological forecast of your academic workload to anticipate bottleneck crunch days
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Light</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>High Intensity / Exam</span>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3">
        {days.map((dayItem, idx) => {
          const taskCount = dayItem.tasks.length;
          const hasExam = dayItem.tasks.some(t => t.category === 'midterm' || t.category === 'final');

          let workloadBadge = 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
          let workloadLabel = 'No Deadlines';

          if (taskCount === 1) {
            workloadBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
            workloadLabel = '1 Deadline';
          } else if (taskCount === 2) {
            workloadBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
            workloadLabel = '2 Deadlines';
          } else if (taskCount >= 3 || hasExam) {
            workloadBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold';
            workloadLabel = hasExam ? `⚡ Exam Day (${taskCount} tasks)` : `High Load (${taskCount} tasks)`;
          }

          return (
            <div
              key={idx}
              className={`rounded-2xl border p-4 transition ${
                dayItem.isToday
                  ? 'border-indigo-500 bg-indigo-50/20 dark:border-indigo-500/60 dark:bg-indigo-950/20 ring-1 ring-indigo-500/20'
                  : 'border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 text-center font-bold ${
                    dayItem.isToday
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}>
                    <span className="text-[10px] uppercase">{dayItem.dayName}</span>
                    <span className="text-sm">{dayItem.date.getDate()}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {dayItem.formattedDate}
                      </span>
                      {dayItem.isToday && (
                        <span className="rounded bg-indigo-600 px-1.5 py-0.2 text-[10px] font-bold text-white uppercase">
                          Today
                        </span>
                      )}
                      {dayItem.isTomorrow && (
                        <span className="rounded bg-blue-600 px-1.5 py-0.2 text-[10px] font-bold text-white uppercase">
                          Tomorrow
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold inline-block ${workloadBadge}`}>
                  {workloadLabel}
                </span>
              </div>

              {/* Tasks due on this day */}
              <div className="mt-3">
                {taskCount === 0 ? (
                  <div className="text-xs text-slate-400 py-2 italic">
                    Clear schedule — free time for coursework or review
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {dayItem.tasks.map(task => {
                      const course = courseMap[task.courseId] || { code: 'ACAD', name: 'Course', color: 'indigo' };
                      const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;
                      const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;
                      const isDone = task.status === 'done';

                      return (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between gap-2.5 rounded-xl border p-3 shadow-sm transition hover:shadow-md cursor-pointer ${
                            isDone
                              ? 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/40 opacity-75'
                              : 'border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-850'
                          }`}
                          onClick={() => setViewingTask(task)}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${colorTheme.bg} ${colorTheme.text} border ${colorTheme.border}`}>
                                {course.code}
                              </span>
                              <span className={`rounded px-1.5 py-0.2 text-[10px] font-semibold border ${priority.color}`}>
                                {priority.label}
                              </span>
                            </div>

                            <div className={`mt-1 text-xs font-bold truncate ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-850 dark:text-slate-100'
                            }`}>
                              {task.title}
                            </div>

                            <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-2">
                              <span>
                                {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {task.weightPercentage > 0 && (
                                <span>&bull; {task.weightPercentage}% grade</span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startPomodoroForTask(task.id);
                            }}
                            title="Focus timer"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700"
                          >
                            <Play className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
