import React, { useState, useEffect } from 'react';
import { Contact, Search, Filter, Loader2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

const Guardians = () => {
  const [guardians, setGuardians] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const response = await fetch(`${API_URL}/guardians`);
        const result = await response.json();
        setGuardians(result.data || []);
      } catch (error) {
        console.error('Error fetching guardians:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuardians();
  }, [API_URL]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Data Wali Siswa</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola data demografi wali dan orang tua siswa.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari berdasarkan NKK, NIK, atau Nama Wali..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Wali / Orang Tua</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Nomor Kartu Keluarga</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Pendidikan & Pekerjaan</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Terkait Siswa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto h-6 w-6 mb-2 text-sky-500" />
                    Memuat data wali...
                  </td>
                </tr>
              ) : guardians.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data wali.
                  </td>
                </tr>
              ) : (
                guardians.map((guardian) => (
                  <tr key={guardian.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                          <Contact size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{guardian.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">NIK: {guardian.nik}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-600 dark:text-slate-300">{guardian.nkk || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{guardian.occupation?.name || '-'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{guardian.education?.name || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {guardian.students?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {guardian.students.map((s: any) => (
                            <Badge key={s.id} variant="primary">{s.name}</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Guardians;
