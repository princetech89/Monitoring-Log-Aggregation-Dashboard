
import React from 'react';
import { 
  Server, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  MoreVertical,
  Activity,
  Cpu,
  Database
} from 'lucide-react';
import { Service, ServiceStatus } from '../types';

interface ServicesProps {
  services: Service[];
}

const StatusBadge: React.FC<{ status: ServiceStatus }> = ({ status }) => {
  switch (status) {
    case ServiceStatus.HEALTHY:
      return (
        <span className="flex items-center px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
          <CheckCircle2 size={12} className="mr-1" />
          HEALTHY
        </span>
      );
    case ServiceStatus.DEGRADED:
      return (
        <span className="flex items-center px-2 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">
          <AlertCircle size={12} className="mr-1" />
          DEGRADED
        </span>
      );
    case ServiceStatus.DOWN:
      return (
        <span className="flex items-center px-2 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full border border-red-500/20">
          <XCircle size={12} className="mr-1" />
          DOWN
        </span>
      );
  }
};

const Services: React.FC<ServicesProps> = ({ services }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services Inventory</h1>
          <p className="text-slate-400">Manage and monitor your microservices architecture.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="pl-10 pr-4 py-2 bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-slate-200"
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium">
            Add Service
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div 
            key={service.id} 
            className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer relative"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-slate-800 text-slate-400 group-hover:text-indigo-400 transition-colors`}>
                  <Server size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <div className="flex items-center mt-1">
                    <StatusBadge status={service.status} />
                  </div>
                </div>
              </div>
              <button className="p-1 hover:bg-slate-800 rounded text-slate-500">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center text-xs text-slate-500 mb-1">
                  <Cpu size={12} className="mr-1" />
                  CPU USAGE
                </div>
                <div className="text-lg font-mono text-slate-200">{service.cpu}%</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center text-xs text-slate-500 mb-1">
                  <Database size={12} className="mr-1" />
                  MEMORY
                </div>
                <div className="text-lg font-mono text-slate-200">{(service.memory / 1024).toFixed(1)} GB</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center text-xs text-slate-500 mb-1">
                  <Activity size={12} className="mr-1" />
                  ERROR RATE
                </div>
                <div className={`text-lg font-mono ${service.errorRate > 1 ? 'text-red-400' : 'text-slate-200'}`}>
                  {service.errorRate}%
                </div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center text-xs text-slate-500 mb-1">
                  <Activity size={12} className="mr-1" />
                  P99 LATENCY
                </div>
                <div className="text-lg font-mono text-slate-200">{service.p99}ms</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-500">
                Last heartbeat: {new Date(service.lastHeartbeat).toLocaleTimeString()}
              </div>
              <div className="flex items-center text-indigo-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                VIEW DETAILS
                <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
