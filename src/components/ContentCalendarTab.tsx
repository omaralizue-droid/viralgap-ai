import React, { useState, useEffect } from 'react';
import { 
  Calendar, Sparkles, Plus, Trash2, CheckCircle2, Clock, FileText, 
  ChevronRight, ExternalLink, RefreshCw, Bookmark, Download, Copy, Check,
  BookOpen, List, Grid, Layout, Loader2, ArrowLeft, Filter, AlertCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContentCalendar, CalendarItem } from '../types';

interface ContentCalendarTabProps {
  userId: string;
  onActivityLogged?: (title: string, detail: string, credits: number) => void;
  deductCredits?: (amount: number, type: string) => Promise<boolean>;
}

const PRESET_NICHES = [
  'AI Productivity Hacks',
  'Coding for Beginners',
  'Personal Finance & Stocks',
  'Retro Gaming Reviews',
  'Quiet Luxury Fashion Trend analysis',
  'Health & Biohacking'
];

const PRESET_GOALS = [
  'Convert viewers to high-paying newsletter subscribers',
  'Establish maximum educational authority and expertise',
  'Maximize brand sponsorships and clickable affiliate sales',
  'Accelerate rapid subscriber growth with viral hooks'
];

export function ContentCalendarTab({ userId, onActivityLogged, deductCredits }: ContentCalendarTabProps) {
  // Lists and active selections
  const [calendars, setCalendars] = useState<ContentCalendar[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(null);
  const [activeCalendar, setActiveCalendar] = useState<ContentCalendar | null>(null);
  
  // Generation Form States
  const [niche, setNiche] = useState('');
  const [postingFrequency, setPostingFrequency] = useState('3 times a week');
  const [goals, setGoals] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Filter and Layout UI states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Scheduled' | 'Draft' | 'Published'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Fetch initial content calendars
  useEffect(() => {
    fetchCalendars();
  }, [userId]);

  // Handle active calendar sync
  useEffect(() => {
    if (selectedCalendarId) {
      const found = calendars.find(c => c.id === selectedCalendarId);
      setActiveCalendar(found || null);
    } else {
      setActiveCalendar(null);
    }
  }, [selectedCalendarId, calendars]);

  const fetchCalendars = async () => {
    try {
      const response = await fetch(`/api/content-calendar?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setCalendars(data.calendars);
        if (data.calendars.length > 0 && !selectedCalendarId) {
          setSelectedCalendarId(data.calendars[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching content calendars:', error);
    }
  };

  // Simulated steps of AI content strategist generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setGenerationStep(0);
      interval = setInterval(() => {
        setGenerationStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || !postingFrequency || !goals) return;

    // Optional: Deduct credits in the simulation
    if (deductCredits) {
      const success = await deductCredits(5, 'scripts');
      if (!success) {
        alert('Insufficient credits to run Content Calendar Generator! Please upgrade plan.');
        return;
      }
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/content-calendar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, postingFrequency, goals, userId })
      });
      const data = await response.json();
      if (data.success) {
        setCalendars(prev => [data.calendar, ...prev]);
        setSelectedCalendarId(data.calendar.id);
        
        if (onActivityLogged) {
          onActivityLogged(
            '30-Day Content Plan Generated',
            `Created complete 30-day calendar for niche "${niche}" optimized for frequency: ${postingFrequency}.`,
            5
          );
        }
      } else {
        alert(data.error || 'Failed to generate content calendar');
      }
    } catch (error) {
      console.error('Error generating content calendar:', error);
      alert('An unexpected network error occurred while generating the content calendar.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCalendar = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you absolutely sure you want to delete this 30-day content calendar plan? This action is irreversible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/content-calendar/${id}?userId=${userId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setCalendars(prev => prev.filter(c => c.id !== id));
        if (selectedCalendarId === id) {
          const remaining = calendars.filter(c => c.id !== id);
          setSelectedCalendarId(remaining.length > 0 ? remaining[0].id : null);
        }
        if (onActivityLogged) {
          onActivityLogged(
            'Content Calendar Deleted',
            `Deleted Content Calendar plan (${id})`,
            0
          );
        }
      }
    } catch (error) {
      console.error('Error deleting calendar:', error);
    }
  };

  const handleUpdateItemStatus = async (itemId: string, status: 'Scheduled' | 'Draft' | 'Published') => {
    if (!selectedCalendarId) return;
    try {
      const response = await fetch('/api/content-calendar/item-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarId: selectedCalendarId, itemId, status })
      });
      const data = await response.json();
      if (data.success) {
        setCalendars(prev => prev.map(c => {
          if (c.id === selectedCalendarId) {
            return {
              ...c,
              items: c.items.map(item => item.id === itemId ? { ...item, status } : item)
            };
          }
          return c;
        }));
        
        // Also update local modal state if open
        if (selectedItem && selectedItem.id === itemId) {
          setSelectedItem(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(type);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      setCopiedSection(null);
    }, 2000);
  };

  const downloadScript = (item: CalendarItem) => {
    const content = `DAY ${item.day} CONTENT SCRIPT
TITLE: ${item.title}
PUBLISH DATE: ${item.publishingDate}
STATUS: ${item.status}

HOOK (0-5 SECONDS):
${item.hook}

VOICEOVER SCRIPT & NARRATION:
${item.script}

THUMBNAIL DESIGN CONCEPT:
${item.thumbnailIdea}

Generated by ViralGap AI Content Strategist.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Day_${item.day}_Script_ViralGap_AI.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filters calculation
  const filteredItems = activeCalendar
    ? activeCalendar.items.filter(item => {
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.hook.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.script.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
    : [];

  // Completed progress
  const completedCount = activeCalendar
    ? activeCalendar.items.filter(i => i.status === 'Published').length
    : 0;
  const draftCount = activeCalendar
    ? activeCalendar.items.filter(i => i.status === 'Draft').length
    : 0;
  const scheduledCount = activeCalendar
    ? activeCalendar.items.filter(i => i.status === 'Scheduled').length
    : 0;
  const completionPercentage = activeCalendar
    ? Math.round((completedCount / activeCalendar.items.length) * 100)
    : 0;

  // Render simulated progress steps during Gemini generation
  const steps = [
    { title: 'Structuring 30-Day Blueprint', desc: 'Analyzing target niche and scheduling consecutive optimal publishing dates.' },
    { title: 'Brainstorming Viral Headlines', desc: 'Running models on CTR heuristics to devise 30 scroll-stopping titles.' },
    { title: 'Drafting Visual Hooks', desc: 'Creating intense open loops and auditory cues for the first 5 seconds.' },
    { title: 'Writing Complete Scripts', desc: 'Fleshing out comprehensive, highly informational narration templates for each day.' },
    { title: 'Generating Thumbnail Design Concepts', desc: 'Composing visual layouts, metaphors, and high-CTR color choices.' }
  ];

  return (
    <div id="content_calendar_container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-100 font-sans">
      
      {/* LEFT SIDEBAR: Saved Calendars List */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Your Calendars</h3>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400">
              {calendars.length} Active
            </span>
          </div>

          {calendars.length === 0 ? (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
              <p className="text-xs">No plans generated yet</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {calendars.map(c => {
                const isSelected = selectedCalendarId === c.id;
                const completed = c.items.filter(i => i.status === 'Published').length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCalendarId(c.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col justify-between group ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-900/80 hover:border-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="font-semibold text-xs truncate max-w-[150px]" title={c.niche}>
                        {c.niche}
                      </div>
                      <button
                        onClick={(e) => handleDeleteCalendar(c.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all text-slate-500"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2.5 text-[10px] text-slate-500 w-full font-mono">
                      <span>{c.postingFrequency}</span>
                      <span className="text-slate-400 font-semibold">{completed}/30 Done</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setSelectedCalendarId(null)}
            className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed transition-all text-xs font-medium ${
              !selectedCalendarId 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold' 
                : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/40 hover:text-slate-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Generate New Plan
          </button>
        </div>

        {/* PRESENCE CARD IN SIDEBAR */}
        {activeCalendar && (
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Plan Analytics</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Production Progress</span>
                  <span className="font-semibold font-mono text-emerald-400">{completionPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-mono">
                <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-xl">
                  <div className="text-slate-500">TODO</div>
                  <div className="text-sm font-bold text-slate-300">{scheduledCount}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-xl">
                  <div className="text-slate-500">DRAFT</div>
                  <div className="text-sm font-bold text-amber-400">{draftCount}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800/80 p-2 rounded-xl">
                  <div className="text-slate-500">DONE</div>
                  <div className="text-sm font-bold text-emerald-400">{completedCount}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT WORKSPACE: Input form OR Calendar items board */}
      <div className="lg:col-span-9 space-y-6">
        <AnimatePresence mode="wait">
          
          {/* STATE 1: GENERATE NEW CONTENT CALENDAR FORM */}
          {!selectedCalendarId ? (
            <motion.div
              key="generation_form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md space-y-6"
            >
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-medium mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Elite Content Strategist AI Core</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                  Generate Your 30-Day Viral Content Calendar
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Provide your target niche, preferred publishing rate, and strategic conversion goals. 
                  Our system will deploy advanced LLM heuristics to architect a tailored 30-Day schedule 
                  complete with clickable titles, scroll-stopping hooks, complete narration transcripts, and layouts.
                </p>
              </div>

              {isGenerating ? (
                // GENERATING VIEW WITH SEQUENTIAL STEPS PROGRESSION
                <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-8 flex flex-col items-center justify-center text-center py-14 space-y-8">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                    <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h3 className="text-lg font-bold text-white">Synthesizing Your 30-Day Strategic Plan</h3>
                    <p className="text-xs text-slate-400">
                      This takes approximately 15-20 seconds to draft 30 highly specialized days, scripts, and thumbnail metadata.
                    </p>
                  </div>

                  {/* Staggered progress checkpoints */}
                  <div className="w-full max-w-lg bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4 text-left">
                    {steps.map((step, idx) => {
                      const isPast = generationStep > idx;
                      const isCurrent = generationStep === idx;
                      return (
                        <div key={idx} className="flex items-start gap-3 transition-opacity duration-300">
                          <div className="mt-0.5">
                            {isPast ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : isCurrent ? (
                              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-slate-800 rounded-full" />
                            )}
                          </div>
                          <div>
                            <p className={`text-xs font-semibold ${isCurrent ? 'text-emerald-400' : isPast ? 'text-slate-300' : 'text-slate-600'}`}>
                              {step.title}
                            </p>
                            {isCurrent && (
                              <p className="text-[10px] text-slate-500 mt-0.5 animate-pulse">
                                {step.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // INPUT FORM PANEL
                <form onSubmit={handleGenerate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* INPUT 1: NICHE */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Your Target Niche
                      </label>
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="e.g. AI Automation Agency Tools"
                        required
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800/80 rounded-xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 text-slate-200 placeholder:text-slate-600 outline-none text-sm transition-all"
                      />
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {PRESET_NICHES.map(pn => (
                          <button
                            type="button"
                            key={pn}
                            onClick={() => setNiche(pn)}
                            className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition-colors"
                          >
                            + {pn}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* INPUT 2: FREQUENCY */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Posting Frequency
                      </label>
                      <select
                        value={postingFrequency}
                        onChange={(e) => setPostingFrequency(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-800/80 rounded-xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 text-slate-200 outline-none text-sm transition-all cursor-pointer"
                      >
                        <option value="Daily">Daily (7 posts / week)</option>
                        <option value="5 times a week">5 times a week (High intensity)</option>
                        <option value="3 times a week">3 times a week (Optimal spacing)</option>
                        <option value="2 times a week">2 times a week (Steady paced)</option>
                        <option value="Weekly">Weekly (1 post / week)</option>
                      </select>
                      
                      <div className="text-[10px] text-slate-500 leading-relaxed font-mono">
                        Publishing dates will be mapped dynamically skipping rest days based on frequency.
                      </div>
                    </div>

                  </div>

                  {/* INPUT 3: GOALS */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Strategic Goals & Target Conversions
                    </label>
                    <textarea
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="e.g. Expand reach, explain core developer tools simply, and drive users to sign up for my SaaS beta waiting list..."
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800/80 rounded-xl focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 text-slate-200 placeholder:text-slate-600 outline-none text-sm transition-all resize-none"
                    />

                    {/* Presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {PRESET_GOALS.map(pg => (
                        <button
                          type="button"
                          key={pg}
                          onClick={() => setGoals(pg)}
                          className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition-colors text-left truncate max-w-[280px]"
                          title={pg}
                        >
                          + {pg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-6">
                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      Run AI Content Strategist Model
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            
            // STATE 2: ACTIVE CONTENT CALENDAR PLAN DISPLAY
            <motion.div
              key="active_calendar_view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              
              {/* Header Details Panel */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      30-Day Viral Strategy
                    </span>
                    <span className="text-slate-500 text-xs font-mono">• Created {new Date(activeCalendar?.createdAt || '').toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {activeCalendar?.niche} Plan
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Frequency: <strong className="text-slate-200">{activeCalendar?.postingFrequency}</strong>
                    </span>
                    <span className="hidden md:inline text-slate-600">|</span>
                    <span className="flex items-center gap-1 truncate max-w-[400px]" title={activeCalendar?.goals}>
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      Goal: <strong className="text-slate-200 truncate">{activeCalendar?.goals}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-center">
                  {/* View togglers */}
                  <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      title="Grid View (30 Days)"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      title="Detailed List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedCalendarId(null)}
                    className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Plan</span>
                  </button>
                </div>
              </div>

              {/* Filtering and search control bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1 pr-1">
                    <Filter className="w-3.5 h-3.5" /> Filter status:
                  </span>
                  {(['all', 'Scheduled', 'Draft', 'Published'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        statusFilter === f 
                          ? 'bg-slate-800 border-slate-700 text-white font-semibold' 
                          : 'bg-slate-950/20 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                      }`}
                    >
                      {f === 'all' ? 'All Days' : f}
                    </button>
                  ))}
                </div>

                <div className="w-full sm:w-64 relative">
                  <input
                    type="text"
                    placeholder="Search titles, hooks, or scripts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800/80 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-emerald-500/30 transition-all"
                  />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 sm:rotate-0" />
                  <div className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 space-y-3">
                  <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm">No items match the active status or search filter criteria.</p>
                  <button
                    onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Clear active filters
                  </button>
                </div>
              ) : (
                
                // RENDER ACCORDING TO VIEW MODE
                viewMode === 'grid' ? (
                  // BENTO CALENDAR GRID (30 Days)
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {filteredItems.map(item => {
                      const dateObj = new Date(item.publishingDate);
                      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      const weekDay = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="bg-slate-950/40 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800/80 rounded-2xl p-4.5 transition-all cursor-pointer flex flex-col justify-between group h-[170px]"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-[10px] font-semibold text-slate-500">
                                DAY {item.day}
                              </span>
                              
                              {/* Status badge */}
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                                item.status === 'Published' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                                  : item.status === 'Draft'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                                  : 'bg-slate-900 text-slate-500 border border-slate-800'
                              }`}>
                                {item.status.toUpperCase()}
                              </span>
                            </div>

                            <h3 className="text-xs font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                              {item.title}
                            </h3>
                            
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                              {item.hook}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-900/60 pt-2.5 mt-2 text-[9px] text-slate-500 font-mono">
                            <span>{weekDay}, {formattedDate}</span>
                            <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5">
                              Open Script <ChevronRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // DETAILED LIST VIEW WITH FULL BULLET EXPANSE
                  <div className="space-y-4">
                    {filteredItems.map(item => (
                      <div
                        key={item.id}
                        className="bg-slate-950/40 border border-slate-900 hover:border-slate-800/80 rounded-2xl p-6 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 group"
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-slate-900 border border-slate-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md text-slate-400">
                              DAY {item.day}
                            </span>
                            <span className="text-slate-500 text-xs font-mono">{new Date(item.publishingDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            
                            {/* Interactive Select */}
                            <select
                              value={item.status}
                              onChange={(e) => handleUpdateItemStatus(item.id, e.target.value as any)}
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border outline-none bg-slate-900 cursor-pointer ${
                                item.status === 'Published' 
                                  ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' 
                                  : item.status === 'Draft'
                                  ? 'border-amber-500/20 text-amber-400 bg-amber-500/5'
                                  : 'border-slate-800 text-slate-500'
                              }`}
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="Draft">Draft</option>
                              <option value="Published">Published</option>
                            </select>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              <span className="text-emerald-400 font-semibold font-mono text-[10px] uppercase tracking-wider mr-1.5">[Hook]:</span> 
                              "{item.hook}"
                            </p>
                          </div>

                          <div className="bg-slate-950/40 border border-slate-900 p-3.5 rounded-xl space-y-1 text-xs text-slate-400 max-h-24 overflow-y-auto font-mono scrollbar-thin">
                            <div className="text-slate-500 text-[10px] font-bold tracking-wider uppercase mb-1">NARRATION DRAFT</div>
                            <p className="whitespace-pre-line leading-relaxed">{item.script}</p>
                          </div>
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 border-t md:border-t-0 border-slate-900/60 pt-4 md:pt-0">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Thumbnail Idea</span>
                            <span className="text-xs font-semibold text-slate-300 block max-w-xs truncate">{item.thumbnailIdea}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white border border-transparent hover:border-slate-800 transition-all"
                              title="Review & Copy Script"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadScript(item)}
                              className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white border border-transparent hover:border-slate-800 transition-all"
                              title="Download Script"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )

              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* MODAL / DRAWER DETAIL VIEW: Opens Day Script and full assets */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="w-full max-w-2xl h-full bg-[#090e18] border-l border-slate-800/80 p-8 flex flex-col justify-between overflow-y-auto text-slate-100"
            >
              <div className="space-y-6">
                
                {/* Header controls inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-900 border border-slate-800 font-mono text-[10px] font-bold px-2.5 py-1 rounded text-slate-400">
                      DAY {selectedItem.day} SCRIPT
                    </span>
                    <span className="text-slate-500 text-xs font-mono">
                      {new Date(selectedItem.publishingDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadScript(selectedItem)}
                      className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Download text script"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors text-sm font-bold"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Day status controls */}
                <div className="bg-slate-950/40 border border-slate-900 p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Production Stage</span>
                    <p className="text-xs text-slate-300">Set the workflow state for this video project.</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['Scheduled', 'Draft', 'Published'] as const).map(status => {
                      const isActive = selectedItem.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleUpdateItemStatus(selectedItem.id, status)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                            isActive 
                              ? status === 'Published'
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                : status === 'Draft'
                                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                                : 'bg-slate-800 border border-slate-700 text-slate-200'
                              : 'bg-slate-900/40 border border-transparent text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Viral Title Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
                      🎯 Optimized Viral Title
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedItem.title, 'title')}
                      className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                    >
                      {copiedSection === 'title' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Title</span>
                        </>
                      )}
                    </button>
                  </div>
                  <h1 className="text-xl font-bold text-white bg-slate-950/20 border border-slate-900 p-4 rounded-xl leading-snug">
                    {selectedItem.title}
                  </h1>
                </div>

                {/* 3-Sec Scroll Stop Hook */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">
                      ⚡ Scroll-Stopping Hook (First 3-5s)
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedItem.hook, 'hook')}
                      className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                    >
                      {copiedSection === 'hook' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Hook</span>
                        </>
                      )}
                    </button>
                  </div>
                  <blockquote className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl text-slate-200 text-sm leading-relaxed italic">
                    "{selectedItem.hook}"
                  </blockquote>
                </div>

                {/* Main Speech Narration Script */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                      📝 Full Engaging Voiceover Script
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedItem.script, 'script')}
                      className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                    >
                      {copiedSection === 'script' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Full Script</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-900 p-5 rounded-xl space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                      {selectedItem.script}
                    </p>
                  </div>
                </div>

                {/* Thumbnail graphic layout concept */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">
                    🖼️ Thumbnail Design Concept
                  </span>
                  <div className="bg-slate-950/40 border border-slate-900 p-4.5 rounded-xl text-xs text-slate-300 leading-relaxed font-mono">
                    {selectedItem.thumbnailIdea}
                  </div>
                </div>

              </div>

              {/* Action buttons inside drawer footer */}
              <div className="mt-8 pt-4 border-t border-slate-900 flex items-center justify-between gap-4">
                <span className="text-[10px] text-slate-500 font-mono">
                  ViralGap AI SaaS • Production Module
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => copyToClipboard(selectedItem.script, 'script')}
                    className="flex items-center gap-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Script</span>
                  </button>
                  <button
                    onClick={() => downloadScript(selectedItem)}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Script (.txt)</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
