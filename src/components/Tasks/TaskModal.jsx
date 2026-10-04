import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Link,
  Users,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function TaskModal() {
  const {
    taskModalState,
    closeTaskModal,
    courses,
    addTask,
    updateTask
  } = useTasks();

  const { isOpen, editingTask, defaultCourseId } = taskModalState;

  // Form State
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [category, setCategory] = useState('assignment');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [weightPercentage, setWeightPercentage] = useState(5);
  const [maxScore, setMaxScore] = useState(100);
  const [achievedScore, setAchievedScore] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(120);
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [tags, setTags] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setCourseId(editingTask.courseId || courses[0]?.id || '');
      setCategory(editingTask.category || 'assignment');
      setPriority(editingTask.priority || 'medium');
      setStatus(editingTask.status || 'todo');
      
      // Format dueDate for datetime-local: YYYY-MM-DDTHH:mm
      if (editingTask.dueDate) {
        const d = new Date(editingTask.dueDate);
        const pad = (n) => String(n).padStart(2, '0');
        const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setDueDate(formatted);
      } else {
        setDueDate('');
      }

      setWeightPercentage(editingTask.weightPercentage || 0);
      setMaxScore(editingTask.maxScore || 100);
      setAchievedScore(editingTask.achievedScore !== null && editingTask.achievedScore !== undefined ? editingTask.achievedScore : '');
      setEstimatedMinutes(editingTask.estimatedMinutes || 60);
      setDescription(editingTask.description || '');
      setSubtasks(editingTask.subtasks || []);
      setTags((editingTask.tags || []).join(', '));
      setGroupMembers((editingTask.groupMembers || []).join(', '));
      setLinks(editingTask.links || []);
    } else {
      // Create mode defaults
      setTitle('');
      setCourseId(defaultCourseId || courses[0]?.id || '');
      setCategory('assignment');
      setPriority('medium');
      setStatus('todo');

      // Default due date: tomorrow at 23:59
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 0, 0);
      const pad = (n) => String(n).padStart(2, '0');
      setDueDate(`${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`);

      setWeightPercentage(5);
      setMaxScore(100);
      setAchievedScore('');
      setEstimatedMinutes(120);
      setDescription('');
      setSubtasks([]);
      setNewSubtaskTitle('');
      setTags('');
      setGroupMembers('');
      setLinks([]);
    }
  }, [editingTask, defaultCourseId, courses]);

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(prev => [
      ...prev,
      { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;
    setLinks(prev => [
      ...prev,
      { title: linkTitle.trim() || 'Reference Link', url: linkUrl.trim() }
    ]);
    setLinkTitle('');
    setLinkUrl('');
  };

  const handleRemoveLink = (idx) => {
    setLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskPayload = {
      title: title.trim(),
      courseId: courseId || courses[0]?.id,
      category,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      weightPercentage: Number(weightPercentage) || 0,
      maxScore: Number(maxScore) || 100,
      achievedScore: achievedScore !== '' ? Number(achievedScore) : null,
      estimatedMinutes: Number(estimatedMinutes) || 0,
      description: description.trim(),
      subtasks,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      groupMembers: groupMembers.split(',').map(m => m.trim()).filter(Boolean),
      links
    };

    if (editingTask) {
      updateTask(editingTask.id, taskPayload);
    } else {
      addTask(taskPayload);
    }

    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        {/* Close Button */}
        <button
          onClick={closeTaskModal}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {editingTask ? 'Edit Assignment / Task' : 'Create New Academic Task'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Specify course, deadline, syllabus weighting, and checklist milestones
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Task / Assignment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Problem Set 4: Dynamic Programming & Knapsack"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Row 1: Course & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Enrolled Course *
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Category / Deliverable Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="assignment">Assignment / Problem Set</option>
                <option value="lab">Lab Practicum</option>
                <option value="project">Project / Group Work</option>
                <option value="quiz">Quiz</option>
                <option value="midterm">Midterm Examination</option>
                <option value="final">Final Examination</option>
                <option value="reading">Required Reading / Prep</option>
                <option value="presentation">Presentation</option>
              </select>
            </div>
          </div>

          {/* Row 2: Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Due Date & Submission Time *
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="urgent">🚨 Urgent</option>
                <option value="high">⚠️ High</option>
                <option value="medium">🔷 Medium</option>
                <option value="low">☕ Low</option>
              </select>
            </div>
          </div>

          {/* Row 3: Weight %, Max Score, Achieved Score */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Weight (% of Course)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="5"
                value={weightPercentage}
                onChange={(e) => setWeightPercentage(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Max Points
              </label>
              <input
                type="number"
                min="1"
                placeholder="100"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Achieved Score
              </label>
              <input
                type="number"
                min="0"
                placeholder="Pending"
                value={achievedScore}
                onChange={(e) => setAchievedScore(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Checklist / Subtasks ({subtasks.length})
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                placeholder="Add subtask step (e.g. Write literature review)..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                Add
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto">
                {subtasks.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs"
                  >
                    <span className="truncate text-slate-700 dark:text-slate-300">
                      {s.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(s.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description & Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Instructions & Notes
            </label>
            <textarea
              rows={2}
              placeholder="Rubric notes, textbook pages, submission requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Group Teammates & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Team Members (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. David (Backend), Nadia (Doc)"
                value={groupMembers}
                onChange={(e) => setGroupMembers(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Algorithms, LaTeX, Lab"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeTaskModal}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 transition"
            >
              {editingTask ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
