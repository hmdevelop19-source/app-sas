import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { ArrowLeft, Save, User, Users, Info, Loader2, CheckCircle2 } from 'lucide-react';

interface ParsedNikData {
  gender: string;
  date_of_birth: string;
  region: {
    province_code: string | null;
    regency_code: string | null;
    district_code: string | null;
  };
}

interface RegionItem {
  id: number;
  code: string;
  name: string;
}

interface MasterItem {
  id: number;
  name: string;
}

const AddStudent = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

  // --- Master Data Lists ---
  const [educations, setEducations] = useState<MasterItem[]>([]);
  const [occupations, setOccupations] = useState<MasterItem[]>([]);

  // --- Region Lists ---
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [studentRegencies, setStudentRegencies] = useState<RegionItem[]>([]);
  const [studentDistricts, setStudentDistricts] = useState<RegionItem[]>([]);
  const [studentVillages, setStudentVillages] = useState<RegionItem[]>([]);
  
  const [guardianRegencies, setGuardianRegencies] = useState<RegionItem[]>([]);
  const [guardianDistricts, setGuardianDistricts] = useState<RegionItem[]>([]);
  const [guardianVillages, setGuardianVillages] = useState<RegionItem[]>([]);

  // --- Guardian State (Placed First) ---
  const [guardianNik, setGuardianNik] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('Ayah');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianDob, setGuardianDob] = useState('');
  const [guardianGender, setGuardianGender] = useState('');
  const [guardianEducationId, setGuardianEducationId] = useState('');
  const [guardianOccupationId, setGuardianOccupationId] = useState('');
  const [guardianProvince, setGuardianProvince] = useState('');
  const [guardianRegency, setGuardianRegency] = useState('');
  const [guardianDistrict, setGuardianDistrict] = useState('');
  const [guardianVillage, setGuardianVillage] = useState('');
  const [isGuardianParsing, setIsGuardianParsing] = useState(false);
  const [isGuardianLocked, setIsGuardianLocked] = useState(false);

  // --- Student State ---
  const [studentNik, setStudentNik] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPob, setStudentPob] = useState('');
  const [studentDob, setStudentDob] = useState('');
  const [studentGender, setStudentGender] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [studentProvince, setStudentProvince] = useState('');
  const [studentRegency, setStudentRegency] = useState('');
  const [studentDistrict, setStudentDistrict] = useState('');
  const [studentVillage, setStudentVillage] = useState('');
  const [isStudentParsing, setIsStudentParsing] = useState(false);

  // --- UI State ---
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/regions/provinces`).then(res => res.json()).then(setProvinces).catch(console.error);
    fetch(`${API_URL}/master/educations`).then(res => res.json()).then(setEducations).catch(console.error);
    fetch(`${API_URL}/master/occupations`).then(res => res.json()).then(setOccupations).catch(console.error);
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

  const checkGuardianExists = async (nik: string) => {
    try {
      const res = await fetch(`${API_URL}/guardians/check?nik=${nik}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const populateGuardianRegions = async (provCode: string | null, regCode: string | null, distCode: string | null, villCode: string | null = null) => {
    if (provCode) {
      setGuardianProvince(provCode);
      const regs = await fetchRegions('regencies', provCode);
      setGuardianRegencies(regs);
      
      if (regCode) {
        setGuardianRegency(regCode);
        const dists = await fetchRegions('districts', regCode);
        setGuardianDistricts(dists);
        
        if (distCode) {
          setGuardianDistrict(distCode);
          const vills = await fetchRegions('villages', distCode);
          setGuardianVillages(vills);
          
          if (villCode) {
            setGuardianVillage(villCode);
          } else {
            setGuardianVillage('');
          }
        }
      }
    }
  };

  const handleGuardianNikChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setGuardianNik(val);
    
    if (val.length === 16) {
      setIsGuardianParsing(true);
      
      // Check if guardian already exists
      const checkData = await checkGuardianExists(val);
      if (checkData && checkData.exists) {
        // Auto-fill existing guardian
        const g = checkData.data;
        setGuardianName(g.name);
        setGuardianPhone(g.phone || '');
        setGuardianDob(g.date_of_birth);
        setGuardianGender(g.gender);
        setGuardianEducationId(g.education_id || '');
        setGuardianOccupationId(g.occupation_id || '');
        
        await populateGuardianRegions(g.region.province_code, g.region.regency_code, g.region.district_code, g.region.village_code);
        setIsGuardianLocked(true);
      } else {
        // Parse NIK for new guardian
        setIsGuardianLocked(false);
        const data = await fetchNikData(val);
        if (data) {
          setGuardianDob(data.date_of_birth || '');
          setGuardianGender(data.gender || '');
          await populateGuardianRegions(data.region.province_code, data.region.regency_code, data.region.district_code);
        }
      }
      setIsGuardianParsing(false);
    } else {
      setIsGuardianLocked(false);
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

  // Manual Region Changes
  const handleStudentProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value; setStudentProvince(val);
    setStudentRegency(''); setStudentDistrict(''); setStudentVillage('');
    setStudentDistricts([]); setStudentVillages([]);
    setStudentRegencies(val ? await fetchRegions('regencies', val) : []);
  };
  const handleStudentRegencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value; setStudentRegency(val);
    setStudentDistrict(''); setStudentVillage('');
    setStudentVillages([]);
    setStudentDistricts(val ? await fetchRegions('districts', val) : []);
  };
  const handleStudentDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value; setStudentDistrict(val);
    setStudentVillage('');
    setStudentVillages(val ? await fetchRegions('villages', val) : []);
  };

  const handleGuardianProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value; setGuardianProvince(val);
    setGuardianRegency(''); setGuardianDistrict(''); setGuardianVillage('');
    setGuardianDistricts([]); setGuardianVillages([]);
    setGuardianRegencies(val ? await fetchRegions('regencies', val) : []);
  };
  const handleGuardianRegencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value; setGuardianRegency(val);
    setGuardianDistrict(''); setGuardianVillage('');
    setGuardianVillages([]);
    setGuardianDistricts(val ? await fetchRegions('districts', val) : []);
  };
  const handleGuardianDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value; setGuardianDistrict(val);
    setGuardianVillage('');
    setGuardianVillages(val ? await fetchRegions('villages', val) : []);
  };

  const handleSave = async () => {
    if (!guardianNik || !guardianName || !studentNik || !studentName || !studentVillage) {
      alert('Mohon lengkapi NIK Wali, Nama Wali, NIK Siswa, Nama Siswa, dan Kelurahan Siswa!');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        guardian_nik: guardianNik,
        guardian_name: guardianName,
        guardian_relationship: guardianRelationship,
        guardian_phone: guardianPhone,
        guardian_dob: guardianDob,
        guardian_gender: guardianGender,
        guardian_education_id: guardianEducationId,
        guardian_occupation_id: guardianOccupationId,

        student_nik: studentNik,
        student_name: studentName,
        student_pob: studentPob,
        student_dob: studentDob,
        student_gender: studentGender,
        student_address: studentAddress,
        student_village_code: studentVillage
      };

      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Data siswa berhasil disimpan!');
        navigate('/students');
      } else {
        const errorData = await res.json();
        alert('Gagal menyimpan data: ' + (errorData.message || 'Kesalahan server'));
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/students')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pendaftaran Siswa Baru</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lengkapi data demografi (dimulai dari Wali).</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm shadow-sky-600/30 transition-all flex items-center gap-2 disabled:opacity-50">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Wali (Moved to Top/Left) */}
        <Card className="p-6 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                <Users size={24} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Data Keluarga / Wali</h2>
            </div>
            {isGuardianLocked && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-semibold">
                <CheckCircle2 size={14} /> Terdaftar
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">NIK Wali (Penting)</label>
              <div className="relative">
                <input type="text" value={guardianNik} onChange={handleGuardianNikChange} readOnly={isGuardianLocked} placeholder="16 Digit NIK..." className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 font-mono text-sm ${isGuardianLocked ? 'opacity-70 cursor-not-allowed' : ''}`} />
                {isGuardianParsing && <Loader2 className="absolute right-3 top-3 animate-spin text-amber-500" size={18} />}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap Wali</label>
              <input type="text" value={guardianName} onChange={e => setGuardianName(e.target.value)} readOnly={isGuardianLocked} className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 ${isGuardianLocked ? 'opacity-70 cursor-not-allowed' : ''}`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status Hubungan</label>
              <select value={guardianRelationship} onChange={e => setGuardianRelationship(e.target.value)} disabled={isGuardianLocked} className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 ${isGuardianLocked ? 'opacity-70 cursor-not-allowed' : ''}`}>
                <option value="Ayah">Ayah</option>
                <option value="Ibu">Ibu</option>
                <option value="Wali">Wali</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pendidikan Terakhir</label>
                <select value={guardianEducationId} onChange={e => setGuardianEducationId(e.target.value)} disabled={isGuardianLocked} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 disabled:opacity-70">
                  <option value="">Pilih Pendidikan</option>
                  {educations.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pekerjaan</label>
                <select value={guardianOccupationId} onChange={e => setGuardianOccupationId(e.target.value)} disabled={isGuardianLocked} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 disabled:opacity-70">
                  <option value="">Pilih Pekerjaan</option>
                  {occupations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nomor WhatsApp (WA)</label>
              <input type="tel" value={guardianPhone} onChange={e => setGuardianPhone(e.target.value)} readOnly={isGuardianLocked} placeholder="Contoh: 081234567890" className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200 ${isGuardianLocked ? 'opacity-70 cursor-not-allowed' : ''}`} />
            </div>

            <div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex gap-3 mt-4">
                <Info className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Silakan masukkan NIK Wali terlebih dahulu. Jika wali sudah terdaftar sebelumnya (untuk kakak/adik), data akan otomatis terisi dan terkunci.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Kolom Siswa (Moved to Bottom/Right) */}
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
                  type="text" value={studentNik} onChange={handleStudentNikChange}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tempat Lahir</label>
                <input type="text" value={studentPob} onChange={e => setStudentPob(e.target.value)} placeholder="Contoh: Surabaya" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tanggal Lahir</label>
                <input type="date" value={studentDob} readOnly className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Jenis Kelamin</label>
                <input type="text" value={studentGender === 'L' ? 'Laki-laki' : studentGender === 'P' ? 'Perempuan' : ''} readOnly className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 outline-none cursor-not-allowed" placeholder="Otomatis" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alamat Lengkap</label>
              <textarea 
                value={studentAddress} onChange={e => setStudentAddress(e.target.value)} rows={3} placeholder="Alamat lengkap keluarga..." 
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
      </div>
    </div>
  );
};

export default AddStudent;
