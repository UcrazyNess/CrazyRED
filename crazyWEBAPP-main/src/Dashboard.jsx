import React, { useState, useEffect } from 'react'; // ویرگول اضافه حذف شد
import { 
  Terminal, 
  Shield, 
  Activity, 
  Folder, 
  Zap, 
  LogOut, // از این استفاده می‌کنیم
  Monitor, 
  Code,
  Globe,
  ClipboardList,
  Hexagon
} from 'lucide-react';


// دریافت پراپ‌های username و onLogout
const Dashboard = ({ username, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ cpu: 0, ram: 0, processes: [] });
  const [hovered, setHovered] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([
    "INITIALIZING SECURE PROTOCOLS...",
    "ESTABLISHING HANDSHAKE WITH LARAVEL BACKEND...",
    "BYPASSING FIREWALL...",
    "WELCOME, OPERATOR. SYSTEM IS FULLY OPERATIONAL."
  ]);

  // Session Timer
  useEffect(() => {
    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Laravel API Polling
  useEffect(() => {
    if(!hovered) return;
    const fetchStats = async () => {
        const response = await fetch(`http://localhost:5173/api/shell/monitor`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      
    };

    const interval = setInterval(fetchStats, 500); 
    return () => clearInterval(interval);
  }, [hovered]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  const command = async (command) => {
    if(command == "clear"){
       setTerminalLogs([]);
       return;
    }
     try {
    setTerminalLogs((prev) => [...prev, `> ${command}`]);

    const response = await fetch(`http://localhost:5173/api/shell/command`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ "command": command }) 
    });

    const data = await response.json(); 
    if (response.ok) {
      setTerminalLogs((prev) => [...prev, data.result]); 
    } else {
      setTerminalLogs((prev) => [...prev, 
        data.massage  ? `Error:${data.massage}` : "Error: Could not execute command"

      ]);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    setTerminalLogs((prev) => [...prev, "Network Error"]);
  }
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

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-mono selection:bg-purple-600 selection:text-white overflow-hidden relative">
      
      {/* CYBERPUNK BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(88,28,135,0.15),transparent)]"></div>
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan-line"></div>
      </div>

      {/* --- TOP HUD (HEADER) --- */}
      <header className="relative z-20 h-16 border-b border-purple-900/30 bg-black/80 backdrop-blur-2xl flex items-center justify-between px-10 shadow-lg">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center">
             <Shield className="text-purple-500 w-6 h-6 animate-pulse z-10" />
             <div className="absolute inset-0 bg-purple-500/30 blur-xl animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-widest text-white leading-none">
              GHOST<span className="text-purple-500">_</span>SHELL <span className="text-purple-700 text-xs">V.4</span>
            </h1>
            <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-tighter">Authorized Access Only</span>
          </div>
        </div>
        
        <div className="flex items-center gap-12 text-[10px]">
          <div className="flex flex-col items-end border-r border-zinc-800 pr-4">
            <span className="text-purple-500 uppercase font-black text-[8px] mb-1">Operator</span>
            {/* استفاده از پراپ username */}
            <span className="text-white font-bold uppercase">{username || "UNKNOWN_USER"}</span>
          </div>
          <div className="flex flex-col items-end border-r border-zinc-800 pr-4">
            <span className="text-purple-500 uppercase font-black text-[8px] mb-1">Session</span>
            <span className="text-white font-mono">{formatTime(sessionTime)}</span>
          </div>
          
          {/* دکمه خروج اضافه شده */}
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-900/50 hover:bg-red-900/40 hover:border-red-500 text-red-500 rounded transition-all group"
          >
            <span className="uppercase font-black tracking-wider">Abort</span>
            <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </header>

       <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 group flex items-center"
        onMouseEnter={()=>{
          setHovered(true)
        }}
        onMouseLeave={
          ()=>{
            setHovered(false)
          }
        }>
        <div className="w-1.5 h-40 bg-gradient-to-b from-purple-500 to-purple-900 rounded-r-full group-hover:scale-y-125 transition-all duration-500 shadow-[0_0_15px_rgba(168,85,247,0.7)]"></div>
        
        <div  className="absolute left-4 w-72 bg-zinc-950/95 border border-purple-500/30 rounded-xl p-5 opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 pointer-events-none backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.9)] border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-purple-400 text-xs font-black tracking-widest flex items-center gap-2">
              <Activity size={14} /> LIVE METRICS
            </h3>
            <span className="text-[8px] text-zinc-700 font-bold uppercase italic">Polling 500ms</span>
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between text-[10px] mb-2 font-bold uppercase text-zinc-500">
              <span>CPU Load</span>
              <span className="text-purple-400">{stats.cpu}%</span>
            </div>
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-900 to-purple-400 transition-all duration-500" style={{ width: `${stats.cpu}%` }}></div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-[10px] mb-2 font-bold uppercase text-zinc-500">
              <span>RAM Usage</span>
              <span className="text-purple-400">{stats.ram}%</span>
            </div>
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-900 to-purple-400 transition-all duration-500" style={{ width: `${stats.ram}%` }}></div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <span className="text-[9px] text-zinc-600 uppercase font-black tracking-tighter">Active Daemon Processes</span>
            {stats.processes.map(p => (
              <div key={p.id} className="flex justify-between items-center text-[10px] py-1.5 px-3 bg-zinc-900/50 rounded border border-zinc-800/30">
                <span className="text-zinc-400">{p.name}</span>
                <span className="text-purple-500 font-bold">{p.usage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="relative z-10 p-8 h-[calc(100vh-64px)] grid grid-cols-12 gap-8 overflow-hidden">
        <div className="col-span-8 flex flex-col gap-8 h-full overflow-hidden">
          <div className="grid grid-cols-3 gap-6 shrink-0">
            <NavButton id="logs" icon={Monitor} label="System Logs" />
            <NavButton id="tools" icon={Zap} label="Cyber Tools" />
            <NavButton id="files" icon={Folder} label="Vault Explorer" />
          </div>

          <div className="flex-1 bg-black/70 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-2xl relative border-t-zinc-700/50">
            <div className="bg-zinc-900/90 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-800 hover:bg-red-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-800 hover:bg-yellow-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-800 hover:bg-emerald-500 transition-colors"></div>
              </div>
              <span className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">Kernel_Terminal_v4.2</span>
              <div className="w-10"></div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar font-mono text-sm leading-relaxed bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(168,85,247,0.02),transparent,rgba(168,85,247,0.02))] bg-[length:100%_4px,100%_100%]">
              {terminalLogs.map((log, i) => (
                <div key={i} className="mb-2 flex gap-3 opacity-90 hover:opacity-100 transition-opacity">
                  <span className="text-purple-600 font-black shrink-0">{">>"}</span>
                  <span className="text-zinc-300 font-medium">{log}</span>
                </div>
              ))}
              
              <div className="flex items-center gap-3 mt-4 group">
                <span className="text-purple-500 font-black animate-pulse">
                  [${username}@GHOST_SHELL]{">"}
                </span>
                <input 
                  type="text" 
                  className="bg-transparent border-none outline-none text-white w-full caret-purple-500 placeholder:text-zinc-800"
                  placeholder="Execute secure command..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      command(e.target.value)
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-8 h-full overflow-hidden">
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-6 backdrop-blur-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-10">
                <Globe size={48} className="text-purple-500" />
             </div>
             <h2 className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                <Globe size={14} /> Global Node Status
             </h2>
             <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                   <span className="text-[10px] text-zinc-500 font-bold uppercase">SSL Tunnel</span>
                   <span className="text-[9px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30 font-black">ENCRYPTED</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                   <span className="text-[10px] text-zinc-500 font-bold uppercase">Proxy Chain</span>
                   <span className="text-[9px] text-amber-500 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/30 font-black">ACTIVE [3]</span>
                </div>
             </div>
          </div>

          <div className="flex-1 bg-zinc-950/40 border border-zinc-800 rounded-xl p-6 backdrop-blur-xl flex flex-col overflow-hidden">
             <h2 className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                <ClipboardList size={8} /> Tasks
             </h2>
             
             <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {[
                  { name: 'laravel_kernel.php', type: 'system' },
                  { name: 'db_dump_v2.sql', type: 'database' },
                  { name: 'remote_exploit.py', type: 'exploit' },
                  { name: 'shadow_pass.txt', type: 'secret' },
                  { name: 'log_scrub.sh', type: 'shell' },
                  { name: 'target_ips.json', type: 'data' }
                ].map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-purple-950/20 rounded-lg cursor-pointer transition-all border border-transparent hover:border-purple-500/20 group">
                    <div className="flex items-center gap-3">
                      <Code size={16} className="text-zinc-600 group-hover:text-purple-400" />
                      <span className="text-[11px] text-zinc-400 group-hover:text-zinc-100">{file.name}</span>
                    </div>
                    <Hexagon size={12} className="text-zinc-800 group-hover:text-purple-600" />
                  </div>
                ))}
             </div>
             
             <button className="mt-6 w-full py-3 bg-zinc-900 hover:bg-purple-900/50 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-zinc-800 hover:border-purple-500 transition-all shadow-inner">
                Mount External Drive
             </button>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes scanLine { 
          0% { transform: translateY(0); opacity: 0; } 
          50% { opacity: 0.3; } 
          100% { transform: translateY(100vh); opacity: 0; } 
        }
        .animate-scan-line { 
          animation: scanLine 6s linear infinite; 
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a; 
          border-radius: 20px; 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a855f7; 
        }
      `}</style>
    </div>
  );
};

export default Dashboard;