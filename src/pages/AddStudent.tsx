import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { ArrowLeft, Save, User, Users, Info, Loader2 } from 'lucide-react';

interface ParsedNikData {
  gender: string;
  date_of_birth: string;
  region: {
    province: string | null;
    province_code: string | null;
    regency: string | null;
    regency_code: string | null;
    district: string | null;
    district_code: string | null;
  };
}

interface RegionItem {
  id: number;
  code: string;
  name: string;
}

const AddStudent = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  // --- Lists ---
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [studentRegencies, setStudentRegencies] = useState<RegionItem[]>([]);
  const [studentDistricts, setStudentDistricts] = useState<RegionItem[]>([]);
  const [studentVillages, setStudentVillages] = useState<RegionItem[]>([]);
  
  const [guardianRegencies, setGuardianRegencies] = useState<RegionItem[]>([]);
  const [guardianDistricts, setGuardianDistricts] = useState<RegionItem[]>([]);
  const [guardianVillages, setGuardianVillages] = useState<RegionItem[]>([]);

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

  useEffect(() => {
    fetch(`${API_URL}/regions/provinces`)
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(console.error);
  }, [API_URL]);

  const fetchRegions = async (type: 'regencies' | 'districts' | 'villages', code: string): Promise<RegionItem[]> => {
    try {
      const response = await fetch(`${API_URL}/regions/${type}/${code}`);
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  };

  const fetchNikData = async (nik: string): Promise<ParsedNikData | null> => {
    try {
      const response = await fetch(`${API_URL}/utils/parse-nik?nik=${nik}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
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
        
        if (data.region.province_code) {
          setStudentProvince(data.region.province_code);
          const regs = await fetchRegions('regencies', data.region.province_code);
          setStudentRegencies(regs);
          
          if (data.region.regency_code) {
            setStudentRegency(data.region.regency_code);
            const dists = await fetchRegions('districts', data.region.regency_code);
            setStudentDistricts(dists);
            
            if (data.region.district_code) {
              setStudentDistrict(data.region.district_code);
              const vills = await fetchRegions('villages', data.region.district_code);
              setStudentVillages(vills);
              setStudentVillage(''); // Clear village as it's not in NIK
            }
          }
        }
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
        
        if (data.region.province_code) {
          setGuardianProvince(data.region.province_code);
          const regs = await fetchRegions('regencies', data.region.province_code);
          setGuardianRegencies(regs);
          
          if (data.region.regency_code) {
            setGuardianRegency(data.region.regency_code);
            const dists = await fetchRegions('districts', data.region.regency_code);
            setGuardianDistricts(dists);
            
            if (data.region.district_code) {
              setGuardianDistrict(data.region.district_code);
              const vills = await fetchRegions('villages', data.region.district_code);
              setGuardianVillages(vills);
              setGuardianVillage('');
            }
          }
        }
      }
      setIsGuardianParsing(false);
    }
  };

  // Student Manual Changes
  const handleStudentProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStudentProvince(val);
    setStudentRegency(''); setStudentDistrict(''); setStudentVillage('');
    setStudentDistricts([]); setStudentVillages([]);
    if (val) setStudentRegencies(await fetchRegions('regencies', val));
    else setStudentRegencies([]);
  };

  const handleStudentRegencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStudentRegency(val);
    setStudentDistrict(''); setStudentVillage('');
    setStudentVillages([]);
    if (val) setStudentDistricts(await fetchRegions('districts', val));
    else setStudentDistricts([]);
  };

  const handleStudentDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStudentDistrict(val);
    setStudentVillage('');
    if (val) setStudentVillages(await fetchRegions('villages', val));
    else setStudentVillages([]);
  };

  // Guardian Manual Changes
  const handleGuardianProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setGuardianProvince(val);
    setGuardianRegency(''); setGuardianDistrict(''); setGuardianVillage('');
    setGuardianDistricts([]); setGuardianVillages([]);
    if (val) setGuardianRegencies(await fetchRegions('regencies', val));
    else setGuardianRegencies([]);
  };

  const handleGuardianRegencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setGuardianRegency(val);
    setGuardianDistrict(''); setGuardianVillage('');
    setGuardianVillages([]);
    if (val) setGuardianDistricts(await fetchRegions('districts', val));
    else setGuardianDistricts([]);
  };

  const handleGuardianDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setGuardianDistrict(val);
    setGuardianVillage('');
    if (val) setGuardianVillages(await fetchRegions('villages', val));
    else setGuardianVillages([]);
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
                <input type="date" value={studentDob} readOnly className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 outline-none cursor-not-allowed" />
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
                <select value={studentProvince} onChange={handleStudentProvinceChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200">
                  <option value="">-- Pilih Provinsi --</option>
                  {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kabupaten / Kota</label>
                <select value={studentRegency} onChange={handleStudentRegencyChange} disabled={!studentRegencies.length} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 disabled:opacity-50">
                  <option value="">-- Pilih Kabupaten --</option>
                  {studentRegencies.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kecamatan</label>
                <select value={studentDistrict} onChange={handleStudentDistrictChange} disabled={!studentDistricts.length} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 disabled:opacity-50">
                  <option value="">-- Pilih Kecamatan --</option>
                  {studentDistricts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kelurahan / Desa</label>
                <select value={studentVillage} onChange={e => setStudentVillage(e.target.value)} disabled={!studentVillages.length} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 disabled:opacity-50">
                  <option value="">-- Pilih Kelurahan --</option>
                  {studentVillages.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
                </select>
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
                <select value={guardianProvince} onChange={handleGuardianProvinceChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200">
                  <option value="">-- Pilih Provinsi --</option>
                  {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kabupaten / Kota</label>
                <select value={guardianRegency} onChange={handleGuardianRegencyChange} disabled={!guardianRegencies.length} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 disabled:opacity-50">
                  <option value="">-- Pilih Kabupaten --</option>
                  {guardianRegencies.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kecamatan</label>
                <select value={guardianDistrict} onChange={handleGuardianDistrictChange} disabled={!guardianDistricts.length} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 disabled:opacity-50">
                  <option value="">-- Pilih Kecamatan --</option>
                  {guardianDistricts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kelurahan / Desa</label>
                <select value={guardianVillage} onChange={e => setGuardianVillage(e.target.value)} disabled={!guardianVillages.length} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 disabled:opacity-50">
                  <option value="">-- Pilih Kelurahan --</option>
                  {guardianVillages.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
                </select>
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
