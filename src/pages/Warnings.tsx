import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { FileText, Download, CheckCircle2, Clock, Loader2 } from 'lucide-react';

const Warnings = () => {
  const [warnings, setWarnings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await fetch(`${API_URL}/students/warnings`);
        const result = await response.json();
        setWarnings(result.data || []);
      } catch (error) {
        console.error('Error fetching warnings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarnings();
  }, [API_URL]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Surat Peringatan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daftar siswa yang mendapatkan SP atas pelanggaran akumulasi Alpha.</p>
        </div>
        <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors flex items-center gap-2">
          <Download size={18} />
          Export Rekap
        </button>
      </div>

      <Card className="p-0 overflow-hidden border-t-4 border-t-amber-400 dark:border-t-amber-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-4 font-semibold">No. Surat</th>
                <th className="px-5 py-4 font-semibold">Nama Siswa</th>
                <th className="px-5 py-4 font-semibold">Kelas</th>
                <th className="px-5 py-4 font-semibold">Level SP</th>
                <th className="px-5 py-4 font-semibold">Tanggal Terbit</th>
                <th className="px-5 py-4 font-semibold">Status TTD</th>
                <th className="px-5 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto h-6 w-6 mb-2 text-sky-500" />
                    Memuat data surat peringatan...
                  </td>
                </tr>
              ) : warnings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    Belum ada surat peringatan.
                  </td>
                </tr>
              ) : (
                warnings.map((warn) => (
                  <tr key={warn.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                      <span className="font-mono text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-400">
                        SP-{warn.id}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium">{warn.student?.name}</td>
                    <td className="px-5 py-3.5">{warn.student?.schoolClass?.name || 'Kelas 10'}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={warn.sp_level === 1 ? 'warning' : 'danger'}>
                        SP {warn.sp_level}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">{new Date(warn.issued_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-5 py-3.5">
                      {warn.signed_by_guardian ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full w-max">
                          <CheckCircle2 size={14} />
                          Ditandatangani
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full w-max">
                          <Clock size={14} />
                          Menunggu TTD
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-medium px-3 py-1.5 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-lg transition-colors">
                        <FileText size={16} />
                        Cetak PDF
                      </button>
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

export default Warnings;
