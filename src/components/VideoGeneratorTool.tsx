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

interface VideoGeneratorToolProps {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
}

export default function VideoGeneratorTool({ userId, onUseCredits, addToast, handleCopy }: VideoGeneratorToolProps) {
  const [videoTopic, setVideoTopic] = useState('Next-Gen AI Coding Assistant Breakthrough');
  const [videoScript, setVideoScript] = useState('Introducing the world\'s fastest coding partner. You describe your software idea in natural language, and in real-time, the interface constructs itself, resolves its own compilation errors, and deploys to production in under ten seconds. The future of software is not writing code; it is directing code.');
  const [videoStyle, setVideoStyle] = useState('Cinematic Dark Sci-Fi, Ambient Neon Glow');
  const [videoPromptResult, setVideoPromptResult] = useState<any | null>(null);
  const [isVideoPromptLoading, setIsVideoPromptLoading] = useState(false);
  const [videoPromptError, setVideoPromptError] = useState<string | null>(null);
  const [activeVideoPlatformTab, setActiveVideoPlatformTab] = useState<'veo' | 'kling' | 'runway'>('veo');
  const [copiedVideoSceneId, setCopiedVideoSceneId] = useState<string | null>(null);

  const handleCopyVideoPrompt = (text: string, sceneId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVideoSceneId(sceneId);
    addToast('success', `AI video generation prompt copied to clipboard!`);
    setTimeout(() => setCopiedVideoSceneId(null), 2000);
  };

  const runVideoPromptBuilder = async () => {
    const hasQuota = await onUseCredits(10, 'prompts');
    if (!hasQuota) return;

    setIsVideoPromptLoading(true);
    setVideoPromptError(null);
    setVideoPromptResult(null);

    try {
      const res = await fetch('/api/gemini/video-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: videoTopic,
          script: videoScript,
          style: videoStyle
        })
      });
      const data = await res.json();

      if (data.result) {
        setVideoPromptResult(data.result);
        if (data.isFallback) {
          addToast('info', 'Video prompts generated in demo mode!');
        } else {
          addToast('success', 'Cinematic Video Prompts generated successfully!');
        }
      } else {
        throw new Error(data.error || 'Failed to generate video prompts');
      }
    } catch (err: any) {
      setVideoPromptError(err.message);
      addToast('error', err.message);
    } finally {
      setIsVideoPromptLoading(false);
    }
  };


  // Viral Prediction Engine call

  return (
    <div className="space-y-6">
                    {/* Header block */}
              <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> AI Video Director Mode
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                    Cinematic Video Prompt Generator
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-sans">
                    Design highly-stylized cinematic video prompts synchronized with Voiceover narratives and custom directorial cues. Generates optimized instructions for Google Veo, Kling AI, and Runway Gen-3.
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
                        Director Parameters
                      </h3>
                      <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        Ultra-HQ
                      </span>
                    </div>

                    <div className="space-y-4 text-left">
                      {/* Topic Input */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Video Concept / Topic
                        </label>
                        <input 
                          type="text"
                          value={videoTopic}
                          onChange={(e) => setVideoTopic(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-sans"
                          placeholder="e.g. Next-Gen AI Code Workspace"
                        />
                      </div>

                      {/* Style Preset Selector */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Visual Art Direction Style
                        </label>
                        <select 
                          value={videoStyle}
                          onChange={(e) => setVideoStyle(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-sans cursor-pointer"
                        >
                          <option value="Cinematic Dark Sci-Fi, Ambient Neon Glow">Cinematic Dark Sci-Fi, Ambient Neon Glow</option>
                          <option value="Hyperrealistic 35mm Film, Warm Golden Hour">Hyperrealistic 35mm Film, Warm Golden Hour</option>
                          <option value="Industrial Brutalist Concrete, High Contrast Monochrome">Industrial Brutalist Concrete, High Contrast Monochrome</option>
                          <option value="Cozy Cinematic Retro VHS, Soft Nostalgic Film Grain">Cozy Cinematic Retro VHS, Soft Nostalgic Film Grain</option>
                          <option value="Epic Fantasy, Ethereal Atmospheric Volumetric Fog">Epic Fantasy, Ethereal Atmospheric Volumetric Fog</option>
                        </select>
                      </div>

                      {/* Script Input Area */}
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Voiceover Script / Screenplay Draft
                        </label>
                        <textarea 
                          rows={8}
                          value={videoScript}
                          onChange={(e) => setVideoScript(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-sans leading-relaxed resize-none scrollbar-thin"
                          placeholder="Paste your video's voiceover script or dialogue here. The AI will segment this into 5 sequential scenes matching your voiceover speed..."
                        />
                      </div>
                    </div>

                    {/* Action Trigger */}
                    <div className="pt-2 border-t border-slate-900">
                      <button 
                        onClick={runVideoPromptBuilder}
                        disabled={isVideoPromptLoading}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950/40 text-[#070b14] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        {isVideoPromptLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sequencing Storyboard...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 animate-pulse" /> Generate Cinematic Suite <span className="text-[10px] font-mono bg-[#070b14]/10 px-1 py-0.5 rounded font-normal">(10 credits)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Director Console */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Empty state */}
                  {!videoPromptResult && !isVideoPromptLoading && !videoPromptError && (
                    <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center h-full min-h-[450px] flex flex-col justify-center items-center">
                      <Video className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
                      <h4 className="text-sm font-semibold text-white font-sans">Awaiting Director Input</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        Formulate cinematic video scripts and click generate to segment your dialogue into 5 beautifully orchestrated sequential scenes.
                      </p>
                    </div>
                  )}

                  {/* Loading Screen */}
                  {isVideoPromptLoading && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center h-full min-h-[450px] flex flex-col justify-center items-center space-y-5 animate-fade-in">
                      <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin" />
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white font-mono uppercase tracking-widest">SEQUENCING STORIES & CAMERA SCHEMES</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed animate-pulse">
                          Generating optimized instructions for Google Veo, Kling AI, and Runway Gen-3, including camera moves, lighting ratios, voiceover timing, and sound foley...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {videoPromptError && (
                    <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-8 text-center flex flex-col justify-center items-center space-y-3">
                      <AlertCircle className="w-10 h-10 text-rose-400" />
                      <h4 className="text-sm font-bold text-rose-400 font-mono">DIRECTOR CONSOLE EXCEPTION</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {videoPromptError}
                      </p>
                      <button 
                        onClick={runVideoPromptBuilder}
                        className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-bold hover:bg-rose-500/20 transition-all cursor-pointer"
                      >
                        Retry Prompts
                      </button>
                    </div>
                  )}

                  {/* Results Output Console */}
                  {videoPromptResult && (
                    <div className="space-y-6 animate-fade-in text-left">
                      
                      {/* Active Video Engine Toggles */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-4 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-wider block">Target Generation Engine</span>
                          <span className="text-xs font-bold text-white font-sans">Synchronized 5-Scene Storyboard</span>
                        </div>

                        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900">
                          {[
                            { id: 'veo', label: 'Google Veo' },
                            { id: 'kling', label: 'Kling AI' },
                            { id: 'runway', label: 'Runway Gen-3' }
                          ].map((platform) => (
                            <button
                              key={platform.id}
                              onClick={() => setActiveVideoPlatformTab(platform.id as any)}
                              className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                                activeVideoPlatformTab === platform.id 
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow' 
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {platform.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Displaying the 5 sequential scenes */}
                      <div className="space-y-6">
                        {((activeVideoPlatformTab === 'veo' ? videoPromptResult.veoPrompts :
                           activeVideoPlatformTab === 'kling' ? videoPromptResult.klingPrompts :
                           videoPromptResult.runwayPrompts) || []).map((scene: any, index: number) => {
                             const uniqueSceneId = `${activeVideoPlatformTab}_${scene.sceneNumber || index + 1}`;
                             return (
                              <div 
                                key={uniqueSceneId}
                                className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-5 hover:border-emerald-500/10 transition-all relative overflow-hidden text-left"
                              >
                                {/* Scene Badge Index Indicator */}
                                <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500/10 border-l border-b border-emerald-500/10 rounded-bl-xl text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                                  Scene {scene.sceneNumber || index + 1} / 5
                                </div>

                                {/* Scene Title */}
                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold font-mono text-emerald-400 uppercase tracking-widest block">
                                    Scene Segment Title
                                  </span>
                                  <h4 className="text-sm font-bold text-slate-100 font-sans pr-24">
                                    {scene.sceneTitle || `Segment ${index + 1}`}
                                  </h4>
                                </div>

                                {/* Cinematic Visual Description Prompt */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-wider">
                                      Visual Generator Text Prompt (Optimized Input)
                                    </span>

                                    {/* Platform Copy Action */}
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(scene.visualDescription);
                                        setCopiedVideoSceneId(uniqueSceneId);
                                        addToast('success', `Scene ${scene.sceneNumber || index + 1} prompt copied!`);
                                        setTimeout(() => setCopiedVideoSceneId(null), 2000);
                                      }}
                                      className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer animate-fade-in"
                                    >
                                      {copiedVideoSceneId === uniqueSceneId ? (
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

                                  <div className="bg-[#070b14] p-4 border border-slate-950 rounded-xl select-all">
                                    <p className="text-xs font-mono text-slate-300 leading-relaxed font-light">
                                      {scene.visualDescription}
                                    </p>
                                  </div>
                                </div>

                                {/* Directorial Breakdown Parameters Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  
                                  {/* Camera Movements */}
                                  <div className="bg-[#070b14]/50 border border-slate-900/60 rounded-xl p-3.5 space-y-1.5 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                                      <Camera className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">Camera Mechanics</span>
                                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{scene.cameraMovements}</p>
                                    </div>
                                  </div>

                                  {/* Lighting Setup */}
                                  <div className="bg-[#070b14]/50 border border-slate-900/60 rounded-xl p-3.5 space-y-1.5 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                                      <Sun className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">Lighting Atmosphere</span>
                                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{scene.lighting}</p>
                                    </div>
                                  </div>

                                  {/* Transitions */}
                                  <div className="bg-[#070b14]/50 border border-slate-900/60 rounded-xl p-3.5 space-y-1.5 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                                      <Film className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">Scenic Transition</span>
                                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{scene.transitions}</p>
                                    </div>
                                  </div>

                                  {/* Voiceover timing */}
                                  <div className="bg-[#070b14]/50 border border-slate-900/60 rounded-xl p-3.5 space-y-1.5 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                                      <Mic className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">Voiceover Instruction</span>
                                      <p className="text-xs text-slate-300 leading-relaxed font-sans italic">{scene.voiceoverInstructions}</p>
                                    </div>
                                  </div>

                                  {/* Sound Design */}
                                  <div className="bg-[#070b14]/50 border border-slate-900/60 rounded-xl p-3.5 space-y-1.5 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                                      <Volume2 className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">Sound & FX Cues</span>
                                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{scene.soundDesign}</p>
                                    </div>
                                  </div>

                                  {/* B-Roll Directions */}
                                  <div className="bg-[#070b14]/50 border border-slate-900/60 rounded-xl p-3.5 space-y-1.5 flex items-start gap-2.5">
                                    <div className="p-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                                      <Video className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">B-Roll Cutaways</span>
                                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{scene.bRollDirections}</p>
                                    </div>
                                  </div>

                                </div>
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
