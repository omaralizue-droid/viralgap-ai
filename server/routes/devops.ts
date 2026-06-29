import { Router } from 'express';
import { db } from '../db';
import { securityTelemetry } from '../middleware/security';
import { cacheTelemetry } from '../utils/aiHelper';

const router = Router();

// /api/devops/logs
router.get('/api/devops/logs', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 200;
    const category = req.query.category as string;
    const level = req.query.level as string;
    const search = req.query.search as string;

    let logs = await db.getSystemLogs(limit);

    if (category && category !== 'all') {
      logs = logs.filter(l => l.category === category);
    }
    if (level && level !== 'all') {
      logs = logs.filter(l => l.level === level);
    }
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l => l.message.toLowerCase().includes(q) || (l.metadata && JSON.stringify(l.metadata).toLowerCase().includes(q)));
    }

    res.json({ logs });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve system logs.' });
  }
});


// /api/devops/metrics
router.get('/api/devops/metrics', async (req, res) => {
  try {
    const totalLogs = (await db.getSystemLogs(1000)).length;
    const logs = await db.getSystemLogs(1000);
    const errorsCount = logs.filter(l => l.level === 'error').length;
    const warningsCount = logs.filter(l => l.level === 'warn').length;
    
    res.json({
      success: true,
      metrics: {
        cacheHits: cacheTelemetry.totalCacheHits,
        cacheMisses: cacheTelemetry.totalCacheMisses,
        requestsBlocked: securityTelemetry.totalRequestsBlocked,
        sanitizationEvents: securityTelemetry.totalSanitizationEvents,
        rateLimitHits: securityTelemetry.totalRateLimitHits,
        activeCacheSize: 0,
        systemLogsCount: totalLogs,
        errorLogsCount: errorsCount,
        warningLogsCount: warningsCount,
        serverUptimeSeconds: Math.round(process.uptime()),
        memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// /api/devops/logs/clear
router.post('/api/devops/logs/clear', async (req, res) => {
  try {
    await db.clearSystemLogs();
    securityTelemetry.totalRequestsBlocked = 0;
    securityTelemetry.totalSanitizationEvents = 0;
    securityTelemetry.totalRateLimitHits = 0;
    cacheTelemetry.totalCacheHits = 0;
    cacheTelemetry.totalCacheMisses = 0;
    res.json({ success: true, message: 'System logs and edge telemetry cleared.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// /api/devops/logs/add
router.post('/api/devops/logs/add', async (req, res) => {
  try {
    const { level, category, message, metadata } = req.body;
    if (!level || !category || !message) {
      return res.status(400).json({ error: 'Missing log parameters (level, category, message)' });
    }
    const log = await db.addSystemLog({ level, category, message, metadata });
    res.json({ success: true, log });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create system log.' });
  }
});


// /api/devops/logs/test
router.post('/api/devops/logs/test', async (req, res) => {
  try {
    const types = [
      { level: 'warn', category: 'security', message: 'Blocked bot crawler simulating automated scraper agent (Python-requests)' },
      { level: 'error', category: 'api', message: 'Failed to process YouTube metadata: Token expired for user account usr_test_01' },
      { level: 'info', category: 'ai', message: 'Gemini-2.5-Flash generated Viral Predictive Report successfully in 1240ms.' },
      { level: 'info', category: 'stripe', message: 'Stripe webhook received: payment_intent.succeeded for invoice inv_sim_1002' },
      { level: 'info', category: 'performance', message: 'ISR / Cache refreshed for Trend Radar categories in 4ms.' }
    ];

    const randomLog = types[Math.floor(Math.random() * types.length)];
    const log = await db.addSystemLog({
      level: randomLog.level as any,
      category: randomLog.category as any,
      message: randomLog.message,
      metadata: { simulated: true, timestamp: new Date().toISOString() }
    });

    res.json({ success: true, log });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate test logs.' });
  }
});

// =========================================================
// FOUNDER & PRODUCT ANALYTICS API
// =========================================================


export { router as devopsRouter };
