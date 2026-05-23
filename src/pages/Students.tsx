import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Users, Search, Filter, CheckCircle2, XCircle, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${API_URL}/students`);
        const result = await response.json();
        setStudents(result.data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [API_URL]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Data Siswa</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola data demografi dan status kehadiran siswa.</p>
        </div>
        <button 
          onClick={() => navigate('/students/add')}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm shadow-sky-600/30 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Tambah Siswa Baru
        </button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Cari nama atau NIS..."
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-40">
              <select className="block w-full appearance-none border border-slate-200 dark:border-slate-600 rounded-lg pl-3 pr-10 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors">
                <option>Semua Kelas</option>
                <option>Kelas 10</option>
                <option>Kelas 11</option>
                <option>Kelas 12</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <Filter size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-4 font-semibold">NIS</th>
                <th className="px-5 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-5 py-4 font-semibold">Kelas</th>
                <th className="px-5 py-4 font-semibold">Total Alpha</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto h-6 w-6 mb-2 text-sky-500" />
                    Memuat data siswa...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Belum ada data siswa.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const spStatus = student.warnings?.length > 0 ? `SP ${student.warnings[0].sp_level}` : 'Aman';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">{student.nis}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">Kelas 10</td>
                      <td className="px-5 py-3.5">
                        <span className={`font-semibold ${student.alpha_count > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                          {student.alpha_count} {student.alpha_count > 0 && 'Hari'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {spStatus === 'Aman' ? (
                          <Badge variant="success">Aman</Badge>
                        ) : (
                          <Badge variant="danger">{spStatus}</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Detail</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Menampilkan total {students.length} entri</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>Sebelumnya</button>
            <button className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors">1</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>Selanjutnya</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Students;
