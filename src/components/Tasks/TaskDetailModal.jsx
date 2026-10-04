import React from 'react';
import {
  X,
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  Play,
  Edit2,
  Trash2,
  ExternalLink,
  Users,
  Tag,
  Check,
  Flame
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  getDeadlineInfo,
  COURSE_COLOR_MAP,
  CATEGORY_META,
  PRIORITY_META
} from '../../utils/academicUtils';

export default function TaskDetailModal() {
  const {
    viewingTask,
    setViewingTask,
    courses,
    toggleTaskStatus,
    toggleSubtask,
    openEditTaskModal,
    deleteTask,
    startPomodoroForTask
  } = useTasks();

  if (!viewingTask) return null;

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));
  const course = courseMap[viewingTask.courseId] || { code: 'ACAD', name: 'General Course', color: 'indigo' };
  const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;
  const deadline = getDeadlineInfo(viewingTask.dueDate, viewingTask.status === 'done');
  const priority = PRIORITY_META[viewingTask.priority] || PRIORITY_META.medium;
  const category = CATEGORY_META[viewingTask.category] || CATEGORY_META.assignment;

  const subtasks = viewingTask.subtasks || [];
  const completedSubs = subtasks.filter(s => s.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8 overflow-hidden">
        {/* Top Header with Course theme */}
        <div className={`p-6 border-b ${colorTheme.border} ${colorTheme.bg}`}>
          <button
            onClick={() => setViewingTask(null)}
            className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-white/80 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`rounded-lg px-2.5 py-0.5 text-xs font-bold ${colorTheme.badge}`}>
              {course.code}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {course.name}
            </span>
            <span className={`rounded-md px-2 py-0.5 text-xs font-bold border ${priority.color}`}>
              {priority.label} Priority
            </span>
            <span className="rounded-md bg-white/70 dark:bg-slate-800/70 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {category.label}
            </span>
          </div>

          <h2 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
            {viewingTask.title}
          </h2>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-850">
              <div className="text-[11px] font-bold uppercase text-slate-400">Deadline</div>
              <div className="mt-1 font-bold text-xs text-slate-800 dark:text-slate-100">
                {deadline.label}
              </div>
              <div className="text-[10px] text-slate-400">{deadline.sublabel}</div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-850">
              <div className="text-[11px] font-bold uppercase text-slate-400">Weight & Score</div>
              <div className="mt-1 font-bold text-xs text-slate-800 dark:text-slate-100">
                {viewingTask.weightPercentage}% of Grade
              </div>
              <div className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                {viewingTask.achievedScore !== null ? `${viewingTask.achievedScore}/${viewingTask.maxScore || 100} pts` : 'Ungraded'}
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-850">
              <div className="text-[11px] font-bold uppercase text-slate-400">Status</div>
              <div className="mt-1 font-bold text-xs text-indigo-600 dark:text-indigo-400 capitalize">
                {viewingTask.status.replace('_', ' ')}
              </div>
              <div className="text-[10px] text-slate-400">
                {viewingTask.completedAt ? 'Submitted' : 'Pending'}
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-850">
              <div className="text-[11px] font-bold uppercase text-slate-400">Study Logged</div>
              <div className="mt-1 font-bold text-xs text-purple-600 dark:text-purple-400">
                {viewingTask.loggedMinutes || 0} mins
              </div>
              <div className="text-[10px] text-slate-400">
                Est: {viewingTask.estimatedMinutes || 60}m
              </div>
            </div>
          </div>

          {/* Description */}
          {viewingTask.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Assignment Instructions & Notes
              </h4>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {viewingTask.description}
              </div>
            </div>
          )}

          {/* Subtasks Checklist */}
          {subtasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Subtask Checklist ({completedSubs}/{subtasks.length})
                </h4>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round((completedSubs / subtasks.length) * 100)}%
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${(completedSubs / subtasks.length) * 100}%` }}
                />
              </div>

              <div className="space-y-2">
                {subtasks.map(s => (
                  <div
                    key={s.id}
                    onClick={() => toggleSubtask(viewingTask.id, s.id)}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm hover:border-slate-200 dark:border-slate-800 dark:bg-slate-850 cursor-pointer transition"
                  >
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border ${
                      s.completed
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {s.completed && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className={`text-xs ${
                      s.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group teammates */}
          {viewingTask.groupMembers?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Group Collaborators
              </h4>
              <div className="flex flex-wrap gap-2">
                {viewingTask.groupMembers.map((m, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
                  >
                    <Users className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{m}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {viewingTask.links?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Attached Links & Resources
              </h4>
              <div className="flex flex-wrap gap-2">
                {viewingTask.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850/60">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                toggleTaskStatus(viewingTask.id);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition w-full sm:w-auto ${
                viewingTask.status === 'done'
                  ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{viewingTask.status === 'done' ? 'Mark as Incomplete' : 'Mark as Completed'}</span>
            </button>

            <button
              onClick={() => {
                startPomodoroForTask(viewingTask.id);
                setViewingTask(null);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition w-full sm:w-auto"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Study Session</span>
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                openEditTaskModal(viewingTask);
                setViewingTask(null);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete "${viewingTask.title}"?`)) {
                  deleteTask(viewingTask.id);
                }
              }}
              className="rounded-xl border border-rose-200 bg-white p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:bg-slate-800 dark:text-rose-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
