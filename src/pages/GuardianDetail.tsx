import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, Users } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

const GuardianDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guardian, setGuardian] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profil' | 'anak'>('profil');
  
  // Edit State
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  const fetchGuardianDetail = async () => {
    try {
      const response = await fetch(`${API_URL}/guardians/${id}`);
      const result = await response.json();
      setGuardian(result.data);
      setEditForm({
        name: result.data.name,
        nik: result.data.nik || '',
        phone: result.data.phone || '',
        relationship: result.data.relationship || 'Wali',
      });
    } catch (error) {
      console.error('Error fetching guardian detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardianDetail();
  }, [id, API_URL]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/guardians/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const result = await response.json();
      if (result.success) {
        alert('Profil wali berhasil diperbarui!');
        fetchGuardianDetail();
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
        <p className="text-slate-500">Memuat profil wali...</p>
      </div>
    );
  }

  if (!guardian) {
    return <div className="p-6 text-center text-rose-500">Data wali tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/guardians')} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{guardian.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Status: {guardian.relationship || 'Wali'} • {guardian.students?.length || 0} Tanggungan Siswa</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button 
          onClick={() => setActiveTab('profil')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'profil' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Profil Demografi
        </button>
        <button 
          onClick={() => setActiveTab('anak')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'anak' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Daftar Anak / Siswa
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profil' ? (
        <Card className="p-6 space-y-6 max-w-4xl">
          <h3 className="text-lg font-semibold border-b border-slate-100 dark:border-slate-800 pb-3">Edit Data Wali</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
              <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">NIK Wali</label>
              <input type="text" value={editForm.nik} onChange={e => setEditForm({...editForm, nik: e.target.value.replace(/\D/g, '').slice(0, 16)})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-mono text-sm dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nomor Telepon / WA</label>
              <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status Hubungan</label>
              <select value={editForm.relationship} onChange={e => setEditForm({...editForm, relationship: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none dark:text-slate-200">
                <option value="Ayah">Ayah</option>
                <option value="Ibu">Ibu</option>
                <option value="Wali">Wali</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center gap-2">
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Simpan Profil Wali
            </button>
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          {guardian.students && guardian.students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-4 font-semibold">NIS</th>
                    <th className="px-5 py-4 font-semibold">Nama Anak / Siswa</th>
                    <th className="px-5 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800">
                  {guardian.students.map((student: any) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-medium">{student.nis}</td>
                      <td className="px-5 py-3.5">{student.name}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => navigate(`/students/${student.id}`)} className="text-sky-600 font-medium hover:text-sky-800">Lihat Siswa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500">
              <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-700">Belum Ada Siswa</h3>
              <p className="text-sm mt-1">Wali ini belum terhubung dengan siswa manapun.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default GuardianDetail;
