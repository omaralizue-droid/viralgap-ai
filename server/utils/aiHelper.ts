import { geminiService } from '../services';

// Telemetry counters
export const cacheTelemetry = {
  totalCacheHits: 0,
  totalCacheMisses: 0
};

// Dynamic Cache Helper
interface CacheEntry {
  data: any;
  expiresAt: number;
}
const cacheStore = new Map<string, CacheEntry>();

// Clear expired cache entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cacheStore.entries()) {
    if (now > entry.expiresAt) {
      cacheStore.delete(key);
    }
  }
}, 300000); // 5 minutes

export function getCachedData(key: string): any | null {
  const entry = cacheStore.get(key);
  if (!entry) {
    cacheTelemetry.totalCacheMisses++;
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    cacheTelemetry.totalCacheMisses++;
    return null;
  }
  cacheTelemetry.totalCacheHits++;
  return entry.data;
}

export function setCachedData(key: string, data: any, ttlMs: number = 120000): void {
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + ttlMs
  });
}

export function getGeminiClient(): any {
  return {} as any; // Delegated to service internally
}

// Resilient wrapper for Gemini content generation with exponential backoff retries for transient errors
export async function aiGenerateContentWithRetry(client: any, params: any, retries = 2, initialDelay = 1000): Promise<any> {
  return geminiService.generateContent(params, retries, initialDelay);
}
