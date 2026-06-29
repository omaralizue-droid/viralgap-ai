import fs from 'fs';
import path from 'path';
import { db } from './db';

const REFERRALS_FILE = path.join(process.cwd(), 'database_referrals.json');

export interface ReferralClick {
  id: string;
  referrerId: string;
  userAgent?: string;
  ipHash?: string;
  timestamp: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredEmail: string;
  timestamp: string;
  status: 'registered' | 'converted';
  planTier: 'free' | 'creator' | 'pro' | 'agency';
  creditsAwarded: number;
  revenueGenerated: number;
  commissionAccrued: number;
}

export interface PayoutRecord {
  id: string;
  userId: string;
  payoutMethod: string;
  amount: number;
  status: 'paid' | 'approved' | 'pending';
  date: string;
}

interface ReferralsDatabaseSchema {
  clicks: ReferralClick[];
  referrals: ReferralRecord[];
  payouts: PayoutRecord[];
}

const initialReferralsDb: ReferralsDatabaseSchema = {
  clicks: [],
  referrals: [],
  payouts: []
};

// Seed helper for mock data if db is empty
function seedMockData(schema: ReferralsDatabaseSchema): ReferralsDatabaseSchema {
  const omarId = 'usr_default_omar';
  
  // Seed clicks
  if (schema.clicks.length === 0) {
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const count = Math.floor(Math.random() * 5) + 2; // 2 to 6 clicks daily
      for (let j = 0; j < count; j++) {
        schema.clicks.push({
          id: `clk_${d.getTime()}_${j}`,
          referrerId: omarId,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          ipHash: `ip_${Math.floor(Math.random() * 1000)}`,
          timestamp: d.toISOString()
        });
      }
    }
  }

  // Seed referrals (registrations)
  if (schema.referrals.length === 0) {
    const now = new Date();
    const mockEmails = [
      { email: 'alex.creator@youtube.com', status: 'converted', tier: 'pro', revenue: 147, commission: 44.1, daysAgo: 22 },
      { email: 'sarah.vlogs@tiktok.com', status: 'converted', tier: 'creator', revenue: 57, commission: 17.1, daysAgo: 15 },
      { email: 'tech_channel_reviews@gmail.com', status: 'registered', tier: 'free', revenue: 0, commission: 0, daysAgo: 8 },
      { email: 'lofi_vibes_music@creators.net', status: 'converted', tier: 'agency', revenue: 99, commission: 29.7, daysAgo: 3 },
      { email: 'travel_with_mimi@outlook.com', status: 'registered', tier: 'free', revenue: 0, commission: 0, daysAgo: 1 }
    ];

    mockEmails.forEach((item, idx) => {
      const d = new Date(now.getTime() - item.daysAgo * 24 * 60 * 60 * 1000);
      schema.referrals.push({
        id: `ref_${d.getTime()}_${idx}`,
        referrerId: omarId,
        referredUserId: `usr_referred_${idx}`,
        referredEmail: item.email,
        timestamp: d.toISOString(),
        status: item.status as any,
        planTier: item.tier as any,
        creditsAwarded: 10,
        revenueGenerated: item.revenue,
        commissionAccrued: item.commission
      });
    });
  }

  // Seed payouts
  if (schema.payouts.length === 0) {
    const now = new Date();
    schema.payouts.push({
      id: 'pay_TX8942041',
      userId: omarId,
      payoutMethod: 'PayPal',
      amount: 45.00,
      status: 'paid',
      date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    });
  }

  return schema;
}

let referralsCache: ReferralsDatabaseSchema | null = null;
let writePromiseChain = Promise.resolve();

export const referralEngine = {
  async readReferralsDb(): Promise<ReferralsDatabaseSchema> {
    if (referralsCache) {
      return referralsCache;
    }
    try {
      if (!fs.existsSync(REFERRALS_FILE)) {
        const seeded = seedMockData({ ...initialReferralsDb });
        await fs.promises.writeFile(REFERRALS_FILE, JSON.stringify(seeded, null, 2));
        referralsCache = seeded;
        return seeded;
      }
      const raw = await fs.promises.readFile(REFERRALS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      
      // Safety checks in case schema is loaded empty
      if (!data.clicks) data.clicks = [];
      if (!data.referrals) data.referrals = [];
      if (!data.payouts) data.payouts = [];
      
      referralsCache = data;
      return data;
    } catch (err) {
      console.error('Error reading referrals database, returning default state:', err);
      return JSON.parse(JSON.stringify(initialReferralsDb));
    }
  },

  async writeReferralsDb(data: ReferralsDatabaseSchema): Promise<void> {
    referralsCache = data;
    writePromiseChain = writePromiseChain.then(async () => {
      try {
        await fs.promises.writeFile(REFERRALS_FILE, JSON.stringify(data, null, 2));
      } catch (err) {
        console.error('Error writing referrals database:', err);
      }
    });
    await writePromiseChain;
  },

  async trackClick(referrerId: string, userAgent?: string, ipHash?: string): Promise<ReferralClick> {
    const dbData = await this.readReferralsDb();
    
    const click: ReferralClick = {
      id: `clk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      referrerId,
      userAgent,
      ipHash,
      timestamp: new Date().toISOString()
    };
    
    dbData.clicks.push(click);
    await this.writeReferralsDb(dbData);
    return click;
  },

  async trackSignup(referrerId: string, referredUserId: string, referredEmail: string): Promise<ReferralRecord> {
    const dbData = await this.readReferralsDb();
    
    // Check if user already exists
    const existing = dbData.referrals.find(r => r.referredUserId === referredUserId || r.referredEmail === referredEmail);
    if (existing) return existing;

    const record: ReferralRecord = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      referrerId,
      referredUserId,
      referredEmail,
      timestamp: new Date().toISOString(),
      status: 'registered',
      planTier: 'free',
      creditsAwarded: 10,
      revenueGenerated: 0,
      commissionAccrued: 0
    };

    dbData.referrals.push(record);
    await this.writeReferralsDb(dbData);

    // Give the referrer 10 extra credits in usage tracking using async DB methods
    try {
      const usage = await db.getUsage(referrerId);
      usage.credits_total += 10;
      await db.saveUsage(usage);

      const sub = await db.getSubscription(referrerId);
      await db.saveSubscription({
        ...sub,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error adding credits to referrer:', err);
    }

    return record;
  },

  async trackConversion(referredUserId: string, plan: 'free' | 'creator' | 'pro' | 'agency', amount: number): Promise<ReferralRecord | null> {
    const dbData = await this.readReferralsDb();
    
    const record = dbData.referrals.find(r => r.referredUserId === referredUserId);
    if (!record) return null;

    record.status = 'converted';
    record.planTier = plan;
    record.revenueGenerated += amount;
    
    // 30% commission calculation
    const currentCommission = amount * 0.30;
    record.commissionAccrued += currentCommission;

    await this.writeReferralsDb(dbData);
    return record;
  },

  async requestPayout(userId: string, amount: number, method: string): Promise<PayoutRecord> {
    const dbData = await this.readReferralsDb();
    
    const payout: PayoutRecord = {
      id: `pay_TX${Math.floor(1000000 + Math.random() * 9000000)}`,
      userId,
      payoutMethod: method,
      amount,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    dbData.payouts.push(payout);
    await this.writeReferralsDb(dbData);
    return payout;
  },

  async getUserReferralStats(userId: string) {
    const dbData = await this.readReferralsDb();
    
    // Filter clicks and referrals for this specific user
    const userClicks = dbData.clicks.filter(c => c.referrerId === userId);
    const userReferrals = dbData.referrals.filter(r => r.referrerId === userId);
    const userPayouts = dbData.payouts.filter(p => p.userId === userId);

    // Totals
    const clicksCount = userClicks.length;
    const signupsCount = userReferrals.length;
    const conversionRate = clicksCount > 0 ? Math.round((signupsCount / clicksCount) * 100) : 0;

    let totalCommissionAccrued = 0;
    userReferrals.forEach(r => {
      totalCommissionAccrued += r.commissionAccrued;
    });

    // Payouts paid or approved
    let totalPaid = 0;
    userPayouts.forEach(p => {
      if (p.status === 'paid' || p.status === 'approved') {
        totalPaid += p.amount;
      }
    });

    const unpaidCommission = Math.max(0, totalCommissionAccrued - totalPaid);

    // Create 30 days timeline chart data
    const timelineMap: { [date: string]: { clicks: number; signups: number } } = {};
    const now = new Date();
    
    // Initialize past 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      timelineMap[dateString] = { clicks: 0, signups: 0 };
    }

    // Populate clicks
    userClicks.forEach(c => {
      const d = new Date(c.timestamp);
      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (timelineMap[dateString]) {
        timelineMap[dateString].clicks++;
      }
    });

    // Populate signups
    userReferrals.forEach(r => {
      const d = new Date(r.timestamp);
      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (timelineMap[dateString]) {
        timelineMap[dateString].signups++;
      }
    });

    const timeline = Object.keys(timelineMap).map(date => ({
      date,
      clicks: timelineMap[date].clicks,
      signups: timelineMap[date].signups
    }));

    return {
      clicks: clicksCount,
      signups: signupsCount,
      conversionRate,
      totalCommissionAccrued,
      unpaidCommission,
      referralsList: userReferrals,
      payouts: userPayouts,
      timeline
    };
  },

  async getLeaderboard() {
    const dbData = await this.readReferralsDb();
    
    // Top users by commissions accrued
    const omarStats = await this.getUserReferralStats('usr_default_omar');
    
    // Construct mock leaderboard including Omar as user and other standard creators
    return [
      { referrerId: 'usr_default_omar', name: 'Omar (You)', signups: omarStats.signups, commission: omarStats.totalCommissionAccrued },
      { referrerId: 'usr_leader_mrbeast', name: 'Jimmy Donaldson', signups: 154, commission: 2341.20 },
      { referrerId: 'usr_leader_ali', name: 'Ali Abdaal', signups: 92, commission: 1410.50 },
      { referrerId: 'usr_leader_casey', name: 'Casey Neistat', signups: 65, commission: 980.00 },
      { referrerId: 'usr_leader_mkbhd', name: 'Marques Brownlee', signups: 42, commission: 630.00 }
    ].sort((a, b) => b.commission - a.commission);
  }
};
