import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  Copy, 
  Check, 
  Search, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  Activity, 
  Sliders, 
  AlertCircle,
  Code,
  LayoutDashboard,
  Compass,
  Link,
  FileText,
  Image as ImageIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Mail,
  Lock,
  ArrowRight,
  Globe,
  Plus,
  RefreshCw,
  Coins,
  DollarSign,
  Shield,
  ShieldAlert,
  Youtube,
  Zap,
  CheckCircle2,
  ListFilter,
  Bell,
  Menu,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lightbulb,
  Info,
  ThumbsUp,
  ThumbsDown,
  Settings,
  MessageSquare,
  Calendar,
  History,
  Award,
  Video,
  Camera,
  Sun,
  Mic,
  Volume2,
  Film,
  Flame,
  Gift,
  X
} from 'lucide-react';
import { 
  SYSTEM_ARCHITECTURE, 
  SCHEMA_TABLES, 
  RLS_POLICIES, 
  SUBSCRIPTION_LOGIC, 
  API_ENDPOINTS, 
  SCALABILITY_AND_COSTS,
} from './architectureData';
import NotificationsDropdown from './components/NotificationsDropdown';
import UserMenuDropdown from './components/UserMenuDropdown';
import DashboardStats from './components/DashboardStats';
import RecentActivityTable, { ActivityLog } from './components/RecentActivityTable';
import { StripeSimulatorCheckout, StripeSimulatorPortal } from './components/StripeSimulator';
import UpgradeModal from './components/UpgradeModal';

// Lazy load subcomponents
const BillingTab = React.lazy(() => import('./components/BillingTab'));
const SettingsTab = React.lazy(() => import('./components/SettingsTab'));
const OpportunityAlertsTab = React.lazy(() => import('./components/OpportunityAlertsTab'));
const ContentCalendarTab = React.lazy(() => import('./components/ContentCalendarTab').then(m => ({ default: m.ContentCalendarTab })));
const DevOpsConsoleTab = React.lazy(() => import('./components/DevOpsConsoleTab'));
const FounderDashboardTab = React.lazy(() => import('./components/FounderDashboardTab').then(m => ({ default: m.FounderDashboardTab })));
const AffiliateDashboardTab = React.lazy(() => import('./components/AffiliateDashboardTab').then(m => ({ default: m.AffiliateDashboardTab })));
const SEOToolsContainer = React.lazy(() => import('./components/SEOToolsContainer').then(m => ({ default: m.SEOToolsContainer })));

// Lazy load modular frontend tools
const ContentGapTool = React.lazy(() => import('./components/ContentGapTool'));
const UrlAnalyzerTool = React.lazy(() => import('./components/UrlAnalyzerTool'));
const ScriptGeneratorTool = React.lazy(() => import('./components/ScriptGeneratorTool'));
const TrendsTool = React.lazy(() => import('./components/TrendsTool'));
const ThumbnailTool = React.lazy(() => import('./components/ThumbnailTool'));
const VideoGeneratorTool = React.lazy(() => import('./components/VideoGeneratorTool'));
const ViralPredictorTool = React.lazy(() => import('./components/ViralPredictorTool'));
const CreatorCopilotTool = React.lazy(() => import('./components/CreatorCopilotTool'));
const CompetitorTool = React.lazy(() => import('./components/CompetitorTool'));

// Premium shimmer loading state
function TabLoader() {
  return (
    <div className="w-full space-y-6 animate-pulse p-4">
      <div className="h-6 bg-white/5 rounded-lg w-1/4"></div>
      <div className="h-24 bg-white/5 rounded-xl w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="h-40 bg-white/5 rounded-xl"></div>
        <div className="h-40 bg-white/5 rounded-xl"></div>
        <div className="h-40 bg-white/5 rounded-xl"></div>
      </div>
    </div>
  );
}

// Core Application state
interface AuthState {
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string;
    youtubeChannelUrl?: string;
    niche?: string;
    bio?: string;
  } | null;
  isAuthenticated: boolean;
  view: 'login' | 'signup' | 'forgot' | 'reset';
}

export default function App() {
  // Authentication & session simulation
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('viralgap_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          user: parsed.user,
          isAuthenticated: true,
          view: 'login'
        };
      } catch (e) {
        // Clear corrupt storage
      }
    }
    return {
      user: null,
      isAuthenticated: false,
      view: 'login'
    };
  });

  // Track simulated API key/Supabase connection status from server health endpoint
  const [serverHealth, setServerHealth] = useState({
    status: 'checking',
    hasGeminiKey: false,
    hasSupabaseUrl: false
  });

  // Active workspace tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'content-gap' | 'opportunity-scanner' | 'url-analyzer' | 'script-generator' | 'content-calendar' | 'trends' | 'prompts' | 'video-prompts' | 'viral-predictor' | 'creator-copilot' | 'competitor-watch' | 'opportunity-alerts' | 'profile' | 'architecture' | 'billing' | 'settings' | 'devops-console' | 'founder-dashboard'
  >('dashboard');

  // Sidebar collapsible state and global search/command palette
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [onboarding, setOnboarding] = useState(() => {
    const saved = localStorage.getItem('viralgap_onboarding');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          step1UrlAnalyzed: !!parsed.step1UrlAnalyzed,
          step2ContentGapSearched: !!parsed.step2ContentGapSearched,
          step3ProfileConfigured: !!parsed.step3ProfileConfigured,
          claimedBonus: !!parsed.claimedBonus
        };
      } catch (e) {}
    }
    return {
      step1UrlAnalyzed: false,
      step2ContentGapSearched: false,
      step3ProfileConfigured: false,
      claimedBonus: false
    };
  });

  // Sub-tabs for architecture
  const [archTab, setArchTab] = useState<'overview' | 'schema' | 'security' | 'api' | 'usage' | 'scalability'>('overview');
  const [archSearch, setArchSearch] = useState('');

  // UI notifications / Toast feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: string; type: 'success' | 'error' | 'info'; message: string }[]>([]);

  // Notification lists state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem('viralgap_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', type: 'success', message: 'Welcome to ViralGap AI SaaS! Workspace initialized.', time: '1d ago', unread: false }
    ];
  });

  // User dropdown menu state
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mobile drawer open toggle
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Recent activity logs list
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('viralgap_activity_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'act_1', type: 'auth', title: 'User Registered Account', detail: 'Authenticated successfully in cloud runner sandbox', credits: 0, time: '3m ago' },
      { id: 'act_2', type: 'system', title: 'Gemini Agent Handshake', detail: 'Handshake completed with Google Gemini models successfully', credits: 0, time: '2m ago' }
    ];
  });

  // Persistent user statistics / Credit management
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem('viralgap_credits');
    if (saved) return parseInt(saved, 10);
    return 320; // Default out of 500
  });

  const [usageStats, setUsageStats] = useState(() => {
    const saved = localStorage.getItem('viralgap_usage_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      contentGaps: 3,
      urlAnalyses: 5,
      scripts: 2,
      prompts: 4,
      plan: 'Creator' as 'Free' | 'Creator' | 'Pro' | 'Agency'
    };
  });

  // Stripe & SaaS Billing Server integrations
  const [stripeConfig, setStripeConfig] = useState({ isStripeConfigured: false, publishableKey: '' });
  const [serverInvoices, setServerInvoices] = useState<any[]>([]);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Generator inputs & state
  const [contentGapResults, setContentGapResults] = useState<any[]>([]);
  const [urlResult, setUrlResult] = useState<any | null>(null);
  const [scriptResult, setScriptResult] = useState<any | null>(null);
  const [promptResult, setPromptResult] = useState<any | null>(null);

  // Form Inputs for Auth
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Profile Edit fields
  const [displayNameField, setDisplayNameField] = useState('');
  const [channelUrlField, setChannelUrlField] = useState('');
  const [nicheField, setNicheField] = useState('');
  const [bioField, setBioField] = useState('');

  // Fetch health check on load & listen for global Cmd+K shortcut
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setServerHealth({
          status: 'ready',
          hasGeminiKey: data.config?.hasGeminiKey,
          hasSupabaseUrl: data.config?.hasSupabaseUrl
        });
      })
      .catch(() => {
        setServerHealth({
          status: 'offline',
          hasGeminiKey: false,
          hasSupabaseUrl: false
        });
      });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // (Removed duplicate tabs data loaders since subcomponents handle their own fetching on mount)

  // Sync profile edits with fields
  useEffect(() => {
    if (auth.user) {
      setDisplayNameField(auth.user.displayName || '');
      setChannelUrlField(auth.user.youtubeChannelUrl || '');
      setNicheField(auth.user.niche || '');
      setBioField(auth.user.bio || '');
    }
  }, [auth.user]);

  // Sync state helpers
  const saveAuth = (user: any) => {
    const newState = { user, isAuthenticated: true, view: 'login' as const };
    setAuth(newState);
    localStorage.setItem('viralgap_auth', JSON.stringify({ user }));
  };

  const syncBilling = async (userId: string) => {
    try {
      const res = await fetch(`/api/billing/status?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const remainingCredits = data.usage.credits_total - data.usage.credits_used;
          setCredits(remainingCredits);
          setUsageStats((prev: any) => ({
            ...prev,
            plan: data.subscription.plan_tier.charAt(0).toUpperCase() + data.subscription.plan_tier.slice(1) as any
          }));
          setStripeConfig({
            isStripeConfigured: data.config.isStripeConfigured,
            publishableKey: data.config.publishableKey
          });
          setServerInvoices(data.invoices);
        }
      }
    } catch (err) {
      console.error('Failed to sync billing details from server:', err);
    }
  };

  const requestCreditUsage = async (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string): Promise<boolean> => {
    if (!auth.user) {
      addToast('error', 'Authentication is required.');
      return false;
    }
    try {
      const res = await fetch('/api/billing/use-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: auth.user.id, type, cost: amount })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 || data.code === 'LIMIT_EXCEEDED') {
          setShowUpgradeModal(true);
        } else {
          addToast('error', data.error || 'Quota limit exceeded.');
        }
        return false;
      }
      
      const usage = data.usage;
      const remainingCredits = usage.credits_total - usage.credits_used;
      setCredits(remainingCredits);
      setUsageStats((prev: any) => ({
        ...prev,
        [type]: prev[type] + 1
      }));
      
      // Add activity log locally for beautiful tracking
      const logTitle = type === 'contentGaps' ? 'Content Gap Scanned' : 
                       type === 'urlAnalyses' ? 'Video URL Analyzed' : 
                       type === 'scripts' ? 'Viral Script Generated' : 'Thumbnail Prompt Created';
      const logType = type === 'contentGaps' ? 'contentGap' : 
                      type === 'urlAnalyses' ? 'urlAnalysis' : 
                      type === 'scripts' ? 'script' : 'prompt';
      
      let detail = titleDesc;
      if (!detail) {
        if (type === 'contentGaps') detail = `Scanned niche`;
        else if (type === 'urlAnalyses') detail = `Teardown of YouTube video URL`;
        else if (type === 'scripts') detail = `Compiled blueprint for script topic`;
        else detail = `Assembled aesthetic image tags`;
      }

      const newLog: ActivityLog = {
        id: `act_${Date.now()}`,
        type: logType,
        title: logTitle,
        detail: detail,
        credits: amount,
        time: 'Just now'
      };
      setActivityLogs(prev => [newLog, ...prev]);

      const newNotif = {
        id: `notif_${Date.now()}`,
        type: 'success' as const,
        message: `${logTitle}: ${detail}`,
        time: 'Just now',
        unread: true
      };
      setNotifications(prev => [newNotif, ...prev]);

      return true;
    } catch (err: any) {
      console.error('Credit verification failed:', err);
      addToast('error', 'SaaS billing server is unreachable.');
      return false;
    }
  };

  // Sync billing details automatically when authenticated or billing tab becomes active
  useEffect(() => {
    if (auth.user) {
      syncBilling(auth.user.id);
    }
  }, [auth.user, activeTab]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const consumeCredits = (amount: number, type: 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts', titleDesc?: string) => {
    setCredits(prev => {
      const next = Math.max(0, prev - amount);
      localStorage.setItem('viralgap_credits', next.toString());
      return next;
    });
    setUsageStats((prev: any) => {
      const next = {
        ...prev,
        [type]: prev[type] + 1
      };
      localStorage.setItem('viralgap_usage_stats', JSON.stringify(next));
      return next;
    });

    // Add activity log
    const logTitle = type === 'contentGaps' ? 'Content Gap Scanned' : 
                     type === 'urlAnalyses' ? 'Video URL Analyzed' : 
                     type === 'scripts' ? 'Viral Script Generated' : 'Thumbnail Prompt Created';
    const logType = type === 'contentGaps' ? 'contentGap' : 
                    type === 'urlAnalyses' ? 'urlAnalysis' : 
                    type === 'scripts' ? 'script' : 'prompt';
    
    let detail = titleDesc;
    if (!detail) {
      if (type === 'contentGaps') detail = `Scanned niche`;
      else if (type === 'urlAnalyses') detail = `Teardown of YouTube video URL`;
      else if (type === 'scripts') detail = `Compiled blueprint for script topic`;
      else detail = `Assembled aesthetic image tags`;
    }

    const newLog: ActivityLog = {
      id: `act_${Date.now()}`,
      type: logType,
      title: logTitle,
      detail: detail,
      credits: amount,
      time: 'Just now'
    };
    setActivityLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('viralgap_activity_logs', JSON.stringify(updated));
      return updated;
    });

    // Add notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      type: 'success' as const,
      message: `${logTitle}: ${detail}`,
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('viralgap_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  // Toast feedback copy
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    addToast('success', `${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // (Unused handleCopyPrompt removed, as subcomponents implement copy helpers directly)

  // Auth Action Handlers
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput || !passwordInput || !nameInput) {
      setAuthError('All fields are required.');
      return;
    }
    
    // Simulate signup & profile creation
    const newUser = {
      id: `usr_${Date.now()}`,
      email: emailInput,
      displayName: nameInput,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nameInput)}`,
      youtubeChannelUrl: '',
      niche: 'Technology',
      bio: 'Professional content creator looking for viral content gaps.'
    };
    
    saveAuth(newUser);
    addToast('success', 'Account created successfully! baseline plan set to Creator.');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput || !passwordInput) {
      setAuthError('Please enter both email and password.');
      return;
    }

    // Simulate login
    const user = {
      id: 'usr_default_omar',
      email: emailInput,
      displayName: 'Omar Creator',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(emailInput)}`,
      youtubeChannelUrl: 'https://youtube.com/@techarchitect',
      niche: 'Software Engineering',
      bio: 'Senior developer building ViralGap AI and crafting YouTube masterclasses.'
    };

    saveAuth(user);
    addToast('success', 'Logged in successfully!');
  };

  const handleOAuthLogin = () => {
    // Simulate OAuth connection
    addToast('info', 'Redirecting to Google OAuth Secure consent...');
    setTimeout(() => {
      const user = {
        id: 'usr_oauth_google',
        email: 'omar263@gmail.com',
        displayName: 'Omar Al-Architect',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=omar`,
        youtubeChannelUrl: 'https://youtube.com/@techarchitect',
        niche: 'Software Engineering',
        bio: 'Senior developer building ViralGap AI and crafting YouTube masterclasses.'
      };
      saveAuth(user);
      addToast('success', 'Google OAuth authorization completed successfully!');
    }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput) {
      setAuthError('Please provide your registered email.');
      return;
    }
    setAuthSuccess(`A password reset authorization token has been dispatched to ${emailInput}`);
    addToast('info', 'Reset request successfully delivered.');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!passwordInput) {
      setAuthError('Please specify a new password.');
      return;
    }
    setAuthSuccess('Password updated successfully. You may now log in.');
    setAuth(prev => ({ ...prev, view: 'login' }));
    addToast('success', 'Password reset successfully.');
  };

  const handleLogout = () => {
    setAuth({
      user: null,
      isAuthenticated: false,
      view: 'login'
    });
    localStorage.removeItem('viralgap_auth');
    addToast('info', 'Session ended safely.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) return;

    const updated = {
      ...auth.user,
      displayName: displayNameField,
      youtubeChannelUrl: channelUrlField,
      niche: nicheField,
      bio: bioField
    };

    saveAuth(updated);
    setOnboarding(prev => {
      const next = { ...prev, step3ProfileConfigured: true };
      localStorage.setItem('viralgap_onboarding', JSON.stringify(next));
      return next;
    });
    addToast('success', 'Creator profile saved successfully!');
  };

  const handleResetCredits = () => {
    setCredits(500);
    localStorage.setItem('viralgap_credits', '500');
    addToast('success', 'Credits refilled safely to maximum tier!');
  };

  // Content Gap API Generator Calls
  const handleContentGapResultsUpdate = (results: any[]) => {
    setContentGapResults(results);
    if (results && results.length > 0) {
      setOnboarding(prev => {
        const next = { ...prev, step2ContentGapSearched: true };
        localStorage.setItem('viralgap_onboarding', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleUrlResultUpdate = (result: any) => {
    setUrlResult(result);
    if (result) {
      setOnboarding(prev => {
        const next = { ...prev, step1UrlAnalyzed: true };
        localStorage.setItem('viralgap_onboarding', JSON.stringify(next));
        return next;
      });
    }
  };



  // =========================================================
  // VIEW RENDER LOGIC
  // =========================================================

  // Compile full database schema DDL script
  const fullDdlScript = useMemo(() => {
    let script = `-- =========================================================\n`;
    script += `-- VIRALGAP AI - ENTERPRISE DATABASE DDL CONFIGURATION\n`;
    script += `-- Target DBMS: PostgreSQL / Supabase PostgreSQL\n`;
    script += `-- =========================================================\n\n`;

    SCHEMA_TABLES.forEach(table => {
      script += `-- Table: ${table.name} (${table.purpose})\n`;
      script += `CREATE TABLE IF NOT EXISTS public.${table.name} (\n`;
      const fieldLines = table.fields.map(f => `  ${f.name} ${f.type} ${f.constraints}`.trim());
      script += fieldLines.join(',\n');
      script += `\n);\n\n`;

      table.indexes.forEach(idx => {
        script += `${idx}\n`;
      });
      script += `\n`;
    });
    return script;
  }, []);

  const fullRlsScript = useMemo(() => {
    let script = `-- =========================================================\n`;
    script += `-- VIRALGAP AI - ROW LEVEL SECURITY (RLS) POLICIES\n`;
    script += `-- =========================================================\n\n`;

    RLS_POLICIES.forEach(policy => {
      script += `-- Enable RLS for table: ${policy.table}\n`;
      script += `ALTER TABLE public.${policy.table} ENABLE ROW LEVEL SECURITY;\n`;
      script += `${policy.definition}\n\n`;
    });
    return script;
  }, []);

  // Filter tables based on search
  const filteredTables = useMemo(() => {
    if (!archSearch) return SCHEMA_TABLES;
    return SCHEMA_TABLES.filter(t => 
      t.name.toLowerCase().includes(archSearch.toLowerCase()) || 
      t.purpose.toLowerCase().includes(archSearch.toLowerCase()) ||
      t.fields.some(f => f.name.toLowerCase().includes(archSearch.toLowerCase()))
    );
  }, [archSearch]);

  const filteredApis = useMemo(() => {
    if (!archSearch) return API_ENDPOINTS;
    return API_ENDPOINTS.filter(api => 
      api.path.toLowerCase().includes(archSearch.toLowerCase()) || 
      api.description.toLowerCase().includes(archSearch.toLowerCase())
    );
  }, [archSearch]);


  // Technical SEO & Programmatic Landing Page Route Interception
  const isToolPage = window.location.pathname.startsWith('/tools/');
  if (isToolPage) {
    return <SEOToolsContainer />;
  }

  // RENDER SECURITY / AUTH SCREENS
  if (!auth.isAuthenticated) {
    return (
      <div id="auth_container" className="min-h-screen bg-[#040405] text-slate-100 flex flex-col md:flex-row selection:bg-white/10 selection:text-white font-sans">
        
        {/* Left Side: Conversion Landing Page Panel (60%) */}
        <div className="hidden md:flex md:w-[58%] lg:w-[62%] bg-[#0a0a0c] border-r border-white/5 p-12 flex-col justify-between overflow-y-auto max-h-screen scrollbar-thin">
          {/* Logo & Header */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-mono">ViralGap AI</span>
          </div>

          {/* Hero Copy Section */}
          <div className="my-auto py-12 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" /> Powered by Gemini 3.5 Flash
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Turn YouTube view decay into <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">exponential growth</span>.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Locate hidden keyword gaps, teardown competitor retention patterns, and compile high-retention video script outlines inside a unified creator studio.
              </p>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <span className="text-2xl lg:text-3xl font-bold text-white font-mono">+92%</span>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">First 30s Hook CTR</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl lg:text-3xl font-bold text-white font-mono">4.8x</span>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Script Draft Cycles</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl lg:text-3xl font-bold text-white font-mono">14.2%</span>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Organic Title CTR</p>
              </div>
            </div>

            {/* Bento Grid Feature Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                <Compass className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-semibold text-white">Keyword Gap Finder</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Cluster search volumes to locate high-demand underserved creator niches.</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                <Youtube className="w-5 h-5 text-rose-400" />
                <h4 className="text-xs font-semibold text-white">Video DNA Teardowns</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Analyze retention tactics, pacing, and psychological triggers of viral videos.</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                <FileText className="w-5 h-5 text-sky-400" />
                <h4 className="text-xs font-semibold text-white">Multi-Version Scripting</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Draft Retention, Watch Time, and Contrarian scripts with voiceover blueprints.</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                <Flame className="w-5 h-5 text-amber-500" />
                <h4 className="text-xs font-semibold text-white">Predictive Viral Index</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">Estimate title CTR and script strength using deep semantic models.</p>
              </div>
            </div>

            {/* Pricing Preview Banner */}
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Special Launch Promotion</h4>
                  <p className="text-[10px] text-emerald-400/80 mt-0.5">Claim 50 bonus credits on setup Completion</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white font-mono">$19/mo</span>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Creator tier</p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="border-l-2 border-emerald-500 pl-4 py-1">
              <p className="text-[11px] italic text-slate-400 leading-relaxed">
                "ViralGap's hook builder changed everything for us. Our average viewer duration went from 3 minutes to over 5 minutes."
              </p>
              <span className="text-[10px] font-semibold text-white mt-1 block">
                — Creator Academy (420k subscribers)
              </span>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="text-[10px] font-mono text-slate-500 flex justify-between items-center border-t border-white/5 pt-4">
            <span>Powered by Gemini AI Engine</span>
            <span>Trusted by 10,000+ Creators</span>
          </div>
        </div>

        {/* Right Side: Auth Card Panel (40%) */}
        <div className="w-full md:w-[42%] lg:w-[38%] flex flex-col justify-between p-6 md:p-12 overflow-y-auto max-h-screen scrollbar-thin">
          {/* Mobile-only logo */}
          <div className="flex items-center justify-between md:hidden py-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <span className="text-base font-bold tracking-tight text-white font-mono">ViralGap AI</span>
            </div>
            <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE</span>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto my-auto py-8">
            <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"></div>

              {/* Title Block */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
                  {auth.view === 'login' && 'Welcome Back'}
                  {auth.view === 'signup' && 'Register Creator'}
                  {auth.view === 'forgot' && 'Reset Vault'}
                  {auth.view === 'reset' && 'Set Password'}
                </h2>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  {auth.view === 'login' && 'Unlock hidden content gaps and construct viral scripts.'}
                  {auth.view === 'signup' && 'Join the top tier of analytical YouTube creators.'}
                  {auth.view === 'forgot' && 'Provide your email to dispatch a recovery link.'}
                  {auth.view === 'reset' && 'Choose a secure, resilient password for your vault.'}
                </p>
              </div>

              {/* Error alerts */}
              {authError && (
                <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-rose-400 text-xs leading-relaxed animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-2 text-emerald-400 text-xs leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* Auth forms */}
              {auth.view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        placeholder="omar263@gmail.com" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-[#040405] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-100 transition-all placeholder:text-slate-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Password</label>
                      <button 
                        type="button" 
                        onClick={() => { setAuth(prev => ({ ...prev, view: 'forgot' })); setAuthError(null); }}
                        className="text-[9px] font-mono text-emerald-400 hover:underline hover:text-emerald-300"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-[#040405] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-100 transition-all placeholder:text-slate-600"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer mt-6"
                  >
                    CONTINUE TO APP <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {auth.view === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Your Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Omar Creator" 
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-[#040405] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-100 transition-all placeholder:text-slate-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        placeholder="omar263@gmail.com" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-[#040405] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-100 transition-all placeholder:text-slate-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Secure Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-[#040405] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-100 transition-all placeholder:text-slate-600"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer mt-6"
                  >
                    CREATE MY SPACE <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {auth.view === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        placeholder="omar263@gmail.com" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-[#040405] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-100 transition-all placeholder:text-slate-600"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 border border-white/5"
                  >
                    DISPATCH LINK <ArrowRight className="w-4 h-4" />
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { setAuth(prev => ({ ...prev, view: 'login' })); setAuthError(null); setAuthSuccess(null); }}
                    className="w-full text-center text-xs text-slate-500 hover:text-white transition-all mt-4"
                  >
                    Return to Login
                  </button>
                </form>
              )}

              {/* Google OAuth Option */}
              {auth.view !== 'forgot' && auth.view !== 'reset' && (
                <div className="mt-6">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-600 uppercase tracking-wider">Or secure integration</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleOAuthLogin}
                    className="w-full mt-4 py-3 bg-[#0a0a0c] border border-white/5 hover:border-white/10 rounded-xl text-xs text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2.5 font-medium cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-emerald-400" />
                    Sign In with Google Account
                  </button>
                </div>
              )}

              {/* Footnote */}
              <div className="mt-8 text-center text-xs text-slate-500">
                {auth.view === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => { setAuth(prev => ({ ...prev, view: 'signup' })); setAuthError(null); setAuthSuccess(null); }} 
                      className="text-emerald-400 hover:underline font-medium font-mono uppercase text-[10px]"
                    >
                      Register here
                    </button>
                  </>
                ) : (
                  auth.view === 'signup' && (
                    <>
                      Already have an account?{' '}
                      <button 
                        onClick={() => { setAuth(prev => ({ ...prev, view: 'login' })); setAuthError(null); setAuthSuccess(null); }} 
                        className="text-emerald-400 hover:underline font-medium font-mono uppercase text-[10px]"
                      >
                        Log in here
                      </button>
                    </>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-center items-center gap-4 text-[10px] text-slate-600 font-mono">
              <span>Secure OAuth 2.0</span>
              <span>•</span>
              <span>Gemini Guardrails</span>
            </div>
          </div>

          {/* Minimal Footer */}
          <footer className="text-center text-[10px] text-slate-600 font-mono py-4 border-t border-white/5">
            ViralGap AI © 2026. Premium SaaS Framework.
          </footer>
        </div>
      </div>
    );
  }

  // CORE APPLICATION INTERFACE (LOGGED IN)
  return (
    <div id="app_workspace" className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-900 flex">
      
      {/* Dynamic Global Command Palette Search Modal */}
      {showCommandPalette && (
        <div 
          onClick={() => setShowCommandPalette(false)}
          className="fixed inset-0 bg-[#070b14]/80 backdrop-blur-md z-50 flex items-start justify-center pt-[15vh] p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#0c101d] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] cursor-default animate-fade-in"
          >
            {/* Search Input block */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-900 bg-[#070b14]/40">
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <input 
                type="text"
                autoFocus
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Search tools, commands, admin panels... (e.g. gap, trends)"
                className="w-full bg-transparent text-sm text-slate-100 focus:outline-none placeholder-slate-500"
              />
              <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-900">
                ESC
              </span>
            </div>

            {/* Results list */}
            <div className="p-3 overflow-y-auto space-y-1 divide-y divide-slate-900/40">
              {[
                { name: 'Go to Workspace Dashboard', tab: 'dashboard', desc: 'Overview of metrics, recent analyses, & usage limits', icon: LayoutDashboard, cat: 'Core Tools' },
                { name: 'Open Content Gap Finder', tab: 'content-gap', desc: 'Identify high-demand, low-competition keywords in your niche', icon: Compass, cat: 'Research' },
                { name: 'Scan Opportunities', tab: 'opportunity-scanner', desc: 'Comprehensive competitor video audits & opportunity scoring', icon: Sliders, cat: 'Research' },
                { name: 'Generate Better Videos from URLs', tab: 'url-analyzer', desc: 'Teardown hooks and retention strategy from any video link', icon: Link, cat: 'Scripting' },
                { name: 'Open YouTube Script Generator', tab: 'script-generator', desc: 'Assemble full script blueprints and production worksheets', icon: FileText, cat: 'Scripting' },
                { name: 'View Content Editorial Calendar', tab: 'content-calendar', desc: 'Map out release schedules, hooks, and drafts in calendar grid', icon: Calendar, cat: 'Planning' },
                { name: 'Open Trend Radar Map', tab: 'trends', desc: 'Explore exploding niches and viral high-growth YouTube waves', icon: TrendingUp, cat: 'Research' },
                { name: 'Design Midjourney Thumbnails', tab: 'prompts', desc: 'Build prompt recipes for photorealistic thumbnail backdrops', icon: ImageIcon, cat: 'Assets' },
                { name: 'Generate Video Prompts (Runway/Sora)', tab: 'video-prompts', desc: 'Assemble advanced text-to-video parameters and directions', icon: Video, cat: 'Assets' },
                { name: 'Simulate Viral Prediction Index', tab: 'viral-predictor', desc: 'Score your metadata and estimate title CTR with predictive neural AI', icon: Flame, cat: 'Intelligence' },
                { name: 'Consult AI Creator Coach', tab: 'creator-copilot', desc: 'Instant chat session with specialized channel growth agent', icon: Award, cat: 'Intelligence' },
                { name: 'Configure Competitor Watchlists', tab: 'competitor-watch', desc: 'Automate tracking for key competitor upload frequencies', icon: Eye, cat: 'Research' },
                { name: 'Manage Subscriptions & Billing', tab: 'billing', desc: 'Top up credits, purchase tiers, view invoices', icon: Coins, cat: 'Account' },
                { name: 'Edit Workspace Settings', tab: 'settings', desc: 'Set custom niche preferences, channels, and profile card details', icon: SettingsIcon, cat: 'Account' },
                { name: 'View Founder Dashboard KPIs', tab: 'founder-dashboard', desc: 'Operational MRR tracking, live server sessions, and subscriber charts', icon: TrendingUp, cat: 'Admin' },
                { name: 'Configure DevOps & Firewalls', tab: 'devops-console', desc: 'Realtime database health, rulesets, and active server clusters', icon: Shield, cat: 'Admin' },
              ].filter(cmd => 
                cmd.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
                cmd.cat.toLowerCase().includes(commandSearch.toLowerCase()) ||
                cmd.desc.toLowerCase().includes(commandSearch.toLowerCase())
              ).map((cmd, idx) => {
                const CmdIcon = cmd.icon;
                return (
                  <button 
                    key={cmd.tab + idx}
                    onClick={() => {
                      setActiveTab(cmd.tab as any);
                      setShowCommandPalette(false);
                      setCommandSearch('');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-900/60 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-[#070b14] border border-slate-900 group-hover:border-emerald-500/30 group-hover:text-emerald-400 rounded-xl text-slate-400 shrink-0 transition-colors">
                        <CmdIcon className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">{cmd.name}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{cmd.desc}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900/50 uppercase tracking-wide shrink-0">
                      {cmd.cat}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Footer tips */}
            <div className="px-5 py-3 border-t border-slate-900 bg-[#070b14]/20 text-[10px] text-slate-500 font-mono flex justify-between items-center">
              <span>Type to search instantly...</span>
              <span>↑↓ to navigate | ↵ to select</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className="px-4 py-3 rounded-xl border flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-up bg-[#0c0c0e]/95 border-[rgba(255,255,255,0.08)] text-slate-200 hover:border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {t.type === 'success' && (
                  <div className="p-1 bg-emerald-500/10 rounded-lg text-emerald-450 border border-emerald-500/15">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {t.type === 'error' && (
                  <div className="p-1 bg-rose-500/10 rounded-lg text-rose-550 border border-rose-500/15">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {t.type === 'info' && (
                  <div className="p-1 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/15">
                    <Activity className="w-4 h-4" />
                  </div>
                )}
              </div>
              <span className="text-[11px] font-sans font-medium tracking-normal leading-tight">{t.message}</span>
            </div>
            
            <button 
              onClick={() => setToasts(prev => prev.filter(toastItem => toastItem.id !== t.id))}
              className="text-slate-500 hover:text-slate-350 p-1 rounded transition-colors ml-2 shrink-0 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* MOBILE DRAWER SIDEBAR OVERLAY */}
      {mobileSidebarOpen && (
        <div id="mobile_sidebar_overlay" className="fixed inset-0 bg-[#070b14]/85 backdrop-blur-md z-50 lg:hidden flex transition-all duration-300">
          <div className="w-72 bg-[#0c101d] border-r border-slate-900 h-full p-6 flex flex-col justify-between animate-slide-right">
            <div>
              {/* Brand Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-900/60 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <Youtube className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold tracking-tight text-white font-mono">ViralGap AI</h1>
                    <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-mono text-emerald-400 uppercase tracking-wider">Foundation Live</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900/60 transition-all cursor-pointer font-mono text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="space-y-1 overflow-y-auto max-h-[60vh] scrollbar-thin pr-1">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">Creator Tools</span>
                
                {[
                  { id: 'dashboard', label: 'Workspace Dashboard', icon: LayoutDashboard },
                  { id: 'content-gap', label: 'Content Gap Finder', icon: Compass },
                  { id: 'opportunity-scanner', label: 'Opportunity Scanner', icon: Sliders },
                  { id: 'url-analyzer', label: 'Better Video Generator', icon: Link },
                  { id: 'script-generator', label: 'Script Generator', icon: FileText },
                  { id: 'trends', label: 'Trend Radar', icon: TrendingUp },
                  { id: 'prompts', label: 'Thumbnail Intelligence', icon: ImageIcon },
                  { id: 'video-prompts', label: 'Video Prompt Generator', icon: Video },
                  { id: 'viral-predictor', label: 'Viral Prediction Engine', icon: Flame },
                  { id: 'creator-copilot', label: 'AI Creator Coach', icon: Award },
                  { id: 'competitor-watch', label: 'Competitor Watch', icon: Eye },
                  { id: 'billing', label: 'Billing & Subscription', icon: Coins },
                  { id: 'settings', label: 'Workspace Settings', icon: SettingsIcon },
                  { id: 'architecture', label: 'API Architecture', icon: Code },
                ].map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setMobileSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isCurrent ? 'bg-white/10 border border-white/10 text-white font-semibold' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile bottom info */}
            <div className="pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}>
                <img 
                  src={auth.user?.avatarUrl} 
                  alt="avatar" 
                  className="w-9 h-9 rounded-full border border-slate-850 bg-slate-900 shadow"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">{auth.user?.displayName}</p>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">{usageStats.plan} Plan</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>

          <div className="flex-grow h-full" onClick={() => setMobileSidebarOpen(false)}></div>
        </div>
      )}

      {/* LEFT NAVIGATION SIDEBAR (DESKTOP) */}
      <aside className={`bg-[#0c101d] border-r border-slate-900 shrink-0 hidden lg:flex flex-col justify-between transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
        
        {/* Brand Logo & API health */}
        <div className="p-4 border-b border-slate-900/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
                <Youtube className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="animate-fade-in truncate">
                  <h1 className="text-sm font-bold tracking-tight text-white font-mono">ViralGap AI</h1>
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-mono text-emerald-400 uppercase tracking-wider">Foundation Live</span>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900/60 transition-all cursor-pointer"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="mt-4 pt-3 border-t border-slate-900/60 space-y-2 text-[10px] font-mono animate-fade-in">
              <div className="flex justify-between items-center text-slate-500">
                <span>GEMINI WORKER:</span>
                {serverHealth.hasGeminiKey ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">● ACTIVE</span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1">● DEMO MODE</span>
                )}
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>SUPABASE GATEWAY:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">● INTEGRATED</span>
              </div>
            </div>
          )}
        </div>

        {/* Primary Sidebar Links */}
        <div className={`px-3 py-4 flex-grow overflow-y-auto space-y-1 scrollbar-thin ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
          {!sidebarCollapsed && (
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-3 block mb-2 mt-4">Creator Tools</span>
          )}
          
          {[
            { id: 'dashboard', label: 'Workspace Dashboard', icon: LayoutDashboard },
            { id: 'content-gap', label: 'Content Gap Finder', icon: Compass },
            { id: 'opportunity-scanner', label: 'Opportunity Scanner', icon: Sliders },
            { id: 'url-analyzer', label: 'Better Video Generator', icon: Link },
            { id: 'script-generator', label: 'Script Generator', icon: FileText },
            { id: 'content-calendar', label: 'Content Calendar', icon: Calendar },
            { id: 'trends', label: 'Trend Radar', icon: TrendingUp },
            { id: 'prompts', label: 'Thumbnail Intelligence', icon: ImageIcon },
            { id: 'video-prompts', label: 'Video Prompt Generator', icon: Video },
            { id: 'viral-predictor', label: 'Viral Prediction Engine', icon: Flame, iconColor: 'text-amber-500' },
            { id: 'creator-copilot', label: 'AI Creator Coach', icon: Award, iconColor: 'text-emerald-400' },
            { id: 'competitor-watch', label: 'Competitor Watch', icon: Eye, iconColor: 'text-emerald-400' },
            { 
              id: 'opportunity-alerts', 
              label: 'Opportunity Alerts', 
              icon: Bell, 
              iconColor: 'text-emerald-400 animate-pulse',
              badge: 'NEW'
            },
            { id: 'billing', label: 'Billing & Sub', icon: Coins },
            { id: 'settings', label: 'Settings Page', icon: SettingsIcon },
            { id: 'founder-dashboard', label: 'Founder Dashboard', icon: TrendingUp, iconColor: 'text-emerald-400' },
            { id: 'affiliate-dashboard', label: 'Affiliate & Referrals', icon: Gift, iconColor: 'text-emerald-400' },
            { id: 'devops-console', label: 'DevOps & Security', icon: Shield, iconColor: 'text-emerald-400' },
            { id: 'architecture', label: 'API & DB Schema Spec', icon: Code },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center transition-all cursor-pointer ${
                  sidebarCollapsed 
                    ? `p-3 rounded-lg justify-center ${isCurrent ? 'bg-white/10 text-white border border-white/10 shadow-sm' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'}`
                    : `w-full gap-3 px-3 py-2 rounded-lg text-xs font-medium ${isCurrent ? 'bg-white/10 border border-white/10 text-white font-semibold' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'}`
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.iconColor || ''}`} />
                {!sidebarCollapsed && (
                  <span className="truncate flex-grow text-left">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge && (
                  <span className="bg-emerald-500/10 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase shrink-0 tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Profile Card & Session Actions */}
        <div className={`p-4 border-t border-slate-900 bg-[#080c16]/50 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
          {sidebarCollapsed ? (
            <button 
              onClick={() => setActiveTab('settings')}
              className="cursor-pointer"
              title="Settings & Profile"
            >
              <img 
                src={auth.user?.avatarUrl} 
                alt="avatar" 
                className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900 shadow hover:border-emerald-500 transition-all"
              />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => setActiveTab('settings')}>
                <img 
                  src={auth.user?.avatarUrl} 
                  alt="avatar" 
                  className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900 shadow"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">{auth.user?.displayName}</p>
                  <span className="text-[9px] font-mono font-bold text-white bg-white/10 border border-white/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {usageStats.plan} Plan
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="px-3 py-2 bg-[#0c101d] border border-slate-800/80 hover:border-slate-700 hover:text-white rounded-lg text-[10px] font-mono text-slate-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <SettingsIcon className="w-3.5 h-3.5" /> settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg text-[10px] font-mono text-rose-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> exit
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* CORE CONTENT PANEL */}
      <main className="flex-grow flex flex-col min-h-screen">
        
        {/* TOP STATUS BAR NAVBAR */}
        <header className="h-16 border-b border-slate-900 bg-[#080c16]/80 backdrop-blur-md flex items-center justify-between px-6 sm:px-8 sticky top-0 z-10">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-900/60 rounded-xl lg:hidden transition-all cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-slate-500 hidden sm:inline">WORKSPACE AREA:</span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest bg-slate-950 px-2.5 py-1 border border-slate-900/80 rounded-lg">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          {/* Linear-style Search Trigger Bar */}
          <div className="hidden md:flex items-center flex-grow max-w-sm mx-8">
            <button 
              onClick={() => setShowCommandPalette(true)}
              className="w-full flex items-center justify-between px-4 py-1.5 bg-[#070b14]/50 hover:bg-[#0c101d] border border-slate-900 hover:border-slate-800 rounded-lg text-slate-400 hover:text-slate-300 text-xs font-mono transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                <span>Search workspace...</span>
              </div>
              <kbd className="text-[10px] bg-slate-950 px-1.5 py-0.5 border border-slate-900/80 rounded font-sans text-slate-500">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Credits Counter, Notification Bell & User Avatar buttons */}
          <div className="flex items-center gap-3 relative">
            
            {/* Remaining credits readout */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#0c101d] border border-slate-800 rounded-lg shrink-0">
              <Coins className="w-4 h-4 text-amber-500" />
              <div className="text-xs font-mono text-slate-300">
                <span className="font-bold text-white">{credits}</span> <span className="text-[10px] text-slate-500 font-normal">credits</span>
              </div>
            </div>

            {/* Notification dropbutton */}
            <div className="relative">
              <button 
                onClick={() => { setNotificationsOpen(!notificationsOpen); setUserMenuOpen(false); }}
                className={`p-2 bg-[#0c101d] border border-slate-850 hover:border-slate-750 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer relative ${notificationsOpen ? 'border-white text-white' : ''}`}
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#0c101d] animate-pulse"></span>
                )}
              </button>

              {/* Notification dropcard content */}
              {notificationsOpen && (
                <NotificationsDropdown 
                  notifications={notifications}
                  onMarkAllAsRead={() => {
                    setNotifications((prev) => {
                      const updated = prev.map((n) => ({ ...n, unread: false }));
                      localStorage.setItem('viralgap_notifications', JSON.stringify(updated));
                      return updated;
                    });
                    addToast('success', 'All notifications marked as read.');
                  }}
                  onClearAll={() => {
                    setNotifications([]);
                    localStorage.removeItem('viralgap_notifications');
                    addToast('info', 'All workspace notifications cleared.');
                  }}
                  onClose={() => setNotificationsOpen(false)}
                />
              )}
            </div>

            {/* Profile image button menu */}
            <div className="relative">
              <button 
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotificationsOpen(false); }}
                className="flex items-center gap-1 cursor-pointer shrink-0"
              >
                <img 
                  src={auth.user?.avatarUrl} 
                  alt="avatar" 
                  className={`w-8 h-8 rounded-full border bg-slate-900 hover:border-emerald-500 transition-all ${userMenuOpen ? 'border-emerald-500' : 'border-slate-800'}`}
                />
              </button>

              {/* User Dropdown menu dropcard content */}
              {userMenuOpen && (
                <UserMenuDropdown 
                  user={auth.user || { displayName: 'Creator', email: '', avatarUrl: '' }}
                  plan={usageStats.plan}
                  credits={credits}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onLogout={handleLogout}
                  onRefillCredits={handleResetCredits}
                  onClose={() => setUserMenuOpen(false)}
                />
              )}
            </div>

          </div>
        </header>

        {/* WORKSPACE VIEW CONTENT */}
        <div className="flex-grow p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-8 scrollbar-thin">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Creator Greeting & Quick Action Banner */}
              <div className="bg-gradient-to-r from-emerald-950/25 via-[#0e1424] to-[#0c101e] border border-slate-850 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    Welcome to your Creator Command Centre, {auth.user?.displayName} <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </h2>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
                    ViralGap AI aggregates rising YouTube keywords, parses hooks of top-performing videos, and generates high-retention script blueprints to help you dominate your search niche.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => setActiveTab('content-gap')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-semibold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" /> Analyze a Niche
                  </button>
                  <button 
                    onClick={handleResetCredits}
                    className="px-4 py-2 bg-[#0c101d] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refill Credits
                  </button>
                </div>
              </div>

              {/* Gamified Onboarding Checklist */}
              {!onboarding.claimedBonus && (
                <div className="bg-[#0c101d] border border-white/5 rounded-2xl p-6 space-y-4 animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.06),transparent_60%)]"></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        🚀 CREATOR LAUNCHPAD ONBOARDING
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Complete these 3 core actions to unlock the platform's features and claim <span className="text-emerald-400 font-bold font-mono">50 bonus credits</span>.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2.5 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                      <div className="w-16 bg-[#070b14] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${(([onboarding.step1UrlAnalyzed, onboarding.step2ContentGapSearched, onboarding.step3ProfileConfigured].filter(Boolean).length) / 3) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {[onboarding.step1UrlAnalyzed, onboarding.step2ContentGapSearched, onboarding.step3ProfileConfigured].filter(Boolean).length}/3 steps
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Step 1 */}
                    <button 
                      onClick={() => setActiveTab('url-analyzer')}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${onboarding.step1UrlAnalyzed ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-mono text-slate-500">STEP 1</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboarding.step1UrlAnalyzed ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-slate-800'}`}>
                          {onboarding.step1UrlAnalyzed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">Analyze a Competitor Video</h4>
                        <p className="text-[9px] text-slate-500 mt-0.5 truncate">Dismantle hooks and visual pacing metrics</p>
                      </div>
                    </button>

                    {/* Step 2 */}
                    <button 
                      onClick={() => setActiveTab('content-gap')}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${onboarding.step2ContentGapSearched ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-mono text-slate-500">STEP 2</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboarding.step2ContentGapSearched ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-slate-800'}`}>
                          {onboarding.step2ContentGapSearched && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">Scan a Niche Vertical</h4>
                        <p className="text-[9px] text-slate-500 mt-0.5 truncate">Locate high-demand search content gaps</p>
                      </div>
                    </button>

                    {/* Step 3 */}
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${onboarding.step3ProfileConfigured ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-mono text-slate-500">STEP 3</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${onboarding.step3ProfileConfigured ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-slate-800'}`}>
                          {onboarding.step3ProfileConfigured && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">Configure Creator Settings</h4>
                        <p className="text-[9px] text-slate-500 mt-0.5 truncate">Set niche preference triggers & channel specs</p>
                      </div>
                    </button>
                  </div>

                  {/* Claim Banner */}
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono text-slate-500">REWARD: +50 SIMULATED CREDITS</span>
                    <button
                      disabled={![onboarding.step1UrlAnalyzed, onboarding.step2ContentGapSearched, onboarding.step3ProfileConfigured].every(Boolean)}
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/billing/refill-quota', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: auth.user?.id || 'usr_default_omar' })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setOnboarding(prev => {
                              const next = { ...prev, claimedBonus: true };
                              localStorage.setItem('viralgap_onboarding', JSON.stringify(next));
                              return next;
                            });
                            setCredits(prev => prev + 50);
                            addToast('success', 'Onboarding bonus of 50 credits successfully claimed!');
                          }
                        } catch (err) {
                          addToast('error', 'Failed to claim onboarding reward.');
                        }
                      }}
                      className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                        [onboarding.step1UrlAnalyzed, onboarding.step2ContentGapSearched, onboarding.step3ProfileConfigured].every(Boolean)
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/10'
                          : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      CLAIM ONBOARDING BONUS
                    </button>
                  </div>
                </div>
              )}

              {/* HIGH FIDELITY STATS BENTO MATRIX & CARDS */}
              <DashboardStats 
                usageStats={usageStats}
                credits={credits}
                recentGaps={contentGapResults}
                recentUrlAnalysis={urlResult}
                recentScript={scriptResult}
                recentPrompt={promptResult}
                onNavigate={(tab) => setActiveTab(tab)}
              />

              {/* RECENT SESSION ACTIVITY LOGS AUDIT TRAIL */}
              <RecentActivityTable 
                logs={activityLogs} 
                onClearLogs={() => {
                  setActivityLogs([]);
                  localStorage.removeItem('viralgap_activity_logs');
                  addToast('info', 'Session activity trail cleared.');
                }}
              />
            </div>
          )}

          <React.Suspense fallback={<TabLoader />}>
          {/* TAB: CONTENT GAP ANALYZER */}

        {activeTab === 'content-gap' && (
          <ContentGapTool 
            userId={auth.user?.id || 'usr_default_omar'} 
            onUseCredits={requestCreditUsage} 
            addToast={addToast} 
            handleCopy={handleCopy}
            onUpdateResults={handleContentGapResultsUpdate} 
          />
        )}
        
        {activeTab === 'url-analyzer' && (
          <UrlAnalyzerTool 
            userId={auth.user?.id || 'usr_default_omar'} 
            onUseCredits={requestCreditUsage} 
            addToast={addToast} 
            handleCopy={handleCopy}
            onUpdateResult={handleUrlResultUpdate} 
          />
        )}
        
        {activeTab === 'script-generator' && (
          <ScriptGeneratorTool 
            userId={auth.user?.id || 'usr_default_omar'} 
            onUseCredits={requestCreditUsage} 
            addToast={addToast} 
            handleCopy={handleCopy}
            onUpdateResult={setScriptResult} 
          />
        )}

        {activeTab === 'trends' && (
          <TrendsTool 
            userId={auth.user?.id || 'usr_default_omar'} 
            onUseCredits={requestCreditUsage}
            addToast={addToast} 
          />
        )}

        {activeTab === 'prompts' && (
          <ThumbnailTool 
            userId={auth.user?.id || 'usr_default_omar'} 
            onUseCredits={requestCreditUsage} 
            addToast={addToast} 
            handleCopy={handleCopy}
            onUpdateResult={setPromptResult} 
          />
        )}

        {activeTab === 'video-prompts' && (
          <VideoGeneratorTool 
            userId={auth.user?.id || 'usr_default_omar'} 
            onUseCredits={requestCreditUsage} 
            addToast={addToast} 
            handleCopy={handleCopy} 
          />
        )}

        {activeTab === 'viral-predictor' && (
          <ViralPredictorTool 
            userId={auth.user?.id || 'usr_default_omar'} 
            onUseCredits={requestCreditUsage} 
            addToast={addToast} 
            handleCopy={handleCopy} 
          />
        )}

        {activeTab === 'creator-copilot' && (
          <CreatorCopilotTool 
            userId={auth.user?.id || 'usr_default_omar'} 
            onUseCredits={requestCreditUsage}
            addToast={addToast} 
            handleCopy={handleCopy} 
          />
        )}

        {activeTab === 'competitor-watch' && (
          <CompetitorTool 
            userId={auth.user?.id || 'usr_default_omar'} 
            addToast={addToast} 
          />
        )}

          {activeTab === 'opportunity-alerts' && (
            <OpportunityAlertsTab 
              userEmail={auth.user?.email || 'omar263@gmail.com'}
              addToast={addToast}
              onAlertTriggered={async () => {
                try {
                  const res = await fetch('/api/opportunity/logs?userId=usr_default_omar');
                  const data = await res.json();
                  if (data.success && data.logs.length > 0) {
                    const activeAlerts = data.logs.filter((l: any) => !l.read);
                    setNotifications(prev => {
                      const existingIds = new Set(prev.map(n => n.id));
                      const newNotifs = activeAlerts
                        .filter((l: any) => !existingIds.has(l.id))
                        .map((l: any) => ({
                          id: l.id,
                          type: l.type === 'competitor_viral' ? 'info' : 'success',
                          message: `[Radar] ${l.title}`,
                          time: 'Just now',
                          unread: true
                        }));
                      const updated = [...newNotifs, ...prev];
                      localStorage.setItem('viralgap_notifications', JSON.stringify(updated));
                      return updated;
                    });
                  }
                } catch (err) {
                  console.error('Error syncing notifications:', err);
                }
              }}
            />
          )}

          {/* TAB: BILLING */}
          {activeTab === 'billing' && (
            <div className="animate-fade-in">
              <BillingTab 
                currentPlan={usageStats.plan}
                credits={credits}
                invoices={serverInvoices}
                isSimulatorMode={true}
                onUpgradePlan={async (planName) => {
                  if (planName === 'Free') {
                    addToast('info', 'Please use the Manage Subscription Portal to downgrade back to Free.');
                    return;
                  }
                  try {
                    const res = await fetch('/api/stripe/create-checkout-session', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        plan: planName.toLowerCase(),
                        userId: auth.user?.id || 'usr_default_omar',
                        email: auth.user?.email || 'omar263@gmail.com'
                      })
                    });
                    const data = await res.json();
                    if (data.success && data.url) {
                      window.location.hash = data.url;
                    } else {
                      addToast('error', data.error || 'Failed to initialize checkout session.');
                    }
                  } catch (err) {
                    addToast('error', 'Stripe checkout route unreachable.');
                  }
                }}
                onManageSubscription={async () => {
                  try {
                    const res = await fetch('/api/stripe/create-portal-session', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: auth.user?.id || 'usr_default_omar'
                      })
                    });
                    const data = await res.json();
                    if (data.success && data.url) {
                      window.location.hash = data.url;
                    } else {
                      addToast('error', data.error || 'Failed to initialize portal session.');
                    }
                  } catch (err) {
                    addToast('error', 'Stripe customer portal is currently unreachable.');
                  }
                }}
                onRefillCredits={async () => {
                  if (!auth.user) return;
                  try {
                    const res = await fetch('/api/billing/refill-quota', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: auth.user.id })
                    });
                    const data = await res.json();
                    if (data.success) {
                      addToast('success', 'Credits refilled and simulated invoice receipt compiled!');
                      syncBilling(auth.user.id);
                    } else {
                      addToast('error', data.error || 'Could not refill credits.');
                    }
                  } catch (err) {
                    addToast('error', 'SaaS quota service is currently offline.');
                  }
                }}
                addToast={addToast}
              />
            </div>
          )}

          {/* TAB: DATABASE & API BLUEPRINT */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <Code className="text-emerald-400 w-6 h-6" />
                  <h2 className="text-xl font-bold tracking-tight text-white font-mono">Database & API Blueprint</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Full reference implementation documentation, RLS security triggers, and schema specifications.
                </p>
              </div>

              {/* Sub-navigation */}
              <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-2 flex flex-wrap gap-1 font-mono">
                {[
                  { id: 'overview', label: 'System Overview', icon: Layers },
                  { id: 'schema', label: 'DB Schema', icon: Database },
                  { id: 'security', label: 'RLS Policies', icon: ShieldCheck },
                  { id: 'api', label: 'REST API Specs', icon: Terminal },
                  { id: 'usage', label: 'Quota Controls', icon: Sliders },
                  { id: 'scalability', label: 'Scalability Roadmap', icon: TrendingUp }
                ].map((s) => (
                  <button 
                    key={s.id}
                    onClick={() => setArchTab(s.id as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer font-medium ${archTab === s.id ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                  >
                    <s.icon className="w-3.5 h-3.5" />
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Search filter widget */}
              {(archTab === 'schema' || archTab === 'api') && (
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    value={archSearch}
                    onChange={(e) => setArchSearch(e.target.value)}
                    className="w-full bg-[#0c101d] border border-slate-900 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder={archTab === 'schema' ? 'Filter columns, table names...' : 'Filter API routes...'}
                  />
                </div>
              )}

              {/* Content screens */}
              {archTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-6">
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{SYSTEM_ARCHITECTURE.overview}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div className="bg-[#070b14] border border-slate-950 p-4 rounded-xl space-y-2">
                        <h4 className="text-xs font-bold font-mono text-white">{SYSTEM_ARCHITECTURE.frontend.title}</h4>
                        <p className="text-[11px] text-slate-400">{SYSTEM_ARCHITECTURE.frontend.description}</p>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {SYSTEM_ARCHITECTURE.frontend.details.map((d, i) => <li key={i}>• {d}</li>)}
                        </ul>
                      </div>

                      <div className="bg-[#070b14] border border-slate-950 p-4 rounded-xl space-y-2">
                        <h4 className="text-xs font-bold font-mono text-white">{SYSTEM_ARCHITECTURE.backend.title}</h4>
                        <p className="text-[11px] text-slate-400">{SYSTEM_ARCHITECTURE.backend.description}</p>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {SYSTEM_ARCHITECTURE.backend.details.map((d, i) => <li key={i}>• {d}</li>)}
                        </ul>
                      </div>

                      <div className="bg-[#070b14] border border-slate-950 p-4 rounded-xl space-y-2">
                        <h4 className="text-xs font-bold font-mono text-white">{SYSTEM_ARCHITECTURE.database.title}</h4>
                        <p className="text-[11px] text-slate-400">{SYSTEM_ARCHITECTURE.database.description}</p>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {SYSTEM_ARCHITECTURE.database.details.map((d, i) => <li key={i}>• {d}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {archTab === 'schema' && (
                <div className="space-y-6">
                  <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-mono font-bold text-slate-400">PostgreSQL DDL script</span>
                      <button 
                        onClick={() => handleCopy(fullDdlScript, "Database DDL")}
                        className="px-2.5 py-1 bg-[#070b14] border border-slate-800 hover:border-slate-700 text-[10px] text-slate-300 font-mono rounded"
                      >
                        Copy DDL script
                      </button>
                    </div>
                    <pre className="text-[10px] font-mono bg-[#070b14] p-4 border border-slate-950 rounded-xl overflow-x-auto max-h-48 text-slate-400 leading-relaxed">
                      {fullDdlScript}
                    </pre>
                  </div>

                  <div className="space-y-4">
                    {filteredTables.map(t => (
                      <div key={t.name} className="bg-[#0c101d] border border-slate-900 rounded-xl p-5">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{t.name}</span>
                        <span className="text-xs text-slate-400 ml-3">{t.purpose}</span>

                        <div className="mt-3 overflow-x-auto">
                          <table className="w-full text-left text-[11px] font-mono">
                            <thead>
                              <tr className="border-b border-slate-900 text-slate-500">
                                <th className="pb-1.5">Column</th>
                                <th className="pb-1.5">Type</th>
                                <th className="pb-1.5">Constraints</th>
                                <th className="pb-1.5">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900/60 text-slate-300">
                              {t.fields.map(f => (
                                <tr key={f.name}>
                                  <td className="py-2 font-bold text-slate-200">{f.name}</td>
                                  <td className="py-2 text-sky-400">{f.type}</td>
                                  <td className="py-2 text-amber-500">{f.constraints || 'NULL'}</td>
                                  <td className="py-2 text-slate-400 font-sans">{f.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {archTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-mono font-bold text-slate-400">PostgreSQL RLS Commands</span>
                      <button 
                        onClick={() => handleCopy(fullRlsScript, "RLS script")}
                        className="px-2.5 py-1 bg-[#070b14] border border-slate-800 hover:border-slate-700 text-[10px] text-slate-300 font-mono rounded"
                      >
                        Copy RLS commands
                      </button>
                    </div>
                    <pre className="text-[10px] font-mono bg-[#070b14] p-4 border border-slate-950 rounded-xl overflow-x-auto max-h-48 text-slate-400 leading-relaxed">
                      {fullRlsScript}
                    </pre>
                  </div>

                  <div className="space-y-4">
                    {RLS_POLICIES.map((p, i) => (
                      <div key={i} className="bg-[#0c101d] border border-slate-900 rounded-xl p-4">
                        <div className="flex justify-between text-xs font-mono mb-2">
                          <span className="text-white">Table: <span className="text-sky-400">{p.table}</span></span>
                          <span className="text-emerald-400">{p.policyName}</span>
                        </div>
                        <code className="block text-[10px] font-mono bg-[#070b14] p-3 border border-slate-950 rounded-lg text-slate-300">
                          {p.definition}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {archTab === 'api' && (
                <div className="space-y-6">
                  {filteredApis.map((api, i) => (
                    <div key={i} className="bg-[#0c101d] border border-slate-900 rounded-xl p-6 space-y-4">
                      <div className="flex items-center gap-3 border-b border-slate-900 pb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 border border-sky-500/20 text-sky-400">
                          {api.method}
                        </span>
                        <span className="text-xs font-mono font-bold text-white">{api.path}</span>
                        <span className="text-[11px] text-slate-400 italic"> - {api.description}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-500 block mb-1">Request layout</span>
                          <pre className="bg-[#070b14] p-3 rounded-lg border border-slate-950 text-slate-300 overflow-x-auto">{api.requestFormat}</pre>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-1">Response layout</span>
                          <pre className="bg-[#070b14] p-3 rounded-lg border border-slate-950 text-emerald-300 overflow-x-auto">{api.responseFormat}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {archTab === 'usage' && (
                <div className="space-y-6">
                  <div className="bg-[#0c101d] border border-slate-900 rounded-xl p-6">
                    <pre className="text-[10px] font-mono bg-[#070b14] p-4 border border-slate-950 rounded-xl overflow-x-auto max-h-80 text-slate-400 leading-relaxed">
                      {SUBSCRIPTION_LOGIC.accessControlLogic}
                    </pre>
                  </div>
                </div>
              )}

              {archTab === 'scalability' && (
                <div className="space-y-6">
                  <div className="relative border-l border-slate-900 pl-4 space-y-6 ml-2">
                    {SCALABILITY_AND_COSTS.scalingStages.map((s, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase">{s.scale}</h4>
                        <div className="text-[11px] text-slate-400 mt-1 space-y-1">
                          <p>Database: {s.dbTech}</p>
                          <p>Optimization: {s.queryHandling}</p>
                          <p>Cache: {s.cacheTier}</p>
                          <p>API Fees: {s.apiCosts}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
          </React.Suspense>

        </div>

        {/* Outer background/footer buffer */}
        <footer className="h-12 border-t border-slate-900/40 text-center text-[10px] font-mono text-slate-600 flex items-center justify-center">
          ViralGap AI Platform. Dedicated Workspace verified for Principal Omar Al-Architect.
        </footer>
      </main>

      {/* Stripe Simulator Overlays */}
      {currentHash.startsWith('#sim-checkout') && (
        <StripeSimulatorCheckout 
          onClose={() => {
            window.location.hash = '#billing';
          }}
          onPaymentCompleted={() => {
            if (auth.user) {
              syncBilling(auth.user.id);
            }
          }}
          addToast={addToast}
        />
      )}

      {currentHash.startsWith('#sim-portal') && (
        <StripeSimulatorPortal 
          onClose={() => {
            window.location.hash = '#billing';
          }}
          onPortalActionCompleted={() => {
            if (auth.user) {
              syncBilling(auth.user.id);
            }
          }}
          addToast={addToast}
        />
      )}

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        onUpgradePlan={async (planName) => {
          setShowUpgradeModal(false);
          try {
            const res = await fetch('/api/stripe/create-checkout-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                plan: planName.toLowerCase(),
                userId: auth.user?.id || 'usr_default_omar',
                email: auth.user?.email || 'omar263@gmail.com'
              })
            });
            const data = await res.json();
            if (data.success && data.url) {
              window.location.hash = data.url;
            } else {
              addToast('error', data.error || 'Failed to initialize checkout session.');
            }
          } catch (err) {
            addToast('error', 'Stripe checkout route unreachable.');
          }
        }}
      />

    </div>
  );
}

