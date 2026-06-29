export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  youtubeChannelUrl?: string;
  niche?: string;
  bio?: string;
  createdAt: string;
}

export interface UsageTracking {
  userId: string;
  creditsTotal: number;
  creditsUsed: number;
  contentGapsGenerated: number;
  urlsAnalyzed: number;
  scriptsGenerated: number;
  promptsGenerated: number;
  subscriptionPlan: 'Free' | 'Pro' | 'Agency';
  nextResetDate: string;
}

export interface ContentGapResult {
  id: string;
  topic: string;
  description: string;
  searchVolume: 'High' | 'Medium' | 'Low';
  competition: 'High' | 'Medium' | 'Low';
  score: number; // Opportunity score 0-100
  audiencePainPoints: string[];
  viralAngle: string;
}

export interface UrlAnalysisResult {
  title: string;
  channelName: string;
  pacingSummary: string;
  hookScore: number; // 0-100
  retentionTactics: string[];
  viralHookTeardown: string;
  improvementTips: string[];
}

export interface ScriptResult {
  id: string;
  title: string;
  targetLength: string;
  niche: string;
  sections: {
    timeframe: string;
    sectionTitle: string;
    narration: string;
    visualDirection: string;
    retentionTactic: string;
  }[];
}

export interface TrendItem {
  id: string;
  topic: string;
  category: string;
  viewVelocity: string; // views/hour
  avgViews: string;
  searchInterest: number; // 0-100
  whyItIsTrending: string;
}

export interface ThumbnailPromptResult {
  title: string;
  visualMetaphor: string;
  textOverlay: string;
  midjourneyPrompt: string;
  dallePrompt: string;
  colorPalette: string[];
  lightingStyle: string;
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


