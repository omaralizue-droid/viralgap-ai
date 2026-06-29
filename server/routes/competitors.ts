import { Router } from 'express';
import { db } from '../db';
import { Type } from '@google/genai';
import { getGeminiClient, aiGenerateContentWithRetry } from '../utils/aiHelper';

const router = Router();

// /api/competitor/reports
router.get('/api/competitor/reports', async (req, res) => {
  const { userId } = req.query;
  const targetUser = (userId as string) || 'usr_default_omar';
  try {
    const reports = await db.getCompetitorReports(targetUser);
    res.json({ success: true, reports });
  } catch (error: any) {
    console.error('Error fetching competitor reports:', error);
    res.status(500).json({ error: 'Failed to retrieve competitor reports' });
  }
});


// /api/competitor/analyze
router.post('/api/competitor/analyze', async (req, res) => {
  const { competitorUrl, userNiche, userId, scheduledFrequency } = req.body;
  const targetUser = userId || 'usr_default_omar';

  if (!competitorUrl) {
    return res.status(400).json({ error: 'Competitor Channel URL is required' });
  }

  try {
    const client = getGeminiClient();

    const prompt = `You are an elite Competitive Intelligence Engineer, YouTube Growth Lead, and Content Strategist.
Perform an in-depth competitor watch and intelligence analysis on the following YouTube channel:

COMPETITOR PROFILE:
- Channel URL: ${competitorUrl}
- User's Creator Niche: ${userNiche || 'General Content Creator'}

Please generate a comprehensive, highly tactical competitor intelligence report containing:
1. competitorName: A friendly display name of the channel (extract or infer from the URL structure or handle, e.g. "Fireship", "MKBHD", "Ali Abdaal").
2. subscriberCount: Estimated active subscribers (e.g., "350K", "1.2M").
3. subscriberGrowth: Short-term subscriber growth momentum (e.g., "+3.2% this month", "+12.4% weekly").
4. viewGrowth: Short-term view velocity growth (e.g., "+15% this week", "+8.2% monthly").
5. newUploads: A list of 4 recent uploads, each containing:
   - title: Video title (should feel authentic to the competitor's style)
   - views: View count (e.g., "120K views", "12K views")
   - publishedAt: E.g., "3 days ago", "1 week ago"
   - url: A representative placeholder YouTube link
6. mostSuccessfulVideos: A list of 4 highest-performing/viral videos, each containing:
   - title: Video title
   - views: View count (e.g., "1.4M views", "850K views")
   - uploadDate: E.g., "3 months ago", "1 year ago"
   - url: Representative YouTube link
   - ctrEst: Estimated CTR percentage (e.g., "8.5%", "11.2%")
7. emergingTopics: A list of 3-4 emerging topics this channel is starting to focus on.
8. winningFormats: A list of 3 specific content structures/formats that perform exceptionally well. Each containing:
   - format: E.g., "100-Second Code Deep Dive", "Brutally Honest Desk Assessment"
   - whyItWorks: Quick visual/psychological explanation of why retention is so high
9. winningTopics: A list of 4 specific high-performing subjects or video angles they dominate.
10. contentGaps: A list of 3 specific areas where they missed crucial viewer intent, creating opportunities for you:
   - topic: The name or angle of the missed opportunity
   - missedAngle: The exact psychological or instructional angle they skipped
   - difficulty: "Low" | "Medium" | "High" (relative difficulty of competing)

Return your response as a single, valid JSON object matching the requested schema.`;

    const response = await aiGenerateContentWithRetry(client, {
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            competitorName: { type: Type.STRING },
            subscriberCount: { type: Type.STRING },
            subscriberGrowth: { type: Type.STRING },
            viewGrowth: { type: Type.STRING },
            newUploads: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  views: { type: Type.STRING },
                  publishedAt: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ['title', 'views', 'publishedAt', 'url']
              }
            },
            mostSuccessfulVideos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  views: { type: Type.STRING },
                  uploadDate: { type: Type.STRING },
                  url: { type: Type.STRING },
                  ctrEst: { type: Type.STRING }
                },
                required: ['title', 'views', 'uploadDate', 'url', 'ctrEst']
              }
            },
            emergingTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            winningFormats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  format: { type: Type.STRING },
                  whyItWorks: { type: Type.STRING }
                },
                required: ['format', 'whyItWorks']
              }
            },
            winningTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            contentGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  missedAngle: { type: Type.STRING },
                  difficulty: { type: Type.STRING }
                },
                required: ['topic', 'missedAngle', 'difficulty']
              }
            }
          },
          required: [
            'competitorName',
            'subscriberCount',
            'subscriberGrowth',
            'viewGrowth',
            'newUploads',
            'mostSuccessfulVideos',
            'emergingTopics',
            'winningFormats',
            'winningTopics',
            'contentGaps'
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');

    const reportToSave = {
      id: `comp_${Date.now()}`,
      competitorUrl,
      scheduledFrequency: scheduledFrequency || 'None',
      lastUpdatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...parsedData
    };

    const savedReport = await db.saveCompetitorReport(targetUser, reportToSave);
    res.json({ success: true, report: savedReport });

  } catch (error: any) {
    console.error('Competitor Watch Gemini Error:', error);

    // Contextual high-fidelity fallbacks based on URL triggers
    const urlLower = competitorUrl.toLowerCase();
    let inferredName = 'TechCompetitor';
    let subNum = '245K';
    let subGrowth = '+4.2% monthly';
    let viewGrowth = '+11.5% weekly';
    let emerging = ['Quantum Computing Basics', 'Local LLMs on Raspberry Pi', 'No-code Web3 Apps'];
    let winTopics = ['Self-hosted Cloud Server Blueprints', 'Why AI coding fails developers', 'How I built a SaaS in 24 hours'];
    let recentVideos = [
      { title: 'The Brutal Reality of Coding in 2026', views: '84K views', publishedAt: '2 days ago', url: 'https://youtube.com/watch?v=comp_rec1' },
      { title: 'I Replaced My Database with a Single JSON File', views: '112K views', publishedAt: '5 days ago', url: 'https://youtube.com/watch?v=comp_rec2' },
      { title: 'Stop buying expensive Cloud Servers. Do this instead.', views: '45K views', publishedAt: '1 week ago', url: 'https://youtube.com/watch?v=comp_rec3' },
      { title: 'Building a Micro-SaaS: From zero to first $100', views: '63K views', publishedAt: '12 days ago', url: 'https://youtube.com/watch?v=comp_rec4' }
    ];
    let successfulVideos = [
      { title: 'How to code like a senior developer in 10 minutes', views: '1.2M views', uploadDate: '4 months ago', url: 'https://youtube.com/watch?v=comp_success1', ctrEst: '9.4%' },
      { title: 'The hidden trap of microservices (My $10,000 mistake)', views: '890K views', uploadDate: '7 months ago', url: 'https://youtube.com/watch?v=comp_success2', ctrEst: '10.8%' },
      { title: 'I built an AI assistant that actually works', views: '650K views', uploadDate: '9 months ago', url: 'https://youtube.com/watch?v=comp_success3', ctrEst: '8.1%' },
      { title: 'Why I left my $300k FAANG job to build micro-SaaS', views: '540K views', uploadDate: '11 months ago', url: 'https://youtube.com/watch?v=comp_success4', ctrEst: '12.3%' }
    ];
    let formats = [
      { format: '100-Second Speed-run Tutorials', whyItWorks: 'Uses high-velocity visual transitions and rapid-fire speech to build high curiosity and near-perfect viewer retention.' },
      { format: 'Realist Warning Storyboards', whyItWorks: 'Starts with a massive negative penalty hook (e.g. "My $10k mistake"). Triggers the audience\'s aversion to risk and establishes deep expertise.' },
      { format: 'Whiteboard Blueprint Deconstructions', whyItWorks: 'Uses hand-drawn conceptual graphs to simplify complex systems, creating a classroom feel that viewers bookmark and save.' }
    ];
    let gaps = [
      { topic: 'Offline-First Desktop SaaS Blueprints', missedAngle: 'They only focus on cloud SaaS, skipping the rising demand for private offline-first software.', difficulty: 'Medium' as const },
      { topic: 'Vite & esbuild Bundle Optimizations', missedAngle: 'They mention build speed but never show a hands-on guide on fixing bloated Node modules step-by-step.', difficulty: 'Low' as const },
      { topic: 'Securing API Keys Server-Side', missedAngle: 'They configure API keys client-side, skipping crucial production-ready proxy middleware explanations.', difficulty: 'Low' as const }
    ];

    if (urlLower.includes('mkbhd')) {
      inferredName = 'MKBHD';
      subNum = '18.6M';
      subGrowth = '+1.5% monthly';
      viewGrowth = '+18.4% weekly';
      emerging = ['Vision Pro Long-term assessment', 'Transparent smartphones', 'Solid-state EV batteries'];
      winTopics = ['The blind smartphone camera test', 'Brutally honest product reviews', 'My everyday tech setup'];
      recentVideos = [
        { title: 'The Ultimate Workspace Redesign 2026', views: '2.4M views', publishedAt: '3 days ago', url: 'https://youtube.com/watch?v=mkbhd_rec1' },
        { title: 'Is This Transparent Phone Actually Useful?', views: '1.8M views', publishedAt: '6 days ago', url: 'https://youtube.com/watch?v=mkbhd_rec2' },
        { title: 'The Best Tech Under $50 (2026)', views: '3.1M views', publishedAt: '1 week ago', url: 'https://youtube.com/watch?v=mkbhd_rec3' },
        { title: 'The Honest Truth About EV Battery Degradation', views: '1.5M views', publishedAt: '10 days ago', url: 'https://youtube.com/watch?v=mkbhd_rec4' }
      ];
      successfulVideos = [
        { title: 'Smartphone Awards 2025: Who Won?', views: '8.4M views', uploadDate: '5 months ago', url: 'https://youtube.com/watch?v=mkbhd_s1', ctrEst: '11.4%' },
        { title: 'The Real Cost of Apple Vision Pro', views: '6.9M views', uploadDate: '8 months ago', url: 'https://youtube.com/watch?v=mkbhd_s2', ctrEst: '10.1%' },
        { title: 'How YouTube is changing forever', views: '5.2M views', uploadDate: '1 year ago', url: 'https://youtube.com/watch?v=mkbhd_s3', ctrEst: '8.9%' },
        { title: 'My Everyday Tech: what is in my bag?', views: '4.8M views', uploadDate: '1.2 years ago', url: 'https://youtube.com/watch?v=mkbhd_s4', ctrEst: '12.0%' }
      ];
    } else if (urlLower.includes('fireship')) {
      inferredName = 'Fireship';
      subNum = '3.1M';
      subGrowth = '+4.8% monthly';
      viewGrowth = '+22.1% weekly';
      emerging = ['Bun vs Node performance', 'WebContainers', 'AI coding agents comparison'];
      winTopics = ['Code in 100 Seconds', 'This tech was deprecated today', 'Is this the end of developers?'];
      recentVideos = [
        { title: 'The AI Coding Agent that replaced me', views: '412K views', publishedAt: '1 day ago', url: 'https://youtube.com/watch?v=fireship_rec1' },
        { title: 'Bun 2.0 is actually crazy fast', views: '320K views', publishedAt: '4 days ago', url: 'https://youtube.com/watch?v=fireship_rec2' },
        { title: 'Why senior developers are quitting their jobs', views: '580K views', publishedAt: '1 week ago', url: 'https://youtube.com/watch?v=fireship_rec3' },
        { title: 'TypeScript just added a new cheat code', views: '290K views', publishedAt: '9 days ago', url: 'https://youtube.com/watch?v=fireship_rec4' }
      ];
      successfulVideos = [
        { title: 'C++ in 100 Seconds', views: '4.1M views', uploadDate: '1 year ago', url: 'https://youtube.com/watch?v=fireship_s1', ctrEst: '13.5%' },
        { title: 'Next.js 15: The good, the bad, and the ugly', views: '1.9M views', uploadDate: '6 months ago', url: 'https://youtube.com/watch?v=fireship_s2', ctrEst: '11.8%' },
        { title: 'I built a chat app in 10 different languages', views: '1.5M views', uploadDate: '9 months ago', url: 'https://youtube.com/watch?v=fireship_s3', ctrEst: '10.5%' },
        { title: 'SQL in 100 Seconds', views: '3.8M views', uploadDate: '2 years ago', url: 'https://youtube.com/watch?v=fireship_s4', ctrEst: '14.2%' }
      ];
    } else if (urlLower.includes('mrbeast')) {
      inferredName = 'MrBeast';
      subNum = '285M';
      subGrowth = '+5.8% monthly';
      viewGrowth = '+35.1% weekly';
      emerging = ['Extreme physical challenges', 'Island survival games', 'Global scale philanthropic tournaments'];
      winTopics = ['Last to leave the circle wins $500,000', 'Surviving 100 days in a bunker', 'I bought a private island'];
      recentVideos = [
        { title: 'Surviving 7 Days in a Real-life Pyramid', views: '98M views', publishedAt: '4 days ago', url: 'https://youtube.com/watch?v=beast_rec1' },
        { title: 'I Spent $10,000,000 on World\'s Safest House', views: '114M views', publishedAt: '11 days ago', url: 'https://youtube.com/watch?v=beast_rec2' },
        { title: 'World\'s Hardest Laser Maze vs Pro Gymnasts', views: '124M views', publishedAt: '2 weeks ago', url: 'https://youtube.com/watch?v=beast_rec3' },
        { title: 'I Spent 100 Hours In Extreme Sensory Deprivation', views: '135M views', publishedAt: '3 weeks ago', url: 'https://youtube.com/watch?v=beast_rec4' }
      ];
      successfulVideos = [
        { title: '$1 vs $1,000,000 Hotel Room!', views: '310M views', uploadDate: '6 months ago', url: 'https://youtube.com/watch?v=beast_s1', ctrEst: '12.4%' },
        { title: 'Last To Leave Circle Wins $500,000', views: '290M views', uploadDate: '1 year ago', url: 'https://youtube.com/watch?v=beast_s2', ctrEst: '11.8%' },
        { title: 'Ages 1 - 100 Fight For $250,000', views: '270M views', uploadDate: '8 months ago', url: 'https://youtube.com/watch?v=beast_s3', ctrEst: '10.9%' },
        { title: 'I Spent 50 Hours Buried Alive', views: '250M views', uploadDate: '2 years ago', url: 'https://youtube.com/watch?v=beast_s4', ctrEst: '13.1%' }
      ];
    } else {
      const match = competitorUrl.match(/(?:@|channel\/|user\/)([a-zA-Z0-9_\-\.]+)/);
      if (match && match[1]) {
        inferredName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
    }

    const reportFallback = {
      id: `comp_${Date.now()}`,
      competitorUrl,
      competitorName: inferredName,
      subscriberCount: subNum,
      subscriberGrowth: subGrowth,
      viewGrowth: viewGrowth,
      newUploads: recentVideos,
      mostSuccessfulVideos: successfulVideos,
      emergingTopics: emerging,
      winningFormats: formats,
      winningTopics: winTopics,
      contentGaps: gaps,
      scheduledFrequency: scheduledFrequency || 'None',
      lastUpdatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const savedReport = await db.saveCompetitorReport(targetUser, reportFallback);
    res.json({ success: true, report: savedReport, isFallback: true });
  }
});


// /api/competitor/schedule
router.post('/api/competitor/schedule', async (req, res) => {
  const { id, scheduledFrequency, userId } = req.body;
  const targetUser = userId || 'usr_default_omar';

  if (!id || !scheduledFrequency) {
    return res.status(400).json({ error: 'Report ID and scheduledFrequency are required' });
  }

  try {
    const reports = await db.getCompetitorReports(targetUser);
    const report = reports.find(r => r.id === id);
    if (!report) {
      return res.status(404).json({ error: 'Competitor report not found' });
    }

    report.scheduledFrequency = scheduledFrequency;
    report.lastUpdatedAt = new Date().toISOString();
    
    await db.saveCompetitorReport(targetUser, report);
    res.json({ success: true, report });
  } catch (error: any) {
    console.error('Error scheduling competitor report:', error);
    res.status(500).json({ error: 'Failed to update scheduled frequency' });
  }
});

router.delete('/api/competitor/reports/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  const targetUser = (userId as string) || 'usr_default_omar';

  if (!id) {
    return res.status(400).json({ error: 'Competitor report ID is required' });
  }

  try {
    const deleted = await db.deleteCompetitorReport(targetUser, id);
    res.json({ success: deleted });
  } catch (error: any) {
    console.error('Error deleting competitor report:', error);
    res.status(500).json({ error: 'Failed to delete competitor report' });
  }
});


// /api/competitor/simulate-update
router.post('/api/competitor/simulate-update', async (req, res) => {
  const { userId } = req.body;
  const targetUser = userId || 'usr_default_omar';

  try {
    const reports = await db.getCompetitorReports(targetUser);
    const scheduledReports = reports.filter(r => r.scheduledFrequency !== 'None');

    if (scheduledReports.length === 0) {
      return res.json({ success: true, updatedCount: 0, message: 'No active scheduled monitors found.' });
    }

    const updatedReports = [];
    for (const report of scheduledReports) {
      const subNumberMatch = report.subscriberCount.match(/^([\d\.]+)([K|M]?)$/);
      let updatedSubs = report.subscriberCount;
      if (subNumberMatch) {
        let val = parseFloat(subNumberMatch[1]);
        const unit = subNumberMatch[2];
        val += (Math.random() * 0.03 * val);
        updatedSubs = `${val.toFixed(unit === 'M' ? 2 : 1)}${unit}`;
      }

      const adjectives = ['Secret', 'Insane', 'Revolutionary', 'Fatal', 'Proven', 'Ultimate'];
      const nouns = ['Tricks', 'SaaS secrets', 'DB blueprints', 'API hacks', 'UI mistakes'];
      const randomTitle = `The ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} I learned in 24 hours`;
      const randomViews = `${Math.floor(Math.random() * 80 + 10)}K views`;

      const newUpload = {
        title: randomTitle,
        views: randomViews,
        publishedAt: 'Just now (Simulated Monitor)',
        url: `https://youtube.com/watch?v=sim_${Date.now()}`
      };

      report.subscriberCount = updatedSubs;
      report.newUploads = [newUpload, ...report.newUploads.slice(0, 3)];
      report.lastUpdatedAt = new Date().toISOString();

      await db.saveCompetitorReport(targetUser, report);
      updatedReports.push(report);
    }

    res.json({ success: true, updatedCount: updatedReports.length, updatedReports });
  } catch (error: any) {
    console.error('Error simulating scheduled update:', error);
    res.status(500).json({ error: 'Failed to execute scheduled simulator update' });
  }
});


// 10. Opportunity Alerts API Routes

// GET active configs for a user

export { router as competitorRouter };
