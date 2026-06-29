import { GoogleGenAI } from '@google/genai';
import { BaseService } from './BaseService';
import { generateMockGeminiResponse } from '../utils/mockGenerator';

export class GeminiService extends BaseService {
  private client: GoogleGenAI | null = null;

  constructor() {
    super();
    if (!this.isMock) {
      const key = process.env.GEMINI_API_KEY;
      if (key) {
        this.client = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      }
    }
  }

  isConfigured(): boolean {
    return !!this.client || this.isMock;
  }

  async generateContent(params: any, retries = 2, initialDelay = 1000): Promise<{ text: string }> {
    if (this.isMock || !this.client) {
      // Mock mode
      const promptText = params.contents || '';
      const mockText = generateMockGeminiResponse(promptText);
      return { text: mockText };
    }

    // Production mode with retries
    let attempt = 0;
    let delay = initialDelay;
    while (true) {
      try {
        const response = await this.client.models.generateContent(params);
        return {
          text: response.text || ''
        };
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const errStatus = err?.status || err?.code;
        const isTransient = 
          errStatus === 503 || 
          errStatus === 429 || 
          errStatus === 504 || 
          errStatus === 502 ||
          errMsg.includes('503') || 
          errMsg.includes('429') || 
          errMsg.includes('demand') || 
          errMsg.includes('UNAVAILABLE') || 
          errMsg.includes('limit') ||
          errMsg.includes('busy') ||
          errMsg.includes('temp');

        if (isTransient && attempt < retries) {
          attempt++;
          console.warn(`[GeminiService Warning] Transient error: ${errMsg}. Retrying attempt ${attempt}/${retries} in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2.5;
        } else {
          console.error(`[GeminiService Error] Permanent or final failure on attempt ${attempt}:`, err);
          throw err;
        }
      }
    }
  }
}
