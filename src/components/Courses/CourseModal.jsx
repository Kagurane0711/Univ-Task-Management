import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Mail,
  User,
  Layers
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const COLORS = ['indigo', 'cyan', 'amber', 'emerald', 'rose', 'purple'];

export default function CourseModal() {
  const {
    courseModalState,
    closeCourseModal,
    addCourse,
    updateCourse
  } = useTasks();

  const { isOpen, editingCourse } = courseModalState;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [color, setColor] = useState('indigo');
  const [instructorName, setInstructorName] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [instructorOffice, setInstructorOffice] = useState('');
  const [instructorHours, setInstructorHours] = useState('');
  const [portalUrl, setPortalUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Schedule slots
  const [schedule, setSchedule] = useState([]);
  const [slotDay, setSlotDay] = useState('Monday');
  const [slotStart, setSlotStart] = useState('09:00');
  const [slotEnd, setSlotEnd] = useState('10:30');
  const [slotLocation, setSlotLocation] = useState('Hall B2');
  const [slotType, setSlotType] = useState('Lecture');

  // Syllabus weights
  const [weights, setWeights] = useState([]);
  const [weightCategory, setWeightCategory] = useState('');
  const [weightPercent, setWeightPercent] = useState(25);

  useEffect(() => {
    if (editingCourse) {
      setCode(editingCourse.code || '');
      setName(editingCourse.name || '');
      setCredits(editingCourse.credits || 3);
      setColor(editingCourse.color || 'indigo');
      setInstructorName(editingCourse.instructor?.name || '');
      setInstructorEmail(editingCourse.instructor?.email || '');
      setInstructorOffice(editingCourse.instructor?.office || '');
      setInstructorHours(editingCourse.instructor?.officeHours || '');
      setPortalUrl(editingCourse.portalUrl || '');
      setNotes(editingCourse.notes || '');
      setSchedule(editingCourse.schedule || []);
      setWeights(editingCourse.gradingWeights || []);
    } else {
      setCode('');
      setName('');
      setCredits(3);
      setColor('indigo');
      setInstructorName('');
      setInstructorEmail('');
      setInstructorOffice('');
      setInstructorHours('');
      setPortalUrl('');
      setNotes('');
      setSchedule([
        { day: 'Monday', startTime: '10:00', endTime: '11:30', location: 'Hall 101', type: 'Lecture' }
      ]);
      setWeights([
        { category: 'Assignments', weightPercentage: 25 },
        { category: 'Midterm Exam', weightPercentage: 35 },
        { category: 'Final Exam', weightPercentage: 40 }
      ]);
    }
  }, [editingCourse, isOpen]);

  if (!isOpen) return null;

  const handleAddScheduleSlot = () => {
    setSchedule(prev => [
      ...prev,
      {
        day: slotDay,
        startTime: slotStart,
        endTime: slotEnd,
        location: slotLocation || 'TBA',
        type: slotType
      }
    ]);
  };

  const handleRemoveScheduleSlot = (idx) => {
    setSchedule(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddWeight = () => {
    if (!weightCategory.trim()) return;
    setWeights(prev => [
      ...prev,
      { category: weightCategory.trim(), weightPercentage: Number(weightPercent) || 0 }
    ]);
    setWeightCategory('');
    setWeightPercent(20);
  };

  const handleRemoveWeight = (idx) => {
    setWeights(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const payload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      credits: Number(credits) || 3,
      color,
      instructor: {
        name: instructorName.trim(),
        email: instructorEmail.trim(),
        office: instructorOffice.trim(),
        officeHours: instructorHours.trim()
      },
      schedule,
      gradingWeights: weights,
      portalUrl: portalUrl.trim(),
      notes: notes.trim()
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, payload);
    } else {
      addCourse(payload);
    }

    closeCourseModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        <button
          onClick={closeCourseModal}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {editingCourse ? 'Edit Academic Course' : 'Enroll New University Course'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure syllabus weights, credits, lecture timetable, and instructor contact
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Code & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CS301"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-900 focus:border-indigo-500 uppercase dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Course Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Design & Analysis of Algorithms"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Credits & Theme Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Credit Hours
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Color Tag
              </label>
              <div className="mt-1 flex items-center gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 rounded-full transition ${
                      c === 'indigo' ? 'bg-indigo-500' :
                      c === 'cyan' ? 'bg-cyan-500' :
                      c === 'amber' ? 'bg-amber-500' :
                      c === 'emerald' ? 'bg-emerald-500' :
                      c === 'rose' ? 'bg-rose-500' : 'bg-purple-500'
                    } ${color === c ? 'ring-2 ring-offset-2 ring-slate-800 dark:ring-white scale-110' : 'opacity-70'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Instructor Details */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-850/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Instructor & Office Hours
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Professor / Instructor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Robert Vance"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Instructor Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. r.vance@university.edu"
                  value={instructorEmail}
                  onChange={(e) => setInstructorEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Office Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engineering Hall 412"
                  value={instructorOffice}
                  onChange={(e) => setInstructorOffice(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Office Hours
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tue & Thu 14:00 - 16:00"
                  value={instructorHours}
                  onChange={(e) => setInstructorHours(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Schedule Session Builder */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-850/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Weekly Class Sessions ({schedule.length})
            </h4>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={slotDay}
                onChange={(e) => setSlotDay(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <input
                type="time"
                value={slotStart}
                onChange={(e) => setSlotStart(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-xs text-slate-400">-</span>
              <input
                type="time"
                value={slotEnd}
                onChange={(e) => setSlotEnd(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <input
                type="text"
                placeholder="Room / Hall"
                value={slotLocation}
                onChange={(e) => setSlotLocation(e.target.value)}
                className="w-24 rounded-lg border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <select
                value={slotType}
                onChange={(e) => setSlotType(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial">Tutorial</option>
              </select>

              <button
                type="button"
                onClick={handleAddScheduleSlot}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
              >
                Add Slot
              </button>
            </div>

            {schedule.length > 0 && (
              <div className="space-y-1.5">
                {schedule.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-xs"
                  >
                    <span>
                      <strong>{slot.day}</strong> &bull; {slot.startTime} - {slot.endTime} ({slot.location}) &bull; {slot.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveScheduleSlot(idx)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Syllabus Weights Builder */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-850/60 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Syllabus Grade Breakdown ({weights.reduce((a, b) => a + (b.weightPercentage || 0), 0)}% total)
            </h4>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Category (e.g. Weekly Quizzes)"
                value={weightCategory}
                onChange={(e) => setWeightCategory(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <input
                type="number"
                min="1"
                max="100"
                placeholder="Weight %"
                value={weightPercent}
                onChange={(e) => setWeightPercent(e.target.value)}
                className="w-20 rounded-lg border border-slate-200 bg-white p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddWeight}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
              >
                Add Weight
              </button>
            </div>

            {weights.length > 0 && (
              <div className="space-y-1.5">
                {weights.map((w, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-800 px-3 py-1.5 text-xs"
                  >
                    <span>
                      {w.category}: <strong>{w.weightPercentage}%</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWeight(idx)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Portal Link */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Course Portal / LMS Link
            </label>
            <input
              type="url"
              placeholder="https://canvas.instructure.com/courses/..."
              value={portalUrl}
              onChange={(e) => setPortalUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeCourseModal}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 transition"
            >
              {editingCourse ? 'Save Changes' : 'Enroll Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
