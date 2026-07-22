import React, { useState } from 'react';
import {
  Sparkles, RefreshCw, Copy, AlertCircle, Trophy, Swords,
  Zap, Target, Brain, Flame, Clock, Users, Crown,
  TrendingUp, CheckCircle2, Lightbulb, BarChart3, ArrowRight
} from 'lucide-react';
import type { TitleABTestResult } from '../types';

interface Props {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
}

export default function TitleABBattleArena({ userId, onUseCredits, addToast, handleCopy }: Props) {
  const [niche, setNiche] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [titleCount, setTitleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TitleABTestResult | null>(() => {
    const saved = localStorage.getItem('title_ab_result');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return null;
  });
  const [error, setError] = useState<string | null>(null);

  const runBattle = async () => {
    if (!niche.trim()) {
      addToast('error', 'Please enter your video niche or topic.');
      return;
    }
    const hasQuota = await onUseCredits(10, 'prompts', `Title A/B Battle for ${niche.substring(0, 30)}`);
    if (!hasQuota) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/title-ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, existingTitles: titleInput, count: titleCount, userId })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
        localStorage.setItem('title_ab_result', JSON.stringify(data.result));
        addToast('success', `Battle complete! "${data.result.winner.title}" wins with ${data.result.winner.confidenceLevel}% confidence!`);
      } else {
        throw new Error(data.error || 'Failed to run title battle.');
      }
    } catch (err: any) {
      setError(err.message || 'Title battle failed.');
      addToast('error', err.message || 'Battle failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'CHAMPION' };
      case 2: return { icon: Trophy, color: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-500/30', label: 'RUNNER UP' };
      case 3: return { icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-700/10 border-amber-700/30', label: '3RD PLACE' };
      default: return { icon: Swords, color: 'text-slate-500', bg: 'bg-slate-900 border-slate-800', label: `#${rank}` };
    }
  };

  const scoreBar = (score: number, maxW = 100) => {
    const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : score >= 40 ? 'bg-orange-500' : 'bg-rose-500';
    return (
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0c101d]/60 border border-amber-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold font-mono text-amber-400 uppercase tracking-wide">
            <Swords className="w-3.5 h-3.5 text-amber-400" /> Breakthrough AI Feature
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            AI Title A/B Battle Arena
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Stop guessing which title will perform best. AI generates multiple title variations, runs a simulated A/B test, and crowns the winner with CTR predictions, emotional impact scores, and click psychology analysis.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Video Niche / Topic</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., AI tools for freelancers"
              className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Your Existing Titles (Optional)</label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Comma-separated titles you want to test..."
              className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Battle Size</label>
            <select
              value={titleCount}
              onChange={(e) => setTitleCount(Number(e.target.value))}
              className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-sans cursor-pointer"
            >
              <option value={3}>3 Titles - Quick Duel</option>
              <option value={5}>5 Titles - Standard Battle</option>
              <option value={7}>7 Titles - Royal Rumble</option>
              <option value={10}>10 Titles - Championship</option>
            </select>
          </div>
        </div>
        <button
          onClick={runBattle}
          disabled={isLoading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-950/40 text-[#070b14] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          {isLoading ? (
            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running Title Battle...</>
          ) : (
            <><Swords className="w-3.5 h-3.5" /> Start Title Battle <span className="text-[10px] font-mono bg-[#070b14]/10 px-1.5 py-0.5 rounded font-normal">(10 credits)</span></>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#0c101d] border border-rose-500/10 rounded-2xl p-6 flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-rose-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-rose-400 font-mono">BATTLE ERROR</h4>
            <p className="text-xs text-slate-400 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-12 text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
            <Swords className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-widest">TITLE BATTLE ARENA</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto animate-pulse">Generating titles, simulating CTR data, analyzing click psychology and emotional triggers...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          {/* Winner Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">BATTLE CHAMPION</span>
            </div>
            <h3 className="text-lg font-bold text-white">{result.winner.title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold">{result.winner.confidenceLevel}% Confidence</span>
              <span>|</span>
              <span>{result.winner.reason}</span>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleCopy(result.winner.title, 'Winning title')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#070b14] font-bold text-[10px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Copy Winner
              </button>
            </div>
          </div>

          {/* Audience Profile & Best Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">Audience Psychology Profile</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{result.audiencePsychProfile}</p>
            </div>
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">Best Posting Time</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{result.bestPostingTime}</p>
            </div>
          </div>

          {/* Title Rankings */}
          <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" /> Complete Battle Rankings
            </h3>
            <div className="space-y-3">
              {result.titles.map((t, i) => {
                const badge = getRankBadge(t.rank);
                const BadgeIcon = badge.icon;
                return (
                  <div key={i} className={`bg-slate-950 border rounded-xl p-4 transition-all ${i === 0 ? 'border-amber-500/30 ring-1 ring-amber-500/10' : 'border-slate-900'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-grow">
                        <div className={`p-1.5 rounded-lg border shrink-0 ${badge.bg}`}>
                          <BadgeIcon className={`w-4 h-4 ${badge.color}`} />
                        </div>
                        <div className="flex-grow space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.color}`}>
                              {badge.label}
                            </span>
                            <span className="text-sm font-bold text-white">{t.overallScore}/100</span>
                          </div>
                          <h4 className="text-[12px] font-bold text-slate-200">{t.title}</h4>
                          <p className="text-[10px] text-slate-500 leading-relaxed">{t.psychologyBreakdown}</p>

                          {/* Score Bars */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2">
                            {[
                              { label: 'CTR', score: t.ctrScore },
                              { label: 'Emotion', score: t.emotionalImpact },
                              { label: 'Curiosity', score: t.curiosityGap },
                              { label: 'Clarity', score: t.clarityScore },
                              { label: 'Urgency', score: t.urgencyScore },
                            ].map((s, si) => (
                              <div key={si} className="space-y-1">
                                <div className="flex justify-between text-[8px] font-mono text-slate-500">
                                  <span>{s.label}</span>
                                  <span>{s.score}</span>
                                </div>
                                {scoreBar(s.score)}
                              </div>
                            ))}
                          </div>

                          {/* Improvement Tips */}
                          {t.improvementTips.length > 0 && (
                            <div className="pt-2 border-t border-slate-900 space-y-1">
                              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">Improvement Tips:</span>
                              {t.improvementTips.map((tip, ti) => (
                                <div key={ti} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                                  <ArrowRight className="w-2.5 h-2.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{tip}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(t.title, `Title #${t.rank}`)}
                        className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-500/5 rounded-lg border border-transparent hover:border-amber-500/10 transition-all cursor-pointer shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && !error && (
        <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center min-h-[400px] flex flex-col justify-center items-center">
          <Swords className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
          <h4 className="text-sm font-semibold text-white font-sans">Let Titles Fight for the Crown</h4>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Enter your niche, optionally add your own title ideas, and watch AI battle-test them with CTR simulations, emotional impact analysis, and click psychology breakdowns.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
            {['CTR Prediction', 'Emotion Analysis', 'Psychology Score'].map((f, i) => (
              <div key={i} className="bg-slate-950 p-3 border border-slate-900 rounded-xl">
                <Swords className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-mono">{f}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
