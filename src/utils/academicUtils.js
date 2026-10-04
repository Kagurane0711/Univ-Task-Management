// Academic computation helpers, grade converters, and date formatters

export const GRADE_SCALE = [
  { min: 93, letter: 'A', gpa: 4.0, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
  { min: 90, letter: 'A-', gpa: 3.7, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
  { min: 87, letter: 'B+', gpa: 3.3, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/60' },
  { min: 83, letter: 'B', gpa: 3.0, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/60' },
  { min: 80, letter: 'B-', gpa: 2.7, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/60' },
  { min: 77, letter: 'C+', gpa: 2.3, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60' },
  { min: 73, letter: 'C', gpa: 2.0, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60' },
  { min: 70, letter: 'C-', gpa: 1.7, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60' },
  { min: 60, letter: 'D', gpa: 1.0, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/60' },
  { min: 0, letter: 'F', gpa: 0.0, color: 'text-rose-700 dark:text-rose-500', bg: 'bg-rose-100 dark:bg-rose-950' },
];

export function getGradeFromScore(score) {
  if (score === null || score === undefined || isNaN(score)) return { letter: 'N/A', gpa: 0, color: 'text-slate-500', bg: 'bg-slate-100' };
  const rounded = Math.round(score * 10) / 10;
  for (const item of GRADE_SCALE) {
    if (rounded >= item.min) {
      return item;
    }
  }
  return GRADE_SCALE[GRADE_SCALE.length - 1];
}

// Calculate course performance based on graded assignments
export function calculateCourseGrade(course, tasks) {
  const courseTasks = tasks.filter(t => t.courseId === course.id);
  const gradedTasks = courseTasks.filter(t => t.achievedScore !== null && t.achievedScore !== undefined);

  if (gradedTasks.length === 0) {
    return {
      currentScore: null,
      gradedWeightTotal: 0,
      letterGrade: 'N/A',
      gpa: 0,
      completedTasksCount: courseTasks.filter(t => t.status === 'done').length,
      totalTasksCount: courseTasks.length
    };
  }

  let totalWeightedScore = 0;
  let totalGradedWeight = 0;

  gradedTasks.forEach(task => {
    const weight = Number(task.weightPercentage) || 0;
    const score = Number(task.achievedScore) || 0;
    const maxScore = Number(task.maxScore) || 100;
    const percentage = (score / maxScore) * 100;

    if (weight > 0) {
      totalWeightedScore += (percentage * weight) / 100;
      totalGradedWeight += weight;
    } else {
      // If no explicit weight, default weight based on equal distribution
      totalWeightedScore += percentage;
      totalGradedWeight += 1;
    }
  });

  const normalizedPercentage = totalGradedWeight > 0 ? (totalWeightedScore / totalGradedWeight) * 100 : 0;
  const gradeInfo = getGradeFromScore(normalizedPercentage);

  return {
    currentScore: Math.round(normalizedPercentage * 10) / 10,
    gradedWeightTotal: totalGradedWeight,
    letterGrade: gradeInfo.letter,
    gpa: gradeInfo.gpa,
    gradeInfo,
    completedTasksCount: courseTasks.filter(t => t.status === 'done').length,
    totalTasksCount: courseTasks.length
  };
}

// Calculate overall semester GPA from courses and tasks
export function calculateSemesterGpa(courses, tasks) {
  let totalCreditPoints = 0;
  let totalGradedCredits = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const credits = Number(course.credits) || 3;
    totalCredits += credits;
    const result = calculateCourseGrade(course, tasks);

    if (result.currentScore !== null) {
      totalCreditPoints += result.gpa * credits;
      totalGradedCredits += credits;
    }
  });

  const calculatedGpa = totalGradedCredits > 0 ? totalCreditPoints / totalGradedCredits : 0;

  return {
    gpa: Math.round(calculatedGpa * 100) / 100,
    totalCredits,
    gradedCredits: totalGradedCredits
  };
}

// Format relative deadlines and human-friendly badges
export function getDeadlineInfo(dueDateStr, isDone = false) {
  if (!dueDateStr) return { label: 'No deadline', color: 'text-slate-400', isOverdue: false, isDueSoon: false };

  const due = new Date(dueDateStr);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (isDone) {
    return {
      label: 'Completed',
      sublabel: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
      isOverdue: false,
      isDueSoon: false
    };
  }

  if (diffMs < 0) {
    const overdueDays = Math.abs(Math.floor(diffHours / 24));
    const overdueHours = Math.abs(Math.floor(diffHours));
    const label = overdueDays >= 1 ? `Overdue by ${overdueDays}d` : `Overdue by ${overdueHours}h`;
    return {
      label,
      sublabel: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      badgeBg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 animate-pulse',
      isOverdue: true,
      isDueSoon: false
    };
  }

  if (diffHours <= 12) {
    const hours = Math.max(1, Math.round(diffHours));
    return {
      label: `Due in ${hours}h`,
      sublabel: due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badgeBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 font-semibold',
      isOverdue: false,
      isDueSoon: true
    };
  }

  if (diffHours <= 24) {
    return {
      label: 'Due Today',
      sublabel: due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40',
      isOverdue: false,
      isDueSoon: true
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Tomorrow',
      sublabel: due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40',
      isOverdue: false,
      isDueSoon: true
    };
  }

  if (diffDays <= 7) {
    return {
      label: `In ${diffDays} days`,
      sublabel: due.toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' }),
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40',
      isOverdue: false,
      isDueSoon: false
    };
  }

  return {
    label: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    sublabel: due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    isOverdue: false,
    isDueSoon: false
  };
}

export const CATEGORY_META = {
  assignment: { label: 'Assignment', color: 'indigo', icon: 'FileText' },
  lab: { label: 'Lab Practicum', color: 'cyan', icon: 'FlaskConical' },
  project: { label: 'Project', color: 'emerald', icon: 'FolderGit2' },
  quiz: { label: 'Quiz', color: 'amber', icon: 'HelpCircle' },
  midterm: { label: 'Midterm Exam', color: 'rose', icon: 'GraduationCap' },
  final: { label: 'Final Exam', color: 'purple', icon: 'Trophy' },
  reading: { label: 'Reading & Prep', color: 'blue', icon: 'BookOpen' },
  presentation: { label: 'Presentation', color: 'pink', icon: 'Presentation' }
};

export const PRIORITY_META = {
  urgent: { label: 'Urgent', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900', dot: 'bg-rose-500' },
  high: { label: 'High', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900', dot: 'bg-amber-500' },
  medium: { label: 'Medium', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900', dot: 'bg-blue-500' },
  low: { label: 'Low', color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' }
};

export const COURSE_COLOR_MAP = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    border: 'border-indigo-200 dark:border-indigo-800/60',
    text: 'text-indigo-600 dark:text-indigo-400',
    badge: 'bg-indigo-600 text-white',
    ring: 'ring-indigo-500',
    accent: '#6366f1'
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/50',
    border: 'border-cyan-200 dark:border-cyan-800/60',
    text: 'text-cyan-600 dark:text-cyan-400',
    badge: 'bg-cyan-600 text-white',
    ring: 'ring-cyan-500',
    accent: '#06b6d4'
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-200 dark:border-amber-800/60',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-600 text-white',
    ring: 'ring-amber-500',
    accent: '#f59e0b'
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-600 text-white',
    ring: 'ring-emerald-500',
    accent: '#10b981'
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    border: 'border-rose-200 dark:border-rose-800/60',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-600 text-white',
    ring: 'ring-rose-500',
    accent: '#f43f5e'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    border: 'border-purple-200 dark:border-purple-800/60',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-600 text-white',
    ring: 'ring-purple-500',
    accent: '#a855f7'
  }
};
