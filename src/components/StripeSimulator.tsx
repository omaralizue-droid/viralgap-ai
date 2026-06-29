import React, { useState, useEffect } from 'react';
import { CreditCard, Check, ShieldAlert, Sparkles, AlertTriangle, ArrowLeft, ArrowRight, Coins, CheckCircle, RefreshCw, LogOut } from 'lucide-react';

// Stripe Checkout Simulation Component
export function StripeSimulatorCheckout({ onClose, addToast, onPaymentCompleted }: { 
  onClose: () => void; 
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onPaymentCompleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failMode, setFailMode] = useState(false);

  // Parse URL search params for checkout configuration
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const plan = params.get('plan') || 'creator';
  const userId = params.get('userId') || 'usr_default_omar';
  const email = params.get('email') || 'omar263@gmail.com';

  const planTitles: Record<string, string> = {
    creator: 'Creator Plan Subscription',
    pro: 'Professional Plan Subscription',
    agency: 'Enterprise Agency License'
  };

  const planPrices: Record<string, number> = {
    creator: 19,
    pro: 49,
    agency: 99
  };

  const planPrice = planPrices[plan] || 19;
  const planTitle = planTitles[plan] || 'Creator Plan Subscription';

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (failMode) {
        // Simulate Payment Failure Webhook event
        const res = await fetch('/api/stripe/simulate-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'invoice.payment_failed',
            userId,
            plan,
            email
          })
        });
        const data = await res.json();
        setLoading(false);
        addToast('error', 'Payment declined! Simulation recorded a declined card event in tables.');
        window.location.hash = '#billing?success=false&error=declined';
        onClose();
      } else {
        // Simulate Successful Checkout Webhook event
        const res = await fetch('/api/stripe/simulate-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'checkout.session.completed',
            userId,
            plan,
            email
          })
        });
        const data = await res.json();
        
        setLoading(false);
        setSuccess(true);
        addToast('success', `Stripe Payment simulated successfully! Plan: ${plan.toUpperCase()}`);
        
        setTimeout(() => {
          onPaymentCompleted();
          window.location.hash = '#billing?success=true';
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      addToast('error', 'Stripe sandbox webhook simulation service error.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#070b14]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c101d] border border-slate-900 rounded-3xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl animate-scale-up">
        
        {/* Left Side: Order summary */}
        <div className="p-8 md:p-12 bg-[#080c16] flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900">
          <div className="space-y-6">
            <button onClick={() => { window.location.hash = '#billing'; onClose(); }} className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white transition-all">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to ViralGap AI
            </button>

            <div className="space-y-2">
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Stripe Checkout Sandbox
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                Complete your subscription setup
              </h2>
            </div>

            <div className="pt-6 border-t border-slate-900/80 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-white">{planTitle}</h3>
                  <p className="text-xs text-slate-500 mt-1">Billed monthly recurring basis</p>
                </div>
                <span className="text-lg font-bold text-white font-mono">${planPrice}.00</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 font-mono pt-2">
                <span>Tax (Simulated)</span>
                <span>$0.00</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900/80 space-y-3">
            <div className="flex justify-between items-baseline font-mono">
              <span className="text-sm text-slate-400 uppercase font-bold">Total Due Now</span>
              <span className="text-2xl font-bold text-emerald-400">${planPrice}.00</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
              *You are currently checking out via the Stripe Billing Simulator node. No real monetary transactions are performed. Direct DB records update instantly on success.
            </p>
          </div>
        </div>

        {/* Right Side: Credit Card input & checkout */}
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
          {success ? (
            <div className="text-center space-y-4 py-8 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-mono">PAYMENT SUCCESSFUL</h3>
                <p className="text-xs text-slate-400">Updating subscription logs & dispatching credits...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-3 mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" /> Enter Payment Information
              </h3>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  disabled
                  className="w-full bg-[#070b14] border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Card Details</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    defaultValue="4242  4242  4242  4242"
                    disabled
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block">Expires</label>
                  <input 
                    type="text" 
                    defaultValue="12 / 29"
                    disabled
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-mono text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block">CVC Security</label>
                  <input 
                    type="text" 
                    defaultValue="424"
                    disabled
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-mono text-center"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-900 p-3 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="fail_mode_toggle"
                    checked={failMode}
                    onChange={(e) => setFailMode(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-[#070b14] border-slate-800 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="fail_mode_toggle" className="text-[11px] font-mono text-rose-300 cursor-pointer flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Simulate declined credit card failure
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-semibold text-xs font-mono rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> DISPATCHING SECURE HANDSHAKE...
                  </>
                ) : (
                  <>
                    SIMULATE SECURE PAYMENT <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

// Stripe Customer Portal Simulation Component
export function StripeSimulatorPortal({ onClose, addToast, onPortalActionCompleted }: {
  onClose: () => void;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onPortalActionCompleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<'free' | 'creator' | 'pro' | 'agency'>('free');
  const [creditsLeft, setCreditsLeft] = useState(0);

  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const userId = params.get('userId') || 'usr_default_omar';

  // Fetch current subscription plan of user
  useEffect(() => {
    fetch(`/api/billing/status?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActivePlan(data.subscription.plan_tier);
          setCreditsLeft(data.usage.credits_total - data.usage.credits_used);
        }
      });
  }, [userId]);

  const handleUpdatePlan = async (targetPlan: 'creator' | 'pro' | 'agency' | 'free') => {
    setLoading(true);
    const isCancel = targetPlan === 'free';
    const eventType = isCancel ? 'customer.subscription.deleted' : 'customer.subscription.updated';

    try {
      const res = await fetch('/api/stripe/simulate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          userId,
          plan: targetPlan
        })
      });
      const data = await res.json();
      setLoading(false);
      
      if (isCancel) {
        addToast('success', 'Subscription canceled! Downgraded back to Free plan.');
      } else {
        addToast('success', `Subscription tier updated to ${targetPlan.toUpperCase()} successfully!`);
      }
      
      onPortalActionCompleted();
      window.location.hash = '#billing';
      onClose();
    } catch (err: any) {
      setLoading(false);
      addToast('error', 'Stripe sandbox webhook simulation service error.');
    }
  };

  const handleRefillCredits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/refill-quota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        addToast('success', 'Credits refilled. Simulated invoice receipt created.');
        onPortalActionCompleted();
        window.location.hash = '#billing';
        onClose();
      } else {
        addToast('error', data.error || 'Failed to refill credits.');
      }
    } catch (err) {
      setLoading(false);
      addToast('error', 'Quota refill service currently offline.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#070b14]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c101d] border border-slate-900 rounded-3xl w-full max-w-2xl p-8 space-y-6 shadow-2xl animate-scale-up">
        
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-900/60">
          <div className="space-y-1">
            <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Stripe Customer Portal Simulator
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Manage your billing profile
            </h2>
          </div>
          <button 
            onClick={() => { window.location.hash = '#billing'; onClose(); }}
            className="p-1 px-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono border border-slate-850 transition-all cursor-pointer"
          >
            ✕ Exit Portal
          </button>
        </div>

        {/* Current sub summary */}
        <div className="bg-[#080c16] border border-slate-900/80 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">CURRENT TIERS STATUS</span>
            <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
              {activePlan} Plan <span className="text-xs font-sans font-normal text-slate-400 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold">Active</span>
            </h3>
            <p className="text-xs text-slate-400">Available quota balance: <span className="text-emerald-400 font-bold font-mono">{creditsLeft}</span> credits</p>
          </div>

          {activePlan !== 'free' && (
            <button 
              onClick={handleRefillCredits}
              disabled={loading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/15"
            >
              Refill/Add Credits (Charges Plan Cost)
            </button>
          )}
        </div>

        {/* Upgrade / Downgrade options */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Change Subscription Plan Tier
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'creator' as const, label: 'Creator Plan', price: '$19/mo', desc: '500 credits' },
              { name: 'pro' as const, label: 'Professional Plan', price: '$49/mo', desc: '1500 credits' },
              { name: 'agency' as const, label: 'Agency Plan', price: '$99/mo', desc: '5000 credits' }
            ].map((p) => {
              const isCurrent = activePlan === p.name;
              return (
                <div key={p.name} className={`bg-[#080c16]/60 border rounded-2xl p-4 flex flex-col justify-between ${isCurrent ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-900/80 hover:border-slate-800'}`}>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white">{p.label}</h5>
                    <p className="text-xs text-emerald-400 font-mono">{p.price}</p>
                    <p className="text-[10px] text-slate-500">{p.desc}</p>
                  </div>
                  <button 
                    disabled={isCurrent || loading}
                    onClick={() => handleUpdatePlan(p.name)}
                    className={`w-full mt-4 py-2 rounded-xl text-xs font-mono font-bold text-center border transition-all cursor-pointer ${isCurrent ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-[#070b14] border-slate-850 hover:border-slate-700 hover:text-white text-slate-400'}`}
                  >
                    {isCurrent ? 'ACTIVE' : 'SELECT'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cancellation area */}
        {activePlan !== 'free' && (
          <div className="pt-4 border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-rose-500/5 border border-rose-500/10 p-5 rounded-2xl">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-300 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Cancel Premium Subscription
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Cancelling your subscription immediately demotes your account back to the Free Tier. Credits will reset to the 5 analyses/month baseline.
              </p>
            </div>
            <button 
              disabled={loading}
              onClick={() => handleUpdatePlan('free')}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono rounded-xl border border-rose-500/20 transition-all cursor-pointer"
            >
              Cancel Subscription
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
