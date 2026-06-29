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

interface ThumbnailToolProps {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
  onUpdateResult?: (result: any) => void;
}

export default function ThumbnailTool({ userId, onUseCredits, addToast, handleCopy, onUpdateResult }: ThumbnailToolProps) {
  const [promptTitle, setPromptTitle] = useState('How I Built a SaaS in 48 Hours with Gemini and React');
  const [promptTopic, setPromptTopic] = useState('Software Engineering & Solo Bootstrapping');
  const [promptTranscript, setPromptTranscript] = useState('So, everyone tells you that you need a huge team and venture capital to build a software company. Today, I\'m going to prove them wrong. I built a fully functional SaaS in exactly 48 hours using React, Vite, Tailwind CSS, and the new Gemini API. In this video, I will show you the exact step-by-step process of how I found the idea, designed the UI, integrated AI features, and got my first three paying users before the weekend ended.');
  const [promptStyle, setPromptStyle] = useState('Cinematic Photorealistic');
  const [promptResult, setPromptResult] = useState<any | null>(null);
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [promptError, setPromptError] = useState<string | null>(null);
  const [activeEnginePromptTab, setActiveEnginePromptTab] = useState<'midjourney' | 'flux' | 'chatgpt'>('midjourney');
  const [activePsychologyTab, setActivePsychologyTab] = useState<'curiosity' | 'emotion' | 'contrast' | 'triggers'>('curiosity');
  const [copiedConceptId, setCopiedConceptId] = useState<number | null>(null);

  const handleCopyPrompt = (text: string, conceptId: number) => {
    navigator.clipboard.writeText(text);
    setCopiedConceptId(conceptId);
    addToast('success', `Concept prompt copied to clipboard!`);
    setTimeout(() => setCopiedConceptId(null), 2000);
  };

  const runPromptBuilder = async () => {
    const hasQuota = await onUseCredits(8, 'prompts', `Assembled aesthetic image tags for title: "${promptTitle}"`);
    if (!hasQuota) return;

    setIsPromptLoading(true);
    setPromptError(null);
    setPromptResult(null);

    try {
      const res = await fetch('/api/gemini/thumbnail-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: promptTitle,
          topic: promptTopic,
          transcript: promptTranscript
        })
      });
      const data = await res.json();

      if (data.result) {
        setPromptResult(data.result);
        if (onUpdateResult) {
          onUpdateResult(data.result);
        }
        if (data.isFallback) {
          addToast('info', 'Thumbnail psychology report generated in demo mode!');
        } else {
          addToast('success', 'Thumbnail Psychology & Creative Suite generated!');
        }
      } else {
        throw new Error(data.error || 'Failed to generate thumbnail report');
      }
    } catch (err: any) {
      setPromptError(err.message);
      addToast('error', err.message);
    } finally {
      setIsPromptLoading(false);
    }
  };


  // Video prompt call

  return (
    <div className="space-y-6">
                    {/* Header block */}
              <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Growth Psychology Laboratory
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                    Thumbnail Intelligence Engine
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    Deconstruct high-CTR visual framing, emotional triggers, cognitive tension, and curiosity gaps. Generate 10 bespoke thumbnail concepts with prompt suites optimized for Midjourney, Flux, and ChatGPT.
                  </p>
                </div>
              </div>

              {/* Main Workspace Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Parameters Column */}
                <div className="space-y-6 h-fit">
                  <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                        Psychological Inputs
                      </h3>
                      <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                        Expert Mode
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Video Title */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Video Title
                        </label>
                        <input 
                          type="text"
                          value={promptTitle}
                          onChange={(e) => setPromptTitle(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-sans"
                          placeholder="e.g. Next.js Coding Secrets"
                        />
                      </div>

                      {/* Video Topic */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Niche Topic
                        </label>
                        <input 
                          type="text"
                          value={promptTopic}
                          onChange={(e) => setPromptTopic(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-sans"
                          placeholder="e.g. Software Engineering / SaaS Solopreneurship"
                        />
                      </div>

                      {/* Transcript Area */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Video Script Transcript / Hook
                        </label>
                        <textarea 
                          rows={6}
                          value={promptTranscript}
                          onChange={(e) => setPromptTranscript(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-sans leading-relaxed resize-none scrollbar-thin"
                          placeholder="Paste your video's opening hook or full transcript to align visual metaphors with script narrative..."
                        />
                      </div>
                    </div>

                    {/* Action Trigger */}
                    <div className="pt-2 border-t border-slate-900">
                      <button 
                        onClick={runPromptBuilder}
                        disabled={isPromptLoading}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950/40 text-[#070b14] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        {isPromptLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Deconstructing Psychology...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 animate-pulse" /> Deconstruct & Generate Suite <span className="text-[10px] font-mono bg-[#070b14]/10 px-1 py-0.5 rounded font-normal">(8 credits)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Results & Analysis Console */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Empty state */}
                  {!promptResult && !isPromptLoading && !promptError && (
                    <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center h-full min-h-[400px] flex flex-col justify-center items-center">
                      <ImageIcon className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
                      <h4 className="text-sm font-semibold text-white font-sans">Awaiting Psychological Payload</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        Input your title, topic, and transcript, then run the generator to unlock the comprehensive CTR Analysis and the 10-concept creative prompt suite.
                      </p>
                    </div>
                  )}

                  {/* Loading Screen */}
                  {isPromptLoading && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center h-full min-h-[400px] flex flex-col justify-center items-center space-y-5">
                      <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin" />
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white font-mono uppercase tracking-widest">TRANSLATING CLICK PSYCHOLOGY</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed animate-pulse">
                          Reverse-engineering curiosity triggers, formulating 10 distinct visual contrasts, and constructing hyper-targeted camera parameters for Midjourney and Flux...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {promptError && (
                    <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-8 text-center flex flex-col justify-center items-center space-y-3">
                      <AlertCircle className="w-10 h-10 text-rose-400" />
                      <h4 className="text-sm font-bold text-rose-400 font-mono">INTELLIGENCE EXCEPTION</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {promptError}
                      </p>
                      <button 
                        onClick={runPromptBuilder}
                        className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
                      >
                        Retry Analysis
                      </button>
                    </div>
                  )}

                  {/* Content Output */}
                  {promptResult && (
                    <div className="space-y-8 animate-fade-in">
                      
                      {/* Metric Scores Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* CTR Score Gauge */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block">Predicted CTR Potential</span>
                            <h4 className="text-2xl font-bold text-white tracking-tight font-sans">
                              Optimized for High Click Share
                            </h4>
                            <p className="text-[10px] text-slate-400">Projected above 92% of comparable niche content.</p>
                          </div>
                          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center bg-emerald-500/10 shadow-lg shrink-0">
                            <span className="text-lg font-bold font-mono text-emerald-400">{promptResult.ctrScore || 88}%</span>
                          </div>
                        </div>

                        {/* Aesthetic Score Gauge */}
                        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500" />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block">Psychology Score</span>
                            <h4 className="text-2xl font-bold text-white tracking-tight font-sans">
                              Deep Human Resonance
                            </h4>
                            <p className="text-[10px] text-slate-400">Excellent attention grabbing anchors and curiosity framing.</p>
                          </div>
                          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 flex items-center justify-center bg-cyan-500/10 shadow-lg shrink-0">
                            <span className="text-lg font-bold font-mono text-cyan-400">{promptResult.thumbnailScore || 91}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Psychology Breakdown Tabs */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-5">
                        <div className="border-b border-slate-900 pb-2">
                          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                            Psychology & Eye-Tracking Diagnostics
                          </span>
                        </div>

                        {/* Diagnostic Subtabs */}
                        <div className="flex border-b border-slate-900/60 p-0.5 bg-slate-950/40 rounded-xl max-w-md">
                          {[
                            { id: 'curiosity', label: 'Curiosity Gaps' },
                            { id: 'emotion', label: 'Emotion & Desires' },
                            { id: 'contrast', label: 'Contrast & Hue' },
                            { id: 'triggers', label: 'Attention Anchors' }
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActivePsychologyTab(tab.id as any)}
                              className={`flex-1 text-center py-2 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                                activePsychologyTab === tab.id 
                                  ? 'bg-[#0c101d] text-emerald-400 shadow-sm border border-slate-900/40' 
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Tab Content Box */}
                        <div className="bg-[#070b14]/50 border border-slate-900/40 rounded-xl p-4 min-h-[90px] flex items-start gap-3">
                          <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
                            <Activity className="w-4 h-4 animate-pulse" />
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wider block">
                              {activePsychologyTab === 'curiosity' && 'Curiosity Gap Diagnostics'}
                              {activePsychologyTab === 'emotion' && 'Core Emotional Resonance'}
                              {activePsychologyTab === 'contrast' && 'Contrast & Luminosity Strategy'}
                              {activePsychologyTab === 'triggers' && 'Pattern Interrupt Diagnostics'}
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">
                              {activePsychologyTab === 'curiosity' && (promptResult.curiosityAnalysis || 'Analyzing curiosity variables...')}
                              {activePsychologyTab === 'emotion' && (promptResult.emotionAnalysis || 'Analyzing emotional triggers...')}
                              {activePsychologyTab === 'contrast' && (promptResult.contrastAnalysis || 'Analyzing visual contrast elements...')}
                              {activePsychologyTab === 'triggers' && (promptResult.attentionTriggersAnalysis || 'Analyzing visual pattern interrupts...')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 10 Thumbnail Concepts List */}
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                            <Sparkles className="w-4 h-4 text-emerald-400" /> 10 Psychology-Aligned Thumbnail Concepts
                          </h3>
                          
                          {/* Global Prompt Platform Toggle */}
                          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-900">
                            {[
                              { id: 'midjourney', label: 'Midjourney V6' },
                              { id: 'flux', label: 'Flux.1' },
                              { id: 'chatgpt', label: 'ChatGPT / DALL-E' }
                            ].map((p) => (
                              <button
                                key={p.id}
                                onClick={() => setActiveEnginePromptTab(p.id as any)}
                                className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${
                                  activeEnginePromptTab === p.id 
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Mapping the 10 concepts */}
                        <div className="grid grid-cols-1 gap-6">
                          {(promptResult.concepts || []).map((concept: any, index: number) => (
                            <div 
                              key={concept.id || index}
                              className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4 hover:border-emerald-500/10 transition-all relative overflow-hidden text-left"
                            >
                              {/* Badge index marker */}
                              <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500/10 border-l border-b border-emerald-500/10 rounded-bl-xl text-[10px] font-mono font-bold text-emerald-400">
                                PRESET {concept.id || index + 1}
                              </div>

                              {/* Concept Visual Outline */}
                              <div className="space-y-1.5">
                                <span className="text-[8px] font-bold font-mono text-emerald-400 uppercase tracking-widest block">
                                  Visual Concept & Composition
                                </span>
                                <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium pr-16">
                                  {concept.concept}
                                </p>
                              </div>

                              {/* Layout previews */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Simulated Text overlay badge */}
                                <div className="bg-[#070b14]/60 border border-slate-900 rounded-xl p-3.5 space-y-2 flex flex-col justify-center items-center">
                                  <span className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-wider block text-center">
                                    Simulated High-Contrast Text Overlay
                                  </span>
                                  <div className="px-5 py-2.5 bg-yellow-400 text-black font-extrabold text-sm rounded-lg uppercase tracking-wider font-sans shadow-lg transform rotate-[-1deg] border-2 border-black max-w-fit animate-pulse">
                                    {concept.textIdea}
                                  </div>
                                </div>

                                {/* Cognitive Bias Reasoning */}
                                <div className="bg-[#070b14]/60 border border-slate-900 rounded-xl p-3.5 space-y-1.5">
                                  <span className="text-[8px] font-bold font-mono text-emerald-400 uppercase tracking-wider block">
                                    Click Psychology Trigger
                                  </span>
                                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                    {concept.psychologyReasoning}
                                  </p>
                                </div>
                              </div>

                              {/* Active Platform Prompt Drawer */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-wider">
                                    {activeEnginePromptTab === 'midjourney' && 'Midjourney v6 Prompt Parameter Syntax'}
                                    {activeEnginePromptTab === 'flux' && 'Flux.1 Hyperrealistic Photographic Prompt'}
                                    {activeEnginePromptTab === 'chatgpt' && 'ChatGPT / DALL-E 3 Creative Engine Prompt'}
                                  </span>

                                  {/* Individual Copy Button */}
                                  <button
                                    onClick={() => {
                                      const promptText = 
                                        activeEnginePromptTab === 'midjourney' ? concept.midjourneyPrompt :
                                        activeEnginePromptTab === 'flux' ? concept.fluxPrompt : concept.chatgptPrompt;
                                      handleCopyPrompt(promptText, concept.id);
                                    }}
                                    className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    {copiedConceptId === concept.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400 animate-bounce" />
                                        <span>Prompt Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy Prompt</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div className="bg-[#070b14] p-3.5 border border-slate-950 rounded-xl relative select-all group">
                                  <p className="text-xs font-mono text-slate-300 leading-relaxed font-light">
                                    {activeEnginePromptTab === 'midjourney' && concept.midjourneyPrompt}
                                    {activeEnginePromptTab === 'flux' && concept.fluxPrompt}
                                    {activeEnginePromptTab === 'chatgpt' && concept.chatgptPrompt}
                                  </p>
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
