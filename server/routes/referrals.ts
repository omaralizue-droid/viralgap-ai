import { Router } from 'express';
import { referralEngine } from '../referralEngine';

const router = Router();

// /api/referrals/stats
router.get('/api/referrals/stats', async (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'usr_default_omar';
    const stats = await referralEngine.getUserReferralStats(userId);
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve referral statistics.' });
  }
});


// /api/referrals/leaderboard
router.get('/api/referrals/leaderboard', async (req, res) => {
  try {
    const leaderboard = await referralEngine.getLeaderboard();
    res.json({ success: true, leaderboard });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve leaderboard.' });
  }
});


// /api/referrals/click
router.post('/api/referrals/click', async (req, res) => {
  try {
    const { referrerId, userAgent, ipHash } = req.body;
    if (!referrerId) {
      return res.status(400).json({ success: false, error: 'Referrer ID is required.' });
    }
    const click = await referralEngine.trackClick(referrerId, userAgent, ipHash);
    res.json({ success: true, click });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to track referral click.' });
  }
});


// /api/referrals/signup
router.post('/api/referrals/signup', async (req, res) => {
  try {
    const { referrerId, referredUserId, referredEmail } = req.body;
    if (!referrerId || !referredUserId || !referredEmail) {
      return res.status(400).json({ success: false, error: 'Missing referrerId, referredUserId, or referredEmail.' });
    }
    const record = await referralEngine.trackSignup(referrerId, referredUserId, referredEmail);
    res.json({ success: true, record });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to track referral signup.' });
  }
});


// /api/referrals/payout-request
router.post('/api/referrals/payout-request', async (req, res) => {
  try {
    const { userId, amount, method } = req.body;
    if (!userId || !amount || !method) {
      return res.status(400).json({ success: false, error: 'Missing userId, amount, or payout method.' });
    }
    const payout = await referralEngine.requestPayout(userId, amount, method);
    res.json({ success: true, payout, message: 'Payout requested successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to submit payout request.' });
  }
});


// /api/referrals/simulate
router.post('/api/referrals/simulate', async (req, res) => {
  try {
    const { action, referrerId, email, tier, amount } = req.body;
    const targetReferrer = referrerId || 'usr_default_omar';
    
    if (action === 'click') {
      const click = await referralEngine.trackClick(
        targetReferrer,
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X)',
        `ip_sim_${Math.floor(Math.random() * 10000)}`
      );
      return res.json({ success: true, item: click, message: 'Simulated unique referral click.' });
    } 
    
    if (action === 'signup') {
      const randomId = `usr_sim_${Date.now()}`;
      const randomEmail = email || `simulated_creator_${Math.floor(Math.random() * 10000)}@gmail.com`;
      const record = await referralEngine.trackSignup(targetReferrer, randomId, randomEmail);
      return res.json({ success: true, item: record, message: 'Simulated referred user signup (Free Account).' });
    } 
    
    if (action === 'conversion') {
      // Find a registered referral for this user to convert
      const dbData = (referralEngine as any).readReferralsDb();
      const unregistered = dbData.referrals.find((r: any) => r.referrerId === targetReferrer && r.status === 'registered');
      
      let targetUserId = '';
      let targetEmail = '';
      if (!unregistered) {
        // Create one first!
        targetUserId = `usr_sim_${Date.now()}`;
        targetEmail = email || `converted_affiliate_${Math.floor(Math.random() * 10000)}@creators.net`;
        await referralEngine.trackSignup(targetReferrer, targetUserId, targetEmail);
      } else {
        targetUserId = unregistered.referredUserId;
        targetEmail = unregistered.referredEmail;
      }

      const selectedTier = tier || (Math.random() > 0.7 ? 'pro' : 'creator');
      const priceMap = { creator: 19, pro: 49, agency: 99 };
      const selectedAmount = amount || priceMap[selectedTier as 'creator'|'pro'|'agency'] || 19;

      const record = await referralEngine.trackConversion(targetUserId, selectedTier as any, selectedAmount);
      return res.json({ success: true, item: record, message: `Simulated referred user upgrading to paid ${selectedTier} plan.` });
    }

    res.status(400).json({ success: false, error: 'Invalid simulation action specified.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to simulate referral event.' });
  }
});

// =========================================================
// TECHNICAL SEO & PROGRAMMATIC LANDING PAGES
// =========================================================
import { injectSEO } from '../seo';


export { router as referralsRouter };
