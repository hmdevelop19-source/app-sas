import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { ArrowLeft, Save, User, Users, MapPin, Info, Loader2 } from 'lucide-react';

interface ParsedNikData {
  gender: string;
  date_of_birth: string;
  region: {
    province: string;
    regency: string;
    district: string;
  };
}

const AddStudent = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  // --- Student State ---
  const [studentNik, setStudentNik] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentDob, setStudentDob] = useState('');
  const [studentGender, setStudentGender] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [studentProvince, setStudentProvince] = useState('');
  const [studentRegency, setStudentRegency] = useState('');
  const [studentDistrict, setStudentDistrict] = useState('');
  const [studentVillage, setStudentVillage] = useState('');
  const [isStudentParsing, setIsStudentParsing] = useState(false);

  // --- Guardian State ---
  const [guardianNkk, setGuardianNkk] = useState('');
  const [guardianNik, setGuardianNik] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianDob, setGuardianDob] = useState('');
  const [guardianGender, setGuardianGender] = useState('');
  const [guardianAddress, setGuardianAddress] = useState('');
  const [guardianProvince, setGuardianProvince] = useState('');
  const [guardianRegency, setGuardianRegency] = useState('');
  const [guardianDistrict, setGuardianDistrict] = useState('');
  const [guardianVillage, setGuardianVillage] = useState('');
  const [isGuardianParsing, setIsGuardianParsing] = useState(false);

  const fetchNikData = async (nik: string): Promise<ParsedNikData | null> => {
    try {
      const response = await fetch(`${API_URL}/utils/parse-nik?nik=${nik}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error parsing NIK:', error);
      return null;
    }
  };

  const handleStudentNikChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setStudentNik(val);
    
    if (val.length === 16) {
      setIsStudentParsing(true);
      const data = await fetchNikData(val);
      if (data) {
        setStudentDob(data.date_of_birth || '');
        setStudentGender(data.gender || '');
        setStudentProvince(data.region.province || '');
        setStudentRegency(data.region.regency || '');
        setStudentDistrict(data.region.district || '');
      }
      setIsStudentParsing(false);
    }
  };

  const handleGuardianNikChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setGuardianNik(val);
    
    if (val.length === 16) {
      setIsGuardianParsing(true);
      const data = await fetchNikData(val);
      if (data) {
        setGuardianDob(data.date_of_birth || '');
        setGuardianGender(data.gender || '');
        setGuardianProvince(data.region.province || '');
        setGuardianRegency(data.region.regency || '');
        setGuardianDistrict(data.region.district || '');
      }
      setIsGuardianParsing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/students')}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pendaftaran Siswa Baru</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lengkapi data demografi sesuai dengan Kartu Keluarga (KK).</p>
          </div>
        </div>
        <button className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm shadow-sky-600/30 transition-all flex items-center gap-2">
          <Save size={18} />
          Simpan Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Siswa */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
              <User size={24} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Data Pribadi Siswa</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">NIK Siswa (16 Digit)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={studentNik}
                  onChange={handleStudentNikChange}
                  placeholder="Masukkan 16 digit NIK..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200"
                />
                {isStudentParsing && <Loader2 className="absolute right-3 top-3 animate-spin text-sky-500" size={18} />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
              <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tanggal Lahir</label>
                <input type="date" value={studentDob} readOnly className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 outline-none cursor-not-allowed" title="Terisi otomatis dari NIK" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Jenis Kelamin</label>
                <input type="text" value={studentGender === 'L' ? 'Laki-laki' : studentGender === 'P' ? 'Perempuan' : ''} readOnly className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 outline-none cursor-not-allowed" placeholder="Otomatis" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Agama</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200">
                  <option value="">Pilih Agama</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Gol. Darah</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200">
                  <option value="">Pilih</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alamat Lengkap</label>
              <textarea 
                value={studentAddress} 
                onChange={e => setStudentAddress(e.target.value)} 
                rows={3}
                placeholder="Alamat tempat tinggal Siswa..." 
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 resize-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Provinsi</label>
                <input type="text" value={studentProvince} onChange={e => setStudentProvince(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" placeholder="Terisi Otomatis..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kabupaten / Kota</label>
                <input type="text" value={studentRegency} onChange={e => setStudentRegency(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" placeholder="Terisi Otomatis..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kecamatan</label>
                <input type="text" value={studentDistrict} onChange={e => setStudentDistrict(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" placeholder="Terisi Otomatis..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kelurahan / Desa</label>
                <input type="text" value={studentVillage} onChange={e => setStudentVillage(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" placeholder="Input Manual" />
              </div>
            </div>
          </div>
        </Card>

        {/* Kolom Wali */}
        <Card className="p-6 border-t-4 border-t-amber-500">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
              <Users size={24} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Data Keluarga / Wali</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nomor Kartu Keluarga (NKK)</label>
              <input type="text" value={guardianNkk} onChange={e => setGuardianNkk(e.target.value.replace(/\D/g, '').slice(0, 16))} placeholder="16 Digit NKK..." className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 font-mono text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">NIK Wali (Kepala Keluarga / Terkait)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={guardianNik}
                  onChange={handleGuardianNikChange}
                  placeholder="Masukkan 16 digit NIK Wali..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200"
                />
                {isGuardianParsing && <Loader2 className="absolute right-3 top-3 animate-spin text-amber-500" size={18} />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap Wali</label>
              <input type="text" value={guardianName} onChange={e => setGuardianName(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pendidikan Terakhir</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200">
                  <option value="">Pilih</option>
                  <option value="SD">SD/Sederajat</option>
                  <option value="SMP">SMP/Sederajat</option>
                  <option value="SMA">SMA/Sederajat</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1/D4</option>
                  <option value="S2">S2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pekerjaan</label>
                <input type="text" placeholder="Misal: Wiraswasta" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alamat Lengkap</label>
              <textarea 
                value={guardianAddress} 
                onChange={e => setGuardianAddress(e.target.value)} 
                rows={3}
                placeholder="Kosongkan jika sama dengan alamat Siswa..." 
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 resize-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Provinsi</label>
                <input type="text" value={guardianProvince} onChange={e => setGuardianProvince(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" placeholder="Terisi Otomatis..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kabupaten / Kota</label>
                <input type="text" value={guardianRegency} onChange={e => setGuardianRegency(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" placeholder="Terisi Otomatis..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kecamatan</label>
                <input type="text" value={guardianDistrict} onChange={e => setGuardianDistrict(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" placeholder="Terisi Otomatis..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kelurahan / Desa</label>
                <input type="text" value={guardianVillage} onChange={e => setGuardianVillage(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" placeholder="Input Manual" />
              </div>
            </div>

            <div>
              <div className="bg-sky-50 dark:bg-sky-900/30 p-3 rounded-lg flex gap-3 mt-4">
                <Info className="text-sky-600 dark:text-sky-400 shrink-0" size={20} />
                <p className="text-xs text-sky-800 dark:text-sky-300">
                  Pastikan 16 digit NIK dimasukkan dengan benar. Tanggal lahir dan region akan otomatis terisi untuk mempercepat pendataan.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddStudent;
