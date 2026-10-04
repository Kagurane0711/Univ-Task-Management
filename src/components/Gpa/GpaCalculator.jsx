import React, { useState } from 'react';
import {
  Calculator,
  Award,
  Sparkles,
  TrendingUp,
  Info,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  calculateCourseGrade,
  calculateSemesterGpa,
  getGradeFromScore,
  GRADE_SCALE,
  COURSE_COLOR_MAP
} from '../../utils/academicUtils';

export default function GpaCalculator() {
  const { courses, tasks, profile, setProfile } = useTasks();

  // Initial scores from real data
  const initialScores = {};
  courses.forEach(course => {
    const res = calculateCourseGrade(course, tasks);
    initialScores[course.id] = res.currentScore !== null ? res.currentScore : 88;
  });

  // What-If simulated scores state
  const [simulatedScores, setSimulatedScores] = useState(initialScores);

  // Cumulative GPA inputs
  const [prevGpa, setPrevGpa] = useState(3.80);
  const [prevCredits, setPrevCredits] = useState(60);

  const handleScoreChange = (courseId, val) => {
    const num = Math.min(100, Math.max(0, Number(val) || 0));
    setSimulatedScores(prev => ({ ...prev, [courseId]: num }));
  };

  // Calculate simulated semester GPA
  let simulatedPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const credits = Number(course.credits) || 3;
    totalCredits += credits;
    const score = simulatedScores[course.id] !== undefined ? simulatedScores[course.id] : 88;
    const grade = getGradeFromScore(score);
    simulatedPoints += grade.gpa * credits;
  });

  const simulatedSemesterGpa = totalCredits > 0 ? simulatedPoints / totalCredits : 0;

  // Calculate new cumulative GPA
  const totalCareerCredits = prevCredits + totalCredits;
  const newCumulativeGpa = totalCareerCredits > 0
    ? ((prevGpa * prevCredits) + simulatedPoints) / totalCareerCredits
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            GPA Calculator & "What-If" Scenario Simulator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Model hypothetical exam and project scores to see the exact impact on your semester GPA
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulatedScores(initialScores)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Reset to Current Grades
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Simulated Semester GPA */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-5 shadow-sm dark:border-indigo-900/40 dark:from-indigo-950/40 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Projected Term GPA
            </span>
            <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-700 dark:text-indigo-300">
              {simulatedSemesterGpa.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 4.00</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Based on {totalCredits} enrolled credits this semester
          </p>
        </div>

        {/* Card 2: Cumulative GPA */}
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-5 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Estimated Cumulative GPA
            </span>
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
              {newCumulativeGpa.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              ({totalCareerCredits} total credits)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Target Goal: <span className="font-bold text-slate-700 dark:text-slate-200">{profile.targetGpa.toFixed(2)}</span>
          </p>
        </div>

        {/* Card 3: Academic Honors Projection */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Graduation Standing
            </span>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {newCumulativeGpa >= 3.90 ? 'Summa Cum Laude' :
               newCumulativeGpa >= 3.75 ? 'Magna Cum Laude' :
               newCumulativeGpa >= 3.50 ? 'Cum Laude' : 'Good Standing'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {newCumulativeGpa >= 3.50 ? 'Qualifies for Dean’s Honor List' : 'Keep pushing for higher marks'}
          </p>
        </div>
      </div>

      {/* Main 2-Column: Course Simulation & Cumulative Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Course Sliders & Simulators */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Course Performance Simulator
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Adjust sliders to forecast outcomes
            </span>
          </div>

          <div className="space-y-4">
            {courses.map(course => {
              const score = simulatedScores[course.id] !== undefined ? simulatedScores[course.id] : 85;
              const grade = getGradeFromScore(score);
              const colorTheme = COURSE_COLOR_MAP[course.color] || COURSE_COLOR_MAP.indigo;

              return (
                <div
                  key={course.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${colorTheme.badge}`}>
                        {course.code}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {course.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({course.credits} cr)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => handleScoreChange(course.id, e.target.value)}
                        className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                      <span className="text-xs font-bold text-slate-400">%</span>

                      <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${grade.bg} ${grade.color}`}>
                        {grade.letter} ({grade.gpa.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  {/* Slider */}
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={score}
                    onChange={(e) => handleScoreChange(course.id, e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Scale reference & Career Credits */}
        <div className="space-y-6">
          {/* Prior Credits Input */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Prior Academic Record
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Input prior completed semesters to compute cumulative standing:
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Prior Cumulative GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={prevGpa}
                  onChange={(e) => setPrevGpa(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Prior Completed Credit Hours
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={prevCredits}
                  onChange={(e) => setPrevCredits(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 4.0 Standard Grading Scale */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Standard 4.0 Scale
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {GRADE_SCALE.map((g, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-850 px-2.5 py-1.5"
                >
                  <span className={`font-bold ${g.color}`}>{g.letter}</span>
                  <span className="text-slate-500 dark:text-slate-400">{g.min}%+</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">{g.gpa.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
