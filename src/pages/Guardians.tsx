import React, { useState, useEffect } from 'react';
import { Contact, Search, Filter, Loader2, Edit, Download, Upload, FileText } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const Guardians = () => {
  const navigate = useNavigate();
  const [guardians, setGuardians] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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

  useEffect(() => {
    fetchGuardians();
  }, [API_URL]);

  const handleExport = () => {
    const exportData = guardians.map((g, index) => ({
      'No': index + 1,
      'Nama Lengkap Wali': g.name,
      'NIK Wali': g.nik || '-',
      'Nomor Telepon/WA': g.phone || '-',
      'Status Hubungan': g.relationship || 'Wali',
      'Pendidikan': g.education?.name || '-',
      'Pekerjaan': g.occupation?.name || '-',
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Wali");
    XLSX.writeFile(wb, "Data_Wali.xlsx");
  };

  const handleDownloadTemplate = () => {
    const templateData = [{
      'Nama Lengkap Wali': 'Contoh Wali',
      'NIK Wali': '3273000000000002',
      'Nomor Telepon/WA': '081234567890',
      'Status Hubungan (Ayah/Ibu/Wali)': 'Ayah',
    }];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Wali");
    XLSX.writeFile(wb, "Template_Wali.xlsx");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const formattedData = data.map((row: any) => ({
          name: row['Nama Lengkap Wali'],
          nik: row['NIK Wali'] ? String(row['NIK Wali']) : null,
          phone: row['Nomor Telepon/WA'] ? String(row['Nomor Telepon/WA']) : null,
          relationship: row['Status Hubungan (Ayah/Ibu/Wali)'] || 'Wali',
        }));

        const response = await fetch(`${API_URL}/guardians/import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ data: formattedData }),
        });
        
        const result = await response.json();
        alert(result.message || 'Proses import selesai.');
        fetchGuardians();
      } catch (error) {
        console.error(error);
        alert('Gagal memproses file Excel. Pastikan format sesuai template.');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Data Wali Siswa</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola data demografi wali dan orang tua siswa.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={handleDownloadTemplate}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors text-sm flex items-center gap-2"
          >
            <FileText size={18} /> Template
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 font-medium transition-colors text-sm flex items-center gap-2"
          >
            <Download size={18} /> Export
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="px-4 py-2 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-400 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-500/20 font-medium transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isImporting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />} 
            Import
          </button>
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
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status Hubungan</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Pendidikan & Pekerjaan</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Terkait Siswa</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Aksi</th>
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
                      <span className="font-medium text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{guardian.relationship || 'Wali'}</span>
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
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/guardians/${guardian.id}`)}
                        className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-medium px-3 py-1.5 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Edit size={16} /> Detail
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

export default Guardians;
