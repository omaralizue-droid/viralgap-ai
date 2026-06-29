import React, { useState } from 'react';
import { CreditCard, Check, CheckCircle2, DollarSign, ArrowUpRight, Coins, HelpCircle, Activity, ShieldAlert } from 'lucide-react';

interface BillingTabProps {
  currentPlan: 'Free' | 'Creator' | 'Pro' | 'Agency';
  credits: number;
  onUpgradePlan: (plan: 'Free' | 'Creator' | 'Pro' | 'Agency') => void;
  onRefillCredits: () => void;
  onManageSubscription: () => void;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  invoices?: any[];
  isSimulatorMode?: boolean;
}

export default function BillingTab({
  currentPlan,
  credits,
  onUpgradePlan,
  onRefillCredits,
  onManageSubscription,
  addToast,
  invoices = [],
  isSimulatorMode = true
}: BillingTabProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);

  const plans = [
    {
      name: 'Free' as const,
      price: '$0',
      period: 'forever',
      desc: 'Test the waters of analytic video research.',
      credits: '5 analyses/month',
      features: [
        'Content Gap finder (3 scans)',
        'Standard YouTube URL analysis',
        'Demo script compilation',
        'Community discord access'
      ]
    },
    {
      name: 'Creator' as const,
      price: '$19',
      period: 'per month',
      desc: 'Perfect for active single channel creators.',
      credits: '500 monthly credits',
      features: [
        'Unlimited content gap discovery',
        'Full YouTube hook analysis (15 credits)',
        'Full retention script generation (25 credits)',
        'Midjourney prompt visual formulator',
        'Email priority response support'
      ]
    },
    {
      name: 'Pro' as const,
      price: '$49',
      period: 'per month',
      desc: 'For professional creators with multi-niche layouts.',
      credits: '1500 monthly credits',
      features: [
        'All Creator features included',
        'Live YouTube comments parsed (sentiment analyzer)',
        'Export script as HTML and SRT formats',
        'Custom voice modulation suggestions',
        '1-on-1 YouTube thumbnail consult suggestions'
      ]
    },
    {
      name: 'Agency' as const,
      price: '$99',
      period: 'per month',
      desc: 'For YouTube content production studios and agencies.',
      credits: '5000 monthly credits',
      features: [
        'All Pro features included',
        'Multi-user shared workspace (up to 5 team members)',
        'Dedicated API endpoint integration',
        'Custom script templates with proprietary style weights',
        '24/7 dedicated support phone manager'
      ]
    }
  ];

  const handlePlanSelect = (planName: 'Free' | 'Creator' | 'Pro' | 'Agency') => {
    onUpgradePlan(planName);
  };

  const getCreditsLabel = () => {
    switch (currentPlan) {
      case 'Free': return '/ 5 Analyses';
      case 'Creator': return '/ 500 Credits';
      case 'Pro': return '/ 1500 Credits';
      case 'Agency': return '/ 5000 Credits';
      default: return '';
    }
  };

  const getPercentageLeft = () => {
    const totals = { Free: 5, Creator: 500, Pro: 1500, Agency: 5000 };
    const total = totals[currentPlan] || 5;
    return Math.min(100, Math.max(0, (credits / total) * 100));
  };

  return (
    <div id="billing_view_container" className="space-y-8">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" /> Billing & Creator Quota Centre
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your subscription plans, monitor automated credit consumptions, and download invoice records.
          </p>
        </div>

        {/* Sandbox simulator mode notice banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-[10px] uppercase font-bold tracking-wide shrink-0 self-start sm:self-center bg-emerald-950/20 border-emerald-500/20 text-emerald-400">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          {isSimulatorMode ? 'Stripe Simulator Active' : 'Stripe Production Mode'}
        </div>
      </div>

      {/* Credit Overview Banner */}
      <div className="bg-gradient-to-br from-[#0c101d] via-[#090e18] to-[#040405] border border-slate-900 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center hover:border-slate-800 transition-all duration-300">
        <div className="space-y-2">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">CURRENT BALANCE</span>
          <div className="flex items-center gap-3">
            <Coins className="w-7 h-7 text-emerald-450 shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)] animate-pulse" />
            <h3 className="text-3xl font-black text-white font-mono tracking-tight">
              {credits} <span className="text-xs font-sans font-normal text-slate-400">{getCreditsLabel()}</span>
            </h3>
          </div>
          <p className="text-[9px] text-slate-500 font-mono tracking-wider">AUTOMATIC RESET CYCLE EVERY 30 DAYS</p>
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">
            <span>Quota Spent</span>
            <span className="text-emerald-450">{getPercentageLeft().toFixed(0)}% Available</span>
          </div>
          <div className="w-full bg-[#040405] h-2 rounded-full border border-slate-900 overflow-hidden relative">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
              style={{ width: `${getPercentageLeft()}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-sans leading-none">
            <span>{credits} Units Left</span>
            <span className="text-[9px] text-slate-500 font-mono">100% SECURE</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 justify-start md:justify-end">
          {currentPlan !== 'Free' && (
            <button 
              onClick={onRefillCredits}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
            >
              Refill Current Quota
            </button>
          )}
          {currentPlan !== 'Free' && (
            <button 
              onClick={onManageSubscription}
              className="px-4 py-2 bg-[#070b14] border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Manage Subscription (Portal)
            </button>
          )}
        </div>
      </div>

      {/* Plans Matrix GRID */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-slate-900 pb-3">
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Available Subscription Levels</h3>
          <span className="text-[9px] text-emerald-400 font-mono font-bold bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/10">20% ANNUAL DISCOUNT AUTOMATED VIA CHECKOUT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.name;
            return (
              <div 
                key={p.name} 
                className={`bg-[#0c101d] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                  isCurrent 
                    ? 'border-emerald-500/40 shadow-xl shadow-emerald-500/[0.02] bg-[#0c101d]/80' 
                    : 'border-slate-900 hover:border-slate-800 hover:shadow-lg hover:shadow-black/20'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-mono font-bold text-[8px] uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
                    ACTIVE PLAN
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">{p.name} Tier</span>
                    <div className="flex items-baseline gap-1 mt-1.5">
                      <span className="text-3xl font-black text-white font-mono tracking-tight">{p.price}</span>
                      <span className="text-[9px] text-slate-500 font-mono uppercase">/ {p.period === 'forever' ? 'forever' : 'mo'}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed min-h-[36px] font-sans">{p.desc}</p>
                  </div>

                  <div className="py-3 border-t border-b border-slate-900/60 flex justify-between items-center bg-slate-950/20 px-2 rounded-lg">
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Monthly allocation:</span>
                    <span className="text-[10px] text-emerald-450 font-mono font-black">{p.credits.toUpperCase()}</span>
                  </div>

                  <ul className="space-y-3 text-xs pl-0.5">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-slate-350 leading-relaxed font-sans">
                        <Check className="w-3.5 h-3.5 text-emerald-450 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7">
                  {isCurrent ? (
                    <div className="w-full py-2.5 bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold text-center rounded-xl flex items-center justify-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> CURRENT SELECTION
                    </div>
                  ) : (
                    <button 
                      onClick={() => handlePlanSelect(p.name)}
                      className="w-full py-2.5 bg-[#070b14] border border-slate-800 hover:border-slate-700 hover:text-white text-slate-300 hover:bg-slate-900 text-[10px] font-mono font-bold text-center rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                    >
                      SELECT {p.name.toUpperCase()}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice list */}
      <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-900 pb-3">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Historical Receipts & Invoices</h4>
          <span className="text-[9px] text-slate-500 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-900 uppercase">SECURE LEDGER FROM STRIPE BILLING ENGINE</span>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-10 text-xs font-mono text-slate-500 border border-dashed border-slate-900 rounded-xl">
            No payments recorded yet. Upgrade to Creator or Pro to initialize receipts database.
          </div>
        ) : (
          <div className="divide-y divide-slate-900/40">
            {invoices.map((inv: any) => (
              <div key={inv.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-950/20 px-2.5 rounded-xl transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold font-mono text-white select-all">
                      {inv.id}
                    </p>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-950 border border-slate-900 px-1.5 py-0.5 rounded uppercase">
                      {inv.card_brand || 'Visa'} •••• {inv.card_last4 || '4242'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">{inv.date}</p>
                </div>

                <div className="flex items-center gap-5 justify-between w-full sm:w-auto">
                  <span className="text-xs font-mono text-emerald-400 font-black">${inv.amount}.00 USD</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    {inv.status}
                  </span>
                  <button 
                    onClick={() => addToast('info', `Downloading invoice ${inv.id} receipt PDF...`)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-transparent hover:border-slate-850 hover:bg-[#070b14] transition-all cursor-pointer"
                    title="Download Receipt PDF"
                  >
                    <ArrowUpRight className="w-4 h-4 text-slate-400 hover:text-emerald-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
