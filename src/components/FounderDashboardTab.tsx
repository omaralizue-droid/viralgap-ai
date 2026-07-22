import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Sparkles, 
  Activity, 
  DollarSign, 
  Zap, 
  BarChart3, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  UserPlus, 
  LogIn, 
  CreditCard, 
  XCircle, 
  Search, 
  Calendar,
  Layers,
  ArrowRight,
  Rocket,
  FileText,
  Mail,
  Megaphone,
  Copy,
  Check,
  Globe,
  HelpCircle,
  CheckSquare,
  Square,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface FounderDashboardTabProps {
  userId: string;
}

export function FounderDashboardTab({ userId }: FounderDashboardTabProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<'business' | 'product' | 'user' | 'gtm'>('business');
  
  // GTM tab specific states
  const [activeGtmSubTab, setActiveGtmSubTab] = useState<'landing' | 'marketing' | 'emails' | 'checklist'>('landing');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [gtmChecklist, setGtmChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('viralgap_gtm_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      'lp_hero': true,
      'lp_features': true,
      'lp_pricing': true,
      'lp_testimonials': false,
      'lp_faq': false,
      'm_ph': false,
      'm_reddit': false,
      'm_twitter': false,
      'm_linkedin': false,
      'm_facebook': false,
      'e_welcome': false,
      'e_upgrade': false,
      'e_trial': false,
      'e_referral': false
    };
  });

  const toggleChecklistItem = (key: string) => {
    const updated = { ...gtmChecklist, [key]: !gtmChecklist[key] };
    setGtmChecklist(updated);
    localStorage.setItem('viralgap_gtm_checklist', JSON.stringify(updated));
  };

  const handleCopyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };
  
  // Simulation form states
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simEventType, setSimEventType] = useState<string>('signup');
  const [simPlan, setSimPlan] = useState<string>('creator');
  const [simValue, setSimValue] = useState<number>(19);
  
  // Custom filter for log stream
  const [logFilter, setLogFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics/dashboard');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setError(null);
      } else {
        setError(data.error || 'Failed to load metrics');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Poll metrics every 15 seconds to simulate real-time live data streaming
    const interval = setInterval(() => {
      fetchMetrics();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSimulating(true);
      const res = await fetch('/api/analytics/simulate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: simEventType,
          plan: simPlan,
          value: simEventType === 'subscription_created' || simEventType === 'subscription_canceled' ? simValue : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        // Fetch new metrics to update display
        await fetchMetrics();
      } else {
        alert(data.error || 'Failed to simulate event');
      }
    } catch (err: any) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleTriggerTrafficSpike = async () => {
    try {
      setSimulating(true);
      // Simulate multiple events consecutively for dynamic chart updating
      const events = ['signup', 'login', 'url_analyzed', 'script_generated', 'content_gap_searched', 'prompt_generated', 'subscription_created'];
      for (const ev of events) {
        await fetch('/api/analytics/simulate-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType: ev, plan: Math.random() > 0.7 ? 'pro' : 'creator' })
        });
      }
      await fetchMetrics();
    } catch (err) {
      console.error('Traffic spike simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleResetAnalytics = async () => {
    if (!window.confirm('Are you absolutely sure you want to clear all analytics history? This will flush the events store.')) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/analytics/clear', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
      });
      const data = await res.json();
      if (data.success) {
        await fetchMetrics();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Quick helper to format money
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading && !metrics) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        {/* Title block Skeleton */}
        <div className="bg-[#0c101d]/60 border border-slate-900 rounded-2xl p-6 relative overflow-hidden">
          <div className="h-4 w-36 bg-slate-800 rounded-full mb-3"></div>
          <div className="h-7 w-80 bg-slate-800 rounded-lg mb-2"></div>
          <div className="h-4 w-2/3 bg-slate-850 rounded-full"></div>
        </div>

        {/* Tab selector skeleton */}
        <div className="flex border-b border-slate-800/60 gap-4 pb-px">
          <div className="h-8 w-40 bg-slate-800 rounded-t-lg"></div>
          <div className="h-8 w-48 bg-slate-850 rounded-t-lg"></div>
          <div className="h-8 w-44 bg-slate-850 rounded-t-lg"></div>
        </div>

        {/* Grid cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-3">
              <div className="h-3 w-28 bg-slate-800 rounded-full"></div>
              <div className="flex justify-between items-baseline pt-1">
                <div className="h-7 w-24 bg-slate-800 rounded-lg"></div>
                <div className="h-4 w-12 bg-slate-800/60 rounded-full"></div>
              </div>
              <div className="h-3 w-36 bg-slate-850 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Charts and logs skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart block skeleton */}
          <div className="lg:col-span-2 bg-[#0c101d]/50 border border-slate-900 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-slate-800 rounded-full"></div>
                <div className="h-3 w-64 bg-slate-850 rounded-full"></div>
              </div>
              <div className="h-6 w-32 bg-slate-800/80 rounded-lg"></div>
            </div>
            <div className="h-72 w-full bg-slate-950/40 rounded-xl flex items-end justify-between p-4 border border-slate-900">
              {/* Simulate chart columns */}
              {[...Array(12)].map((_, idx) => (
                <div 
                  key={idx} 
                  className="w-8 bg-slate-850 rounded-t-md transition-all" 
                  style={{ height: `${20 + Math.sin(idx) * 40}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Right side widgets skeleton */}
          <div className="bg-[#0c101d]/50 border border-slate-900 rounded-2xl p-6 space-y-4">
            <div className="h-4 w-32 bg-slate-800 rounded-full"></div>
            <div className="h-48 w-48 mx-auto rounded-full border-[16px] border-slate-900 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-slate-850 animate-pulse"></div>
            </div>
            <div className="space-y-2 pt-4">
              <div className="h-3 w-full bg-slate-850 rounded-full"></div>
              <div className="h-3 w-2/3 bg-slate-850 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Logs Simulator skeleton */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 w-40 bg-slate-800 rounded-full"></div>
            <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
          </div>
          <div className="space-y-2.5 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-900/40">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-slate-850"></div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 bg-slate-800 rounded-full"></div>
                    <div className="h-2.5 w-24 bg-slate-850 rounded-full"></div>
                  </div>
                </div>
                <div className="h-3 w-16 bg-slate-800 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-lg mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Metrics Engine Error</h3>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <button 
          onClick={fetchMetrics}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Pre-calculate pie data
  const pieData = metrics ? [
    { name: 'Creator ($19)', value: metrics.business.plans.creator, color: '#10b981' },
    { name: 'Pro ($49)', value: metrics.business.plans.pro, color: '#3b82f6' },
    { name: 'Agency ($99)', value: metrics.business.plans.agency, color: '#f59e0b' }
  ] : [];

  // Filter logs based on filters
  const filteredRecent = metrics?.recent ? metrics.recent.filter((log: any) => {
    if (logFilter !== 'all' && log.category !== logFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = log.eventName.toLowerCase().includes(q);
      const matchCategory = log.category.toLowerCase().includes(q);
      const matchUser = log.userId.toLowerCase().includes(q);
      return matchName || matchCategory || matchUser;
    }
    return true;
  }) : [];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Title block */}
      <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wide">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Executive Intelligence Platform
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
              Founder &amp; Product Analytics Command
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Track business unit economics, active user usage, key conversion indicators, and real-time platform event logs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerTrafficSpike}
              disabled={simulating}
              className="px-4 py-2 bg-emerald-500 text-[#070b14] hover:bg-emerald-400 disabled:opacity-50 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/10 font-sans"
            >
              <Zap className="w-3.5 h-3.5" /> Simulate Viral traffic Spike
            </button>
            <button
              onClick={fetchMetrics}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-300 transition-all"
              title="Refresh Analytics data"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Category Selector */}
      <div className="flex border-b border-slate-800/60 pb-px">
        <button
          onClick={() => setActiveMetricTab('business')}
          className={`px-6 py-3 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeMetricTab === 'business' 
              ? 'border-emerald-500 text-white font-bold bg-emerald-500/[0.02]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" /> BUSINESS EVENTS &amp; MRR
        </button>
        <button
          onClick={() => setActiveMetricTab('product')}
          className={`px-6 py-3 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeMetricTab === 'product' 
              ? 'border-emerald-500 text-white font-bold bg-emerald-500/[0.02]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-sky-400" /> PRODUCT USAGE &amp; OPERATIONS
        </button>
        <button
          onClick={() => setActiveMetricTab('user')}
          className={`px-6 py-3 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeMetricTab === 'user' 
              ? 'border-emerald-500 text-white font-bold bg-emerald-500/[0.02]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" /> USER TRAFFIC &amp; CONVERSIONS
        </button>
        <button
          onClick={() => setActiveMetricTab('gtm')}
          className={`px-6 py-3 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeMetricTab === 'gtm' 
              ? 'border-pink-500 text-white font-bold bg-pink-500/[0.02]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Rocket className="w-4 h-4 text-pink-400 animate-pulse" /> LAUNCH DECK &amp; GTM STRATEGY
        </button>
      </div>

      {/* METRIC GRIDS BASED ON CURRENT VIEW */}
      {metrics && activeMetricTab !== 'gtm' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activeMetricTab === 'business' && (
            <>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Monthly Recurring Revenue</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-sans">{formatCurrency(metrics.business.mrr)}</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+14.2%</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Active paid subscriptions revenue monthly</p>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Annual Recurring Revenue</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-sans">{formatCurrency(metrics.business.arr)}</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Runrate</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Calculated based on current MRR * 12</p>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Gross Monthly Churn</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-sans">{metrics.business.churnRate}%</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Healthy</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Percentage of monthly premium dropoffs</p>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Subscription Plans In Effect</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-sans">
                    {metrics.business.plans.creator + metrics.business.plans.pro + metrics.business.plans.agency}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Total Active</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Paid memberships on the database ledger</p>
              </div>
            </>
          )}

          {activeMetricTab === 'product' && (
            <>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">URL analyses</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-sky-400 font-sans">{metrics.product.totalUrlAnalyses}</span>
                  <span className="text-xs font-mono font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">Core Feature</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Total video audits generated using AI</p>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Script generations</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-violet-400 font-sans">{metrics.product.totalScriptGenerations}</span>
                  <span className="text-xs font-mono font-semibold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">Heavy Load</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Complete retention-optimized scripts written</p>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Prompt generations</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-pink-400 font-sans">{metrics.product.totalPromptGenerations}</span>
                  <span className="text-xs font-mono font-semibold text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded">Quick Action</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Thumbnail &amp; visual prompting cards created</p>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Content Gap searches</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-emerald-400 font-sans">{metrics.product.totalContentGapSearches}</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Market Analysis</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Search indexes parsed for YouTube keyword gaps</p>
              </div>
            </>
          )}

          {activeMetricTab === 'user' && (
            <>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Account registrations</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-sans">{metrics.user.totalSignups}</span>
                  <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Growth</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Total signed-up users on database ledger</p>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Conversion rate (CAC)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-sans">{metrics.business.conversionRate}%</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">SaaS Gold standard</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Ratio of registered users buying premium plans</p>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Daily active users (DAU)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-sans">{metrics.user.activeUsersDaily}</span>
                  <span className="text-xs font-mono text-slate-400">DAU</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Logged in and active in past 24 hours</p>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Monthly active users (MAU)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-sans">{metrics.user.activeUsersMonthly}</span>
                  <span className="text-xs font-mono text-slate-400">MAU</span>
                </div>
                <p className="text-slate-500 text-[11px] font-sans">Active usage profile footprint this month</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* DETAILED CHARTS SECTION */}
      {metrics && activeMetricTab !== 'gtm' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualized Line Chart: 30-Day Metrics */}
          <div className="lg:col-span-2 bg-[#0c101d]/50 border border-slate-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-sans">30-Day Historical Trend Analysis</h3>
                <p className="text-xs text-slate-400 font-sans">Visual metrics aggregated daily over the past 30 days</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono px-2.5 py-1 text-emerald-400 bg-slate-950 rounded-lg">Interactive Datastream</span>
              </div>
            </div>

            <div className="h-72 w-full">
              {activeMetricTab === 'business' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                    <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} dx={-8} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0c0c0e', 
                        borderColor: 'rgba(255, 255, 255, 0.08)', 
                        borderRadius: '10px',
                        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)' 
                      }}
                      itemStyle={{ color: '#ffffff', fontSize: '11px' }}
                      labelStyle={{ color: '#a1a1aa', fontWeight: 600, fontSize: '10px', fontFamily: 'monospace', marginBottom: '4px' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#a1a1aa' }} />
                    <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2.5} name="SaaS MRR" fillOpacity={1} fill="url(#colorMrr)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {activeMetricTab === 'product' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                    <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dx={-8} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0c0c0e', 
                        borderColor: 'rgba(255, 255, 255, 0.08)', 
                        borderRadius: '10px',
                        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)' 
                      }}
                      itemStyle={{ color: '#ffffff', fontSize: '11px' }}
                      labelStyle={{ color: '#a1a1aa', fontWeight: 600, fontSize: '10px', fontFamily: 'monospace', marginBottom: '4px' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#a1a1aa' }} />
                    <Bar dataKey="urlAnalyses" fill="#38bdf8" name="URL Audits" stackId="a" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="scriptGenerations" fill="#a78bfa" name="Scripts Generated" stackId="a" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="promptGenerations" fill="#f472b6" name="Prompts" stackId="a" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="contentGapSearches" fill="#34d399" name="Gap Searches" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeMetricTab === 'user' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                    <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dx={-8} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0c0c0e', 
                        borderColor: 'rgba(255, 255, 255, 0.08)', 
                        borderRadius: '10px',
                        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)' 
                      }}
                      itemStyle={{ color: '#ffffff', fontSize: '11px' }}
                      labelStyle={{ color: '#a1a1aa', fontWeight: 600, fontSize: '10px', fontFamily: 'monospace', marginBottom: '4px' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#a1a1aa' }} />
                    <Line type="monotone" dataKey="signups" stroke="#f59e0b" strokeWidth={2.5} name="New Users" dot={false} />
                    <Line type="monotone" dataKey="logins" stroke="#10b981" strokeWidth={2.5} name="Active Logins" dot={false} />
                    <Line type="monotone" dataKey="subscriptions" stroke="#ef4444" strokeWidth={2.5} name="Paid Conversions" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Side Charts / Distribution */}
          <div className="bg-[#0c101d]/50 border border-slate-900 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            {activeMetricTab === 'business' && (
              <>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white font-sans">Paid subscription Tiers</h3>
                  <p className="text-xs text-slate-400 font-sans">Active recurring contracts segmented by tier cost</p>
                </div>
                <div className="h-44 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={72}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(12, 16, 29, 0.8)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0c0c0e', 
                          borderColor: 'rgba(255, 255, 255, 0.08)', 
                          borderRadius: '10px'
                        }}
                        itemStyle={{ color: '#ffffff', fontSize: '11px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Absolute Center stat */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-bold text-white font-sans">
                      {metrics.business.plans.creator + metrics.business.plans.pro + metrics.business.plans.agency}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">Contracts</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300 font-sans">{item.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-white">{item.value} users ({Math.round(item.value / (metrics.business.plans.creator + metrics.business.plans.pro + metrics.business.plans.agency) * 100) || 0}%)</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeMetricTab === 'product' && (
              <>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white font-sans">Engine Feature Distribution</h3>
                  <p className="text-xs text-slate-400 font-sans">What percentage of credits are used on which tools</p>
                </div>
                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'URL analyses', value: metrics.product.totalUrlAnalyses, color: '#38bdf8' },
                          { name: 'Scripts', value: metrics.product.totalScriptGenerations, color: '#a78bfa' },
                          { name: 'Prompts', value: metrics.product.totalPromptGenerations, color: '#f472b6' },
                          { name: 'Gaps', value: metrics.product.totalContentGapSearches, color: '#34d399' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={62}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {[
                          { name: 'URL analyses', color: '#38bdf8' },
                          { name: 'Scripts', color: '#a78bfa' },
                          { name: 'Prompts', color: '#f472b6' },
                          { name: 'Gaps', color: '#34d399' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(12, 16, 29, 0.8)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0c0c0e', 
                          borderColor: 'rgba(255, 255, 255, 0.08)', 
                          borderRadius: '10px'
                        }}
                        itemStyle={{ color: '#ffffff', fontSize: '11px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-sky-400" /> URL Audits ({Math.round(metrics.product.totalUrlAnalyses / (metrics.product.totalUrlAnalyses + metrics.product.totalScriptGenerations + metrics.product.totalPromptGenerations + metrics.product.totalContentGapSearches) * 100) || 0}%)
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-violet-400" /> Scripts ({Math.round(metrics.product.totalScriptGenerations / (metrics.product.totalUrlAnalyses + metrics.product.totalScriptGenerations + metrics.product.totalPromptGenerations + metrics.product.totalContentGapSearches) * 100) || 0}%)
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-pink-400" /> Prompts ({Math.round(metrics.product.totalPromptGenerations / (metrics.product.totalUrlAnalyses + metrics.product.totalScriptGenerations + metrics.product.totalPromptGenerations + metrics.product.totalContentGapSearches) * 100) || 0}%)
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" /> Gaps ({Math.round(metrics.product.totalContentGapSearches / (metrics.product.totalUrlAnalyses + metrics.product.totalScriptGenerations + metrics.product.totalPromptGenerations + metrics.product.totalContentGapSearches) * 100) || 0}%)
                  </div>
                </div>
              </>
            )}

            {activeMetricTab === 'user' && (
              <>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white font-sans">Cohort user retention curve</h3>
                  <p className="text-xs text-slate-400 font-sans">Percentage of active users returning in intervals</p>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.retention} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0c0c0e', 
                          borderColor: 'rgba(255, 255, 255, 0.08)', 
                          borderRadius: '10px',
                          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)' 
                        }}
                        itemStyle={{ color: '#ffffff', fontSize: '11px' }}
                        labelStyle={{ color: '#a1a1aa', fontWeight: 600, fontSize: '10px', fontFamily: 'monospace', marginBottom: '4px' }}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#a78bfa" strokeWidth={2.5} name="Retention" dot={{ r: 3, strokeWidth: 1 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-slate-900/30 p-3 border border-slate-900 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    <strong>Day 30 retention baseline: 58.4%</strong>. This represents a world-class YouTube SaaS benchmark, indicating strong product market fit and long-term stickiness.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeMetricTab !== 'gtm' && (
        /* DYNAMIC SIMULATION EVENT DRIVER */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 lg:col-span-1 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white font-sans">Simulate Live User Activity</h3>
              <p className="text-xs text-slate-400 font-sans">Trigger mock events to verify analytics datastream response and update indicators.</p>
            </div>

            <form onSubmit={handleSimulateEvent} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Event Type to Log</label>
                <select
                  value={simEventType}
                  onChange={(e) => setSimEventType(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 transition-all focus:outline-none"
                >
                  <option value="signup">User Registration (Signup)</option>
                  <option value="login">User Authentication (Login)</option>
                  <option value="subscription_created">Premium Subscription Purchased</option>
                  <option value="subscription_canceled">Premium Subscription Canceled</option>
                  <option value="url_analyzed">Product Event: URL Analysis</option>
                  <option value="script_generated">Product Event: Script Written</option>
                  <option value="prompt_generated">Product Event: Prompt Created</option>
                  <option value="content_gap_searched">Product Event: Content Gap Scan</option>
                </select>
              </div>

              {(simEventType === 'subscription_created' || simEventType === 'subscription_canceled') && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Plan Tier</label>
                    <select
                      value={simPlan}
                      onChange={(e) => {
                        setSimPlan(e.target.value);
                        const priceMap: Record<string, number> = { creator: 19, pro: 49, agency: 99 };
                        setSimValue(priceMap[e.target.value] || 19);
                      }}
                      className="w-full bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 transition-all focus:outline-none"
                    >
                      <option value="creator">Creator ($19)</option>
                      <option value="pro">Professional ($49)</option>
                      <option value="agency">Agency ($99)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">MRR Value ($)</label>
                    <input
                      type="number"
                      value={simValue}
                      onChange={(e) => setSimValue(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 transition-all focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all font-sans"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                {simulating ? 'Simulating event...' : 'Dispatch Simulated Event'}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-900">
              <button
                onClick={handleResetAnalytics}
                className="text-[10px] font-mono font-semibold text-red-400 hover:text-red-300 transition-all flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3 animate-reverse-spin" /> RESET METRICS JOURNAL
              </button>
            </div>
          </div>

          {/* RECENT REAL-TIME ACTIVITY STREAM */}
          <div className="lg:col-span-2 bg-[#0c101d]/50 border border-slate-900 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white font-sans">Live System Log stream</h3>
                <p className="text-xs text-slate-400 font-sans">Real-time database triggers, auth events and purchases</p>
              </div>
              
              {/* Quick Filter badge bar */}
              <div className="flex flex-wrap gap-1">
                <button 
                  onClick={() => setLogFilter('all')}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${logFilter === 'all' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-transparent text-slate-500'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setLogFilter('business')}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${logFilter === 'business' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-transparent text-slate-500'}`}
                >
                  Business
                </button>
                <button 
                  onClick={() => setLogFilter('product')}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${logFilter === 'product' ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400' : 'bg-transparent text-slate-500'}`}
                >
                  Product
                </button>
                <button 
                  onClick={() => setLogFilter('user')}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${logFilter === 'user' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-transparent text-slate-500'}`}
                >
                  Users
                </button>
              </div>
            </div>

            {/* Search inputs */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search stream by event name, category, or target user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-900 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:border-emerald-500 transition-all focus:outline-none placeholder-slate-600"
              />
            </div>

            {/* Event Stream */}
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-900">
              {filteredRecent.length === 0 ? (
                <div className="text-center py-10">
                  <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-mono text-slate-500">No events matched the search filter criteria</p>
                </div>
              ) : (
                filteredRecent.map((log: any) => {
                  let icon = <Activity className="w-3.5 h-3.5 text-sky-400" />;
                  let badgeClass = "bg-sky-500/10 border border-sky-500/20 text-sky-400";
                  
                  if (log.eventName === 'signup') {
                    icon = <UserPlus className="w-3.5 h-3.5 text-amber-400" />;
                    badgeClass = "bg-amber-500/10 border border-amber-500/20 text-amber-400";
                  } else if (log.eventName === 'login') {
                    icon = <LogIn className="w-3.5 h-3.5 text-slate-400" />;
                    badgeClass = "bg-slate-500/10 border border-slate-500/20 text-slate-400";
                  } else if (log.eventName === 'subscription_created') {
                    icon = <CreditCard className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />;
                    badgeClass = "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400";
                  } else if (log.eventName === 'subscription_canceled') {
                    icon = <XCircle className="w-3.5 h-3.5 text-red-400" />;
                    badgeClass = "bg-red-500/10 border border-red-500/20 text-red-400";
                  }

                  // Create usr_ prefix mock ID for user
                  const shortUserId = log.userId.includes('@') 
                    ? log.userId.split('@')[0] 
                    : log.userId.slice(0, 8);
                  const formattedUserId = `usr_${shortUserId.toLowerCase()}`;
                  
                  // Format value
                  const formattedValue = log.value ? ` | val: $${log.value}` : '';

                  // Parse metadata to inline tags
                  const renderMetadataTags = () => {
                    if (!log.metadata) return null;
                    try {
                      const keys = Object.keys(log.metadata);
                      return (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {keys.slice(0, 3).map(k => (
                            <span key={k} className="text-[8px] font-mono bg-white/5 border border-white/5 px-1 py-0.5 rounded text-slate-400">
                              {k}:<span className="text-slate-300 font-semibold">{String(log.metadata[k])}</span>
                            </span>
                          ))}
                        </div>
                      );
                    } catch (e) {
                      return null;
                    }
                  };

                  return (
                    <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-950 border border-slate-900 rounded-xl hover:border-white/10 hover:bg-white/[0.01] transition-all text-xs font-sans gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#070b14] border border-slate-900 rounded-lg text-slate-400 shrink-0">
                          {icon}
                        </div>
                        <div className="space-y-1 text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-white font-mono text-[11px] tracking-tight">
                              {log.eventName.replace('_', ' ').toLowerCase()}
                            </span>
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase leading-none ${badgeClass}`}>
                              {log.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono flex flex-wrap items-center gap-1.5">
                            <span>ID:</span>
                            <span className="text-slate-300 font-semibold bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{formattedUserId}</span>
                            {formattedValue && (
                              <>
                                <span className="text-slate-700">|</span>
                                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/10 rounded">{formattedValue.replace(' | val: ', '')}</span>
                              </>
                            )}
                          </div>
                          {renderMetadataTags()}
                        </div>
                      </div>
                      
                      <div className="text-left sm:text-right shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-900/60">
                        <span className="text-[10px] font-mono text-slate-400 font-medium">
                          {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="text-[9px] font-mono text-slate-600 block sm:mt-1">
                          {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* GTM LAUNCH COMMAND & CODES DECK */}
      {activeMetricTab === 'gtm' && (
        <div className="space-y-8 animate-fade-in text-left">
          
          {/* Sub-Header bar for GTM resources */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 border border-slate-900 rounded-2xl">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-pink-500 animate-bounce" />
              <div>
                <h3 className="text-sm font-bold text-white font-sans">ViralGap AI launch Strategy Suite</h3>
                <p className="text-xs text-slate-400 font-sans">Deploy landing page copies, social launch scripts, and transactional customer emails</p>
              </div>
            </div>
            
            {/* Nav pills */}
            <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveGtmSubTab('landing')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeGtmSubTab === 'landing' ? 'bg-pink-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Globe className="w-3.5 h-3.5" /> Landing Copy
              </button>
              <button
                onClick={() => setActiveGtmSubTab('marketing')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeGtmSubTab === 'marketing' ? 'bg-pink-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Megaphone className="w-3.5 h-3.5" /> Launch Campaigns
              </button>
              <button
                onClick={() => setActiveGtmSubTab('emails')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeGtmSubTab === 'emails' ? 'bg-pink-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Mail className="w-3.5 h-3.5" /> Launch Emails
              </button>
              <button
                onClick={() => setActiveGtmSubTab('checklist')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeGtmSubTab === 'checklist' ? 'bg-pink-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <CheckSquare className="w-3.5 h-3.5" /> Checklist roadmap
              </button>
            </div>
          </div>

          {/* TAB 1: LANDING PAGE */}
          {activeGtmSubTab === 'landing' && (
            <div className="space-y-6">
              
              {/* Card 1: Hero Section */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4 relative">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-pink-500/10 text-pink-400 rounded-lg text-xs font-bold font-mono">SECTION 1</span>
                    <h4 className="text-sm font-bold text-white">Hero &amp; Conversion Hook</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Headline: Crack the YouTube Algorithm. Mine Your Competitors' Viral Secrets.\nSubheadline: ViralGap AI reverse-engineers high-performing videos in your niche, crafts 10x better hook variations, and generates fully structured viral scripts in seconds. Turn views into an automated cash flow.\nPrimary CTA: Start Free Copywriting & Scripting\nSecondary CTA: Explore Viral Predictor`, 
                      'lp_hero'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'lp_hero' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'lp_hero' ? 'Copied Hero Section!' : 'Copy Hero Assets'}
                  </button>
                </div>
                
                <div className="space-y-3 font-sans">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Main Display Headline (High CTR Hook)</span>
                    <p className="text-lg font-bold text-white tracking-tight leading-tight">
                      Crack the YouTube Algorithm. Mine Your Competitors' Viral Secrets.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Body Sub-headline</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ViralGap AI reverse-engineers high-performing videos in your niche, crafts 10x better hook variations, and generates fully structured viral scripts in seconds. Turn views into an automated cash flow.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <div className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs">
                      CTA: Start Free Copywriting &amp; Scripting
                    </div>
                    <div className="px-3 py-1.5 bg-slate-900 text-slate-300 font-semibold border border-slate-800 rounded-lg text-xs">
                      CTA: Explore Viral Predictor
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Features Section */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-pink-500/10 text-pink-400 rounded-lg text-xs font-bold font-mono">SECTION 2</span>
                    <h4 className="text-sm font-bold text-white">Features Architecture (Bento Grid Copy)</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Feature 1: Algorithmic Video Competitor Watch - Deep-scans rival channels, estimates CTR peaks, and exposes wide-open content gaps.\nFeature 2: 9-Factor Psychological Analysis - Audio-to-text behavioral model scoring pacing, social proof, emotional triggers, and hook strength.\nFeature 3: 10x Hook & Story Angle Generator - Stretches a single concept into 10 alternative high-retention hooks and 5 storytelling angles.`, 
                      'lp_features'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'lp_features' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'lp_features' ? 'Copied Features!' : 'Copy Features Grid'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#070b14] border border-slate-900 p-4 rounded-xl space-y-2 text-left">
                    <Search className="w-5 h-5 text-emerald-400" />
                    <h5 className="text-xs font-bold text-white">Algorithmic Competitor Watch</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Deep-scans rival channels, estimates CTR peaks, and exposes wide-open content gaps so you always know what to script next.
                    </p>
                  </div>
                  <div className="bg-[#070b14] border border-slate-900 p-4 rounded-xl space-y-2 text-left">
                    <Activity className="w-5 h-5 text-sky-400" />
                    <h5 className="text-xs font-bold text-white">9-Factor Psychological Analysis</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Advanced transcript behavioral models scoring pacing, curiosity gaps, emotion triggers, authority signals, and hook strength.
                    </p>
                  </div>
                  <div className="bg-[#070b14] border border-slate-900 p-4 rounded-xl space-y-2 text-left">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h5 className="text-xs font-bold text-white">10x Hook &amp; Angle Generator</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Instantly stretches any single transcript idea into 10 alternative high-retention hooks and 5 different viral storytelling angles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Pricing Section */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-pink-500/10 text-pink-400 rounded-lg text-xs font-bold font-mono">SECTION 3</span>
                    <h4 className="text-sm font-bold text-white">SaaS Pricing Architecture</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Free Sandbox: 5 video audits per month, standard AI assistance. ($0/forever)\nCreator Copilot: 500 premium creation credits/mo, full AI scriptwriter. ($19/mo)\nProfessional Growth: 1,500 premium credits/mo, opportunity trends scanner, unlimited content calendars. ($49/mo)\nAgency Enterprise: 5,000 premium credits/mo, team seats, automated Slack alert delivery, priority queue. ($99/mo)`, 
                      'lp_pricing'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'lp_pricing' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'lp_pricing' ? 'Copied Pricing!' : 'Copy Pricing Deck'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                  <div className="bg-[#070b14] border border-slate-900 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-slate-400">Free Sandbox</h5>
                    <span className="text-xl font-bold text-white font-mono">$0</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">5 monthly audits, standard pacing scores, and public community calendar.</p>
                  </div>
                  <div className="bg-emerald-500/[0.02] border border-emerald-500/20 p-4 rounded-xl space-y-2 relative">
                    <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[8px] font-mono rounded uppercase">MOST POPULAR</div>
                    <h5 className="font-bold text-emerald-400">Creator Copilot</h5>
                    <span className="text-xl font-bold text-white font-mono">$19<span className="text-[10px] text-slate-500">/mo</span></span>
                    <p className="text-[10px] text-slate-400 leading-relaxed">500 premium credits, full AI scriptwriter, 10 alternative hooks, 45-day referral program access.</p>
                  </div>
                  <div className="bg-[#070b14] border border-slate-900 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-sky-400">Professional</h5>
                    <span className="text-xl font-bold text-white font-mono">$49<span className="text-[10px] text-slate-500">/mo</span></span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">1,500 premium credits, opportunity trends scanner, unlimited custom content calendars, email reports.</p>
                  </div>
                  <div className="bg-[#070b14] border border-slate-900 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-amber-500 font-mono uppercase tracking-wide">Agency Enterprise</h5>
                    <span className="text-xl font-bold text-white font-mono">$99<span className="text-[10px] text-slate-500">/mo</span></span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">5,000 premium credits, multi-seat teams, automated Webhook delivery, direct slack alert push, high-speed queue.</p>
                  </div>
                </div>
              </div>

              {/* Card 4: Testimonials Block */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-pink-500/10 text-pink-400 rounded-lg text-xs font-bold font-mono">SECTION 4</span>
                    <h4 className="text-sm font-bold text-white">Social Proof Testimonials</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `"I went from 3.2% to 11.4% average CTR on my tech reviews using the Curiosity Gap optimizer. Literally added 150k subscribers in 45 days." — Devin Chen, TechVlog creator\n"ViralGap AI is my secret script writer. The 9-factor hook scoring system helps me write shorts scripts in 2 minutes instead of 2 hours." — Lily S., Short-form Content Creator`, 
                      'lp_testimonials'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'lp_testimonials' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'lp_testimonials' ? 'Copied Testimonials!' : 'Copy Testimonials'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans leading-normal">
                  <div className="bg-[#070b14] border border-slate-900 p-4 rounded-xl space-y-2 text-left italic text-slate-300">
                    <p>"I went from 3.2% to 11.4% average CTR on my tech reviews using the Curiosity Gap optimizer. Literally added 150k subscribers in 45 days."</p>
                    <span className="text-[10px] font-bold text-slate-400 font-sans block not-italic">— Devin Chen, TechVlog creator (280k subs)</span>
                  </div>
                  <div className="bg-[#070b14] border border-slate-900 p-4 rounded-xl space-y-2 text-left italic text-slate-300">
                    <p>"ViralGap AI is my secret script writer. The 9-factor hook scoring system helps me write shorts scripts in 2 minutes instead of 2 hours."</p>
                    <span className="text-[10px] font-bold text-slate-400 font-sans block not-italic">— Lily S., Short-form Content Creator (1.2M TikTok followers)</span>
                  </div>
                </div>
              </div>

              {/* Card 5: FAQs Section */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-pink-500/10 text-pink-400 rounded-lg text-xs font-bold font-mono">SECTION 5</span>
                    <h4 className="text-sm font-bold text-white">Interactive Landing FAQs</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Q: How do the credits work?\nA: Each credit analyzes a video or generates a full script. Free tier gets 5/mo; Creator gets 500/mo.\nQ: Can I use this for Shorts and TikTok?\nA: Yes! Our hook variations are optimized for the critical first 3-second visual and audio loop.\nQ: What is the affiliate program commission?\nA: We pay 30% lifetime recurring commissions on all cash flow brought by your custom link. Min withdrawal is $20.`, 
                      'lp_faq'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'lp_faq' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'lp_faq' ? 'Copied FAQs!' : 'Copy FAQ copy'}
                  </button>
                </div>
                
                <div className="space-y-2.5 font-sans">
                  {[
                    { q: "How do the credits work?", a: "Each credit allows you to perform deep psychological analyses of video transcripts or run the 10x hook generator. Free accounts receive 5 monthly, while Creator Copilots get 500 credits pre-loaded." },
                    { q: "Can I use this for short-form video formats (Shorts, TikTok, Reels)?", a: "Absolutely. The algorithm features dedicated scoring criteria specifically designed for fast-paced pacing, dramatic emotional hooks, and looping CTA triggers that dominate short-form feeds." },
                    { q: "How does the Affiliate Program work?", a: "Every user has a unique referral link. Introduce other creators. When they upgrade to a paid subscription, you receive 30% recurring cash commission on their payments for as long as they stay subscribed. Payouts are sent via PayPal, Wise, or direct wire." }
                  ].map((faq, idx) => {
                    const isOpen = expandedFaq === idx;
                    return (
                      <div key={idx} className="bg-[#070b14] border border-slate-900 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(isOpen ? null : idx)}
                          className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-white focus:outline-none"
                        >
                          <span className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-pink-400" /> {faq.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-950 pt-2.5">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MARKETING CAMPAIGNS */}
          {activeGtmSubTab === 'marketing' && (
            <div className="space-y-6">
              
              {/* PH card */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded text-[9px] font-bold font-mono">PRODUCT HUNT</span>
                    <h4 className="text-sm font-bold text-white">PH Launch copy</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Tagline: Competitor watching & AI YouTube script copilot\nDescription: Enter any YouTube URL. Reverse-engineer hook strength, emotional triggers, pacing, and story structures. Instantly write 10 alternative high-retention hooks and psychological full video scripts in seconds!\nFirst Comment: Hey Hunters! 🚀 Over the last year, we watched hundreds of creators struggle with blank page syndrome and low CTR. We built ViralGap AI to solve this. Analyze competitors, get 10 alternative hooks, write scripts instantly. Let us know your feedback!`, 
                      'm_ph'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'm_ph' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'm_ph' ? 'Copied PH Campaign!' : 'Copy PH Blueprint'}
                  </button>
                </div>
                <div className="space-y-3 text-xs font-mono">
                  <p className="text-slate-400"><strong className="text-white font-sans">Tagline:</strong> Competitor watching &amp; AI YouTube script copilot</p>
                  <p className="text-slate-400 leading-normal"><strong className="text-white font-sans">Launch Copy:</strong> ViralGap AI crawls any video URL, reverse-engineers viral hook structures, emotional vectors, and pacing. It generates 10x optimized scripts in seconds so you can turn competitors' data into views.</p>
                  <div className="p-3 bg-slate-900/40 rounded-xl space-y-1 border border-slate-900 text-slate-300 font-sans leading-relaxed">
                    <strong className="text-[10px] font-mono text-slate-500 uppercase block">First Comment Hook:</strong>
                    "Hey Hunters! 🚀 We built ViralGap AI because content creation shouldn't be about guessing. We spent months modeling video pacing and retention triggers. ViralGap AI makes competitor research actionable. Can't wait for your honest feedback!"
                  </div>
                </div>
              </div>

              {/* Reddit Campaign */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-[9px] font-bold font-mono">REDDIT</span>
                    <h4 className="text-sm font-bold text-white">Self-Promo Reddit Post</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Subject: I built an AI tool that reverse-engineers viral YouTube videos so you can write scripts in seconds\nBody: Hey creators! Tired of guessing what makes videos go viral? I got frustrated spending hours analyzing pacing and CTRs of top channels, so I built ViralGap AI. It scrapes any YouTube video, breaks down emotional triggers, pacing, hook score, and writes 10 optimized hooks/full scripts. Give it a run for free, no CC required! Let me know what you think!`, 
                      'm_reddit'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'm_reddit' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'm_reddit' ? 'Copied Reddit Campaign!' : 'Copy Reddit Post'}
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <p className="font-mono text-slate-400"><strong className="text-white font-sans block text-[10px] uppercase text-slate-500">Target Subreddits:</strong> /r/SideProject, /r/SaaS, /r/NewTubers, /r/creators</p>
                  <p className="font-mono text-slate-400 leading-normal"><strong className="text-white font-sans block text-[10px] uppercase text-slate-500">Subject:</strong> I built an AI tool that reverse-engineers viral YouTube videos so you can write scripts in seconds</p>
                  <div className="p-3 bg-slate-900/40 rounded-xl space-y-2 border border-slate-900 text-slate-300 font-sans leading-relaxed">
                    <strong className="text-[10px] font-mono text-slate-500 uppercase block">Post Body Copy:</strong>
                    "Hey creators! I got tired of spending hours manually analyzing top channels to find their retention tricks. So I wrote ViralGap AI. It scrapes any video URL, estimates CTR peaks, scores pacing, and outputs 10 high-retention alternative hooks. It's completely free to start: check it out and tell me what you'd change!"
                  </div>
                </div>
              </div>

              {/* Twitter Campaign */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded text-[9px] font-bold font-mono">TWITTER / X</span>
                    <h4 className="text-sm font-bold text-white">Viral Thread sequence</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Tweet 1: Most creators fail not because their content is bad, but because they mess up the first 5 seconds. Here is how we're fixing it with ViralGap AI. A thread 🧵\nTweet 2: Introducing ViralGap AI: Your competitor intelligence copilot. Enter any YouTube URL. In 40 seconds, the engine breaks down hook strength, emotional triggers, pacing, and story structure.\nTweet 3: Plus, it outputs 10 custom alternative hook angles so you can instantly multiply your script click-through rates. Get 5 free audits: https://viralgap.ai`, 
                      'm_twitter'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'm_twitter' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'm_twitter' ? 'Copied Twitter Thread!' : 'Copy X Thread'}
                  </button>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-slate-900/40 rounded-xl space-y-1 border border-slate-900">
                    <span className="text-[9px] text-sky-400 font-bold block uppercase">TWEET 1 (Hook)</span>
                    <p className="text-slate-300 font-sans">Most creators fail not because their content is bad, but because they mess up the first 5 seconds. Here is how we're fixing it with ViralGap AI. A thread 🧵</p>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl space-y-1 border border-slate-900">
                    <span className="text-[9px] text-sky-400 font-bold block uppercase">TWEET 2 (Value)</span>
                    <p className="text-slate-300 font-sans">Introducing @ViralGapAI: Your competitor intelligence copilot. Enter any YouTube URL. In 40 seconds, the engine breaks down hook strength, emotional triggers, pacing, and story structure.</p>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl space-y-1 border border-slate-900">
                    <span className="text-[9px] text-sky-400 font-bold block uppercase">TWEET 3 (CTA)</span>
                    <p className="text-slate-300 font-sans">Plus, it outputs 10 custom alternative hook angles so you can instantly multiply your script click-through rates. Get 5 free audits: https://viralgap.ai</p>
                  </div>
                </div>
              </div>

              {/* LinkedIn / FB Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-blue-500 font-mono text-[10px] font-bold uppercase">LINKEDIN PROFILE</span>
                    <button 
                      onClick={() => handleCopyToClipboard(
                        `The content creation industry is changing rapidly. Success is no longer about guessing; it's about systems. Today, we're launching ViralGap AI to help founders, brands, and creators systematically craft high-performance video scripts using competitor intelligence. Here is the framework...`, 
                        'm_linkedin'
                      )}
                      className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1"
                    >
                      {copiedKey === 'm_linkedin' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    "The content creation economy is professionalizing. Brands are building video operations. Today we're launching ViralGap AI to help video teams systematically audit, optimize, and generate viral scripts based on proven competitor CTR performance."
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-indigo-400 font-mono text-[10px] font-bold uppercase">FACEBOOK CREATOR GROUP</span>
                    <button 
                      onClick={() => handleCopyToClipboard(
                        `Hey creators group! 🎬 Excited to share a tool I've been working on to help us write high-retention scripts faster. ViralGap AI scans top videos, scores hook strengths, and outputs full script versions. It has helped some beta testers triple their CTRs. It's completely free to start: check it out at...`, 
                        'm_facebook'
                      )}
                      className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1"
                    >
                      {copiedKey === 'm_facebook' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    "Hey creators group! 🎬 Excited to share a tool I've been working on to help us write high-retention scripts faster. ViralGap AI scans top videos, scores hook strengths, and outputs full script versions. It has helped some beta testers triple their CTRs. It's completely free to start: check it out!"
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: AUTOMATED EMAILS */}
          {activeGtmSubTab === 'emails' && (
            <div className="space-y-6">
              
              {/* Email 1: Welcome */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 bg-pink-500/10 text-pink-400 rounded text-[9px] font-bold font-mono">AUTOMATION 1</span>
                    <h4 className="text-sm font-bold text-white">Welcome Email Copy</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Subject: Welcome to ViralGap AI — Let's craft your first viral video\nBody: Hey [Name]! Thanks for joining ViralGap AI. Your account is pre-loaded with 5 free credits. To get started: 1. Paste any video URL into the Analyzer. 2. Review the 9 key psychological metrics. 3. Click 'Generate Script' to write a 10x version. Click here to begin: [Link]`, 
                      'e_welcome'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'e_welcome' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'e_welcome' ? 'Copied Welcome Copy!' : 'Copy Welcome Email'}
                  </button>
                </div>
                <div className="space-y-2 text-xs font-mono leading-relaxed text-slate-400">
                  <p><strong className="text-white font-sans">Subject:</strong> Welcome to ViralGap AI — Let's craft your first viral video</p>
                  <div className="p-3 bg-[#070b14] rounded-xl border border-slate-900 text-slate-300 font-sans space-y-2">
                    <p>Hey {"{First Name}"},</p>
                    <p>Thanks for signing up to ViralGap AI! Your account is activated and loaded with 5 free credits.</p>
                    <p>Don't waste time looking at a blank page. Copy any YouTube video URL that has high engagement in your niche, paste it into your workspace, and let the engine extract the exact hook pacing and story structures. Click 'Generate Script' to write a 10x version immediately.</p>
                    <p>Best regards,<br/>The ViralGap Team</p>
                  </div>
                </div>
              </div>

              {/* Email 2: Upgrade */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 bg-pink-500/10 text-pink-400 rounded text-[9px] font-bold font-mono">AUTOMATION 2</span>
                    <h4 className="text-sm font-bold text-white">Upgrade Promotion Email</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Subject: Double your views with Creator Copilot (50% Off Your First Month)\nBody: Hey [Name], you've audited your first few videos! Now it's time to scale. Upgrade to Creator Copilot today to unlock 500 premium credits, full AI scriptwriters, and competitor tracking tools. Use coupon GROW50 for 50% off: [Upgrade Link]`, 
                      'e_upgrade'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'e_upgrade' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'e_upgrade' ? 'Copied Upgrade copy!' : 'Copy Upgrade Email'}
                  </button>
                </div>
                <div className="space-y-2 text-xs font-mono leading-relaxed text-slate-400">
                  <p><strong className="text-white font-sans">Subject:</strong> Double your views with Creator Copilot (50% Off Your First Month)</p>
                  <div className="p-3 bg-[#070b14] rounded-xl border border-slate-900 text-slate-300 font-sans space-y-2">
                    <p>Hey {"{First Name}"},</p>
                    <p>You've successfully audited your first videos and unlocked high-performing hooks. But writing scripts one-by-one with tight limits can slow you down.</p>
                    <p>Upgrade to the <strong>Creator Copilot Tier</strong> today to secure <strong>500 premium credits</strong>, unlimited content calendars, full AI script writing blocks, and automatic opportunity alerts. Use code <span className="font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-400 font-bold text-[10px]">GROW50</span> to get 50% off your first month!</p>
                    <p>Cheers,<br/>The ViralGap Growth Team</p>
                  </div>
                </div>
              </div>

              {/* Email 3: Trial Ending */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 bg-pink-500/10 text-pink-400 rounded text-[9px] font-bold font-mono">AUTOMATION 3</span>
                    <h4 className="text-sm font-bold text-white">Trial Ending / Credits Low Alert</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Subject: Your free credits are running low — don't lose your viral momentum\nBody: Hey [Name], you have used 4 of your 5 free credits. Don't let your scripting workflow pause. Upgrade now to secure your monthly credits and keep generating viral hook angles every single day: [Link]`, 
                      'e_trial'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'e_trial' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'e_trial' ? 'Copied low credits copy!' : 'Copy low credits alert'}
                  </button>
                </div>
                <div className="space-y-2 text-xs font-mono leading-relaxed text-slate-400">
                  <p><strong className="text-white font-sans">Subject:</strong> Your free credits are running low — don't lose your viral momentum</p>
                  <div className="p-3 bg-[#070b14] rounded-xl border border-slate-900 text-slate-300 font-sans space-y-2">
                    <p>Hey {"{First Name}"},</p>
                    <p>Heads up! You have used 4 of your 5 free credits. Don't let your scripting workflow pause.</p>
                    <p>To keep generating alternative hooks, competitor content gap reports, and structured story psychological breakdowns every day, upgrade to a premium tier. Secure your next 500 credits now and make your channel unstoppable!</p>
                    <p>Warmly,<br/>The ViralGap Analytics Team</p>
                  </div>
                </div>
              </div>

              {/* Email 4: Referral Partner Invite */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 bg-pink-500/10 text-pink-400 rounded text-[9px] font-bold font-mono">AUTOMATION 4</span>
                    <h4 className="text-sm font-bold text-white">Affiliate Partner Invite Copy</h4>
                  </div>
                  <button
                    onClick={() => handleCopyToClipboard(
                      `Subject: Earn 30% lifetime recurring cash as a ViralGap Partner\nBody: Hey [Name], did you know you can earn cash just by sharing ViralGap AI? We just launched our Creator Affiliate Program. Share your unique link and earn 30% recurring cash commission on every upgrade for life. Check your unique link here: [Link]`, 
                      'e_referral'
                    )}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                  >
                    {copiedKey === 'e_referral' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'e_referral' ? 'Copied Referral copy!' : 'Copy Referral Email'}
                  </button>
                </div>
                <div className="space-y-2 text-xs font-mono leading-relaxed text-slate-400">
                  <p><strong className="text-white font-sans">Subject:</strong> Earn 30% lifetime recurring cash as a ViralGap Partner</p>
                  <div className="p-3 bg-[#070b14] rounded-xl border border-slate-900 text-slate-300 font-sans space-y-2">
                    <p>Hey {"{First Name}"},</p>
                    <p>Did you know you can earn cash just by telling other creators about ViralGap AI?</p>
                    <p>We just launched our **Creator Affiliate Program** which pays a permanent **30% lifetime recurring commission** on every single subscription charge. Introduce a creator who upgrades to the $49/mo plan, and you receive $14.70/mo, month after month.</p>
                    <p>Plus, get +10 creation credits immediately for every free signup who registers with your unique link.</p>
                    <p>Best regards,<br/>The ViralGap Growth Office</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: INTERACTIVE CHECKLIST */}
          {activeGtmSubTab === 'checklist' && (
            <div className="space-y-6">
              
              {/* Checklist details & progress bar */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-white">Pre-Launch &amp; GTM Roadmap</h4>
                <p className="text-xs text-slate-400">Cross-off GTM milestones dynamically as you prepare ViralGap AI for the official hunt.</p>
                
                {/* Calculate checklist progress */}
                {(() => {
                  const items = Object.keys(gtmChecklist);
                  const completed = items.filter(k => gtmChecklist[k]).length;
                  const pct = Math.round((completed / items.length) * 100);
                  return (
                    <div className="space-y-2 py-1">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Roadmap Progress ({completed}/{items.length} milestones complete)</span>
                        <span className="text-white font-bold">{pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                  
                  {/* Category A: Landing Page & Tech */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-wider">A. Landing Page &amp; Tech stack</h5>
                    <div className="space-y-2">
                      {[
                        { key: 'lp_hero', label: "Finalize high-CTR Hero headline copywriting" },
                        { key: 'lp_features', label: "Setup bento feature grid copy assets" },
                        { key: 'lp_pricing', label: "Establish multi-tier SaaS prices ($19, $49, $99)" },
                        { key: 'lp_testimonials', label: "Embed user testimonial cards & quotes" },
                        { key: 'lp_faq', label: "Implement collapsible interactive FAQs widget" }
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => toggleChecklistItem(item.key)}
                          className="w-full flex items-center gap-3 p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-900 rounded-xl text-left text-xs transition-all"
                        >
                          {gtmChecklist[item.key] ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-600 shrink-0" />}
                          <span className={gtmChecklist[item.key] ? "line-through text-slate-500" : "text-slate-300"}>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category B: Campaigns & Outreaches */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-wider">B. Launch Marketing &amp; Email alerts</h5>
                    <div className="space-y-2">
                      {[
                        { key: 'm_ph', label: "Draft Product Hunt comment & launch tagline" },
                        { key: 'm_reddit', label: "Schedule self-promo post in /r/SideProject" },
                        { key: 'm_twitter', label: "Pre-schedule X launch thread sequence" },
                        { key: 'm_linkedin', label: "Prepare LinkedIn corporate SaaS launch copy" },
                        { key: 'm_facebook', label: "Identify target Facebook YouTuber groups" },
                        { key: 'e_welcome', label: "Deploy welcome email to SMTP transaction block" },
                        { key: 'e_upgrade', label: "Connect upgrade campaign 50% discount coupon" },
                        { key: 'e_trial', label: "Setup credits-low webhook notification hook" },
                        { key: 'e_referral', label: "Activate affiliate partner recruitment flow" }
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => toggleChecklistItem(item.key)}
                          className="w-full flex items-center gap-3 p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-900 rounded-xl text-left text-xs transition-all"
                        >
                          {gtmChecklist[item.key] ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-600 shrink-0" />}
                          <span className={gtmChecklist[item.key] ? "line-through text-slate-500" : "text-slate-300"}>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
