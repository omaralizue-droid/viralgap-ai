import React, { useState, useEffect } from 'react';
import {
  Database,
  ShieldCheck,
  Terminal,
  Layers,
  Copy,
  Check,
  Search,
  BookOpen,
  TrendingUp,
  Sparkles,
  Activity,
  Sliders,
  AlertCircle,
  Code,
  LayoutDashboard,
  Compass,
  Link,
  FileText,
  Image as ImageIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Mail,
  Lock,
  ArrowRight,
  Globe,
  Plus,
  RefreshCw,
  Coins,
  DollarSign,
  Shield,
  ShieldAlert,
  Youtube,
  Zap,
  CheckCircle2,
  ListFilter,
  Bell,
  Menu,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lightbulb,
  Info,
  ThumbsUp,
  ThumbsDown,
  Settings,
  MessageSquare,
  Calendar,
  History,
  Award,
  Video,
  Camera,
  Sun,
  Mic,
  Volume2,
  Film,
  PlusCircle,
  HelpCircle,
  Clock,
  Play,
  PlayCircle,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Flame,
  Gift
} from 'lucide-react';

interface CompetitorToolProps {
  userId: string;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function CompetitorTool({ userId, addToast }: CompetitorToolProps) {
  const [competitorUrlInput, setCompetitorUrlInput] = useState('');
  const [competitorNicheInput, setCompetitorNicheInput] = useState('AI-driven micro-SaaS builders');
  const [competitorReports, setCompetitorReports] = useState<any[]>([]);
  const [activeCompetitorReport, setActiveCompetitorReport] = useState<any | null>(null);
  const [isCompetitorLoading, setIsCompetitorLoading] = useState(false);
  const [competitorError, setCompetitorError] = useState<string | null>(null);
  const [selectedMonitorSchedule, setSelectedMonitorSchedule] = useState<'Daily' | 'Weekly' | 'Monthly' | 'None'>('None');
  const [isSimulatingSchedule, setIsSimulatingSchedule] = useState(false);

  const fetchCompetitorReports = () => {
    fetch(`/api/competitor/reports?userId=${userId || 'usr_default_omar'}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.reports) {
          setCompetitorReports(data.reports);
          if (data.reports.length > 0 && !activeCompetitorReport) {
            setActiveCompetitorReport(data.reports[0]);
          }
        }
      })
      .catch(err => {
        console.error('Error fetching competitor reports:', err);
      });
  };

  const runCompetitorAnalysis = async (
    customUrl?: string,
    customNiche?: string,
    customFreq?: 'Daily' | 'Weekly' | 'Monthly' | 'None'
  ) => {
    const url = customUrl || competitorUrlInput;
    const niche = customNiche || competitorNicheInput;
    const freq = customFreq || selectedMonitorSchedule;

    if (!url) {
      addToast('error', 'Please enter a competitor channel URL.');
      return;
    }

    setIsCompetitorLoading(true);
    setCompetitorError(null);

    try {
      const response = await fetch('/api/competitor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorUrl: url,
          userNiche: niche,
          userId: userId || 'usr_default_omar',
          scheduledFrequency: freq
        })
      });

      const data = await response.json();
      if (data.success && data.report) {
        setCompetitorReports(prev => [data.report, ...prev.filter(r => r.id !== data.report.id)]);
        setActiveCompetitorReport(data.report);
        setCompetitorUrlInput('');
        setSelectedMonitorSchedule('None');

        if (data.isFallback) {
          addToast('info', `Simulated intelligence report compiled for "${data.report.competitorName}".`);
        } else {
          addToast('success', `Competitor report generated for "${data.report.competitorName}"!`);
        }
      } else {
        throw new Error(data.error || 'Failed to analyze competitor channel.');
      }
    } catch (err: any) {
      setCompetitorError(err.message || 'An error occurred during competitive analysis.');
      addToast('error', err.message || 'Competitive intelligence compilation failed.');
    } finally {
      setIsCompetitorLoading(false);
    }
  };

  const updateReportSchedule = async (reportId: string, freq: 'Daily' | 'Weekly' | 'Monthly' | 'None') => {
    try {
      const response = await fetch('/api/competitor/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reportId,
          scheduledFrequency: freq,
          userId: userId || 'usr_default_omar'
        })
      });

      const data = await response.json();
      if (data.success && data.report) {
        setCompetitorReports(prev => prev.map(r => r.id === reportId ? data.report : r));
        setActiveCompetitorReport(data.report);
        addToast('success', `Update frequency changed to ${freq}!`);
      } else {
        throw new Error(data.error || 'Failed to update scheduled frequency.');
      }
    } catch (err: any) {
      addToast('error', err.message || 'Could not update scheduled frequency.');
    }
  };

  const deleteCompetitorReport = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to delete this competitor watch monitor?')) {
      return;
    }

    try {
      const response = await fetch(`/api/competitor/reports/${reportId}?userId=${userId || 'usr_default_omar'}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        const filtered = competitorReports.filter(r => r.id !== reportId);
        setCompetitorReports(filtered);
        if (activeCompetitorReport?.id === reportId) {
          setActiveCompetitorReport(filtered.length > 0 ? filtered[0] : null);
        }
        addToast('success', 'Competitor monitor removed successfully.');
      } else {
        throw new Error(data.error || 'Failed to delete competitor report.');
      }
    } catch (err: any) {
      addToast('error', err.message || 'Could not delete competitor report.');
    }
  };

  const simulateScheduledUpdate = async () => {
    setIsSimulatingSchedule(true);
    try {
      const response = await fetch('/api/competitor/simulate-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId || 'usr_default_omar' })
      });

      const data = await response.json();
      if (data.success) {
        if (data.updatedCount > 0) {
          fetchCompetitorReports();
          // Find matching report in newly fetched if it was active
          if (activeCompetitorReport) {
            const updatedActive = data.updatedReports.find((r: any) => r.id === activeCompetitorReport.id);
            if (updatedActive) {
              setActiveCompetitorReport(updatedActive);
            }
          }
          addToast('success', `Simulated updates completed for ${data.updatedCount} scheduled monitors!`);
        } else {
          addToast('info', 'No monitors have active scheduled updates. Set update frequency to Daily, Weekly, or Monthly.');
        }
      } else {
        throw new Error(data.error || 'Failed to simulate scheduled update.');
      }
    } catch (err: any) {
      addToast('error', err.message || 'Error simulating scheduled update.');
    } finally {
      setIsSimulatingSchedule(false);
    }
  };

  useEffect(() => {
    fetchCompetitorReports();
  }, [userId]);

  return (
    <div className="space-y-6">
                    {/* Header block */}
              <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wide">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" /> Competitive Intelligence Suite
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans animate-fade-in">
                    Competitor Watch & Intelligence
                  </h2>
                  <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                    Track your competitor channels' subscription growth velocities, view dynamics, and newest uploads. Extract high-impact winning formats, dominant content topics, and high-potential audience content gaps with Gemini AI.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Intake and Monitors */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Channel Intake Form */}
                  <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-5">
                    <div className="border-b border-slate-900 pb-3">
                      <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                        Channel Tracker Config
                      </h3>
                      <p className="text-[10px] font-sans text-slate-500 mt-0.5">
                        Establish active monitors on major competitive players.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Competitor Channel URL */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                          Competitor Channel URL
                        </label>
                        <div className="relative">
                          <Youtube className="absolute left-3.5 top-3 w-4 h-4 text-rose-500" />
                          <input
                            type="text"
                            value={competitorUrlInput}
                            onChange={(e) => setCompetitorUrlInput(e.target.value)}
                            className="w-full bg-[#070b14] border border-slate-850 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                            placeholder="e.g. youtube.com/@fireship"
                          />
                        </div>
                      </div>

                      {/* User Niche context */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                          Your Niche Context
                        </label>
                        <input
                          type="text"
                          value={competitorNicheInput}
                          onChange={(e) => setCompetitorNicheInput(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                          placeholder="e.g. AI-driven micro-SaaS"
                        />
                      </div>

                      {/* Scheduled Updates Frequency */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                          Monitor Update Interval
                        </label>
                        <select
                          value={selectedMonitorSchedule}
                          onChange={(e) => setSelectedMonitorSchedule(e.target.value as any)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans cursor-pointer"
                        >
                          <option value="None">None (Manual updates only)</option>
                          <option value="Daily">Daily Update Check (Simulated)</option>
                          <option value="Weekly">Weekly Update Check (Simulated)</option>
                          <option value="Monthly">Monthly Update Check (Simulated)</option>
                        </select>
                      </div>

                      {/* Track Button */}
                      <button
                        onClick={() => runCompetitorAnalysis()}
                        disabled={isCompetitorLoading}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950/40 text-[#070b14] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        {isCompetitorLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Gathering Intelligence...
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5" /> Initialize Competitor Tracker
                          </>
                        )}
                      </button>
                    </div>

                    {/* Pre-configured Presets */}
                    <div className="space-y-2 pt-2 border-t border-slate-900/60">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Quick Presets:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: 'Fireship Dev', url: 'https://youtube.com/@fireship', niche: 'Developer Micro-SaaS & Tech' },
                          { name: 'MKBHD Tech', url: 'https://youtube.com/@mkbhd', niche: 'Minimalist Workspace & Tech Gear' },
                          { name: 'MrBeast Viral', url: 'https://youtube.com/@mrbeast', niche: 'High-Retention Physical Challenges' }
                        ].map(preset => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              setCompetitorUrlInput(preset.url);
                              setCompetitorNicheInput(preset.niche);
                              runCompetitorAnalysis(preset.url, preset.niche);
                            }}
                            className="text-[9px] font-sans bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-300 px-2 py-1 rounded transition-all cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Monitors List */}
                  <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-4">
                    <div className="border-b border-[#141a2f] pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-slate-500" /> Active Monitors ({competitorReports.length})
                        </h3>
                        <p className="text-[10px] font-sans text-slate-500 mt-0.5">
                          Stored intelligence records.
                        </p>
                      </div>

                      {/* Simulation Trigger button */}
                      {competitorReports.some(r => r.scheduledFrequency !== 'None') && (
                        <button
                          onClick={simulateScheduledUpdate}
                          disabled={isSimulatingSchedule}
                          className="text-[9px] font-mono font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-2 py-1 rounded transition-all cursor-pointer flex items-center gap-1"
                          title="Simulate background monitor checks for scheduled channels"
                        >
                          <RefreshCw className={`w-2.5 h-2.5 ${isSimulatingSchedule ? 'animate-spin' : ''}`} />
                          Simulate Updates
                        </button>
                      )}
                    </div>

                    {competitorReports.length === 0 ? (
                      <div className="text-center py-4 text-slate-600 text-[11px] font-sans italic">
                        No competitor channels tracked yet.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                        {competitorReports.map(report => (
                          <div
                            key={report.id}
                            onClick={() => {
                              setActiveCompetitorReport(report);
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 group flex items-center justify-between gap-3 ${
                              activeCompetitorReport?.id === report.id
                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                : 'bg-slate-950/40 border-slate-900 hover:bg-slate-900/40'
                            }`}
                          >
                            <div className="space-y-1 truncate flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-slate-200 group-hover:text-white transition-all truncate">
                                  {report.competitorName}
                                </span>
                                {report.scheduledFrequency !== 'None' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" title={`Auto-updates: ${report.scheduledFrequency}`} />
                                )}
                              </div>
                              <div className="text-[9px] font-mono text-slate-500 flex items-center gap-2">
                                <span>{report.subscriberCount} subs</span>
                                <span>•</span>
                                <span className="truncate max-w-[120px]">{report.competitorUrl.replace(/^https?:\/\/(?:www\.)?youtube\.com\//, '')}</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCompetitorReport(report.id);
                              }}
                              className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg border border-transparent hover:border-rose-500/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
                              title="Delete monitor"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Intelligence Output */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Empty state */}
                  {!activeCompetitorReport && !isCompetitorLoading && !competitorError && (
                    <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center h-full min-h-[450px] flex flex-col justify-center items-center">
                      <Eye className="w-12 h-12 text-slate-700 mb-4 animate-pulse" />
                      <h4 className="text-sm font-semibold text-white font-sans">Awaiting Channel Profile Input</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        Insert a competitor's YouTube URL or click a quick preset on the left panel to execute full-spectrum algorithmic and topic analyses.
                      </p>
                    </div>
                  )}

                  {/* Loading State */}
                  {isCompetitorLoading && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center h-full min-h-[450px] flex flex-col justify-center items-center space-y-6 animate-fade-in">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                        <Eye className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest">SCRAPING COMPETITOR TRAFFIC DATA</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed animate-pulse font-sans">
                          Querying upload history metrics, mapping subscriber growth indicators, synthesizing format structures, and finding content gaps...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {competitorError && (
                    <div className="bg-[#0c101d] border border-rose-500/10 rounded-2xl p-8 text-center h-full min-h-[450px] flex flex-col justify-center items-center space-y-4">
                      <AlertCircle className="w-10 h-10 text-rose-400" />
                      <h4 className="text-sm font-bold text-rose-400 font-mono">WATCH SUITE FAULT</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
                        {competitorError}
                      </p>
                      <button
                        onClick={() => runCompetitorAnalysis()}
                        className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
                      >
                        Retry Analysis
                      </button>
                    </div>
                  )}

                  {/* Recommendations Output */}
                  {activeCompetitorReport && !isCompetitorLoading && (
                    <div className="space-y-6 animate-fade-in text-left">
                      
                      {/* Hero Info Card */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#141a2f] pb-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white font-sans">{activeCompetitorReport.competitorName}</h3>
                              <a
                                href={activeCompetitorReport.competitorUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-500 hover:text-emerald-400 text-xs transition-all flex items-center gap-1"
                              >
                                <Link className="w-3.5 h-3.5" /> Link
                              </a>
                            </div>
                            <p className="text-[10px] font-mono text-slate-500">
                              MONITOR_ID: {activeCompetitorReport.id}
                            </p>
                          </div>

                          {/* Quick frequency config in headers */}
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Auto-Check:</span>
                            <select
                              value={activeCompetitorReport.scheduledFrequency || 'None'}
                              onChange={(e) => updateReportSchedule(activeCompetitorReport.id, e.target.value as any)}
                              className="bg-[#070b14] border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10.5px] text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
                            >
                              <option value="None">Disabled</option>
                              <option value="Daily">Daily Update</option>
                              <option value="Weekly">Weekly Update</option>
                              <option value="Monthly">Monthly Update</option>
                            </select>
                          </div>
                        </div>

                        {/* Top Tracking Metrics Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                          <div className="bg-slate-950/40 p-4 border border-slate-900/60 rounded-xl space-y-1.5">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Subscribers</span>
                            <div className="text-xl font-bold text-white flex items-baseline gap-2">
                              {activeCompetitorReport.subscriberCount}
                              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" /> {activeCompetitorReport.subscriberGrowth}
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-950/40 p-4 border border-slate-900/60 rounded-xl space-y-1.5">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Weekly View Growth</span>
                            <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
                              {activeCompetitorReport.viewGrowth}
                            </div>
                          </div>

                          <div className="bg-slate-950/40 p-4 border border-slate-900/60 rounded-xl space-y-1.5">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Last Sync Check</span>
                            <div className="text-[11px] font-mono text-slate-300">
                              {new Date(activeCompetitorReport.lastUpdatedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Video Analytics Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* New Uploads Tracker */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-[#141a2f] pb-3">
                            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-emerald-400" /> New Uploads
                            </h4>
                            <span className="text-[9px] font-mono text-slate-500 font-semibold">Updated in real-time</span>
                          </div>

                          <div className="space-y-3">
                            {activeCompetitorReport.newUploads?.map((video: any, idx: number) => (
                              <div key={idx} className="bg-slate-950 p-3.5 border border-slate-900 rounded-xl space-y-1.5 flex flex-col justify-between hover:border-slate-800 transition-all">
                                <div className="text-[11.5px] font-bold text-slate-200 leading-snug">
                                  {video.title}
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                                  <span>{video.views}</span>
                                  <span>{video.publishedAt}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Most Successful Videos */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-[#141a2f] pb-3">
                            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Flame className="w-4 h-4 text-amber-400" /> Most Successful Videos
                            </h4>
                            <span className="text-[9px] font-mono text-slate-500 font-semibold">All-time high views</span>
                          </div>

                          <div className="space-y-3">
                            {activeCompetitorReport.mostSuccessfulVideos?.map((video: any, idx: number) => (
                              <div key={idx} className="bg-slate-950 p-3.5 border border-slate-900 rounded-xl space-y-1.5 flex flex-col justify-between hover:border-slate-800 transition-all">
                                <div className="text-[11.5px] font-bold text-slate-200 leading-snug truncate" title={video.title}>
                                  {video.title}
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                                  <span>{video.views} ({video.uploadDate})</span>
                                  <span className="text-amber-400 font-bold">CTR Est: {video.ctrEst}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Intelligence Output: Winning Formats & Topics */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Winning Formats */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-4">
                          <div className="border-b border-[#141a2f] pb-3">
                            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-purple-400" /> Winning Formats
                            </h4>
                          </div>

                          <div className="space-y-3">
                            {activeCompetitorReport.winningFormats?.map((fmt: any, idx: number) => (
                              <div key={idx} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-2">
                                <div className="text-[11.5px] font-bold text-white font-mono">
                                  {fmt.format}
                                </div>
                                <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                                  {fmt.whyItWorks}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Winning Topics & Emerging Trends */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-5">
                          {/* Winning Topics */}
                          <div className="space-y-3.5">
                            <div className="border-b border-[#141a2f] pb-2">
                              <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                                Winning Topics
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {activeCompetitorReport.winningTopics?.map((topic: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-sans px-3 py-1.5 bg-[#070b14] border border-[#1d2745] text-slate-200 rounded-full font-medium"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Emerging Topics */}
                          <div className="space-y-3.5 pt-2">
                            <div className="border-b border-[#141a2f] pb-2">
                              <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Emerging Topics
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {activeCompetitorReport.emergingTopics?.map((topic: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-mono px-3 py-1.5 bg-amber-500/5 border border-amber-500/15 text-amber-300 rounded-lg font-bold"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Gaps Analysis */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                        <div className="border-b border-[#141a2f] pb-3">
                          <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-sky-400" /> Competitor Content Gaps
                          </h4>
                          <p className="text-[10px] font-sans text-slate-500 mt-1">
                            Exploitable high-CTR content gaps discovered in competitor coverage.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {activeCompetitorReport.contentGaps?.map((gap: any, idx: number) => (
                            <div key={idx} className="bg-slate-950 p-4 border border-slate-900 hover:border-slate-800 rounded-xl flex flex-col justify-between transition-all relative">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    gap.difficulty === 'Low'
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : gap.difficulty === 'Medium'
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  }`}>
                                    {gap.difficulty} Difficulty
                                  </span>
                                  <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">GAP 0{idx+1}</span>
                                </div>
                                <h4 className="text-[12px] font-bold text-slate-200 leading-snug">
                                  {gap.topic}
                                </h4>
                                <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans italic pt-1 border-t border-slate-900/40">
                                  "{gap.missedAngle}"
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`Gap Topic: ${gap.topic}\nMissed Angle: ${gap.missedAngle}\nDifficulty: ${gap.difficulty}`);
                                  addToast('success', 'Gap details copied!');
                                }}
                                className="w-full mt-4 py-1.5 border border-[#141a2f] hover:border-slate-850 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-[10px] font-mono rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" /> Copy Gap Strategy
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
  );
}
