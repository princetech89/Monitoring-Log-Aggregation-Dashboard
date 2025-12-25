
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Server, 
  Terminal, 
  Bell, 
  History, 
  Settings, 
  LogOut, 
  Search, 
  Menu, 
  X,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
  user: User;
  onLogout: () => void;
}

const SidebarItem: React.FC<{ 
  id: string; 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { id: 'services', icon: <Server size={20} />, label: 'Services' },
    { id: 'logs', icon: <Terminal size={20} />, label: 'Logs Explorer' },
    { id: 'alerts', icon: <Bell size={20} />, label: 'Alerts' },
    { id: 'activity', icon: <History size={20} />, label: 'Activity' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">OmniSight</span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                id={item.id}
                icon={item.icon}
                label={item.label}
                active={activePage === item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-3 px-4 py-4">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-700" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 w-64">
              <Search className="text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-indigo-400 font-mono">SYSTEM STATUS</span>
              <span className="text-xs font-semibold text-green-500 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse" />
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
            <div className="relative">
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
              <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
