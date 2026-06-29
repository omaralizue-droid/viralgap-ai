import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Video, 
  Layers, 
  Search, 
  Image as ImageIcon, 
  FileText, 
  Lightbulb, 
  Play, 
  Lock, 
  ArrowRight,
  Gauge,
  HelpCircle,
  Eye,
  Shuffle
} from 'lucide-react';

interface SEOToolConfig {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<any>;
  inputPlaceholder: string;
  inputLabel: string;
  ctaText: string;
  accentColor: string;
  features: string[];
}

const TOOLS_CONFIG: Record<string, SEOToolConfig> = {
  'youtube-idea-generator': {
    slug: 'youtube-idea-generator',
    title: 'AI YouTube Idea Generator',
    tagline: 'Infinite Viral Video Ideas & Tactical Angles',
    description: 'Supercharge your YouTube channel with our free AI-powered idea engine. Uncover high-retention video concepts, structured content hooks, and psychological angles designed to trigger algorithm recommendation feeds.',
    icon: Lightbulb,
    inputLabel: 'What topic or industry is your channel about?',
    inputPlaceholder: 'e.g., Solo Travel, AI Automation, Cooking on a Budget...',
    ctaText: 'Generate Viral Ideas',
    accentColor: 'from-amber-500 to-red-500',
    features: [
      'High-click-through title options',
      'Tactical opening hooks and angles',
      'Psychological reasons for viral potential',
      'Target audience segments identified'
    ]
  },
  'content-gap-finder': {
    slug: 'content-gap-finder',
    title: 'YouTube Content Gap Finder',
    tagline: 'Uncover High-Demand Unexplored Video Gaps',
    description: 'Find high-traffic, low-competition content gaps in your YouTube niche. Scan search trends, competitor weaknesses, and viewer feedback to build a content strategy that guarantees organic search dominance.',
    icon: Search,
    inputLabel: 'What is your core YouTube channel niche?',
    inputPlaceholder: 'e.g., Figma Tutorial, Mechanical Keyboards, Personal Finance...',
    ctaText: 'Find Underserved Gaps',
    accentColor: 'from-teal-500 to-emerald-500',
    features: [
      'Estimated search demand volume',
      'Competition scoring & analysis',
      'Competitor weakness analysis',
      'Actionable keywords & targeting'
    ]
  },
  'viral-video-analyzer': {
    slug: 'viral-video-analyzer',
    title: 'Viral Video Optimizer & Analyzer',
    tagline: 'Predict & Multiply Audience Retention & CTR',
    description: 'Deconstruct high-performing YouTube videos or draft ideas. Analyze pacing, hook structures, visual pattern interrupts, and audience retention curves to clone success on your own channel.',
    icon: Video,
    inputLabel: 'Enter a YouTube Video URL, Title, or Concept to Deconstruct',
    inputPlaceholder: 'e.g., https://youtube.com/watch?v=... or "How I Built a SaaS in 24 Hours"',
    ctaText: 'Analyze Concepts',
    accentColor: 'from-blue-500 to-indigo-500',
    features: [
      'Estimated retention score',
      'Hook strength rating (out of 10)',
      'Optimal visual pacing analysis',
      'Tactical pattern interrupts'
    ]
  },
  'thumbnail-generator': {
    slug: 'thumbnail-generator',
    title: 'AI YouTube Thumbnail Architect',
    tagline: 'Maximize Impression CTR & Viewer Curiosity',
    description: 'Build high-CTR thumbnail blueprints. Plan text overlays, visual composition grids, emotional color theories, and psychological curiosity loops that double your click-through rates.',
    icon: ImageIcon,
    inputLabel: 'What is the title of your next YouTube video?',
    inputPlaceholder: 'e.g., I Spent 100 Hours Coding a YouTube Tool. Here is What Happened...',
    ctaText: 'Generate Thumbnail Concepts',
    accentColor: 'from-purple-500 to-pink-500',
    features: [
      'Visual composition element layouts',
      'Optimal high-CTR text overlays',
      'Psychological emotional triggers',
      'Target click-through expectations'
    ]
  },
  'hook-generator': {
    slug: 'hook-generator',
    title: 'AI YouTube Retention Hook Generator',
    tagline: 'Explode Your First 5-Second Retention Metrics',
    description: 'Stop the scroll and retain viewers. Generate professional opening hooks using visual, auditory, and cognitive open loops tailored to lock down audience retention from the first frames.',
    icon: Layers,
    inputLabel: 'What is your video topic or core value proposition?',
    inputPlaceholder: 'e.g., Stop wasting money on real estate, 3 secret productivity hacks...',
    ctaText: 'Forge Scroll-Stopping Hooks',
    accentColor: 'from-rose-500 to-orange-500',
    features: [
      'Cognitive open-loop scripts',
      'Pattern interrupt visual cues',
      'Auditory sound effect cues',
      'Tailored hooks for short/long-form'
    ]
  },
  'script-generator': {
    slug: 'script-generator',
    title: 'AI YouTube Script Generator',
    tagline: 'Write High-Retention Video Script Blueprints',
    description: 'Structure engaging scripts optimized for YouTube recommendation loops. Generate intro hooks, content sections, pattern interrupts, and highly contextual conversion triggers.',
    icon: FileText,
    inputLabel: 'What topic should the video script focus on?',
    inputPlaceholder: 'e.g., Morning routine of a millionaire, How the Federal Reserve works...',
    ctaText: 'Structure High-Retention Script',
    accentColor: 'from-cyan-500 to-blue-600',
    features: [
      'Full script-retention structure outline',
      'Opening hook & narrative setup',
      'Key body segments with pacing tips',
      'Conversion-oriented calls-to-action'
    ]
  }
};

export const SEOToolsContainer: React.FC = () => {
  const [toolSlug, setToolSlug] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationResult, setGenerationResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [recentRuns, setRecentRuns] = useState<any[]>([]);

  // Parse path to detect current SEO tool
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/tools\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      setToolSlug(match[1]);
    } else {
      setToolSlug('youtube-idea-generator');
    }
    // Reset state
    setInputValue('');
    setGenerationResult(null);
    setErrorMessage('');
  }, [window.location.pathname]);

  const tool = TOOLS_CONFIG[toolSlug] || TOOLS_CONFIG['youtube-idea-generator'];
  const ToolIcon = tool.icon;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setErrorMessage('Please provide a valid input value.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');
    setGenerationResult(null);

    // Prepare dynamic payload based on tool
    let inputs: any = {};
    if (toolSlug === 'youtube-idea-generator') inputs = { topic: inputValue };
    else if (toolSlug === 'content-gap-finder') inputs = { niche: inputValue };
    else if (toolSlug === 'viral-video-analyzer') inputs = { concept: inputValue };
    else if (toolSlug === 'thumbnail-generator') inputs = { title: inputValue };
    else if (toolSlug === 'hook-generator') inputs = { topic: inputValue };
    else if (toolSlug === 'script-generator') inputs = { topic: inputValue, duration: '8 minutes' };

    try {
      const response = await fetch('/api/seo/free-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolType: toolSlug,
          inputs
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to communicate with AI model.');
      }

      setGenerationResult(data.result);
      
      // Store in recent runs for aesthetic history tracking
      setRecentRuns(prev => [
        {
          id: Date.now(),
          toolSlug,
          input: inputValue,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 4)
      ]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during AI generation. Please check your API configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadPreloadedSample = (sample: string) => {
    setInputValue(sample);
  };

  const getSampleText = () => {
    switch (toolSlug) {
      case 'youtube-idea-generator': return 'Coding a startup in 24 hours';
      case 'content-gap-finder': return 'Keyboard building ASMR';
      case 'viral-video-analyzer': return 'MrBeast video deconstruction';
      case 'thumbnail-generator': return 'I Quit My 9-5 Job To Code Full-Time';
      case 'hook-generator': return 'Why 99% of programmers fail';
      case 'script-generator': return 'How to read 50 books a year';
      default: return 'Tech careers';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white font-sans">
      {/* Dynamic SEO Structural Grid Lines background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40"></div>

      {/* Primary Header Container */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold tracking-wider text-sm text-white group-hover:scale-105 transition-transform duration-200">
                VG
              </div>
              <span className="font-sans font-bold tracking-tight text-lg text-slate-100 group-hover:text-white transition-colors">
                ViralGap <span className="text-xs bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 ml-1">AI Tools</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/"
              className="text-xs font-mono tracking-wider text-slate-400 hover:text-slate-100 transition-colors uppercase border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded"
            >
              Back to Workspace
            </a>
            <a 
              href="/#billing"
              className="hidden sm:inline-flex text-xs font-sans font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md shadow-indigo-500/20 hover:scale-[1.02]"
            >
              Upgrade to Premium
            </a>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs for Semantic Google Indexing & Layout pairing */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8 overflow-x-auto pb-1">
          <a href="/" className="hover:text-indigo-400 transition-colors">HOME</a>
          <span className="text-slate-600">/</span>
          <span className="text-slate-500 uppercase">FREE SEO TOOLS</span>
          <span className="text-slate-600">/</span>
          <span className="text-indigo-400 uppercase font-semibold">{tool.title}</span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-indigo-400 text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Programmatic SEO & Content Gap Toolset</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              {tool.title}
            </h1>
            <p className="text-lg text-slate-300 font-sans leading-relaxed">
              {tool.tagline}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              {tool.description}
            </p>

            {/* Premium CTA Box */}
            <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
              <h3 className="text-sm font-sans font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-400" />
                Want enterprise-grade bulk volume & real-time YouTube synchronization?
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Our premium plan synchronizes directly with active YouTube Analytics, detects active competitor channels, schedules direct video tracking, and offers unlimited high-speed AI outputs.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <a 
                  href="/#billing"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  View Premium Plans <ArrowRight className="h-3 w-3" />
                </a>
                <span className="text-[10px] font-mono text-slate-500">Starting at only $15/month</span>
              </div>
            </div>
          </div>

          {/* Interactive Tool Sidebar Navigation */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">Explore Free Creator Utilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(TOOLS_CONFIG).map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = item.slug === toolSlug;
                  return (
                    <a
                      key={item.slug}
                      href={`/tools/${item.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                        isActive 
                        ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300 shadow-sm shadow-indigo-500/5' 
                        : 'border-slate-900 hover:border-slate-800 hover:bg-slate-900/20 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-500'}`}>
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate leading-tight">{item.title.replace('AI ', '')}</div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-tight truncate">SEO Ready</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Core Generator Module */}
        <div id="tool-interface" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm relative">
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${tool.accentColor} rounded-t-2xl`}></div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300`}>
                  <ToolIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-sans font-semibold text-slate-100">{tool.title} Output</h2>
                  <p className="text-xs text-slate-400">Powered by Gemini 3.5 Flash</p>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-2 uppercase tracking-wide">
                    {tool.inputLabel}
                  </label>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={tool.inputPlaceholder}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200 resize-none font-sans"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-sans leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className={`w-full py-3.5 px-4 rounded-xl font-sans font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      isGenerating 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : `bg-gradient-to-r ${tool.accentColor} hover:scale-[1.01] hover:brightness-110 text-white shadow-lg`
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Shuffle className="h-4 w-4 animate-spin text-indigo-400" />
                        <span>Synthesizing algorithm data...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>{tool.ctaText}</span>
                      </>
                    )}
                  </button>

                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-mono text-slate-500">Free daily credits remaining: Unlimited</span>
                    <button
                      type="button"
                      onClick={() => loadPreloadedSample(getSampleText())}
                      className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Use Sample Input
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Technical Verification Block */}
            <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/20 space-y-3.5">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Features included in this tool:</h4>
              <ul className="space-y-2">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Output Display Panel */}
          <div className="lg:col-span-7">
            {isGenerating ? (
              <div className="border border-slate-900 bg-slate-950/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
                <div className="h-12 w-12 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-sans font-semibold text-slate-200">Querying YouTube Algorithmic Data...</h3>
                  <p className="text-xs text-slate-400 max-w-sm">Gemini AI model is clustering active audience trends, keyword gaps, and click patterns. This takes 4-7 seconds.</p>
                </div>
              </div>
            ) : generationResult ? (
              <div className="space-y-6">
                
                {/* Visual Header of output */}
                <div className="border border-slate-900 bg-slate-950/60 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-2xl"></div>
                  <div className="flex items-center gap-2 mb-4 text-xs font-mono text-indigo-400 uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Analysis Completed Successfully</span>
                  </div>

                  <h3 className="text-base font-sans font-semibold text-slate-100 mb-6">AI Generation Results</h3>

                  {/* Render Specific Dynamic Output Blocks depending on the loaded tool slug */}
                  
                  {toolSlug === 'youtube-idea-generator' && generationResult.ideas && (
                    <div className="space-y-6">
                      {generationResult.ideas.map((idea: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-xl border border-slate-900 bg-slate-900/30 space-y-3 hover:border-slate-800 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">IDEA 0{idx + 1}</span>
                          </div>
                          <h4 className="text-base font-sans font-bold text-slate-100 leading-snug">{idea.title}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-900">
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-mono">TARGET AUDIENCE</span>
                              <span className="text-slate-300 font-sans">{idea.targetAudience}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-mono">WHY IT WILL GO VIRAL</span>
                              <span className="text-slate-300 font-sans">{idea.whyViral}</span>
                            </div>
                          </div>
                          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-900 mt-2">
                            <span className="text-[10px] font-mono text-slate-500 block mb-1">CTR HOOK STRATEGY</span>
                            <p className="text-xs text-indigo-300 leading-relaxed italic">"{idea.ctrHook}"</p>
                          </div>
                          {idea.pacingStructure && (
                            <div className="space-y-1.5 mt-2">
                              <span className="text-[10px] font-mono text-slate-500 block">TACTICAL PACING STEPS:</span>
                              <div className="grid grid-cols-3 gap-2">
                                {idea.pacingStructure.map((step: string, sIdx: number) => (
                                  <div key={sIdx} className="bg-slate-950 p-2.5 rounded border border-slate-900 text-center">
                                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Phase {sIdx+1}</span>
                                    <span className="text-[11px] text-slate-300 truncate block">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {toolSlug === 'content-gap-finder' && generationResult.gaps && (
                    <div className="space-y-6">
                      {generationResult.gaps.map((gap: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-xl border border-slate-900 bg-slate-900/30 space-y-3 hover:border-slate-800 transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-base font-sans font-bold text-teal-400 leading-snug">{gap.topic}</h4>
                            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">{gap.competition} Competition</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/60 p-3.5 rounded-lg border border-slate-900">
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-mono">ESTIMATED SEARCH VOLUME</span>
                              <span className="text-slate-300 font-sans font-semibold">{gap.searchVolume}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-mono">IDEAL VIDEO STRATEGY</span>
                              <span className="text-slate-300 font-sans">{gap.contentStrategy}</span>
                            </div>
                          </div>
                          {gap.suggestedKeywords && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {gap.suggestedKeywords.map((kw: string, kIdx: number) => (
                                <span key={kIdx} className="text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-900 px-2 py-1 rounded">
                                  #{kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {toolSlug === 'viral-video-analyzer' && generationResult.analysis && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 text-center">
                          <span className="text-[10px] font-mono text-slate-500 block mb-1">PREDICTED RETENTION SCORE</span>
                          <div className="text-3xl font-sans font-bold text-indigo-400 mb-2">{generationResult.analysis.retentionScore}%</div>
                          <div className="w-full bg-slate-950 rounded-full h-1.5 max-w-[150px] mx-auto border border-slate-800">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${generationResult.analysis.retentionScore}%` }}></div>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 text-center">
                          <span className="text-[10px] font-mono text-slate-500 block mb-1">HOOK RETENTION STRENGTH</span>
                          <div className="text-3xl font-sans font-bold text-emerald-400 mb-1">{generationResult.analysis.hookStrength}</div>
                          <span className="text-[10px] font-mono text-slate-400">Excellent Algorithm Match</span>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-slate-900 bg-slate-900/20 space-y-3">
                        <h4 className="text-xs font-mono text-slate-400 uppercase">Algorithmic Overview</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{generationResult.analysis.structuredOverview}</p>
                      </div>

                      <div className="p-5 rounded-xl border border-slate-900 bg-slate-900/20 space-y-3">
                        <h4 className="text-xs font-mono text-slate-400 uppercase">Optimal Visual Pacing Blueprint</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{generationResult.analysis.visualPacing}</p>
                      </div>

                      {generationResult.analysis.patternInterrupts && (
                        <div className="p-5 rounded-xl border border-slate-900 bg-slate-900/20 space-y-3">
                          <h4 className="text-xs font-mono text-slate-400 uppercase">Suggested Pattern Interrupts (Prevent Drop-offs)</h4>
                          <ul className="space-y-1.5">
                            {generationResult.analysis.patternInterrupts.map((tip: string, idx: number) => (
                              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-indigo-400 font-mono mt-0.5">•</span>
                                <span className="font-sans">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {generationResult.analysis.optimizationTips && (
                        <div className="p-5 rounded-xl border border-slate-950 bg-indigo-950/10 space-y-3">
                          <h4 className="text-xs font-mono text-indigo-400 uppercase">Optimization Checklist (Maximize CTR)</h4>
                          <ul className="space-y-1.5">
                            {generationResult.analysis.optimizationTips.map((tip: string, idx: number) => (
                              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-emerald-400 font-mono">✓</span>
                                <span className="font-sans">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {toolSlug === 'thumbnail-generator' && generationResult.concepts && (
                    <div className="space-y-6">
                      {generationResult.concepts.map((concept: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-xl border border-slate-900 bg-slate-900/30 space-y-3 hover:border-slate-800 transition-colors">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-2.5">
                            <h4 className="text-sm font-sans font-semibold text-purple-300 leading-snug">{concept.title}</h4>
                            <span className="text-xs font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 uppercase">{concept.ctrExpectation} CTR</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-mono">TEXT OVERLAY CONCEPT</span>
                              <span className="text-slate-200 font-sans font-bold text-sm italic">"{concept.textOverlay}"</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-mono">VISUAL COMPOSITION BLUEPRINT</span>
                              <span className="text-slate-300 font-sans">{concept.visualElements}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-mono">PSYCHOLOGICAL CURIOSITY TRIGGER</span>
                              <span className="text-indigo-300 font-sans">{concept.psychologicalTrigger}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {toolSlug === 'hook-generator' && generationResult.hooks && (
                    <div className="space-y-6">
                      {generationResult.hooks.map((hook: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-xl border border-slate-900 bg-slate-900/30 space-y-3 hover:border-slate-800 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 uppercase">{hook.type} Hook</span>
                          </div>
                          <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-900 text-slate-100 font-sans text-sm leading-relaxed border-l-2 border-l-rose-500">
                            "{hook.script}"
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-900">
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-mono">VISUAL CUE (0-3 SEC)</span>
                              <span className="text-slate-300 font-sans">{hook.visualCue}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5 font-mono">SOUND EFFECT (SFX) CUE</span>
                              <span className="text-slate-300 font-sans">{hook.auditoryCue}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {toolSlug === 'script-generator' && generationResult.script && (
                    <div className="space-y-6">
                      <div className="p-5 rounded-xl border border-slate-900 bg-slate-900/20 space-y-2">
                        <span className="text-[10px] font-mono text-slate-500 block">BLUEPRINT TITLE</span>
                        <h4 className="text-base font-sans font-bold text-slate-100">{generationResult.script.title}</h4>
                      </div>

                      <div className="p-5 rounded-xl border border-slate-900 bg-slate-900/20 space-y-2">
                        <span className="text-[10px] font-mono text-indigo-400 block font-semibold">0:00 - 0:30 (INTRO HOOK & ATTRACTION)</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{generationResult.script.introHook}</p>
                      </div>

                      <div className="p-5 rounded-xl border border-slate-900 bg-slate-900/20 space-y-2">
                        <span className="text-[10px] font-mono text-indigo-400 block font-semibold">0:30 - 1:15 (NARRATIVE & CONTEXT SETUP)</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{generationResult.script.storySetup}</p>
                      </div>

                      {generationResult.script.keyValuePoints && (
                        <div className="p-5 rounded-xl border border-slate-900 bg-slate-900/20 space-y-3.5">
                          <span className="text-[10px] font-mono text-slate-500 block">KEY BODY VALUE SEGMENTS</span>
                          <div className="space-y-3">
                            {generationResult.script.keyValuePoints.map((point: any, pIdx: number) => (
                              <div key={pIdx} className="bg-slate-950 p-3.5 rounded-lg border border-slate-900">
                                <span className="text-[10px] font-mono text-indigo-400 block">SEGMENT {pIdx+1}: {point.point}</span>
                                <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">{point.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-5 rounded-xl border border-slate-950 bg-indigo-950/10 space-y-2">
                        <span className="text-[10px] font-mono text-emerald-400 block font-semibold">CLOSING OPTIMIZED CALL TO ACTION</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans italic">"{generationResult.script.closingCallToAction}"</p>
                      </div>
                    </div>
                  )}

                  {/* Register Conversion CTA */}
                  <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="text-xs font-sans font-bold text-slate-200">Unlock complete channel optimization suite</h4>
                      <p className="text-[10px] text-slate-400">Save unlimited scripts, map content calendars, and spy on competitors.</p>
                    </div>
                    <a 
                      href="/#billing"
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.02]"
                    >
                      Start Free Trial <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>

                </div>

              </div>
            ) : (
              <div className="border border-slate-900 bg-slate-950/20 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px] border-dashed">
                <div className="h-10 w-10 rounded-full bg-slate-900/60 flex items-center justify-center text-slate-500">
                  <Gauge className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-sans font-semibold text-slate-400">Awaiting Search Request</h3>
                  <p className="text-xs text-slate-500 max-w-sm">Provide your channel topic or title in the input panel to trigger our real-time algorithmic simulator.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center max-w-sm pt-2">
                  <button 
                    onClick={() => {
                      setInputValue(getSampleText());
                    }} 
                    className="text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded border border-slate-800"
                  >
                    Quick Load: "{getSampleText()}"
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Detailed Programmatic Content Section for perfect Google Indexing and search crawling */}
        <section className="mt-20 border-t border-slate-900 pt-16 space-y-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-sans font-bold text-slate-100 mb-4">
              Why professional YouTube creators trust {tool.title}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Our professional programmatic suite is modeled around the exact metrics search platforms and recommendation pipelines evaluate. Whether you are aiming to increase click-through rates (CTR) on feed impressions or stabilize standard audience view duration, our custom generators build high-value assets tailored specifically for niche growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-sans font-semibold text-indigo-400 uppercase tracking-wide">01 / Algorithm Alignment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We leverage generative transformer layers with tailored guidance prompts optimized around actual high-performance retention datasets. Every conceptual hook or pacing step is structured to bypass traditional creator pitfalls.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-sans font-semibold text-indigo-400 uppercase tracking-wide">02 / Niche Content Gaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stop shooting in the dark. Instead of copying what other creators have already done, our semantic gaps model locates high-search interest topics with weak or low-retention video results.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-sans font-semibold text-indigo-400 uppercase tracking-wide">03 / Continuous Optimizations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your workspace directly with your Google account to authorize secure real-time channel metadata indexing. Let the automated coach trigger notifications whenever a competitor drops coverage.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Dynamic Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 relative z-10 px-6 py-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              VG
            </div>
            <span className="font-sans font-semibold text-slate-300">ViralGap AI</span>
            <span className="text-[10px] text-slate-600">© 2026. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap gap-4 text-slate-400 font-mono text-[10px]">
            <a href="/sitemap.xml" className="hover:text-indigo-400 transition-colors uppercase">SITEMAP.XML</a>
            <a href="/robots.txt" className="hover:text-indigo-400 transition-colors uppercase">ROBOTS.TXT</a>
            <a href="/" className="hover:text-indigo-400 transition-colors uppercase">TERMS OF SERVICE</a>
            <a href="/" className="hover:text-indigo-400 transition-colors uppercase">PRIVACY SYSTEM</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
