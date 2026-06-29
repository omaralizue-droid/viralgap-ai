import { createClient } from '@supabase/supabase-js';
import { BaseService } from './BaseService';

export class SupabaseService extends BaseService {
  private supabase: any = null;

  constructor() {
    super();
    if (!this.isMock) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        try {
          this.supabase = createClient(supabaseUrl, supabaseKey);
          console.log('Supabase client initialized via SupabaseService.');
        } catch (err) {
          console.error('Error initializing Supabase in SupabaseService:', err);
        }
      }
    }
  }

  isConfigured(): boolean {
    return !!this.supabase && !this.isMock;
  }

  async saveUrlReport(report: any): Promise<boolean> {
    if (!this.supabase || this.isMock) {
      return false; // Skip in mock mode (report is saved in database.json already)
    }

    try {
      const { error } = await this.supabase
        .from('url_reports')
        .insert([report]);

      if (error) {
        console.warn('[SupabaseService Warning] DB insertion failed:', error.message);
        return false;
      }

      console.log('[SupabaseService] Saved report to Supabase successfully.');
      return true;
    } catch (err: any) {
      console.warn('[SupabaseService Error] Connection failed:', err?.message || err);
      return false;
    }
  }
}
