// Initial sample university courses, tasks, schedule, and student profile

const now = new Date();

function getRelativeDate(offsetDays, hours = 23, minutes = 59) {
  const d = new Date(now);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export const initialProfile = {
  name: "Fachri Rivera",
  email: "fachri07@student.ub.ac.id",
  university: "Brawijaya University",
  faculty: "Faculty of Computer Science",
  major: "Informatics Engineering",
  studentId: "225150201111000",
  currentSemester: "Semester 5 (Fall 2026)",
  targetGpa: 3.85,
  creditGoal: 20
};

export const initialCourses = [
  {
    id: "course-1",
    code: "CS301",
    name: "Design & Analysis of Algorithms",
    credits: 3,
    color: "indigo", // indigo, emerald, amber, rose, cyan, purple
    instructor: {
      name: "Dr. Robert Vance, Ph.D.",
      email: "r.vance@university.edu",
      office: "Engineering Hall 412",
      officeHours: "Tue & Thu 14:00 - 16:00"
    },
    schedule: [
      { day: "Monday", startTime: "09:00", endTime: "10:30", location: "Lecture Hall B2", type: "Lecture" },
      { day: "Wednesday", startTime: "09:00", endTime: "10:30", location: "Lecture Hall B2", type: "Lecture" },
      { day: "Friday", startTime: "13:30", endTime: "15:00", location: "CS Lab 3", type: "Lab" }
    ],
    gradingWeights: [
      { category: "Homework & Problem Sets", weightPercentage: 20 },
      { category: "Lab Practicums", weightPercentage: 20 },
      { category: "Midterm Exam", weightPercentage: 25 },
      { category: "Final Project", weightPercentage: 35 }
    ],
    portalUrl: "https://canvas.instructure.com",
    notes: "Textbook: Introduction to Algorithms (CLRS 4th Ed). Focus on dynamic programming and graph algorithms."
  },
  {
    id: "course-2",
    code: "DS210",
    name: "Database Systems & Engineering",
    credits: 4,
    color: "cyan",
    instructor: {
      name: "Prof. Elena Rostova",
      email: "e.rostova@university.edu",
      office: "Tech Center 208",
      officeHours: "Mon & Wed 11:00 - 12:30"
    },
    schedule: [
      { day: "Tuesday", startTime: "10:00", endTime: "12:00", location: "Auditorium 1", type: "Lecture" },
      { day: "Thursday", startTime: "10:00", endTime: "12:00", location: "Database Lab A", type: "Lab" }
    ],
    gradingWeights: [
      { category: "Weekly Labs", weightPercentage: 25 },
      { category: "Group Project", weightPercentage: 30 },
      { category: "Midterm Exam", weightPercentage: 20 },
      { category: "Final Exam", weightPercentage: 25 }
    ],
    portalUrl: "https://classroom.google.com",
    notes: "PostgreSQL, indexing strategies, B-Trees, transaction concurrency (ACID), and distributed replication."
  },
  {
    id: "course-3",
    code: "MTH202",
    name: "Linear Algebra & Statistics for Computing",
    credits: 3,
    color: "amber",
    instructor: {
      name: "Dr. Marcus Chen",
      email: "m.chen@university.edu",
      office: "Science Complex 105",
      officeHours: "Friday 10:00 - 12:00"
    },
    schedule: [
      { day: "Monday", startTime: "13:00", endTime: "14:30", location: "Math Building 201", type: "Lecture" },
      { day: "Wednesday", startTime: "13:00", endTime: "14:30", location: "Math Building 201", type: "Lecture" }
    ],
    gradingWeights: [
      { category: "Quizzes", weightPercentage: 15 },
      { category: "Assignments", weightPercentage: 25 },
      { category: "Midterm", weightPercentage: 30 },
      { category: "Final Exam", weightPercentage: 30 }
    ],
    portalUrl: "https://moodle.university.edu",
    notes: "Eigenvectors, SVD, Markov chains, Hypothesis testing, and Bayesian inference."
  },
  {
    id: "course-4",
    code: "SE310",
    name: "Software Architecture & Clean Code",
    credits: 3,
    color: "emerald",
    instructor: {
      name: "Prof. Sarah Jenkins",
      email: "s.jenkins@university.edu",
      office: "Software Lab 501",
      officeHours: "Thursday 14:00 - 16:30"
    },
    schedule: [
      { day: "Tuesday", startTime: "13:30", endTime: "15:30", location: "Seminar Room C", type: "Lecture" },
      { day: "Thursday", startTime: "13:30", endTime: "15:30", location: "Software Lab 501", type: "Lab" }
    ],
    gradingWeights: [
      { category: "Code Reviews & Exercises", weightPercentage: 20 },
      { category: "Architecture Milestone 1", weightPercentage: 20 },
      { category: "Term Project Implementation", weightPercentage: 40 },
      { category: "Final Defense Presentation", weightPercentage: 20 }
    ],
    portalUrl: "https://canvas.instructure.com",
    notes: "Microservices vs Modular Monolith, Domain-Driven Design (DDD), Event-Driven Architecture, CI/CD pipeline."
  },
  {
    id: "course-5",
    code: "ENG105",
    name: "Technical Communication & Ethics",
    credits: 2,
    color: "rose",
    instructor: {
      name: "Dr. Amanda Brooks",
      email: "a.brooks@university.edu",
      office: "Humanities Hall 302",
      officeHours: "Wednesday 15:00 - 17:00"
    },
    schedule: [
      { day: "Friday", startTime: "08:30", endTime: "10:30", location: "Humanities 104", type: "Lecture" }
    ],
    gradingWeights: [
      { category: "Research Paper", weightPercentage: 40 },
      { category: "Peer Review", weightPercentage: 20 },
      { category: "Final Presentation", weightPercentage: 40 }
    ],
    portalUrl: "https://blackboard.university.edu",
    notes: "Writing technical research papers, peer reviewing, academic integrity, and AI ethics in software engineering."
  }
];

export const initialTasks = [
  {
    id: "task-1",
    courseId: "course-1",
    title: "Problem Set 4: Dynamic Programming & Knapsack",
    category: "assignment", // assignment, lab, project, quiz, midterm, final, reading, presentation
    description: "Solve problems 16.1 to 16.4 from CLRS. Implement bottom-up tabulation and memoized recursion for unbounded knapsack with time complexity analysis.",
    dueDate: getRelativeDate(1, 23, 59), // Due tomorrow
    priority: "urgent", // low, medium, high, urgent
    status: "in_progress", // todo, in_progress, review, done
    weightPercentage: 5,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 180,
    loggedMinutes: 95,
    subtasks: [
      { id: "sub-1-1", title: "Derive recurrence relation for 0/1 knapsack variant", completed: true },
      { id: "sub-1-2", title: "Write Python implementation and benchmark against naive exponential solution", completed: true },
      { id: "sub-1-3", title: "Plot runtime graphs with matplotlib", completed: false },
      { id: "sub-1-4", title: "Compile LaTeX PDF report with mathematical proofs", completed: false }
    ],
    tags: ["Algorithms", "DP", "LaTeX"],
    groupMembers: [],
    links: [
      { title: "Course Assignment Sheet", url: "https://canvas.instructure.com/assignments/301" },
      { title: "Overleaf Document", url: "https://overleaf.com/project/dp-pset-4" }
    ],
    completedAt: null
  },
  {
    id: "task-2",
    courseId: "course-2",
    title: "Lab 5: PostgreSQL B-Tree Index Optimization & Query Plans",
    category: "lab",
    description: "Analyze EXPLAIN ANALYZE execution trees for a 5-million row synthetic dataset. Compare Sequential Scan vs Bitmap Index Scan vs Index Only Scan.",
    dueDate: getRelativeDate(0, 23, 30), // Due TODAY!
    priority: "urgent",
    status: "in_progress",
    weightPercentage: 5,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 120,
    loggedMinutes: 90,
    subtasks: [
      { id: "sub-2-1", title: "Generate 5M sample e-commerce records using Faker", completed: true },
      { id: "sub-2-2", title: "Profile unindexed slow query execution time", completed: true },
      { id: "sub-2-3", title: "Create composite index on (user_id, order_date DESC)", completed: true },
      { id: "sub-2-4", title: "Fill in markdown report with cost comparisons", completed: false }
    ],
    tags: ["PostgreSQL", "Database", "Performance"],
    groupMembers: [],
    links: [
      { title: "Lab Repository", url: "https://github.com/fachri07/db-lab-5" }
    ],
    completedAt: null
  },
  {
    id: "task-3",
    courseId: "course-4",
    title: "Software Architecture Milestone 2: Microservices Specification & DDD Model",
    category: "project",
    description: "Collaborative team deliverable. Provide C4 model diagrams (Context, Container, Component), bounded contexts, and OpenAPI 3.0 contract specs for the Campus Ride-Sharing system.",
    dueDate: getRelativeDate(4, 18, 0),
    priority: "high",
    status: "in_progress",
    weightPercentage: 15,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 300,
    loggedMinutes: 160,
    subtasks: [
      { id: "sub-3-1", title: "Draft Event Storming domain model for Driver & Rider matching", completed: true },
      { id: "sub-3-2", title: "Generate C4 Container diagram in PlantUML / Mermaid", completed: true },
      { id: "sub-3-3", title: "Define gRPC & REST API proto files in repository", completed: false },
      { id: "sub-3-4", title: "Peer review with team members (David & Nadia)", completed: false },
      { id: "sub-3-5", title: "Submit PDF to Turnitin portal", completed: false }
    ],
    tags: ["Architecture", "Team Project", "DDD", "Microservices"],
    groupMembers: ["Fachri Rivera (Lead)", "David Prasetyo (Backend)", "Nadia Lestari (API Spec)"],
    links: [
      { title: "Team GitHub Repo", url: "https://github.com/fachri07/campus-rideshare-arch" },
      { title: "Figma Architecture Board", url: "https://figma.com/file/architecture-c4" }
    ],
    completedAt: null
  },
  {
    id: "task-4",
    courseId: "course-3",
    title: "Linear Algebra Midterm Exam Preparation",
    category: "midterm",
    description: "Covers Chapters 1-4: Vector spaces, linear transformations, eigenvalues/eigenvectors, and Singular Value Decomposition (SVD). 25% of final grade.",
    dueDate: getRelativeDate(6, 10, 0),
    priority: "high",
    status: "todo",
    weightPercentage: 25,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 360,
    loggedMinutes: 60,
    subtasks: [
      { id: "sub-4-1", title: "Review Gilbert Strang Lecture 15-22 notes", completed: true },
      { id: "sub-4-2", title: "Solve 2024 & 2025 past year exam problem sets", completed: false },
      { id: "sub-4-3", title: "Create one-page handwritten formula cheat-sheet (approved by prof)", completed: false },
      { id: "sub-4-4", title: "Practice Gram-Schmidt orthogonalization timed drill", completed: false }
    ],
    tags: ["Exam", "Math", "SVD"],
    groupMembers: [],
    links: [
      { title: "MIT OCW 18.06 Notes", url: "https://ocw.mit.edu/courses/18-06-linear-algebra" }
    ],
    completedAt: null
  },
  {
    id: "task-5",
    courseId: "course-5",
    title: "Drafting Ethics in AI Research Paper (First Draft)",
    category: "reading",
    description: "Write 1,500-word essay discussing algorithmic bias in credit scoring models and EU AI Act compliance.",
    dueDate: getRelativeDate(8, 23, 59),
    priority: "medium",
    status: "todo",
    weightPercentage: 15,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 180,
    loggedMinutes: 0,
    subtasks: [
      { id: "sub-5-1", title: "Select 3 peer-reviewed case studies from ACM Digital Library", completed: false },
      { id: "sub-5-2", title: "Draft introduction and thesis statement", completed: false },
      { id: "sub-5-3", title: "Synthesize ethical framework comparisons", completed: false }
    ],
    tags: ["Ethics", "Essay", "Writing"],
    groupMembers: [],
    links: [],
    completedAt: null
  },
  {
    id: "task-6",
    courseId: "course-1",
    title: "Quiz 2: Graph Theory & Shortest Path Algorithms",
    category: "quiz",
    description: "In-class 30-minute quiz on Dijkstra, Bellman-Ford, and Floyd-Warshall algorithms including negative cycle detection.",
    dueDate: getRelativeDate(2, 9, 30),
    priority: "high",
    status: "todo",
    weightPercentage: 5,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 120,
    loggedMinutes: 30,
    subtasks: [
      { id: "sub-6-1", title: "Review priority queue implementation in Dijkstra (Fibonacci heap vs Binary heap)", completed: true },
      { id: "sub-6-2", title: "Trace Bellman-Ford step-by-step example manually", completed: false }
    ],
    tags: ["Quiz", "Graphs", "Algorithms"],
    groupMembers: [],
    links: [],
    completedAt: null
  },
  {
    id: "task-7",
    courseId: "course-2",
    title: "Database Project Proposal: High-Concurrency Booking Engine",
    category: "project",
    description: "Submit 5-page initial project proposal with ER diagram, normalized 3NF schemas, and estimated storage requirements.",
    dueDate: getRelativeDate(-2, 23, 59), // Completed 2 days ago
    priority: "medium",
    status: "done",
    weightPercentage: 10,
    maxScore: 100,
    achievedScore: 96,
    estimatedMinutes: 180,
    loggedMinutes: 210,
    subtasks: [
      { id: "sub-7-1", title: "Draw Crow's foot notation ER Diagram", completed: true },
      { id: "sub-7-2", title: "Validate Boyce-Codd Normal Form (BCNF)", completed: true },
      { id: "sub-7-3", title: "Submit PDF to Moodle", completed: true }
    ],
    tags: ["Database", "Proposal", "Graded"],
    groupMembers: ["Fachri Rivera", "Rian Satria"],
    links: [
      { title: "Graded Rubric", url: "https://classroom.google.com/grades/db-proposal" }
    ],
    completedAt: getRelativeDate(-2, 21, 15)
  },
  {
    id: "task-8",
    courseId: "course-1",
    title: "Problem Set 3: Divide and Conquer & Master Theorem",
    category: "assignment",
    description: "Solve recurrence relations using Master Theorem and Substitution Method. Analysis of Strassen's matrix multiplication.",
    dueDate: getRelativeDate(-7, 23, 59), // Completed last week
    priority: "medium",
    status: "done",
    weightPercentage: 5,
    maxScore: 100,
    achievedScore: 92,
    estimatedMinutes: 150,
    loggedMinutes: 140,
    subtasks: [
      { id: "sub-8-1", title: "Solve problems 4.3 through 4.6", completed: true },
      { id: "sub-8-2", title: "Format solutions in LaTeX", completed: true }
    ],
    tags: ["Algorithms", "Graded"],
    groupMembers: [],
    links: [],
    completedAt: getRelativeDate(-7, 19, 45)
  },
  {
    id: "task-9",
    courseId: "course-4",
    title: "Architecture Milestone 1: Domain Analysis & System Context",
    category: "project",
    description: "Core domain models, stakeholder interviews summary, and high-level architectural trade-off analysis.",
    dueDate: getRelativeDate(-12, 17, 0),
    priority: "high",
    status: "done",
    weightPercentage: 15,
    maxScore: 100,
    achievedScore: 95,
    estimatedMinutes: 240,
    loggedMinutes: 250,
    subtasks: [
      { id: "sub-9-1", title: "Complete stakeholder requirement matrix", completed: true },
      { id: "sub-9-2", title: "C4 Level 1 context diagram", completed: true }
    ],
    tags: ["Architecture", "Graded"],
    groupMembers: ["Fachri Rivera (Lead)", "David Prasetyo", "Nadia Lestari"],
    links: [],
    completedAt: getRelativeDate(-12, 15, 30)
  }
];

export const initialStudyLogs = [
  { id: "log-1", courseId: "course-1", taskId: "task-1", minutes: 50, timestamp: getRelativeDate(0, 14, 0), date: new Date().toISOString().split('T')[0] },
  { id: "log-2", courseId: "course-1", taskId: "task-1", minutes: 45, timestamp: getRelativeDate(0, 16, 0), date: new Date().toISOString().split('T')[0] },
  { id: "log-3", courseId: "course-2", taskId: "task-2", minutes: 50, timestamp: getRelativeDate(0, 17, 30), date: new Date().toISOString().split('T')[0] },
  { id: "log-4", courseId: "course-2", taskId: "task-2", minutes: 40, timestamp: getRelativeDate(0, 18, 45), date: new Date().toISOString().split('T')[0] },
  { id: "log-5", courseId: "course-4", taskId: "task-3", minutes: 60, timestamp: getRelativeDate(-1, 15, 0), date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: "log-6", courseId: "course-4", taskId: "task-3", minutes: 50, timestamp: getRelativeDate(-1, 19, 0), date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: "log-7", courseId: "course-3", taskId: "task-4", minutes: 60, timestamp: getRelativeDate(-2, 10, 0), date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0] }
];
