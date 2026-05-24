import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Users, Search, Filter, Plus, Loader2, FileText, Download, Upload, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const Teachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL}/teachers`);
      const result = await response.json();
      setTeachers(result.data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [API_URL]);

  const handleExport = () => {
    const exportData = teachers.map((t, index) => ({
      'No': index + 1,
      'NIP': t.nip || '-',
      'Nama Lengkap': t.name,
      'NIK': t.nik || '-',
      'Jenis Kelamin': t.gender === 'L' ? 'Laki-Laki' : 'Perempuan',
      'Tempat Lahir': t.place_of_birth || '-',
      'Tanggal Lahir': t.date_of_birth || '-',
      'Golongan Darah': t.blood_type || '-',
      'Nomor HP': t.phone || '-',
      'Alamat': t.address || '-',
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Guru");
    XLSX.writeFile(wb, "Data_Guru.xlsx");
  };

  const handleDownloadTemplate = () => {
    const templateData = [{
      'NIP': '198001012005011001',
      'Nama Lengkap': 'Contoh Guru, S.Pd',
      'NIK': '3273000000000003',
      'Jenis Kelamin (L/P)': 'L',
      'Tempat Lahir': 'Bandung',
      'Tanggal Lahir (YYYY-MM-DD)': '1980-01-01',
      'Golongan Darah': 'O',
      'Nomor HP': '081234567891',
      'Alamat': 'Jl. Pendidikan No 1'
    }];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Guru");
    XLSX.writeFile(wb, "Template_Guru.xlsx");
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
          nip: row['NIP'] ? String(row['NIP']) : null,
          name: row['Nama Lengkap'],
          nik: row['NIK'] ? String(row['NIK']) : null,
          gender: row['Jenis Kelamin (L/P)'] === 'P' ? 'P' : 'L',
          place_of_birth: row['Tempat Lahir'] || null,
          date_of_birth: row['Tanggal Lahir (YYYY-MM-DD)'] || null,
          blood_type: row['Golongan Darah'] || null,
          phone: row['Nomor HP'] ? String(row['Nomor HP']) : null,
          address: row['Alamat'] || null,
        }));

        const response = await fetch(`${API_URL}/teachers/import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ data: formattedData }),
        });
        
        const result = await response.json();
        alert(result.message || 'Proses import selesai.');
        fetchTeachers();
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Data Guru</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola data demografi dan tenaga pendidik.</p>
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
          <button 
            onClick={() => navigate('/teachers/add')} 
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium transition-colors text-sm flex items-center gap-2"
          >
            <Plus size={18} /> Tambah Guru
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari berdasarkan NIP, NIK, atau Nama..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Profil Guru</th>
                <th className="px-6 py-4 font-semibold">NIP / NIK</th>
                <th className="px-6 py-4 font-semibold">Kontak</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto h-6 w-6 mb-2 text-sky-500" />
                    Memuat data guru...
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data guru.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold shrink-0">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{teacher.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{teacher.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-slate-700 dark:text-slate-300">{teacher.nip || '-'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">NIK: {teacher.nik}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 dark:text-slate-300">{teacher.phone || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/teachers/${teacher.id}`)}
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

export default Teachers;
