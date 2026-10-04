import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  BookOpen,
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  FileText,
  Building,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function ProfilePage() {
  const { profile, setProfile, triggerCelebration } = useTasks();

  // Local form state
  const [formData, setFormData] = useState({ ...profile });
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync form when profile changes
  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      setHasChanges(true);
      setIsSaved(false);
      return updated;
    });
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setProfile(formData);
    setHasChanges(false);
    setIsSaved(true);
    triggerCelebration();

    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  const handleReset = () => {
    setFormData({ ...profile });
    setHasChanges(false);
    setIsSaved(false);
  };

  return (
    <div className="space-y-6 pb-24 relative">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-extrabold text-2xl sm:text-3xl shadow-inner">
                {formData.name ? formData.name.split(' ').slice(0, 2).map(n => n[0]).join('') : 'FA'}
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-indigo-700 flex items-center justify-center" title="Mahasiswa Aktif">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold backdrop-blur-md">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Pascasarjana Untirta &bull; {formData.major || 'S2 Magister Manajemen'}</span>
              </div>
              <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">
                {formData.name || 'Nama Mahasiswa'}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100/90 font-medium">
                NIM: <span className="font-mono font-bold tracking-wider">{formData.studentId}</span> &bull; {formData.concentration || 'Manajemen Stratejik'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="rounded-2xl bg-white/10 border border-white/20 p-3 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Target IPK</span>
              <span className="text-xl font-extrabold text-white">{Number(formData.targetGpa || 3.9).toFixed(2)}</span>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-3 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Target SKS</span>
              <span className="text-xl font-extrabold text-white">{formData.creditGoal || 15} SKS</span>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/20 p-3 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Semester</span>
              <span className="text-xl font-extrabold text-white">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Biodata Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Data Identitas Pribadi */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                1. Data Identitas Pribadi Mahasiswa
              </h2>
              <p className="text-xs text-slate-400">
                Informasi identitas personal dan kontak resmi mahasiswa
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nama Lengkap & Gelar *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Contoh: Fachri Alamsyah, S.E."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nomor Induk Mahasiswa (NIM) *
              </label>
              <input
                type="text"
                required
                value={formData.studentId || ''}
                onChange={(e) => handleChange('studentId', e.target.value)}
                placeholder="Contoh: 7771240018"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold font-mono text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Jenis Kelamin
              </label>
              <select
                value={formData.gender || 'Laki-laki'}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tempat & Tanggal Lahir
              </label>
              <input
                type="text"
                value={formData.birthPlaceDate || ''}
                onChange={(e) => handleChange('birthPlaceDate', e.target.value)}
                placeholder="Contoh: Serang, 14 Juli 1999"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Kampus / Untirta *
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="fachri.alamsyah@untirta.ac.id"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nomor WhatsApp / HP Aktif
              </label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="0812-8923-7718"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Alamat Domisili / Tempat Tinggal
              </label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Contoh: Jl. Raya Serang - Pandeglang Km. 4, Cipocok Jaya, Kota Serang, Banten"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Data Akademik Pascasarjana UNTIRTA */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                2. Data Akademik Pascasarjana UNTIRTA
              </h2>
              <p className="text-xs text-slate-400">
                Data universitas, fakultas, program studi, dan semester tempuh
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Universitas
              </label>
              <input
                type="text"
                value={formData.university || ''}
                onChange={(e) => handleChange('university', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fakultas / Sekolah Pascasarjana
              </label>
              <input
                type="text"
                value={formData.faculty || ''}
                onChange={(e) => handleChange('faculty', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Program Studi
              </label>
              <input
                type="text"
                value={formData.major || ''}
                onChange={(e) => handleChange('major', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Konsentrasi Studi
              </label>
              <select
                value={formData.concentration || 'Manajemen Stratejik & Bisnis Digital'}
                onChange={(e) => handleChange('concentration', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Manajemen Stratejik & Bisnis Digital">Manajemen Stratejik & Bisnis Digital</option>
                <option value="Manajemen Pemasaran & Brand Analytics">Manajemen Pemasaran & Brand Analytics</option>
                <option value="Manajemen Keuangan Korporat & Pasar Modal">Manajemen Keuangan Korporat & Pasar Modal</option>
                <option value="Manajemen Sumber Daya Manusia & Talenta">Manajemen Sumber Daya Manusia & Talenta</option>
                <option value="Manajemen Operasional & Rantai Pasok Berkelanjutan">Manajemen Operasional & Rantai Pasok Berkelanjutan</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Semester Berjalan
              </label>
              <select
                value={formData.currentSemester || 'Semester 2 (T.A. 2026/2027)'}
                onChange={(e) => handleChange('currentSemester', e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Semester 1 (T.A. 2026/2027)">Semester 1 (T.A. 2026/2027)</option>
                <option value="Semester 2 (T.A. 2026/2027)">Semester 2 (T.A. 2026/2027)</option>
                <option value="Semester 3 (T.A. 2027/2028)">Semester 3 (T.A. 2027/2028)</option>
                <option value="Semester 4 (Tesis & Kelulusan)">Semester 4 (Tesis & Kelulusan)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Waktu Kelulusan
              </label>
              <input
                type="text"
                value={formData.targetGraduation || ''}
                onChange={(e) => handleChange('targetGraduation', e.target.value)}
                placeholder="Contoh: Juli 2027 (3 Semester / Fast Track)"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Bimbingan & Riset Tesis S2 */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                3. Bimbingan & Rencana Penelitian Tesis S2
              </h2>
              <p className="text-xs text-slate-400">
                Data dosen pembimbing, topik penelitian tesis, dan target jurnal publikasi
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dosen Pembimbing Utama (Pembimbing I)
                </label>
                <input
                  type="text"
                  value={formData.advisor1 || ''}
                  onChange={(e) => handleChange('advisor1', e.target.value)}
                  placeholder="Prof. Dr. H. Tubagus Ismail, S.E., M.M., Ak., CA."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dosen Pembimbing Pendamping (Pembimbing II)
                </label>
                <input
                  type="text"
                  value={formData.advisor2 || ''}
                  onChange={(e) => handleChange('advisor2', e.target.value)}
                  placeholder="Dr. Sugeng Setyadi, S.E., M.Si."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Judul / Topik Penelitian Rencana Tesis S2
              </label>
              <textarea
                rows={3}
                value={formData.thesisTitle || ''}
                onChange={(e) => handleChange('thesisTitle', e.target.value)}
                placeholder="Tuliskan rancangan judul tesis Anda..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Publikasi Jurnal Ilmiah (Syarat Kelulusan S2)
              </label>
              <input
                type="text"
                value={formData.targetJournal || ''}
                onChange={(e) => handleChange('targetJournal', e.target.value)}
                placeholder="Contoh: Jurnal Manajemen & Bisnis Terindeks SINTA 2 / Scopus Q2"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Target Nilai & Bio Akademik */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                4. Target Capaian Akademik & Catatan Personal
              </h2>
              <p className="text-xs text-slate-400">
                Sasaran Indeks Prestasi Kumulatif (IPK) dan profil ringkas
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target IPK Kelulusan (Skala 4.00)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="3.0"
                  max="4.0"
                  value={formData.targetGpa || 3.90}
                  onChange={(e) => handleChange('targetGpa', Number(e.target.value) || 3.8)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Beban SKS Semester Berjalan
                </label>
                <input
                  type="number"
                  min="6"
                  max="18"
                  value={formData.creditGoal || 15}
                  onChange={(e) => handleChange('creditGoal', Number(e.target.value) || 15)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Bio / Pernyataan Komitmen Akademik
              </label>
              <textarea
                rows={2}
                value={formData.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tuliskan komitmen akademik atau profil singkat Anda..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR (Never moves when scrolled up or down) */}
        <div className="sticky bottom-14 md:bottom-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-200">
          <div className="flex items-center gap-3">
            {isSaved ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Biodata Berhasil Disimpan & Tersinkronisasi!</span>
              </div>
            ) : hasChanges ? (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>Ada perubahan biodata yang belum disimpan</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Portal Biodata Mahasiswa S2 Untirta &bull; Tersimpan Otomatis</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasChanges}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Perubahan Biodata</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
