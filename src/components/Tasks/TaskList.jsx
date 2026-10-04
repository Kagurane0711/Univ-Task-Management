import React, { useState } from 'react';
import {
  Check,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit2,
  Play,
  CheckCircle,
  ExternalLink,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  getDeadlineInfo,
  COURSE_COLOR_MAP,
  CATEGORY_META,
  PRIORITY_META
} from '../../utils/academicUtils';

export default function TaskList() {
  const {
    tasks,
    courses,
    toggleTaskStatus,
    openCreateTaskModal,
    openEditTaskModal,
    deleteTask,
    setViewingTask,
    startPomodoroForTask,
    filterCourse,
    setFilterCourse,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery
  } = useTasks();

  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  // Filtering
  const filtered = tasks.filter(task => {
    if (filterCourse !== 'all' && task.courseId !== filterCourse) return false;
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterStatus !== 'all') {
      if (filterStatus === 'active' && task.status === 'done') return false;
      if (filterStatus !== 'active' && task.status !== filterStatus) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      const matchTag = (task.tags || []).some(t => t.toLowerCase().includes(q));
      const matchCourse = (courseMap[task.courseId]?.code || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag && !matchCourse) return false;
    }
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aTime - bTime;
    }
    if (sortBy === 'priority') {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    }
    if (sortBy === 'weight') {
      return (Number(b.weightPercentage) || 0) - (Number(a.weightPercentage) || 0);
    }
    if (sortBy === 'course') {
      const codeA = courseMap[a.courseId]?.code || '';
      const codeB = courseMap[b.courseId]?.code || '';
      return codeA.localeCompare(codeB);
    }
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === sorted.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(sorted.map(t => t.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedTaskIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    selectedTaskIds.forEach(id => {
      const task = tasks.find(t => t.id === id);
      if (task && task.status !== 'done') {
        toggleTaskStatus(id);
      }
    });
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedTaskIds.length} selected tasks?`)) {
      selectedTaskIds.forEach(id => deleteTask(id));
      setSelectedTaskIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            All Academic Assignments & Exams
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track weights, grades, deadlines, and submissions across all semester courses
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedTaskIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkComplete}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Mark Done ({selectedTaskIds.length})</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-500 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}

          <button
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, tag, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Course Filter */}
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">All Courses</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.code}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active (Pending)</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">All Types</option>
          <option value="assignment">Assignment</option>
          <option value="lab">Lab Practicum</option>
          <option value="project">Project</option>
          <option value="quiz">Quiz</option>
          <option value="midterm">Midterm Exam</option>
          <option value="final">Final Exam</option>
          <option value="reading">Reading</option>
        </select>

        {/* Sort By */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="weight">Grade Weight %</option>
            <option value="course">Course Code</option>
          </select>
        </div>
      </div>

      {/* Main Table / List Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="py-3.5 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={sorted.length > 0 && selectedTaskIds.length === sorted.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="py-3.5 px-3">Subject</th>
                <th className="py-3.5 px-3">Assignment / Task</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Priority</th>
                <th className="py-3.5 px-3">Due Date</th>
                <th className="py-3.5 px-3">Weight & Score</th>
                <th className="py-3.5 px-3 text-right pr-4">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-slate-400">
                    No assignments found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                sorted.map(task => {
                  const course = courseMap[task.courseId] || { code: 'ACAD', name: 'Course', color: 'indigo' };
                  const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;
                  const deadline = getDeadlineInfo(task.dueDate, task.status === 'done');
                  const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;
                  const category = CATEGORY_META[task.category] || CATEGORY_META.assignment;
                  const isSelected = selectedTaskIds.includes(task.id);
                  const isDone = task.status === 'done';

                  return (
                    <tr
                      key={task.id}
                      className={`group transition hover:bg-slate-50 dark:hover:bg-slate-850/60 ${
                        isDone ? 'bg-slate-50/40 dark:bg-slate-900/30' : ''
                      } ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''}`}
                    >
                      {/* Checkbox & Status */}
                      <td className="py-3.5 pl-4 pr-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(task.id)}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                              isDone
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-300 hover:border-indigo-500 dark:border-slate-600'
                            }`}
                          >
                            {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </button>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${colorTheme.bg} ${colorTheme.text} border ${colorTheme.border}`}>
                          {course.code}
                        </span>
                        <div className="text-[11px] text-slate-400 truncate max-w-[120px]">
                          {course.name}
                        </div>
                      </td>

                      {/* Task Title & Details */}
                      <td className="py-3.5 px-3 min-w-[240px]">
                        <div
                          onClick={() => setViewingTask(task)}
                          className={`font-bold cursor-pointer transition ${
                            isDone
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-850 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        >
                          {task.title}
                        </div>

                        <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
                          {task.subtasks?.length > 0 && (
                            <span>
                              ✓ {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                            </span>
                          )}
                          {task.groupMembers?.length > 0 && (
                            <span className="text-indigo-500 dark:text-indigo-400">
                              👥 {task.groupMembers.length} teammates
                            </span>
                          )}
                          {(task.tags || []).slice(0, 2).map((tag, tIdx) => (
                            <span key={tIdx} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          {category.label}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3">
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold border ${priority.color}`}>
                          {priority.label}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${deadline.badgeBg}`}>
                          {deadline.label}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {deadline.sublabel}
                        </div>
                      </td>

                      {/* Weight & Achieved Score */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-700 dark:text-slate-200">
                          {task.weightPercentage > 0 ? `${task.weightPercentage}% of Grade` : 'Ungraded'}
                        </div>
                        <div className="text-[11px]">
                          {task.achievedScore !== null ? (
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                              {task.achievedScore} / {task.maxScore || 100}
                            </span>
                          ) : (
                            <span className="text-slate-400">Score pending</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right pr-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startPomodoroForTask(task.id)}
                            title="Start Focus Timer"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                          >
                            <Play className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openEditTaskModal(task)}
                            title="Edit Assignment"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${task.title}"?`)) {
                                deleteTask(task.id);
                              }
                            }}
                            title="Delete Assignment"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
