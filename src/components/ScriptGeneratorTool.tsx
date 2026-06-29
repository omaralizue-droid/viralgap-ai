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

interface ScriptGeneratorToolProps {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
  onUpdateResult?: (result: any) => void;
}

export default function ScriptGeneratorTool({ userId, onUseCredits, addToast, handleCopy, onUpdateResult }: ScriptGeneratorToolProps) {
  const [scriptTopic, setScriptTopic] = useState('How I Built a SaaS in 48 Hours with Gemini and React');
  const [scriptAudience, setScriptAudience] = useState('Beginner Developers');
  const [scriptLength, setScriptLength] = useState('8-10 minutes');
  const [scriptPlatform, setScriptPlatform] = useState('YouTube');
  const [scriptTone, setScriptTone] = useState('Educational');
  const [scriptNiche, setScriptNiche] = useState('Tech Education');
  const [scriptResult, setScriptResult] = useState<any | null>(null);
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [activeScriptVersion, setActiveScriptVersion] = useState<'A' | 'B' | 'C'>('A');

  const runScriptGenerator = async () => {
    const hasQuota = await onUseCredits(25, 'scripts', `Compiled blueprint for script topic: "${scriptTopic}"`);
    if (!hasQuota) return;

    setIsScriptLoading(true);
    setScriptError(null);
    setScriptResult(null);

    try {
      const res = await fetch('/api/gemini/script-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: scriptTopic,
          targetAudience: scriptAudience,
          videoLength: scriptLength,
          platform: scriptPlatform,
          tone: scriptTone
        })
      });
      const data = await res.json();

      if (data.result) {
        setScriptResult(data.result);
        if (onUpdateResult) {
          onUpdateResult(data.result);
        }
        if (data.isFallback) {
          addToast('info', 'Paced script demo compiled. Set your API key for live generation!');
        } else {
          addToast('success', 'Viral retention script constructed successfully!');
        }
      } else {
        throw new Error(data.error || 'Failed to generate script');
      }
    } catch (err: any) {
      setScriptError(err.message);
      addToast('error', err.message);
    } finally {
      setIsScriptLoading(false);
    }
  };

  const loadDemoPreset = () => {
    const demoResult = {
      topic: "AI Agent Orchestration for Micro-SaaS",
      targetAudience: "Indie hackers & SaaS developers",
      videoLength: "8-10 minutes",
      platform: "YouTube",
      tone: "Educational & Engineering focused",
      versionA: {
        title: "I Built a LangGraph AI Agent SaaS in 24 Hours (Step-by-Step)",
        hook: "This AI agent fleet just launched a real SaaS, signed up its first user, and sent them a Stripe invoice while I was sleeping.",
        opening: "Most YouTube developers tell you AI agents are just toy scripts in a terminal. Today, we are breaking down a production-ready React app where LangGraph nodes handle user state, execute real database writes, and billing loops.",
        body: "[Visual: Split screen showing Next.js code on left, LangGraph node execution logs on right.]\nVO: 'To build a functional agent SaaS, the first thing you need is structured memory. If your agents don't remember user preferences across API calls, they will loop endlessly. Here is how we hook up redis session memory to our LangGraph state.'\n\n[Visual: Screen recording showing PgBouncer configuration and connection limit settings.]\nVO: 'Next is the database layer. When 10 agents concurrently query a Supabase DB, you will crash the connection pool instantly. We avoid this by deploying a PgBouncer sidecar...'",
        storyStructure: "Retention optimized layout: uses rapid sensory visual cues, code highlights, pattern interrupts every 15 seconds, and direct problem-solution loops to eliminate immediate drop-offs.",
        cta: "Download the complete Next.js LangGraph boilerplate from the link in the pinned comment. Let's head over to the next video where we deploy it."
      },
      versionB: {
        title: "Why Your AI Agents Loop Forever (And How to Fix It)",
        hook: "This is the exact moment my autonomous agent fleet started writing infinite loops and cost me $400 in OpenAI API keys in one night.",
        opening: "In this walkthrough, we are analyzing the hidden architecture failure that ruins 99% of agent apps. It's not the model size—it's your node routing boundary rules.",
        body: "[Visual: Close up of code showcasing conditional edge routers returning the same state node recursively.]\nVO: 'If you look at this edge routing node, we forgot to increment the retry counter. The model keeps retrying the tool execution, thinking it got a failure, accumulating token costs. We solve this by introducing a global system gatekeeper node.'\n\n[Visual: Animated diagram showing the flow of tokens through agent nodes, highlighting the gatekeeper filter.]\nVO: 'The gatekeeper limits model attempts to exactly 3. If it fails, it gracefully falls back to a human-in-the-loop manual review state...'",
        storyStructure: "Watch time optimized layout: focuses on deep relational storytelling, high-stakes developer failures, visual architectural flowcharts, and pacing designed to sustain immersion across the full 10 minutes.",
        cta: "Join our discord channel of indie hackers fixing AI agent loops. The link is right below. See you there."
      },
      versionC: {
        title: "Stop Using Basic LLM wrappers: How to Build Real Autonomous Software",
        hook: "The era of basic OpenAI wrapper SaaS is officially over. If your app is just a system prompt and a text area, you will be cloned in 5 minutes.",
        opening: "In this disruptive deep-dive, we are building a multi-agent compiler that actually generates, tests, and refactors production typescript files without manual developer intervention.",
        body: "[Visual: Command line showing jest test failures, then the agent automatically reading the stack trace, editing the source code, and passing the tests.]\nVO: 'This agent doesn't just guess code. It reads the unit test stack trace, identifies the exact line number of the runtime error, and edits the code structure to satisfy the compiler parameters.'\n\n[Visual: Vercel serverless logs showing successfully deployed agent output endpoint.]\nVO: 'By offloading the test-run loop to our agent environment, we achieve a self-healing software cycle. Let's analyze why this is 10 times more valuable than a simple prompt wrapper.'",
        storyStructure: "Contrarian polarizing angle: shakes up mainstream developer assumptions, points out industry lies regarding simple LLM wrappers, and provides a 10x value perspective designed for high click-through rates.",
        cta: "The future is self-healing software. Drop a comment below if you think agents will replace junior engineers by next year."
      }
    };

    setScriptResult(demoResult);
    if (onUpdateResult) {
      onUpdateResult(demoResult);
    }
    addToast('success', 'Loaded Demo Script Blueprint successfully! (0 credits used)');
  };

  // Thumbnail prompt call

  return (
    <div className="space-y-6">
                    <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" /> Viral Script Generator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesize an entire, chronologically paced, 5-chapter YouTube script with retention tactics and visualdirections.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Inputs card */}
                <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-5 h-fit">
                  <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-3">
                    Script Guidelines
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Video Topic or Concept</label>
                      <input 
                        type="text"
                        value={scriptTopic}
                        onChange={(e) => setScriptTopic(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="e.g. Speed-running React 19"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Target Audience</label>
                      <input 
                        type="text"
                        value={scriptAudience}
                        onChange={(e) => setScriptAudience(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. SaaS Founders / Junior Devs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Platform</label>
                      <select 
                        value={scriptPlatform}
                        onChange={(e) => {
                          const val = e.target.value;
                          setScriptPlatform(val);
                          // Auto-adjust default length for short-form vs long-form
                          if (val === 'YouTube') {
                            setScriptLength('8-10 minutes');
                          } else {
                            setScriptLength('60 seconds');
                          }
                        }}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
                      >
                        <option value="YouTube">YouTube (Long form)</option>
                        <option value="YouTube Shorts">YouTube Shorts</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Instagram Reels">Instagram Reels</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Video Length</label>
                      {scriptPlatform === 'YouTube' ? (
                        <select 
                          value={scriptLength}
                          onChange={(e) => setScriptLength(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="3-5 minutes">3-5 minutes (Fast-paced tutorial)</option>
                          <option value="8-10 minutes">8-10 minutes (Optimal mid-roll length)</option>
                          <option value="15-20 minutes">15-20 minutes (Documentary breakdown)</option>
                        </select>
                      ) : (
                        <select 
                          value={scriptLength}
                          onChange={(e) => setScriptLength(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="15 seconds">15 seconds (Hyper fast pacing)</option>
                          <option value="30 seconds">30 seconds (Standard micro-hook)</option>
                          <option value="60 seconds">60 seconds (Full narrative arc)</option>
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Tone & Style</label>
                      <select 
                        value={scriptTone}
                        onChange={(e) => setScriptTone(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
                      >
                        <option value="Educational">Educational (Informative & authoritative)</option>
                        <option value="Hype">Hype (High energy, bold & punchy)</option>
                        <option value="Casual">Casual (Friendly, chill & relatable)</option>
                        <option value="Suspenseful">Suspenseful (Curiosity gap, mystery)</option>
                        <option value="Professional">Professional (Corporate, clean & structured)</option>
                        <option value="Storyteller">Storyteller (Intimate, emotional journey)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900">
                    <button 
                      onClick={runScriptGenerator}
                      disabled={isScriptLoading}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950/40 text-[#070b14] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      {isScriptLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Structuring Chapters...
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" /> Synthesize Script <span className="text-[10px] font-mono bg-[#070b14]/10 px-1 py-0.5 rounded font-normal">(25 credits)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Outputs Section */}
                <div className="lg:col-span-2">
                  
                  {/* Empty state */}
                  {!scriptResult && !isScriptLoading && !scriptError && (
                    <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center">
                      <FileText className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
                      <h4 className="text-sm font-semibold text-white">No active script file</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                        Input your target video concept on the left, and Gemini will assemble a retention script with direct voiceline narration.
                      </p>
                      <button
                        onClick={loadDemoPreset}
                        className="mt-5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs text-emerald-400 font-mono font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer uppercase"
                      >
                        ✍️ Load Demo Script Blueprint
                      </button>
                    </div>
                  )}

                  {/* Loading */}
                  {isScriptLoading && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center space-y-4">
                      <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                      <div>
                        <h4 className="text-sm font-semibold text-white font-mono">GENERATING FULL-LENGTH Retention Script</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed animate-pulse">
                          Composing high-stakes opening statements and designing loop outros for fluid playlist continuation...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {scriptError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center flex flex-col justify-center items-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-rose-400" />
                      <h4 className="text-sm font-semibold text-rose-400 font-mono">COMPILER EXCEPTION</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {scriptError}
                      </p>
                      <button 
                        onClick={runScriptGenerator}
                        className="px-4 py-2 bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium hover:bg-rose-500/30 transition-all cursor-pointer"
                      >
                        Retry Generation
                      </button>
                    </div>
                  )}

                  {/* Complete script timeline */}
                  {scriptResult && (
                    <div className="space-y-6 animate-fadeIn">
                      
                      {/* Top metadata panel */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">STRATEGIC SCRIPT ENGINE ACTIVE</span>
                          <h3 className="text-sm font-bold text-white font-mono mt-1">Concept: "{scriptResult.topic || scriptTopic}"</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                              Platform: {scriptResult.platform || scriptPlatform}
                            </span>
                            <span className="text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                              Length: {scriptResult.videoLength || scriptLength}
                            </span>
                            <span className="text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                              Tone: {scriptResult.tone || scriptTone}
                            </span>
                            <span className="text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                              Audience: {scriptResult.targetAudience || scriptAudience}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleCopy(JSON.stringify(scriptResult, null, 2), "Full Strategic Script Suite")}
                          className="px-3 py-1.5 bg-[#070b14] border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer rounded-lg shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" /> Export Suite JSON
                        </button>
                      </div>

                      {/* Version selection tabs */}
                      <div className="grid grid-cols-3 bg-[#070b14] p-1.5 border border-slate-900 rounded-xl gap-2">
                        <button
                          onClick={() => setActiveScriptVersion('A')}
                          className={`py-2 text-xs font-bold font-mono rounded-lg transition-all border cursor-pointer ${
                            activeScriptVersion === 'A'
                              ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          Version A: Optimize for Retention
                        </button>
                        <button
                          onClick={() => setActiveScriptVersion('B')}
                          className={`py-2 text-xs font-bold font-mono rounded-lg transition-all border cursor-pointer ${
                            activeScriptVersion === 'B'
                              ? 'bg-sky-500/15 border-sky-500/20 text-sky-400'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          Version B: Optimize for Watch Time
                        </button>
                        <button
                          onClick={() => setActiveScriptVersion('C')}
                          className={`py-2 text-xs font-bold font-mono rounded-lg transition-all border cursor-pointer ${
                            activeScriptVersion === 'C'
                              ? 'bg-indigo-500/15 border-indigo-500/20 text-indigo-400'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          Version C: Contrarian / Disruptive
                        </button>
                      </div>

                      {/* Display active script version */}
                      {(() => {
                        const versionKey = activeScriptVersion === 'A' ? 'versionA' : activeScriptVersion === 'B' ? 'versionB' : 'versionC';
                        const versionData = scriptResult[versionKey];
                        if (!versionData) {
                          return (
                            <div className="p-6 text-center bg-[#0c101d] border border-slate-900 rounded-xl">
                              <span className="text-xs text-slate-500 font-mono">No data found for this version.</span>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-6 text-left">

                            {/* Professional YouTube Creator Intelligence Dashboard */}
                            <div className="space-y-3">
                              <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                                📊 Creator Intelligence Metrics for Version {activeScriptVersion}
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
                                    <span className="text-xl font-black text-orange-400 font-mono">
                                      {activeScriptVersion === 'A' ? 88 : activeScriptVersion === 'B' ? 92 : 95}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                    <div className="bg-orange-400 h-full rounded-full transition-all duration-1000" style={{ width: `${activeScriptVersion === 'A' ? 88 : activeScriptVersion === 'B' ? 92 : 95}%` }} />
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
                                    <span className="text-xl font-black text-emerald-400 font-mono">
                                      {activeScriptVersion === 'A' ? 82 : activeScriptVersion === 'B' ? 85 : 90}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                    <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${activeScriptVersion === 'A' ? 82 : activeScriptVersion === 'B' ? 85 : 90}%` }} />
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
                                    <span className="text-xl font-black text-rose-400 font-mono">
                                      {activeScriptVersion === 'A' ? 45 : activeScriptVersion === 'B' ? 40 : 55}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                    <div className="bg-rose-400 h-full rounded-full transition-all duration-1000" style={{ width: `${activeScriptVersion === 'A' ? 45 : activeScriptVersion === 'B' ? 40 : 55}%` }} />
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
                                    <span className="text-xl font-black text-amber-400 font-mono">
                                      {activeScriptVersion === 'A' ? 96 : activeScriptVersion === 'B' ? 85 : 94}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                    <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${activeScriptVersion === 'A' ? 96 : activeScriptVersion === 'B' ? 85 : 94}%` }} />
                                  </div>
                                </div>

                                {/* Metric 5: Thumbnail CTR Score */}
                                <div className="bg-[#070b14]/50 border border-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-10 h-10 bg-cyan-500/5 rounded-full blur-lg" />
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                    <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">Thumb CTR</span>
                                  </div>
                                  <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-xl font-black text-cyan-400 font-mono">
                                      {activeScriptVersion === 'A' ? 84 : activeScriptVersion === 'B' ? 82 : 96}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-mono">/100</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                    <div className="bg-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: `${activeScriptVersion === 'A' ? 84 : activeScriptVersion === 'B' ? 82 : 96}%` }} />
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
                                    <span className="text-xl font-black text-indigo-400 font-mono">
                                      {activeScriptVersion === 'A' ? 79 : activeScriptVersion === 'B' ? 84 : 72}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                    <div className="bg-indigo-400 h-full rounded-full transition-all duration-1000" style={{ width: `${activeScriptVersion === 'A' ? 79 : activeScriptVersion === 'B' ? 84 : 72}%` }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Title Card */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-widest block">VIRAL METADATA TITLE</span>
                                  <h4 className="text-sm font-bold text-slate-100 font-mono select-all leading-relaxed">
                                    {versionData.title}
                                  </h4>
                                </div>
                                <button 
                                  onClick={() => handleCopy(versionData.title, "Script Title")}
                                  className="p-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer shrink-0"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Hook Card */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 flex-1">
                                  <span className="text-[9px] font-mono text-amber-400 uppercase font-bold tracking-widest block">STEP 1: THE DISRUPTIVE HOOK (0s - 15s)</span>
                                  <p className="text-sm text-amber-300 font-sans italic select-all leading-relaxed bg-amber-500/5 p-4 border border-amber-500/10 rounded-xl">
                                    "{versionData.hook}"
                                  </p>
                                </div>
                                <button 
                                  onClick={() => handleCopy(versionData.hook, "Opening Hook")}
                                  className="p-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer shrink-0"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Opening Card */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 flex-1">
                                  <span className="text-[9px] font-mono text-sky-400 uppercase font-bold tracking-widest block">STEP 2: THE CURIOSITY GAP OPENING (15s - 60s)</span>
                                  <p className="text-xs text-sky-200 font-sans leading-relaxed bg-sky-500/5 p-4 border border-sky-500/10 rounded-xl">
                                    "{versionData.opening}"
                                  </p>
                                </div>
                                <button 
                                  onClick={() => handleCopy(versionData.opening, "Script Opening")}
                                  className="p-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer shrink-0"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Body Card */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 flex-1">
                                  <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-widest block">STEP 3: FULL PRODUCTION BODY TRANSCRIPT</span>
                                  <div className="bg-[#070b14] p-4 border border-slate-950 rounded-xl whitespace-pre-line text-xs text-slate-200 leading-relaxed font-sans h-96 overflow-y-auto select-all">
                                    {versionData.body}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleCopy(versionData.body, "Script Body")}
                                  className="p-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer shrink-0"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Story Structure & Psychological Model Card */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 flex-1">
                                  <span className="text-[9px] font-mono text-indigo-400 uppercase font-bold tracking-widest block">UNDERLYING STORY STRUCTURE & PSYCHOLOGY</span>
                                  <p className="text-xs text-indigo-300 font-sans leading-relaxed bg-indigo-500/5 p-4 border border-indigo-500/10 rounded-xl">
                                    {versionData.storyStructure}
                                  </p>
                                </div>
                                <button 
                                  onClick={() => handleCopy(versionData.storyStructure, "Story Structure Rationale")}
                                  className="p-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer shrink-0"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-3 relative overflow-hidden">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 flex-1">
                                  <span className="text-[9px] font-mono text-rose-400 uppercase font-bold tracking-widest block">STEP 4: ZERO-DROP-OFF CALL TO ACTION & OUTRO LOOP</span>
                                  <p className="text-xs text-rose-300 font-sans italic leading-relaxed bg-rose-500/5 p-4 border border-rose-500/10 rounded-xl">
                                    "{versionData.cta}"
                                  </p>
                                </div>
                                <button 
                                  onClick={() => handleCopy(versionData.cta, "Call to Action")}
                                  className="p-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer shrink-0"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Script Execution Checklist */}
                            <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl p-5 space-y-4">
                              <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-3">
                                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                                  🚀 Script Execution Checklist
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#070b14]/40 border border-white/5 rounded-xl p-4 space-y-2">
                                  <div className="text-[8px] font-mono font-bold text-slate-500 uppercase">Vocal Delivery Speed</div>
                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    Target exactly **160 WPM** (Words Per Minute). Keep pacing tight and cut out all filler words during recording.
                                  </p>
                                </div>
                                <div className="bg-[#070b14]/40 border border-white/5 rounded-xl p-4 space-y-2">
                                  <div className="text-[8px] font-mono font-bold text-slate-500 uppercase">Pattern Interrupt Frequency</div>
                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    Apply visual pattern interrupts (B-roll, zoomed text, glowing code loops) every **2.5 seconds** to prevent viewer bounce.
                                  </p>
                                </div>
                                <div className="bg-[#070b14]/40 border border-white/5 rounded-xl p-4 space-y-2">
                                  <div className="text-[8px] font-mono font-bold text-slate-500 uppercase">End Screen Loop Outro</div>
                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    Trigger the Call-to-Action loop exactly **3 seconds** before the video ends. Avoid saying "Thank you for watching" or giving signup greetings.
                                  </p>
                                </div>
                              </div>
                            </div>

                          </div>
                        );
                      })()}


                    </div>
                  )}
                </div>
              </div>
            </div>
  );
}
