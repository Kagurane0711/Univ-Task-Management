import React, { useState } from 'react';
import {
  Plus,
  MoreVertical,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckSquare,
  AlertCircle,
  Users
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  getDeadlineInfo,
  COURSE_COLOR_MAP,
  CATEGORY_META,
  PRIORITY_META
} from '../../utils/academicUtils';

const COLUMNS = [
  { id: 'todo', label: 'To Do', description: 'Queued up assignments & study items', color: 'border-t-slate-400' },
  { id: 'in_progress', label: 'In Progress', description: 'Currently drafting, researching, coding', color: 'border-t-indigo-500' },
  { id: 'review', label: 'Review & Polish', description: 'Peer review, proofreading, testing', color: 'border-t-amber-500' },
  { id: 'done', label: 'Submitted & Done', description: 'Turned in to portal or completed', color: 'border-t-emerald-500' }
];

export default function KanbanBoard() {
  const {
    tasks,
    courses,
    moveTaskStatus,
    openCreateTaskModal,
    setViewingTask,
    startPomodoroForTask,
    filterCourse,
    setFilterCourse,
    filterPriority,
    setFilterPriority,
    searchQuery,
    setSearchQuery
  } = useTasks();

  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterCourse !== 'all' && task.courseId !== filterCourse) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchTag = (task.tags || []).some(tag => tag.toLowerCase().includes(q));
      const matchCourse = (courseMap[task.courseId]?.code || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag && !matchCourse) return false;
    }
    return true;
  });

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, columnId);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-4">
      {/* Board Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Academic Kanban Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag cards or click arrows to progress assignments through your study pipeline
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Course filter */}
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Subjects ({courses.length})</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.name.slice(0, 18)}...</option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((column, colIdx) => {
          const colTasks = filteredTasks.filter(t => t.status === column.id);
          const totalEstimatedHours = (colTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0) / 60).toFixed(1);
          const isDropTarget = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex flex-col rounded-2xl border bg-slate-100/60 p-3 dark:bg-slate-900/60 min-h-[500px] transition-all duration-200 ${
                isDropTarget
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
                  : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 dark:border-slate-800/60 mb-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    column.id === 'todo' ? 'bg-slate-400' :
                    column.id === 'in_progress' ? 'bg-indigo-500' :
                    column.id === 'review' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    {column.label}
                  </span>
                  <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="text-[11px] font-medium text-slate-400">
                  {totalEstimatedHours > 0 ? `${totalEstimatedHours}h work` : ''}
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-3">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-300/70 dark:border-slate-800 rounded-xl">
                    Drop items here
                  </div>
                ) : (
                  colTasks.map(task => {
                    const course = courseMap[task.courseId] || { code: 'ACAD', name: 'Course', color: 'indigo' };
                    const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;
                    const deadline = getDeadlineInfo(task.dueDate, task.status === 'done');
                    const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;
                    const completedSubs = (task.subtasks || []).filter(s => s.completed).length;
                    const totalSubs = (task.subtasks || []).length;
                    const isDragging = draggedTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`group relative rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-850 cursor-grab active:cursor-grabbing ${
                          isDragging ? 'opacity-40 scale-95' : ''
                        }`}
                      >
                        {/* Course & Priority Top Row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${colorTheme.bg} ${colorTheme.text} border ${colorTheme.border}`}>
                            {course.code}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className={`rounded-md px-1.5 py-0.2 text-[10px] font-semibold border ${priority.color}`}>
                              {priority.label}
                            </span>
                            {task.weightPercentage > 0 && (
                              <span className="text-[10px] font-bold text-slate-400">
                                {task.weightPercentage}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => setViewingTask(task)}
                          className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition cursor-pointer"
                        >
                          {task.title}
                        </h4>

                        {/* Description snippet if any */}
                        {task.description && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks Progress */}
                        {totalSubs > 0 && (
                          <div className="mt-2.5">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                              <span>Checklist</span>
                              <span>{completedSubs}/{totalSubs}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 transition-all"
                                style={{ width: `${(completedSubs / totalSubs) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Tags & Group Indicator */}
                        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                          {task.groupMembers?.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-medium">
                              <Users className="h-3 w-3" />
                              {task.groupMembers.length} members
                            </span>
                          )}
                          {(task.tags || []).slice(0, 2).map((tag, tIdx) => (
                            <span key={tIdx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Bottom Row: Due Date & Move controls */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${deadline.badgeBg}`}>
                              {deadline.label}
                            </span>
                          </div>

                          {/* Quick Navigation Arrows & Pomodoro */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                            {colIdx > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTaskStatus(task.id, COLUMNS[colIdx - 1].id);
                                }}
                                title={`Move back to ${COLUMNS[colIdx - 1].label}`}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              >
                                <ChevronLeft className="h-3.5 w-3.5" />
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startPomodoroForTask(task.id);
                              }}
                              title="Start Focus Timer on this task"
                              className="p-1 rounded hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600"
                            >
                              <Play className="h-3.5 w-3.5" />
                            </button>

                            {colIdx < COLUMNS.length - 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTaskStatus(task.id, COLUMNS[colIdx + 1].id);
                                }}
                                title={`Advance to ${COLUMNS[colIdx + 1].label}`}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              >
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Card Footer */}
              <button
                onClick={() => openCreateTaskModal()}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Assignment</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
