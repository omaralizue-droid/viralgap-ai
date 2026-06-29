import fs from 'fs';
import path from 'path';

// Define DB paths
const DB_FILE = path.join(process.cwd(), 'database.json');

// Interface types matching target Postgres/Supabase schema definitions
export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete';
  plan_tier: 'free' | 'creator' | 'pro' | 'agency';
  stripe_subscription_id: string;
  stripe_customer_id: string;
  current_period_start: string;
  current_period_end: string;
  updated_at: string;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  billing_period_start: string;
  credits_total: number;
  credits_used: number;
  daily_requests_count: number;
  last_request_at: string;
}

export interface InvoiceRecord {
  id: string;
  user_id: string;
  stripe_invoice_id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'uncollectible' | 'void';
  card_brand: string;
  card_last4: string;
  date: string;
}

export interface UrlReport {
  id: string;
  userId: string;
  videoUrl: string;
  title: string;
  description: string;
  transcriptSnippet: string;
  views: string;
  likes: string;
  comments: string;
  channelData?: string;
  
  // Analyses (Existing)
  hookAnalysis?: string;
  titleAnalysis?: string;
  thumbnailAnalysis?: string;
  storyAnalysis?: string;
  retentionAnalysis?: string;
  psychologyAnalysis?: string;
  
  // Specific extracted patterns (Existing)
  retentionStrategy?: string;
  storyStructure?: string;
  ctaPattern?: string;
  audienceType?: string;
  emotionTriggers?: string[];
  curiosityGap?: string;
  hookScore?: number;

  // New Fields Requested by User
  viralScore: number; // 0-100
  
  // 9 Key Analyses
  hookStrengthAnalysis: string;
  curiosityGapAnalysis: string;
  storytellingAnalysis: string;
  pacingAnalysis: string;
  retentionTriggersAnalysis: string;
  emotionalTriggersAnalysis: string;
  socialProofAnalysis: string;
  authoritySignalsAnalysis: string;
  ctaAnalysis: string;

  // Extracted lists
  strengths: string[];
  weaknesses: string[];
  missedOpportunities: string[];

  // Multi-generations
  betterVersions: string[]; // 3 Better Versions
  betterAngles: string[]; // 5 Better Angles
  betterHooks: string[]; // 10 Better Hooks

  // Bonuses (Existing)
  betterTitles?: string[];
  betterVideoAngles?: string[];
  
  // Better Video Generator specific outputs
  originalHook?: string;
  originalStructure?: string;
  originalPsychology?: string;
  originalRetentionPatterns?: string;

  betterTitle?: string;
  betterHook?: string;
  betterStory?: string;
  betterCta?: string;
  betterThumbnailConcept?: string;

  alternativeVersionsBetter?: {
    title: string;
    hook: string;
    story: string;
    cta: string;
    thumbnailConcept: string;
    angleDescription: string;
  }[];
  
  createdAt: string;
}

export interface CompetitorReport {
  id: string;
  userId: string;
  competitorUrl: string;
  competitorName: string;
  subscriberCount: string;
  subscriberGrowth: string;
  viewGrowth: string;
  newUploads: {
    title: string;
    views: string;
    publishedAt: string;
    url: string;
  }[];
  mostSuccessfulVideos: {
    title: string;
    views: string;
    uploadDate: string;
    url: string;
    ctrEst?: string;
  }[];
  emergingTopics: string[];
  winningFormats: {
    format: string;
    whyItWorks: string;
  }[];
  winningTopics: string[];
  contentGaps: {
    topic: string;
    missedAngle: string;
    difficulty: 'Low' | 'Medium' | 'High';
  }[];
  scheduledFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'None';
  lastUpdatedAt: string;
  createdAt: string;
}

export interface OpportunityAlertConfig {
  id: string;
  userId: string;
  type: 'trend' | 'niche' | 'competitor_viral' | 'keyword';
  title: string;
  queryOrUrl: string;
  interval: 'Daily' | 'Weekly' | 'Monthly' | 'None';
  deliveryEmail: boolean;
  deliveryDashboard: boolean;
  status: 'active' | 'paused';
  lastCheckedAt: string;
  createdAt: string;
}

export interface OpportunityAlertLog {
  id: string;
  userId: string;
  configId: string;
  type: 'trend' | 'niche' | 'competitor_viral' | 'keyword';
  title: string;
  message: string;
  detailData: {
    metrics?: { label: string; value: string }[];
    insights?: string[];
    actionItems?: string[];
    potentialScore?: number;
    recommendedTitles?: string[];
  };
  emailSent: boolean;
  emailSentTo?: string;
  emailSubject?: string;
  emailBody?: string;
  read: boolean;
  createdAt: string;
}

export interface CalendarItem {
  id: string;
  day: number;
  publishingDate: string;
  title: string;
  hook: string;
  script: string;
  thumbnailIdea: string;
  status: 'Scheduled' | 'Draft' | 'Published';
}

export interface ContentCalendar {
  id: string;
  userId: string;
  niche: string;
  postingFrequency: string;
  goals: string;
  createdAt: string;
  items: CalendarItem[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  category: 'security' | 'performance' | 'api' | 'ai' | 'stripe' | 'user';
  message: string;
  metadata?: any;
}

interface DatabaseSchema {
  subscriptions: Subscription[];
  usage_tracking: UsageTracking[];
  invoices: InvoiceRecord[];
  url_reports: UrlReport[];
  competitor_reports?: CompetitorReport[];
  opportunity_configs?: OpportunityAlertConfig[];
  opportunity_logs?: OpportunityAlertLog[];
  content_calendars?: ContentCalendar[];
  system_logs?: SystemLog[];
}

// Initial default state
const initialDb: DatabaseSchema = {
  subscriptions: [],
  usage_tracking: [],
  invoices: [],
  url_reports: [],
  competitor_reports: [],
  opportunity_configs: [],
  opportunity_logs: [],
  content_calendars: [],
  system_logs: []
};

// Thread-safe-ish memory DB syncing helpers
let dbCache: DatabaseSchema | null = null;
let writePromiseChain = Promise.resolve();

async function readDb(): Promise<DatabaseSchema> {
  if (dbCache) {
    return dbCache;
  }
  try {
    if (!fs.existsSync(DB_FILE)) {
      await fs.promises.writeFile(DB_FILE, JSON.stringify(initialDb, null, 2));
      dbCache = JSON.parse(JSON.stringify(initialDb));
      return dbCache!;
    }
    const raw = await fs.promises.readFile(DB_FILE, 'utf-8');
    dbCache = JSON.parse(raw);
    return dbCache!;
  } catch (err) {
    console.error('Error reading file database, returning initial structure:', err);
    return JSON.parse(JSON.stringify(initialDb));
  }
}

async function writeDb(data: DatabaseSchema): Promise<void> {
  dbCache = data;
  writePromiseChain = writePromiseChain.then(async () => {
    try {
      await fs.promises.writeFile(DB_FILE, JSON.stringify(data));
    } catch (err) {
      console.error('Error writing file database:', err);
    }
  });
  await writePromiseChain;
}

export const db = {
  // --- SUBSCRIPTIONS ---
  async getSubscription(userId: string): Promise<Subscription> {
    const data = await readDb();
    let sub = data.subscriptions.find(s => s.user_id === userId);
    
    // Auto-create a default free subscription if none exists
    if (!sub) {
      sub = {
        id: `sub_free_${Date.now()}`,
        user_id: userId,
        status: 'active',
        plan_tier: 'free',
        stripe_subscription_id: 'sub_sim_free_tier',
        stripe_customer_id: 'cus_sim_free_tier',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        updated_at: new Date().toISOString()
      };
      data.subscriptions.push(sub);
      await writeDb(data);
    }
    return sub;
  },

  async getSubscriptionByStripeId(subId: string): Promise<Subscription | undefined> {
    const data = await readDb();
    return data.subscriptions.find(s => s.stripe_subscription_id === subId);
  },

  async getSubscriptionByCustomerId(cusId: string): Promise<Subscription | undefined> {
    const data = await readDb();
    return data.subscriptions.find(s => s.stripe_customer_id === cusId);
  },

  async saveSubscription(sub: Subscription): Promise<Subscription> {
    const data = await readDb();
    const idx = data.subscriptions.findIndex(s => s.user_id === sub.user_id);
    if (idx !== -1) {
      data.subscriptions[idx] = { ...sub, updated_at: new Date().toISOString() };
    } else {
      data.subscriptions.push({ ...sub, updated_at: new Date().toISOString() });
    }
    await writeDb(data);
    return sub;
  },

  // --- USAGE TRACKING ---
  async getUsage(userId: string): Promise<UsageTracking> {
    const data = await readDb();
    const sub = await this.getSubscription(userId);
    let usage = data.usage_tracking.find(u => u.user_id === userId);

    // Set credits total based on current subscription tier
    const creditsTotalMap = {
      free: 5, // 5 total analyses/month limit
      creator: 500,
      pro: 1500,
      agency: 5000
    };
    const expectedTotal = creditsTotalMap[sub.plan_tier] || 5;

    // Check if period expired (longer than 30 days or matches new period start)
    const now = new Date();
    let isNewPeriod = false;
    if (usage) {
      const periodStart = new Date(usage.billing_period_start);
      const elapsedDays = (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
      if (elapsedDays >= 30) {
        isNewPeriod = true;
      }
    }

    if (!usage || isNewPeriod) {
      const newUsage: UsageTracking = {
        id: usage?.id || `usage_${Date.now()}`,
        user_id: userId,
        billing_period_start: isNewPeriod ? now.toISOString() : (usage?.billing_period_start || now.toISOString()),
        credits_total: expectedTotal,
        credits_used: 0,
        daily_requests_count: 0,
        last_request_at: now.toISOString()
      };
      
      const currentUsageId = usage?.id;
      if (currentUsageId) {
        const idx = data.usage_tracking.findIndex(u => u.id === currentUsageId);
        data.usage_tracking[idx] = newUsage;
      } else {
        data.usage_tracking.push(newUsage);
      }
      await writeDb(data);
      usage = newUsage;
    } else {
      // Sync total credits count dynamically if the plan changed
      if (usage.credits_total !== expectedTotal) {
        usage.credits_total = expectedTotal;
        await writeDb(data);
      }
    }
    return usage;
  },

  async saveUsage(usage: UsageTracking): Promise<UsageTracking> {
    const data = await readDb();
    const idx = data.usage_tracking.findIndex(u => u.id === usage.id);
    if (idx !== -1) {
      data.usage_tracking[idx] = usage;
    } else {
      data.usage_tracking.push(usage);
    }
    await writeDb(data);
    return usage;
  },

  async incrementUsage(userId: string, amount: number): Promise<UsageTracking> {
    const data = await readDb();
    const usage = await this.getUsage(userId);
    const matched = data.usage_tracking.find(u => u.id === usage.id);
    if (matched) {
      matched.credits_used += amount;
      matched.daily_requests_count += 1;
      matched.last_request_at = new Date().toISOString();
      await writeDb(data);
      return matched;
    }
    return usage;
  },

  async resetUsageCredits(userId: string): Promise<UsageTracking> {
    const data = await readDb();
    const usage = await this.getUsage(userId);
    const matched = data.usage_tracking.find(u => u.id === usage.id);
    if (matched) {
      matched.credits_used = 0;
      matched.daily_requests_count = 0;
      matched.billing_period_start = new Date().toISOString();
      await writeDb(data);
      return matched;
    }
    return usage;
  },

  // --- INVOICES ---
  async getInvoices(userId: string): Promise<InvoiceRecord[]> {
    const data = await readDb();
    return data.invoices.filter(i => i.user_id === userId).sort((a, b) => b.date.localeCompare(a.date));
  },

  async addInvoice(userId: string, invoice: Omit<InvoiceRecord, 'user_id'>): Promise<InvoiceRecord> {
    const data = await readDb();
    const record: InvoiceRecord = {
      ...invoice,
      user_id: userId
    };
    data.invoices.push(record);
    await writeDb(data);
    return record;
  },

  // --- URL REPORTS ---
  async getUrlReports(userId: string): Promise<UrlReport[]> {
    const data = await readDb();
    if (!data.url_reports) {
      data.url_reports = [];
    }
    return data.url_reports.filter(r => r.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async saveUrlReport(userId: string, report: Omit<UrlReport, 'userId'>): Promise<UrlReport> {
    const data = await readDb();
    if (!data.url_reports) {
      data.url_reports = [];
    }
    const fullReport: UrlReport = {
      ...report,
      userId
    };
    
    const idx = data.url_reports.findIndex(r => r.id === report.id);
    if (idx !== -1) {
      data.url_reports[idx] = fullReport;
    } else {
      data.url_reports.push(fullReport);
    }
    await writeDb(data);
    return fullReport;
  },

  // --- COMPETITOR REPORTS ---
  async getCompetitorReports(userId: string): Promise<CompetitorReport[]> {
    const data = await readDb();
    if (!data.competitor_reports) {
      data.competitor_reports = [];
    }
    return data.competitor_reports.filter(r => r.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async saveCompetitorReport(userId: string, report: Omit<CompetitorReport, 'userId'>): Promise<CompetitorReport> {
    const data = await readDb();
    if (!data.competitor_reports) {
      data.competitor_reports = [];
    }
    const fullReport: CompetitorReport = {
      ...report,
      userId
    };

    const idx = data.competitor_reports.findIndex(r => r.id === report.id);
    if (idx !== -1) {
      data.competitor_reports[idx] = fullReport;
    } else {
      data.competitor_reports.push(fullReport);
    }
    await writeDb(data);
    return fullReport;
  },

  async deleteCompetitorReport(userId: string, reportId: string): Promise<boolean> {
    const data = await readDb();
    if (!data.competitor_reports) {
      data.competitor_reports = [];
      return false;
    }
    const initialLen = data.competitor_reports.length;
    data.competitor_reports = data.competitor_reports.filter(r => !(r.userId === userId && r.id === reportId));
    await writeDb(data);
    return data.competitor_reports.length < initialLen;
  },

  // --- OPPORTUNITY ALERTS CONFIGS ---
  async getOpportunityConfigs(userId: string): Promise<OpportunityAlertConfig[]> {
    const data = await readDb();
    if (!data.opportunity_configs) {
      data.opportunity_configs = [];
    }
    return data.opportunity_configs.filter(c => c.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async saveOpportunityConfig(userId: string, config: OpportunityAlertConfig): Promise<OpportunityAlertConfig> {
    const data = await readDb();
    if (!data.opportunity_configs) {
      data.opportunity_configs = [];
    }
    const fullConfig: OpportunityAlertConfig = {
      ...config,
      userId
    };
    const idx = data.opportunity_configs.findIndex(c => c.id === config.id);
    if (idx !== -1) {
      data.opportunity_configs[idx] = fullConfig;
    } else {
      data.opportunity_configs.push(fullConfig);
    }
    await writeDb(data);
    return fullConfig;
  },

  async deleteOpportunityConfig(userId: string, configId: string): Promise<boolean> {
    const data = await readDb();
    if (!data.opportunity_configs) {
      data.opportunity_configs = [];
      return false;
    }
    const initialLen = data.opportunity_configs.length;
    data.opportunity_configs = data.opportunity_configs.filter(c => !(c.userId === userId && c.id === configId));
    await writeDb(data);
    return data.opportunity_configs.length < initialLen;
  },

  // --- OPPORTUNITY ALERTS LOGS ---
  async getOpportunityLogs(userId: string): Promise<OpportunityAlertLog[]> {
    const data = await readDb();
    if (!data.opportunity_logs) {
      data.opportunity_logs = [];
    }
    return data.opportunity_logs.filter(l => l.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async addOpportunityLog(userId: string, log: OpportunityAlertLog): Promise<OpportunityAlertLog> {
    const data = await readDb();
    if (!data.opportunity_logs) {
      data.opportunity_logs = [];
    }
    const fullLog: OpportunityAlertLog = {
      ...log,
      userId
    };
    data.opportunity_logs.push(fullLog);
    await writeDb(data);
    return fullLog;
  },

  async markOpportunityLogsAsRead(userId: string): Promise<boolean> {
    const data = await readDb();
    if (!data.opportunity_logs) {
      data.opportunity_logs = [];
      return false;
    }
    let updated = false;
    data.opportunity_logs.forEach(l => {
      if (l.userId === userId && !l.read) {
        l.read = true;
        updated = true;
      }
    });
    if (updated) {
      await writeDb(data);
    }
    return updated;
  },

  async clearOpportunityLogs(userId: string): Promise<boolean> {
    const data = await readDb();
    if (!data.opportunity_logs) {
      data.opportunity_logs = [];
      return false;
    }
    const initialLen = data.opportunity_logs.length;
    data.opportunity_logs = data.opportunity_logs.filter(l => l.userId !== userId);
    await writeDb(data);
    return data.opportunity_logs.length < initialLen;
  },

  // --- CONTENT CALENDARS ---
  async getContentCalendars(userId: string): Promise<ContentCalendar[]> {
    const data = await readDb();
    if (!data.content_calendars) {
      data.content_calendars = [];
    }
    return data.content_calendars.filter(c => c.userId === userId);
  },

  async getContentCalendar(id: string): Promise<ContentCalendar | undefined> {
    const data = await readDb();
    if (!data.content_calendars) {
      data.content_calendars = [];
    }
    return data.content_calendars.find(c => c.id === id);
  },

  async saveContentCalendar(calendar: ContentCalendar): Promise<ContentCalendar> {
    const data = await readDb();
    if (!data.content_calendars) {
      data.content_calendars = [];
    }
    const idx = data.content_calendars.findIndex(c => c.id === calendar.id);
    if (idx !== -1) {
      data.content_calendars[idx] = calendar;
    } else {
      data.content_calendars.push(calendar);
    }
    await writeDb(data);
    return calendar;
  },

  async deleteContentCalendar(id: string, userId: string): Promise<boolean> {
    const data = await readDb();
    if (!data.content_calendars) {
      data.content_calendars = [];
      return false;
    }
    const lenBefore = data.content_calendars.length;
    data.content_calendars = data.content_calendars.filter(c => !(c.id === id && c.userId === userId));
    await writeDb(data);
    return data.content_calendars.length < lenBefore;
  },

  async updateCalendarItemStatus(calendarId: string, itemId: string, status: 'Scheduled' | 'Draft' | 'Published'): Promise<boolean> {
    const data = await readDb();
    if (!data.content_calendars) {
      data.content_calendars = [];
      return false;
    }
    const calendar = data.content_calendars.find(c => c.id === calendarId);
    if (!calendar) return false;
    const item = calendar.items.find(i => i.id === itemId);
    if (!item) return false;
    item.status = status;
    await writeDb(data);
    return true;
  },

  // --- SYSTEM LOGS ---
  async getSystemLogs(limit = 200): Promise<SystemLog[]> {
    const data = await readDb();
    if (!data.system_logs) {
      data.system_logs = [];
    }
    // Return sorted by date descending (newest first)
    return [...data.system_logs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },

  async addSystemLog(log: Omit<SystemLog, 'id' | 'timestamp'>): Promise<SystemLog> {
    const data = await readDb();
    if (!data.system_logs) {
      data.system_logs = [];
    }
    const newLog: SystemLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    data.system_logs.push(newLog);
    // Keep max 1000 logs
    if (data.system_logs.length > 1000) {
      data.system_logs = data.system_logs.slice(-1000);
    }
    await writeDb(data);
    return newLog;
  },

  async clearSystemLogs(): Promise<boolean> {
    const data = await readDb();
    data.system_logs = [];
    await writeDb(data);
    return true;
  },

  async clearAllData(): Promise<void> {
    await writeDb(JSON.parse(JSON.stringify(initialDb)));
  }
};
