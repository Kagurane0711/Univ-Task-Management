import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Plus,
  BookOpen
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { COURSE_COLOR_MAP } from '../../utils/academicUtils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function WeeklySchedule() {
  const { courses, openCreateCourseModal, setActiveTab, setFilterCourse } = useTasks();

  const [activeDayFilter, setActiveDayFilter] = useState('all');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];

  // Flatten all class slots with course info
  const allSlots = [];
  courses.forEach(course => {
    (course.schedule || []).forEach(slot => {
      allSlots.push({
        ...slot,
        course
      });
    });
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Weekly Class & Lab Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Never miss a lecture, lab practicum, or recitation across your semester schedule
          </p>
        </div>

        {/* Day pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveDayFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeDayFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Week
          </button>
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setActiveDayFilter(day)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeDayFilter === day
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              } ${day === todayName ? 'ring-2 ring-indigo-500/40' : ''}`}
            >
              {day.slice(0, 3)} {day === todayName && '•'}
            </button>
          ))}
        </div>
      </div>

      {/* Week Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {DAYS.filter(d => activeDayFilter === 'all' || activeDayFilter === d).map(day => {
          const isToday = day === todayName;
          const daySlots = allSlots
            .filter(slot => slot.day.toLowerCase() === day.toLowerCase())
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={day}
              className={`flex flex-col rounded-2xl border bg-slate-50/60 p-3.5 dark:bg-slate-900/40 min-h-[450px] ${
                isToday
                  ? 'border-indigo-400 dark:border-indigo-600 shadow-sm ring-1 ring-indigo-500/20'
                  : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 dark:border-slate-800/60 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {day}
                  </span>
                  {isToday && (
                    <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      Today
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {daySlots.length} sessions
                </span>
              </div>

              {/* Class Cards */}
              <div className="flex-1 space-y-3">
                {daySlots.length === 0 ? (
                  <div className="py-16 text-center text-xs text-slate-400">
                    No classes scheduled
                  </div>
                ) : (
                  daySlots.map((slot, idx) => {
                    const theme = COURSE_COLOR_MAP[slot.course.color] || COURSE_COLOR_MAP.indigo;

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-3.5 shadow-sm transition hover:shadow-md ${theme.bg} ${theme.border}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${theme.badge}`}>
                            {slot.course.code}
                          </span>
                          <span className="rounded bg-white/80 dark:bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            {slot.type}
                          </span>
                        </div>

                        <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {slot.course.name}
                        </div>

                        <div className="mt-2.5 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>{slot.startTime} - {slot.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{slot.location}</span>
                          </div>
                          {slot.course.instructor?.name && (
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate">
                              <User className="h-3 w-3 text-slate-400" />
                              <span className="truncate">{slot.course.instructor.name}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setFilterCourse(slot.course.id);
                            setActiveTab('tasks');
                          }}
                          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-white/70 dark:bg-slate-800/70 py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition"
                        >
                          <BookOpen className="h-3 w-3" />
                          <span>Assignments</span>
                        </button>
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
