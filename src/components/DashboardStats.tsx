import React from 'react';
import { 
  Compass, 
  Link as LinkIcon, 
  FileText, 
  Image as ImageIcon, 
  Coins, 
  CreditCard,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface DashboardStatsProps {
  usageStats: {
    contentGaps: number;
    urlAnalyses: number;
    scripts: number;
    prompts: number;
    plan: string;
  };
  credits: number;
  recentGaps: any[];
  recentUrlAnalysis: any | null;
  recentScript: any | null;
  recentPrompt: any | null;
  onNavigate: (tab: any) => void;
}

export default function DashboardStats({
  usageStats,
  credits,
  recentGaps,
  recentUrlAnalysis,
  recentScript,
  recentPrompt,
  onNavigate
}: DashboardStatsProps) {
  return (
    <div className="space-y-8">
      
      {/* 1. MAIN BENTO GRID STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Content Opportunities count card */}
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 font-bold">+12%</span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Content Gaps Found</span>
            <h3 className="text-2xl font-bold text-white font-mono mt-1">{usageStats.contentGaps}</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Search opportunities mapped</p>
          </div>
        </div>

        {/* Video Analyses count card */}
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/10 font-bold">Standard</span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Videos Analyzed</span>
            <h3 className="text-2xl font-bold text-white font-mono mt-1">{usageStats.urlAnalyses}</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed"> competitor hook teardowns</p>
          </div>
        </div>

        {/* Generated Scripts count card */}
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/10 font-bold">Active</span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Scripts Compiled</span>
            <h3 className="text-2xl font-bold text-white font-mono mt-1">{usageStats.scripts}</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Retention scripts generated</p>
          </div>
        </div>

        {/* Saved Prompts count card */}
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10 font-bold">{usageStats.prompts} Built</span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Thumbnail Prompts</span>
            <h3 className="text-2xl font-bold text-white font-mono mt-1">{usageStats.prompts}</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Aesthetic image syntax tags</p>
          </div>
        </div>

      </div>

      {/* 2. SPECIFIC SECTION CARDS (OPPORTUNITIES, ANALYSES, SCRIPTS, PROMPTS, MONTHLY USAGE, SUBSCRIPTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD: Content Opportunities */}
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Content Opportunities</span>
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white font-mono">Trending Niche Breakthroughs</h4>
          </div>

          <div className="space-y-2.5 my-2">
            {recentGaps.length > 0 ? (
              recentGaps.slice(0, 2).map((gap, i) => (
                <div key={i} className="bg-[#070b14]/60 border border-slate-900 p-3 rounded-xl space-y-1 hover:border-slate-800 transition-colors">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold truncate max-w-[150px]">{gap.topic}</span>
                    <span className="text-slate-500">Score: {gap.score}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{gap.description}</p>
                </div>
              ))
            ) : (
              <div className="bg-[#070b14]/30 border border-dashed border-slate-800/80 p-5 rounded-xl text-center flex flex-col items-center justify-center space-y-2 group/empty hover:border-slate-700/80 transition-all">
                <Compass className="w-5 h-5 text-slate-655 animate-pulse" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-400">No Content Gaps</p>
                  <p className="text-[10px] text-slate-500 leading-normal max-w-[180px] mx-auto">Scan niches to identify high-potential underserved keywords.</p>
                </div>
                <button 
                  onClick={() => onNavigate('content-gap')} 
                  className="px-2.5 py-1 bg-[#070b14] border border-slate-850 hover:border-slate-750 hover:text-white text-[9px] text-emerald-400 font-mono font-medium rounded-lg transition-all cursor-pointer"
                >
                  Run First Scan
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => onNavigate('content-gap')}
            className="w-full py-2.5 bg-[#070b14] hover:bg-slate-900 border border-slate-855 hover:border-slate-750 rounded-xl text-[11px] text-slate-350 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
          >
            Open Gap Finder <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* CARD: Video Analyses */}
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Video Analyses</span>
              <LinkIcon className="w-4 h-4 text-sky-400" />
            </div>
            <h4 className="text-sm font-bold text-white font-mono">Hook Teardowns & Retentions</h4>
          </div>

          <div className="space-y-2 my-2 flex-grow flex flex-col justify-center">
            {recentUrlAnalysis ? (
              <div className="bg-[#070b14]/60 border border-slate-905 p-4 rounded-xl space-y-2 hover:border-slate-850 transition-colors">
                <div>
                  <span className="text-[9px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">Teardown Live</span>
                  <p className="text-xs font-bold text-white truncate mt-1.5">{recentUrlAnalysis.title}</p>
                  <span className="text-[10px] text-slate-400 font-mono">Channel: {recentUrlAnalysis.channelName}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono pt-1.5 border-t border-slate-900/60 text-slate-500">
                  <span>Hook Score:</span>
                  <span className="text-emerald-400 font-bold">{recentUrlAnalysis.hookScore}%</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#070b14]/30 border border-dashed border-slate-800/80 p-5 rounded-xl text-center flex flex-col items-center justify-center space-y-2 group/empty hover:border-slate-700/80 transition-all">
                <LinkIcon className="w-5 h-5 text-slate-655 animate-pulse" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-400">No Videos Scraped</p>
                  <p className="text-[10px] text-slate-500 leading-normal max-w-[180px] mx-auto">Analyze a competitor's link to teardown pacing metrics.</p>
                </div>
                <button 
                  onClick={() => onNavigate('url-analyzer')} 
                  className="px-2.5 py-1 bg-[#070b14] border border-slate-855 hover:border-slate-750 hover:text-white text-[9px] text-sky-400 font-mono font-medium rounded-lg transition-all cursor-pointer"
                >
                  Analyze Competitor URL
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => onNavigate('url-analyzer')}
            className="w-full py-2.5 bg-[#070b14] hover:bg-slate-900 border border-slate-855 hover:border-slate-750 rounded-xl text-[11px] text-slate-350 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
          >
            Open URL Analyzer <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* CARD: Generated Scripts & Saved Prompts */}
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-800 transition-all">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Generated Scripts & Prompts</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-sm font-bold text-white font-mono">Active Writing Worksheets</h4>
          </div>

          <div className="space-y-2.5 my-2">
            {recentScript ? (
              <div className="bg-[#070b14]/60 border border-slate-900 p-3 rounded-xl hover:border-slate-800 transition-colors">
                <div className="flex justify-between text-[9px] font-mono mb-1 text-slate-500">
                  <span>ACTIVE SCRIPT</span>
                  <span>{recentScript.targetLength}</span>
                </div>
                <p className="text-xs font-bold text-white truncate">{recentScript.title}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{recentScript.niche}</p>
              </div>
            ) : (
              <div className="bg-[#070b14]/30 border border-dashed border-slate-800/80 p-3.5 rounded-xl text-center flex flex-col items-center justify-center space-y-1 group/empty hover:border-slate-700/80 transition-all">
                <FileText className="w-4 h-4 text-slate-655" />
                <p className="text-[11px] font-semibold text-slate-400">No Compiled Scripts</p>
                <button 
                  onClick={() => onNavigate('script-generator')} 
                  className="text-[9px] text-purple-450 hover:underline font-mono transition-colors cursor-pointer"
                >
                  Write Script
                </button>
              </div>
            )}

            {recentPrompt ? (
              <div className="bg-[#070b14]/60 border border-slate-900 p-3 rounded-xl hover:border-slate-800 transition-colors">
                <div className="flex justify-between text-[9px] font-mono mb-1 text-slate-500">
                  <span>SAVED IMAGE PROMPT</span>
                  <span className="text-emerald-400">Midjourney</span>
                </div>
                <p className="text-xs text-slate-300 truncate font-mono italic">"{recentPrompt.midjourneyPrompt}"</p>
              </div>
            ) : (
              <div className="bg-[#070b14]/30 border border-dashed border-slate-800/80 p-3.5 rounded-xl text-center flex flex-col items-center justify-center space-y-1 group/empty hover:border-slate-700/80 transition-all mt-2.5">
                <ImageIcon className="w-4 h-4 text-slate-655" />
                <p className="text-[11px] font-semibold text-slate-400">No Visual Prompts</p>
                <button 
                  onClick={() => onNavigate('prompts')} 
                  className="text-[9px] text-amber-450 hover:underline font-mono transition-colors cursor-pointer"
                >
                  Build Prompts
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onNavigate('script-generator')}
              className="py-2 bg-[#070b14] hover:bg-slate-900 border border-slate-850 hover:border-slate-750 rounded-xl text-[10px] text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer font-mono"
            >
              Script Builder
            </button>
            <button 
              onClick={() => onNavigate('prompts')}
              className="py-2 bg-[#070b14] hover:bg-slate-900 border border-slate-850 hover:border-slate-750 rounded-xl text-[10px] text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer font-mono"
            >
              Prompt Builder
            </button>
          </div>
        </div>

      </div>

      {/* 3. CORE MANAGEMENT INFO CARDS (MONTHLY USAGE & SUBSCRIPTION PLAN) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD: Monthly Usage credits meter */}
        <div className="md:col-span-2 bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900/60 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Monthly Usage Tracker</span>
              <h4 className="text-sm font-bold text-white font-mono mt-0.5">SaaS Worker Credits consumption log</h4>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-mono text-[10px] font-bold uppercase">
              <Coins className="w-3.5 h-3.5 animate-pulse" /> {credits} Credits Left
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            
            {/* Progress circle SVG or radial meter */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Outer glow ring track */}
                  <circle cx="56" cy="56" r="46" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="5" fill="transparent" />
                  {/* Inner track */}
                  <circle cx="56" cy="56" r="46" stroke="#040405" strokeWidth="5" fill="transparent" />
                  {/* Dynamic progress track */}
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="46" 
                    stroke="#10b981" 
                    strokeWidth="5" 
                    fill="transparent" 
                    strokeDasharray={289}
                    strokeDashoffset={289 - (289 * (credits / 500))}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_6px_rgba(16,185,129,0.25)]"
                  />
                </svg>
                <div className="absolute text-center space-y-0.5">
                  <span className="text-2xl font-black text-white font-mono tracking-tight">{((credits/500)*100).toFixed(0)}%</span>
                  <p className="text-[8px] font-mono text-slate-500 uppercase font-bold tracking-wider">AVAILABLE</p>
                </div>
              </div>
            </div>

            {/* Quota metadata details */}
            <div className="sm:col-span-2 space-y-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Current tier allocation:</span>
                  <span className="font-mono text-slate-200">500 credits / mo</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Credits spent this month:</span>
                  <span className="font-mono text-slate-200">{500 - credits} credits</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated days until renewal:</span>
                  <span className="font-mono text-slate-200">14 Days (July 24)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900/60 flex gap-4">
                <button 
                  onClick={() => onNavigate('billing')}
                  className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                >
                  Manage Credits limits →
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* CARD: Subscription Plan details */}
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start border-b border-slate-900/60 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Subscription Plan</span>
                <h4 className="text-base font-bold text-white font-mono mt-0.5 uppercase tracking-wide">
                  {usageStats.plan} Plan
                </h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                ACTIVE
              </span>
            </div>

            <div className="text-xs space-y-2 mt-4 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Unlimited search keywords</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Active Gemini AI live parsing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Premium script visual directions</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => onNavigate('billing')}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] text-xs font-mono font-bold rounded-xl text-center transition-all cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" /> Upgrade Subscription Plan
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
