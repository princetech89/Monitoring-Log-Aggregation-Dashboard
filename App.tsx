
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Logs from './pages/Logs';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import { generateServices, generateLogs, generateAlerts } from './services/mockData';
import { Service, LogEntry, Alert, User } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [services, setServices] = useState<Service[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u-1',
    name: 'Sarah Chen',
    email: 'sarah.c@omnisight.io',
    role: 'ADMIN',
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  });

  useEffect(() => {
    // Initialize data
    setServices(generateServices());
    setLogs(generateLogs(50));
    setAlerts(generateAlerts());
    
    // Simulate periodic metric updates
    const interval = setInterval(() => {
      setServices(prev => prev.map(s => ({
        ...s,
        cpu: Math.min(100, Math.max(0, s.cpu + (Math.random() * 10 - 5))),
        requests: Math.floor(s.requests * (0.95 + Math.random() * 0.1))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setCurrentUser(prev => ({ ...prev, email }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard services={services} />;
      case 'services':
        return <Services services={services} />;
      case 'logs':
        return <Logs logs={logs} />;
      case 'alerts':
        return <Alerts alerts={alerts} />;
      case 'activity':
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
            <h2 className="text-xl font-bold text-slate-300 mb-2">Audit Logs</h2>
            <p>User action history and compliance logs will appear here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
            <h2 className="text-xl font-bold text-slate-300 mb-2">Configuration</h2>
            <p>System settings and cluster configurations.</p>
          </div>
        );
      default:
        return <Dashboard services={services} />;
    }
  };

  return (
    <Layout 
      activePage={activePage} 
      setActivePage={setActivePage} 
      user={currentUser}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
