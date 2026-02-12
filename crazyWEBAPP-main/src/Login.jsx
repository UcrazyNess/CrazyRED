import React, { useState } from 'react';
import { Shield, User, Key, ChevronRight } from 'lucide-react';

const API_BASE_URL = "http://localhost:5173/api/";

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoggingIn(true);
  setLoginError('');

  const data = new FormData();
  data.append('userName', formData.userName);
  data.append('password', formData.password);

  try {
    const response = await fetch(API_BASE_URL+`login`, {
      method: 'POST',
      body: data,
    });

    const result = await response.json();

    if (response.ok) {
      // لاگ بگیرید تا ببینید دیتا دقیقاً چیست

      // بر اساس کنترلری که قبلاً فرستادید، ساختار اینگونه است: result.data.sessionEX
      const expiry = result.data?.sessionEX; 
      const name = formData.userName;

      // اجرای تابع ورود در App.js
      onLoginSuccess(name, expiry); 
      
    } else {
      const errorMsg = result.data?.error || result.message || 'AUTH FAILED';
      setLoginError(errorMsg.toUpperCase());
    }
  } catch (err) {
    setLoginError('CONNECTION ERROR');
  } finally {
    setIsLoggingIn(false);
  }
};
  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-mono flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* جلوه‌های بصری پس‌زمینه */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(88,28,135,0.2),transparent)]"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-purple-500 animate-scan-line"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-zinc-950/90 border border-purple-900/50 rounded-2xl p-8 backdrop-blur-3xl shadow-2xl">
        
        <div className="flex flex-col items-center mb-10">
          <Shield className="text-purple-500 w-12 h-12 animate-pulse mb-4" />
          <h1 className="text-2xl font-black tracking-[0.3em] text-white">
            GHOST<span className="text-purple-500">_</span>SHELL
          </h1>
          <p className="text-[9px] text-zinc-500 uppercase tracking-[0.4em] mt-2">Secure Access Point</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text"
              required
              placeholder="USERNAME"
              className="w-full bg-black/50 border border-zinc-800 rounded-lg py-4 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-600 transition-all text-white placeholder:text-zinc-700 font-bold tracking-widest"
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="password"
              required
              placeholder="PASSWORD"
              className="w-full bg-black/50 border border-zinc-800 rounded-lg py-4 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-600 transition-all text-white placeholder:text-zinc-700 font-bold tracking-widest"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {loginError && (
            <div className="text-[10px] text-red-500 font-black text-center bg-red-500/5 py-3 border border-red-500/20 rounded animate-pulse">
              [ ERROR: {loginError} ]
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white font-black uppercase tracking-[0.4em] text-xs rounded-lg transition-all shadow-[0_0_25px_rgba(168,85,247,0.3)] flex items-center justify-center gap-3"
          >
            {isLoggingIn ? "AUTHORIZING..." : "ESTABLISH CONNECTION"} <ChevronRight size={14} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-900/50 flex justify-between items-center text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
          <span>Protocol: Form-Data</span>
          <span>Node: 127.0.0.1</span>
        </div>
      </div>

      <style>{`
        @keyframes scanLine { 
          0% { transform: translateY(-100vh); opacity: 0; } 
          100% { transform: translateY(100vh); opacity: 0; } 
        }
        .animate-scan-line { animation: scanLine 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default Login;