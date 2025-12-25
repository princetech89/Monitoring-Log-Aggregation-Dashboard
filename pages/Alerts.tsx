
import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, MoreVertical, BellOff, BellRing, Filter } from 'lucide-react';
import { Alert } from '../types';

interface AlertsProps {
  alerts: Alert[];
}

const SeverityBadge: React.FC<{ severity: Alert['severity'] }> = ({ severity }) => {
  switch (severity) {
    case 'CRITICAL':
      return <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">CRITICAL</span>;
    case 'WARNING':
      return <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">WARNING</span>;
    case 'INFO':
      return <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">INFO</span>;
  }
};

const Alerts: React.FC<AlertsProps> = ({ alerts }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Alert Management</h1>
          <p className="text-slate-400">Configure thresholds and review active incident notifications.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-800 text-slate-400 rounded-lg hover:bg-slate-800 transition-colors text-sm">
            <BellOff size={16} />
            <span>Mute All</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium">
            <BellRing size={16} />
            <span>New Alert Rule</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h3 className="font-semibold">Active Notifications</h3>
              <div className="flex items-center space-x-2">
                <button className="p-1.5 text-slate-500 hover:text-white"><Filter size={16}/></button>
              </div>
            </div>
            <div className="divide-y divide-slate-800">
              {alerts.map(alert => (
                <div key={alert.id} className="p-6 hover:bg-slate-800/30 transition-colors flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-3">
                        <SeverityBadge severity={alert.severity} />
                        <span className="font-bold text-slate-200">{alert.type}</span>
                        <span className="text-slate-500 text-sm">•</span>
                        <span className="text-indigo-400 text-sm font-medium">{alert.serviceName}</span>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{alert.message}</p>
                    <div className="flex items-center space-x-4">
                      <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">ACKNOWLEDGE</button>
                      <button className="text-xs font-bold text-slate-500 hover:text-slate-400">IGNORE</button>
                      <button className="text-xs font-bold text-green-500 hover:text-green-400">RESOLVE</button>
                    </div>
                  </div>
                  <button className="text-slate-600 hover:text-slate-400">
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold mb-4">Incident Stats</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500">MTTR (Mean Time to Resolution)</span>
                  <span className="text-white font-mono">14m</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-3/4 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-slate-500 mb-1">Total Alerts</p>
                  <p className="text-xl font-bold text-white">42</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                  <p className="text-xs text-slate-500 mb-1">Open</p>
                  <p className="text-xl font-bold text-red-500">2</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold mb-4">Alert Distribution</h3>
            <div className="space-y-4">
              {[
                { label: 'Latency Issues', value: 45, color: 'bg-indigo-500' },
                { label: 'Infrastructure', value: 25, color: 'bg-blue-500' },
                { label: 'Application Errors', value: 20, color: 'bg-emerald-500' },
                { label: 'Security', value: 10, color: 'bg-red-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-slate-500">{item.value}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
