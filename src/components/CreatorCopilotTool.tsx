import React, { useState } from 'react';
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

interface CreatorCopilotToolProps {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
}

export default function CreatorCopilotTool({ userId, onUseCredits, addToast, handleCopy }: CreatorCopilotToolProps) {
  const [copilotNiche, setCopilotNiche] = useState('AI-driven micro-SaaS builders');
  const [copilotChannelSize, setCopilotChannelSize] = useState('1,000 - 10,000 subscribers');
  const [copilotTargetAudience, setCopilotTargetAudience] = useState('Indie developers, tech enthusiasts, solo founders');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [copilotResult, setCopilotResult] = useState<any | null>(() => {
    const saved = localStorage.getItem('creator_copilot_result');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [copilotError, setCopilotError] = useState<string | null>(null);
  const [copilotHistory, setCopilotHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('creator_copilot_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const runCreatorCopilot = async (customNiche?: string, customSize?: string, customAudience?: string) => {
    const niche = customNiche || copilotNiche;
    const size = customSize || copilotChannelSize;
    const audience = customAudience || copilotTargetAudience;

    if (!niche.trim() || !size.trim() || !audience.trim()) {
      addToast('error', 'Please fill in all inputs (Niche, Channel Size, and Target Audience).');
      return;
    }

    const hasQuota = await onUseCredits(15, 'prompts', `AI Creator Coach guidance for ${niche.substring(0, 30)}`);
    if (!hasQuota) return;

    setIsCopilotLoading(true);
    setCopilotError(null);

    try {
      const res = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, channelSize: size, targetAudience: audience })
      });
      const data = await res.json();

      if (data.success && data.result) {
        setCopilotResult(data.result);
        localStorage.setItem('creator_copilot_result', JSON.stringify(data.result));

        // Add to history
        const newHistoryItem = {
          id: Date.now().toString(),
          niche,
          channelSize: size,
          targetAudience: audience,
          timestamp: new Date().toLocaleString(),
          result: data.result
        };
        const updatedHistory = [newHistoryItem, ...copilotHistory].slice(0, 15);
        setCopilotHistory(updatedHistory);
        localStorage.setItem('creator_copilot_history', JSON.stringify(updatedHistory));

        if (data.isFallback) {
          addToast('info', 'AI Creator Coach advice loaded in sandbox mode.');
        } else {
          addToast('success', 'AI Creator Coach completed generating your custom recommendations!');
        }
      } else {
        throw new Error(data.error || 'Failed to retrieve AI Coach advice.');
      }
    } catch (err: any) {
      setCopilotError(err.message || 'An unknown coaching intelligence error occurred.');
      addToast('error', err.message || 'Failed to generate creator guidelines.');
    } finally {
      setIsCopilotLoading(false);
    }
  };

  // Competitor Watch Action Handlers

  return (
    <div className="space-y-6">
                    {/* Header block */}
              <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wide">
                    <Award className="w-3.5 h-3.5 text-emerald-400" /> Algorithmic Growth Advisory
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                    AI Creator Coach & Copilot
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    Configure your niche profile, channel scale, and target demographic to receive custom creator guidelines, daily checklists, content opportunity matrices, and high-impact title and thumbnail recommendations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Creator Profile & Inputs */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-5">
                    <div className="border-b border-slate-900 pb-3">
                      <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                        Creator Profile Inputs
                      </h3>
                      <p className="text-[10px] font-sans text-slate-500">
                        Provide channel details for hyper-focused recommendations.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* User Niche */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">User Niche</label>
                        <input
                          type="text"
                          value={copilotNiche}
                          onChange={(e) => setCopilotNiche(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                          placeholder="e.g. AI-driven micro-SaaS, vintage mechanical keyboards"
                        />
                      </div>

                      {/* Channel Size */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Channel Size</label>
                        <select
                          value={copilotChannelSize}
                          onChange={(e) => setCopilotChannelSize(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans cursor-pointer"
                        >
                          <option value="0 - 1,000 subscribers (New Channel)">0 - 1,000 subscribers (New Channel)</option>
                          <option value="1,000 - 10,000 subscribers (Emerging)">1,000 - 10,000 subscribers (Emerging)</option>
                          <option value="10,000 - 100,000 subscribers (Mid-Tier)">10,000 - 100,000 subscribers (Mid-Tier)</option>
                          <option value="100,000+ subscribers (Established)">100,000+ subscribers (Established)</option>
                        </select>
                      </div>

                      {/* Target Audience */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Target Audience</label>
                        <textarea
                          value={copilotTargetAudience}
                          onChange={(e) => setCopilotTargetAudience(e.target.value)}
                          rows={3}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans resize-none"
                          placeholder="e.g. Indie developers, remote designers, tech-savvy solo founders"
                        />
                      </div>

                      <button
                        onClick={() => runCreatorCopilot()}
                        disabled={isCopilotLoading}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950/40 text-[#070b14] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        {isCopilotLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling Coaching Plan...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" /> Generate Creator Plan <span className="text-[10px] font-mono bg-[#070b14]/10 px-1 py-0.5 rounded font-normal">(15 credits)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Pre-configured Presets */}
                    <div className="space-y-2 pt-2 border-t border-slate-900/60">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Quick Presets:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: 'SaaS Dev', niche: 'AI Micro-SaaS Builders', size: '1,000 - 10,000 subscribers (Emerging)', aud: 'Indie hackers, developer community, bootstrapper founders' },
                          { name: 'Tech Gear', niche: 'Minimalist Workspaces & Keyboard builds', size: '10,000 - 100,000 subscribers (Mid-Tier)', aud: 'Software engineers, productivity nerds, mechanical keyboard hobbyists' },
                          { name: 'AI Artists', niche: 'Generative AI Art & Video blueprints', size: '0 - 1,000 subscribers (New Channel)', aud: 'Digital artists, cinema students, AI content enthusiasts' }
                        ].map(preset => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              setCopilotNiche(preset.niche);
                              setCopilotChannelSize(preset.size);
                              setCopilotTargetAudience(preset.aud);
                              runCreatorCopilot(preset.niche, preset.size, preset.aud);
                            }}
                            className="text-[9px] font-sans bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-300 px-2 py-1 rounded transition-all cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* History of Coaching Sessions */}
                  {copilotHistory.length > 0 && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-3.5">
                      <div className="border-b border-slate-900 pb-2">
                        <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <History className="w-3.5 h-3.5 text-slate-500" /> Stored Coaching Reports
                        </h3>
                      </div>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                        {copilotHistory.map(item => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setCopilotResult(item.result);
                              setCopilotNiche(item.niche);
                              setCopilotChannelSize(item.channelSize);
                              setCopilotTargetAudience(item.targetAudience);
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                              copilotResult && copilotResult.niche === item.niche && copilotResult.targetAudience === item.targetAudience
                                ? 'bg-emerald-500/5 border-emerald-500/30'
                                : 'bg-slate-950/40 border-slate-900 hover:bg-slate-900/40'
                            }`}
                          >
                            <div className="text-[10px] font-bold text-slate-300 truncate">{item.niche}</div>
                            <div className="text-[9px] font-mono text-slate-500 mt-1 flex justify-between">
                              <span>{item.timestamp.split(',')[0]}</span>
                              <span className="text-emerald-400">Recall Report →</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: AI Coach Advisory Suite */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Empty state */}
                  {!copilotResult && !isCopilotLoading && !copilotError && (
                    <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center h-full min-h-[450px] flex flex-col justify-center items-center">
                      <Award className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
                      <h4 className="text-sm font-semibold text-white font-sans">Awaiting Strategic Intake</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        Customize your niche, channel scale, and demographic profile in the left config panel, then launch the AI Coach to build a personalized roadmap.
                      </p>
                    </div>
                  )}

                  {/* Loading State */}
                  {isCopilotLoading && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center h-full min-h-[450px] flex flex-col justify-center items-center space-y-6 animate-fade-in">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                        <Award className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest">COMPILE STRATEGIC ROADMAP</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed animate-pulse">
                          Querying demographic insights, formatting posting schedules, and synthesizing CTR suggestions for "{copilotNiche}"...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {copilotError && (
                    <div className="bg-[#0c101d] border border-rose-500/10 rounded-2xl p-8 text-center h-full min-h-[450px] flex flex-col justify-center items-center space-y-4">
                      <AlertCircle className="w-10 h-10 text-rose-400" />
                      <h4 className="text-sm font-bold text-rose-400 font-mono">COACH INTELLIGENCE FAULT</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {copilotError}
                      </p>
                      <button
                        onClick={() => runCreatorCopilot()}
                        className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
                      >
                        Retry Consultation
                      </button>
                    </div>
                  )}

                  {/* Recommendations Output */}
                  {copilotResult && (
                    <div className="space-y-8 animate-fade-in text-left">
                      
                      {/* Section 1: Recommendations (Daily & Weekly Habits) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Daily recommendations as checkable items! */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                            <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Daily Actions & Habits</span>
                          </div>
                          <div className="space-y-3">
                            {copilotResult.dailyRecommendations?.map((rec: string, index: number) => (
                              <label key={index} className="flex items-start gap-3 p-2.5 bg-slate-950/50 border border-slate-950 rounded-xl cursor-pointer hover:border-slate-900 transition-all">
                                <input type="checkbox" className="mt-0.5 rounded border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer" />
                                <span className="text-[11px] text-slate-300 leading-relaxed font-sans">{rec}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Weekly recommendations */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                            <Award className="w-4.5 h-4.5 text-amber-400" />
                            <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Weekly Higher-Level Focus</span>
                          </div>
                          <div className="space-y-3.5">
                            {copilotResult.weeklyRecommendations?.map((rec: string, index: number) => (
                              <div key={index} className="flex gap-3 items-start">
                                <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded shrink-0">WEEKLY 0{index + 1}</span>
                                <span className="text-[11px] text-slate-300 leading-relaxed font-sans">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Content Opportunities */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                          <Compass className="w-4.5 h-4.5 text-sky-400" />
                          <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Targeted Content Opportunity Matrix</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {copilotResult.contentOpportunities?.map((opp: any, idx: number) => (
                            <div key={idx} className="bg-slate-950 p-4 border border-slate-900 hover:border-slate-800 rounded-xl flex flex-col justify-between transition-all group">
                              <div className="space-y-2.5">
                                <div className="flex justify-between items-center">
                                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
                                    {opp.searchInterest || 'Breakout'}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-500 font-bold">{opp.estimatedViews || 'High reach'}</span>
                                </div>
                                <h4 className="text-[11.5px] font-bold text-slate-200 group-hover:text-white transition-all leading-snug">
                                  {opp.topic}
                                </h4>
                                <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans italic pt-1">
                                  "{opp.strategicAngle}"
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`Content Idea: ${opp.topic}\nEstimated Views: ${opp.estimatedViews}\nAngle: ${opp.strategicAngle}`);
                                  addToast('success', 'Copied content idea to clipboard!');
                                }}
                                className="w-full mt-4 py-1.5 border border-slate-900 hover:border-slate-850 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-[10px] font-mono rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" /> Copy Concept
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 3: Recommended Posting Schedule */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                          <Calendar className="w-4.5 h-4.5 text-purple-400" />
                          <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Personalized Publishing Schedule</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {copilotResult.postingSchedule?.map((sched: any, idx: number) => (
                            <div key={idx} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">{sched.day}</span>
                                <span className="text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/10">{sched.time}</span>
                              </div>
                              <div className="text-[11px] font-bold text-slate-200 leading-relaxed">{sched.videoType}</div>
                              <p className="text-[10px] text-slate-400 leading-relaxed font-sans border-t border-slate-900/60 pt-2">{sched.justification}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 4: CTR Title & Visual Thumbnail Recommendations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title suggestions */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                            <FileText className="w-4.5 h-4.5 text-emerald-400" />
                            <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Title Blueprint Options</span>
                          </div>
                          <div className="space-y-3">
                            {copilotResult.titleSuggestions?.map((title: string, idx: number) => (
                              <div key={idx} className="bg-slate-950 p-3.5 border border-slate-900 hover:border-slate-850 rounded-xl flex items-center justify-between gap-3 group transition-all font-sans">
                                <span className="text-[11px] font-medium text-slate-200 leading-relaxed">{title}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(title);
                                    addToast('success', `Copied: "${title}"`);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg border border-transparent hover:border-emerald-500/10 transition-all cursor-pointer"
                                  title="Copy title"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Thumbnail Suggestions */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                            <ImageIcon className="w-4.5 h-4.5 text-amber-400" />
                            <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Thumbnail Composition Outlines</span>
                          </div>
                          <div className="space-y-3">
                            {copilotResult.thumbnailSuggestions?.map((thumb: string, idx: number) => (
                              <div key={idx} className="bg-slate-950 p-3.5 border border-slate-900 hover:border-slate-850 rounded-xl flex items-start justify-between gap-3 group transition-all">
                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wide block">Composition 0{idx + 1}</span>
                                  <span className="text-[11px] text-slate-300 leading-relaxed font-sans block">{thumb}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(thumb);
                                    addToast('success', `Copied Composition 0${idx + 1} guidelines!`);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-500/5 rounded-lg border border-transparent hover:border-amber-500/10 transition-all cursor-pointer shrink-0 mt-1"
                                  title="Copy composition text"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
  );
}
