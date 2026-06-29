import React from 'react';
import { Settings, CreditCard, LogOut, Sparkles, X, RefreshCw } from 'lucide-react';

interface User {
  displayName: string;
  email: string;
  avatarUrl: string;
}

interface UserMenuDropdownProps {
  user: User;
  plan: string;
  credits: number;
  onNavigate: (tab: any) => void;
  onLogout: () => void;
  onRefillCredits: () => void;
  onClose: () => void;
}

export default function UserMenuDropdown({
  user,
  plan,
  credits,
  onNavigate,
  onLogout,
  onRefillCredits,
  onClose
}: UserMenuDropdownProps) {
  return (
    <div 
      id="user_menu_dropdown"
      className="absolute right-0 mt-2 w-64 bg-[#0c101d] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up"
    >
      {/* Profile Details header */}
      <div className="p-4 border-b border-slate-900 bg-[#0e1424]">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
            {plan} Tier
          </span>
          <button 
            onClick={onClose}
            className="p-0.5 text-slate-500 hover:text-slate-300 rounded transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2.5 mt-1">
          <img 
            src={user.avatarUrl} 
            alt="avatar" 
            className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900 shadow shrink-0" 
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate leading-relaxed">{user.displayName}</h4>
            <span className="text-[10px] font-mono text-slate-500 block truncate">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Credit usage readout */}
      <div className="p-3.5 bg-[#080c16]/50 border-b border-slate-900/60 font-mono text-[10px] space-y-1.5">
        <div className="flex justify-between text-slate-400">
          <span>CREATOR QUOTA:</span>
          <span className="text-white font-bold">{credits} / 500 Credits</span>
        </div>
        <div className="w-full bg-[#070b14] h-1.5 rounded-full overflow-hidden border border-slate-900">
          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(credits / 500) * 100}%` }}></div>
        </div>
      </div>

      {/* Quick links list */}
      <div className="p-1.5 space-y-0.5">
        <button 
          onClick={() => { onNavigate('settings'); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-xl transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          Account Settings
        </button>
        <button 
          onClick={() => { onNavigate('billing'); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-xl transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-slate-400" />
          Billing & Subscription
        </button>
        <button 
          onClick={() => { onRefillCredits(); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          Refill Creator Credits
        </button>
      </div>

      {/* Logout foot */}
      <div className="p-1.5 border-t border-slate-900 bg-[#080c16]/20">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          Sign Out of Workspace
        </button>
      </div>
    </div>
  );
}
