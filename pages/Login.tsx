
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@omnisight.io');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin(email);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold">OmniSight Console</h1>
          <p className="text-slate-500 text-sm text-center mt-2">
            Enter your credentials to access the monitoring cluster.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-600"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="rounded border-slate-800 bg-slate-800 text-indigo-600 focus:ring-offset-slate-900" />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-500">Remember device</label>
            </div>
            <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">Forgot password?</a>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : null}
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-600">
            SAML SSO enabled. <a href="#" className="text-indigo-400 hover:underline">Log in via Enterprise Identity</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
