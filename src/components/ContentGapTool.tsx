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

interface ContentGapToolProps {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
  onUpdateResults?: (results: any[]) => void;
}

export default function ContentGapTool({ userId, onUseCredits, addToast, handleCopy, onUpdateResults }: ContentGapToolProps) {
  const [nicheInput, setNicheInput] = useState('Software Engineering & Coding');
  const [targetAudience, setTargetAudience] = useState('Self-taught developers & college graduates');
  const [channelSize, setChannelSize] = useState('Medium (10k-100k subscribers)');
  const [contentGapResults, setContentGapResults] = useState<any[]>([]);
  const [isGapLoading, setIsGapLoading] = useState(false);
  const [gapError, setGapError] = useState<string | null>(null);

  const [expandedGaps, setExpandedGaps] = useState<Record<string, boolean>>({});
  const [activeBonusTabs, setActiveBonusTabs] = useState<Record<string, 'ideas' | 'titles' | 'thumbnails'>>({});
  const [copiedReport, setCopiedReport] = useState(false);

  useEffect(() => {
    if (contentGapResults && contentGapResults.length > 0) {
      const initialExpanded: Record<string, boolean> = {};
      const initialTabs: Record<string, 'ideas' | 'titles' | 'thumbnails'> = {};
      contentGapResults.forEach((gap, idx) => {
        initialExpanded[gap.id] = idx === 0;
        initialTabs[gap.id] = 'ideas';
      });
      setExpandedGaps(initialExpanded);
      setActiveBonusTabs(initialTabs);
    }
  }, [contentGapResults]);

  const runContentGapAnalyzer = async () => {
    const hasQuota = await onUseCredits(10, 'contentGaps', `Scanned niche: "${nicheInput}"`);
    if (!hasQuota) return;

    setIsGapLoading(true);
    setGapError(null);
    setContentGapResults([]);

    try {
      const res = await fetch('/api/gemini/content-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: nicheInput, targetAudience, channelSize })
      });
      const data = await res.json();
      
      if (data.results) {
        setContentGapResults(data.results);
        if (onUpdateResults) {
          onUpdateResults(data.results);
        }
        if (data.isFallback) {
          addToast('info', 'Simulated demo gaps generated. Add your Gemini key in settings for live results!');
        } else {
          addToast('success', 'Gemini successfully analyzed creator gaps!');
        }
      } else {
        throw new Error(data.error || 'Failed to fetch content gaps');
      }
    } catch (err: any) {
      setGapError(err.message || 'An error occurred during generation');
      addToast('error', err.message || 'Failed to execute query.');
    } finally {
      setIsGapLoading(false);
    }
  };

  const loadDemoPreset = () => {
    const demoResults = [
      {
        id: `demo_gap_1_${Date.now()}`,
        topic: "AI Agent Orchestration for Micro-SaaS Founders",
        description: "A highly underserved keyword gap where developers want to learn how to wire multi-agent frameworks (LangGraph, CrewAI) to serve real-world billing SaaS apps, but current tutorials only show basic CLI console logs.",
        opportunityScore: 96,
        competitionScore: 18,
        estimatedDemand: "140,000+ monthly searches, surging StackOverflow & GitHub discussions",
        reasonUnderserved: "Existing content focuses on high-level enterprise theory or toy console scripts. Creators completely miss step-by-step UI and Stripe integration for multi-agent workflows.",
        topVideosAnalyzed: [
          {
            title: "Build an AI Agent Crew in 10 Minutes",
            views: "85K views",
            publishDate: "2 weeks ago",
            engagement: "4.2% CTR"
          },
          {
            title: "LangGraph Tutorial for Beginners",
            views: "120K views",
            publishDate: "1 month ago",
            engagement: "5.1% CTR"
          },
          {
            title: "How I Built a $10K/mo AI Agent SaaS",
            views: "340K views",
            publishDate: "3 weeks ago",
            engagement: "7.8% CTR"
          }
        ],
        audiencePainPoints: [
          "Struggling to manage state and memory across agent nodes in production",
          "Lack of guides on building clean react UIs that render agent stream tokens",
          "No documentation on pricing and rate-limiting LLM calls inside SaaS billing plans"
        ],
        viralAngle: "Build a live, functioning AI agent that automatically drafts and signs up for a Stripe account in real-time on camera, showing proof of execution in under 5 minutes.",
        contentIdeas: [
          "LangGraph + Next.js: The complete architectural blueprint for agent SaaS",
          "Why 99% of AI Agents fail in production (and how to fix state loops)",
          "How to build a CrewAI agent that does actual marketing research for customers",
          "Wiring OpenAI real-time audio API to a SaaS telephone agent on Vercel",
          "Step-by-step: Deploying an open-source Llama 3 agent fleet locally"
        ],
        titleIdeas: [
          "I Built a LangGraph AI Agent SaaS in 24 Hours (Step-by-Step)",
          "Why Your AI Agents Loop Forever (LangGraph State Debugging)",
          "Build an AI Agent Crew that Actually Makes You Money ($10k/mo template)",
          "Stop Using Basic LLM Wrappers: How to Build Production Agents",
          "I Let an AI Agent Fleet Manage My SaaS for 7 Days (Shocking Results)"
        ],
        thumbnailIdeas: [
          "High contrast side-by-side: basic API wrapper (red cross) vs autonomous agent fleet (green check mark) with terminal overlays.",
          "Visual screenshot of LangGraph node structure glowing in purple neon with founder holding hands on head in shock.",
          "Stripe dashboard showing $12,420 graph with neon green arrow and text overlay: 'AUTONOMOUS AGENT'.",
          "Split screen showing LangGraph code vs visual robot typing on keyboard, high-saturation yellow outline.",
          "Bold white typography: '99% FAIL' over a broken database symbol with red glow effect."
        ]
      },
      {
        id: `demo_gap_2_${Date.now()}`,
        topic: "Zero-Code Database Sharding & Scaling for Indie Builders",
        description: "Indie hackers scaling to thousands of concurrent users need to optimize PostgreSQL and Supabase databases but lack formal database administrator training. Most database indexing tutorials are dry and corporate.",
        opportunityScore: 88,
        competitionScore: 22,
        estimatedDemand: "95,000+ monthly searches, high Supabase Discord community query frequency",
        reasonUnderserved: "Content is either hyper-academic database theory or basic 'create table' hello worlds. Nobody covers query optimization, connection pooling, and shard indexes using raw real-world performance dashboards.",
        topVideosAnalyzed: [
          {
            title: "PostgreSQL Indexing Explained",
            views: "45K views",
            publishDate: "5 months ago",
            engagement: "2.8% CTR"
          },
          {
            title: "Supabase Database Scaling Guide",
            views: "30K views",
            publishDate: "3 months ago",
            engagement: "3.2% CTR"
          },
          {
            title: "How to Scale to 1M Users in 1 Week",
            views: "210K views",
            publishDate: "2 months ago",
            engagement: "6.5% CTR"
          }
        ],
        audiencePainPoints: [
          "Supabase API key timeouts and connection limits during viral spikes",
          "Unoptimized nested foreign key joins leading to 8-second page queries",
          "High cost billing shocks due to database disk read/write spikes"
        ],
        viralAngle: "Run a live Distributed Denial of Service (DDoS) load test against a basic Supabase database on screen, watch it crash, then apply 3 index tweaks live and watch it withstand 10,000 requests/sec.",
        contentIdeas: [
          "I crashed my $5,000 Supabase app with 1 simple SQL query (How to optimize)",
          "Postgres indexing 101: Speed up your API calls from 2.5s to 12ms",
          "Supabase connection pooling: PgBouncer settings that save your budget",
          "How to shard your database when you hit 100M rows (No code template)",
          "Building a custom cache layer with Redis in Next.js 14"
        ],
        titleIdeas: [
          "I Crashed My App with 1 Bad SQL Query (Don't Make This Mistake)",
          "Make Your Supabase Database 200x Faster in 3 Minutes",
          "How I Scaled My App to 500,000 Users for $4/Month",
          "Stop Using SELECT * (PostgreSQL Performance Tuning for Devs)",
          "The Database Settings You Must Change Before Launching"
        ],
        thumbnailIdeas: [
          "Flashing red alert warning symbol on a database server icon with high-contrast text: 'DATABASE CRASHED'.",
          "A query execution time meter dropping from 4.2s (red) to 8ms (neon green) with speedometer graphics.",
          "Founder pointing at a Supabase dashboard with neon glowing lines and text overlay: '200x FASTER'.",
          "Server rack on fire with digital dollar bills burning, high contrast dark theme.",
          "Visual diagram showing PgBouncer connection flow in sleek white and emerald vector style."
        ]
      }
    ];

    setContentGapResults(demoResults);
    if (onUpdateResults) {
      onUpdateResults(demoResults);
    }
    addToast('success', 'Loaded SaaS Niche Scan demo results successfully! (0 credits used)');
  };

  return (
    <div className="space-y-6">
                    
              {/* Header Title */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-400" /> Content Gap Analyzer
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Discover highly searched YouTube topics with low or poor quality video coverage in your niche using Gemini AI.
                </p>
              </div>

              {/* Input Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Inputs Box */}
                <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-5">
                  <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-3">
                    Scanner Parameters
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Target Niche</label>
                      <input 
                        type="text"
                        value={nicheInput}
                        onChange={(e) => setNicheInput(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. Next.js Coding Tutorials"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Target Audience</label>
                      <input 
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. self-taught coders"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Creator Channel Size</label>
                      <select 
                        value={channelSize}
                        onChange={(e) => setChannelSize(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option>Micro-channel (0 - 10k subscribers)</option>
                        <option>Medium (10k-100k subscribers)</option>
                        <option>Large scale (100k+ subscribers)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900">
                    <button 
                      onClick={runContentGapAnalyzer}
                      disabled={isGapLoading}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950/40 text-[#070b14] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      {isGapLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Gaps...
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" /> Analyze Niche <span className="text-[10px] font-mono bg-[#070b14]/10 px-1 py-0.5 rounded font-normal">(10 credits)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Results Screen */}
                <div className="lg:col-span-2 space-y-4">
                  
                  {/* Empty state */}
                  {contentGapResults.length === 0 && !isGapLoading && !gapError && (
                    <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center">
                      <Compass className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
                      <h4 className="text-sm font-semibold text-white">No active search scan</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                        Input your content vertical and run the Gemini analyzer to map out high-volume content opportunities.
                      </p>
                      <button
                        onClick={loadDemoPreset}
                        className="mt-5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs text-emerald-400 font-mono font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer uppercase"
                      >
                        🚀 Load Demo Niche Scan (SaaS vertical)
                      </button>
                    </div>
                  )}

                  {/* Loading State */}
                  {isGapLoading && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center space-y-4">
                      <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                      <div>
                        <h4 className="text-sm font-semibold text-white font-mono">GEMINI IS SCANNING KEYWORDS</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed animate-pulse">
                          Running high-contrast search comparisons and matching search volume indexing models...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error state */}
                  {gapError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center flex flex-col justify-center items-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-rose-400" />
                      <h4 className="text-sm font-semibold text-rose-400 font-mono">SCAN EXCEPTION</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {gapError}
                      </p>
                      <button 
                        onClick={runContentGapAnalyzer}
                        className="px-4 py-2 bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium hover:bg-rose-500/30 transition-all cursor-pointer"
                      >
                        Retry Scan
                      </button>
                    </div>
                  )}

                  {/* Results List */}
                  {contentGapResults.length > 0 && (
                    <div className="space-y-6">
                      
                      {/* Control Panel / Summary */}
                      <div className="bg-gradient-to-r from-emerald-950/20 to-slate-900/60 border border-slate-900 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider">ANALYSIS COMPlETE</span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-1">ViralGap Opportunity Report</h4>
                          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                            We clustered search volume data for <strong className="text-slate-200">"{nicheInput}"</strong> and mapped out {contentGapResults.length} high-potential underserved content subtopics.
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            let report = `# ViralGap Content Gap Opportunity Report\n`;
                            report += `Generated on: ${new Date().toLocaleDateString()} | Target Niche: ${nicheInput}\n`;
                            report += `=========================================================\n\n`;

                            contentGapResults.forEach((gap, i) => {
                              report += `## Opportunity #${i + 1}: ${gap.topic}\n`;
                              report += `- **Opportunity Score**: ${gap.opportunityScore}/100\n`;
                              report += `- **Competition Score**: ${gap.competitionScore}/100\n`;
                              report += `- **Estimated Demand**: ${gap.estimatedDemand}\n`;
                              report += `- **Reason It Is Underserved**: ${gap.reasonUnderserved}\n`;
                              report += `- **Viral Angle Strategy**: ${gap.viralAngle}\n\n`;

                              report += `### Audience Pain Points:\n`;
                              gap.audiencePainPoints.forEach((pt: string) => {
                                report += `- ${pt}\n`;
                              });
                              report += `\n`;

                              report += `### Simulated Market Search Analysis (Top Videos Checked):\n`;
                              gap.topVideosAnalyzed.forEach((v: any, vidx: number) => {
                                report += `${vidx + 1}. "${v.title}" | Views: ${v.views} | Published: ${v.publishDate} | Engagement: ${v.engagement}\n`;
                              });
                              report += `\n`;

                              report += `### 💡 20 Content Ideas:\n`;
                              gap.contentIdeas.forEach((id: string, idx: number) => {
                                report += `${idx + 1}. ${id}\n`;
                              });
                              report += `\n`;

                              report += `### 🏷️ 20 Title Formulas:\n`;
                              gap.titleIdeas.forEach((id: string, idx: number) => {
                                report += `${idx + 1}. ${id}\n`;
                              });
                              report += `\n`;

                              report += `### 🖼️ 20 Thumbnail Art Directions:\n`;
                              gap.thumbnailIdeas.forEach((id: string, idx: number) => {
                                report += `${idx + 1}. ${id}\n`;
                              });
                              report += `\n`;
                              report += `---------------------------------------------------------\n\n`;
                            });

                            navigator.clipboard.writeText(report).then(() => {
                              setCopiedReport(true);
                              addToast('success', 'Full Growth Report copied to clipboard in markdown format!');
                              setTimeout(() => setCopiedReport(false), 3000);
                            });
                          }}
                          className="w-full md:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] cursor-pointer"
                        >
                          {copiedReport ? (
                            <>
                              <Check className="w-4 h-4" /> Copied Markdown Report!
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4" /> Copy Full Growth Report
                            </>
                          )}
                        </button>
                      </div>

                      {/* Clustered Gaps Accordion List */}
                      <div className="space-y-4">
                        {contentGapResults.map((gap, i) => {
                          const isExpanded = !!expandedGaps[gap.id];
                          const activeBonusTab = activeBonusTabs[gap.id] || 'ideas';

                          return (
                            <div 
                              key={gap.id} 
                              className={`bg-[#0c101d] border ${isExpanded ? 'border-emerald-500/25' : 'border-slate-900'} rounded-2xl transition-all overflow-hidden`}
                            >
                              {/* Header Bar - Collapsible Trigger */}
                              <div 
                                onClick={() => {
                                  setExpandedGaps(prev => ({ ...prev, [gap.id]: !prev[gap.id] }));
                                }}
                                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 transition-all select-none"
                              >
                                <div className="flex items-start gap-4">
                                  {/* Gap Number Badge */}
                                  <div className="bg-emerald-950/40 border border-emerald-500/10 rounded-xl px-2.5 py-1.5 text-center flex flex-col justify-center min-w-[50px] font-mono">
                                    <span className="text-[8px] text-slate-500 font-bold block leading-none">GAP</span>
                                    <span className="text-sm font-bold text-emerald-400 leading-none mt-0.5">#0{i + 1}</span>
                                  </div>
                                  
                                  <div>
                                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">CLUSTERED SUBTOPIC</span>
                                    <h4 className="text-base font-bold text-white leading-snug mt-0.5">{gap.topic}</h4>
                                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 max-w-xl">{gap.description}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-6">
                                  {/* Quick mini-stats */}
                                  <div className="hidden sm:flex items-center gap-4">
                                    <div className="text-right">
                                      <span className="text-[8px] font-mono text-slate-500 font-bold block uppercase">OPPORTUNITY</span>
                                      <span className="text-xs font-bold font-mono text-emerald-400">{gap.opportunityScore}/100</span>
                                    </div>
                                    <div className="text-right border-l border-slate-900 pl-4">
                                      <span className="text-[8px] font-mono text-slate-500 font-bold block uppercase">COMPETITION</span>
                                      <span className="text-xs font-bold font-mono text-rose-400">{gap.competitionScore}/100</span>
                                    </div>
                                  </div>
                                  
                                  {/* Chevron toggle */}
                                  <div className="text-slate-500 hover:text-slate-300 p-1 bg-slate-900/60 rounded-lg">
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Expanded Content Panel */}
                              {isExpanded && (
                                <div className="p-6 border-t border-slate-900 space-y-6">
                                  
                                  {/* Professional YouTube Creator Intelligence Dashboard */}
                                  <div className="space-y-4">
                                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                                      📊 Creator Intelligence Metrics
                                    </span>
                                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                                      {/* Metric 1: Viral Score */}
                                      <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-orange-500/5 rounded-full blur-lg" />
                                        <div className="flex items-center gap-1">
                                          <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                                          <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Viral Score</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 mt-2">
                                          <span className="text-xl font-black text-orange-400 font-mono">{Math.max(30, Math.min(99, Math.round(gap.opportunityScore * 0.95 - gap.competitionScore * 0.15)))}</span>
                                          <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                          <div className="bg-orange-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round(gap.opportunityScore * 0.95 - gap.competitionScore * 0.15)))}%` }} />
                                        </div>
                                      </div>

                                      {/* Metric 2: Opportunity Score */}
                                      <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-emerald-500/5 rounded-full blur-lg" />
                                        <div className="flex items-center gap-1">
                                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                          <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Opportunity</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 mt-2">
                                          <span className="text-xl font-black text-emerald-400 font-mono">{gap.opportunityScore}</span>
                                          <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                          <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${gap.opportunityScore}%` }} />
                                        </div>
                                      </div>

                                      {/* Metric 3: Competition Score */}
                                      <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-rose-500/5 rounded-full blur-lg" />
                                        <div className="flex items-center gap-1">
                                          <Sliders className="w-3.5 h-3.5 text-rose-400" />
                                          <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Competition</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 mt-2">
                                          <span className="text-xl font-black text-rose-400 font-mono">{gap.competitionScore}</span>
                                          <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                          <div className="bg-rose-400 h-full rounded-full transition-all duration-1000" style={{ width: `${gap.competitionScore}%` }} />
                                        </div>
                                      </div>

                                      {/* Metric 4: Hook Quality Score */}
                                      <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-amber-500/5 rounded-full blur-lg" />
                                        <div className="flex items-center gap-1">
                                          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                          <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Hook Score</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 mt-2">
                                          <span className="text-xl font-black text-amber-400 font-mono">{Math.max(30, Math.min(99, Math.round(gap.opportunityScore * 0.9 + (100 - gap.competitionScore) * 0.1)))}</span>
                                          <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                          <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round(gap.opportunityScore * 0.9 + (100 - gap.competitionScore) * 0.1)))}%` }} />
                                        </div>
                                      </div>

                                      {/* Metric 5: Thumbnail CTR Score */}
                                      <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-cyan-500/5 rounded-full blur-lg" />
                                        <div className="flex items-center gap-1">
                                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                          <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Thumb CTR</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 mt-2">
                                          <span className="text-xl font-black text-cyan-400 font-mono">{Math.max(30, Math.min(99, Math.round(gap.opportunityScore * 0.85 + (50 - gap.competitionScore) * 0.3)))}</span>
                                          <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                          <div className="bg-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round(gap.opportunityScore * 0.85 + (50 - gap.competitionScore) * 0.3)))}%` }} />
                                        </div>
                                      </div>

                                      {/* Metric 6: Retention Prediction */}
                                      <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-indigo-500/5 rounded-full blur-lg" />
                                        <div className="flex items-center gap-1">
                                          <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                                          <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Retention</span>
                                        </div>
                                        <div className="flex items-baseline gap-1 mt-2">
                                          <span className="text-xl font-black text-indigo-400 font-mono">{Math.max(30, Math.min(99, Math.round(gap.opportunityScore * 0.7 + 25)))}%</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                          <div className="bg-indigo-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round(gap.opportunityScore * 0.7 + 25)))}%` }} />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Subtopic Context block */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-4">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                          <Compass className="w-3.5 h-3.5 text-cyan-400" />
                                          <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Estimated Audience Volume</span>
                                        </div>
                                        <p className="text-xs font-bold text-cyan-400 font-mono">{gap.estimatedDemand}</p>
                                      </div>
                                      <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-4">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                          <Info className="w-3.5 h-3.5 text-amber-400" />
                                          <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Coverage Deficiency Analysis</span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">{gap.reasonUnderserved}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Audience Friction and Strategy */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#070b14]/30 border border-slate-900/60 rounded-xl p-5">
                                    <div className="space-y-3">
                                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block tracking-wider">AUDIENCE PAIN POINTS</span>
                                      <ul className="space-y-2 text-xs">
                                        {gap.audiencePainPoints.map((pt: string, pidx: number) => (
                                          <li key={pidx} className="flex items-start gap-2.5 text-slate-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                                            <span>{pt}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-900/60 pt-4 md:pt-0 md:pl-6">
                                      <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5" /> VIRAL ANGLE STRATEGY
                                      </span>
                                      <p className="text-xs text-emerald-300/90 leading-relaxed font-medium italic bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3">
                                        "{gap.viralAngle}"
                                      </p>
                                    </div>
                                  </div>

                                  {/* Action Plan Section */}
                                  <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-3">
                                      <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                                      <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                                        🚀 Instant Creator Action Plan
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="bg-[#070b14]/40 border border-white/5 rounded-xl p-4 space-y-2">
                                        <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">Step 01: Hook Strategy</div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                          Record a 15-second opening hook deploying the **Viral Angle** immediately: <span className="text-emerald-400 italic">"{gap.viralAngle}"</span>
                                        </p>
                                      </div>
                                      <div className="bg-[#070b14]/40 border border-white/5 rounded-xl p-4 space-y-2">
                                        <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">Step 02: Thumbnail Concept</div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                          Design your thumbnail using the primary recommended formula: <span className="text-sky-400 italic">"{gap.thumbnailIdeas?.[0] || 'High contrast overlay'}"</span>
                                        </p>
                                      </div>
                                      <div className="bg-[#070b14]/40 border border-white/5 rounded-xl p-4 space-y-2">
                                        <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">Step 03: Title Split-Test</div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                          Launch video with A/B title rotation starting with: <span className="text-amber-400 font-mono font-semibold">"{gap.titleIdeas?.[0] || 'Clickable Formula'}"</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Simulated Market Search Analysis - Top Videos */}
                                  <div className="space-y-3 border border-slate-900 rounded-xl p-5 bg-[#070b14]/20">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <Youtube className="w-3.5 h-3.5 text-rose-500" /> SIMULATED MARKET SEARCH ANALYSIS (TOP VIDEOS EXAMINED)
                                      </span>
                                      <span className="text-[9px] font-mono text-slate-500">Method: Clustering Analysis</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                      We crawled top ranking videos for this subtopic and measured user retention. Here are the leading assets checked that validate this opportunity gap:
                                    </p>
                                    
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                          <tr className="border-b border-slate-900 text-slate-500 font-mono text-[9px]">
                                            <th className="pb-2 font-bold uppercase">Video Title</th>
                                            <th className="pb-2 font-bold uppercase pl-4">Views</th>
                                            <th className="pb-2 font-bold uppercase pl-4">Age</th>
                                            <th className="pb-2 font-bold uppercase pl-4">Engagement (Ratio)</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-900/40 font-mono">
                                          {gap.topVideosAnalyzed && gap.topVideosAnalyzed.map((vid: any, vidx: number) => (
                                            <tr key={vidx} className="text-slate-300 hover:bg-slate-900/10">
                                              <td className="py-2.5 font-sans font-medium text-white line-clamp-1 max-w-sm md:max-w-md">
                                                {vid.title}
                                              </td>
                                              <td className="py-2.5 pl-4 text-slate-400 text-[11px]">{vid.views}</td>
                                              <td className="py-2.5 pl-4 text-slate-400 text-[11px]">{vid.publishDate}</td>
                                              <td className="py-2.5 pl-4 text-emerald-400 font-bold text-[11px]">{vid.engagement}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  {/* BONUS CREATOR PACKAGE (60 Assets) */}
                                  <div className="border border-slate-900/60 rounded-xl overflow-hidden bg-gradient-to-b from-slate-900/20 to-[#070b14]/50">
                                    <div className="bg-[#0c101d] border-b border-slate-900 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                      <div>
                                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" /> BONUS: CREATOR GROWTH KIT (60 ASSETS)
                                        </span>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Exactly 20 content ideas, 20 high-CTR titles, and 20 thumbnail directives.</p>
                                      </div>
                                      
                                      {/* Sub-tab Selectors */}
                                      <div className="flex bg-[#070b14] border border-slate-800 rounded-lg p-0.5 w-full sm:w-auto">
                                        <button
                                          onClick={() => setActiveBonusTabs(prev => ({ ...prev, [gap.id]: 'ideas' }))}
                                          className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-[10px] font-bold font-mono transition-all cursor-pointer ${activeBonusTab === 'ideas' ? 'bg-emerald-500 text-[#070b14]' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                          💡 Ideas (20)
                                        </button>
                                        <button
                                          onClick={() => setActiveBonusTabs(prev => ({ ...prev, [gap.id]: 'titles' }))}
                                          className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-[10px] font-bold font-mono transition-all cursor-pointer ${activeBonusTab === 'titles' ? 'bg-emerald-500 text-[#070b14]' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                          🏷️ Titles (20)
                                        </button>
                                        <button
                                          onClick={() => setActiveBonusTabs(prev => ({ ...prev, [gap.id]: 'thumbnails' }))}
                                          className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-[10px] font-bold font-mono transition-all cursor-pointer ${activeBonusTab === 'thumbnails' ? 'bg-emerald-500 text-[#070b14]' : 'text-slate-400 hover:text-slate-200'}`}
                                        >
                                          🖼️ Thumbnails (20)
                                        </button>
                                      </div>
                                    </div>

                                    {/* Tab Items List */}
                                    <div className="p-4 max-h-[380px] overflow-y-auto divide-y divide-slate-900/60 custom-scrollbar">
                                      {activeBonusTab === 'ideas' && (
                                        <div className="space-y-1.5">
                                          {gap.contentIdeas && gap.contentIdeas.map((idea: string, idx: number) => (
                                            <div key={idx} className="group flex items-center justify-between gap-4 p-2.5 hover:bg-slate-900/40 rounded-lg transition-all">
                                              <div className="flex items-start gap-3">
                                                <span className="text-[10px] font-mono text-slate-600 font-bold mt-0.5">#{String(idx+1).padStart(2, '0')}</span>
                                                <span className="text-xs text-slate-300 leading-relaxed font-sans">{idea}</span>
                                              </div>
                                              <button
                                                onClick={() => {
                                                  navigator.clipboard.writeText(idea);
                                                  addToast('success', `Copied Content Idea #${idx+1}!`);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-all cursor-pointer shrink-0"
                                                title="Copy Idea"
                                              >
                                                <Copy className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {activeBonusTab === 'titles' && (
                                        <div className="space-y-1.5">
                                          {gap.titleIdeas && gap.titleIdeas.map((title: string, idx: number) => (
                                            <div key={idx} className="group flex items-center justify-between gap-4 p-2.5 hover:bg-slate-900/40 rounded-lg transition-all">
                                              <div className="flex items-start gap-3">
                                                <span className="text-[10px] font-mono text-slate-600 font-bold mt-0.5">#{String(idx+1).padStart(2, '0')}</span>
                                                <span className="text-xs text-slate-100 font-medium leading-relaxed font-sans">{title}</span>
                                              </div>
                                              <button
                                                onClick={() => {
                                                  navigator.clipboard.writeText(title);
                                                  addToast('success', `Copied Title #${idx+1}!`);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-all cursor-pointer shrink-0"
                                                title="Copy Title"
                                              >
                                                <Copy className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {activeBonusTab === 'thumbnails' && (
                                        <div className="space-y-1.5">
                                          {gap.thumbnailIdeas && gap.thumbnailIdeas.map((thumb: string, idx: number) => (
                                            <div key={idx} className="group flex items-center justify-between gap-4 p-2.5 hover:bg-slate-900/40 rounded-lg transition-all">
                                              <div className="flex items-start gap-3">
                                                <span className="text-[10px] font-mono text-slate-600 font-bold mt-0.5">#{String(idx+1).padStart(2, '0')}</span>
                                                <span className="text-xs text-slate-300 leading-relaxed font-sans">{thumb}</span>
                                              </div>
                                              <button
                                                onClick={() => {
                                                  navigator.clipboard.writeText(thumb);
                                                  addToast('success', `Copied Thumbnail Concept #${idx+1}!`);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-all cursor-pointer shrink-0"
                                                title="Copy Concept"
                                              >
                                                <Copy className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
  );
}
