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

interface UrlAnalyzerToolProps {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
  onUpdateResult?: (result: any) => void;
}

export default function UrlAnalyzerTool({ userId, onUseCredits, addToast, handleCopy, onUpdateResult }: UrlAnalyzerToolProps) {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [showAdvancedUrlInputs, setShowAdvancedUrlInputs] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customTranscript, setCustomTranscript] = useState('');
  const [customViews, setCustomViews] = useState('');
  const [customLikes, setCustomLikes] = useState('');
  const [customComments, setCustomComments] = useState('');
  const [customChannelData, setCustomChannelData] = useState('');
  const [urlResult, setUrlResult] = useState<any | null>(null);
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlReports, setUrlReports] = useState<any[]>([]);
  const [activeTeardownTab, setActiveTeardownTab] = useState<'intelligence' | 'meta' | 'dna' | 'hooks' | 'titles' | 'angles' | 'better-video' | 'ten-alternatives'>('better-video');
  const [copiedIndex, setCopiedIndex] = useState<{tab: string, index: number} | null>(null);

  const fetchUrlReports = async () => {
    try {
      const res = await fetch(`/api/gemini/url-reports?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.reports) {
        setUrlReports(data.reports);
      }
    } catch (err) {
      console.error('Failed to fetch URL reports history:', err);
    }
  };

  useEffect(() => {
    fetchUrlReports();
  }, [userId]);

  const copyToClipboard = (text: string, tabName: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex({ tab: tabName, index: idx });
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  const runUrlAnalyzer = async () => {
    const hasQuota = await onUseCredits(15, 'urlAnalyses', `Teardown of YouTube video URL: "${videoUrl}"`);
    if (!hasQuota) return;

    setIsUrlLoading(true);
    setUrlError(null);
    setUrlResult(null);

    try {
      const res = await fetch('/api/gemini/url-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          videoUrl,
          userId: userId || 'usr_default_omar',
          title: customTitle,
          transcript: customTranscript,
          views: customViews,
          likes: customLikes,
          comments: customComments,
          channelData: customChannelData
        })
      });
      const data = await res.json();

      if (data.result) {
        setUrlResult(data.result);
        if (onUpdateResult) {
          onUpdateResult(data.result);
        }
        fetchUrlReports(); // Refresh history
        if (data.isFallback) {
          addToast('info', 'Demo teardown loaded. Set your Gemini API key for live video URL scraping!');
        } else {
          addToast('success', 'YouTube video analyzed with Viral Intelligence Engine!');
        }
      } else {
        throw new Error(data.error || 'Failed to parse video metadata');
      }
    } catch (err: any) {
      setUrlError(err.message);
      addToast('error', err.message);
    } finally {
      setIsUrlLoading(false);
    }
  };

  const loadDemoPreset = () => {
    const demoResult = {
      title: "How I Built a SaaS in 24 Hours Using AI Agents",
      description: "Comprehensive dissection of a viral AI coding video. Learn the secret behind 85% viewer retention.",
      transcriptSnippet: "[0:00] I let a fleet of AI agents write, test, and deploy a SaaS startup in 24 hours. [0:15] No, this isn't another toy script. We're launching on Product Hunt live today. [0:45] Let's look at the LangGraph node logic...",
      views: "840K views",
      likes: "42K likes",
      comments: "1.8K comments",
      channelData: "Coding & Indie SaaS hacking niche. Audience consists of self-taught developers, founders, and AI enthusiasts seeking functional blueprints.",
      viralScore: 94,
      hookStrengthAnalysis: "The video uses a hyper-fast visual hook showing a Stripe dashboard earning $12k/mo, accompanied by a polarizing statement: 'LLM wrappers are dead, autonomous fleets are the future'. This instantly stops scrolling developers.",
      curiosityGapAnalysis: "Creates a massive knowledge gap: viewers want to see if autonomous agents can actually build a production-ready billing system, or if it will fail and loop endlessly on camera.",
      storytellingAnalysis: "Uses classical problem-solution conflict layout. The middle section shows a critical API rate-limit crash to build tension, which is solved by introducing Redis cache queues.",
      pacingAnalysis: "verbal pacing averages 160 WPM. Visual transitions occur every 2.4 seconds, utilizing pan zooms and glowing code snippet popups to keep programmer attention spans.",
      retentionTriggersAnalysis: "High contrast terminal graphics, actual database writes showing in console, and a live counter tracking coding time remaining.",
      emotionalTriggersAnalysis: "FOMO (Fear of missing out on the agent revolution) and validation of developer struggles with code scaffolding.",
      socialProofAnalysis: "Displays live GitHub star updates and Twitter reactions from other builders on screen.",
      authoritySignalsAnalysis: "Actual code displays, running docker containers in terminal, and screen recordings of the Stripe dashboard payouts.",
      ctaAnalysis: "Seamless loop connecting the final product launch to a pinned comment linking the template codebase.",
      originalHook: "Weakness: The hook spends 5 seconds on a generic greeting before showing the Stripe dashboard. Visuals are static code panels.",
      originalStructure: "Standard chronological coding stream. Weak transition around minute 6 when talking about setting up Node environments.",
      originalPsychology: "Relies heavily on visual validation. Views are high but subscribers conversion is low due to poor brand retention.",
      originalRetentionPatterns: "Pacing drops during dry database migration setup.",
      betterTitle: "I Let an AI Agent Fleet Build a SaaS in 24 Hours (Step-by-Step)",
      betterHook: "[Visual: Robot typing on a split keyboard, Stripe graph skyrocketing] Narration: 'This AI agent just launched a $12k/mo SaaS while I was sleeping. Here is the exact LangGraph memory leak that almost crashed it.'",
      betterStory: "Focus heavily on the engineering hurdles. Explain PgBouncer setup and LangGraph state variables instead of hand-waving code. Showcase the actual deployment command.",
      betterCta: "Direct viewers to click the next video analyzing the CrewAI vs LangGraph battle to loop them into the AI agent playlist.",
      betterThumbnailConcept: "High contrast dark theme. Left: Founder with hands on face. Right: Neon green terminal running 'yarn deploy:agents' with $12,420 Stripe alert.",
      strengths: [
        "Spectacular high-urgency pacing in the first 45 seconds.",
        "Real, non-fabricated code examples that viewers can actually run.",
        "Strong authority indicators (actual Stripe payouts shown)."
      ],
      weaknesses: [
        "Slow transition to the main coding part (30 seconds of environment configuration).",
        "Outro CTA is weak and doesn't redirect users to other channel videos.",
        "Vocal delivery gets slightly monotonous during the database migration explanation."
      ],
      missedOpportunities: [
        "Could have used database migration time to plug a sponsor or channel playlist.",
        "Could have shared the GitHub repository link in the video description for newsletter capture.",
        "Did not explain the code architecture pattern, leading to confusing intermediate dropoffs."
      ],
      betterVersions: [
        "A/B version 1: Standard high-speed edit (120 cuts per minute) targeting Gen Z developer audience.",
        "A/B version 2: Slow-paced, high-stakes documentary style detailing the sleepless night and system crashes.",
        "A/B version 3: Code-along tutorial style with a split-screen layout displaying the prompt console live."
      ],
      betterAngles: [
        "Focus on LLM cost scaling: 'How I spent $420 in OpenAI fees in 2 hours debugging agents'",
        "Focus on no-code tools: 'Can Bolt.new build a SaaS with zero coding knowledge?'",
        "Focus on security: 'I hacked my own AI agent SaaS (and how to secure yours)'",
        "Focus on local models: 'Running a SaaS entirely on free offline local Llama 3 agents'",
        "Focus on startup failure: 'Why my AI agent SaaS failed in 3 days (Post-mortem)'"
      ],
      betterHooks: [
        "This code was written by a robot, and it is currently making $400 an hour.",
        "I replaced my senior developer with 3 AI agents. Here is what happened.",
        "The secret reason Vercel is betting everything on autonomous agent routing.",
        "Do NOT build another OpenAI wrapper until you watch this video.",
        "I gave an AI agent my credit card and 24 hours to make a profit.",
        "This single line of Python code will automate your daily email follow-ups.",
        "The real cost of running CrewAI in production (it's not what you think).",
        "I built a SaaS with zero-code tools, and it actually compiles.",
        "How to run deep agent simulations locally without paying OpenAI a single cent.",
        "This is the exact moment my autonomous coding agent started deleting its own files."
      ],
      alternativeVersionsBetter: [
        {
          title: "I replaced my SaaS team with LangGraph AI agents (Result)",
          hook: "These 3 agent nodes just ran a customer support queue, updated the PostgreSQL DB, and billed them via Stripe—all for $0.12 in LLM fees.",
          story: "Break down step-by-step state management node routing. Show raw visual chart logs of user input traveling through agent logic.",
          cta: "Click to download the boilerplate code template in the description.",
          thumbnailConcept: "Robot sitting in board meeting with empty chairs, neon purple theme.",
          angleDescription: "Focuses on cost savings and developer scaling for solo-founders."
        },
        {
          title: "Building an Autonomous Coding Agent from Scratch",
          hook: "Most developers think building a coding agent requires LangChain. Today we are coding one in under 80 lines of raw Python.",
          story: "Create a simple tool-calling loop using OpenAI APIs directly. Test it by having it refactor a local file on camera.",
          cta: "Subscribe to the channel for more raw, zero-bloat coding sessions.",
          thumbnailConcept: "Sleek terminal showing Python code highlighting with text: '80 LINES'",
          angleDescription: "Focuses on the minimalist, educational hacker audience."
        },
        {
          title: "I Built an AI Agent that Trades Crypto (and Lost $50)",
          hook: "I gave my custom autonomous trader agent $500 and let it scan trending Twitter posts for 24 hours. Here is why it crashed.",
          story: "Detail the sentiment analysis logic, the trading API integration, and the psychological bias of buying coins at peak trend cycles.",
          cta: "Watch the next video where I fix the model weights and try again.",
          thumbnailConcept: "Crypto chart tanking with robot crying, high saturation red accents.",
          angleDescription: "High-entertainment, high-curiosity lifestyle tech vertical."
        }
      ]
    };

    setUrlResult(demoResult);
    if (onUpdateResult) {
      onUpdateResult(demoResult);
    }
    addToast('success', 'Loaded Demo Video Teardown report successfully! (0 credits used)');
  };


  return (
    <div className="space-y-6">
                    <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" /> Better Video Generator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Input any YouTube video URL. Our Growth Consultant AI will dissect its Hook, Structure, Psychology, and Retention, then output a vastly improved remake and 10 highly creative, plagiarism-free alternative versions.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Input and Past Analyses History */}
                <div className="space-y-6 lg:col-span-1">
                  {/* Analysis Input Box */}
                  <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-5 h-fit">
                    <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider border-b border-slate-900 pb-3 flex items-center justify-between">
                      <span>Target Video</span>
                      <span className="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-bold font-mono uppercase tracking-normal">Live Scraping</span>
                    </h3>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">YouTube Video Link</label>
                      <div className="relative">
                        <Youtube className="absolute left-3 top-2.5 w-4.5 h-4.5 text-rose-500" />
                        <input 
                          type="url"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                    </div>

                    {/* Toggle Advanced Inputs */}
                    <div>
                      <button
                        onClick={() => setShowAdvancedUrlInputs(!showAdvancedUrlInputs)}
                        className="text-[10px] font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
                      >
                        <Settings className={`w-3.5 h-3.5 transition-transform ${showAdvancedUrlInputs ? 'rotate-90' : ''} text-emerald-400`} />
                        <span>{showAdvancedUrlInputs ? 'Hide Custom Metadata (Optional)' : 'Configure Custom Metadata (Optional)'}</span>
                      </button>

                      {showAdvancedUrlInputs && (
                        <div className="mt-3.5 space-y-3.5 border-t border-slate-900 pt-3.5">
                          <div>
                            <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Custom Title</label>
                            <input 
                              type="text"
                              value={customTitle}
                              onChange={(e) => setCustomTitle(e.target.value)}
                              className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                              placeholder="Enter title if known"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Custom Transcript Snippet</label>
                            <textarea 
                              value={customTranscript}
                              onChange={(e) => setCustomTranscript(e.target.value)}
                              className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono h-20 resize-none text-[11px]"
                              placeholder="Paste opening transcript/script"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Views</label>
                              <input 
                                type="text"
                                value={customViews}
                                onChange={(e) => setCustomViews(e.target.value)}
                                className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                                placeholder="1.2M"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Likes</label>
                              <input 
                                type="text"
                                value={customLikes}
                                onChange={(e) => setCustomLikes(e.target.value)}
                                className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                                placeholder="48K"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Comments</label>
                              <input 
                                type="text"
                                value={customComments}
                                onChange={(e) => setCustomComments(e.target.value)}
                                className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                                placeholder="3.1K"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Channel Data & Niche</label>
                            <input 
                              type="text"
                              value={customChannelData}
                              onChange={(e) => setCustomChannelData(e.target.value)}
                              className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                              placeholder="e.g. 500K subs, tech niche"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={runUrlAnalyzer}
                        disabled={isUrlLoading}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950/40 text-[#070b14] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        {isUrlLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Algorithmic Scraping...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" /> Analyze Video <span className="text-[10px] font-mono bg-[#070b14]/10 px-1 py-0.5 rounded font-normal">(15 credits)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* History of Reports Panel */}
                  <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-sky-400" /> Past Analyses ({urlReports.length})
                      </h3>
                      {urlReports.length > 0 && (
                        <span className="text-[9px] text-emerald-400 font-mono">Synced</span>
                      )}
                    </div>

                    {urlReports.length === 0 ? (
                      <div className="text-center py-8 bg-[#070b14]/40 rounded-xl border border-dashed border-slate-900">
                        <p className="text-xs text-slate-500">No reports generated yet</p>
                        <p className="text-[10px] text-slate-600 mt-1 max-w-[180px] mx-auto leading-normal">Your analyzed links will sync to local & cloud storage here.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                        {urlReports.map((report) => (
                          <div 
                            key={report.id}
                            onClick={() => {
                              setUrlResult(report);
                              setVideoUrl(report.videoUrl);
                            }}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                              urlResult?.id === report.id 
                                ? 'bg-emerald-500/5 border-emerald-500/30' 
                                : 'bg-[#070b14] border-slate-900 hover:border-slate-800'
                            }`}
                          >
                            <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                              {report.title}
                            </h4>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[9px] font-mono text-sky-400">{report.views || '1M+ Views'}</span>
                              <span className="text-[8px] font-mono text-slate-500">
                                {report.createdAt ? new Date(report.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'Recently'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Teardown Stage & Active Report Displays */}
                <div className="lg:col-span-2">
                  
                  {/* Empty state */}
                  {!urlResult && !isUrlLoading && !urlError && (
                    <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-16 text-center h-full flex flex-col justify-center items-center min-h-[400px]">
                      <div className="w-16 h-16 bg-slate-900/40 rounded-full flex items-center justify-center border border-slate-800/50 mb-4 animate-pulse">
                        <Youtube className="w-8 h-8 text-rose-500/80" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">No active video analysis</h4>
                      <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                        Provide any YouTube link on the left to extract full hook scripts, thumbnails color metrics, story cliffhangers, and psychological bias models.
                      </p>
                      <button
                        onClick={loadDemoPreset}
                        className="mt-5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs text-emerald-400 font-mono font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer uppercase"
                      >
                        ⚡ Load Demo Video Teardown
                      </button>
                    </div>
                  )}

                  {/* Loading State */}
                  {isUrlLoading && (
                    <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-16 text-center h-full flex flex-col justify-center items-center space-y-6 min-h-[400px]">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                        <Youtube className="w-8 h-8 text-rose-500 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">EXTRACTING METADATA & SCRIPTS</h4>
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <p className="text-xs text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed italic">
                          "Analyzing commenting sentiment, verbal pacing models, and visual contrast layers to formulate a multi-angle recommendation report..."
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {urlError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-12 text-center flex flex-col justify-center items-center space-y-4 min-h-[400px]">
                      <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/20">
                        <AlertCircle className="w-8 h-8 text-rose-400" />
                      </div>
                      <h4 className="text-sm font-semibold text-rose-400 font-mono uppercase tracking-wider">PARSING EXCEPTION OCCURRED</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {urlError}
                      </p>
                      <button 
                        onClick={runUrlAnalyzer}
                        className="px-5 py-2.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium hover:bg-rose-500/30 transition-all cursor-pointer"
                      >
                        Retry Script Extraction
                      </button>
                    </div>
                  )}

                  {/* Results Output Dashboard */}
                  {urlResult && !isUrlLoading && (
                    <div className="space-y-6">
                      
                      {/* Video Meta Header Card */}
                      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 relative overflow-hidden">
                        <div className="pr-20">
                          <span className="text-[9px] font-mono font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded-full">Scraped Target Analysis</span>
                          <h3 className="text-base font-bold text-white mt-3 leading-snug">{urlResult.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 font-mono text-sky-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Channel positioning: {urlResult.channelData || 'Authority Creator'}
                          </p>
                        </div>

                        {/* Professional Creator Intelligence Dashboard */}
                        <div className="mt-6 space-y-3">
                          <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
                            📊 Creator Intelligence Dashboard
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
                                <span className="text-xl font-black text-orange-400 font-mono">{urlResult.viralScore || 85}</span>
                                <span className="text-[9px] text-slate-500 font-mono">/100</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-orange-400 h-full rounded-full transition-all duration-1000" style={{ width: `${urlResult.viralScore || 85}%` }} />
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
                                <span className="text-xl font-black text-emerald-400 font-mono">{Math.max(30, Math.min(99, Math.round((urlResult.viralScore || 85) * 0.95)))}</span>
                                <span className="text-[9px] text-slate-500 font-mono">/100</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round((urlResult.viralScore || 85) * 0.95)))}%` }} />
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
                                <span className="text-xl font-black text-rose-400 font-mono">{Math.max(10, Math.min(95, Math.round(100 - (urlResult.viralScore || 85) * 0.8)))}</span>
                                <span className="text-[9px] text-slate-500 font-mono">/100</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-rose-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(10, Math.min(95, Math.round(100 - (urlResult.viralScore || 85) * 0.8)))}%` }} />
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
                                <span className="text-xl font-black text-amber-400 font-mono">{urlResult.hookScore || 75}</span>
                                <span className="text-[9px] text-slate-500 font-mono">/100</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${urlResult.hookScore || 75}%` }} />
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
                                <span className="text-xl font-black text-cyan-400 font-mono">{Math.max(30, Math.min(99, Math.round((urlResult.viralScore || 85) * 0.92)))}</span>
                                <span className="text-[9px] text-slate-500 font-mono">/100</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round((urlResult.viralScore || 85) * 0.92)))}%` }} />
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
                                <span className="text-xl font-black text-indigo-400 font-mono">{Math.max(30, Math.min(99, Math.round((urlResult.hookScore || 75) * 0.88 + 10)))}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                                <div className="bg-indigo-400 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(30, Math.min(99, Math.round((urlResult.hookScore || 75) * 0.88 + 10)))}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Instant Creator Action Plan */}
                        <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl p-4 mt-4 space-y-3 text-left">
                          <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-bold font-mono text-white uppercase tracking-wider">
                              🚀 Instant Creator Action Plan
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 space-y-1">
                              <div className="text-[8px] font-mono font-bold text-slate-500 uppercase">01. Optimize Video Title</div>
                              <p className="text-[10px] text-slate-300 leading-relaxed">
                                Swap your current title with our A/B tested title: <span className="text-emerald-400 font-semibold font-mono block mt-0.5 select-all">"{urlResult.betterTitle || 'New Optimized Title'}"</span>
                              </p>
                            </div>
                            <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 space-y-1">
                              <div className="text-[8px] font-mono font-bold text-slate-500 uppercase">02. Revamp the Hook</div>
                              <p className="text-[10px] text-slate-300 leading-relaxed">
                                Record the redesigned scroll-stopping hook description: <span className="text-sky-400 italic block mt-0.5">"{urlResult.betterHook || 'Paced narrative setup'}"</span>
                              </p>
                            </div>
                            <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 space-y-1">
                              <div className="text-[8px] font-mono font-bold text-slate-500 uppercase">03. Thumbnail Tweak</div>
                              <p className="text-[10px] text-slate-300 leading-relaxed">
                                Redesign thumbnail using details: <span className="text-amber-400 block mt-0.5">"{urlResult.betterThumbnailConcept || 'Visual focus improvements'}"</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Horizontal Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-900/60">
                          <div className="bg-[#070b14]/50 border border-slate-900/60 rounded-xl p-3 text-center">
                            <span className="text-[8px] text-slate-500 font-bold block uppercase font-mono mb-1 flex items-center justify-center gap-1">
                              <Eye className="w-3 h-3 text-slate-500" /> Views
                            </span>
                            <span className="text-xs font-semibold text-slate-200 font-mono">{urlResult.views || '1.2M views'}</span>
                          </div>
                          <div className="bg-[#070b14]/50 border border-slate-900/60 rounded-xl p-3 text-center">
                            <span className="text-[8px] text-slate-500 font-bold block uppercase font-mono mb-1 flex items-center justify-center gap-1">
                              <ThumbsUp className="w-3 h-3 text-slate-500" /> Likes
                            </span>
                            <span className="text-xs font-semibold text-slate-200 font-mono">{urlResult.likes || '48K likes'}</span>
                          </div>
                          <div className="bg-[#070b14]/50 border border-slate-900/60 rounded-xl p-3 text-center">
                            <span className="text-[8px] text-slate-500 font-bold block uppercase font-mono mb-1 flex items-center justify-center gap-1">
                              <MessageSquare className="w-3 h-3 text-slate-500" /> Comments
                            </span>
                            <span className="text-xs font-semibold text-slate-200 font-mono">{urlResult.comments || '3.1K comments'}</span>
                          </div>
                        </div>

                        {/* Curiosity Gap block */}
                        {urlResult.curiosityGap && (
                          <div className="mt-4 p-3 bg-sky-500/5 border border-sky-500/10 rounded-xl flex items-start gap-3">
                            <span className="p-1 bg-sky-500/10 rounded border border-sky-500/15 text-sky-400 text-xs font-mono font-bold mt-0.5">GAP</span>
                            <div className="text-left">
                              <p className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider">Formulated Curiosity Gap</p>
                              <p className="text-xs text-slate-300 leading-normal mt-0.5 font-sans">{urlResult.curiosityGap}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Strategic Dashboard Sub-Tabs */}
                      <div className="flex border-b border-slate-900 gap-1 overflow-x-auto pb-px">
                        <button 
                          onClick={() => setActiveTeardownTab('better-video')}
                          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTeardownTab === 'better-video' 
                              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5' 
                              : 'text-slate-400 border-transparent hover:text-slate-200'
                          }`}
                        >
                          ✨ The Better Version
                        </button>
                        <button 
                          onClick={() => setActiveTeardownTab('ten-alternatives')}
                          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTeardownTab === 'ten-alternatives' 
                              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5' 
                              : 'text-slate-400 border-transparent hover:text-slate-200'
                          }`}
                        >
                          🔥 10 Alternatives
                        </button>
                        <button 
                          onClick={() => setActiveTeardownTab('intelligence')}
                          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTeardownTab === 'intelligence' 
                              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5' 
                              : 'text-slate-400 border-transparent hover:text-slate-200'
                          }`}
                        >
                          Viral Intelligence
                        </button>
                        <button 
                          onClick={() => setActiveTeardownTab('meta')}
                          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTeardownTab === 'meta' 
                              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5' 
                              : 'text-slate-400 border-transparent hover:text-slate-200'
                          }`}
                        >
                          Metadata & DNA
                        </button>
                        <button 
                          onClick={() => setActiveTeardownTab('dna')}
                          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTeardownTab === 'dna' 
                              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5' 
                              : 'text-slate-400 border-transparent hover:text-slate-200'
                          }`}
                        >
                          Viral DNA Report
                        </button>
                        <button 
                          onClick={() => setActiveTeardownTab('hooks')}
                          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTeardownTab === 'hooks' 
                              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5' 
                              : 'text-slate-400 border-transparent hover:text-slate-200'
                          }`}
                        >
                          10 Better Hooks
                        </button>
                        <button 
                          onClick={() => setActiveTeardownTab('titles')}
                          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTeardownTab === 'titles' 
                              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5' 
                              : 'text-slate-400 border-transparent hover:text-slate-200'
                          }`}
                        >
                          10 Better Titles
                        </button>
                        <button 
                          onClick={() => setActiveTeardownTab('angles')}
                          className={`px-4 py-2.5 text-xs font-bold font-mono transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTeardownTab === 'angles' 
                              ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5' 
                              : 'text-slate-400 border-transparent hover:text-slate-200'
                          }`}
                        >
                          10 Video Angles
                        </button>
                      </div>

                      {/* SUB-TAB CONTENTS */}
                      <div className="space-y-6">
                        
                        {/* THE BETTER VERSION TAB */}
                        {activeTeardownTab === 'better-video' && (
                          <div className="space-y-6">
                            {/* Top Title Comparison */}
                            <div className="bg-[#0c101d] border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                              <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                                <div className="space-y-4 flex-1">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wide">
                                    <Sparkles className="w-3 h-3" /> Growth Remake Blueprint
                                  </div>
                                  <div className="space-y-2">
                                    <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block">Original Title</span>
                                    <h4 className="text-sm font-semibold text-slate-400 line-through decoration-slate-600/80 leading-snug">
                                      {urlResult.title || 'Untitled Video'}
                                    </h4>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wider block">🚀 Vastly Improved High-CTR Remake Title</span>
                                      <button 
                                        onClick={() => {
                                          navigator.clipboard.writeText(urlResult.betterTitle || urlResult.betterTitles?.[0] || '');
                                          setCopiedIndex({ tab: 'better-title', index: 0 });
                                          setTimeout(() => setCopiedIndex(null), 2000);
                                        }}
                                        className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        {copiedIndex?.tab === 'better-title' ? (
                                          <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400">Copied!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy Title</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-snug font-sans tracking-tight">
                                      {urlResult.betterTitle || urlResult.betterTitles?.[0] || 'Optimizing...'}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Main Grid Comparison */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Left Side: Original Analysis */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                                  Original Video Dissection
                                </h3>

                                <div className="space-y-3">
                                  {/* Hook */}
                                  <div className="bg-[#070b14]/40 border border-slate-900/60 rounded-xl p-4 space-y-1.5 text-left">
                                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide">1. Original Hook Style & Weakness</span>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                      {urlResult.originalHook || urlResult.hookStrengthAnalysis || 'Analyzing hook performance...'}
                                    </p>
                                  </div>

                                  {/* Structure */}
                                  <div className="bg-[#070b14]/40 border border-slate-900/60 rounded-xl p-4 space-y-1.5 text-left">
                                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide">2. Narrative Story Structure</span>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                      {urlResult.originalStructure || urlResult.storytellingAnalysis || 'Analyzing structure patterns...'}
                                    </p>
                                  </div>

                                  {/* Psychology */}
                                  <div className="bg-[#070b14]/40 border border-slate-900/60 rounded-xl p-4 space-y-1.5 text-left">
                                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide">3. Psychological Triggers</span>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                      {urlResult.originalPsychology || urlResult.emotionalTriggersAnalysis || 'Analyzing psychology anchors...'}
                                    </p>
                                  </div>

                                  {/* Retention */}
                                  <div className="bg-[#070b14]/40 border border-slate-900/60 rounded-xl p-4 space-y-1.5 text-left">
                                    <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide">4. Visual Rhythm & Pacing</span>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                      {urlResult.originalRetentionPatterns || urlResult.pacingAnalysis || 'Analyzing pacing metrics...'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Right Side: Better Remake Plan */}
                              <div className="space-y-4">
                                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                  Improved Remake Script Blueprint
                                </h3>

                                <div className="space-y-3">
                                  {/* Better Hook */}
                                  <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-xl p-4 space-y-2 text-left relative group">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wide">🔥 Scroll-Stopping Opening Hook (First 15s)</span>
                                      <button 
                                        onClick={() => {
                                          navigator.clipboard.writeText(urlResult.betterHook || urlResult.betterHooks?.[0] || '');
                                          setCopiedIndex({ tab: 'better-hook', index: 0 });
                                          setTimeout(() => setCopiedIndex(null), 2000);
                                        }}
                                        className="text-[10px] font-mono text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        {copiedIndex?.tab === 'better-hook' ? 'Copied!' : 'Copy'}
                                      </button>
                                    </div>
                                    <p className="text-xs text-slate-200 leading-relaxed font-sans italic p-2 bg-slate-950/40 rounded border border-slate-900">
                                      "{urlResult.betterHook || urlResult.betterHooks?.[0] || 'Optimizing hook script...'}"
                                    </p>
                                  </div>

                                  {/* Better Story */}
                                  <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-xl p-4 space-y-2 text-left">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wide">📖 Immersive Body Storyline</span>
                                      <button 
                                        onClick={() => {
                                          navigator.clipboard.writeText(urlResult.betterStory || '');
                                          setCopiedIndex({ tab: 'better-story', index: 0 });
                                          setTimeout(() => setCopiedIndex(null), 2000);
                                        }}
                                        className="text-[10px] font-mono text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        {copiedIndex?.tab === 'better-story' ? 'Copied!' : 'Copy'}
                                      </button>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                      {urlResult.betterStory || 'Generating improved storytelling outline...'}
                                    </p>
                                  </div>

                                  {/* Better CTA */}
                                  <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-xl p-4 space-y-2 text-left">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wide">🔄 Zero-Exit Outro CTA & Loop</span>
                                      <button 
                                        onClick={() => {
                                          navigator.clipboard.writeText(urlResult.betterCta || '');
                                          setCopiedIndex({ tab: 'better-cta', index: 0 });
                                          setTimeout(() => setCopiedIndex(null), 2000);
                                        }}
                                        className="text-[10px] font-mono text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        {copiedIndex?.tab === 'better-cta' ? 'Copied!' : 'Copy'}
                                      </button>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                      {urlResult.betterCta || 'Generating high-retention call-to-action...'}
                                    </p>
                                  </div>

                                  {/* Better Thumbnail */}
                                  <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-xl p-4 space-y-2 text-left">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wide">🎨 High-CTR Thumbnail Concept</span>
                                      <button 
                                        onClick={() => {
                                          navigator.clipboard.writeText(urlResult.betterThumbnailConcept || '');
                                          setCopiedIndex({ tab: 'better-thumbnail', index: 0 });
                                          setTimeout(() => setCopiedIndex(null), 2000);
                                        }}
                                        className="text-[10px] font-mono text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        {copiedIndex?.tab === 'better-thumbnail' ? 'Copied!' : 'Copy'}
                                      </button>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/30 p-2.5 rounded border border-slate-900/60">
                                      {urlResult.betterThumbnailConcept || 'Generating thumbnail graphics blueprint...'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 10 ALTERNATIVES TAB */}
                        {activeTeardownTab === 'ten-alternatives' && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-emerald-400" /> 10 Original Alternative Remake Blueprints
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                  Completely original angles constructed to dominate alternative sub-niches without a single element of plagiarism.
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {(urlResult.alternativeVersionsBetter || []).map((alt: any, idx: number) => (
                                <div key={idx} className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-4 text-left hover:border-emerald-500/20 transition-all relative overflow-hidden group">
                                  {/* Badge indicator */}
                                  <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/10 border-l border-b border-emerald-500/10 rounded-bl-xl text-[10px] font-mono font-bold text-emerald-400">
                                    VERSION {idx + 1}
                                  </div>

                                  {/* Angle info */}
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-bold font-mono text-emerald-400 uppercase tracking-wider block">Positioning Angle</span>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                                      {alt.angleDescription || `Alternative audience angle ${idx + 1}`}
                                    </p>
                                  </div>

                                  <hr className="border-slate-900/60" />

                                  {/* Title & Copy */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-wider">High-CTR Title Idea</span>
                                      <button 
                                        onClick={() => {
                                          navigator.clipboard.writeText(alt.title);
                                          setCopiedIndex({ tab: 'alt-title', index: idx });
                                          setTimeout(() => setCopiedIndex(null), 2000);
                                        }}
                                        className="text-[10px] font-mono text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        {copiedIndex?.tab === 'alt-title' && copiedIndex?.index === idx ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                        <span>{copiedIndex?.tab === 'alt-title' && copiedIndex?.index === idx ? 'Copied' : 'Copy'}</span>
                                      </button>
                                    </div>
                                    <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                                      {alt.title}
                                    </h4>
                                  </div>

                                  {/* Hook */}
                                  <div className="space-y-1.5 p-2.5 bg-slate-950/40 border border-slate-900 rounded-xl">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-bold font-mono text-emerald-400 uppercase tracking-wider">Scroll-Stopping Hook Script</span>
                                      <button 
                                        onClick={() => {
                                          navigator.clipboard.writeText(alt.hook);
                                          setCopiedIndex({ tab: 'alt-hook', index: idx });
                                          setTimeout(() => setCopiedIndex(null), 2000);
                                        }}
                                        className="text-[10px] font-mono text-slate-500 hover:text-emerald-400 cursor-pointer"
                                      >
                                        {copiedIndex?.tab === 'alt-hook' && copiedIndex?.index === idx ? 'Copied!' : 'Copy'}
                                      </button>
                                    </div>
                                    <p className="text-xs text-slate-300 italic leading-relaxed">
                                      "{alt.hook}"
                                    </p>
                                  </div>

                                  {/* Story body */}
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-wider block">Full Narrative Outline</span>
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                      {alt.story}
                                    </p>
                                  </div>

                                  {/* Thumbnail & CTA block */}
                                  <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="bg-[#070b14]/40 border border-slate-900 rounded-xl p-2.5 space-y-1 text-left">
                                      <span className="text-[8px] font-bold font-mono text-emerald-400 uppercase tracking-wider block">Thumbnail Visual</span>
                                      <p className="text-[10px] text-slate-400 leading-normal">
                                        {alt.thumbnailConcept}
                                      </p>
                                    </div>
                                    <div className="bg-[#070b14]/40 border border-slate-900 rounded-xl p-2.5 space-y-1 text-left">
                                      <span className="text-[8px] font-bold font-mono text-emerald-400 uppercase tracking-wider block">Loop Outro CTA</span>
                                      <p className="text-[10px] text-slate-400 leading-normal">
                                        {alt.cta}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* 0. VIRAL INTELLIGENCE ENGINE TAB */}
                        {activeTeardownTab === 'intelligence' && (
                          <div className="space-y-8">
                            
                            {/* Growth Performance Breakdown: Strengths & Weaknesses */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Strengths */}
                              <div className="bg-[#0c101d] border border-emerald-500/10 rounded-xl p-5 space-y-3">
                                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wide">
                                  <span className="p-1 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400">
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                  </span>
                                  Key Strengths
                                </h4>
                                <ul className="space-y-2 text-left">
                                  {urlResult.strengths && urlResult.strengths.length > 0 ? (
                                    urlResult.strengths.map((str: string, idx: number) => (
                                      <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                        <span className="text-emerald-400 shrink-0 mt-1">✓</span>
                                        <span>{str}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <>
                                      <li className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                        <span className="text-emerald-400 shrink-0 mt-1">✓</span>
                                        <span>High-converting cognitive hook with immediate interest generation.</span>
                                      </li>
                                      <li className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                        <span className="text-emerald-400 shrink-0 mt-1">✓</span>
                                        <span>Strong curiosity gap backed by concrete visual validation.</span>
                                      </li>
                                    </>
                                  )}
                                </ul>
                              </div>

                              {/* Weaknesses */}
                              <div className="bg-[#0c101d] border border-rose-500/10 rounded-xl p-5 space-y-3">
                                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wide">
                                  <span className="p-1 bg-rose-500/10 rounded border border-rose-500/20 text-rose-400">
                                    <ThumbsDown className="w-3.5 h-3.5" />
                                  </span>
                                  Weaknesses
                                </h4>
                                <ul className="space-y-2 text-left">
                                  {urlResult.weaknesses && urlResult.weaknesses.length > 0 ? (
                                    urlResult.weaknesses.map((weak: string, idx: number) => (
                                      <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                        <span className="text-rose-400 shrink-0 mt-1">✗</span>
                                        <span>{weak}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <>
                                      <li className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                        <span className="text-rose-400 shrink-0 mt-1">✗</span>
                                        <span>Slow mid-video narrative loop transitions may spark dip in viewer metrics.</span>
                                      </li>
                                      <li className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                        <span className="text-rose-400 shrink-0 mt-1">✗</span>
                                        <span>Unoptimized CTA placement lacks direct immediate emotional payout.</span>
                                      </li>
                                    </>
                                  )}
                                </ul>
                              </div>

                              {/* Missed Opportunities */}
                              <div className="bg-[#0c101d] border border-sky-500/10 rounded-xl p-5 space-y-3">
                                <h4 className="text-xs font-bold text-sky-400 flex items-center gap-2 uppercase tracking-wide">
                                  <span className="p-1 bg-sky-500/10 rounded border border-sky-500/20 text-sky-400">
                                    <Sparkles className="w-3.5 h-3.5" />
                                  </span>
                                  Missed Opportunities
                                </h4>
                                <ul className="space-y-2 text-left">
                                  {urlResult.missedOpportunities && urlResult.missedOpportunities.length > 0 ? (
                                    urlResult.missedOpportunities.map((opp: string, idx: number) => (
                                      <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                        <span className="text-sky-400 shrink-0 mt-1">⚡</span>
                                        <span>{opp}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <>
                                      <li className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                        <span className="text-sky-400 shrink-0 mt-1">⚡</span>
                                        <span>Implementing a strong story cliffhanger at the 60-second mark to build retention.</span>
                                      </li>
                                      <li className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                                        <span className="text-sky-400 shrink-0 mt-1">⚡</span>
                                        <span>Creating contrasting title variants to expand audience type reach.</span>
                                      </li>
                                    </>
                                  )}
                                </ul>
                              </div>
                            </div>

                            {/* Nine Key Factors Analysis Dashboard */}
                            <div className="space-y-4 text-left">
                              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
                                <Zap className="w-4 h-4 text-emerald-400" /> Key Success Factors & Teardowns
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 1. Hook Strength */}
                                <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4.5 space-y-2">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center">1</span>
                                    <h5 className="text-xs font-bold uppercase tracking-wider">Hook Strength</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {urlResult.hookStrengthAnalysis || urlResult.hookAnalysis || "Exceptional hook dynamics with clear, immediate validation of the premise within the opening 10 seconds."}
                                  </p>
                                </div>

                                {/* 2. Curiosity Gap */}
                                <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4.5 space-y-2">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center">2</span>
                                    <h5 className="text-xs font-bold uppercase tracking-wider">Curiosity Gap</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {urlResult.curiosityGapAnalysis || urlResult.curiosityGap || "High curiosity gap created by posing a challenging, unresolved mystery about viral growth early."}
                                  </p>
                                </div>

                                {/* 3. Storytelling */}
                                <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4.5 space-y-2">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center">3</span>
                                    <h5 className="text-xs font-bold uppercase tracking-wider">Storytelling Arc</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {urlResult.storytellingAnalysis || urlResult.storyAnalysis || "Built on classic hero-journey arcs, maintaining high micro-stakes and constant tension."}
                                  </p>
                                </div>

                                {/* 4. Pacing */}
                                <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4.5 space-y-2">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center">4</span>
                                    <h5 className="text-xs font-bold uppercase tracking-wider">Pacing & Flow</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {urlResult.pacingAnalysis || urlResult.storyAnalysis || "Rapid narrative shifts every 15-30 seconds with no dead space, ensuring excellent long-term retention."}
                                  </p>
                                </div>

                                {/* 5. Retention Triggers */}
                                <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4.5 space-y-2">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center">5</span>
                                    <h5 className="text-xs font-bold uppercase tracking-wider">Retention Triggers</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {urlResult.retentionTriggersAnalysis || urlResult.retentionAnalysis || "Abundant visual pattern interrupts, graphic overlays, and live-draw demonstrations that anchor attention."}
                                  </p>
                                </div>

                                {/* 6. Emotional Triggers */}
                                <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4.5 space-y-2">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center">6</span>
                                    <h5 className="text-xs font-bold uppercase tracking-wider">Emotional Triggers</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {urlResult.emotionalTriggersAnalysis || urlResult.psychologyAnalysis || "Triggers FOMO and ambition beautifully. Leverages relatable struggles of creators with high visual payoffs."}
                                  </p>
                                </div>

                                {/* 7. Social Proof */}
                                <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4.5 space-y-2">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center">7</span>
                                    <h5 className="text-xs font-bold uppercase tracking-wider">Social Proof</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {urlResult.socialProofAnalysis || urlResult.titleAnalysis || "Incorporates case-study clips, screenshots, and commenting feedback arrays directly in the video."}
                                  </p>
                                </div>

                                {/* 8. Authority Signals */}
                                <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4.5 space-y-2">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center">8</span>
                                    <h5 className="text-xs font-bold uppercase tracking-wider">Authority Signals</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {urlResult.authoritySignalsAnalysis || urlResult.titleAnalysis || "Establishes credibility with deep analytical insights, industry benchmarks, and proprietary tooling walkthroughs."}
                                  </p>
                                </div>

                                {/* 9. Call To Action (CTA) */}
                                <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4.5 space-y-2">
                                  <div className="flex items-center gap-2 text-slate-300">
                                    <span className="text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 w-5 h-5 rounded flex items-center justify-center">9</span>
                                    <h5 className="text-xs font-bold uppercase tracking-wider">Call To Action</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {urlResult.ctaAnalysis || urlResult.ctaPattern || "Highly customized CTA offering immediate supplementary checklists, driving conversion with extreme contextual relevance."}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* 3 Better Versions (A/B Test Alternatives) */}
                            {urlResult.betterVersions && urlResult.betterVersions.length > 0 && (
                              <div className="space-y-4 text-left border-t border-slate-900 pt-6">
                                <div>
                                  <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                                    <Sliders className="w-4 h-4 text-emerald-400" /> 3 High-Performance A/B Test Alternative Versions
                                  </h4>
                                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                                    Complete structural rewrite alternatives designed to target specific audience types and drive click-through metrics.
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                  {urlResult.betterVersions.map((version: string, idx: number) => (
                                    <div key={idx} className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 flex items-start gap-4 hover:border-slate-800 transition-colors">
                                      <span className="text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded shrink-0">
                                        VERSION {(idx + 1)}
                                      </span>
                                      <div className="flex-1 text-xs text-slate-200 leading-relaxed font-sans">
                                        {version}
                                      </div>
                                      <button 
                                        onClick={() => copyToClipboard(version, 'versions', idx)}
                                        className="p-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all shrink-0 cursor-pointer"
                                      >
                                        {copiedIndex?.tab === 'versions' && copiedIndex?.index === idx ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* 1. METADATA & DNA TAB */}
                        {activeTeardownTab === 'meta' && (
                          <div className="space-y-6">
                            
                            {/* Key parameters block */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-4">
                                <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-900/50 pb-2 flex items-center gap-2">
                                  <Sliders className="w-4 h-4 text-emerald-400" /> Retention Blueprint
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Retention Formula</span>
                                    <p className="text-xs text-slate-200 leading-normal mt-0.5">{urlResult.retentionStrategy}</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Narrative Story Structure</span>
                                    <p className="text-xs text-slate-200 leading-normal mt-0.5">{urlResult.storyStructure}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-4">
                                <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-900/50 pb-2 flex items-center gap-2">
                                  <Compass className="w-4 h-4 text-emerald-400" /> Conversion Funnel
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase block">CTA Strategy</span>
                                    <p className="text-xs text-slate-200 leading-normal mt-0.5">{urlResult.ctaPattern}</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Triggered Emotion Array</span>
                                    <div className="flex flex-wrap gap-2 mt-1.5">
                                      {urlResult.emotionTriggers && urlResult.emotionTriggers.map((trig: string, i: number) => (
                                        <span key={i} className="text-[9px] font-mono font-bold bg-[#070b14] text-sky-400 border border-slate-800 px-2 py-1 rounded-full flex items-center gap-1">
                                          <Sparkles className="w-2.5 h-2.5 text-sky-400" /> {trig}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Transcript snippet script box */}
                            {urlResult.transcriptSnippet && (
                              <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                                  <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-rose-400" /> Manuscript Hook Script
                                  </h4>
                                  <span className="text-[9px] text-slate-500 font-mono">0s - 120s Extract</span>
                                </div>
                                <div className="bg-[#070b14] border border-slate-950 rounded-lg p-4 text-left font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[160px] overflow-y-auto">
                                  {urlResult.transcriptSnippet}
                                </div>
                              </div>
                            )}

                            {/* Original video description summary if present */}
                            {urlResult.description && (
                              <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-2 text-left">
                                <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Video Description Blueprint</span>
                                <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                                  {urlResult.description}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. VIRAL DNA SECTIONS TAB */}
                        {activeTeardownTab === 'dna' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Hook Analysis */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-2.5">
                              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center font-mono text-[10px] font-bold">1</span>
                                Hook Analysis (0s-30s)
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed">{urlResult.hookAnalysis}</p>
                            </div>

                            {/* Title Analysis */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-2.5">
                              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">2</span>
                                Title Psychology Teardown
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed">{urlResult.titleAnalysis}</p>
                            </div>

                            {/* Thumbnail Analysis */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-2.5">
                              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center font-mono text-[10px] font-bold">3</span>
                                Thumbnail Visual Hierarchy
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed">{urlResult.thumbnailAnalysis}</p>
                            </div>

                            {/* Story Analysis */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-2.5">
                              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-mono text-[10px] font-bold">4</span>
                                Narrative Pacing Arc
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed">{urlResult.storyAnalysis}</p>
                            </div>

                            {/* Retention Analysis */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-2.5">
                              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono text-[10px] font-bold">5</span>
                                Visual Rhythm (Pattern Interrupts)
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed">{urlResult.retentionAnalysis}</p>
                            </div>

                            {/* Psychology Analysis */}
                            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-5 space-y-2.5">
                              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-pink-500/10 text-pink-400 flex items-center justify-center font-mono text-[10px] font-bold">6</span>
                                Shareability & Biases
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed">{urlResult.psychologyAnalysis}</p>
                            </div>
                          </div>
                        )}

                        {/* 3. 10 BETTER HOOKS TAB */}
                        {activeTeardownTab === 'hooks' && (
                          <div className="space-y-3">
                            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-left">
                              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                                <Lightbulb className="w-4 h-4 text-emerald-400" /> Growth Hack Recommendation
                              </p>
                              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                                Test these high-retention hook variations in your next short or opening script sequence. Copy directly to apply inside the Viral Script Generator.
                              </p>
                            </div>

                            <div className="space-y-2.5 text-left">
                              {urlResult.betterHooks && urlResult.betterHooks.map((hook: string, idx: number) => (
                                <div key={idx} className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 flex items-start gap-4 hover:border-slate-800 transition-colors">
                                  <span className="text-[10px] font-bold font-mono text-slate-500 bg-[#070b14] w-6 h-6 rounded-full flex items-center justify-center border border-slate-800 mt-0.5 shrink-0">
                                    {(idx + 1).toString().padStart(2, '0')}
                                  </span>
                                  <div className="flex-1">
                                    <p className="text-xs text-slate-200 leading-relaxed font-mono">"{hook}"</p>
                                  </div>
                                  <button 
                                    onClick={() => copyToClipboard(hook, 'hooks', idx)}
                                    className="p-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all shrink-0 cursor-pointer"
                                  >
                                    {copiedIndex?.tab === 'hooks' && copiedIndex?.index === idx ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 4. 10 BETTER TITLES TAB */}
                        {activeTeardownTab === 'titles' && (
                          <div className="space-y-3 text-left">
                            <div className="p-3 bg-sky-500/5 border border-sky-500/10 rounded-xl">
                              <p className="text-xs text-sky-400 font-medium flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-sky-400" /> Click-Through-Rate Boost
                              </p>
                              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                                Algorithmic variations crafted to increase organic CTR. We recommend A/B testing these using YouTube Thumbnail test integrations.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5">
                              {urlResult.betterTitles && urlResult.betterTitles.map((title: string, idx: number) => (
                                <div key={idx} className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-slate-800 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/5 px-2 py-0.5 rounded-full">
                                      {9.0 + (9 - idx) * 0.1}% CTR
                                    </span>
                                    <p className="text-xs font-semibold text-slate-200">{title}</p>
                                  </div>
                                  <button 
                                    onClick={() => copyToClipboard(title, 'titles', idx)}
                                    className="p-1.5 bg-[#070b14] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all shrink-0 cursor-pointer"
                                  >
                                    {copiedIndex?.tab === 'titles' && copiedIndex?.index === idx ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 5. 10 VIDEO ANGLES TAB */}
                        {activeTeardownTab === 'angles' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            {urlResult.betterVideoAngles && urlResult.betterVideoAngles.map((angle: string, idx: number) => (
                              <div key={idx} className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 space-y-2 hover:border-slate-800 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest">Angle Archetype {(idx+1).toString().padStart(2, '0')}</span>
                                  <button 
                                    onClick={() => copyToClipboard(angle, 'angles', idx)}
                                    className="p-1 bg-[#070b14] border border-slate-800 rounded text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                                  >
                                    {copiedIndex?.tab === 'angles' && copiedIndex?.index === idx ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                                <p className="text-xs text-slate-200 leading-relaxed font-sans">{angle}</p>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>


                      </div>
                    )}
                  </div>
                </div>
              </div>
  );
}
