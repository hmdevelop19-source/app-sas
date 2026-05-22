import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-sky-500/20 to-transparent dark:from-sky-900/20 -z-10"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-md mb-4 border border-slate-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner">
              S
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent tracking-tight">SAS</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Smart Attendance System</p>
        </div>
        
        <Card className="shadow-xl shadow-slate-200/50 dark:shadow-none border-t-4 border-t-sky-500">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email / NIP</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                placeholder="Masukkan email atau NIP"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
            >
              <LogIn size={20} />
              Masuk ke Dashboard
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
