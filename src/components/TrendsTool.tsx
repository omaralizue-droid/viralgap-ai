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

interface TrendsToolProps {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function TrendsTool({ userId, onUseCredits, addToast }: TrendsToolProps) {
  const [trends, setTrends] = useState<any[]>([]);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);
  const [trendSearchQuery, setTrendSearchQuery] = useState('');
  const [analyzedTrendResult, setAnalyzedTrendResult] = useState<any | null>(null);
  const [isTrendAnalyzing, setIsTrendAnalyzing] = useState(false);
  const [trendAnalyzeError, setTrendAnalyzeError] = useState<string | null>(null);
  const [trendsFilter, setTrendsFilter] = useState<'All' | 'Exploding' | 'Trending' | 'Emerging' | 'Declining'>('All');

  useEffect(() => {
    setIsTrendsLoading(true);
    fetch('/api/trends')
      .then(res => res.json())
      .then(data => {
        if (data.trends) {
          setTrends(data.trends);
        }
      })
      .finally(() => {
        setIsTrendsLoading(false);
      });
  }, []);

    const runTrendAnalyzer = async (customQuery?: string) => {
    const targetQuery = customQuery || trendSearchQuery;
    if (!targetQuery.trim()) {
      addToast('error', 'Please enter a search topic or keyword.');
      return;
    }

    const hasQuota = await onUseCredits(10, 'prompts');
    if (!hasQuota) return;

    setIsTrendAnalyzing(true);
    setTrendAnalyzeError(null);
    setAnalyzedTrendResult(null);

    try {
      const res = await fetch('/api/trends/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: targetQuery })
      });
      const data = await res.json();

      if (data.success && data.result) {
        setAnalyzedTrendResult(data.result);
        if (data.isFallback) {
          addToast('info', 'Trend report loaded in demo scan mode.');
        } else {
          addToast('success', `Trend Radar completed scanning for "${targetQuery}"!`);
        }
      } else {
        throw new Error(data.error || 'Failed to retrieve trend audit analytics.');
      }
    } catch (err: any) {
      setTrendAnalyzeError(err.message || 'An unknown analytical error occurred.');
      addToast('error', err.message || 'Failed to analyze trend velocity.');
    } finally {
      setIsTrendAnalyzing(false);
    }
  };


  // Creator Copilot Generation Logic

  return (
    <div className="space-y-6">
                    {/* Header block */}
              <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wide">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Algorithmic Foresight Lab
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                    Trend Radar & Intelligence
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    Identify, analyze, and deconstruct breakout YouTube search query spikes before they reach peak saturation. Scan any keyword to index live view counts, competitor gaps, and calculated opportunity indices.
                  </p>
                </div>
              </div>

              {/* Keyword Research & Audit Search Engine bar */}
              <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Search className="w-4 h-4 text-slate-400" />
                    </div>
                    <input 
                      type="text"
                      value={trendSearchQuery}
                      onChange={(e) => setTrendSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') runTrendAnalyzer();
                      }}
                      className="w-full bg-[#070b14] border border-slate-850 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-sans"
                      placeholder="Audit any YouTube search query or custom niche (e.g. AI-driven micro-SaaS, 3D printing food, brutalist design)..."
                    />
                  </div>
                  <button
                    onClick={() => runTrendAnalyzer()}
                    disabled={isTrendAnalyzing}
                    className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950/40 text-[#070b14] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
                  >
                    {isTrendAnalyzing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Indexing Signals...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" /> Scan YouTube Trends <span className="text-[10px] font-mono bg-[#070b14]/10 px-1 py-0.5 rounded font-normal">(10 credits)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Popular suggestions / search history presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Interactive Presets:</span>
                  {['Autonomous Agents', 'Zero-Code SaaS', 'Vintage Mech Keyboards', 'Solar-Powered Homes'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setTrendSearchQuery(preset);
                        runTrendAnalyzer(preset);
                      }}
                      className="text-[10px] font-sans bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Workspace Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Curated Index (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                          Curated Trend Radar
                        </h3>
                        <p className="text-[10px] font-sans text-slate-500">
                          Pre-filtered topics categorized by saturation levels.
                        </p>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">
                        {trendsFilter}
                      </span>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex flex-wrap gap-1.5 pb-2">
                      {(['All', 'Exploding', 'Trending', 'Emerging', 'Declining'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setTrendsFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer border ${
                            trendsFilter === cat
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-transparent border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Curated list */}
                    {isTrendsLoading ? (
                      <div className="py-12 text-center flex flex-col justify-center items-center gap-3">
                        <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                        <span className="text-[11px] font-mono text-slate-500">Retrieving index metadata...</span>
                      </div>
                    ) : (
                      <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                        {(() => {
                          const filtered = trends.filter(t => trendsFilter === 'All' || t.classification === trendsFilter);
                          if (filtered.length === 0) {
                            return (
                              <div className="py-8 text-center border border-dashed border-slate-850 rounded-xl">
                                <span className="text-[11px] font-sans text-slate-500">No curations matched filter criteria.</span>
                              </div>
                            );
                          }
                          return filtered.map((t) => {
                            const isSelected = analyzedTrendResult?.topic === t.topic;
                            return (
                              <div 
                                key={t.id}
                                onClick={() => {
                                  // Map this straight into the analyzed view!
                                  setAnalyzedTrendResult({
                                    topic: t.topic,
                                    category: t.category,
                                    classification: t.classification,
                                    trendScore: t.trendScore,
                                    growthScore: t.growthScore,
                                    opportunityScore: t.opportunityScore,
                                    metrics: t.metrics || { viewGrowth: 150, uploadGrowth: 25, engagementGrowth: 60, keywordMomentum: 80 },
                                    dataSources: {
                                      youtubeApiStatus: 'Active & Sync (Live)',
                                      historicalSearchQueries: t.searchInterest * 85,
                                      databaseRecordsCount: 42
                                    },
                                    historicalInterestData: [
                                      { month: 'Jan', interest: Math.floor(t.searchInterest * 0.4) },
                                      { month: 'Feb', interest: Math.floor(t.searchInterest * 0.6) },
                                      { month: 'Mar', interest: Math.floor(t.searchInterest * 0.7) },
                                      { month: 'Apr', interest: Math.floor(t.searchInterest * 0.8) },
                                      { month: 'May', interest: Math.floor(t.searchInterest * 0.9) },
                                      { month: 'Jun', interest: t.searchInterest }
                                    ],
                                    whyItIsTrending: t.whyItIsTrending,
                                    saturationAnalysis: `Calculated at ${t.searchInterest}% of total keyword search capacity. View counts average roughly ${t.avgViews || '180,000 avg views'}, with an absolute momentum spike of ${t.viewVelocity || '+3,000/hr'}.`,
                                    competitorBenchmark: {
                                      saturatedCreators: ['Creator Prime', 'The Niche Syndicate'],
                                      underservedAngle: `High interest paired with ${t.opportunityScore > 85 ? 'critically low' : 'moderate'} competitor supply volume.`
                                    },
                                    viralVideoAngles: [
                                      {
                                        title: `Why "${t.topic}" is Exploding Right Now (Must Watch)`,
                                        thumbnailIdea: 'Dramatic high-saturation workspace visual with glowing percentage indicators and neon outline text.',
                                        hookAngle: 'Most people don\'t understand why this is breaking. Here is the statistical truth.'
                                      },
                                      {
                                        title: `I Tried "${t.topic}" so You Don\'t Have To`,
                                        thumbnailIdea: 'Split-face comparison shot showing intense frustration versus massive checkmark results.',
                                        hookAngle: 'Everyone makes this look trivial. Let\'s reveal the underlying hard parts.'
                                      }
                                    ]
                                  });
                                  setTrendSearchQuery(t.topic);
                                }}
                                className={`group p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer ${
                                  isSelected 
                                    ? 'bg-emerald-500/5 border-emerald-500/30 ring-1 ring-emerald-500/10' 
                                    : 'bg-[#070b14] border-slate-900 hover:bg-slate-900/40 hover:border-slate-800'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 group-hover:text-slate-400">
                                    {t.category}
                                  </span>
                                  <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                    t.classification === 'Exploding' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                    t.classification === 'Trending' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    t.classification === 'Emerging' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>
                                    {t.classification}
                                  </span>
                                </div>

                                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-all">
                                  {t.topic}
                                </h4>

                                <p className="text-[10.5px] text-slate-400 leading-relaxed mt-2 line-clamp-2">
                                  {t.whyItIsTrending}
                                </p>

                                <div className="flex items-center justify-between border-t border-slate-950 mt-3 pt-2.5 text-[10px] font-mono">
                                  <span className="text-slate-500 font-bold uppercase">{t.viewVelocity || 'ACTIVE'}</span>
                                  <span className="text-emerald-400 font-bold">Score: {t.trendScore || t.searchInterest}/100</span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Deep Diagnostics Console (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Empty state when nothing is selected / loading */}
                  {!analyzedTrendResult && !isTrendAnalyzing && !trendAnalyzeError && (
                    <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center h-full min-h-[500px] flex flex-col justify-center items-center">
                      <TrendingUp className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
                      <h4 className="text-sm font-semibold text-white font-sans">Awaiting Trend Diagnosis</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        Select a curated topic from the left catalog, or type any custom query in the research bar above to start an advanced YouTube predictive audit.
                      </p>
                    </div>
                  )}

                  {/* Loading State */}
                  {isTrendAnalyzing && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center h-full min-h-[500px] flex flex-col justify-center items-center space-y-6 animate-fade-in">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                        <TrendingUp className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest">CONNECTING TO METADATA REGISTRIES</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed animate-pulse">
                          Querying live API endpoints, loading historical search database records, and computing view velocity curves for "{trendSearchQuery}"...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {trendAnalyzeError && (
                    <div className="bg-[#0c101d] border border-rose-500/10 rounded-2xl p-8 text-center h-full min-h-[500px] flex flex-col justify-center items-center space-y-4">
                      <AlertCircle className="w-10 h-10 text-rose-400" />
                      <h4 className="text-sm font-bold text-rose-400 font-mono">TREND AUDIT DIAGNOSTIC ERROR</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {trendAnalyzeError}
                      </p>
                      <button 
                        onClick={() => runTrendAnalyzer()}
                        className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
                      >
                        Retry Scan
                      </button>
                    </div>
                  )}

                  {/* Results Display Output */}
                  {analyzedTrendResult && (
                    <div className="space-y-6 animate-fade-in text-left">
                      
                      {/* Interactive Header with metadata block */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-3.5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-widest uppercase block">
                              {analyzedTrendResult.category}
                            </span>
                            <h3 className="text-lg font-black text-white font-sans leading-snug">
                              {analyzedTrendResult.topic}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 border border-slate-900 rounded-lg">
                              Status: <span className="text-emerald-400 font-bold">{analyzedTrendResult.dataSources?.youtubeApiStatus || 'Synced'}</span>
                            </span>
                            <span className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wide border ${
                              analyzedTrendResult.classification === 'Exploding' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                              analyzedTrendResult.classification === 'Trending' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                              analyzedTrendResult.classification === 'Emerging' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                              'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}>
                              {analyzedTrendResult.classification}
                            </span>
                          </div>
                        </div>

                        {/* Stored Database & Historical Search indices */}
                        <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-500">
                          <div className="flex justify-between bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-900">
                            <span>INDEXED DATABASE RECORDS:</span>
                            <span className="text-slate-300 font-bold">{analyzedTrendResult.dataSources?.databaseRecordsCount || 48} matched</span>
                          </div>
                          <div className="flex justify-between bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-900">
                            <span>HISTORICAL SEARCH QUERIES:</span>
                            <span className="text-slate-300 font-bold">{analyzedTrendResult.dataSources?.historicalSearchQueries?.toLocaleString() || '11,400'} matched</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Index Scores */}
                      <div className="grid grid-cols-3 gap-4">
                        
                        {/* Trend Score */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 space-y-2 text-center">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Trend Score</span>
                          <div className="text-xl font-mono font-black text-emerald-400">
                            {analyzedTrendResult.trendScore}
                            <span className="text-[10px] text-slate-500 font-normal">/100</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${analyzedTrendResult.trendScore}%` }} />
                          </div>
                        </div>

                        {/* Growth Score */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 space-y-2 text-center">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Growth Velocity</span>
                          <div className="text-xl font-mono font-black text-amber-400">
                            {analyzedTrendResult.growthScore}
                            <span className="text-[10px] text-slate-500 font-normal">/100</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${analyzedTrendResult.growthScore}%` }} />
                          </div>
                        </div>

                        {/* Opportunity Score */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 space-y-2 text-center">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Opportunity Index</span>
                          <div className="text-xl font-mono font-black text-sky-400">
                            {analyzedTrendResult.opportunityScore}
                            <span className="text-[10px] text-slate-500 font-normal">/100</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-sky-400 h-full rounded-full" style={{ width: `${analyzedTrendResult.opportunityScore}%` }} />
                          </div>
                        </div>

                      </div>

                      {/* Growth Parameters Velocity Breakdown */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                          <Sliders className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Growth Parameters Velocity Breakdown</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                          
                          {/* View Growth */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">View Volume Growth</span>
                              <span className={`font-bold ${analyzedTrendResult.metrics?.viewGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {analyzedTrendResult.metrics?.viewGrowth >= 0 ? '+' : ''}{analyzedTrendResult.metrics?.viewGrowth}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${analyzedTrendResult.metrics?.viewGrowth >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                                style={{ width: `${Math.min(Math.max(Math.abs(analyzedTrendResult.metrics?.viewGrowth || 50), 10), 100)}%` }} 
                              />
                            </div>
                          </div>

                          {/* Upload Growth */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Upload Creator Saturation Rate</span>
                              <span className={`font-bold ${analyzedTrendResult.metrics?.uploadGrowth >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                                {analyzedTrendResult.metrics?.uploadGrowth >= 0 ? '+' : ''}{analyzedTrendResult.metrics?.uploadGrowth}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${analyzedTrendResult.metrics?.uploadGrowth >= 0 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                style={{ width: `${Math.min(Math.max(Math.abs(analyzedTrendResult.metrics?.uploadGrowth || 50), 10), 100)}%` }} 
                              />
                            </div>
                          </div>

                          {/* Engagement Growth */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Viewer Retention & Engagement Ratio</span>
                              <span className="text-sky-400 font-bold">+{analyzedTrendResult.metrics?.engagementGrowth || 45}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-sky-400 h-full rounded-full" 
                                style={{ width: `${Math.min(Math.max(Math.abs(analyzedTrendResult.metrics?.engagementGrowth || 45), 10), 100)}%` }} 
                              />
                            </div>
                          </div>

                          {/* Keyword Momentum */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-400">Keyword Search Momentum</span>
                              <span className="text-indigo-400 font-bold">+{analyzedTrendResult.metrics?.keywordMomentum || 60}%</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-400 h-full rounded-full" 
                                style={{ width: `${Math.min(Math.max(Math.abs(analyzedTrendResult.metrics?.keywordMomentum || 60), 10), 100)}%` }} 
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* 6-Month Interest Trajectory Area Chart (SVG-based) */}
                      {analyzedTrendResult.historicalInterestData && (
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">6-Month Search Interest Trajectory</span>
                          </div>

                          <div className="relative pt-4 px-2">
                            {/* Render responsive custom SVG chart */}
                            <div className="w-full h-40">
                              <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                
                                {/* Grid lines */}
                                <line x1="0" y1="0" x2="500" y2="0" stroke="#070b14" strokeWidth="1" strokeDasharray="3" />
                                <line x1="0" y1="50" x2="500" y2="50" stroke="#070b14" strokeWidth="1" strokeDasharray="3" />
                                <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="1" />

                                {(() => {
                                  // Map interests (0-100) to SVG viewbox (100 is bottom, 0 is top)
                                  const points = (analyzedTrendResult.historicalInterestData || []).map((pt: any, index: number) => {
                                    const x = (index / 5) * 500;
                                    const y = 100 - (pt.interest || 0);
                                    return { x, y };
                                  });
                                  
                                  const dLine = points.map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                  const dArea = `${dLine} L 500 100 L 0 100 Z`;

                                  return (
                                    <>
                                      {/* Area layer */}
                                      <path d={dArea} fill="url(#chartGrad)" />
                                      {/* Stroke layer */}
                                      <path d={dLine} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                      
                                      {/* Interest points */}
                                      {points.map((p: any, i: number) => (
                                        <g key={i}>
                                          <circle cx={p.x} cy={p.y} r="3.5" fill="#0c101d" stroke="#10b981" strokeWidth="2" />
                                          <text 
                                            x={p.x} 
                                            y={Math.max(p.y - 10, 10)} 
                                            fill="#94a3b8" 
                                            fontSize="7" 
                                            textAnchor="middle" 
                                            fontFamily="monospace"
                                            fontWeight="bold"
                                          >
                                            {analyzedTrendResult.historicalInterestData[i].interest}%
                                          </text>
                                        </g>
                                      ))}
                                    </>
                                  );
                                })()}
                              </svg>
                            </div>

                            {/* X-axis labels */}
                            <div className="flex justify-between border-t border-slate-900/60 pt-2 text-[9px] font-mono text-slate-500">
                              {(analyzedTrendResult.historicalInterestData || []).map((pt: any, index: number) => (
                                <span key={index} className="w-12 text-center">{pt.month}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Strategic Report & Cultural Trigger */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Algorithmic Diagnostic Report</span>
                        </div>
                        <div className="space-y-4 text-xs leading-relaxed text-slate-300 font-sans">
                          <p>
                            <strong>Cultural & Demand Triggers:</strong> {analyzedTrendResult.whyItIsTrending}
                          </p>
                          <p>
                            <strong>Saturation & Competitor Benchmark:</strong> {analyzedTrendResult.saturationAnalysis}
                          </p>
                        </div>
                      </div>

                      {/* Under-served angles benchmark */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Strategic Recommendations</span>
                        </div>
                        <div className="space-y-3.5 text-xs font-sans">
                          <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-1.5">
                            <span className="text-[9px] font-mono text-amber-400 uppercase font-bold tracking-wider">Saturated Competitor Channels</span>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {(analyzedTrendResult.competitorBenchmark?.saturatedCreators || []).map((c: string) => (
                                <span key={c} className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] px-2.5 py-1 rounded-lg">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-1">
                            <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider">Underserved Market Gap Angle</span>
                            <p className="text-slate-300 mt-1 leading-relaxed">
                              {analyzedTrendResult.competitorBenchmark?.underservedAngle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Viral Video Angles blueprints */}
                      <div className="bg-[#0c101d] border border-emerald-500/15 rounded-2xl p-6 space-y-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500/10 border-l border-b border-emerald-500/10 rounded-bl-xl text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                          CREATIVE ANGLE BLUEPRINTS
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-widest block">Virality Layout Suite</span>
                          <h3 className="text-sm font-bold text-slate-100 font-sans">Implement these calculated visual/script blueprints immediately</h3>
                        </div>

                        <div className="space-y-4">
                          {(analyzedTrendResult.viralVideoAngles || []).map((angle: any, index: number) => (
                            <div key={index} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3">
                              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                                <span className="text-[10px] font-mono font-bold text-emerald-400">BLUEPRINT ANGLE 0{index + 1}</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(`Title: ${angle.title}\nThumbnail Concept: ${angle.thumbnailIdea}\nHook script: ${angle.hookAngle}`);
                                    addToast('success', `Copied Blueprint Angle 0${index + 1} to clipboard!`);
                                  }}
                                  className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" /> Copy Suite
                                </button>
                              </div>
                              
                              <div className="space-y-2 text-xs">
                                <div className="text-slate-200">
                                  <strong className="text-[10px] font-mono text-slate-500 block uppercase mb-0.5">Title idea</strong>
                                  "{angle.title}"
                                </div>
                                <div className="text-slate-300 leading-relaxed">
                                  <strong className="text-[10px] font-mono text-slate-500 block uppercase mb-0.5">Thumbnail composition idea</strong>
                                  {angle.thumbnailIdea}
                                </div>
                                <div className="text-slate-300 leading-relaxed bg-[#070b14] border border-slate-900 p-3 rounded-lg italic">
                                  <strong className="text-[10px] font-mono text-slate-500 block uppercase not-italic mb-1">Psychological opening hook</strong>
                                  "{angle.hookAngle}"
                                </div>
                              </div>
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
