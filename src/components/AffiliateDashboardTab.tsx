import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Users, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Send, 
  Clock, 
  RotateCw, 
  Zap, 
  AlertCircle, 
  ChevronRight, 
  Search, 
  Info,
  Gift,
  HelpCircle,
  ExternalLink,
  UserPlus,
  Coins,
  CheckCircle2,
  Lock
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
  Legend
} from 'recharts';

interface AffiliateDashboardTabProps {
  userId: string;
}

export function AffiliateDashboardTab({ userId }: AffiliateDashboardTabProps) {
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Payout request states
  const [requestingPayout, setRequestingPayout] = useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(50);
  const [payoutMethod, setPayoutMethod] = useState<string>('PayPal');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);
  const [payoutErrorMsg, setPayoutErrorMsg] = useState<string | null>(null);
  
  // Simulation panel states
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simAction, setSimAction] = useState<'click' | 'signup' | 'conversion'>('click');
  const [simEmail, setSimEmail] = useState<string>('');
  const [simPlan, setSimPlan] = useState<'creator' | 'pro' | 'agency'>('creator');
  const [simSuccessMsg, setSimSuccessMsg] = useState<string | null>(null);

  // Search/Filter for Referral Records
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const referralLink = `${window.location.origin}/?ref=${userId}`;

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const [statsRes, leaderboardRes] = await Promise.all([
        fetch(`/api/referrals/stats?userId=${userId}`),
        fetch('/api/referrals/leaderboard')
      ]);

      const statsData = await statsRes.json();
      const leaderboardData = await leaderboardRes.json();

      if (statsData.success && leaderboardData.success) {
        setStats(statsData.stats);
        setLeaderboard(leaderboardData.leaderboard);
        setError(null);
      } else {
        setError(statsData.error || leaderboardData.error || 'Failed to load referral metrics.');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to analytics servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [userId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stats || payoutAmount <= 0) return;
    if (payoutAmount > stats.unpaidCommission) {
      setPayoutErrorMsg(`Insufficient balance. You can request up to ${formatCurrency(stats.unpaidCommission)}.`);
      return;
    }

    try {
      setRequestingPayout(true);
      setPayoutSuccessMsg(null);
      setPayoutErrorMsg(null);

      const res = await fetch('/api/referrals/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: payoutAmount,
          method: payoutMethod
        })
      });

      const data = await res.json();
      if (data.success) {
        setPayoutSuccessMsg(`Successfully requested payout of ${formatCurrency(payoutAmount)} via ${payoutMethod}!`);
        fetchReferralData(); // Refresh records
      } else {
        setPayoutErrorMsg(data.error || 'Failed to request payout.');
      }
    } catch (err: any) {
      setPayoutErrorMsg(err.message || 'Failed to send payout request.');
    } finally {
      setRequestingPayout(false);
    }
  };

  const handleSimulate = async (action: 'click' | 'signup' | 'conversion') => {
    try {
      setSimulating(true);
      setSimSuccessMsg(null);

      const res = await fetch('/api/referrals/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          referrerId: userId,
          email: simEmail || undefined,
          tier: action === 'conversion' ? simPlan : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setSimSuccessMsg(data.message);
        setSimEmail('');
        fetchReferralData(); // Refresh UI
      } else {
        alert(data.error || 'Failed to run simulation.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val);
  };

  // Filter list of referrals
  const filteredReferrals = stats?.referralsList ? stats.referralsList.filter((ref: any) => {
    if (statusFilter !== 'all' && ref.status !== statusFilter) return false;
    if (searchQuery) {
      return ref.referredEmail.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }) : [];

  // Determine rewards achievements
  const totalSignups = stats?.signups || 0;
  const creditsEarned = totalSignups * 10;
  const hasFreeMonth = totalSignups >= 5;

  if (loading && !stats) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <RotateCw className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading affiliate core database...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Affiliate Engine Offline</h3>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <button 
          onClick={fetchReferralData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs"
        >
          Reconnect Stream
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Top Banner & Link Builder */}
      <div className="bg-[#0c101d]/60 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wide">
              <Gift className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> Creator Affiliate Program
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
              Share Your Affiliate Link. Get Recurring Cash.
            </h2>
            <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
              Earn a life-time <span className="text-emerald-400 font-bold">30% recurring cash commission</span> for every content creator you introduce who upgrades to a paid plan. Plus, get immediate performance extra credits!
            </p>

            {/* Custom Unique Link Box */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500 select-all"
                />
                <span className="absolute right-3 top-3.5 text-[8px] font-mono font-bold text-slate-500 uppercase">UNIQUE PARTNER ID</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="px-5 py-3 bg-emerald-500 text-[#070b14] hover:bg-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied Link!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Referral Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sharing card */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Quick Share Channels</span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Streamline your YouTube workflow with this AI Creator copilot! Sign up using my special partner link: ${referralLink}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-xs text-slate-300 transition-all gap-1 font-mono text-[10px]"
              >
                <Share2 className="w-3.5 h-3.5 text-sky-400" />
                X/Twitter
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hey! Try out this YouTube analytics and AI video script generator tool. It's crazy useful: ${referralLink}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-xs text-slate-300 transition-all gap-1 font-mono text-[10px]"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent('Exclusive AI Creator Tool Invitation')}&body=${encodeURIComponent(`Check out this incredible AI optimization system for content creators. Sign up through my unique partner link here: ${referralLink}`)}`}
                className="flex flex-col items-center justify-center p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-xs text-slate-300 transition-all gap-1 font-mono text-[10px]"
              >
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                Email invite
              </a>
            </div>
            <p className="text-[10px] text-slate-500 font-sans text-center leading-normal">
              Cookies are stored for <strong>45 days</strong>. Any visitor registering within that window is pinned to your partner dashboard.
            </p>
          </div>

        </div>
      </div>

      {/* Rewards Progress Tracker Box */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-emerald-400" /> Your Referral Rewards Milestone Meter
            </h3>
            <p className="text-xs text-slate-400">Grow your network and unlock permanent platform incentives automatically.</p>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Credits Awarded: <strong className="text-white">{creditsEarned}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-4 h-4 text-sky-400" />
              <span>Milestone: <strong className={hasFreeMonth ? "text-emerald-400" : "text-white"}>{hasFreeMonth ? "Free month active" : "Pending 5 signups"}</strong></span>
            </div>
          </div>
        </div>

        {/* Real-time rewards roadmap tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Milestone 1 Card */}
          <div className="bg-[#070b14] border border-slate-900 p-4 rounded-xl flex items-start gap-3 relative overflow-hidden">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
              <Coins className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-sans">1 Referral = +10 Extra Credits</span>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase">UNLIMITED</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Every friend who signs up with your link instantly gifts you 10 extra creation credits. No limits!
              </p>
              <div className="pt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Already earned +{creditsEarned} extra credits!
              </div>
            </div>
          </div>

          {/* Milestone 2 Card */}
          <div className={`bg-[#070b14] border p-4 rounded-xl flex items-start gap-3 relative overflow-hidden transition-all ${hasFreeMonth ? 'border-emerald-500/20 bg-emerald-500/[0.01]' : 'border-slate-900'}`}>
            <div className={`p-2 rounded-lg border ${hasFreeMonth ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
              <Award className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-sans">5 Referrals = Free Creator Month</span>
                {hasFreeMonth ? (
                  <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase">CLAIMED</span>
                ) : (
                  <span className="text-[9px] font-mono font-bold bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded uppercase">LOCKED</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Introduce 5 users to unlock an entire free month on the Premium Creator Tier ($19 value) automatically applied to your billing account.
              </p>
              
              {/* Dynamic progress indicators */}
              <div className="pt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Progress ({totalSignups}/5 signups)</span>
                  <span className="text-slate-300 font-bold">{Math.min(Math.round((totalSignups/5)*100), 100)}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${hasFreeMonth ? 'bg-emerald-500' : 'bg-sky-400'}`}
                    style={{ width: `${Math.min((totalSignups/5)*100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC CARD PANELS */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Total Link Clicks</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white font-sans">{stats.clicks}</span>
              <span className="text-[10px] font-mono text-slate-400">Clicks logged</span>
            </div>
            <p className="text-slate-500 text-[10px] font-sans">Unique cookie tracker records</p>
          </div>

          <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Total Registrations</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white font-sans">{stats.signups}</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {stats.conversionRate}% CR
              </span>
            </div>
            <p className="text-slate-500 text-[10px] font-sans">Introduced free signups tracked</p>
          </div>

          <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Accrued Commissions</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-emerald-400 font-sans">{formatCurrency(stats.totalCommissionAccrued)}</span>
              <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">30% Share</span>
            </div>
            <p className="text-slate-500 text-[10px] font-sans">Calculated on customer payments</p>
          </div>

          <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Unpaid Commission Balance</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white font-sans">{formatCurrency(stats.unpaidCommission)}</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded font-bold">Withdraw-ready</span>
            </div>
            <p className="text-slate-500 text-[10px] font-sans">Min payout withdrawal threshold is $20</p>
          </div>
        </div>
      )}

      {/* CHARTS, LEADERBOARD, AND WITHDRAWALS SECTION */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Referral Clicks Timeline Chart */}
          <div className="lg:col-span-2 bg-[#0c101d]/50 border border-slate-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-sans">Partner Traffic Acquisition Timeline</h3>
                <p className="text-xs text-slate-400 font-sans">Clicks and registered signups logged over past 30 days</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.timeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#070b14', borderColor: '#1e293b', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Area type="monotone" dataKey="clicks" stroke="#38bdf8" strokeWidth={2} name="Partner Clicks" fillOpacity={1} fill="url(#colorClicks)" />
                  <Area type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={2} name="Referred Signups" fillOpacity={1} fill="url(#colorSignups)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className="bg-[#0c101d]/50 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> Affiliate Creator Leaderboard
              </h3>
              <p className="text-xs text-slate-400 font-sans">Top affiliate referrers converting new accounts</p>
            </div>

            <div className="space-y-2.5 py-4 flex-1 max-h-52 overflow-y-auto pr-1">
              {leaderboard.slice(0, 5).map((row: any, idx: number) => {
                const isMe = row.referrerId === userId;
                return (
                  <div 
                    key={row.referrerId} 
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono transition-all ${isMe ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold' : 'bg-[#070b14]/40 border-slate-900 text-slate-300'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-amber-500/20 text-amber-400' : idx === 1 ? 'bg-slate-300/20 text-slate-300' : 'bg-slate-900 text-slate-500'}`}>
                        {idx + 1}
                      </span>
                      <span className="font-sans truncate max-w-[120px]">{row.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-sans">Signups</span>
                        <span className="text-white font-bold">{row.signups}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-sans">Commissions</span>
                        <span className="text-emerald-400 font-bold">{formatCurrency(row.commission)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl">
              <p className="text-[10px] text-slate-500 leading-normal">
                Monthly affiliate top spot receives an additional <strong className="text-emerald-400">+500 lifetime credits</strong>!
              </p>
            </div>
          </div>

        </div>
      )}

      {/* WITHDRAWALS AND PAYOUT REQUEST FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Withdraw Panel */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Request Payout Cashout
            </h3>
            <p className="text-xs text-slate-400 font-sans">Withdraw your life-time recurring partner commissions securely.</p>
          </div>

          <form onSubmit={handleRequestPayout} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Withdrawal Method</label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 transition-all focus:outline-none"
              >
                <option value="PayPal">PayPal Account Transfer</option>
                <option value="Stripe Connect">Stripe Instant Payouts</option>
                <option value="Wise">Wise Direct Deposit</option>
                <option value="Bank Transfer">International Bank Wire</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Withdraw Amount ($)</label>
                {stats && (
                  <button 
                    type="button"
                    onClick={() => setPayoutAmount(Math.floor(stats.unpaidCommission))}
                    className="text-[9px] font-mono font-bold text-emerald-400 hover:underline"
                  >
                    MAX ({formatCurrency(stats.unpaidCommission)})
                  </button>
                )}
              </div>
              <input
                type="number"
                min="20"
                max={stats ? Math.floor(stats.unpaidCommission) : 1000}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 transition-all focus:outline-none"
                placeholder="Minimum $20"
              />
            </div>

            {payoutSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[11px] font-mono">
                {payoutSuccessMsg}
              </div>
            )}

            {payoutErrorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[11px] font-mono">
                {payoutErrorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={requestingPayout || (stats && stats.unpaidCommission < 20)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#070b14] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/10"
            >
              <Send className="w-3.5 h-3.5" />
              {requestingPayout ? 'Processing transfer...' : stats && stats.unpaidCommission < 20 ? 'Min $20 to Cashout' : 'Submit Cashout Request'}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-900 text-center">
            <span className="text-[10px] font-mono text-slate-500">Payout request window is open. Transferred in 24-48 hours.</span>
          </div>
        </div>

        {/* Payout Reports History Table */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-sans">Payout Reports &amp; Ledger</h3>
              <p className="text-xs text-slate-400 font-sans">Historical audit trail of affiliate partner disbursements</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="py-2.5 font-bold">Transaction Reference ID</th>
                  <th className="py-2.5 font-bold">Method</th>
                  <th className="py-2.5 font-bold text-right">Disbursed Amount</th>
                  <th className="py-2.5 font-bold text-center">Status</th>
                  <th className="py-2.5 font-bold text-right">Processed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-sans">
                {stats?.payouts && stats.payouts.length > 0 ? (
                  stats.payouts.map((pay: any) => (
                    <tr key={pay.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-3 font-mono text-[11px] text-slate-300">
                        {pay.id}
                      </td>
                      <td className="py-3 text-slate-400">
                        {pay.payoutMethod}
                      </td>
                      <td className="py-3 font-mono font-bold text-right text-emerald-400">
                        {formatCurrency(pay.amount)}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          pay.status === 'paid' 
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                            : pay.status === 'approved' 
                            ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400' 
                            : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-right text-slate-500">
                        {pay.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-mono">
                      No past payout reports found on the database ledger. Get referrals to request payouts!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* DYNAMIC PARTNER SIMULATOR CONTROL DECK */}
      <div className="bg-[#0c101d]/40 border border-slate-900 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" /> Interactive Partner Sandbox &amp; simulator
            </h3>
            <p className="text-xs text-slate-400">Validate the referral tracking, rewards, and commissions engine on the fly without staging hardware.</p>
          </div>
          {simSuccessMsg && (
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-pulse">
              {simSuccessMsg}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Action 1: Link Click */}
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">Stage 1: Link Acquisition</span>
              <h4 className="text-xs font-bold text-white">Simulate Unique Click</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Simulates an external creator clicking on your partner link from their browser.
              </p>
            </div>
            <button
              onClick={() => handleSimulate('click')}
              disabled={simulating}
              className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Dispatch Visitor Click
            </button>
          </div>

          {/* Action 2: Sign up */}
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Stage 2: Registration Convert</span>
              <h4 className="text-xs font-bold text-white">Simulate Free Sign-up</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Simulate a visitor completing registration. Gives you <span className="text-emerald-400 font-bold">+10 extra credits</span> immediately.
              </p>
              <input
                type="email"
                placeholder="Enter mock friend email (optional)"
                value={simEmail}
                onChange={(e) => setSimEmail(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-800 text-slate-200 text-[11px] rounded-lg p-2 focus:border-emerald-500 focus:outline-none placeholder-slate-600 font-mono"
              />
            </div>
            <button
              onClick={() => handleSimulate('signup')}
              disabled={simulating}
              className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" /> Dispatch Signup Event
            </button>
          </div>

          {/* Action 3: Upgrade */}
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Stage 3: Premium Tier Purchase</span>
              <h4 className="text-xs font-bold text-white">Simulate Stripe Paid Upgrade</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Upgrades a simulated referral to a paid subscription tier. Accrues <span className="text-emerald-400 font-bold">30% recurring cash commission</span>.
              </p>
              <select
                value={simPlan}
                onChange={(e) => setSimPlan(e.target.value as any)}
                className="w-full bg-[#070b14] border border-slate-800 text-slate-200 text-[11px] rounded-lg p-2 focus:border-emerald-500 focus:outline-none font-mono"
              >
                <option value="creator">Creator Tier ($19/mo)</option>
                <option value="pro">Professional Tier ($49/mo)</option>
                <option value="agency">Agency Enterprise ($99/mo)</option>
              </select>
            </div>
            <button
              onClick={() => handleSimulate('conversion')}
              disabled={simulating}
              className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Trigger Stripe Payment
            </button>
          </div>

        </div>
      </div>

      {/* DETAILED LEDGER OF REFERRALS */}
      <div className="bg-[#0c101d]/50 border border-slate-900 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white font-sans">Active Referrals Tracker Ledger</h3>
            <p className="text-xs text-slate-400 font-sans">Chronological audit ledger detailing every referred account status</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search referred emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-4 py-2 focus:border-emerald-500 focus:outline-none placeholder-slate-600"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#070b14] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All statuses</option>
              <option value="registered">Registered (Free)</option>
              <option value="converted">Converted (Paid)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-2.5 font-bold">Referred Account Email</th>
                <th className="py-2.5 font-bold">Registration Date</th>
                <th className="py-2.5 font-bold">Status Badge</th>
                <th className="py-2.5 font-bold">Plan Tier</th>
                <th className="py-2.5 font-bold text-right">Extra Credits</th>
                <th className="py-2.5 font-bold text-right">Revenue Contributed</th>
                <th className="py-2.5 font-bold text-right">Accrued Commission (30%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 font-sans">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((ref: any) => (
                  <tr key={ref.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="py-3 font-semibold text-white">
                      {ref.referredEmail}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-400">
                      {new Date(ref.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        ref.status === 'converted' 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {ref.status === 'converted' ? 'Converted (Paid)' : 'Registered (Free)'}
                      </span>
                    </td>
                    <td className="py-3 font-mono uppercase font-bold text-[10px] text-slate-400">
                      {ref.planTier || 'Free'}
                    </td>
                    <td className="py-3 font-mono text-right text-amber-400 font-bold">
                      +{ref.creditsAwarded}
                    </td>
                    <td className="py-3 font-mono text-right text-slate-300">
                      {formatCurrency(ref.revenueGenerated)}
                    </td>
                    <td className="py-3 font-mono font-bold text-right text-emerald-400">
                      {formatCurrency(ref.commissionAccrued)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    No matching referred accounts registered in the affiliate tracking database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}