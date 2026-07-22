import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Zap, 
  Play, 
  Pause, 
  Trash2, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  Eye, 
  Search, 
  Compass, 
  Plus, 
  RefreshCw, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Shield, 
  AlertTriangle,
  X,
  MailCheck,
  Check,
  Sliders,
  BellRing
} from 'lucide-react';
import { OpportunityAlertConfig, OpportunityAlertLog } from '../types';

interface OpportunityAlertsTabProps {
  userEmail: string;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onAlertTriggered: () => void; // call when new alerts are fetched to sync global notifications
}

export default function OpportunityAlertsTab({
  userEmail,
  addToast,
  onAlertTriggered
}: OpportunityAlertsTabProps) {
  // Configs and Logs States
  const [configs, setConfigs] = useState<OpportunityAlertConfig[]>([]);
  const [logs, setLogs] = useState<OpportunityAlertLog[]>([]);
  const [isConfigsLoading, setIsConfigsLoading] = useState(false);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  
  // Checking states per config rule
  const [checkingRuleId, setCheckingRuleId] = useState<string | null>(null);

  // Form state for creating a monitor
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newType, setNewType] = useState<'trend' | 'niche' | 'competitor_viral' | 'keyword'>('trend');
  const [newTitle, setNewTitle] = useState('');
  const [newQueryOrUrl, setNewQueryOrUrl] = useState('');
  const [newInterval, setNewInterval] = useState<'Daily' | 'Weekly' | 'Monthly' | 'None'>('Daily');
  const [deliveryEmail, setDeliveryEmail] = useState(true);
  const [deliveryDashboard, setDeliveryDashboard] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Modals view states
  const [selectedLog, setSelectedLog] = useState<OpportunityAlertLog | null>(null);
  const [selectedEmailLog, setSelectedEmailLog] = useState<OpportunityAlertLog | null>(null);
  const [checkedActionItems, setCheckedActionItems] = useState<Record<string, boolean>>({});

  // Preset templates for quick-adding monitor triggers
  const PRESET_TEMPLATES = [
    { type: 'trend', title: 'Breakout Frameworks Tracker', queryOrUrl: 'React 19 & Next.js 15', interval: 'Daily' },
    { type: 'niche', title: 'No-Code SaaS Gaps Finder', queryOrUrl: 'Bubble vs FlutterFlow niches', interval: 'Weekly' },
    { type: 'competitor_viral', title: 'Fireship Tech Spy Monitor', queryOrUrl: 'https://youtube.com/@fireship', interval: 'Daily' },
    { type: 'keyword', title: 'AI Engineering Breakouts', queryOrUrl: 'Vibe Coding', interval: 'Daily' }
  ];

  // Fetch configs and logs on load
  const fetchData = async () => {
    setIsConfigsLoading(true);
    setIsLogsLoading(true);
    try {
      const configRes = await fetch(`/api/opportunity/configs?userId=usr_default_omar`);
      const configData = await configRes.json();
      if (configData.success) {
        setConfigs(configData.configs);
      }

      const logRes = await fetch(`/api/opportunity/logs?userId=usr_default_omar`);
      const logData = await logRes.json();
      if (logData.success) {
        setLogs(logData.logs);
      }
    } catch (err) {
      console.error('Error fetching opportunity configurations/logs:', err);
      addToast('error', 'Failed to retrieve alert configurations.');
    } finally {
      setIsConfigsLoading(false);
      setIsLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQueryOrUrl.trim()) {
      addToast('error', 'Please fill in all monitor parameters.');
      return;
    }

    setIsSavingConfig(true);
    try {
      const res = await fetch('/api/opportunity/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_default_omar',
          type: newType,
          title: newTitle,
          queryOrUrl: newQueryOrUrl,
          interval: newInterval,
          deliveryEmail,
          deliveryDashboard,
          status: 'active'
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `Opportunity Monitor "${newTitle}" registered successfully!`);
        setShowCreateModal(false);
        // Reset form
        setNewTitle('');
        setNewQueryOrUrl('');
        setNewInterval('Daily');
        setDeliveryEmail(true);
        setDeliveryDashboard(true);
        // Refresh
        fetchData();
      } else {
        addToast('error', data.error || 'Failed to save configuration.');
      }
    } catch (err) {
      console.error('Error saving opportunity monitor:', err);
      addToast('error', 'Network error registering monitor rule.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Add preset template config
  const handleAddPreset = async (preset: typeof PRESET_TEMPLATES[0]) => {
    try {
      const res = await fetch('/api/opportunity/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_default_omar',
          type: preset.type,
          title: preset.title,
          queryOrUrl: preset.queryOrUrl,
          interval: preset.interval,
          deliveryEmail: true,
          deliveryDashboard: true,
          status: 'active'
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `Registered Preset Monitor: "${preset.title}"!`);
        fetchData();
      }
    } catch (err) {
      addToast('error', 'Failed to register preset.');
    }
  };

  // Delete Config
  const handleDeleteConfig = async (id: string) => {
    try {
      const res = await fetch(`/api/opportunity/configs/${id}?userId=usr_default_omar`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Alert monitor deleted.');
        fetchData();
      }
    } catch (err) {
      addToast('error', 'Failed to delete alert monitor.');
    }
  };

  // Toggle Config status (active / paused)
  const handleToggleStatus = async (config: OpportunityAlertConfig) => {
    try {
      const res = await fetch('/api/opportunity/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          status: config.status === 'active' ? 'paused' : 'active'
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast('info', `Monitor status is now ${config.status === 'active' ? 'Paused' : 'Active'}.`);
        fetchData();
      }
    } catch (err) {
      addToast('error', 'Failed to adjust monitor status.');
    }
  };

  // Manually run a monitor scan check
  const handleRunScan = async (configId: string) => {
    setCheckingRuleId(configId);
    try {
      const res = await fetch('/api/opportunity/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configId,
          userId: 'usr_default_omar',
          userEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `Alert Triggered! "${data.log.title}" detected.`);
        onAlertTriggered(); // trigger global reload of notifications
        fetchData();
      } else {
        addToast('error', data.error || 'Check completed with no new breakout items.');
      }
    } catch (err) {
      console.error('Scan error:', err);
      addToast('error', 'Scan failed due to a network interruption.');
    } finally {
      setCheckingRuleId(null);
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    try {
      const res = await fetch('/api/opportunity/logs/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'usr_default_omar' })
      });
      const data = await res.json();
      if (data.success) {
        addToast('info', 'Alert log feed cleared.');
        setLogs([]);
      }
    } catch (err) {
      addToast('error', 'Failed to clear feed.');
    }
  };

  // Mark all logs read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/opportunity/logs/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'usr_default_omar' })
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'All opportunity alerts marked as read.');
        setLogs(prev => prev.map(l => ({ ...l, read: true })));
      }
    } catch (err) {
      addToast('error', 'Failed to update alert logs status.');
    }
  };

  // Get dynamic icon for alert type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'niche':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'competitor_viral':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'keyword':
        return <Search className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  // Get human label for type
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'trend': return 'New Trend';
      case 'niche': return 'Low Competition Niche';
      case 'competitor_viral': return 'Competitor Viral Content';
      case 'keyword': return 'Keyword Opportunity';
      default: return 'Opportunity Alert';
    }
  };

  return (
    <div id="opportunity_alerts_container" className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0c101d] border border-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              GROWTH AUTOMATION
            </span>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              SCHEDULER ENGINE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BellRing className="w-6 h-6 text-emerald-400 animate-pulse" /> Opportunity Alerts
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Configure automated, high-frequency intelligence crawlers to scan Google Search volumes, breakout keyword indices, and competitor upload velocities. Receive targeted notifications instantly in your workspace and mock-email box.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 self-start md:self-center shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Alert Monitor
        </button>
      </div>

      {/* Preset Fast Configuration */}
      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Quick Preset Monitors (1-Click Setup)</h3>
        </div>
        <p className="text-[11px] text-slate-500">
          Instantly register standard growth crawler hooks for your channel category:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {PRESET_TEMPLATES.map((tpl, idx) => (
            <button
              key={idx}
              onClick={() => handleAddPreset(tpl)}
              className="flex flex-col text-left p-3.5 bg-[#070b14]/70 border border-slate-850 hover:border-emerald-500/40 rounded-xl transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-400 transition-colors">
                  {getTypeLabel(tpl.type)}
                </span>
                {getTypeIcon(tpl.type)}
              </div>
              <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-white mb-0.5">{tpl.title}</span>
              <span className="text-[10px] font-mono text-slate-500 truncate block">Target: {tpl.queryOrUrl}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout: Active Crawlers (Left) & Alert Feed Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Crawlers Panel */}
        <div className="lg:col-span-1 space-y-5">
          <div className="border-b border-slate-900/60 pb-3 flex justify-between items-center">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Active Alert Monitors ({configs.length})
            </h2>
            <span className="text-[9px] text-slate-500 font-mono">AUTOMATED STATE</span>
          </div>

          {isConfigsLoading ? (
            <div className="py-12 text-center bg-[#0c101d] border border-slate-900 rounded-2xl">
              <RefreshCw className="w-8 h-8 text-emerald-500 mx-auto animate-spin mb-2" />
              <p className="text-xs text-slate-400">Loading active crawlers...</p>
            </div>
          ) : configs.length === 0 ? (
            <div className="py-12 px-6 text-center bg-[#0c101d] border border-slate-900 rounded-2xl space-y-4">
              <Clock className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300">No Active Monitor Found</p>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Create a custom alert monitor or add a quick 1-click preset to start growth intelligence automation.</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#070b14] border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 text-xs font-mono font-medium rounded-lg transition-all"
              >
                + Register New Crawler
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((config) => {
                const isScanning = checkingRuleId === config.id;
                return (
                  <div
                    key={config.id}
                    className={`bg-[#0c101d] border rounded-2xl p-4 space-y-3.5 transition-all ${config.status === 'paused' ? 'opacity-60 border-slate-900' : 'border-slate-900 hover:border-slate-800/80'}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#070b14] border border-slate-850 rounded-lg">
                          {getTypeIcon(config.type)}
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase tracking-wider">
                            {getTypeLabel(config.type)}
                          </span>
                          <h4 className="text-xs font-bold text-white leading-normal">{config.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase ${config.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700/60'}`}>
                          {config.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#070b14]/70 border border-slate-850 rounded-xl px-3.5 py-2.5 space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider">MONITOR SCOPE:</span>
                      <p className="text-xs font-mono text-slate-300 truncate">{config.queryOrUrl}</p>
                    </div>

                    {/* Delivery and Schedule details */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-900 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Freq: {config.interval}</span>
                      </div>
                      <div className="flex gap-2">
                        {config.deliveryEmail && (
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <Mail className="w-3 h-3" /> Email
                          </span>
                        )}
                        {config.deliveryDashboard && (
                          <span className="text-sky-400 flex items-center gap-0.5">
                            <Bell className="w-3 h-3" /> Push
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-3 gap-2 border-t border-slate-900 pt-3">
                      <button
                        onClick={() => handleRunScan(config.id)}
                        disabled={config.status === 'paused' || isScanning}
                        className={`flex items-center justify-center gap-1.5 py-1.5 font-mono text-[10px] font-semibold text-[#070b14] bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 rounded-lg transition-all cursor-pointer`}
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" /> Scanning
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" /> Run Scan
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleStatus(config)}
                        className="flex items-center justify-center gap-1.5 py-1.5 font-mono text-[10px] text-slate-300 bg-[#070b14] border border-slate-850 hover:border-slate-750 rounded-lg transition-all cursor-pointer"
                      >
                        {config.status === 'active' ? (
                          <>
                            <Pause className="w-3 h-3 text-slate-400" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 text-slate-400" /> Activate
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteConfig(config.id)}
                        className="flex items-center justify-center gap-1.5 py-1.5 font-mono text-[10px] text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Triggered Alert Logs history (Alert Feed Logs) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="border-b border-slate-900/60 pb-3 flex justify-between items-center">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" /> Radar Activity Feed ({logs.length})
            </h2>
            
            {logs.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-mono text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Mark all read
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={handleClearLogs}
                  className="text-[10px] font-mono text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear history
                </button>
              </div>
            )}
          </div>

          {isLogsLoading ? (
            <div className="py-16 text-center bg-[#0c101d] border border-slate-900 rounded-2xl">
              <RefreshCw className="w-8 h-8 text-emerald-500 mx-auto animate-spin mb-2" />
              <p className="text-xs text-slate-400">Loading triggered feed...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20 text-center bg-[#0c101d] border border-slate-900 rounded-2xl space-y-3">
              <Bell className="w-10 h-10 text-slate-700 mx-auto mb-1 animate-bounce" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-300">Your Alert Feed is Empty</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">No breakout events are currently recorded. Click "Run Scan" on any monitor card to invoke a crawler scan manually!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => {
                const pct = log.detailData.potentialScore || 85;
                return (
                  <div
                    key={log.id}
                    className={`bg-[#0c101d] border rounded-2xl p-5 relative transition-all group ${log.read ? 'border-slate-900' : 'border-emerald-500/20 bg-emerald-500/[0.01]'}`}
                  >
                    {!log.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-400" />
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      
                      {/* Left Block */}
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-[#070b14] border border-slate-850 rounded-xl mt-0.5">
                          {getTypeIcon(log.type)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                              {getTypeLabel(log.type)}
                            </span>
                            <span className="text-slate-600 text-xs">•</span>
                            <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(log.createdAt).toLocaleDateString()})
                            </span>
                          </div>
                          
                          <h3 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors">
                            {log.title}
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                            {log.message}
                          </p>
                        </div>
                      </div>

                      {/* Right Potential Score */}
                      <div className="flex items-center gap-3 shrink-0 self-start md:self-center bg-[#070b14] border border-slate-850/80 px-4 py-2.5 rounded-xl">
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-slate-500 block">GROWTH INDEX</span>
                          <span className="text-xs font-bold text-slate-100 font-mono">{pct}% Match</span>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center relative overflow-hidden">
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-emerald-500/20 transition-all duration-500" 
                            style={{ height: `${pct}%` }}
                          />
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>

                    </div>

                    {/* Metrics Section */}
                    {log.detailData.metrics && log.detailData.metrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#070b14]/60 border border-slate-850 rounded-xl p-3.5 mt-4">
                        {log.detailData.metrics.map((metric, mIdx) => (
                          <div key={mIdx} className="space-y-0.5">
                            <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider">{metric.label}</span>
                            <span className="text-xs font-mono font-bold text-slate-200">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Log Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-900 pt-4 mt-4 text-[10px] font-mono text-slate-500">
                      <div className="flex gap-2">
                        {log.emailSent ? (
                          <span className="text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10 flex items-center gap-1">
                            <MailCheck className="w-3 h-3" /> Email Dispatched
                          </span>
                        ) : (
                          <span className="text-slate-500 bg-slate-900/40 px-2 py-1 rounded flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-600" /> Push Only
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {log.emailSent && log.emailBody && (
                          <button
                            onClick={() => setSelectedEmailLog(log)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#070b14] hover:bg-slate-900 text-slate-300 hover:text-emerald-400 border border-slate-850 hover:border-slate-750 rounded-lg transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Sent Email
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedLog(log);
                            // Mark read
                            log.read = true;
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-[#070b14] border border-emerald-500/20 hover:border-emerald-500 rounded-lg transition-all cursor-pointer"
                        >
                          Analyze Gaps & Action Plan <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* CREATE NEW MONITOR MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c101d] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden animate-slide-up">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#0e1424] border-b border-slate-900">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">Configure Growth Crawler</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900/60 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-6 space-y-5">
              
              {/* Type Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Monitor Objective Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('trend');
                      if (!newTitle) setNewTitle('Breakout Search Trend Tracker');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${newType === 'trend' ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' : 'border-slate-850 hover:border-slate-750 text-slate-400'}`}
                  >
                    <Flame className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block text-slate-200">New Trend</span>
                      <span className="text-[9px] text-slate-500 block leading-normal">Search velocity surge</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewType('niche');
                      if (!newTitle) setNewTitle('Low Competition Niche Finder');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${newType === 'niche' ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' : 'border-slate-850 hover:border-slate-750 text-slate-400'}`}
                  >
                    <Compass className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block text-slate-200">Low Comp Niche</span>
                      <span className="text-[9px] text-slate-500 block leading-normal">High intent, low coverage</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewType('competitor_viral');
                      if (!newTitle) setNewTitle('Competitor Viral Tracker');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${newType === 'competitor_viral' ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' : 'border-slate-850 hover:border-slate-750 text-slate-400'}`}
                  >
                    <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block text-slate-200">Competitor Viral</span>
                      <span className="text-[9px] text-slate-500 block leading-normal">Outperforming uploads</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewType('keyword');
                      if (!newTitle) setNewTitle('Keyword Opportunity Analyzer');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${newType === 'keyword' ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' : 'border-slate-850 hover:border-slate-750 text-slate-400'}`}
                  >
                    <Search className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block text-slate-200">Keyword Opt</span>
                      <span className="text-[9px] text-slate-500 block leading-normal">Breakout CPC keyword bids</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Monitor Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Monitor Identifier</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. NextJS Framework Breakout Radar"
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Scope Query or Url */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {newType === 'competitor_viral' ? 'Monitored Competitor URL' : 'Target Keyword Niche'}
                  </label>
                  <span className="text-[9px] text-slate-500 font-mono">CRAWLER SCOPE</span>
                </div>
                <input
                  type="text"
                  value={newQueryOrUrl}
                  onChange={(e) => setNewQueryOrUrl(e.target.value)}
                  placeholder={newType === 'competitor_viral' ? 'https://youtube.com/@techchannel' : 'e.g. AI Automation tools'}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Interval selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Scan Frequency</label>
                  <select
                    value={newInterval}
                    onChange={(e: any) => setNewInterval(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Daily">Daily (Every 24h)</option>
                    <option value="Weekly">Weekly (Every 7 days)</option>
                    <option value="Monthly">Monthly (Every 30 days)</option>
                    <option value="None">Manual Check Only</option>
                  </select>
                </div>

                {/* Delivery Targets */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Deliver Dispatch</label>
                  <div className="space-y-1.5 pt-1">
                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliveryEmail}
                        onChange={(e) => setDeliveryEmail(e.target.checked)}
                        className="rounded bg-[#070b14] border-slate-800 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>Email simulated Alert</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliveryDashboard}
                        onChange={(e) => setDeliveryDashboard(e.target.checked)}
                        className="rounded bg-[#070b14] border-slate-800 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>Workspace Notification</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-900/60 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white font-medium text-xs rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center gap-1.5"
                >
                  {isSavingConfig ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Sliders className="w-3.5 h-3.5" /> Initialize Monitor
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW INSIGHTS / DETAIL ACTION PLAN MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c101d] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#0e1424] border-b border-slate-900 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#070b14] border border-slate-850 rounded-lg">
                  {getTypeIcon(selectedLog.type)}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">GROWTH GAP REPORT</span>
                  <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Opportunity Action Plan</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900/60 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 divide-y divide-slate-900 scrollbar-thin flex-grow">
              
              {/* Overview Block */}
              <div className="space-y-2.5 pb-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white leading-snug">{selectedLog.title}</h4>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full">
                    Match score: {selectedLog.detailData.potentialScore || 85}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed bg-[#070b14]/50 border border-slate-900 p-4 rounded-xl">
                  {selectedLog.message}
                </p>
              </div>

              {/* Core Insights */}
              {selectedLog.detailData.insights && selectedLog.detailData.insights.length > 0 && (
                <div className="space-y-3 pt-5">
                  <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" /> Key Intelligence Signals
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedLog.detailData.insights.map((insight, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-400 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Clickable Titles */}
              {selectedLog.detailData.recommendedTitles && selectedLog.detailData.recommendedTitles.length > 0 && (
                <div className="space-y-3 pt-5">
                  <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" /> Recommended Clickable Titles
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedLog.detailData.recommendedTitles.map((title, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#070b14] border border-slate-850 rounded-xl hover:border-emerald-500/30 transition-all">
                        <p className="text-xs font-semibold text-slate-200 italic">"{title}"</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(title);
                            addToast('success', 'Title copied to clipboard!');
                          }}
                          className="text-[9px] font-mono text-slate-500 hover:text-emerald-400 border border-slate-800 hover:border-slate-700 px-2 py-1 rounded"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Action Items Checklist */}
              {selectedLog.detailData.actionItems && selectedLog.detailData.actionItems.length > 0 && (
                <div className="space-y-3 pt-5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400" /> Interactive Action Steps Checklist
                    </h4>
                    <span className="text-[9px] text-slate-500 font-mono">TAP TO CHECK OFF</span>
                  </div>
                  <div className="space-y-2">
                    {selectedLog.detailData.actionItems.map((item, idx) => {
                      const itemKey = `${selectedLog.id}_item_${idx}`;
                      const isChecked = !!checkedActionItems[itemKey];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCheckedActionItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
                            if (!isChecked) {
                              addToast('success', 'Step checked off! Keep crushing it.');
                            }
                          }}
                          className={`w-full flex items-start text-left gap-3 p-3.5 rounded-xl border transition-all ${isChecked ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400' : 'bg-[#070b14] border-slate-850 hover:border-slate-750 text-slate-200'}`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${isChecked ? 'bg-emerald-500 border-emerald-400 text-[#070b14]' : 'border-slate-700 bg-[#070b14]'}`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`text-xs leading-relaxed ${isChecked ? 'line-through text-slate-500' : ''}`}>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#0e1424] border-t border-slate-900 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                Close Action Plan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EMAIL CLIENT PREVIEW MODAL */}
      {selectedEmailLog && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c101d] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            
            {/* Browser/Email Bar */}
            <div className="px-6 py-4 bg-[#0e1424] border-b border-slate-900 shrink-0 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono text-slate-500 ml-2 uppercase tracking-wider">Simulated Email Inbox Client</span>
              </div>
              <button
                onClick={() => setSelectedEmailLog(null)}
                className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900/60 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Headers Info */}
            <div className="px-6 py-4 bg-[#070b14] border-b border-slate-900 space-y-2 text-xs shrink-0 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400"><strong>From:</strong> intelligence-radar@viralgap.ai</span>
                <span className="text-slate-500 font-mono text-[10px]">{new Date(selectedEmailLog.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400"><strong>To:</strong> {selectedEmailLog.emailSentTo}</span>
              </div>
              <div className="pt-1 border-t border-slate-900">
                <span className="text-slate-100"><strong>Subject:</strong> {selectedEmailLog.emailSubject}</span>
              </div>
            </div>

            {/* Email Render Frame */}
            <div className="p-6 overflow-y-auto bg-[#070b14]/40 flex-grow">
              <div 
                className="border border-slate-850 rounded-2xl bg-[#0c101d] overflow-hidden shadow-2xl"
                dangerouslySetInnerHTML={{ __html: selectedEmailLog.emailBody || '' }} 
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#0e1424] border-t border-slate-900 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedEmailLog(null)}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
