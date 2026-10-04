import React from 'react';
import {
  BookOpen,
  Plus,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  calculateCourseGrade,
  COURSE_COLOR_MAP
} from '../../utils/academicUtils';

export default function CourseList() {
  const {
    courses,
    tasks,
    openCreateCourseModal,
    openEditCourseModal,
    deleteCourse,
    openCreateTaskModal,
    setViewingCourse,
    setFilterCourse,
    setActiveTab
  } = useTasks();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Enrolled Courses & Syllabus Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage course syllabi, grade weightings, lecture schedules, and professor contacts
          </p>
        </div>

        <button
          onClick={() => openCreateCourseModal()}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map(course => {
          const gradeResult = calculateCourseGrade(course, tasks);
          const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;
          const courseTasks = tasks.filter(t => t.courseId === course.id);
          const pendingTasks = courseTasks.filter(t => t.status !== 'done');

          return (
            <div
              key={course.id}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900 overflow-hidden"
            >
              {/* Top Course Card Header */}
              <div className={`p-5 border-b ${colorTheme.border} ${colorTheme.bg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${colorTheme.badge}`}>
                        {course.code}
                      </span>
                      <span className="rounded-md bg-white/70 dark:bg-slate-800/70 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {course.credits} Credits
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
                      {course.name}
                    </h3>
                  </div>

                  {/* Course Grade standing */}
                  <div className="text-right">
                    {gradeResult.currentScore !== null ? (
                      <div className="rounded-xl bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 shadow-sm border border-slate-200/60 dark:border-slate-800">
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {gradeResult.currentScore}%
                        </div>
                        <div className={`text-xs font-bold ${gradeResult.gradeInfo.color}`}>
                          Grade: {gradeResult.letterGrade} ({gradeResult.gpa} GPA)
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-white/60 dark:bg-slate-800/60 px-2.5 py-1 text-xs text-slate-400">
                        Ungraded
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructor snippet */}
                {course.instructor && (
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">
                      👨‍🏫 {course.instructor.name}
                    </span>
                    {course.instructor.email && (
                      <a
                        href={`mailto:${course.instructor.email}`}
                        className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {course.instructor.email}
                      </a>
                    )}
                    {course.instructor.office && (
                      <span className="text-slate-400">
                        📍 {course.instructor.office}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Course Body */}
              <div className="p-5 flex-1 space-y-4">
                {/* Syllabus Weightings Bar */}
                {course.gradingWeights?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      <span>Syllabus Breakdown</span>
                      <span className="text-slate-400">
                        {course.gradingWeights.reduce((a, b) => a + (b.weightPercentage || 0), 0)}% total
                      </span>
                    </div>

                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      {course.gradingWeights.map((w, idx) => {
                        const colors = ['bg-indigo-500', 'bg-cyan-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-purple-500'];
                        return (
                          <div
                            key={idx}
                            title={`${w.category}: ${w.weightPercentage}%`}
                            className={`${colors[idx % colors.length]} transition-all`}
                            style={{ width: `${w.weightPercentage}%` }}
                          />
                        );
                      })}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {course.gradingWeights.map((w, idx) => (
                        <span key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          {w.category} ({w.weightPercentage}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Class Schedule Grid */}
                {course.schedule?.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Class Sessions
                    </div>
                    <div className="space-y-1.5">
                      {course.schedule.map((slot, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {slot.day} &bull; {slot.startTime} - {slot.endTime}
                          </span>
                          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                            <span>{slot.location}</span>
                            <span className="rounded bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.2 font-medium">
                              {slot.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Course Notes snippet if any */}
                {course.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-850/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{course.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-850/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFilterCourse(course.id);
                      setActiveTab('tasks');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    <span>View Tasks ({courseTasks.length})</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  {course.portalUrl && (
                    <a
                      href={course.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>LMS Portal</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openCreateTaskModal(course.id)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Task</span>
                  </button>

                  <button
                    onClick={() => openEditCourseModal(course)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete course "${course.code} - ${course.name}" and all associated assignments?`)) {
                        deleteCourse(course.id);
                      }
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
