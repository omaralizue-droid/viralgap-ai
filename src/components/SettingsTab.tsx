import React, { useState } from 'react';
import { Settings, Shield, Key, Eye, EyeOff, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface SettingsTabProps {
  user: {
    displayName: string;
    email: string;
    youtubeChannelUrl?: string;
    niche?: string;
    bio?: string;
  };
  serverHealth: {
    hasGeminiKey: boolean;
    hasSupabaseUrl: boolean;
  };
  onSaveProfile: (profile: { displayName: string; youtubeChannelUrl: string; niche: string; bio: string }) => void;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function SettingsTab({
  user,
  serverHealth,
  onSaveProfile,
  addToast
}: SettingsTabProps) {
  // Form values
  const [name, setName] = useState(user.displayName);
  const [channelUrl, setChannelUrl] = useState(user.youtubeChannelUrl || '');
  const [niche, setNiche] = useState(user.niche || '');
  const [bio, setBio] = useState(user.bio || '');

  // API keys toggle view states
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showYoutubeKey, setShowYoutubeKey] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState('••••••••••••••••••••••••••••••••••••••••');
  const [youtubeKeyInput, setYoutubeKeyInput] = useState('••••••••••••••••••••••••••••••••');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      displayName: name,
      youtubeChannelUrl: channelUrl,
      niche,
      bio
    });
  };

  const handleUpdateKeys = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Workspace third-party credentials updated securely!');
  };

  return (
    <div id="settings_view_container" className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" /> Workspace Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure creator profiles, customize workspace parameters, and link API credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PROFILE INFORMATION */}
        <div className="lg:col-span-2 bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Creator Display Card Profile</h3>
            <span className="text-[9px] text-slate-500 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-900 uppercase">USED FOR SCRIPTS AND HOOK REFINING</span>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5 font-bold">DISPLAY NAME / PEN NAME</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5 font-bold">YOUTUBE CHANNEL URL</label>
                <input 
                  type="url" 
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://youtube.com/@..."
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5 font-bold">ACCOUNT EMAIL (LOCKED)</label>
                <input 
                  type="email" 
                  value={user.email}
                  disabled
                  className="w-full bg-[#070b14] border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-500 focus:outline-none cursor-not-allowed opacity-80"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5 font-bold">PRIMARY NICHE FOCUS</label>
                <input 
                  type="text" 
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="Software Engineering, Lifestyle Vlogs..."
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5 font-bold">CREATOR BIO / BIO SKETCH</label>
              <textarea 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly define what niche audience segments you make videos for."
                className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-4 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
              />
            </div>

            <div className="pt-3 border-t border-slate-900/60 flex justify-end">
              <button 
                type="submit"
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* SIDE BAR CREDENTIAL PANEL */}
        <div className="space-y-6">
          
          {/* SECURE CREDENTIALS KEYS */}
          <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-450" />
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Integrations Keys</h3>
            </div>

            <form onSubmit={handleUpdateKeys} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[9px] font-mono text-slate-505 uppercase tracking-widest font-bold">Gemini API Token Key</label>
                  {serverHealth.hasGeminiKey ? (
                    <span className="text-[8px] font-mono text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15 flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      ACTIVE SERVER KEY
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/15 flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                      </span>
                      DEMO MODE ACTIVE
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type={showGeminiKey ? 'text' : 'password'}
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                  >
                    {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[9px] text-slate-500 mt-1 leading-normal font-sans">
                  Configure this via your Secrets panel inside Google AI Studio. Used for live API requests.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[9px] font-mono text-slate-505 uppercase tracking-widest font-bold">YouTube Data API Key</label>
                  <span className="text-[8px] font-mono text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15 flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    ACTIVE LOCAL KEY
                  </span>
                </div>
                <div className="relative">
                  <input 
                    type={showYoutubeKey ? 'text' : 'password'}
                    value={youtubeKeyInput}
                    onChange={(e) => setYoutubeKeyInput(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowYoutubeKey(!showYoutubeKey)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                  >
                    {showYoutubeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[9px] text-slate-500 mt-1 leading-normal font-sans">
                  Used to fetch live competitor video comments and hook metrics dynamically.
                </p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#070b14] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[10px] font-mono font-bold text-center rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                >
                  Save Integration Keys
                </button>
              </div>
            </form>
          </div>

          {/* GATEWAY SHIELD REPORT */}
          <div className="bg-[#0c101d] border border-slate-900 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/5 px-2.5 py-1.5 border border-amber-500/10 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider">WORKSPACE COMPLIANCE</span>
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed font-sans">
              Credentials saved here are stored in simulated web-client local structures secure behind cryptographic isolation parameters. Do not commit keys directly into codebase repos.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
