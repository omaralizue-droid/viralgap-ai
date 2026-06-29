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

interface ViralPredictorToolProps {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
}

export default function ViralPredictorTool({ userId, onUseCredits, addToast, handleCopy }: ViralPredictorToolProps) {
  const [predictorTitle, setPredictorTitle] = useState('I Built a SaaS in 48 Hours with AI (and made $3,450)');
  const [predictorThumbnail, setPredictorThumbnail] = useState('Close-up side-view of a developer staring in intense focus with glowing green monitor reflection, behind them is a large blurred golden cup showing a checkout balance of $3,450');
  const [predictorHook, setPredictorHook] = useState('Everyone says solo bootstrapping is dead in 2026. They are completely wrong. Here is how I did it in a weekend.');
  const [predictorScript, setPredictorScript] = useState('Introducing the fastest software build in my life. I used full-stack AI orchestration, generated components on the fly, auto-resolved compilation errors, and landed actual paying customers before Sunday night. Let me break down the exact tech stack and marketing blueprint.');
  const [predictorResult, setPredictorResult] = useState<any | null>(null);
  const [isPredictorLoading, setIsPredictorLoading] = useState(false);
  const [predictorError, setPredictorError] = useState<string | null>(null);

  const runViralPredictor = async () => {
    const hasQuota = await onUseCredits(10, 'prompts');
    if (!hasQuota) return;

    setIsPredictorLoading(true);
    setPredictorError(null);
    setPredictorResult(null);

    try {
      const res = await fetch('/api/gemini/viral-predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: predictorTitle,
          thumbnail: predictorThumbnail,
          hook: predictorHook,
          script: predictorScript
        })
      });
      const data = await res.json();

      if (data.result) {
        setPredictorResult(data.result);
        if (data.isFallback) {
          addToast('info', 'Viral prediction generated in demo mode!');
        } else {
          addToast('success', 'Viral statistics and recommendations compiled!');
        }
      } else {
        throw new Error(data.error || 'Failed to analyze viral metrics');
      }
    } catch (err: any) {
      setPredictorError(err.message);
      addToast('error', err.message);
    } finally {
      setIsPredictorLoading(false);
    }
  };


  // Trend Intelligence Engine Scanner

  return (
    <div className="space-y-6">
                    {/* Header block */}
              <div className="bg-[#0c101d]/60 border border-amber-500/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold font-mono text-amber-400 uppercase tracking-wide">
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Neural Virality Index
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                    Viral Prediction Engine
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-sans">
                    Submit your video title, visual thumbnail idea, hook script, and full narrative. Our predictive model gauges your concept against YouTube's live CTR, recommendability, and engagement parameters before you ever press record.
                  </p>
                </div>
              </div>

              {/* Main Workspace Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Directorial Inputs */}
                <div className="space-y-6 h-fit">
                  <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                        Concept Details
                      </h3>
                      <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                        V4 Predictor
                      </span>
                    </div>

                    <div className="space-y-4 text-left">
                      {/* Video Title */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Draft Video Title
                        </label>
                        <input 
                          type="text"
                          value={predictorTitle}
                          onChange={(e) => setPredictorTitle(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans"
                          placeholder="e.g. How I Built a SaaS in 48 Hours"
                        />
                      </div>

                      {/* Thumbnail Concept description */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Thumbnail Concept Idea
                        </label>
                        <textarea 
                          rows={3}
                          value={predictorThumbnail}
                          onChange={(e) => setPredictorThumbnail(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans leading-relaxed resize-none"
                          placeholder="Describe the visual focus, text overlays, colors, and human expressions..."
                        />
                      </div>

                      {/* Opening Hook description */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          The Opening Hook (First 15s)
                        </label>
                        <textarea 
                          rows={3}
                          value={predictorHook}
                          onChange={(e) => setPredictorHook(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans leading-relaxed resize-none"
                          placeholder="What is said or seen in the very first 15 seconds to hook attention?"
                        />
                      </div>

                      {/* Script Input Area */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Core Script / Body Narrative
                        </label>
                        <textarea 
                          rows={6}
                          value={predictorScript}
                          onChange={(e) => setPredictorScript(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 font-sans leading-relaxed resize-none scrollbar-thin"
                          placeholder="Paste the remaining script or visual beats here..."
                        />
                      </div>
                    </div>

                    {/* Action Trigger */}
                    <div className="pt-2 border-t border-slate-900">
                      <button 
                        onClick={runViralPredictor}
                        disabled={isPredictorLoading}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-950/40 text-[#070b14] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        {isPredictorLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Algorithmic Weight...
                          </>
                        ) : (
                          <>
                            <Flame className="w-3.5 h-3.5 animate-pulse" /> Run Prediction Analytics <span className="text-[10px] font-mono bg-[#070b14]/10 px-1 py-0.5 rounded font-normal">(10 credits)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Diagnostic Output Console */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Empty state */}
                  {!predictorResult && !isPredictorLoading && !predictorError && (
                    <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center h-full min-h-[450px] flex flex-col justify-center items-center">
                      <Flame className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
                      <h4 className="text-sm font-semibold text-white font-sans">Awaiting Prediction Submission</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        Input your draft elements in the left panel and initiate prediction to gauge audience behavior metrics and retrieve high-impact improvements.
                      </p>
                    </div>
                  )}

                  {/* Loading Screen */}
                  {isPredictorLoading && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center h-full min-h-[450px] flex flex-col justify-center items-center space-y-5 animate-fade-in">
                      <RefreshCw className="w-12 h-12 text-amber-400 animate-spin" />
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white font-mono uppercase tracking-widest">DIAGNOSING AUDIENCE RETENTION METRICS</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed animate-pulse">
                          Feeding title mechanics, thumbnail colors, structural curiosity gap, and dialogue depth through our YouTube prediction neural network...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {predictorError && (
                    <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-8 text-center flex flex-col justify-center items-center space-y-3">
                      <AlertCircle className="w-10 h-10 text-rose-400" />
                      <h4 className="text-sm font-bold text-rose-400 font-mono">PREDICTIVE FAILURE DIAGNOSTICS</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {predictorError}
                      </p>
                      <button 
                        onClick={runViralPredictor}
                        className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
                      >
                        Retry Analysis
                      </button>
                    </div>
                  )}

                  {/* Results Output Console */}
                  {predictorResult && (
                    <div className="space-y-6 animate-fade-in text-left">
                      
                      {/* Metric Dashboard Badges */}
                      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                        
                        {/* Metric 1: Viral Score */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-10 h-10 bg-orange-500/5 rounded-full blur-lg" />
                          <div className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                            <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Viral Score</span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-xl font-black text-orange-400 font-mono">
                              {predictorResult.viralScore}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">/100</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-orange-400 h-full rounded-full transition-all duration-1000" style={{ width: `${predictorResult.viralScore}%` }} />
                          </div>
                        </div>

                        {/* Metric 2: Opportunity Score */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-10 h-10 bg-emerald-500/5 rounded-full blur-lg" />
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Opportunity</span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-xl font-black text-emerald-400 font-mono">
                              {Math.max(30, Math.min(99, Math.round(predictorResult.viralScore * 0.9 + 5)))}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">/100</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round(predictorResult.viralScore * 0.9 + 5)))}%` }} />
                          </div>
                        </div>

                        {/* Metric 3: Competition Score */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-10 h-10 bg-rose-500/5 rounded-full blur-lg" />
                          <div className="flex items-center gap-1">
                            <Sliders className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Competition</span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-xl font-black text-rose-400 font-mono">
                              {Math.max(10, Math.min(95, Math.round(100 - (predictorResult.viralScore * 0.7 + (predictorResult.engagement || 5) * 0.2))))}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">/100</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-rose-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(10, Math.min(95, Math.round(100 - (predictorResult.viralScore * 0.7 + (predictorResult.engagement || 5) * 0.2))))}%` }} />
                          </div>
                        </div>

                        {/* Metric 4: Hook Quality Score */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-10 h-10 bg-amber-500/5 rounded-full blur-lg" />
                          <div className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Hook Score</span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-xl font-black text-amber-400 font-mono">
                              {Math.max(30, Math.min(99, Math.round(predictorResult.retention * 1.15)))}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">/100</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round(predictorResult.retention * 1.15)))}%` }} />
                          </div>
                        </div>

                        {/* Metric 5: Thumbnail CTR Score */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-10 h-10 bg-cyan-500/5 rounded-full blur-lg" />
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                            <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Thumb CTR</span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-xl font-black text-cyan-400 font-mono">
                              {Math.max(30, Math.min(99, Math.round(predictorResult.ctr * 10)))}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">/100</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round(predictorResult.ctr * 10)))}%` }} />
                          </div>
                        </div>

                        {/* Metric 6: Retention Prediction */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-10 h-10 bg-indigo-500/5 rounded-full blur-lg" />
                          <div className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                            <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Retention</span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-xl font-black text-indigo-400 font-mono">
                              {predictorResult.retention}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-indigo-400 h-full rounded-full transition-all duration-1000" style={{ width: `${predictorResult.retention}%` }} />
                          </div>
                        </div>

                      </div>

                      {/* Suggested Improvements / Action Plan */}
                      <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-3">
                          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                          <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">🚀 Actionable Perfected Execution Plan</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-4 space-y-2">
                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Diagnostic Insights</span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {predictorResult.whyHighOrLow}
                            </p>
                          </div>
                          <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-4 space-y-3">
                            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase block">Creator Directives Checklist</span>
                            <ul className="space-y-2 text-xs">
                              {(predictorResult.suggestedImprovements || []).map((rec: string, index: number) => (
                                <li key={index} className="flex gap-2 text-slate-300 leading-relaxed">
                                  <span className="text-emerald-400 font-bold font-mono shrink-0">0{index + 1}.</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Revised Version */}
                      {predictorResult.revisedVersion && (
                        <div className="bg-[#0c101d] border border-emerald-500/15 rounded-2xl p-6 space-y-5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500/10 border-l border-b border-emerald-500/10 rounded-bl-xl text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                            AI PERFECTED EDITION
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-widest block">Optimized Metadata Suite</span>
                            <h3 className="text-sm font-bold text-slate-100 font-sans">Click on any section to copy the revised text immediately</h3>
                          </div>

                          {/* Render Revised Blocks */}
                          <div className="space-y-4">
                            
                            {/* Revised Title */}
                            <div className="space-y-1.5 text-left">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Optimized High-CTR Title</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(predictorResult.revisedVersion.title);
                                    addToast('success', 'Revised Title copied to clipboard!');
                                  }}
                                  className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" /> Copy
                                </button>
                              </div>
                              <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl select-all font-mono text-xs text-slate-200">
                                {predictorResult.revisedVersion.title}
                              </div>
                            </div>

                            {/* Revised Thumbnail Concept */}
                            <div className="space-y-1.5 text-left">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Optimized Thumbnail Composition</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(predictorResult.revisedVersion.thumbnailConcept);
                                    addToast('success', 'Revised Thumbnail Concept copied!');
                                  }}
                                  className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" /> Copy
                                </button>
                              </div>
                              <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl select-all text-xs text-slate-300 leading-relaxed font-sans">
                                {predictorResult.revisedVersion.thumbnailConcept}
                              </div>
                            </div>

                            {/* Revised Hook */}
                            <div className="space-y-1.5 text-left">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Optimized High-Retention Hook</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(predictorResult.revisedVersion.hook);
                                    addToast('success', 'Revised Hook copied!');
                                  }}
                                  className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" /> Copy
                                </button>
                              </div>
                              <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl select-all text-xs text-slate-300 leading-relaxed font-sans italic">
                                "{predictorResult.revisedVersion.hook}"
                              </div>
                            </div>

                            {/* Revised Script */}
                            <div className="space-y-1.5 text-left">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Optimized Script Body</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(predictorResult.revisedVersion.script);
                                    addToast('success', 'Revised Script copied!');
                                  }}
                                  className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" /> Copy
                                </button>
                              </div>
                              <div className="bg-slate-950 p-3 border border-slate-900 rounded-xl select-all text-xs text-slate-300 leading-relaxed font-sans max-h-48 overflow-y-auto scrollbar-thin">
                                {predictorResult.revisedVersion.script}
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
  );
}
