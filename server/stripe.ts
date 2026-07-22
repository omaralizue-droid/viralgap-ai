import { Request, Response, Router } from 'express';
import Stripe from 'stripe';
import { db, Subscription, UsageTracking } from './db';
import { analyticsTracker } from './analytics';
import { referralEngine } from './referralEngine';
import { stripeService } from './services';

const router = Router();

// Lazy initialize Stripe to avoid crashing on startup if the key is missing
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe | null {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      stripeInstance = new Stripe(key, {
        apiVersion: '2023-10-16' as any, // stable API version
      });
    }
  }
  return stripeInstance;
}

const isStripeConfigured = () => !!process.env.STRIPE_SECRET_KEY;

// Plan mappings for credits
const PLAN_CREDITS: Record<string, number> = {
  free: 5,
  creator: 500,
  pro: 1500,
  agency: 5000
};

// Plan prices in USD
const PLAN_PRICES: Record<string, number> = {
  free: 0,
  creator: 19,
  pro: 49,
  agency: 99
};

// =========================================================
// API ENDPOINTS FOR SAAS BILLING
// =========================================================

// 1. Get Billing Status & Database Records
router.get('/api/billing/status', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_default_omar';
  
  try {
    const subscription = await db.getSubscription(userId);
    const usage = await db.getUsage(userId);
    const invoices = await db.getInvoices(userId);

    res.json({
      success: true,
      subscription,
      usage,
      invoices,
      config: {
        isStripeConfigured: isStripeConfigured(),
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_sim_publishable_key'
      }
    });
  } catch (err: any) {
    console.error('Error fetching billing status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Create Stripe Checkout Session
router.post('/api/stripe/create-checkout-session', async (req: Request, res: Response) => {
  const { plan, userId, email } = req.body;
  const targetPlan = (plan || 'creator').toLowerCase();
  const targetUser = userId || 'usr_default_omar';
  const targetEmail = email || 'omar263@gmail.com';

  if (!['creator', 'pro', 'agency', 'free'].includes(targetPlan)) {
    return res.status(400).json({ success: false, error: 'Invalid subscription plan' });
  }

  try {
    // If user downgrades directly to free, execute it instantly
    if (targetPlan === 'free') {
      const activeSub = await db.getSubscription(targetUser);
      
      // If Stripe subscription exists, we would ideally cancel it on Stripe as well
      const stripe = getStripe();
      if (stripe && activeSub.stripe_subscription_id && !activeSub.stripe_subscription_id.startsWith('sub_sim')) {
        try {
          await stripe.subscriptions.update(activeSub.stripe_subscription_id, {
            cancel_at_period_end: true
          });
        } catch (stripeErr) {
          console.warn('Could not cancel on Stripe directly, proceeding with local update:', stripeErr);
        }
      }

      const updatedSub: Subscription = {
        ...activeSub,
        plan_tier: 'free',
        status: 'canceled',
        current_period_end: new Date().toISOString()
      };
      await db.saveSubscription(updatedSub);
      await db.getUsage(targetUser); // sync credits limit

      // Track subscription cancellation
      try {
        const oldPlan = activeSub.plan_tier || 'creator';
        const priceMap = { free: 0, creator: 19, pro: 49, agency: 99 };
        const price = priceMap[oldPlan] || 19;
        await analyticsTracker.trackEvent(targetUser, 'subscription_canceled', 'business', price, { plan: oldPlan });
      } catch (trackErr) {
        console.error('Error tracking subscription cancel event:', trackErr);
      }
      
      return res.json({ success: true, url: '/#billing', message: 'Downgraded to free plan.' });
    }

    let priceId = '';
    if (targetPlan === 'creator') priceId = process.env.STRIPE_PRICE_CREATOR || '';
    else if (targetPlan === 'pro') priceId = process.env.STRIPE_PRICE_PRO || '';
    else if (targetPlan === 'agency') priceId = process.env.STRIPE_PRICE_AGENCY || '';

    if (stripeService.isConfigured()) {
      if (!priceId) {
        return res.status(400).json({ 
          success: false, 
          error: `Stripe Price ID is not configured for plan ${targetPlan}. Add STRIPE_PRICE_${targetPlan.toUpperCase()} in Settings > Secrets.` 
        });
      }
    }

    // Get or create customer
    const activeSub = await db.getSubscription(targetUser);
    let customerId = activeSub.stripe_customer_id;

    if (!customerId || customerId.startsWith('cus_sim')) {
      customerId = await stripeService.createCustomer(targetEmail, targetUser);
    }

    // Create checkout session
    const host = req.get('origin') || `${req.protocol}://${req.get('host')}`;
    const sessionResult = await stripeService.createCheckoutSession(
      customerId,
      targetEmail,
      targetPlan,
      priceId,
      targetUser,
      host
    );

    res.json(sessionResult);
  } catch (err: any) {
    console.error('Checkout Session creation failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Create Stripe Customer Portal Session
router.post('/api/stripe/create-portal-session', async (req: Request, res: Response) => {
  const { userId } = req.body;
  const targetUser = userId || 'usr_default_omar';

  try {
    const sub = await db.getSubscription(targetUser);
    const host = req.get('origin') || `${req.protocol}://${req.get('host')}`;
    const result = await stripeService.createPortalSession(sub.stripe_customer_id, targetUser, host);
    res.json(result);
  } catch (err: any) {
    console.error('Portal Session creation failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Use SaaS Credits Endpoint (Validates Plan Limits Automatically)
router.post('/api/billing/use-credits', async (req: Request, res: Response) => {
  const { userId, type, cost } = req.body;
  const targetUser = userId || 'usr_default_omar';
  const actionType = type as 'contentGaps' | 'urlAnalyses' | 'scripts' | 'prompts';
  const actionCost = cost || 1; // default cost

  try {
    const sub = await db.getSubscription(targetUser);
    const usage = await db.getUsage(targetUser);

    // Free Plan Limits Check
    if (sub.plan_tier === 'free') {
      // Standard limit of 5 total actions/analyses per month for free plan
      const totalActions = usage.credits_used;
      if (totalActions >= 5) {
        return res.status(403).json({
          success: false,
          error: 'Your Free Plan is limited to 5 total analyses/month. Please upgrade to the Creator Plan for unlimited searches!',
          code: 'LIMIT_EXCEEDED'
        });
      }
    } else {
      // Paid Plan Credits Check
      const remaining = usage.credits_total - usage.credits_used;
      if (remaining < actionCost) {
        return res.status(403).json({
          success: false,
          error: `Insufficient credits. This action requires ${actionCost} credits, but you only have ${remaining} remaining. Upgrade or refill your quota!`,
          code: 'LIMIT_EXCEEDED'
        });
      }
    }

    // Success! Increment database record usage
    const updatedUsage = await db.incrementUsage(targetUser, actionCost);
    res.json({
      success: true,
      usage: updatedUsage,
      remaining: updatedUsage.credits_total - updatedUsage.credits_used
    });
  } catch (err: any) {
    console.error('Error verifying usage limits:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Refill Quota Endpoint (Simulated invoice creation)
router.post('/api/billing/refill-quota', async (req: Request, res: Response) => {
  const { userId } = req.body;
  const targetUser = userId || 'usr_default_omar';

  try {
    const sub = await db.getSubscription(targetUser);
    if (sub.plan_tier === 'free') {
      return res.status(400).json({ success: false, error: 'Free tier cannot refill credits. Please upgrade to a premium plan.' });
    }

    // Reset credits_used to 0
    const usage = await db.resetUsageCredits(targetUser);

    // Add simulated refill invoice receipt
    const refillCost = PLAN_PRICES[sub.plan_tier] || 19;
    await db.addInvoice(targetUser, {
      id: `INV-REFILL-${Date.now().toString().slice(-5)}`,
      stripe_invoice_id: `in_sim_refill_${Date.now()}`,
      amount: refillCost,
      currency: 'usd',
      status: 'paid',
      card_brand: 'Visa',
      card_last4: '4210',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });

    res.json({
      success: true,
      usage,
      message: 'Creator quota refilled. A new invoice receipt has been added to your ledger.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. REAL STRIPE WEBHOOK LISTENER
// Note: We parser express.raw() at the app-level for this specific route
router.post('/api/stripe/webhook', async (req: Request, res: Response) => {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !sig || !webhookSecret) {
    return res.status(400).send('Webhook Configuration Error or Signature Missing');
  }

  let event: Stripe.Event;

  try {
    // Note: req.body MUST be the raw buffer here
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    await db.addSystemLog({
      level: 'info',
      category: 'stripe',
      message: `Stripe webhook received: ${event.type}`,
      metadata: { eventId: event.id, type: event.type }
    });
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    db.addSystemLog({
      level: 'error',
      category: 'stripe',
      message: `Webhook signature verification failed: ${err.message}`,
      metadata: { error: err.message }
    });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await handleStripeEvent(event);
    res.json({ received: true });
  } catch (err: any) {
    console.error('Error handling Stripe webhook event:', err);
    db.addSystemLog({
      level: 'error',
      category: 'stripe',
      message: `Error handling Stripe webhook: ${err.message}`,
      metadata: { error: err.message, eventType: event.type }
    });
    res.status(500).send('Webhook Handler Failure');
  }
});

// 7. DEV WEBHOOK SIMULATOR ENDPOINT (For sandboxed execution & testing)
router.post('/api/stripe/simulate-event', async (req: Request, res: Response) => {
  const { eventType, userId, plan, email, subscriptionId, customerId } = req.body;
  const targetUser = userId || 'usr_default_omar';
  const targetPlan = (plan || 'creator').toLowerCase();
  const targetEmail = email || 'omar263@gmail.com';
  const subId = subscriptionId || `sub_sim_${Date.now()}`;
  const cusId = customerId || `cus_sim_${Date.now()}`;

  db.addSystemLog({
    level: 'info',
    category: 'stripe',
    message: `Stripe simulator event requested: ${eventType}`,
    metadata: { eventType, targetPlan, targetEmail, targetUser }
  });

  try {
    // Format a mock Stripe Event schema and invoke our main handler
    let eventPayload: any = {
      id: `evt_sim_${Date.now()}`,
      type: eventType,
      created: Math.floor(Date.now() / 1000),
    };

    if (eventType === 'checkout.session.completed') {
      eventPayload.data = {
        object: {
          id: `cs_sim_${Date.now()}`,
          customer: cusId,
          subscription: subId,
          customer_email: targetEmail,
          metadata: { userId: targetUser, plan: targetPlan },
          amount_total: PLAN_PRICES[targetPlan] * 100,
          currency: 'usd'
        }
      };
    } else if (eventType === 'customer.subscription.updated') {
      eventPayload.data = {
        object: {
          id: subId,
          customer: cusId,
          status: 'active',
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000),
          metadata: { userId: targetUser, plan: targetPlan }
        }
      };
    } else if (eventType === 'customer.subscription.deleted') {
      eventPayload.data = {
        object: {
          id: subId,
          customer: cusId,
          status: 'canceled',
          metadata: { userId: targetUser }
        }
      };
    } else if (eventType === 'invoice.payment_succeeded') {
      eventPayload.data = {
        object: {
          id: `in_sim_${Date.now()}`,
          customer: cusId,
          subscription: subId,
          amount_paid: PLAN_PRICES[targetPlan] * 100,
          currency: 'usd',
          status: 'paid',
          charge: `ch_sim_${Date.now()}`
        }
      };
    } else if (eventType === 'invoice.payment_failed') {
      eventPayload.data = {
        object: {
          id: `in_sim_failed_${Date.now()}`,
          customer: cusId,
          subscription: subId,
          amount_due: PLAN_PRICES[targetPlan] * 100,
          currency: 'usd',
          status: 'open'
        }
      };
    }

    await handleStripeEvent(eventPayload);
    res.json({ success: true, message: `Simulated Stripe event '${eventType}' and updated database tables successfully!`, payload: eventPayload });
  } catch (err: any) {
    console.error('Simulation event failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================================================
// STRIPE BUSINESS LOGIC COMPOSER
// =========================================================
async function handleStripeEvent(event: any) {
  console.log(`Stripe event dispatcher received: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan || 'creator';
      const stripeSubscriptionId = session.subscription;
      const stripeCustomerId = session.customer;

      if (!userId) {
        console.error('No userId metadata found in checkout session completed event.');
        break;
      }

      // 1. Update Database subscription table
      const sub: Subscription = {
        id: `sub_${Date.now()}`,
        user_id: userId,
        status: 'active',
        plan_tier: plan,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_customer_id: stripeCustomerId,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      };
      await db.saveSubscription(sub);

      // 2. Update Database usage_tracking table
      await db.resetUsageCredits(userId);

      // 3. Add Invoice ledger record
      const planCost = PLAN_PRICES[plan] || 19;
      await db.addInvoice(userId, {
        id: `INV-${Date.now().toString().slice(-5)}`,
        stripe_invoice_id: session.id || `in_sim_${Date.now()}`,
        amount: planCost,
        currency: 'usd',
        status: 'paid',
        card_brand: 'Visa',
        card_last4: '4242',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });

      // Track referral conversion if this user was referred by someone
      try {
        await referralEngine.trackConversion(userId, plan as any, planCost);
      } catch (refErr) {
        console.error('Error tracking referral conversion on stripe success:', refErr);
      }

      // 4. Track subscription_created in analytics
      try {
        await analyticsTracker.trackEvent(userId, 'subscription_created', 'business', planCost, { plan });
      } catch (trackErr) {
        console.error('Error tracking checkout session event:', trackErr);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      const stripeSubscriptionId = invoice.subscription;
      
      if (!stripeSubscriptionId) break;

      const sub = await db.getSubscriptionByStripeId(stripeSubscriptionId);
      if (sub) {
        // Extend subscription date and activate status
        sub.status = 'active';
        sub.current_period_start = new Date().toISOString();
        sub.current_period_end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await db.saveSubscription(sub);

        // Reset usage credits for the new billing cycle period
        await db.resetUsageCredits(sub.user_id);

        // Record recurring invoice
        const price = invoice.amount_paid ? invoice.amount_paid / 100 : PLAN_PRICES[sub.plan_tier];
        await db.addInvoice(sub.user_id, {
          id: `INV-${Date.now().toString().slice(-5)}`,
          stripe_invoice_id: invoice.id,
          amount: price,
          currency: invoice.currency || 'usd',
          status: 'paid',
          card_brand: 'Visa',
          card_last4: '4242',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const stripeSubscriptionId = invoice.subscription;
      if (!stripeSubscriptionId) break;

      const sub = await db.getSubscriptionByStripeId(stripeSubscriptionId);
      if (sub) {
        // Set subscription state to past due to lock premium tools
        sub.status = 'past_due';
        await db.saveSubscription(sub);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const stripeSubscriptionId = subscription.id;
      const plan = subscription.metadata?.plan || 'creator';

      const sub = await db.getSubscriptionByStripeId(stripeSubscriptionId);
      if (sub) {
        sub.plan_tier = plan;
        sub.status = subscription.status === 'active' ? 'active' : 'trialing';
        sub.current_period_start = new Date(subscription.current_period_start * 1000).toISOString();
        sub.current_period_end = new Date(subscription.current_period_end * 1000).toISOString();
        await db.saveSubscription(sub);

        // Re-align credits limits in usage table
        await db.getUsage(sub.user_id);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const stripeSubscriptionId = subscription.id;

      const sub = await db.getSubscriptionByStripeId(stripeSubscriptionId);
      if (sub) {
        const oldPlan = sub.plan_tier || 'creator';

        // Demote user database record back to Free Tier automatically
        const demotedSub: Subscription = {
          ...sub,
          plan_tier: 'free',
          status: 'canceled',
          stripe_subscription_id: 'sub_sim_free_tier',
          current_period_end: new Date().toISOString()
        };
        await db.saveSubscription(demotedSub);

        // Re-align usage tracking counts
        await db.getUsage(sub.user_id);

        // Track subscription_canceled in analytics
        try {
          const priceMap = { free: 0, creator: 19, pro: 49, agency: 99 };
          const price = priceMap[oldPlan] || 19;
          await analyticsTracker.trackEvent(sub.user_id, 'subscription_canceled', 'business', price, { plan: oldPlan });
        } catch (trackErr) {
          console.error('Error tracking subscription cancel event:', trackErr);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled stripe webhook trigger: ${event.type}`);
  }
}

export { router as stripeRouter };
export { getStripe, isStripeConfigured };
