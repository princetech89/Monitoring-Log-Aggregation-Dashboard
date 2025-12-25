
import React from 'react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  Zap, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Server,
  ArrowRight
} from 'lucide-react';
import { Service, ServiceStatus } from '../types';

interface DashboardProps {
  services: Service[];
}

const KPICard: React.FC<{
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, trend, icon, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-indigo-500/50 transition-all">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full bg-${color}-500 group-hover:scale-110 transition-transform`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 bg-slate-800 rounded-lg text-${color}-400`}>
        {icon}
      </div>
      <span className={`text-xs font-bold flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {trend >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
        {Math.abs(trend)}%
      </span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold mt-1 text-white">{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ services }) => {
  const healthyCount = services.filter(s => s.status === ServiceStatus.HEALTHY).length;
  const downCount = services.filter(s => s.status === ServiceStatus.DOWN).length;

  const mockTimeSeries = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    requests: Math.floor(Math.random() * 1000) + 500,
    errors: Math.floor(Math.random() * 50),
    latency: Math.floor(Math.random() * 100) + 40,
    cpu: Math.floor(Math.random() * 40) + 20,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">System Overview</h1>
          <p className="text-slate-400">Real-time performance across {services.length} services.</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg">
          <button className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md shadow-sm">1H</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">6H</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">24H</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Active Services" 
          value={`${healthyCount}/${services.length}`} 
          trend={2} 
          icon={<Server size={20} />} 
          color="indigo" 
        />
        <KPICard 
          title="Total Requests" 
          value="24.8k" 
          trend={12} 
          icon={<Zap size={20} />} 
          color="emerald" 
        />
        <KPICard 
          title="Avg. Error Rate" 
          value="0.42%" 
          trend={-5} 
          icon={<AlertTriangle size={20} />} 
          color="amber" 
        />
        <KPICard 
          title="Avg. Response Time" 
          value="84ms" 
          trend={8} 
          icon={<Clock size={20} />} 
          color="blue" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center">
              <Activity size={18} className="mr-2 text-indigo-400" />
              Request Traffic & Latency
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-xs text-slate-400">Requests</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-xs text-slate-400">Latency (ms)</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTimeSeries}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" fillOpacity={1} fill="url(#colorRequests)" />
                <Line type="monotone" dataKey="latency" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-6 flex items-center">
            <AlertTriangle size={18} className="mr-2 text-amber-400" />
            Top Error Services
          </h3>
          <div className="space-y-6">
            {services.sort((a, b) => b.errorRate - a.errorRate).slice(0, 4).map(service => (
              <div key={service.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-300">{service.name}</span>
                  <span className="text-slate-500">{service.errorRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${service.errorRate > 1 ? 'bg-red-500' : 'bg-amber-500'}`} 
                    style={{ width: `${Math.min(service.errorRate * 20, 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <button className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 rounded-lg border border-slate-800 text-slate-400 text-sm hover:bg-slate-800 transition-colors">
              <span>View detailed metrics</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-6">Service Health Breakdown</h3>
          <div className="h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Healthy', count: services.filter(s => s.status === ServiceStatus.HEALTHY).length, color: '#10b981' },
                { name: 'Degraded', count: services.filter(s => s.status === ServiceStatus.DEGRADED).length, color: '#f59e0b' },
                { name: 'Down', count: services.filter(s => s.status === ServiceStatus.DOWN).length, color: '#ef4444' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {[0, 1, 2].map((_, index) => (
                    <Cell key={index} fill={['#10b981', '#f59e0b', '#ef4444'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Resource Utilization</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/10 rounded-md">
                  <Activity size={16} className="text-indigo-400" />
                </div>
                <span className="text-sm font-medium">Aggregate CPU Load</span>
              </div>
              <span className="font-mono text-indigo-400">42.8%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/10 rounded-md">
                  <Server size={16} className="text-emerald-400" />
                </div>
                <span className="text-sm font-medium">Memory Allocation</span>
              </div>
              <span className="font-mono text-emerald-400">5.2 GB</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-md">
                  <Clock size={16} className="text-blue-400" />
                </div>
                <span className="text-sm font-medium">Thread Context Switching</span>
              </div>
              <span className="font-mono text-blue-400">2.4k/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
