import React from 'react';
import {
  BarChart3,
  PieChart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { COURSE_COLOR_MAP } from '../../utils/academicUtils';

export default function StudyAnalytics() {
  const { tasks, courses, studyLogs, profile } = useTasks();
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done');
  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'done' || !t.dueDate) return false;
    return new Date(t.dueDate).getTime() < Date.now();
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const onTimeTasks = completedTasks.filter(t => {
    if (!t.dueDate || !t.completedAt) return true;
    return new Date(t.completedAt).getTime() <= new Date(t.dueDate).getTime();
  });
  const onTimeRate = completedTasks.length > 0 ? Math.round((onTimeTasks.length / completedTasks.length) * 100) : 100;

  // Total study minutes
  const totalMinutes = studyLogs.reduce((acc, log) => acc + (log.minutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Time spent per course
  const courseTimeMap = {};
  courses.forEach(c => { courseTimeMap[c.id] = 0; });
  studyLogs.forEach(log => {
    if (log.courseId && courseTimeMap[log.courseId] !== undefined) {
      courseTimeMap[log.courseId] += log.minutes || 0;
    }
  });

  const maxCourseTime = Math.max(1, ...Object.values(courseTimeMap));

  // Category breakdown
  const categoryCounts = {};
  tasks.forEach(t => {
    const cat = t.category || 'other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Academic Performance & Study Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Insights on task throughput, on-time submissions, and study time allocation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {profile.currentSemester}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: On-Time Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              On-Time Turn-in
            </span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {onTimeRate}%
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {onTimeTasks.length} of {completedTasks.length} submissions on schedule
          </p>
        </div>

        {/* Metric 2: Study Hours */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Logged Study
            </span>
            <Flame className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalHours} hrs
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Across {studyLogs.length} deep focus sessions
          </p>
        </div>

        {/* Metric 3: Active Backlog */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Backlog
            </span>
            <Clock className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {pendingTasks.length} tasks
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : '0 overdue tasks'}
          </p>
        </div>

        {/* Metric 4: Completion Rate */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Semester Throughput
            </span>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {completionRate}%
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {completedTasks.length} completed / {totalTasks} total
          </p>
        </div>
      </div>

      {/* 2-Column: Time Allocation per Subject & Smart Academic Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Time Allocation by Course */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Study Time Distribution by Course
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Total {totalHours} hrs
            </span>
          </div>

          <div className="space-y-4">
            {courses.map(course => {
              const minutes = courseTimeMap[course.id] || 0;
              const hours = (minutes / 60).toFixed(1);
              const percentage = Math.round((minutes / maxCourseTime) * 100);
              const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;

              return (
                <div key={course.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <span className={`h-2.5 w-2.5 rounded-full ${colorTheme.bg.split(' ')[0]} ring-1 ${colorTheme.border}`} />
                      <span>{course.code} &bull; {course.name}</span>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {hours}h ({minutes}m)
                    </span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${colorTheme.badge.split(' ')[0]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Academic Advisory & Focus Tips */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Academic Advisory & Recommendations
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-200">
                    High-Yield Alert: Algorithms & Database
                  </div>
                  <p className="mt-1 text-amber-700 dark:text-amber-300/90 leading-relaxed">
                    You have 2 heavy assignments due this week contributing 10% to your final grades. Focus on dynamic programming first to secure full marks.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-900/40 dark:bg-indigo-950/30">
              <div className="flex items-start gap-2.5">
                <Flame className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-indigo-900 dark:text-indigo-200">
                    Optimal Study Pace
                  </div>
                  <p className="mt-1 text-indigo-700 dark:text-indigo-300/90 leading-relaxed">
                    You've averaged 45 minutes per focus block. Try spacing two 25-minute Pomodoro sessions tomorrow before your afternoon Database Lab.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200">
                    GPA Trajectory On Target
                  </div>
                  <p className="mt-1 text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                    Your current projected 3.82 GPA exceeds the Dean's List threshold (3.50). Maintaining current scores guarantees Latin honors standing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Study Session Log Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Recent Focus Study Sessions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Assignment / Topic</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studyLogs.slice(0, 6).map(log => {
                const course = courseMap[log.courseId] || { code: 'STUDY', name: 'General' };
                const task = tasks.find(t => t.id === log.taskId);

                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="py-2.5 px-3 font-bold text-slate-850 dark:text-slate-200">
                      {course.code}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      {task ? task.title : 'Independent Coursework'}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-indigo-600 dark:text-indigo-400">
                      +{log.minutes} mins
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
