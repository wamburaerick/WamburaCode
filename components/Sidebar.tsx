import React from 'react';
import { BookOpen, Terminal, Code, Award, Settings, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileOpen, closeMobile }) => {
  const { progress, resetProgress } = useApp();

  const navItems = [
    { id: 'learn', label: 'Lessons', icon: BookOpen },
    { id: 'practice', label: 'Playground', icon: Terminal },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'stats', label: 'Progress & Rank', icon: Award },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex-shrink-0 flex flex-col
      `}>
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-yellow-500 rounded-lg flex items-center justify-center font-bold text-white">
            WC
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">WamburaCode</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">By Erick</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); closeMobile(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>XP</span>
              <span>{progress.xp}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (progress.xp % 1000) / 10)}%` }} 
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Level {Math.floor(progress.xp / 1000) + 1}</p>
          </div>

          <button 
            onClick={resetProgress}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors px-2"
          >
            <LogOut size={14} /> Reset Progress
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
