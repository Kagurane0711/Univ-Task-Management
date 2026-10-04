import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { initialCourses, initialTasks, initialProfile, initialStudyLogs } from '../data/initialData';
import { soundEngine } from '../utils/audio';

const TaskContext = createContext();

const STORAGE_KEY = 'unitask_untirta_mm_v1';

export function TaskProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('unitask_theme') || 'dark';
  });

  // Active navigation view
  const [activeTab, setActiveTab] = useState('dashboard');

  // Main state with localStorage persistence
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_courses`);
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [studyLogs, setStudyLogs] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : initialStudyLogs;
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, course, weight

  // Modals state
  const [taskModalState, setTaskModalState] = useState({ isOpen: false, editingTask: null, defaultCourseId: null });
  const [courseModalState, setCourseModalState] = useState({ isOpen: false, editingCourse: null });
  const [viewingTask, setViewingTask] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [pomodoroTargetTaskId, setPomodoroTargetTaskId] = useState(null);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('unitask_theme', theme);
  }, [theme]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(studyLogs));
  }, [studyLogs]);

  // Global Keyboard Shortcuts (Ctrl+K for search, N for new task, P for pomodoro)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        openCreateTaskModal();
      } else if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsPomodoroOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Trigger celebration animation
  const triggerCelebration = () => {
    soundEngine.playChime('success');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 }
    });
  };

  // --- Task CRUD ---
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      completedAt: taskData.status === 'done' ? new Date().toISOString() : null,
      subtasks: taskData.subtasks || [],
      tags: taskData.tags || [],
      links: taskData.links || [],
      groupMembers: taskData.groupMembers || [],
      loggedMinutes: taskData.loggedMinutes || 0
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isNowDone = updates.status === 'done' && t.status !== 'done';
        if (isNowDone) {
          triggerCelebration();
          updates.completedAt = new Date().toISOString();
        } else if (updates.status && updates.status !== 'done') {
          updates.completedAt = null;
        }
        return { ...t, ...updates };
      }
      return t;
    }));

    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask(null);
    }
  };

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    updateTask(taskId, { status: newStatus });
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubs = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
        // If all subtasks are checked and task wasn't done, prompt or celebrate
        const allCompleted = updatedSubs.length > 0 && updatedSubs.every(s => s.completed);
        const updates = { subtasks: updatedSubs };
        if (allCompleted && t.status !== 'done') {
          updates.status = 'done';
          triggerCelebration();
        }
        return { ...t, ...updates };
      }
      return t;
    }));

    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask(prev => ({
        ...prev,
        subtasks: prev.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s)
      }));
    }
  };

  const moveTaskStatus = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  // --- Course CRUD ---
  const addCourse = (courseData) => {
    const newCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      schedule: courseData.schedule || [],
      gradingWeights: courseData.gradingWeights || []
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (courseId, updates) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updates } : c));
    if (viewingCourse && viewingCourse.id === courseId) {
      setViewingCourse(prev => ({ ...prev, ...updates }));
    }
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    // Optional: remove tasks associated with this course or keep them
    setTasks(prev => prev.filter(t => t.courseId !== courseId));
    if (viewingCourse && viewingCourse.id === courseId) {
      setViewingCourse(null);
    }
  };

  // --- Study Sessions (Pomodoro) ---
  const addStudyLog = (logData) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      ...logData
    };
    setStudyLogs(prev => [newLog, ...prev]);

    // Also update task logged minutes
    if (logData.taskId && logData.minutes) {
      setTasks(prev => prev.map(t => {
        if (t.id === logData.taskId) {
          return { ...t, loggedMinutes: (t.loggedMinutes || 0) + logData.minutes };
        }
        return t;
      }));
    }
  };

  // Reset to default sample data
  const resetToSampleData = () => {
    setCourses(initialCourses);
    setTasks(initialTasks);
    setProfile(initialProfile);
    setStudyLogs(initialStudyLogs);
  };

  // Modal helpers
  const openCreateTaskModal = (defaultCourseId = null) => {
    setTaskModalState({ isOpen: true, editingTask: null, defaultCourseId });
  };

  const openEditTaskModal = (task) => {
    setTaskModalState({ isOpen: true, editingTask: task, defaultCourseId: task.courseId });
  };

  const closeTaskModal = () => {
    setTaskModalState({ isOpen: false, editingTask: null, defaultCourseId: null });
  };

  const openCreateCourseModal = () => {
    setCourseModalState({ isOpen: true, editingCourse: null });
  };

  const openEditCourseModal = (course) => {
    setCourseModalState({ isOpen: true, editingCourse: course });
  };

  const closeCourseModal = () => {
    setCourseModalState({ isOpen: false, editingCourse: null });
  };

  const startPomodoroForTask = (taskId) => {
    setPomodoroTargetTaskId(taskId);
    setIsPomodoroOpen(true);
  };

  return (
    <TaskContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        courses,
        tasks,
        profile,
        setProfile,
        studyLogs,
        searchQuery,
        setSearchQuery,
        filterCourse,
        setFilterCourse,
        filterCategory,
        setFilterCategory,
        filterPriority,
        setFilterPriority,
        filterStatus,
        setFilterStatus,
        sortBy,
        setSortBy,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        toggleSubtask,
        moveTaskStatus,
        addCourse,
        updateCourse,
        deleteCourse,
        addStudyLog,
        resetToSampleData,
        taskModalState,
        openCreateTaskModal,
        openEditTaskModal,
        closeTaskModal,
        courseModalState,
        openCreateCourseModal,
        openEditCourseModal,
        closeCourseModal,
        viewingTask,
        setViewingTask,
        viewingCourse,
        setViewingCourse,
        isSearchOpen,
        setIsSearchOpen,
        isExportOpen,
        setIsExportOpen,
        isPomodoroOpen,
        setIsPomodoroOpen,
        pomodoroTargetTaskId,
        setPomodoroTargetTaskId,
        startPomodoroForTask,
        triggerCelebration
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
