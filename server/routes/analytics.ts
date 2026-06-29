import { Router } from 'express';
import { db } from '../db';
import { analyticsTracker } from '../analytics';

const router = Router();

// /api/analytics/dashboard
router.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const metrics = await analyticsTracker.generateNewMetrics();
    res.json({ success: true, metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve analytics metrics.' });
  }
});


// /api/analytics/track
router.post('/api/analytics/track', async (req, res) => {
  try {
    const { userId, eventName, category, value, metadata } = req.body;
    if (!eventName || !category) {
      return res.status(400).json({ success: false, error: 'Event name and category are required.' });
    }
    const event = await analyticsTracker.trackEvent(userId, eventName, category, value, metadata);
    res.json({ success: true, event });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to track event.' });
  }
});


// /api/analytics/simulate-event
router.post('/api/analytics/simulate-event', async (req, res) => {
  try {
    const { eventType, value, plan } = req.body;
    const mockUserIds = ['usr_mock_alex', 'usr_mock_sarah', 'usr_mock_john', 'usr_mock_elena', 'usr_mock_michael'];
    const randomUser = mockUserIds[Math.floor(Math.random() * mockUserIds.length)];
    
    let event;
    if (eventType === 'signup') {
      event = await analyticsTracker.trackEvent(randomUser, 'signup', 'user', undefined, { source: Math.random() > 0.5 ? 'organic' : 'referral' });
    } else if (eventType === 'login') {
      event = await analyticsTracker.trackEvent(randomUser, 'login', 'user');
    } else if (eventType === 'subscription_created') {
      const selectedPlan = plan || 'creator';
      const priceMap: Record<string, number> = { creator: 19, pro: 49, agency: 99 };
      const selectedPrice = value || priceMap[selectedPlan] || 19;
      event = await analyticsTracker.trackEvent(randomUser, 'subscription_created', 'business', selectedPrice, { plan: selectedPlan });
    } else if (eventType === 'subscription_canceled') {
      const selectedPlan = plan || 'creator';
      const priceMap: Record<string, number> = { creator: 19, pro: 49, agency: 99 };
      const selectedPrice = value || priceMap[selectedPlan] || 19;
      event = await analyticsTracker.trackEvent(randomUser, 'subscription_canceled', 'business', selectedPrice, { plan: selectedPlan });
    } else if (eventType === 'url_analyzed') {
      event = await analyticsTracker.trackEvent(randomUser, 'url_analyzed', 'product', undefined, { videoUrl: 'https://youtube.com/watch?v=mock', title: 'Viral AI Tech Hacks' });
    } else if (eventType === 'script_generated') {
      event = await analyticsTracker.trackEvent(randomUser, 'script_generated', 'product', undefined, { topic: 'Coding in 2026' });
    } else if (eventType === 'prompt_generated') {
      event = await analyticsTracker.trackEvent(randomUser, 'prompt_generated', 'product', undefined, { type: 'thumbnail' });
    } else if (eventType === 'content_gap_searched') {
      event = await analyticsTracker.trackEvent(randomUser, 'content_gap_searched', 'product', undefined, { niche: 'SaaS Builder' });
    } else {
      return res.status(400).json({ success: false, error: 'Unsupported simulation event type.' });
    }
    
    res.json({ success: true, event, message: `Successfully simulated ${eventType} event.` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to simulate event.' });
  }
});


// /api/analytics/clear
router.post('/api/analytics/clear', async (req, res) => {
  try {
    await analyticsTracker.clearEvents();
    res.json({ success: true, message: 'Analytics database cleared.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to clear analytics.' });
  }
});

// =========================================================
// REFERRAL & AFFILIATE MANAGEMENT SYSTEM API
// =========================================================


export { router as analyticsRouter };
