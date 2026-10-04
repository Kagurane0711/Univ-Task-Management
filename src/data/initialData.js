// Dataset Akademik S2 Magister Manajemen (MM) Universitas Sultan Ageng Tirtayasa (UNTIRTA)

const now = new Date();

function getRelativeDate(offsetDays, hours = 23, minutes = 59) {
  const d = new Date(now);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export const initialProfile = {
  name: "Fachri Alamsyah, S.E.",
  email: "fachri.alamsyah@untirta.ac.id",
  university: "Universitas Sultan Ageng Tirtayasa",
  faculty: "Fakultas Ekonomi dan Bisnis (FEB)",
  major: "S2 Magister Manajemen (MM)",
  studentId: "7771240018",
  currentSemester: "Semester 2 (T.A. 2026/2027)",
  targetGpa: 3.90,
  creditGoal: 15,
  concentration: "Manajemen Stratejik & Bisnis Digital"
};

export const initialCourses = [
  {
    id: "course-1",
    code: "MM6101",
    name: "Manajemen Stratejik & Kepemimpinan Bisnis",
    credits: 3,
    color: "indigo",
    instructor: {
      name: "Prof. Dr. H. Tubagus Ismail, S.E., M.M., Ak., CA.",
      email: "tubagus.ismail@untirta.ac.id",
      office: "Gedung Pascasarjana Pakupatan Lt. 3, R. 302",
      officeHours: "Jumat & Sabtu 15:00 - 16:30 WIB"
    },
    schedule: [
      { day: "Friday", startTime: "16:30", endTime: "19:00", location: "Gedung Pascasarjana R. 302 (Pakupatan)", type: "Kuliah & Studi Kasus" }
    ],
    gradingWeights: [
      { category: "Analisis Studi Kasus Komprehensif", weightPercentage: 20 },
      { category: "Presentasi Kelompok & Diskusi", weightPercentage: 20 },
      { category: "Ujian Tengah Semester (UTS)", weightPercentage: 25 },
      { category: "Paper Rencana Strategis Korporasi", weightPercentage: 35 }
    ],
    portalUrl: "https://spada.untirta.ac.id",
    notes: "Rujukan: Wheelen & Hunger (Strategic Management). Fokus analisis eksternal/internal industri Banten dan BUMN manufaktur Cilegon."
  },
  {
    id: "course-2",
    code: "MM6102",
    name: "Manajemen Pemasaran Stratejik & Digital Branding",
    credits: 3,
    color: "cyan",
    instructor: {
      name: "Dr. Hj. Liza Mumtazah Damayanti, S.E., M.M.",
      email: "liza.mumtazah@untirta.ac.id",
      office: "Smart Classroom FEB Sindangsari Lt. 2",
      officeHours: "Sabtu 07:30 - 08:30 WIB"
    },
    schedule: [
      { day: "Saturday", startTime: "08:30", endTime: "11:00", location: "Smart Classroom FEB Sindangsari", type: "Kuliah & Workshop" }
    ],
    gradingWeights: [
      { category: "Critical Journal Review (Scopus)", weightPercentage: 20 },
      { category: "Analisis Kampanye Digital Brand", weightPercentage: 25 },
      { category: "Ujian Tengah Semester (UTS)", weightPercentage: 25 },
      { category: "Proposal Strategi Pemasaran Digital", weightPercentage: 30 }
    ],
    portalUrl: "https://spada.untirta.ac.id",
    notes: "Omnichannel customer journey, big data marketing analytics, brand equity, dan strategi pertumbuhan UMKM unggulan Provinsi Banten."
  },
  {
    id: "course-3",
    code: "MM6103",
    name: "Manajemen Keuangan Korporat & Valuasi Bisnis",
    credits: 3,
    color: "emerald",
    instructor: {
      name: "Dr. H. M. Husni Thamrin, S.E., M.M.",
      email: "husni.thamrin@untirta.ac.id",
      office: "Gedung Pascasarjana Pakupatan Lt. 3, R. 304",
      officeHours: "Sabtu 13:45 - 15:00 WIB"
    },
    schedule: [
      { day: "Saturday", startTime: "11:15", endTime: "13:45", location: "Lab Finansial Pascasarjana Pakupatan", type: "Kuliah & Modeling Lab" }
    ],
    gradingWeights: [
      { category: "Tugas Modeling DCF & Lapkeu", weightPercentage: 20 },
      { category: "Analisis Rasio & Struktur Modal", weightPercentage: 20 },
      { category: "Ujian Tengah Semester (UTS)", weightPercentage: 25 },
      { category: "Makalah Valuasi Merger & Akuisisi", weightPercentage: 35 }
    ],
    portalUrl: "https://spada.untirta.ac.id",
    notes: "Discounted Cash Flow (DCF), WACC, restrukturisasi permodalan, analisis kelayakan investasi industri pelabuhan & energi."
  },
  {
    id: "course-4",
    code: "MM6104",
    name: "Metodologi Penelitian Manajemen & Kolokium Tesis",
    credits: 3,
    color: "amber",
    instructor: {
      name: "Dr. Sugeng Setyadi, S.E., M.Si.",
      email: "sugeng.setyadi@untirta.ac.id",
      office: "Auditorium Pascasarjana Sindangsari Lt. 2",
      officeHours: "Jumat 15:30 - 17:00 WIB"
    },
    schedule: [
      { day: "Friday", startTime: "19:15", endTime: "21:45", location: "Auditorium Pascasarjana Sindangsari", type: "Seminar & Kolokium" }
    ],
    gradingWeights: [
      { category: "Matriks Keterbaruan Riset (Research Gap)", weightPercentage: 20 },
      { category: "Review 15 Artikel Jurnal Bereputasi", weightPercentage: 20 },
      { category: "Ujian Konseptual Metodologi (UTS)", weightPercentage: 25 },
      { category: "Draft Proposal Tesis Bab 1-3", weightPercentage: 35 }
    ],
    portalUrl: "https://spada.untirta.ac.id",
    notes: "Riset kuantitatif SEM-PLS (SmartPLS 4) dan kualitatif. Target luaran publikasi ilmiah terindeks SINTA 2 / Scopus."
  },
  {
    id: "course-5",
    code: "MM6105",
    name: "Manajemen SDM Stratejik & Kepemimpinan Jawara",
    credits: 3,
    color: "rose",
    instructor: {
      name: "Dr. R. Deni Muhammad Danial, S.Sos., M.M.",
      email: "deni.danial@untirta.ac.id",
      office: "Gedung Pascasarjana Pakupatan Lt. 3, R. 301",
      officeHours: "Sabtu 17:00 - 18:30 WIB"
    },
    schedule: [
      { day: "Saturday", startTime: "14:30", endTime: "17:00", location: "Gedung Pascasarjana R. 301 (Pakupatan)", type: "Kuliah & Diskusi Kasus" }
    ],
    gradingWeights: [
      { category: "Studi Kasus Human Capital Banten", weightPercentage: 20 },
      { category: "Desain Balanced Scorecard & KPI", weightPercentage: 20 },
      { category: "Ujian Tengah Semester (UTS)", weightPercentage: 25 },
      { category: "Paper Akhir Transformasi Budaya", weightPercentage: 35 }
    ],
    portalUrl: "https://spada.untirta.ac.id",
    notes: "Talent analytics, kepemimpinan transformasional berbasis nilai Jawara Untirta (Jujur, Adil, Wibawa, Amanah, Religius, Akuntabel)."
  }
];

export const initialTasks = [
  {
    id: "task-1",
    courseId: "course-1",
    title: "Analisis Studi Kasus Harvard: Strategi Restrukturisasi & Turnaround PT Krakatau Steel",
    category: "assignment",
    description: "Evaluasi implementasi Corporate Turnaround Strategy PT Krakatau Steel (Persero) Tbk Cilegon. Analisis lingkungan PESTEL, Porter's Five Forces industri baja nasional, VRIO framework, dan mitigasi risiko rantai pasok global.",
    dueDate: getRelativeDate(1, 23, 59),
    priority: "urgent",
    status: "in_progress",
    weightPercentage: 10,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 240,
    loggedMinutes: 140,
    subtasks: [
      { id: "sub-1-1", title: "Petakan matriks PESTEL & Porter's Five Forces industri manufaktur Cilegon", completed: true },
      { id: "sub-1-2", title: "Analisis kompetensi inti (VRIO) dan efisiensi blast furnace", completed: true },
      { id: "sub-1-3", title: "Kaji skema restrukturisasi utang & aliansi strategis dengan Krakatau Posco", completed: false },
      { id: "sub-1-4", title: "Susun Executive Summary 5 halaman dan slide presentasi dewan komisaris", completed: false }
    ],
    tags: ["StudiKasus", "ManajemenStratejik", "KrakatauSteel", "Untirta"],
    groupMembers: [],
    links: [
      { title: "Silabus SPADA Untirta", url: "https://spada.untirta.ac.id/mod/assign/view.php?id=6101" },
      { title: "Laporan Keuangan Krakatau Steel (IDX)", url: "https://idx.co.id/perusahaan-tercatat/laporan-keuangan-dan-tahunan" }
    ],
    completedAt: null
  },
  {
    id: "task-2",
    courseId: "course-4",
    title: "Draft Proposal Tesis Bab 1 & Matriks Research Gap Jurnal Scopus",
    category: "project",
    description: "Penyusunan Bab 1 (Latar Belakang Fenomena Bisnis & Rumusan Masalah) serta matriks perbandingan 15 artikel jurnal internasional bereputasi (Scopus Q1/Q2 terbitan 2021-2025) mengenai Dynamic Capabilities dan Kinerja Bisnis UMKM di Banten.",
    dueDate: getRelativeDate(0, 23, 30), // Due Today!
    priority: "urgent",
    status: "in_progress",
    weightPercentage: 15,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 300,
    loggedMinutes: 210,
    subtasks: [
      { id: "sub-2-1", title: "Kumpulkan data BPS Provinsi Banten terkait kinerja sektor UMKM pasca digitalisasi", completed: true },
      { id: "sub-2-2", title: "Susun tabel matriks keterbaruan riset (Research Gap Matrix) 15 jurnal Scopus", completed: true },
      { id: "sub-2-3", title: "Formulasikan novelty penelitian dan theoretical justification", completed: true },
      { id: "sub-2-4", title: "Finalisasi Bab 1 dan daftar pustaka Mendeley APA Style 7th", completed: false }
    ],
    tags: ["ProposalTesis", "ResearchGap", "MetodologiS2", "SmartPLS"],
    groupMembers: [],
    links: [
      { title: "Panduan Penulisan Tesis Pascasarjana FEB Untirta", url: "https://pasca.untirta.ac.id/pedoman-akademik" },
      { title: "Koleksi Scopus ScienceDirect", url: "https://sciencedirect.com" }
    ],
    completedAt: null
  },
  {
    id: "task-3",
    courseId: "course-2",
    title: "Critical Review Jurnal Internasional: Omnichannel Customer Engagement & AI Personalization",
    category: "assignment",
    description: "Critical review artikel Journal of the Academy of Marketing Science (JAMS 2024). Analisis kelebihan/keterbatasan model konseptual, metodologi survei struktural, serta adaptabilitas strategi marketing omnichannel untuk industri ritel Indonesia.",
    dueDate: getRelativeDate(3, 17, 0),
    priority: "high",
    status: "in_progress",
    weightPercentage: 10,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 180,
    loggedMinutes: 90,
    subtasks: [
      { id: "sub-3-1", title: "Bedah metodologi Structural Equation Modeling (CB-SEM) dalam artikel", completed: true },
      { id: "sub-3-2", title: "Evaluasi implikasi manajerial terhadap customer retention dan CLV", completed: false },
      { id: "sub-3-3", title: "Susun makalah telaah kritis 2.000 kata format publikasi", completed: false }
    ],
    tags: ["CriticalReview", "ScopusQ1", "PemasaranStratejik"],
    groupMembers: [],
    links: [
      { title: "Link Repositori Jurnal", url: "https://link.springer.com/journal/11747" }
    ],
    completedAt: null
  },
  {
    id: "task-4",
    courseId: "course-3",
    title: "Financial Valuation Report: Analisis DCF & Proyeksi Valuasi PT Bank Banten Tbk (BEKS)",
    category: "project",
    description: "Tugas pemodelan valuasi korporasi menggunakan metode Discounted Cash Flow (DCF) dan Price to Book Value (PBV). Analisis laporan keuangan audited PT Bank Pembangunan Daerah Banten Tbk (BEKS), estimasi WACC, dan proyeksi Capital Adequacy Ratio (CAR).",
    dueDate: getRelativeDate(6, 11, 0),
    priority: "high",
    status: "todo",
    weightPercentage: 15,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 300,
    loggedMinutes: 45,
    subtasks: [
      { id: "sub-4-1", title: "Normalisasi laporan keuangan 5 tahun terakhir dari IDX", completed: true },
      { id: "sub-4-2", title: "Hitung Cost of Equity (CAPM) dan Cost of Debt (Rd) tertimbang", completed: false },
      { id: "sub-4-3", title: "Buat spreadsheet sensitivitas NPL vs ROA dan target fair value saham", completed: false },
      { id: "sub-4-4", title: "Tulis executive report rekomendasi investasi untuk investor institusi", completed: false }
    ],
    tags: ["ValuasiBisnis", "BankBanten", "DCF", "KeuanganKorporat"],
    groupMembers: ["Fachri Alamsyah", "Rian Satria, S.E."],
    links: [
      { title: "Data IDX Saham BEKS", url: "https://idx.co.id/perusahaan-tercatat/profil-perusahaan-tercatat/detail/BEKS" }
    ],
    completedAt: null
  },
  {
    id: "task-5",
    courseId: "course-1",
    title: "Ujian Tengah Semester (UTS) Komprehensif: Manajemen Stratejik & Corporate Governance",
    category: "midterm",
    description: "Ujian tertulis komprehensif mencakup Bab 1-7: Strategic Direction, Global Competitive Analysis, Corporate Level Strategy, Diversifikasi, dan Penerapan GCG pada BUMN dan BUMD Banten.",
    dueDate: getRelativeDate(8, 16, 30),
    priority: "high",
    status: "todo",
    weightPercentage: 25,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 360,
    loggedMinutes: 60,
    subtasks: [
      { id: "sub-5-1", title: "Pelajari slide kuliah Prof. Tubagus Ismail pertemuan 1-7", completed: true },
      { id: "sub-5-2", title: "Review studi kasus diversifikasi BUMN dan kasus merger Pelindo", completed: false },
      { id: "sub-5-3", title: "Buat rangkuman teori Dynamic Capabilities (Teece, 2007) & Resource-Based View", completed: false }
    ],
    tags: ["UTS", "ManajemenStratejik", "UjianS2"],
    groupMembers: [],
    links: [],
    completedAt: null
  },
  {
    id: "task-6",
    courseId: "course-5",
    title: "Tugas Kelompok: Perancangan Balanced Scorecard & Talent Framework PT Krakatau Bandar Samudera",
    category: "project",
    description: "Penyusunan 4 perspektif Balanced Scorecard (Keuangan, Pelanggan, Proses Bisnis Internal, Pembelajaran & Pertumbuhan) dan cascading KPI untuk unit bisnis pelabuhan curah Merak.",
    dueDate: getRelativeDate(11, 14, 0),
    priority: "medium",
    status: "todo",
    weightPercentage: 15,
    maxScore: 100,
    achievedScore: null,
    estimatedMinutes: 240,
    loggedMinutes: 60,
    subtasks: [
      { id: "sub-6-1", title: "Wawancara studi pendahuluan & telaah struktur organisasi KBS Cigading", completed: true },
      { id: "sub-6-2", title: "Petakan strategic map 4 perspektif Balanced Scorecard", completed: false },
      { id: "sub-6-3", title: "Rancang 9-box talent matrix dan kompetensi inti berorientasi JAWARA", completed: false }
    ],
    tags: ["SDMStratejik", "BalancedScorecard", "TugasKelompok", "Pelabuhan"],
    groupMembers: ["Fachri Alamsyah (Ketua)", "Rina Kusumawati, S.E.", "Aditya Pratama, S.T."],
    links: [],
    completedAt: null
  },
  {
    id: "task-7",
    courseId: "course-1",
    title: "Kuis Kasus 1: Evaluasi Tata Kelola Good Corporate Governance (GCG) BUMD Banten",
    category: "quiz",
    description: "Analisis prinsip Transparansi, Akuntabilitas, Responsibilitas, Independensi, dan Fairness (TARIF) pada entitas BUMD infrastruktur.",
    dueDate: getRelativeDate(-2, 19, 0),
    priority: "medium",
    status: "done",
    weightPercentage: 5,
    maxScore: 100,
    achievedScore: 96,
    estimatedMinutes: 120,
    loggedMinutes: 130,
    subtasks: [
      { id: "sub-7-1", title: "Pelajari regulasi Permendagri No. 118/2018 tentang BUMD", completed: true },
      { id: "sub-7-2", title: "Tulis esai komparasi praktik GCG BUMD", completed: true }
    ],
    tags: ["GCG", "KuisS2", "Graded"],
    groupMembers: [],
    links: [],
    completedAt: getRelativeDate(-2, 18, 30)
  },
  {
    id: "task-8",
    courseId: "course-3",
    title: "Tugas Finansial 1: Analisis Rasio Likuiditas & Solvabilitas Industri Logistik Banten",
    category: "assignment",
    description: "Bedah rasio Current Ratio, Quick Ratio, Debt to Equity Ratio (DER), dan Interest Coverage Ratio pada 5 emiten logistik dan transportasi laut.",
    dueDate: getRelativeDate(-7, 23, 59),
    priority: "medium",
    status: "done",
    weightPercentage: 5,
    maxScore: 100,
    achievedScore: 94,
    estimatedMinutes: 150,
    loggedMinutes: 160,
    subtasks: [
      { id: "sub-8-1", title: "Kompilasi data laporan keuangan 5 emiten sektor transportasi di BEI", completed: true },
      { id: "sub-8-2", title: "Hitung rata-rata industri dan interpretasikan leverage keuangan", completed: true }
    ],
    tags: ["RasioKeuangan", "BEI", "Graded"],
    groupMembers: [],
    links: [],
    completedAt: getRelativeDate(-7, 21, 15)
  }
];

export const initialStudyLogs = [
  { id: "log-1", courseId: "course-1", taskId: "task-1", minutes: 60, timestamp: getRelativeDate(0, 14, 0), date: new Date().toISOString().split('T')[0] },
  { id: "log-2", courseId: "course-1", taskId: "task-1", minutes: 50, timestamp: getRelativeDate(0, 16, 0), date: new Date().toISOString().split('T')[0] },
  { id: "log-3", courseId: "course-4", taskId: "task-2", minutes: 90, timestamp: getRelativeDate(0, 17, 30), date: new Date().toISOString().split('T')[0] },
  { id: "log-4", courseId: "course-4", taskId: "task-2", minutes: 60, timestamp: getRelativeDate(0, 20, 0), date: new Date().toISOString().split('T')[0] },
  { id: "log-5", courseId: "course-2", taskId: "task-3", minutes: 50, timestamp: getRelativeDate(-1, 15, 0), date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: "log-6", courseId: "course-2", taskId: "task-3", minutes: 40, timestamp: getRelativeDate(-1, 19, 0), date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: "log-7", courseId: "course-3", taskId: "task-4", minutes: 45, timestamp: getRelativeDate(-2, 10, 0), date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0] }
];
