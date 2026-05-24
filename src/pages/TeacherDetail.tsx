import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, BookOpen, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';

const TeacherDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profil' | 'kelas'>('profil');
  
  // Edit State
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  const fetchTeacherDetail = async () => {
    try {
      const response = await fetch(`${API_URL}/teachers/${id}`);
      const result = await response.json();
      setTeacher(result.data);
      setEditForm({
        name: result.data.name,
        nik: result.data.nik || '',
        nip: result.data.nip || '',
        gender: result.data.gender || 'L',
        phone: result.data.phone || '',
        blood_type: result.data.blood_type || '',
      });
    } catch (error) {
      console.error('Error fetching teacher detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherDetail();
  }, [id, API_URL]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const result = await response.json();
      if (result.success) {
        alert('Profil guru berhasil diperbarui!');
        fetchTeacherDetail();
      } else {
        alert(result.message || 'Gagal memperbarui profil.');
      }
    } catch (error) {
      alert('Terjadi kesalahan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-sky-500 mb-4" size={40} />
        <p className="text-slate-500">Memuat profil guru...</p>
      </div>
    );
  }

  if (!teacher) {
    return <div className="p-6 text-center text-rose-500">Data guru tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/teachers')} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{teacher.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NIP: {teacher.nip || '-'} • NIK: {teacher.nik}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button 
          onClick={() => setActiveTab('profil')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'profil' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Profil & Edit
        </button>
        <button 
          onClick={() => setActiveTab('kelas')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'kelas' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Aktivitas & Mengajar
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profil' ? (
        <Card className="p-6 space-y-6 max-w-4xl">
          <h3 className="text-lg font-semibold border-b border-slate-100 dark:border-slate-800 pb-3">Informasi Pribadi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap & Gelar</label>
              <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">NIP (Opsional)</label>
              <input type="text" value={editForm.nip} onChange={e => setEditForm({...editForm, nip: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-mono text-sm dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">NIK (KTP)</label>
              <input type="text" value={editForm.nik} onChange={e => setEditForm({...editForm, nik: e.target.value.replace(/\D/g, '').slice(0, 16)})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-mono text-sm dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Jenis Kelamin</label>
              <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none dark:text-slate-200">
                <option value="L">Laki-Laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nomor HP/WA</label>
              <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Golongan Darah</label>
              <select value={editForm.blood_type} onChange={e => setEditForm({...editForm, blood_type: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none dark:text-slate-200">
                <option value="">Pilih</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Simpan Profil
            </button>
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="p-6 text-center text-slate-500">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">Data Akademik & Kelas Belum Terhubung</h3>
            <p className="text-sm mt-1">Guru ini belum dijadwalkan mengajar kelas manapun.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeacherDetail;
