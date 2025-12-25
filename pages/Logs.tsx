
import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  Download,
  Info,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { LogEntry, LogLevel } from '../types';
import { geminiService } from '../services/geminiService';

interface LogsProps {
  logs: LogEntry[];
}

const LogRow: React.FC<{ 
  log: LogEntry; 
  onAnalyze: (log: LogEntry) => void;
  isAnalyzing: boolean;
}> = ({ log, onAnalyze, isAnalyzing }) => {
  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.INFO: return 'text-blue-400 bg-blue-400/10';
      case LogLevel.WARN: return 'text-amber-400 bg-amber-400/10';
      case LogLevel.ERROR: return 'text-red-400 bg-red-400/10';
      case LogLevel.DEBUG: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.INFO: return <Info size={12} />;
      case LogLevel.WARN: return <AlertTriangle size={12} />;
      case LogLevel.ERROR: return <XCircle size={12} />;
      case LogLevel.DEBUG: return <Terminal size={12} />;
    }
  };

  return (
    <div className="group border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors py-2 px-4 flex items-center space-x-4 mono text-[13px]">
      <span className="text-slate-500 whitespace-nowrap min-w-[150px]">
        {new Date(log.timestamp).toLocaleTimeString()}
      </span>
      <span className={`px-2 py-0.5 rounded flex items-center space-x-1.5 font-bold uppercase ${getLevelColor(log.level)}`}>
        {getLevelIcon(log.level)}
        <span>{log.level}</span>
      </span>
      <span className="text-indigo-400 font-medium min-w-[120px] truncate">{log.service}</span>
      <span className="flex-1 text-slate-300 truncate">{log.message}</span>
      <button 
        onClick={() => onAnalyze(log)}
        disabled={isAnalyzing}
        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-600/20 hover:text-indigo-400 rounded transition-all disabled:opacity-50"
        title="Analyze with AI"
      >
        <Sparkles size={16} />
      </button>
    </div>
  );
};

const Logs: React.FC<LogsProps> = ({ logs: initialLogs }) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filter, setFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL');
  const [isLive, setIsLive] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analyzingLogId, setAnalyzingLogId] = useState<string | null>(null);
  const [isBulkAnalyzing, setIsBulkAnalyzing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      // Simulate real-time logs arriving
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        level: [LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.DEBUG][Math.floor(Math.random() * 4)],
        service: 'api-gateway',
        message: 'Incoming request processing context established'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 200));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(filter.toLowerCase()) || 
                          log.service.toLowerCase().includes(filter.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleSingleAnalysis = async (log: LogEntry) => {
    setAnalyzingLogId(log.id);
    const explanation = await geminiService.explainError(log);
    setAnalysisResult(explanation);
    setAnalyzingLogId(null);
  };

  const handleBulkAnalysis = async () => {
    setIsBulkAnalyzing(true);
    const analysis = await geminiService.analyzeLogs(filteredLogs.slice(0, 20));
    setAnalysisResult(analysis);
    setIsBulkAnalyzing(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Logs Explorer</h1>
          <p className="text-slate-400">Distributed log aggregation and real-time tailing.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleBulkAnalysis}
            disabled={isBulkAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20"
          >
            {isBulkAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span>Analyze with AI</span>
          </button>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Main Log Area */}
        <div className="lg:col-span-3 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-900/50">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter by message or service..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 text-slate-200"
                />
              </div>
              <select 
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as LogLevel | 'ALL')}
                className="bg-slate-800 border-none rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 text-slate-200"
              >
                <option value="ALL">All Levels</option>
                <option value={LogLevel.INFO}>Info</option>
                <option value={LogLevel.WARN}>Warning</option>
                <option value={LogLevel.ERROR}>Error</option>
                <option value={LogLevel.DEBUG}>Debug</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isLive ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <RefreshCw size={14} className={isLive ? 'animate-spin' : ''} />
                <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
              </button>
              <div className="w-px h-6 bg-slate-800 mx-2" />
              <span className="text-xs text-slate-500 font-mono">{filteredLogs.length} events</span>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
            {filteredLogs.map(log => (
              <LogRow 
                key={log.id} 
                log={log} 
                onAnalyze={handleSingleAnalysis}
                isAnalyzing={analyzingLogId === log.id}
              />
            ))}
            {filteredLogs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Terminal size={48} className="mb-4 opacity-20" />
                <p>No log events matching current filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="flex flex-col space-y-6">
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
            <Sparkles className="absolute -right-2 -top-2 text-indigo-500/10 w-24 h-24 rotate-12" />
            <h3 className="font-bold text-lg mb-2 flex items-center">
              AI Insights
              <span className="ml-2 px-1.5 py-0.5 rounded bg-indigo-500 text-[10px] text-white uppercase tracking-wider">Beta</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              OmniSight AI analyzes your logs in real-time to detect drift, categorize errors, and suggest instant resolutions.
            </p>
            <div className="bg-slate-900/50 border border-indigo-500/30 rounded-lg p-4 min-h-[200px] text-sm text-slate-300 relative">
              {analysisResult ? (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="leading-relaxed whitespace-pre-wrap">{analysisResult}</p>
                  </div>
                  <button 
                    onClick={() => setAnalysisResult(null)}
                    className="mt-4 text-xs text-slate-500 hover:text-white"
                  >
                    Clear Analysis
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center absolute inset-0 opacity-40">
                  <Sparkles size={32} className="mb-2 text-indigo-400" />
                  <p className="text-xs text-center px-4">Select an error to explain or run bulk analysis.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center">
              <Filter size={18} className="mr-2 text-slate-400" />
              Quick Filters
            </h3>
            <div className="space-y-2">
              {['database', 'latency', 'auth', 'deployment', 'timeout'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
