import { Router } from 'express';
import { db, OpportunityAlertLog } from '../db';
import { Type } from '@google/genai';
import { getGeminiClient, aiGenerateContentWithRetry } from '../utils/aiHelper';

const router = Router();

// /api/opportunity/configs (GET)
router.get('/api/opportunity/configs', async (req, res) => {
  const userId = (req.query.userId as string) || 'usr_default_omar';
  try {
    const configs = await db.getOpportunityConfigs(userId);
    res.json({ success: true, configs });
  } catch (error: any) {
    console.error('Error fetching opportunity configs:', error);
    res.status(500).json({ error: 'Failed to retrieve opportunity alert rules' });
  }
});

// POST save/update alert config

// /api/opportunity/configs (POST)
router.post('/api/opportunity/configs', async (req, res) => {
  const { id, userId, type, title, queryOrUrl, interval, deliveryEmail, deliveryDashboard, status } = req.body;
  const targetUser = userId || 'usr_default_omar';

  if (!type || !title || !queryOrUrl) {
    return res.status(400).json({ error: 'Alert type, title, and target query/URL are required.' });
  }

  try {
    const configToSave = {
      id: id || `rule_${Date.now()}`,
      userId: targetUser,
      type,
      title,
      queryOrUrl,
      interval: interval || 'None',
      deliveryEmail: !!deliveryEmail,
      deliveryDashboard: !!deliveryDashboard,
      status: status || 'active',
      lastCheckedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const savedConfig = await db.saveOpportunityConfig(targetUser, configToSave);
    res.json({ success: true, config: savedConfig });
  } catch (error: any) {
    console.error('Error saving opportunity config:', error);
    res.status(500).json({ error: 'Failed to save opportunity alert configuration' });
  }
});

// DELETE alert config
router.delete('/api/opportunity/configs/:id', async (req, res) => {
  const { id } = req.params;
  const userId = (req.query.userId as string) || 'usr_default_omar';

  try {
    const deleted = await db.deleteOpportunityConfig(userId, id);
    res.json({ success: deleted });
  } catch (error: any) {
    console.error('Error deleting opportunity config:', error);
    res.status(500).json({ error: 'Failed to remove opportunity alert configuration' });
  }
});

// GET logs (triggered alerts history) for a user

// /api/opportunity/logs
router.get('/api/opportunity/logs', async (req, res) => {
  const userId = (req.query.userId as string) || 'usr_default_omar';
  try {
    const logs = await db.getOpportunityLogs(userId);
    res.json({ success: true, logs });
  } catch (error: any) {
    console.error('Error fetching opportunity logs:', error);
    res.status(500).json({ error: 'Failed to retrieve alert history log' });
  }
});

// POST mark all logs as read

// /api/opportunity/logs/mark-read
router.post('/api/opportunity/logs/mark-read', async (req, res) => {
  const { userId } = req.body;
  const targetUser = userId || 'usr_default_omar';
  try {
    await db.markOpportunityLogsAsRead(targetUser);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error marking logs as read:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// POST clear alert logs history

// /api/opportunity/logs/clear
router.post('/api/opportunity/logs/clear', async (req, res) => {
  const { userId } = req.body;
  const targetUser = userId || 'usr_default_omar';
  try {
    await db.clearOpportunityLogs(targetUser);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error clearing alert logs:', error);
    res.status(500).json({ error: 'Failed to clear alert log history' });
  }
});

// POST run check (simulate check or fetch from Gemini)

// /api/opportunity/check
router.post('/api/opportunity/check', async (req, res) => {
  const { configId, userId, userEmail } = req.body;
  const targetUser = userId || 'usr_default_omar';
  const targetEmail = userEmail || 'omar263@gmail.com';

  try {
    const configs = await db.getOpportunityConfigs(targetUser);
    const config = configs.find(c => c.id === configId);
    if (!config) {
      return res.status(404).json({ error: 'Alert configuration rule not found.' });
    }

    config.lastCheckedAt = new Date().toISOString();
    await db.saveOpportunityConfig(targetUser, config);

    let aiData: any = {};
    let isFallback = false;

    try {
      // Call Gemini AI to fetch a customized alert for this config!
      const client = getGeminiClient();

      const prompt = `You are a growth intelligence automation engine for content creators.
Perform an in-depth opportunistic scan based on this alert configuration rule:
- Alert Type: ${config.type} (one of: trend, niche, competitor_viral, keyword)
- Target Query / URL: ${config.queryOrUrl}
- Creator niche: General Creator

Generate a highly specific, realistic opportunity alert relevant to the alert type and target query/URL.
For each alert type, use the following scenario:
1. "trend": A brand-new high-velocity search trend has appeared related to "${config.queryOrUrl}". Provide a catchy alert title, detailed message, specific metrics (like search surge percentage), insights, and high-impact action items.
2. "niche": A low-competition breakout sub-niche has been discovered inside "${config.queryOrUrl}". Identify its potential score, name, and why it is underserved.
3. "competitor_viral": The monitored competitor ("${config.queryOrUrl}") has just uploaded a video that is performing 4x better than their baseline. Specify the title of this viral video, views/hour, CTR estimate, and what psychological hook they used.
4. "keyword": A high-CPC, high-search-volume, low-difficulty keyword opportunity was detected for "${config.queryOrUrl}". Provide exact search volume, keyword difficulty score, and 3 clickable video titles to capitalize on it.

Please generate a structured response matching the schema.`;

      const response = await aiGenerateContentWithRetry(client, {
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              potentialScore: { type: Type.INTEGER },
              metrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                  },
                  required: ['label', 'value']
                }
              },
              insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              actionItems: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendedTitles: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['title', 'message', 'potentialScore', 'metrics', 'insights', 'actionItems']
          }
        }
      });

      aiData = JSON.parse(response.text || '{}');
    } catch (gErr) {
      console.warn('Gemini Opportunity Check failed, using fallback metrics', gErr);
      isFallback = true;
    }

    if (!aiData.title) {
      isFallback = true;
      if (config.type === 'trend') {
        aiData.title = `Breakout Search Trend: "${config.queryOrUrl}"`;
        aiData.message = `Search volume for "${config.queryOrUrl}" has surged by 340% in the last 48 hours following a major community update and social discussion.`;
        aiData.metrics = [
          { label: 'Search Velocity Surge', value: '+340% growth' },
          { label: 'Interest Momentum', value: 'Extreme Spike' },
          { label: 'Competitive Density', value: 'Low (Early Phase)' }
        ];
        aiData.insights = [
          'The search volume is concentrated among developer and tech-enthusiast demographics.',
          'Viewers are searching for rapid setup tutorials rather than theoretical overviews.'
        ];
        aiData.actionItems = [
          `Publish a 5-minute practical walk-through of "${config.queryOrUrl}".`,
          'Use high-contrast blue and yellow text on your thumbnail overlay.'
        ];
        aiData.recommendedTitles = [
          `Why Everyone is Suddenly Searching for "${config.queryOrUrl}"`,
          `The 5-Minute Guide to "${config.queryOrUrl}" (That Actually Works)`
        ];
      } else if (config.type === 'niche') {
        aiData.title = `Low Competition Sub-Niche Found in "${config.queryOrUrl}"`;
        aiData.message = `Our opportunity models identified a high-demand sub-niche inside "${config.queryOrUrl}" with high user retention but less than 10 active video creators covering it.`;
        aiData.metrics = [
          { label: 'Opportunity Score', value: '94/100' },
          { label: 'Competition Score', value: '18/100 (Very Low)' },
          { label: 'Avg Monthly Searches', value: '45,000' }
        ];
        aiData.insights = [
          'Most existing videos on this topic are long, boring lectures.',
          'Audience retention signals show high interest in interactive step-by-step guides.'
        ];
        aiData.actionItems = [
          `Develop a 3-part beginner series focused on "${config.queryOrUrl}".`,
          'Leverage interactive diagrams in your visual explanation.'
        ];
        aiData.recommendedTitles = [
          `The Underserved "${config.queryOrUrl}" Secret Nobody is Telling You`,
          `How to Master "${config.queryOrUrl}" from scratch (Without the Complexity)`
        ];
      } else if (config.type === 'competitor_viral') {
        aiData.title = `Competitor Viral Content Detected: "${config.queryOrUrl}"`;
        aiData.message = `A monitored competitor has just uploaded a video relating to "${config.queryOrUrl}" that is generating 5.2x more views per hour than their typical uploads.`;
        aiData.metrics = [
          { label: 'View Velocity Ratio', value: '5.2x normal' },
          { label: 'First 24h Views', value: '142,000 views' },
          { label: 'Estimated Click-Through-Rate (CTR)', value: '12.4%' }
        ];
        aiData.insights = [
          'The competitor used an emotional "Warning" hook to engage developers.',
          'The primary retention driver was their fast-paced 100-second introduction.'
        ];
        aiData.actionItems = [
          `Produce a counter-perspective or response video targeting the same theme.`,
          'Replicate their question-based hook format to captivate the audience early on.'
        ];
        aiData.recommendedTitles = [
          `Why "${config.queryOrUrl}" is Actually a Huge Mistake`,
          `I Tried Monitored Competitor's "${config.queryOrUrl}" Strategy for 48 Hours`
        ];
      } else {
        aiData.title = `High CPC Keyword Opportunity: "${config.queryOrUrl}"`;
        aiData.message = `High advertiser search bid value detected with near-zero competitive videos for the term "${config.queryOrUrl}".`;
        aiData.metrics = [
          { label: 'Ad-Bid Search CPC', value: '$8.42/click' },
          { label: 'Keyword Search Intent', value: 'Buyer/Transactional' },
          { label: 'Search Index Volume', value: '18,500/month' }
        ];
        aiData.insights = [
          'Advertisers are bidding aggressively to show ads to users researching this query.',
          'Videos explaining this topic are earning 3x higher ad-revenue (RPM) metrics.'
        ];
        aiData.actionItems = [
          `Publish a direct "How-to" resource focused on ${config.queryOrUrl} options.`,
          'Include high-conversion affiliate or sign-up links in your description and pinned comment.'
        ];
        aiData.recommendedTitles = [
          `The Complete Guide to ${config.queryOrUrl} (Earn More Today)`,
          `Is ${config.queryOrUrl} Still Worth It in 2026? (Honest Review)`
        ];
      }
      aiData.potentialScore = 85;
    }

    // Create an elegant email template if email delivery is enabled
    let emailSubject = '';
    let emailBody = '';
    if (config.deliveryEmail) {
      emailSubject = `🚨 Opportunity Alert: ${aiData.title}`;
      emailBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #1e293b; border-radius: 16px; background-color: #0c101d; color: #f1f5f9; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);">
          <div style="display: flex; align-items: center; justify-content: space-between; border-b: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #10b981; margin: 0; font-size: 20px;">⚡ ViralGap Opportunity Radar</h2>
            <span style="font-size: 11px; font-weight: bold; background-color: #10b981/10; color: #10b981; border: 1px solid #10b981/20; padding: 4px 8px; border-radius: 20px;">POTENTIAL: ${aiData.potentialScore || 85}%</span>
          </div>
          <p style="font-size: 14px; color: #94a3b8; margin-top: 0;">Hello Creator,</p>
          <p style="font-size: 16px; font-weight: bold; color: #f8fafc; margin-bottom: 12px;">${aiData.title}</p>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">${aiData.message}</p>
          
          <div style="background-color: #070b14; border: 1px solid #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h4 style="margin-top: 0; margin-bottom: 12px; color: #10b981; font-size: 12px; text-transform: uppercase; font-family: monospace; letter-spacing: 1px;">Key Traffic Metrics:</h4>
            <table style="width: 100%; border-collapse: collapse;">
              ${(aiData.metrics || []).map((m: any) => `
                <tr style="border-bottom: 1px solid #0f172a;">
                  <td style="padding: 8px 0; font-size: 13px; color: #94a3b8; font-weight: 500;">${m.label}</td>
                  <td style="padding: 8px 0; font-size: 13px; color: #f8fafc; font-weight: bold; text-align: right;">${m.value}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h4 style="color: #f8fafc; font-size: 14px; margin-top: 0; margin-bottom: 10px;">🚀 High-Retention Action Items:</h4>
            <ul style="padding-left: 20px; margin: 0;">
              ${(aiData.actionItems || []).map((item: string) => `<li style="font-size: 13.5px; color: #cbd5e1; margin-bottom: 8px; line-height: 1.4;">${item}</li>`).join('')}
            </ul>
          </div>

          ${aiData.recommendedTitles && aiData.recommendedTitles.length > 0 ? `
            <div style="margin: 20px 0; border-top: 1px solid #1e293b; padding-top: 15px;">
              <h4 style="color: #f8fafc; font-size: 14px; margin-top: 0; margin-bottom: 10px;">🎯 Recommended Clickable Titles:</h4>
              <ul style="padding-left: 20px; margin: 0;">
                ${aiData.recommendedTitles.map((t: string) => `<li style="font-size: 13px; color: #34d399; margin-bottom: 6px; line-style: circle;"><em>"${t}"</em></li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <p style="font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px; line-height: 1.4;">
            This email was compiled and dispatched in simulation based on your <strong>${config.title}</strong> monitor rule inside your Opportunity Alerts Dashboard. To adjust alerts or frequency, visit your workspace portal.
          </p>
        </div>
      `;
    }

    const newLog: OpportunityAlertLog = {
      id: `alert_${Date.now()}`,
      userId: targetUser,
      configId: config.id,
      type: config.type,
      title: aiData.title,
      message: aiData.message,
      detailData: {
        metrics: aiData.metrics,
        insights: aiData.insights,
        actionItems: aiData.actionItems,
        potentialScore: aiData.potentialScore,
        recommendedTitles: aiData.recommendedTitles
      },
      emailSent: config.deliveryEmail,
      emailSentTo: config.deliveryEmail ? targetEmail : undefined,
      emailSubject: config.deliveryEmail ? emailSubject : undefined,
      emailBody: config.deliveryEmail ? emailBody : undefined,
      read: false,
      createdAt: new Date().toISOString()
    };

    const savedLog = await db.addOpportunityLog(targetUser, newLog);
    res.json({ success: true, log: savedLog, isFallback });

  } catch (error: any) {
    console.error('Error executing opportunity check:', error);
    res.status(500).json({ error: 'Failed to process opportunity alert check' });
  }
});


// =========================================================
// 11. Content Calendar API Routes
// =========================================================

// GET all content calendars for a user

export { router as opportunityRouter };
