import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Cpu, 
  Database, 
  Terminal, 
  RefreshCw, 
  Trash2, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Search, 
  Sliders, 
  Settings, 
  Activity, 
  Lock, 
  Server, 
  CloudLightning,
  AlertCircle
} from 'lucide-react';
import { SystemLog } from '../types';

interface DevOpsMetrics {
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
  };
  security: {
    rateLimitsBlocked: number;
    botBlocked: number;
    sanitizationEvents: number;
    csrfBlocked: number;
  };
  monitoring: {
    totalLogs: number;
    errors: number;
    warnings: number;
    uptimeSeconds: number;
    memoryHeapUsedMb: number;
    memoryHeapTotalMb: number;
  };
}

interface Props {
  userId: string;
}

export default function DevOpsConsoleTab({ userId }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'security' | 'cache' | 'logs' | 'monitoring'>('monitoring');
  const [metrics, setMetrics] = useState<DevOpsMetrics | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters for Log Stream
  const [logLevelFilter, setLogLevelFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [logCategoryFilter, setLogCategoryFilter] = useState<'all' | 'security' | 'performance' | 'api' | 'ai' | 'stripe' | 'user'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch telemetry metrics and log streams
  const fetchTelemetry = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      // 1. Fetch Metrics
      const metricsRes = await fetch('/api/devops/metrics', {
        headers: { 'x-requested-with': 'XMLHttpRequest' }
      });
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }

      // 2. Fetch Logs
      const logsQuery = new URLSearchParams();
      logsQuery.append('limit', '150');
      if (logLevelFilter !== 'all') logsQuery.append('level', logLevelFilter);
      if (logCategoryFilter !== 'all') logsQuery.append('category', logCategoryFilter);
      if (searchTerm) logsQuery.append('search', searchTerm);

      const logsRes = await fetch(`/api/devops/logs?${logsQuery.toString()}`, {
        headers: { 'x-requested-with': 'XMLHttpRequest' }
      });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Telemetry fetch failed:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [logLevelFilter, logCategoryFilter, searchTerm]);

  // Initial load & Polling Loop
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 6000); // Poll every 6 seconds
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  // Handle Clear Console logs
  const handleClearLogs = async () => {
    setIsClearing(true);
    try {
      const res = await fetch('/api/devops/logs/clear', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-requested-with': 'XMLHttpRequest'
        }
      });
      if (res.ok) {
        fetchTelemetry();
      }
    } catch (err) {
      console.error('Failed to clear logs:', err);
    } finally {
      setIsClearing(false);
    }
  };

  // Triggers simulator injection
  const handleInjectSimulatedLog = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/devops/logs/test', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-requested-with': 'XMLHttpRequest'
        }
      });
      if (res.ok) {
        fetchTelemetry();
      }
    } catch (err) {
      console.error('Failed to inject test log:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Format uptime to string
  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  // Download log dump as JSON file
  const downloadLogsDump = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `viralgap_devops_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">ViralGap DevOps & Production Console</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time security auditing, performance telemetry, edge CDN caching and unified system logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTelemetry(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium transition duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleInjectSimulatedLog}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium transition duration-200"
            title="Inject simulated security scan or error anomaly logs"
          >
            <CloudLightning className="w-3.5 h-3.5" />
            Simulate Event
          </button>

          <button
            onClick={handleClearLogs}
            disabled={isClearing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 text-rose-400 rounded-lg text-xs font-medium transition duration-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Telemetry
          </button>
        </div>
      </div>

      {/* Sub tabs selector */}
      <div className="flex space-x-1 p-0.5 bg-slate-900/60 rounded-xl border border-slate-900 max-w-md">
        <button
          onClick={() => setActiveSubTab('monitoring')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'monitoring' 
              ? 'bg-slate-850 text-emerald-400 font-semibold shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Metrics
        </button>
        <button
          onClick={() => setActiveSubTab('security')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'security' 
              ? 'bg-slate-850 text-emerald-400 font-semibold shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Security Shield
        </button>
        <button
          onClick={() => setActiveSubTab('cache')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'cache' 
              ? 'bg-slate-850 text-emerald-400 font-semibold shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          Edge Caching
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'logs' 
              ? 'bg-slate-850 text-emerald-400 font-semibold shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Live Logs ({logs.length})
        </button>
      </div>

      {isLoading && !metrics ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-slate-400">Syncing with system orchestrator...</p>
        </div>
      ) : (
        <>
          {/* ======================================================= */}
          {/* SUB-TAB: GENERAL MONITORING METRICS */}
          {/* ======================================================= */}
          {activeSubTab === 'monitoring' && (
            <div className="space-y-6">
              
              {/* Uptime and Resource Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 flex items-center gap-4">
                  <span className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                    <Server className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Process Uptime</p>
                    <p className="text-base font-bold text-white mt-1">
                      {metrics ? formatUptime(metrics.monitoring.uptimeSeconds) : '0h 0m 0s'}
                    </p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live & Operational
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 flex items-center gap-4">
                  <span className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                    <Cpu className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">V8 Node Memory Heap</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <p className="text-base font-bold text-white">
                        {metrics ? metrics.monitoring.memoryHeapUsedMb : 0}
                      </p>
                      <p className="text-xs text-slate-500">
                        / {metrics ? metrics.monitoring.memoryHeapTotalMb : 0} MB
                      </p>
                    </div>
                    {/* Visual bar */}
                    <div className="w-32 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{ width: metrics ? `${Math.min(100, (metrics.monitoring.memoryHeapUsedMb / metrics.monitoring.memoryHeapTotalMb) * 100)}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 flex items-center gap-4">
                  <span className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Alert Metrics</p>
                    <p className="text-base font-bold text-white mt-1">
                      {metrics ? metrics.monitoring.errors : 0} Errors <span className="text-slate-600">/</span> {metrics ? metrics.monitoring.warnings : 0} Warns
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Across last {metrics ? metrics.monitoring.totalLogs : 0} requests
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid 2: Core status checklists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Deployment Health Indicators */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Production Security Matrix</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-medium">IP Rate Limiter (Active)</span>
                      </div>
                      <span className="text-slate-400">Max 150 requests/min</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-medium">Scraper Bot Protection (Active)</span>
                      </div>
                      <span className="text-slate-400">Blocks automated User-Agents</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-medium">CSRF Shield Protection (Active)</span>
                      </div>
                      <span className="text-slate-400">Requires custom validation headers</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-medium">XSS & Input Sanitization (Active)</span>
                      </div>
                      <span className="text-slate-400">Strips script, HTML, javascript: tags</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-medium">Environment Variable Integrity</span>
                      </div>
                      <span className="text-emerald-400 font-mono">SECURE</span>
                    </div>
                  </div>
                </div>

                {/* Live System Performance Statistics */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">CDN Performance Statistics</h4>
                  
                  {metrics && (
                    <div className="space-y-4">
                      {/* Caching metrics display */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-slate-400">Edge Cache Hit Rate</span>
                          <span className="text-sm font-extrabold text-emerald-400">{metrics.cache.hitRate}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-400 transition-all duration-500" 
                            style={{ width: `${metrics.cache.hitRate}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Hits: {metrics.cache.hits}</span>
                          <span>Misses: {metrics.cache.misses}</span>
                        </div>
                      </div>

                      {/* Cache Size indicator */}
                      <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                        <div>
                          <p className="text-xs text-slate-300 font-medium">CDN Dynamic Cache Store</p>
                          <p className="text-[10px] text-slate-500">Active memory keys indexed</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-white">{metrics.cache.size} keys</p>
                          <p className="text-[9px] text-slate-400 font-medium">TTL: 120s</p>
                        </div>
                      </div>

                      {/* Saved response time */}
                      <div className="p-3 bg-slate-900/50 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cache Latency:</span>
                          <span className="text-emerald-400 font-mono font-bold">~2ms - 4ms (Edge)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Gemini API Latency:</span>
                          <span className="text-amber-400 font-mono">~1,200ms - 2,800ms (Cold)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* SUB-TAB: SECURITY AUDITS */}
          {/* ======================================================= */}
          {activeSubTab === 'security' && (
            <div className="space-y-6">
              
              {/* Security Header Banner */}
              <div className="bg-gradient-to-r from-emerald-950/20 to-slate-900 border border-slate-900 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Active API & Shield Protection Shield</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Mitigating bots, malicious crawlers, CSRF state manipulation, and code block XSS payloads at the routing gateway.
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  SHIELD ACTIVE
                </span>
              </div>

              {/* Security metrics dashboard cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500">Rate Limit Drops</p>
                  <p className="text-2xl font-bold text-white mt-1">{metrics ? metrics.security.rateLimitsBlocked : 0}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Blocked IPs</p>
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500">Bot Crawlers Blocked</p>
                  <p className="text-2xl font-bold text-white mt-1">{metrics ? metrics.security.botBlocked : 0}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Python, Wget, Curl</p>
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500">XSS Sanitization Actions</p>
                  <p className="text-2xl font-bold text-white mt-1">{metrics ? metrics.security.sanitizationEvents : 0}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Input cleaned</p>
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500">CSRF Intercepts</p>
                  <p className="text-2xl font-bold text-white mt-1">{metrics ? metrics.security.csrfBlocked : 0}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Bad payloads</p>
                </div>
              </div>

              {/* Threat Matrix details */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rule Engine & Active Safeguards</h4>
                
                <div className="divide-y divide-slate-900 text-xs">
                  
                  <div className="py-3 flex flex-col md:flex-row justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-slate-200 font-bold">Rule 101: In-Memory Token Buckets</p>
                      <p className="text-slate-400 text-[11px]">Enforces rate limit thresholds dynamically. Restricts malicious IP spikes.</p>
                    </div>
                    <span className="self-start md:self-center px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono">STATUS: ENABLED</span>
                  </div>

                  <div className="py-3 flex flex-col md:flex-row justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-slate-200 font-bold">Rule 102: Scraping Scanners</p>
                      <p className="text-slate-400 text-[11px]">Detects automation footprints. Automatically returns 403 Forbidden to automated scrapers.</p>
                    </div>
                    <span className="self-start md:self-center px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono">STATUS: ENABLED</span>
                  </div>

                  <div className="py-3 flex flex-col md:flex-row justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-slate-200 font-bold">Rule 103: CSRF Payload Verification</p>
                      <p className="text-slate-400 text-[11px]">Validates AJAX requests. Cross-origin state transitions blocked without safe custom headers.</p>
                    </div>
                    <span className="self-start md:self-center px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono">STATUS: ENABLED</span>
                  </div>

                  <div className="py-3 flex flex-col md:flex-row justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-slate-200 font-bold">Rule 104: Content Sanitizer</p>
                      <p className="text-slate-400 text-[11px]">Walks request payloads. Strips script tags, HTML tags, and suspicious string structures before DB inserts.</p>
                    </div>
                    <span className="self-start md:self-center px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-mono">STATUS: ENABLED</span>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ======================================================= */}
          {/* SUB-TAB: EDGE CACHING / ISR */}
          {/* ======================================================= */}
          {activeSubTab === 'cache' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="text-emerald-400 w-4 h-4" /> Edge CDN & Caching Simulation
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Static caching of heavy computational data reduces load on API engines. Cached content is served instantly, bypassing external AI model processing times.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">Default Cache TTL:</span>
                  <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-200 rounded text-xs font-mono">
                    120 Seconds
                  </span>
                </div>
              </div>

              {/* Cache diagnostics status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500">Cache Hits</p>
                  <p className="text-3xl font-extrabold text-white mt-1">{metrics ? metrics.cache.hits : 0}</p>
                  <p className="text-[10px] text-emerald-400 mt-1">Saved ~1.5s per request</p>
                </div>

                <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500">Cache Misses</p>
                  <p className="text-3xl font-extrabold text-white mt-1">{metrics ? metrics.cache.misses : 0}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Caused cold AI query</p>
                </div>

                <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500">Current Cache Keys Size</p>
                  <p className="text-3xl font-extrabold text-white mt-1">{metrics ? metrics.cache.size : 0}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Stored in-memory</p>
                </div>
              </div>

              {/* Benefits breakdown */}
              <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dynamic Cache Strategy Benefits</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-900/50 rounded-lg space-y-1">
                    <p className="text-white font-bold">API Protection</p>
                    <p className="text-slate-400 text-[11px]">Prevents API key exhaustions from multiple rapid user searches for similar queries.</p>
                  </div>

                  <div className="p-3 bg-slate-900/50 rounded-lg space-y-1">
                    <p className="text-white font-bold">Optimized Infrastructure Cost</p>
                    <p className="text-slate-400 text-[11px]">Cuts unnecessary Gemini Token calls to minimum, extending free trial and token bandwidth.</p>
                  </div>

                  <div className="p-3 bg-slate-900/50 rounded-lg space-y-1">
                    <p className="text-white font-bold">Static Content Delivery</p>
                    <p className="text-slate-400 text-[11px]">Pre-analyzed keyword logs are delivered immediately, guaranteeing extreme responsiveness.</p>
                  </div>

                  <div className="p-3 bg-slate-900/50 rounded-lg space-y-1">
                    <p className="text-white font-bold">Stateful Cache Invalidation</p>
                    <p className="text-slate-400 text-[11px]">In-memory cache structures have stateful 120-second expirations, automatically reloading fresh results.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================= */}
          {/* SUB-TAB: LIVE LOG STREAM */}
          {/* ======================================================= */}
          {activeSubTab === 'logs' && (
            <div className="space-y-4">
              
              {/* Filter controls */}
              <div className="bg-slate-900/50 p-4 border border-slate-900 rounded-xl flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                
                {/* Text search */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logs message..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition duration-150"
                  />
                </div>

                {/* Level / Category selects */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Filters:</span>
                  
                  <select
                    value={logLevelFilter}
                    onChange={(e: any) => setLogLevelFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-850 px-2 py-1.5 rounded-lg text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="all">Levels (All)</option>
                    <option value="info">Info</option>
                    <option value="warn">Warn</option>
                    <option value="error">Error</option>
                  </select>

                  <select
                    value={logCategoryFilter}
                    onChange={(e: any) => setLogCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-850 px-2 py-1.5 rounded-lg text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="all">Categories (All)</option>
                    <option value="security">Security</option>
                    <option value="performance">Performance</option>
                    <option value="api">API</option>
                    <option value="ai">AI Model</option>
                    <option value="stripe">Stripe</option>
                    <option value="user">User Action</option>
                  </select>

                  <button
                    onClick={downloadLogsDump}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-medium transition duration-200"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Export JSON
                  </button>
                </div>

              </div>

              {/* Logs display shell */}
              <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden font-mono">
                
                {/* Header bar */}
                <div className="bg-slate-900/40 border-b border-slate-900 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Log Timestamp / Event stream</span>
                  <span>Payload Details</span>
                </div>

                {/* Log list */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-900 text-[11px] text-slate-300">
                  {logs.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 space-y-1">
                      <Terminal className="w-6 h-6 text-slate-600 mx-auto" />
                      <p>No telemetry logs match the current active filter criteria.</p>
                      <p className="text-[10px] text-slate-600 font-sans">Click "Simulate Event" above to inject test logs instantly!</p>
                    </div>
                  ) : (
                    logs.map((log) => {
                      // Status colors
                      const levelColor = 
                        log.level === 'error' ? 'text-red-400 bg-red-400/10 border-red-500/20' :
                        log.level === 'warn' ? 'text-amber-400 bg-amber-400/10 border-amber-500/20' :
                        'text-sky-400 bg-sky-400/10 border-sky-500/20';

                      const categoryColor =
                        log.category === 'security' ? 'text-rose-400 border-rose-950 bg-rose-950/20' :
                        log.category === 'performance' ? 'text-emerald-400 border-emerald-950 bg-emerald-950/20' :
                        log.category === 'ai' ? 'text-indigo-400 border-indigo-950 bg-indigo-950/20' :
                        log.category === 'stripe' ? 'text-purple-400 border-purple-950 bg-purple-950/20' :
                        'text-slate-400 border-slate-900 bg-slate-900/20';

                      return (
                        <div key={log.id} className="p-3 hover:bg-slate-900/25 transition duration-100 flex flex-col md:flex-row gap-2 justify-between">
                          
                          {/* Left: level + time + category */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <span className="text-slate-500 text-[10px]">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            
                            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${levelColor}`}>
                              {log.level.toUpperCase()}
                            </span>

                            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${categoryColor}`}>
                              {log.category.toUpperCase()}
                            </span>
                          </div>

                          {/* Center: Message */}
                          <div className="flex-1 min-w-0 md:px-2">
                            <p className="text-slate-200 break-words leading-relaxed">{log.message}</p>
                            
                            {/* Metadata visualization */}
                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                              <details className="mt-1">
                                <summary className="text-[10px] text-slate-500 cursor-pointer hover:text-slate-400 transition select-none">
                                  View system metadata payload
                                </summary>
                                <pre className="mt-1 p-2 bg-slate-900 border border-slate-850 rounded text-[10px] text-slate-400 overflow-x-auto max-w-full">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
              
              <div className="text-right text-[10px] text-slate-500">
                Displaying up to 150 latest in-memory events. Logs pruned automatically.
              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
}
