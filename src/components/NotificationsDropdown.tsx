import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  time: string;
  unread: boolean;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function NotificationsDropdown({
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onClose
}: NotificationsDropdownProps) {
  return (
    <div 
      id="notifications_dropdown"
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0c0c0e] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3.5 border-b border-[rgba(255,255,255,0.06)] bg-[#0f0f12]">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-emerald-500/10 rounded-lg">
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[11px] font-bold font-mono text-white tracking-wider uppercase">Inbox</span>
          {notifications.some(n => n.unread) && (
            <span className="bg-emerald-500 text-black font-mono font-bold text-[9px] px-2 py-0.5 rounded-full leading-none animate-pulse">
              {notifications.filter(n => n.unread).length} new
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)] scrollbar-thin">
        {notifications.length === 0 ? (
          <div className="py-12 px-4 text-center text-slate-500">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-xs font-semibold text-slate-200">No new messages</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto">We'll notify you here when there are updates to your workspace.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`p-4 transition-all flex items-start gap-3.5 relative hover:bg-white/[0.02] ${n.unread ? 'bg-emerald-500/[0.02]' : ''}`}
            >
              {/* Unread indicator dot */}
              {n.unread && (
                <span className="absolute top-4 left-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              )}
              
              <div className="shrink-0 mt-0.5">
                {n.type === 'success' && (
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
                {n.type === 'error' && (
                  <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-550 border border-rose-500/10">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                )}
                {n.type === 'info' && (
                  <div className="p-1.5 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/10">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <div className="flex-grow space-y-1 pr-2">
                <p className={`text-[11px] leading-relaxed tracking-normal ${n.unread ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>
                  {n.message}
                </p>
                <span className="text-[9px] font-mono text-slate-500 block">{n.time}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-2 divide-x divide-[rgba(255,255,255,0.06)] border-t border-[rgba(255,255,255,0.06)] bg-[#0f0f12]">
          <button 
            onClick={onMarkAllAsRead}
            className="py-3 text-center text-[10px] font-mono font-medium text-slate-400 hover:text-emerald-400 hover:bg-white/[0.01] transition-all cursor-pointer uppercase tracking-wider"
          >
            Mark all read
          </button>
          <button 
            onClick={onClearAll}
            className="py-3 text-center text-[10px] font-mono font-medium text-slate-400 hover:text-rose-400 hover:bg-white/[0.01] transition-all cursor-pointer uppercase tracking-wider"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
