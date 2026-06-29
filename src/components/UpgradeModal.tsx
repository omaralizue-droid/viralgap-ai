import React from 'react';
import { X, Sparkles, Coins, Check, Zap, Flame, ShieldCheck } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradePlan: (plan: 'Creator' | 'Pro' | 'Agency') => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgradePlan }: UpgradeModalProps) {
  if (!isOpen) return null;

  const tiers = [
    {
      name: 'Creator' as const,
      price: '$19',
      period: 'mo',
      desc: 'Unlock analytical power for active creators.',
      credits: '500 Monthly Credits',
      features: [
        'Unlimited content gap scans',
        'Gemini AI hook & pacing teardowns',
        '20 Clickable title formulations',
        'Visual thumbnail prompt recipes',
        'Priority email response queue'
      ],
      popular: true
    },
    {
      name: 'Pro' as const,
      price: '$49',
      period: 'mo',
      desc: 'For multi-channel creators and professional publishers.',
      credits: '1500 Monthly Credits',
      features: [
        'All Creator features included',
        'YouTube comments sentiment parse',
        'Script exporting (HTML, SRT formats)',
        'Vocal tone modulation blueprints',
        '1-on-1 thumbnail design review consults'
      ],
      popular: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-[#040405]/85 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div 
        className="w-full max-w-3xl bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative animate-fade-in flex flex-col md:flex-row max-h-[90vh] md:max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-all z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Pitch Banner */}
        <div className="md:w-5/12 bg-gradient-to-b from-[#0f0f12] to-[#040405] p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-[#f43f5e] font-mono text-[10px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-[#f43f5e]" /> Quota Limit Reached
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-white font-mono">Unlock algorithmic growth tools.</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Free plan limits prevent further scans. Upgrade now to tap directly into Gemini AI YouTube keyword modeling.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white/5 rounded-lg text-emerald-400">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Up to 5,000 monthly credits</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">Never run dry during bulk script drafting campaigns.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white/5 rounded-lg text-emerald-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Viral DNA hook engine</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">Reconstruct competitor hooks based on peak retention factors.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white/5 rounded-lg text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Priority API processing</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">Sub-second generation response queues bypassing public queues.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 text-[10px] font-mono text-slate-500">
            Secure checkout powered by Stripe. Cancel anytime in one click.
          </div>
        </div>

        {/* Right Side: Plans Option Cards */}
        <div className="md:w-7/12 p-8 overflow-y-auto space-y-6 flex flex-col justify-center">
          <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Select Upgrade Option</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tiers.map((t) => (
              <div 
                key={t.name}
                className={`bg-[#0f0f12] border rounded-2xl p-5 flex flex-col justify-between transition-all hover:scale-[1.01] ${t.popular ? 'border-emerald-500/50 relative shadow-lg shadow-emerald-500/5' : 'border-white/5'}`}
              >
                {t.popular && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-[#040405] font-mono font-bold text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-bl-lg">
                    POPULAR
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">{t.name}</span>
                    <div className="flex items-baseline gap-0.5 mt-1">
                      <span className="text-xl font-bold text-white font-mono">{t.price}</span>
                      <span className="text-[9px] text-slate-500 font-mono">/{t.period}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-2 min-h-[30px]">{t.desc}</p>
                  </div>

                  <div className="text-[9px] text-emerald-400 font-mono font-bold py-1 border-t border-b border-white/5">
                    {t.credits}
                  </div>

                  <ul className="space-y-1.5 text-[10px] text-slate-300">
                    {t.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => onUpgradePlan(t.name)}
                    className={`w-full py-2 rounded-xl text-center font-mono text-[10px] font-bold tracking-wide transition-all cursor-pointer ${t.popular ? 'bg-emerald-500 hover:bg-emerald-400 text-[#040405] shadow-lg shadow-emerald-500/10' : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'}`}
                  >
                    UPGRADE NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
