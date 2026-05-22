import { Card } from '../components/Card';
import { Users, UserCheck, AlertCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Selamat Datang, Admin</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Berikut adalah ringkasan kehadiran siswa hari ini.</p>
        </div>
        <div className="bg-sky-50 dark:bg-sky-500/10 px-4 py-2 rounded-lg border border-sky-100 dark:border-sky-500/20">
          <span className="text-sm font-medium text-sky-700 dark:text-sky-400">Kuartal Aktif: Q1 2026/2027</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-5 hover:border-sky-200 dark:hover:border-sky-700 transition-colors cursor-default">
          <div className="p-4 bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-500/20 dark:to-sky-400/10 text-sky-600 dark:text-sky-400 rounded-xl shadow-inner">
            <Users size={26} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Siswa</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">1,240</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-5 hover:border-emerald-200 dark:hover:border-emerald-700 transition-colors cursor-default">
          <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-500/20 dark:to-emerald-400/10 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-inner">
            <UserCheck size={26} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Hadir Hari Ini</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">1,180</p>
          </div>
        </Card>

        <Card className="flex items-center gap-5 hover:border-rose-200 dark:hover:border-rose-700 transition-colors cursor-default">
          <div className="p-4 bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-500/20 dark:to-rose-400/10 text-rose-600 dark:text-rose-400 rounded-xl shadow-inner">
            <AlertCircle size={26} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Alpha Hari Ini</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">15</p>
          </div>
        </Card>

        <Card className="flex items-center gap-5 hover:border-amber-200 dark:hover:border-amber-700 transition-colors cursor-default">
          <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/20 dark:to-amber-400/10 text-amber-600 dark:text-amber-400 rounded-xl shadow-inner">
            <AlertTriangle size={26} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Siswa SP</p>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">8</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Tren Kehadiran Mingguan</h2>
            <button className="text-sm text-sky-600 dark:text-sky-400 font-medium hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1">
              Lihat Detail <TrendingUp size={16} />
            </button>
          </div>
          <div className="flex-1 min-h-[250px] flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
            {/* Placeholder for chart */}
            <div className="w-full h-full p-4 flex items-end justify-between gap-2 opacity-60">
               {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <div key={i} className="w-full bg-sky-200 dark:bg-sky-800/50 rounded-t-md relative group">
                    <div className="absolute bottom-0 w-full bg-sky-500 dark:bg-sky-500 rounded-t-md transition-all duration-500 group-hover:bg-sky-400" style={{ height: `${h}%` }}></div>
                  </div>
               ))}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center gap-2 mb-6 text-amber-600 dark:text-amber-500">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Peringatan Dini SP</h2>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-amber-300 dark:hover:border-amber-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                    A{i}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Ahmad Fulan {i}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kelas 10-A</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-md">{i * 2 + 1} Alpha</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Mendekati SP {i}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            Lihat Semua Peringatan
          </button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
