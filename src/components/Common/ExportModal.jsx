import React, { useState } from 'react';
import {
  X,
  Download,
  Upload,
  Calendar,
  FileJson,
  User,
  GraduationCap,
  Check,
  RotateCcw
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { downloadICS, exportJSON } from '../../utils/calendarExport';

export default function ExportModal() {
  const {
    isExportOpen,
    setIsExportOpen,
    tasks,
    courses,
    profile,
    setProfile,
    studyLogs,
    resetToSampleData
  } = useTasks();

  const [name, setName] = useState(profile.name || '');
  const [university, setUniversity] = useState(profile.university || '');
  const [major, setMajor] = useState(profile.major || '');
  const [currentSemester, setCurrentSemester] = useState(profile.currentSemester || '');
  const [targetGpa, setTargetGpa] = useState(profile.targetGpa || 3.85);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isExportOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name,
      university,
      major,
      currentSemester,
      targetGpa: Number(targetGpa) || 3.8
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportICS = () => {
    downloadICS(tasks, courses, `${profile.name.replace(/\s+/g, '_')}_Deadlines.ics`);
  };

  const handleExportJSON = () => {
    const backupData = {
      profile,
      courses,
      tasks,
      studyLogs,
      exportedAt: new Date().toISOString()
    };
    exportJSON(backupData, `unitask_backup_${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.tasks && parsed.courses) {
          localStorage.setItem('unitask_academic_data_v1_courses', JSON.stringify(parsed.courses));
          localStorage.setItem('unitask_academic_data_v1_tasks', JSON.stringify(parsed.tasks));
          if (parsed.profile) localStorage.setItem('unitask_academic_data_v1_profile', JSON.stringify(parsed.profile));
          if (parsed.studyLogs) localStorage.setItem('unitask_academic_data_v1_logs', JSON.stringify(parsed.studyLogs));
          window.location.reload();
        } else {
          alert('Invalid backup JSON format.');
        }
      } catch (err) {
        alert('Could not parse JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8 space-y-6">
        <button
          onClick={() => setIsExportOpen(false)}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Data Export, Calendar Sync & Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Export assignments to Google Calendar / Outlook or backup your academic records
          </p>
        </div>

        {/* Export & Sync Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                <Calendar className="h-4 w-4" />
                <span>iCalendar (.ics) Sync</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Sync {tasks.length} assignment deadlines into Google Calendar, Apple Calendar, or Outlook with 24h reminders.
              </p>
            </div>
            <button
              onClick={handleExportICS}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition"
            >
              <Download className="h-4 w-4" />
              <span>Download .ics File</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-850/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                <FileJson className="h-4 w-4 text-emerald-500" />
                <span>JSON Academic Backup</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Complete archive of courses, syllabus weights, tasks, and study session logs.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export JSON</span>
              </button>

              <label className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                <span>Restore</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Student Profile Settings Form */}
        <form onSubmit={handleSaveProfile} className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Student Profile Information
            </h3>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Academic Major
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Semester / Term
              </label>
              <input
                type="text"
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Target GPA (4.0 Scale)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={targetGpa}
                onChange={(e) => setTargetGpa(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
