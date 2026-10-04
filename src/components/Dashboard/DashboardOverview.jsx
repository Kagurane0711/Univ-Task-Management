import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Calendar,
  Sparkles,
  Timer,
  Play,
  Check,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { 
  getDeadlineInfo, 
  calculateCourseGrade, 
  calculateSemesterGpa, 
  COURSE_COLOR_MAP,
  CATEGORY_META,
  PRIORITY_META
} from '../../utils/academicUtils';

export default function DashboardOverview() {
  const { 
    profile, 
    tasks, 
    courses, 
    studyLogs, 
    toggleTaskStatus, 
    openCreateTaskModal, 
    setViewingTask,
    startPomodoroForTask,
    setActiveTab 
  } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks due within 48h
  const now = Date.now();
  const upcoming48h = tasks.filter(t => {
    if (t.status === 'done' || !t.dueDate) return false;
    const dueTime = new Date(t.dueDate).getTime();
    return dueTime > now && (dueTime - now) <= 48 * 60 * 60 * 1000;
  });

  // Overdue tasks
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'done' || !t.dueDate) return false;
    return new Date(t.dueDate).getTime() < now;
  });

  // Calculate GPA
  const semesterGpa = calculateSemesterGpa(courses, tasks);

  // Total study minutes this week
  const totalStudyMinutes = studyLogs.reduce((acc, log) => acc + (log.minutes || 0), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // Get today's classes
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[new Date().getDay()];

  const todayClasses = [];
  courses.forEach(course => {
    (course.schedule || []).forEach(slot => {
      if (slot.day.toLowerCase() === todayDayName.toLowerCase()) {
        todayClasses.push({
          ...slot,
          course
        });
      }
    });
  });

  // Sort today's classes by start time
  todayClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Course map
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  // Active / in-progress tasks prioritized
  const priorityTasks = [...tasks]
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      // Sort by overdue first, then priority, then due date
      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aDue - bDue;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-primary-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
              <span>{profile.currentSemester} &bull; Academic Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-indigo-100/90 text-sm max-w-xl">
              You have <span className="font-bold underline decoration-amber-400 decoration-2">{upcoming48h.length} tasks</span> due in the next 48 hours and <span className="font-bold">{todayClasses.length} lectures</span> scheduled today. Stay focused!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openCreateTaskModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-md transition hover:bg-indigo-50 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/40 border border-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-indigo-500/60"
            >
              <span>View Kanban</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Metric 1: Pending Tasks */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Task Progress
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {completedTasks}/{totalTasks}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {completionPercentage}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Due Soon */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Due in 48h
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {upcoming48h.length}
            </span>
            {overdueTasks.length > 0 && (
              <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                +{overdueTasks.length} overdue
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 truncate">
            {upcoming48h[0] ? `Next: ${upcoming48h[0].title}` : 'No immediate deadlines'}
          </p>
        </div>

        {/* Metric 3: Projected GPA */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Projected GPA
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {semesterGpa.gpa.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / 4.0 scale
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Target: {profile.targetGpa.toFixed(2)} ({semesterGpa.totalCredits} enrolled credits)
          </p>
        </div>

        {/* Metric 4: Focus Study Time */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Focus Study Time
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalStudyHours}h
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              {studyLogs.length} sessions
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Across {courses.length} university courses
          </p>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Classes & Upcoming Priority Tasks */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today's Schedule Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Today's Classes & Labs ({todayDayName})
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 inline-flex items-center gap-1"
              >
                Full Timetable
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4">
              {todayClasses.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-sm">
                  🎉 No scheduled lectures or labs today! Great day for project work or independent study.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {todayClasses.map((item, idx) => {
                    const theme = COURSE_COLOR_MAP[item.course.color] || COURSE_COLOR_MAP.indigo;
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-3.5 transition hover:shadow-md ${theme.bg} ${theme.border}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${theme.badge}`}>
                            {item.course.code}
                          </span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                        <div className="mt-2 font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {item.course.name}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>📍 {item.location}</span>
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Urgent & Upcoming Tasks */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  High Priority & Upcoming Deadlines
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 inline-flex items-center gap-1"
              >
                All Assignments ({tasks.length})
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/80">
              {priorityTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  All caught up! No pending deadlines right now.
                </div>
              ) : (
                priorityTasks.map(task => {
                  const course = courseMap[task.courseId] || { code: 'GEN', name: 'General', color: 'indigo' };
                  const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;
                  const deadline = getDeadlineInfo(task.dueDate, task.status === 'done');
                  const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;
                  const completedSubs = (task.subtasks || []).filter(s => s.completed).length;
                  const totalSubs = (task.subtasks || []).length;

                  return (
                    <div
                      key={task.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 transition hover:bg-slate-50/80 dark:hover:bg-slate-850/50 rounded-xl px-2.5 -mx-2.5"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Status Checkbox */}
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                            task.status === 'done'
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 hover:border-indigo-500 dark:border-slate-600'
                          }`}
                        >
                          {task.status === 'done' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setViewingTask(task)}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${colorTheme.bg} ${colorTheme.text} border ${colorTheme.border}`}>
                              {course.code}
                            </span>
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${priority.color}`}>
                              {priority.label}
                            </span>
                            {task.weightPercentage > 0 && (
                              <span className="text-[10px] font-semibold text-slate-400">
                                {task.weightPercentage}% of Grade
                              </span>
                            )}
                          </div>

                          <div className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                            {task.title}
                          </div>

                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            {totalSubs > 0 && (
                              <span>
                                {completedSubs}/{totalSubs} subtasks
                              </span>
                            )}
                            {task.estimatedMinutes > 0 && (
                              <span>
                                Est: {Math.round(task.estimatedMinutes / 60)}h
                              </span>
                            )}
                            {task.groupMembers?.length > 0 && (
                              <span className="text-indigo-500 dark:text-indigo-400">
                                👥 Group ({task.groupMembers.length})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Deadline & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0">
                        <div className="text-right">
                          <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${deadline.badgeBg}`}>
                            {deadline.label}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {deadline.sublabel}
                          </div>
                        </div>

                        {/* Quick Pomodoro Start */}
                        <button
                          onClick={() => startPomodoroForTask(task.id)}
                          title="Start Focus Session on this task"
                          className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Course Grade Standing & Quick Links */}
        <div className="space-y-6">
          {/* Course Grades Overview */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Course Standing
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('courses')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Manage
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {courses.map(course => {
                const gradeResult = calculateCourseGrade(course, tasks);
                const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;

                return (
                  <div
                    key={course.id}
                    onClick={() => setActiveTab('courses')}
                    className="group rounded-xl border border-slate-100 p-3.5 transition hover:border-slate-200 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-700 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          course.color === 'indigo' ? 'bg-indigo-500' :
                          course.color === 'cyan' ? 'bg-cyan-500' :
                          course.color === 'amber' ? 'bg-amber-500' :
                          course.color === 'emerald' ? 'bg-emerald-500' :
                          course.color === 'rose' ? 'bg-rose-500' : 'bg-purple-500'
                        }`} />
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {course.code}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {course.credits} cr
                        </span>
                      </div>
                      <div>
                        {gradeResult.currentScore !== null ? (
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                            {gradeResult.currentScore}% ({gradeResult.letterGrade})
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Ungraded</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 truncate">
                      {course.name}
                    </div>

                    {/* Mini progress bar of completed tasks */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{gradeResult.completedTasksCount}/{gradeResult.totalTasksCount} tasks done</span>
                      <span>{gradeResult.gradedWeightTotal}% weight graded</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{
                          width: `${gradeResult.totalTasksCount > 0 ? (gradeResult.completedTasksCount / gradeResult.totalTasksCount) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Study Focus Card */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-indigo-100/40 p-5 dark:border-indigo-900/40 dark:from-indigo-950/40 dark:to-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Study Sprint Mode
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Built-in ambient sound & Pomodoro
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Block distractions and auto-log focused minutes directly to your university assignments.
            </p>
            <button
              onClick={() => startPomodoroForTask(priorityTasks[0]?.id || null)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 transition"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Launch Focus Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
