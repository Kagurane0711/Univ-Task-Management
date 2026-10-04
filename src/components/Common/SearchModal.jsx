import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  CheckSquare,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { COURSE_COLOR_MAP, getDeadlineInfo } from '../../utils/academicUtils';

export default function SearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    tasks,
    courses,
    setViewingTask,
    setFilterCourse,
    setActiveTab
  } = useTasks();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));
  const q = query.toLowerCase().trim();

  // Search tasks
  const matchedTasks = q
    ? tasks.filter(t => {
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = (t.description || '').toLowerCase().includes(q);
        const matchTag = (t.tags || []).some(tag => tag.toLowerCase().includes(q));
        const c = courseMap[t.courseId];
        const matchCourse = (c?.code || '').toLowerCase().includes(q) || (c?.name || '').toLowerCase().includes(q);
        return matchTitle || matchDesc || matchTag || matchCourse;
      })
    : tasks.slice(0, 5);

  // Search courses
  const matchedCourses = q
    ? courses.filter(c => {
        return c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          (c.instructor?.name || '').toLowerCase().includes(q) ||
          (c.notes || '').toLowerCase().includes(q);
      })
    : courses.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 p-4 pt-16 sm:pt-24 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search assignments, exam dates, courses, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <kbd className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Courses matches */}
          {matchedCourses.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Enrolled Subjects</span>
              </div>
              <div className="space-y-1.5">
                {matchedCourses.map(course => {
                  const theme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;
                  return (
                    <div
                      key={course.id}
                      onClick={() => {
                        setFilterCourse(course.id);
                        setActiveTab('courses');
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${theme.badge}`}>
                          {course.code}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {course.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {course.credits} Credits &bull; {course.instructor?.name || 'Instructor'}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tasks matches */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Assignments & Deadlines</span>
            </div>
            {matchedTasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching tasks found.
              </div>
            ) : (
              <div className="space-y-1.5">
                {matchedTasks.map(task => {
                  const c = courseMap[task.courseId];
                  const deadline = getDeadlineInfo(task.dueDate, task.status === 'done');

                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        setViewingTask(task);
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {c && (
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                              [{c.code}]
                            </span>
                          )}
                          <span className={`text-xs font-bold truncate ${
                            task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-850 dark:text-slate-100'
                          }`}>
                            {task.title}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${deadline.badgeBg} shrink-0 ml-2`}>
                        {deadline.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <kbd className="rounded bg-slate-200 dark:bg-slate-700 px-1 py-0.5 text-[10px] text-slate-600 dark:text-slate-300 font-mono">Ctrl+K</kbd> anywhere</span>
          <span>Click any item to inspect</span>
        </div>
      </div>
    </div>
  );
}
