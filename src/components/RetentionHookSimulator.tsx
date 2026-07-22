import React, { useState } from 'react';
import {
  Sparkles, RefreshCw, Copy, AlertCircle, TrendingUp, TrendingDown,
  Zap, Target, Clock, BarChart3, AlertTriangle, CheckCircle2,
  Brain, Film, Lightbulb, ArrowRight, Activity, Flame, ChevronDown, ChevronUp
} from 'lucide-react';
import type { RetentionHookResult } from '../types';

interface Props {
  userId: string;
  onUseCredits: (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => Promise<boolean>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  handleCopy: (text: string, label: string) => void;
}

export default function RetentionHookSimulator({ userId, onUseCredits, addToast, handleCopy }: Props) {
  const [scriptInput, setScriptInput] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RetentionHookResult | null>(() => {
    const saved = localStorage.getItem('retention_hook_result');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return null;
  });
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const analyzeRetention = async () => {
    if (!scriptInput.trim()) {
      addToast('error', 'Please paste your script or video idea to analyze retention.');
      return;
    }
    const hasQuota = await onUseCredits(15, 'scripts', `Retention Hook Analysis for ${videoTitle || 'Untitled'}`);
    if (!hasQuota) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/retention-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptInput, title: videoTitle, userId })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
        localStorage.setItem('retention_hook_result', JSON.stringify(data.result));
        addToast('success', 'Retention hook analysis complete! Check your predicted retention curve.');
      } else {
        throw new Error(data.error || 'Failed to analyze retention.');
      }
    } catch (err: any) {
      setError(err.message || 'Retention analysis failed.');
      addToast('error', err.message || 'Analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const dropRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'high': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'medium': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const retentionBarColor = (val: number) => {
    if (val >= 70) return 'bg-emerald-500';
    if (val >= 50) return 'bg-amber-500';
    if (val >= 30) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0c101d]/60 border border-cyan-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-wide">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Breakthrough AI Feature
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            AI Retention Hook Simulator
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Paste your script or video idea. AI predicts your audience retention curve, identifies exact drop-off points, and tells you precisely where to add hooks to keep viewers glued.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Video Title</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="e.g., I Built an AI App in 24 Hours"
              className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Paste Your Script / Video Outline</label>
            <textarea
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              rows={4}
              placeholder="Paste your full script, outline, or section-by-section breakdown. The more detail, the more accurate the retention prediction..."
              className="w-full bg-[#070b14] border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-sans resize-none"
            />
          </div>
        </div>
        <button
          onClick={analyzeRetention}
          disabled={isLoading}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-950/40 text-[#070b14] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          {isLoading ? (
            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Simulating Retention Curve...</>
          ) : (
            <><Activity className="w-3.5 h-3.5" /> Predict Retention & Find Hooks <span className="text-[10px] font-mono bg-[#070b14]/10 px-1.5 py-0.5 rounded font-normal">(15 credits)</span></>
          )}
        </button>
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
            <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <Activity className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">RETENTION SIMULATION ENGINE</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto animate-pulse">Analyzing script pacing, hook placement, narrative arcs, and predicting viewer drop-off zones...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 text-center">
              <BarChart3 className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white font-mono">{result.overallRetentionScore}/100</div>
              <div className="text-[10px] text-slate-500 font-mono">RETENTION SCORE</div>
            </div>
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 text-center">
              <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-emerald-400 font-mono">{result.predictedAvgRetention}%</div>
              <div className="text-[10px] text-slate-500 font-mono">AVG RETENTION</div>
            </div>
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 text-center">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-amber-400 font-mono">{result.hookStrength}/100</div>
              <div className="text-[10px] text-slate-500 font-mono">HOOK STRENGTH</div>
            </div>
            <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-rose-400 font-mono">{result.criticalDropPoints.length}</div>
              <div className="text-[10px] text-slate-500 font-mono">DROP-OFF POINTS</div>
            </div>
          </div>

          {/* Retention Curve Visualization */}
          <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Predicted Retention Curve
            </h3>
            <div className="flex items-end gap-1 h-40 border-b border-l border-slate-800 px-2 pb-2">
              {result.sections.map((section, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] font-mono text-slate-500">{section.retentionPrediction}%</span>
                  <div
                    className={`w-full rounded-t transition-all ${retentionBarColor(section.retentionPrediction)}`}
                    style={{ height: `${section.retentionPrediction}%` }}
                  />
                  <span className="text-[7px] font-mono text-slate-600 truncate w-full text-center">{section.timestamp}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 text-[9px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> 70%+ Great</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> 50-69% OK</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500" /> 30-49% Risk</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" /> &lt;30% Critical</span>
            </div>
          </div>

          {/* Section-by-Section Breakdown */}
          <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" /> Section-by-Section Analysis
            </h3>
            <div className="space-y-2">
              {result.sections.map((section, i) => (
                <div key={i} className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                    className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{section.timestamp}</span>
                      <span className="text-[11px] font-bold text-white">{section.sectionName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${dropRiskColor(section.dropRisk)}`}>
                        {section.dropRisk.toUpperCase()} RISK
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">{section.retentionPrediction}%</span>
                      {expandedSection === i ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                    </div>
                  </button>
                  {expandedSection === i && (
                    <div className="px-4 pb-4 space-y-3 border-t border-slate-900 pt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-[#070b14] p-3 rounded-lg border border-slate-900">
                          <div className="text-[9px] font-mono font-bold text-emerald-400 uppercase mb-1">HOOK SUGGESTION</div>
                          <div className="text-[11px] text-slate-300 leading-relaxed">{section.hookSuggestion}</div>
                        </div>
                        <div className="bg-[#070b14] p-3 rounded-lg border border-slate-900">
                          <div className="text-[9px] font-mono font-bold text-amber-400 uppercase mb-1">ENGAGEMENT TACTIC</div>
                          <div className="text-[11px] text-slate-300 leading-relaxed">{section.engagementTactic}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Critical Drop Points */}
          {result.criticalDropPoints.length > 0 && (
            <div className="bg-[#0c101d] border border-rose-500/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Critical Drop-Off Points - Fix These NOW
              </h3>
              <div className="space-y-3">
                {result.criticalDropPoints.map((dp, i) => (
                  <div key={i} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white">{dp.location}</span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded">
                        IMPACT: {dp.impactScore}/100
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">Why: {dp.reason}</div>
                    <div className="text-[10px] text-emerald-400 flex items-start gap-1 pt-1 border-t border-slate-900">
                      <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" /> <span>Fix: {dp.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Winning Hooks */}
          <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" /> Top Hook Patterns for Your Content
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.winningHooks.map((h, i) => (
                <div key={i} className="bg-slate-950 p-4 border border-slate-900 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                      {h.hookType}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">{h.effectivenessScore}/100</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed italic">"{h.example}"</p>
                  <button
                    onClick={() => handleCopy(h.example, 'Hook example')}
                    className="w-full py-1.5 border border-slate-900 hover:border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-[10px] font-mono rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy Hook
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Tips */}
          <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" /> AI Retention Optimization Tips
            </h3>
            <div className="space-y-2.5">
              {result.overallTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-950 p-3.5 border border-slate-900 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-300 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && !error && (
        <div className="bg-[#0c101d] border border-slate-900 border-dashed rounded-2xl p-12 text-center min-h-[400px] flex flex-col justify-center items-center">
          <Activity className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
          <h4 className="text-sm font-semibold text-white font-sans">Predict Your Retention Before You Film</h4>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Paste your script above and AI will simulate the audience retention curve, pinpoint where viewers will leave, and show you exactly where to add hooks.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
            {['Predict Drop-Offs', 'Smart Hook Placement', 'Boost Watch Time'].map((f, i) => (
              <div key={i} className="bg-slate-950 p-3 border border-slate-900 rounded-xl">
                <Activity className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-mono">{f}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
