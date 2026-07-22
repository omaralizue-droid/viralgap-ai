import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { stripeRouter } from './server/stripe';
import { aiRouter } from './server/routes/ai';
import { competitorRouter } from './server/routes/competitors';
import { opportunityRouter } from './server/routes/opportunities';
import { devopsRouter } from './server/routes/devops';
import { analyticsRouter } from './server/routes/analytics';
import { referralsRouter } from './server/routes/referrals';
import { injectSEO } from './server/seo';
import {
  rateLimiterMiddleware,
  botProtectionMiddleware,
  csrfProtectionMiddleware,
  inputSanitizationMiddleware
} from './server/middleware/security';

// Load env variables
dotenv.config();

const app = express();
const PORT = 3000;

// Custom middleware to support raw requests for Stripe webhooks and JSON for other routes
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    // Parse raw request body for Stripe webhook signature verification
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// Apply DevOps Security and Protection globally
app.use(rateLimiterMiddleware);
app.use(botProtectionMiddleware);
app.use(csrfProtectionMiddleware);
app.use(inputSanitizationMiddleware);

// Global health check and workspace config status
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    config: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY || process.env.USE_MOCK_APIS === 'true',
      hasSupabaseUrl: !!process.env.SUPABASE_URL || process.env.USE_MOCK_APIS === 'true',
    }
  });
});

// Mount modular routers
app.use(stripeRouter);
app.use(aiRouter);
app.use(competitorRouter);
app.use(opportunityRouter);
app.use(devopsRouter);
app.use(analyticsRouter);
app.use(referralsRouter);

// static pages sitemap/robots
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://viralgap.ai/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://viralgap.ai/tools/youtube-idea-generator</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://viralgap.ai/tools/content-gap-finder</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://viralgap.ai/tools/viral-video-analyzer</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://viralgap.ai/tools/thumbnail-generator</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://viralgap.ai/tools/hook-generator</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://viralgap.ai/tools/script-generator</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://viralgap.ai/tools/comment-intelligence-lab</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://viralgap.ai/tools/retention-hook-simulator</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://viralgap.ai/tools/title-ab-battle-arena</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
</urlset>`);
});

app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Allow: /tools/

Sitemap: https://viralgap.ai/sitemap.xml
`);
});

// Capture page loads for dynamic injection
const handleSeoRequest = (req: any, res: any, next: any) => {
  const reqPath = req.path;
  
  // Skip during development mode to let Vite transform index.html correctly
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  // Skip API, assets, favicon or other files
  if (reqPath.startsWith('/api') || reqPath.startsWith('/assets') || reqPath.includes('.')) {
    return next();
  }

  // Load and inject index.html
  try {
    let indexHtmlPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(indexHtmlPath)) {
      indexHtmlPath = path.join(process.cwd(), 'index.html');
    }

    if (fs.existsSync(indexHtmlPath)) {
      const rawHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
      const seoHtml = injectSEO(reqPath, rawHtml);
      return res.send(seoHtml);
    }
  } catch (err) {
    console.error('Error in SEO HTML Injector:', err);
  }
  
  next();
};

app.use(handleSeoRequest);

// Vite middleware and server initialization wrapped to support ES module structures
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ViralGap AI Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
