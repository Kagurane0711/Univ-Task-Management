import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Coffee,
  Brain
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { soundEngine } from '../../utils/audio';

export default function PomodoroModal() {
  const {
    isPomodoroOpen,
    setIsPomodoroOpen,
    pomodoroTargetTaskId,
    setPomodoroTargetTaskId,
    tasks,
    courses,
    addStudyLog,
    triggerCelebration
  } = useTasks();

  const [mode, setMode] = useState('focus'); // focus (25), shortBreak (5), longBreak (15)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState('none'); // none, rain, white_noise, binaural_alpha
  const [ambientVolume, setAmbientVolume] = useState(0.2);

  const timerRef = useRef(null);

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));
  const linkedTask = tasks.find(t => t.id === pomodoroTargetTaskId) || null;
  const linkedCourse = linkedTask ? courseMap[linkedTask.courseId] : (courses[0] || null);

  // Set default time when mode changes
  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'focus') setTimeLeft(25 * 60);
    else if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    else if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  // Timer tick
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Completed timer!
      setIsRunning(false);
      soundEngine.playChime('bell');
      soundEngine.stopAmbient();

      if (mode === 'focus') {
        triggerCelebration();
        // Log 25 minutes of focus
        addStudyLog({
          courseId: linkedCourse?.id || courses[0]?.id || 'course-1',
          taskId: linkedTask?.id || null,
          minutes: 25
        });
        alert('🎉 Focus session complete! Take a well-deserved 5-minute break.');
        switchMode('shortBreak');
      } else {
        alert('Break ended! Ready to dive back into studying?');
        switchMode('focus');
      }
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, mode]);

  // Ambient sound controller
  useEffect(() => {
    if (isRunning && ambientSound !== 'none') {
      soundEngine.startAmbient(ambientSound, ambientVolume);
    } else {
      soundEngine.stopAmbient();
    }

    return () => soundEngine.stopAmbient();
  }, [isRunning, ambientSound]);

  const handleVolumeChange = (vol) => {
    setAmbientVolume(vol);
    soundEngine.setAmbientVolume(vol);
  };

  if (!isPomodoroOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalModeDuration = mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progressPercent = ((totalModeDuration - timeLeft) / totalModeDuration) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.stopAmbient();
            setIsPomodoroOpen(false);
          }}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Brain className="h-3.5 w-3.5" />
            <span>Academic Deep Work Session</span>
          </span>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
            Focus Pomodoro Timer
          </h2>
        </div>

        {/* Mode Switcher */}
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => switchMode('focus')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            5m Short Break
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              mode === 'longBreak'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            15m Long Break
          </button>
        </div>

        {/* Circular Display */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-8 border-slate-100 dark:border-slate-800">
            {/* SVG circle progress */}
            <svg className="absolute inset-0 -rotate-90 h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-indigo-600 transition-all duration-500"
                strokeWidth="7"
                fill="none"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10 text-center">
              <span className="font-mono text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                {formattedTime}
              </span>
              <div className="mt-1 text-xs font-semibold text-slate-400 capitalize">
                {mode === 'focus' ? 'Deep Focus' : 'Recharge Time'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsRunning(prev => !prev)}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition active:scale-95 ${
              isRunning
                ? 'bg-amber-500 shadow-amber-500/25 hover:bg-amber-600'
                : 'bg-indigo-600 shadow-indigo-600/30 hover:bg-indigo-500'
            }`}
          >
            {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1 fill-current" />}
          </button>

          <button
            onClick={() => switchMode(mode)}
            title="Reset Timer"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Assignment Linker */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-850/60">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Linked Task / Assignment
          </label>
          <select
            value={pomodoroTargetTaskId || ''}
            onChange={(e) => setPomodoroTargetTaskId(e.target.value || null)}
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">General University Study (No specific task)</option>
            {tasks.filter(t => t.status !== 'done').map(t => {
              const c = courseMap[t.courseId];
              return (
                <option key={t.id} value={t.id}>
                  [{c?.code || 'ACAD'}] {t.title}
                </option>
              );
            })}
          </select>
        </div>

        {/* Ambient Noise Synthesizer (Zero asset Web Audio) */}
        <div className="mt-4 flex items-center justify-between gap-3 px-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Volume2 className="h-4 w-4" />
            <span className="font-semibold">Ambient Sound:</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="none">Off</option>
              <option value="rain">🌧️ Gentle Rain</option>
              <option value="white_noise">📻 White Noise</option>
              <option value="binaural_alpha">🧠 10Hz Alpha Waves</option>
            </select>

            {ambientSound !== 'none' && (
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-16 accent-indigo-600"
                title="Sound Volume"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
