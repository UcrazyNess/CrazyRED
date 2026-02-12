import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Shield, 
  Cpu, 
  HardDrive, 
  Activity, 
  Folder, 
  Zap, 
  LogOut, 
  Monitor, 
  Code,
  Globe,
  Database,
  Lock,
  Search,
  Settings,
  Key,
  User,
  ChevronRight
} from 'lucide-react';

/**
 * LARAVEL API CONFIGURATION
 * Fetches system metrics every 500ms
 */
const API_BASE_URL = "http://your-laravel-api.test/api"; 
const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'hacker-panel-01';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ cpu: 0, ram: 0, processes: [] });
  const [sessionTime, setSessionTime] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([
    "INITIALIZING SECURE PROTOCOLS...",
    "ESTABLISHING HANDSHAKE WITH LARAVEL BACKEND...",
    "BYPASSING FIREWALL...",
    "WELCOME, OPERATOR. SYSTEM IS FULLY OPERATIONAL."
  ]);

  // Login State
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Session Timer
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  // Laravel API Polling (Every 500ms)
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/system-stats`, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        setStats({
          cpu: Math.floor(Math.random() * 30) + 5,
          ram: Math.floor(Math.random() * 40) + 20,
          processes: [
            { id: 101, name: 'nginx-service', usage: '0.5%' },
            { id: 202, name: 'laravel-worker', usage: '4.2%' },
            { id: 303, name: 'mysql-daemon', usage: '2.8%' },
            { id: 404, name: 'redis-server', usage: '0.1%' }
          ]
        });
      }
    };

    const interval = setInterval(fetchStats, 500); 
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    // Simulate API Auth
    setTimeout(() => {
      if (loginData.username === 'admin' && loginData.password === 'password') {
        setIsAuthenticated(true);
      } else {
        setLoginError('ACCESS DENIED: INVALID CREDENTIALS');
        setIsLoggingIn(false);
      }
    }, 1500);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const NavButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-500 group relative overflow-hidden ${
        activeTab === id 
        ? `bg-purple-900/40 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.3)]` 
        : `bg-zinc-900/40 border-zinc-800 hover:border-purple-600/50 hover:bg-zinc-900/80`
      }`}
    >
      <Icon className={`w-10 h-10 mb-2 transition-transform duration-300 group-hover:scale-110 ${activeTab === id ? 'text-purple-400' : 'text-zinc-600 group-hover:text-purple-400'}`} />
      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${activeTab === id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
        {label}
      </span>
    </button>
  );

  // --- LOGIN SCREEN COMPONENT ---
  if (!isAuthenticated) {
    return (
 
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
   
  );
};

export default App;