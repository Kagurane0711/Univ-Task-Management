// Utility to generate iCalendar (.ics) files for university tasks and exams

export function generateICS(tasks, courses) {
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]));

  const formatICSDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  let icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UniTask Manager//University Task Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:University Deadlines & Exams',
    'X-WR-TIMEZONE:UTC'
  ];

  tasks.forEach((task) => {
    if (!task.dueDate) return;
    const course = courseMap[task.courseId] || { code: 'ACADEMIC', name: 'Course' };
    const dtStamp = formatICSDate(new Date().toISOString());
    const dtEnd = formatICSDate(task.dueDate);
    
    // Set start 1 hour before due date
    const startDate = new Date(new Date(task.dueDate).getTime() - 60 * 60 * 1000);
    const dtStart = formatICSDate(startDate.toISOString());

    const summary = `[${course.code}] ${task.title}`;
    const description = `Category: ${task.category.toUpperCase()}\\nPriority: ${task.priority.toUpperCase()}\\nCourse: ${course.name}\\nWeight: ${task.weightPercentage || 0}%\\nStatus: ${task.status}\\n\\nNotes: ${(task.description || '').replace(/\n/g, '\\n')}`;

    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:unitask-${task.id}@university.edu`);
    icsLines.push(`DTSTAMP:${dtStamp}`);
    icsLines.push(`DTSTART:${dtStart}`);
    icsLines.push(`DTEND:${dtEnd}`);
    icsLines.push(`SUMMARY:${summary}`);
    icsLines.push(`DESCRIPTION:${description}`);
    icsLines.push(`STATUS:${task.status === 'done' ? 'COMPLETED' : 'CONFIRMED'}`);
    
    // Add Alarm 24 hours prior
    icsLines.push('BEGIN:VALARM');
    icsLines.push('TRIGGER:-PT24H');
    icsLines.push('ACTION:DISPLAY');
    icsLines.push(`DESCRIPTION:Reminder: ${summary} is due in 24 hours!`);
    icsLines.push('END:VALARM');

    icsLines.push('END:VEVENT');
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}

export function downloadICS(tasks, courses, filename = 'university_deadlines.ics') {
  const icsData = generateICS(tasks, courses);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportJSON(data, filename = 'unitask_backup.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
