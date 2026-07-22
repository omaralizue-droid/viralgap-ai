import React, { useState } from 'react';
import {
  MessageSquare, Sparkles, RefreshCw, Copy, AlertCircle, TrendingUp,
  ThumbsUp, ThumbsDown, Lightbulb, Quote, Target, Zap, BarChart3,
  Heart, Frown, Meh, ArrowRight, Search, Youtube, Flame, Brain, CheckCircle2
} from 'lucide-react';
import type { CommentIntelligenceResult } from '../types';

interface Props {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
}

export default function CommentIntelligenceLab({ userId, onUseCredits, addToast, handleCopy }: Props) {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CommentIntelligenceResult | null>(() => {
    const saved = localStorage.getItem('comment_intel_result');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return null;
  });
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'sentiment' | 'praise' | 'complaints' | 'requests' | 'ideas' | 'quotes'>('sentiment');

  const analyzeComments = async () => {
    if (!videoUrl.trim()) {
      addToast('error', 'Please paste a YouTube video URL to analyze comments.');
      return;
    }
    const hasQuota = await onUseCredits(20, 'urlAnalyses', `Comment Intelligence for ${videoUrl.substring(0, 40)}`);
    if (!hasQuota) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/comment-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, userId })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
        localStorage.setItem('comment_intel_result', JSON.stringify(data.result));
        addToast('success', `Analyzed ${data.result.totalCommentsAnalyzed} comments with AI intelligence!`);
      } else {
        throw new Error(data.error || 'Failed to analyze comments.');
      }
    } catch (err: any) {
      setError(err.message || 'Comment intelligence analysis failed.');
      addToast('error', err.message || 'Analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const sentimentColor = (val: number) => val > 60 ? 'text-emerald-400' : val > 30 ? 'text-amber-400' : 'text-rose-400';
  const severityColor = (s: string) => s === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : s === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0c101d]/60 border border-purple-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold font-mono text-purple-400 uppercase tracking-wide">
            <Brain className="w-3.5 h-3.5 text-purple-400" /> Breakthrough AI Feature
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            AI Comment Intelligence Lab
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Paste any YouTube video URL. Our AI analyzes every comment to extract what viewers are begging for, their pain points, emotional triggers, and content requests. Pure gold for your next viral video.
          </p>
        </div>
      </div>

      {/* URL Input */}
      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste any YouTube video URL here... (e.g., https://youtube.com/watch?v=...)"
              className="w-full bg-[#070b14] border border-slate-850 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>
          <button
            onClick={analyzeComments}
            disabled={isLoading}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-400 disabled:bg-purple-950/40 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            {isLoading ? (
              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Comments...</>
            ) : (
              <><Brain className="w-3.5 h-3.5" /> Analyze Comments <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded">(20 credits)</span></>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#0c101d] border border-rose-500/10 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-rose-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-rose-400 font-mono">ANALYSIS ERROR</h4>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
            <Brain className="w-6 h-6 text-purple-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest">DEEP COMMENT ANALYSIS</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto animate-pulse">Scanning comments, extracting sentiment, identifying patterns and content gold mines...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 text-center">
              <MessageSquare className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white font-mono">{result.totalCommentsAnalyzed}</div>
              <div className="text-[10px] text-slate-500 font-mono">COMMENTS SCANNED</div>
            </div>
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 text-center">
              <Heart className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className={`text-lg font-bold font-mono ${sentimentColor(result.overallSentiment.positive)}`}>{result.overallSentiment.positive}%</div>
              <div className="text-[10px] text-slate-500 font-mono">POSITIVE</div>
            </div>
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 text-center">
              <Meh className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-amber-400 font-mono">{result.overallSentiment.neutral}%</div>
              <div className="text-[10px] text-slate-500 font-mono">NEUTRAL</div>
            </div>
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 text-center">
              <Frown className="w-5 h-5 text-rose-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-rose-400 font-mono">{result.overallSentiment.negative}%</div>
              <div className="text-[10px] text-slate-500 font-mono">NEGATIVE</div>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 flex items-center gap-4">
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <Youtube className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-grow">
              <div className="text-sm font-bold text-white">{result.videoTitle}</div>
              <div className="text-[10px] text-slate-500 font-mono">{result.channelName}</div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'sentiment' as const, label: 'Sentiment Map', icon: BarChart3 },
              { id: 'praise' as const, label: 'Top Praise', icon: ThumbsUp },
              { id: 'complaints' as const, label: 'Complaints', icon: ThumbsDown },
              { id: 'requests' as const, label: 'Content Requests', icon: Target },
              { id: 'ideas' as const, label: 'Viral Ideas', icon: Flame },
              { id: 'quotes' as const, label: 'Key Quotes', icon: Quote },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeSection === tab.id
                    ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                    : 'bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-300'
                }`}
              >
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Sentiment Section */}
          {activeSection === 'sentiment' && (
            <div className="space-y-4">
              {/* Sentiment Bar */}
              <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6">
                <div className="flex h-4 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 transition-all" style={{ width: `${result.overallSentiment.positive}%` }} />
                  <div className="bg-amber-500 transition-all" style={{ width: `${result.overallSentiment.neutral}%` }} />
                  <div className="bg-rose-500 transition-all" style={{ width: `${result.overallSentiment.negative}%` }} />
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-mono text-slate-500">
                  <span className="text-emerald-400">Positive {result.overallSentiment.positive}%</span>
                  <span className="text-amber-400">Neutral {result.overallSentiment.neutral}%</span>
                  <span className="text-rose-400">Negative {result.overallSentiment.negative}%</span>
                </div>
              </div>

              {/* Emotional Triggers */}
              <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Emotional Triggers Detected
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.emotionalTriggers.map((t, i) => (
                    <div key={i} className="bg-slate-950 p-3.5 border border-slate-900 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-white">{t.trigger}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Emotion: {t.emotion}</div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${severityColor(t.intensity)}`}>
                        {t.intensity.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Insights */}
              <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400" /> AI Actionable Insights
                </h3>
                <div className="space-y-2.5">
                  {result.actionableInsights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-950 p-3.5 border border-slate-900 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-300 leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Praise Section */}
          {activeSection === 'praise' && (
            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-emerald-400" /> What Viewers Love Most
              </h3>
              <div className="space-y-3">
                {result.topPraiseThemes.map((p, i) => (
                  <div key={i} className="bg-slate-950 p-4 border border-slate-900 rounded-xl flex items-center justify-between">
                    <div className="flex-grow">
                      <div className="text-[11px] font-bold text-white">{p.theme}</div>
                      <div className="text-[10px] text-slate-500 mt-1">Sentiment: {p.sentiment}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400 font-mono">{p.count}</div>
                      <div className="text-[9px] text-slate-500 font-mono">MENTIONS</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complaints Section */}
          {activeSection === 'complaints' && (
            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ThumbsDown className="w-4 h-4 text-rose-400" /> Top Complaints & Frustrations
              </h3>
              <div className="space-y-3">
                {result.topComplaints.map((c, i) => (
                  <div key={i} className="bg-slate-950 p-4 border border-slate-900 rounded-xl flex items-center justify-between">
                    <div className="flex-grow">
                      <div className="text-[11px] font-bold text-white">{c.complaint}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${severityColor(c.severity)}`}>
                        {c.severity.toUpperCase()}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-bold text-rose-400 font-mono">{c.count}</div>
                        <div className="text-[9px] text-slate-500 font-mono">MENTIONS</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pain Points */}
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2 pt-4 border-t border-slate-900">
                <Target className="w-4 h-4 text-amber-400" /> Audience Pain Points = Your Content Gold
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.audiencePainPoints.map((pp, i) => (
                  <div key={i} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-2">
                    <div className="text-[11px] font-bold text-white">{pp.painPoint}</div>
                    <div className="text-[10px] text-slate-500">Frequency: {pp.frequency}</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-900">
                      <ArrowRight className="w-3 h-3" /> {pp.opportunityAngle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Requests Section */}
          {activeSection === 'requests' && (
            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-400" /> What Viewers Are BEGGING For
              </h3>
              <p className="text-[10px] text-slate-500">These are direct content requests from the audience. Make videos about these and they WILL get views.</p>
              <div className="space-y-3">
                {result.contentRequests.map((r, i) => (
                  <div key={i} className="bg-slate-950 p-4 border border-slate-900 rounded-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-grow">
                        <div className="text-[11px] font-bold text-white">{r.request}</div>
                        <div className="text-[10px] text-slate-500 mt-1">Audience: {r.audience}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-sky-400 font-mono">{r.demandScore}/100</div>
                        <div className="text-[9px] text-slate-500 font-mono">DEMAND</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(r.request, 'Content request')}
                      className="mt-3 w-full py-1.5 border border-slate-900 hover:border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-[10px] font-mono rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Use This Idea
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Viral Ideas Section */}
          {activeSection === 'ideas' && (
            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" /> AI-Generated Viral Content Ideas (From Comment Data)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.viralContentIdeas.map((idea, i) => (
                  <div key={i} className="bg-slate-950 p-4 border border-slate-900 hover:border-purple-500/30 rounded-xl space-y-3 group transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                        IDEA #{i + 1}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">{idea.estimatedInterest}</span>
                    </div>
                    <h4 className="text-[11.5px] font-bold text-slate-200 group-hover:text-white transition-all leading-snug">{idea.idea}</h4>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed italic">{idea.whyItWorks}</p>
                    <button
                      onClick={() => handleCopy(`${idea.idea}\n\nWhy it works: ${idea.whyItWorks}`, 'Viral idea')}
                      className="w-full py-1.5 border border-slate-900 hover:border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-[10px] font-mono rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy Idea
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quotes Section */}
          {activeSection === 'quotes' && (
            <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Quote className="w-4 h-4 text-purple-400" /> Most Impactful Viewer Quotes
              </h3>
              <div className="space-y-3">
                {result.keyQuotes.map((q, i) => (
                  <div key={i} className="bg-slate-950 p-4 border border-slate-900 rounded-xl relative">
                    <Quote className="w-6 h-6 text-purple-500/20 absolute top-3 right-3" />
                    <p className="text-[11px] text-slate-300 leading-relaxed italic pr-8">"{q.quote}"</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900">
                      <span className="text-[10px] text-slate-500 font-mono">- {q.author}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                        q.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        q.sentiment === 'negative' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {q.sentiment.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && !error && (
        <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center min-h-[400px] flex flex-col justify-center items-center">
          <Brain className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
          <h4 className="text-sm font-semibold text-white font-sans">Ready to Decode Audience Intelligence</h4>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Paste any YouTube video URL above and our AI will analyze hundreds of comments to reveal what viewers truly want, what frustrates them, and what content they're begging for next.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
            {['Find Content Gold', 'Spot Pain Points', 'Generate Viral Ideas'].map((f, i) => (
              <div key={i} className="bg-slate-950 p-3 border border-slate-900 rounded-xl">
                <Sparkles className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-mono">{f}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
