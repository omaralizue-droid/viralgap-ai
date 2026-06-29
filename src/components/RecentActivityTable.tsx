import React from 'react';
import { Compass, Link as LinkIcon, FileText, Image as ImageIcon, Sparkles, LogIn, Key, RefreshCw } from 'lucide-react';

export interface ActivityLog {
  id: string;
  type: 'contentGap' | 'urlAnalysis' | 'script' | 'prompt' | 'system' | 'auth';
  title: string;
  detail: string;
  credits: number;
  time: string;
}

interface RecentActivityTableProps {
  logs: ActivityLog[];
  onClearLogs?: () => void;
}

export default function RecentActivityTable({ logs, onClearLogs }: RecentActivityTableProps) {
  return (
    <div id="recent_activity_section" className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-900/60 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Creator Session Log</span>
          <h4 className="text-sm font-bold text-white font-mono mt-0.5">Audit Trail & Recent Activity</h4>
        </div>
        
        {onClearLogs && logs.length > 0 && (
          <button 
            onClick={onClearLogs}
            className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
          >
            Clear Activity History
          </button>
        )}
      </div>

      {/* Table / Timeline layout */}
      <div className="overflow-x-auto w-full">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-900 rounded-xl">
            <p className="text-xs font-mono">No recent actions logged in this session.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900/80 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Action / Target</th>
                <th className="pb-3 hidden sm:table-cell font-semibold">Operation Details</th>
                <th className="pb-3 text-right font-semibold">Cost</th>
                <th className="pb-3 text-right font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/40 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/60 transition-all border-b border-transparent hover:border-slate-900">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        log.type === 'contentGap' ? 'bg-emerald-500/[0.04] text-emerald-450 border border-emerald-500/10' :
                        log.type === 'urlAnalysis' ? 'bg-sky-500/[0.04] text-sky-450 border border-sky-500/10' :
                        log.type === 'script' ? 'bg-purple-500/[0.04] text-purple-455 border border-purple-500/10' :
                        log.type === 'prompt' ? 'bg-amber-500/[0.04] text-amber-450 border border-amber-500/10' :
                        'bg-slate-950 text-slate-400 border border-slate-900'
                      }`}>
                        {log.type === 'contentGap' && <Compass className="w-3.5 h-3.5" />}
                        {log.type === 'urlAnalysis' && <LinkIcon className="w-3.5 h-3.5" />}
                        {log.type === 'script' && <FileText className="w-3.5 h-3.5" />}
                        {log.type === 'prompt' && <ImageIcon className="w-3.5 h-3.5" />}
                        {log.type === 'auth' && <LogIn className="w-3.5 h-3.5" />}
                        {log.type === 'system' && <Key className="w-3.5 h-3.5" />}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-white block truncate">{log.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block sm:hidden">
                          {log.detail}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-3.5 hidden sm:table-cell text-slate-400">
                    <span className="truncate max-w-sm block leading-relaxed font-sans">{log.detail}</span>
                  </td>
 
                  <td className="py-3.5 text-right font-mono text-[11px]">
                    {log.credits > 0 ? (
                      <span className="text-emerald-400 font-bold bg-emerald-500/[0.05] px-2 py-0.5 rounded border border-emerald-500/10">-{log.credits} cr</span>
                    ) : (
                      <span className="text-slate-600 font-mono">--</span>
                    )}
                  </td>
 
                  <td className="py-3.5 text-right text-slate-500 font-mono text-[10px]">
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
