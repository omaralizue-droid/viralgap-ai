/**
 * Realistic Context-Aware Mock Data Generator for ViralGap AI
 * Returns structured JSON responses matching the exact schemas requested by the routes.
 */

// Helper to extract a topic or query from a prompt string
function extractTopic(prompt: string, fallback: string): string {
  // Look for quotes or labels
  const matchLabel = prompt.match(/(?:niche|topic|keyword|concept|query|URL|video):\s*"([^"]+)"/i);
  if (matchLabel && matchLabel[1]) return matchLabel[1];

  const matchQuote = prompt.match(/["']([^"']{3,40})["']/);
  if (matchQuote && matchQuote[1]) return matchQuote[1];

  return fallback;
}

export function generateMockGeminiResponse(prompt: string): string {
  const promptStr = prompt || '';
  
  // 1. CONTENT GAP FINDER SCHEMA
  if (promptStr.includes('keyword or niche') || promptStr.includes('Content Gaps Found') || promptStr.includes('content-gap')) {
    const topic = extractTopic(promptStr, 'AI SaaS Development');
    const responseObj = [
      {
        id: `gap_${Math.random().toString(36).substring(2, 9)}`,
        topic: `${topic} for Beginners`,
        description: `An underserved niche teaching absolute beginners how to get started with ${topic} using modular, visual workflows. Most existing content targets advanced users.`,
        opportunityScore: 94,
        competitionScore: 18,
        estimatedDemand: '85K+ monthly searches on YouTube',
        reasonUnderserved: '90% of current tutorials are long-form lectures. Viewers are actively seeking 5-minute interactive builds with downloadable templates.',
        topVideosAnalyzed: [
          { title: `How to Learn ${topic} in 10 Minutes`, views: '450K views', publishDate: '2 weeks ago', engagement: 'High (4.8% comment ratio)' },
          { title: `${topic} Tutorial for absolute beginners`, views: '120K views', publishDate: '1 month ago', engagement: 'Medium' }
        ],
        audiencePainPoints: [
          'Confusing developer setup guidelines',
          'Lack of copy-paste starter kits',
          'Too much theory, not enough real-world building'
        ],
        viralAngle: `Building a complete ${topic} project in under 5 minutes without writing a single line of complex code.`,
        contentIdeas: [
          `I built a ${topic} project in 5 minutes (Step-by-Step)`,
          `The absolute beginner guide to ${topic} in 2026`,
          `Don't learn ${topic} the hard way - do this instead`
        ],
        titleIdeas: [
          `I Built a ${topic} App in 5 Minutes (Step-by-Step)`,
          `Stop Learning ${topic} the Hard Way. Do This.`,
          `Master ${topic} in 2026 (No Coding Required)`,
          `How to Build a ${topic} Startup in 24 Hours`
        ],
        thumbnailIdeas: [
          `High-contrast layout showing a '5 MINS' timer badge next to a glowing ${topic} graphic against deep dark background`,
          `A split screen comparing 'Hard Way' (complex code) vs 'Easy Way' (glowing green visual checkmark)`
        ]
      },
      {
        id: `gap_${Math.random().toString(36).substring(2, 9)}`,
        topic: `Secret ${topic} Tools`,
        description: `Highly actionable roundups of automated software tools and browser extensions that speed up ${topic} workflows by 10x.`,
        opportunityScore: 89,
        competitionScore: 24,
        estimatedDemand: '55K+ monthly searches',
        reasonUnderserved: 'Creators keep listing the same 3 tools. Audiences are searching for new, underground releases.',
        topVideosAnalyzed: [
          { title: `Top 5 Tools for ${topic}`, views: '280K views', publishDate: '3 days ago', engagement: 'Extreme (8.2% comment ratio)' }
        ],
        audiencePainPoints: [
          'Expensive subscription costs for toolkits',
          'Steep learning curves for setup',
          'Tools that are deprecated or laggy'
        ],
        viralAngle: 'Showcasing a secret free utility that does the work of a $100/mo premium subscription.',
        contentIdeas: [
          `5 Free Tools for ${topic} That Feel Illegal to Know`,
          `The underground software that changes ${topic} forever`
        ],
        titleIdeas: [
          `5 Free ${topic} Tools That Feel Illegal to Know`,
          `This Secret Tool Changes ${topic} Forever (10x Speed)`,
          `I Replaced My Entire ${topic} Workflow with this Free Utility`
        ],
        thumbnailIdeas: [
          `A mysterious dark layout showing a secret folder icon glowing orange with a large badge reading 'ILLEGAL?'`
        ]
      }
    ];
    return JSON.stringify(responseObj);
  }

  // 2. BETTER VIDEO GENERATOR (URL ANALYZER) SCHEMA
  if (promptStr.includes('Viral DNA teardown') || promptStr.includes('url-analyzer')) {
    const videoUrl = extractTopic(promptStr, 'https://youtube.com/watch?v=mock');
    const topic = videoUrl.includes('watch') ? 'Viral Creator Strategy' : videoUrl;
    const responseObj = {
      title: `How I Scaled ${topic} to 1M Views (Complete Blueprint)`,
      description: `A masterclass visual teardown of the psychology and structural pacing models that made this ${topic} topic viral.`,
      transcriptSnippet: `[00:00] Look at this chart. This is the exact moment my channel exploded. Most creators think it's about the algorithm, but it's actually about a 3-second psychological trigger. Let me show you how...`,
      views: '1.4M views',
      likes: '92K likes',
      comments: '4.2K comments',
      channelData: 'Targeting mid-level creator builders, founders, and growth hackers. Clean, technical style with high visual authority.',
      viralScore: 92,
      hookStrengthAnalysis: 'Uses a high-stakes visual hook (showing a hockey-stick growth chart) combined with an immediate open-loop statement (curiosity about the 3-second trigger) within the first 4 seconds.',
      curiosityGapAnalysis: 'Forces the viewer to question their existing knowledge. They think they need algorithm tricks, but the video claims there is a single hidden trigger they are missing.',
      storytellingAnalysis: 'Follows a classic struggle-to-success hero arc. Starts with a failed launch, introduces the turning point, reveals the core solution, and ends with practical guidelines.',
      pacingAnalysis: 'Aggressive pacing with average word speed of 165 WPM. Visual scene transitions or pattern interrupts occur every 2.4 seconds, utilizing slide-ins and code zooms.',
      retentionTriggersAnalysis: 'Displays live dashboard screenshots, red circle overlays to guide focus, and quick zoom loops on statistical graphs.',
      emotionalTriggersAnalysis: 'Leverages FOMO (fear of missing out on the secret trigger) and aspiration (desire to replicate 1M view numbers).',
      socialProofAnalysis: 'Displays active comment screenshots praising the method and shows real analytics graphs from stripe/youtube dashboards.',
      authoritySignalsAnalysis: 'Showcases live developer consoles, high-fidelity edit styling, and clean voiceover clarity.',
      ctaAnalysis: 'Ends with a seamless transition: references a secondary video analyzing the specific tools used, linking it as an end-screen playlist card.',
      originalHook: 'Shows a chart and claims to reveal the secret behind it, but pacing in the first 10 seconds is slightly wordy.',
      originalStructure: 'Starts with intro, goes into steps 1-3, shows tools, ends with subscriber call.',
      originalPsychology: 'Asymmetric information gap (creator knows secret, viewer does not).',
      originalRetentionPatterns: 'Verbal transitions every 5 seconds, code screen captures, cursor highlights.',
      betterTitle: `The 3-Second Rule That Gets 1,000,000 Views (No Budget Required)`,
      betterHook: `[00:00 - Visual: Rapid cut zoom into chart peaking. Out-of-focus background.] Voiceover: "This chart is real. And this is the exact 3-second rule that caused it. If you build videos without this, you are wasting your time."`,
      betterStory: `Detailed body narration showing three practical case studies, removing long intros, and utilizing code snippets dynamically to illustrate points rather than pure talking-head scenes.`,
      betterCta: `Outro: "Now you know the rule, but you still need the software. Click right here to watch my exhaustive tools breakdown." [Endscreen overlay displays related video]`,
      betterThumbnailConcept: `Extreme zoom of the peak chart, with a simple yellow arrow pointing to the breakout moment. Side text: '3 SECONDS'. Pitch black background.`,
      strengths: [
        'Excellent visual hooks using real dashboard analytics.',
        'High voiceover energy and clear, actionable takeaways.',
        'Uses B-roll pattern interrupts consistently every 3 seconds.'
      ],
      weaknesses: [
        'First 15 seconds contains a slow theoretical explanation.',
        'Outro is too long (20 seconds of saying goodbye which kills retention).',
        'Audio is slightly echoing in the mid-range frequencies.'
      ],
      missedOpportunities: [
        'Did not link the mentioned code template in the pinned comment.',
        'Failed to use chapters or timelines to increase scroll satisfaction.',
        'Missed opportunities to prompt a subscriber conversion during the peak emotional payoff.'
      ],
      betterVersions: [
        'Short-form cut version (exactly 58 seconds) focusing purely on step 2.',
        'Docu-style version with lower verbal pacing but higher graphical immersion.'
      ],
      betterAngles: [
        'Targeting developers: How to write the code that automates this.',
        'Targeting marketers: The psychological pricing model that triggers checkout.'
      ],
      betterHooks: [
        'This 3-second rule gets 1M views.',
        'Stop using boring intros. Do this instead.',
        'I audited 100 viral videos. Here is the blueprint.'
      ],
      alternativeVersionsBetter: [
        {
          title: `How I Automated a $10,000/mo SaaS (Full Code Teardown)`,
          hook: `[00:00] I built a SaaS in 5 days that makes $10k/mo. Here is the full code repository.`,
          story: `Full visual walk-through of the directory architecture, database structures, and stripe webhooks code.`,
          cta: `Link to the public github repo in the pinned comment.`,
          thumbnailConcept: `Stripe dashboard overlay with text: '$10k/mo'. Glowing folder icon next to it.`,
          angleDescription: `Targets developer-founders looking for practical code walkthroughs instead of marketing overviews.`
        }
      ]
    };
    return JSON.stringify(responseObj);
  }

  // 3. SCRIPT GENERATOR SCHEMA
  if (promptStr.includes('script versions') || promptStr.includes('script-generator')) {
    const topic = extractTopic(promptStr, 'AI SaaS Tooling');
    const responseObj = {
      topic: topic,
      targetAudience: 'Content Creators, Developer Builders, and Tech Enthusiasts',
      videoLength: '5-8 Minutes',
      platform: 'YouTube',
      tone: 'Dynamic, Informative, Action-Oriented',
      versionA: {
        title: `I Built a ${topic} App in 5 Minutes (Full Walkthrough)`,
        hook: `[00:00 - Visual: Rapid zoom into a functional web dashboard.] Voiceover: "This is a fully automated ${topic} tool. I built it in exactly 5 minutes without writing any code. And I'm giving you the template."`,
        opening: `[00:15 - Visual: Split screen showing code vs no-code templates.] Voiceover: "Most creators think building software takes months. But if you combine these three free AI templates, you can launch a product by this afternoon. Here is the exact stack."`,
        body: `[00:45 - Visual: Chrome browser screen recording starting a project.] Voiceover: "Step 1: Go to the template library and click clone. This sets up your database in 10 seconds. Step 2: Connect your visual editor. Drag and drop these elements. Visual check: We have our structure. Step 3: Link the AI API. Simply copy your key, paste it here, and compile."`,
        storyStructure: 'Fast-paced, pattern-interrupt hook, visual screen recordings, problem-to-solution build workflow.',
        cta: `[04:30 - Visual: Pinned comment zoom-in.] Voiceover: "The template link is in the pinned comment. Click this next video to see how to drive 10,000 users to it on launch day."`
      },
      versionB: {
        title: `The $50M ${topic} Blueprint Nobody Talks About`,
        hook: `[00:00 - Visual: High contrast photo of Vercel/Stripe office.] Voiceover: "This company is valued at fifty million dollars. And their entire business model is built on this simple ${topic} strategy."`,
        opening: `[00:20 - Visual: Text overlays 'BLUEPRINT' on screen.] Voiceover: "It's called hook-pacing. And today, we are going to look at the exact directory structure they use to keep users locked in."`,
        body: `[01:00 - Visual: Diagram mapping user retention pathways.] Voiceover: "Let's break down the logic. First, they capture user inputs with zero friction. Second, they serve cached results instantly, keeping latency under 50ms. Third, they notify users via email trigger loops."`,
        storyStructure: 'Case study style, aspirational hooks, high-stakes business analysis, system architecture mapping.',
        cta: `[06:00 - Visual: Outro screen.] Voiceover: "If you want my PDF blueprint detailing this architecture, check out my newsletter link below. Watch this video next."`
      },
      versionC: {
        title: `Why 99% of People Fail at ${topic} (And the 1% Secret)`,
        hook: `[00:00 - Visual: Large warning icon flashing red.] Voiceover: "99% of people get ${topic} completely wrong. They waste thousands on hosting when they could do it for free like this."`,
        opening: `[00:15 - Visual: Text reads 'THE LIE'.] Voiceover: "You have been lied to by software gurus. You don't need a complex server. Let me prove it to you."`,
        body: `[00:45 - Visual: Showing terminal window compiling client-only code.] Voiceover: "Look at this code. It runs entirely in the user's browser. Zero database server costs. Zero server maintenance. It scales to millions of users automatically."`,
        storyStructure: 'Contrarian challenge, exposing industry lies, cost optimization, terminal/code evidence.',
        cta: `[05:00 - Visual: Clickable link overlay.] Voiceover: "Stop paying for servers. Grab the serverless template right here and start building for free."`
      }
    };
    return JSON.stringify(responseObj);
  }

  // 4. TREND RADAR / ANALYZE SCHEMA
  if (promptStr.includes('simulating YouTube API metadata feeds') || promptStr.includes('trends/analyze')) {
    const topic = extractTopic(promptStr, 'NextJS Boilerplates');
    const responseObj = {
      topic: topic,
      category: 'Software Engineering',
      classification: 'Breakout Niche (High Velocity)',
      trendScore: 94,
      growthScore: 185,
      opportunityScore: 92,
      metrics: {
        viewGrowth: 280,
        uploadGrowth: 45,
        engagementGrowth: 68,
        keywordMomentum: 140
      },
      dataSources: {
        youtubeApiStatus: 'Active & Indexed (Live 2026)',
        historicalSearchQueries: 12450,
        databaseRecordsCount: 382
      },
      historicalInterestData: [
        { month: 'Jan 2026', interest: 32 },
        { month: 'Feb 2026', interest: 45 },
        { month: 'Mar 2026', interest: 58 },
        { month: 'Apr 2026', interest: 72 },
        { month: 'May 2026', interest: 88 },
        { month: 'Jun 2026', interest: 100 }
      ],
      whyItIsTrending: `Search velocity for ${topic} has spiked exponentially due to the release of local visual compilers and automated builder kits. Creators are seeking setup blueprints rather than standard theory guides.`,
      saturationAnalysis: `While broad tutorials are crowded, specific 'build-in-public' SaaS blueprints and 'no-code templates' remain highly underserved with very low competition.`,
      competitorBenchmark: {
        saturatedCreators: ['TechBuilder Alex', 'SaaS Guru Sarah'],
        underservedAngle: 'Showing actual database migrations and Stripe webhook configurations for this stack in a live coding session.'
      },
      viralVideoAngles: [
        {
          title: `How I Launched a ${topic} Project in 2 Hours`,
          thumbnailIdea: `High-contrast dashboard showing '$2,400' next to a glowing ${topic} icon.`,
          hookAngle: 'Disruptive visual showing the live project loading in the browser within 3 seconds.'
        },
        {
          title: `The Secret ${topic} Niche Nobody is Coding`,
          thumbnailIdea: `Mysterious dark screen showing folder tagged 'CLASSIFIED' in orange neon.`,
          hookAngle: 'Asking a contrarian question about why creators waste time coding database scripts manually.'
        }
      ]
    };
    return JSON.stringify(responseObj);
  }

  // 5. VIRAL PREDICTOR SCHEMA
  if (promptStr.includes('predict its performance') || promptStr.includes('viral-predictor')) {
    const title = extractTopic(promptStr, 'AI SaaS in 24 Hours');
    const responseObj = {
      viralScore: 89,
      ctr: 11.4,
      retention: 64.5,
      engagement: 7.2,
      whyHighOrLow: `The title "${title}" has high curiosity appeal. Pacing is fast and B-roll visuals are highly aligned with user expectation. Engagement is strong because you promise a copy-paste code template, which naturally drives comments.`,
      suggestedImprovements: [
        'Change the first 3 seconds of voiceover to immediately show the web app instead of talking head.',
        'Use high-contrast bold yellow text on the thumbnail overlay (no more than 3 words).',
        'Add a pattern interrupt at 0:15 showing your database setup console.'
      ],
      revisedVersion: {
        title: `I Built a SaaS in 24 Hours (Full Code Template)`,
        thumbnailConcept: `Left: Stripe dashboard screenshot with '$420/day'. Right: zoomed visual arrow pointing to terminal.`,
        hook: `[00:00] "This SaaS makes four hundred dollars a day. I coded it in twenty-four hours. Here is the full code."`,
        script: `[00:05] Voiceover explaining the stack (NextJS, Supabase, Stripe) while rapidly panning screenshots of database setup.`
      }
    };
    return JSON.stringify(responseObj);
  }

  // 6. THUMBNAIL PROMPTS
  if (promptStr.includes('Thumbnail Psychology Expert') || promptStr.includes('thumbnail-prompts')) {
    const responseObj = {
      midjourneyPrompt: 'A sleek, premium tech dashboard glowing neon emerald green on a pitch-black table, clean visual UI, hyperrealistic, 8k resolution, cinematic lighting, Vercel design aesthetic --ar 16:9 --style raw',
      visualCues: 'A glowing screen displaying analytics chart, out of focus dark office background, warm desk light reflection.',
      styleAttributes: 'Neon highlights, high visual clarity, deep blacks, modern typography overlays.',
      recommendedAspectRatios: ['16:9 (YouTube Standard)', '9:16 (Shorts)']
    };
    return JSON.stringify(responseObj);
  }

  // 7. VIDEO PROMPTS
  if (promptStr.includes('video prompts') || promptStr.includes('video-prompts')) {
    const responseObj = {
      videoPrompts: [
        { sceneNumber: 1, prompt: 'Extreme close up of a coding terminal running automated scripts, characters flashing green against pitch black', cameraMovement: 'Slow push in', description: 'Represents rapid build action and tech agency.', duration: '3s' },
        { sceneNumber: 2, prompt: 'Split screen showing side-by-side comparison of local server configurations, visual indicators blinking', cameraMovement: 'Static', description: 'Comparison of simple vs complex stack.', duration: '5s' }
      ]
    };
    return JSON.stringify(responseObj);
  }

  // 8. AI CREATOR COACH (COPILOT)
  if (promptStr.includes('AI Creator Coach') || promptStr.includes('copilot')) {
    const responseObj = {
      reply: 'To maximize retention in the first 30 seconds, you should deploy a visual pattern interrupt every 2.5 seconds (e.g. zooming in on database dashboard charts or terminal outputs). Avoid long theoretical intros—state the high-stakes problem immediately and show the working project in the first 4 seconds.'
    };
    return JSON.stringify(responseObj);
  }

  // 9. CONTENT CALENDAR GENERATE
  if (promptStr.includes('Generate a structured list of') || promptStr.includes('calendar/generate')) {
    const responseObj = {
      calendarItems: [
        { niche: 'AI SaaS', topic: 'No-code Builders', title: 'I Built a SaaS in 5 Minutes (Step-by-Step)', suggestedDate: new Date(Date.now() + 86400000).toISOString(), status: 'planned', targetAudience: 'Beginner Developers', scriptStatus: 'draft', thumbnailConcept: 'timer badge next to logo', viralPrediction: 'High' },
        { niche: 'AI SaaS', topic: 'Database Setup', title: 'Why 99% of People Fail at Supabase Config', suggestedDate: new Date(Date.now() + 172800000).toISOString(), status: 'planned', targetAudience: 'Tech Enthusiasts', scriptStatus: 'unstarted', thumbnailConcept: 'warning sign next to logo', viralPrediction: 'Medium' }
      ]
    };
    return JSON.stringify(responseObj);
  }

  // 10. SEO FREE TOOL
  if (promptStr.includes('seo/free-tool')) {
    const responseObj = {
      keywordDifficulty: 'Low (14/100)',
      searchVolume: '45,000 monthly',
      recommendedTags: ['saas setup', 'no code build', 'creator tools'],
      optimizationTips: 'Ensure you include the keyword in the first 100 characters of your video description and outline 3 timestamps.'
    };
    return JSON.stringify(responseObj);
  }

  // DEFAULT FALLBACK JSON
  return JSON.stringify({
    success: true,
    message: 'Mock response generated successfully.',
    data: { simulated: true, timestamp: new Date().toISOString() }
  });
}
