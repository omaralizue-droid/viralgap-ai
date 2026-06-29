import { Request, Response, NextFunction } from 'express';
import { db } from '../db';

// DevOps telemetry counters
export const securityTelemetry = {
  totalRequestsBlocked: 0,
  totalSanitizationEvents: 0,
  totalRateLimitHits: 0
};

// Rate limiting map
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const ipRequestRecords = new Map<string, RateLimitRecord>();

// Clean rate limit records map every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestRecords.entries()) {
    if (now > record.resetTime) {
      ipRequestRecords.delete(ip);
    }
  }
}, 600000); // 10 minutes

// 1. Rate Limiting Middleware
export async function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  // Exclude static asset and web-socket bundles
  if (req.path.startsWith('/src') || req.path.startsWith('/@') || req.path.includes('.') || req.path.includes('hot-update')) {
    return next();
  }

  const ip = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown_ip';
  const now = Date.now();
  const limit = 150; // max requests per minute per IP
  const windowMs = 60000;

  let record = ipRequestRecords.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    ipRequestRecords.set(ip, record);
  } else {
    record.count++;
  }

  if (record.count > limit) {
    securityTelemetry.totalRateLimitHits++;
    try {
      await db.addSystemLog({
        level: 'warn',
        category: 'security',
        message: `Rate limit exceeded for IP ${ip} on path: ${req.path}`,
        metadata: { ip, path: req.path, count: record.count }
      });
    } catch (err) {
      console.error('Error logging rate limit hit:', err);
    }
    return res.status(429).json({
      error: 'Too many requests. Please slow down and try again later.',
      retryAfter: Math.round((record.resetTime - now) / 1000)
    });
  }
  next();
}

// 2. Bot Protection Middleware
export async function botProtectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'] || '';
  const lowercaseUA = userAgent.toLowerCase();

  const botKeywords = [
    'curl', 'python', 'wget', 'httpclient', 'scrapy', 'headless', 'selenium', 'puppeteer',
    'spider', 'crawler', 'shodan', 'censys'
  ];

  const matched = botKeywords.find(keyword => lowercaseUA.includes(keyword));
  if (matched && !lowercaseUA.includes('googlebot') && !lowercaseUA.includes('bingbot')) {
    securityTelemetry.totalRequestsBlocked++;
    try {
      await db.addSystemLog({
        level: 'warn',
        category: 'security',
        message: `Blocked suspicious automated agent: "${userAgent}" requesting ${req.path}`,
        metadata: { userAgent, path: req.path, matched }
      });
    } catch (err) {
      console.error('Error logging bot block:', err);
    }
    return res.status(403).json({
      error: 'Access denied. Automated requests are restricted on this environment.'
    });
  }

  // Honeypot field protection logic
  if (req.body && (req.body.honeypot_email || req.body.website_url_fake)) {
    securityTelemetry.totalRequestsBlocked++;
    try {
      await db.addSystemLog({
        level: 'warn',
        category: 'security',
        message: `Honeypot form input triggered! Blocked potential malicious bot.`,
        metadata: { body: req.body, path: req.path }
      });
    } catch (err) {
      console.error('Error logging honeypot block:', err);
    }
    return res.status(400).json({ error: 'Suspicious request activity detected.' });
  }

  next();
}

// 3. CSRF Protection Middleware
export function csrfProtectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const secureMethods = ['POST', 'PUT', 'DELETE'];
  if (!secureMethods.includes(req.method)) {
    return next();
  }

  const customSecHeader = req.headers['x-requested-with'] || req.headers['content-type'] || '';
  const origin = req.headers.origin || req.headers.referer || '';

  // Exclude local sandbox, Stripe webhooks and specific paths
  if (req.originalUrl === '/api/stripe/webhook') {
    return next();
  }

  if (!customSecHeader) {
    securityTelemetry.totalRequestsBlocked++;
    try {
      db.addSystemLog({
        level: 'warn',
        category: 'security',
        message: `Potential CSRF detected! Missing validation header for ${req.method} ${req.path}`,
        metadata: { method: req.method, path: req.path, origin }
      });
    } catch (err) {
      console.error('Error logging CSRF warning:', err);
    }
    return res.status(403).json({ error: 'CSRF token or requested action validation failed.' });
  }

  next();
}

// 4. XSS & Input Sanitization Middleware
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    let cleaned = value;
    // Strip script blocks
    cleaned = cleaned.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
    // Strip standard HTML tags
    cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');
    // Strip javascript: uris
    cleaned = cleaned.replace(/javascript:/gi, '');
    
    if (cleaned !== value) {
      securityTelemetry.totalSanitizationEvents++;
      try {
        db.addSystemLog({
          level: 'info',
          category: 'security',
          message: 'Sanitized dynamic input to prevent potential XSS injection.',
          metadata: { original: value, cleaned }
        });
      } catch (err) {
        console.error('Error logging sanitization event:', err);
      }
    }
    return cleaned;
  } else if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  } else if (value !== null && typeof value === 'object') {
    const sanitizedObj: any = {};
    for (const key of Object.keys(value)) {
      sanitizedObj[key] = sanitizeValue(value[key]);
    }
    return sanitizedObj;
  }
  return value;
}

export function inputSanitizationMiddleware(req: Request, res: Response, next: NextFunction) {
  // Exclude raw payload Stripe webhooks
  if (req.originalUrl === '/api/stripe/webhook') {
    return next();
  }

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  next();
}
