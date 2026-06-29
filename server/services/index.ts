import { GeminiService } from './GeminiService';
import { YouTubeService } from './YouTubeService';
import { StripeService } from './StripeService';
import { SupabaseService } from './SupabaseService';

// Initialize and export service singletons
export const geminiService = new GeminiService();
export const youtubeService = new YouTubeService();
export const stripeService = new StripeService();
export const supabaseService = new SupabaseService();

export type { YouTubeVideoMetadata } from './YouTubeService';
