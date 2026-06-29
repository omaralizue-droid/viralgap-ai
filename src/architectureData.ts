export interface SchemaTable {
  name: string;
  purpose: string;
  fields: {
    name: string;
    type: string;
    constraints: string;
    description: string;
  }[];
  indexes: string[];
  relationships: string[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestFormat: string;
  responseFormat: string;
  validationRules: string[];
  errorHandling: string;
}

export const SYSTEM_ARCHITECTURE = {
  overview: "ViralGap AI is structured as an enterprise-grade AI SaaS that processes multi-modal creator data. It leverages a serverless next-generation stack with Next.js 15, Supabase, and Google Gemini to minimize infrastructure overhead while delivering real-time predictive insights to YouTube creators.",
  frontend: {
    title: "Frontend Architecture (SPA / Hybrid)",
    description: "Built using React 19, Tailwind CSS, and Lucide Icons. Designed for ultra-fast, client-side execution within a single-page view structure. State is preserved with client-side context models, and interactive dashboard UI elements adapt dynamically to mobile & desktop viewports.",
    details: [
      "Client-Side State Management: Standardized React context engines controlling analysis telemetry, script generation outputs, and prompt builders.",
      "Visual Strategy: Slate-themed modern developer UI utilizing Inter for UI elements and JetBrains Mono for system feeds and API telemetry.",
      "Responsive Fluidity: Bound container layouts (max-w-7xl) combined with touch-safe tap targets (44px) for optimized mobile control panels."
    ]
  },
  backend: {
    title: "Backend API Router & Middleware Node",
    description: "An Express-based full-stack engine designed to execute compute-intensive workloads, proxy third-party SDK calls securely, and prevent API key leakage.",
    details: [
      "Proxy Routing Layer: Keeps sensitive secrets (such as GEMINI_API_KEY) hidden completely behind custom secure /api/ express endpoints.",
      "Vite Dev Middleware Integration: Runs on Port 3000, hot-swapping static bundles in production and serving dynamic vite compilation in development.",
      "Rate Limiting: Express-rate-limit node protection configured per IP address to safeguard against credential abuse and bot traffic."
    ]
  },
  database: {
    title: "Supabase & PostgreSQL Integration",
    description: "Data layer utilizing Supabase PostgreSQL with built-in Row Level Security (RLS) for absolute workspace isolation.",
    details: [
      "Row Level Security (RLS): Strictly isolates client data. Users can only query rows explicitly linked to their auth.uid().",
      "Durable Persistence: Structured tracking of daily/monthly usage counts, credits consumption, and long-term saved generator outputs.",
      "Optimized Indexing: Composite indexes built on high-frequency lookups (user_id, project_id, active status) to ensure millisecond queries."
    ]
  }
};

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: "users",
    purpose: "Extends Supabase Auth metadata and contains custom system-level controls.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY, REFERENCES auth.users(id)", description: "Unique identifier mapped to Supabase auth system." },
      { name: "email", type: "varchar(255)", constraints: "UNIQUE, NOT NULL", description: "User's email address cached for transactional alerts." },
      { name: "role", type: "varchar(50)", constraints: "DEFAULT 'creator'", description: "System role for global access: 'creator', 'pro', 'agency', or 'admin'." },
      { name: "created_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "Creation date timestamp." }
    ],
    indexes: ["CREATE UNIQUE INDEX idx_users_email ON users(email);"],
    relationships: ["auth.users.id -> users.id (1:1 relationship)"]
  },
  {
    name: "profiles",
    purpose: "Stores creator-specific profile data, YouTube Channel integrations, and personalized preferences.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY, REFERENCES users(id) ON DELETE CASCADE", description: "Direct linkage to user authentication record." },
      { name: "channel_id", type: "varchar(255)", constraints: "NULL", description: "Primary connected YouTube Channel ID." },
      { name: "channel_title", type: "varchar(255)", constraints: "NULL", description: "Connected channel display title." },
      { name: "avatar_url", type: "text", constraints: "NULL", description: "Cached profile picture of the creator." },
      { name: "preferences", type: "jsonb", constraints: "DEFAULT '{}'::jsonb", description: "JSON block for default target audience, language, and script tone options." },
      { name: "updated_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "System update indicator timestamp." }
    ],
    indexes: ["CREATE INDEX idx_profiles_channel_id ON profiles(channel_id);"],
    relationships: ["users.id -> profiles.id (1:1 relationship)"]
  },
  {
    name: "subscriptions",
    purpose: "Handles active recurring plans, billing cycles, and payment gateways mapping.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Primary key identifier." },
      { name: "user_id", type: "uuid", constraints: "REFERENCES users(id) ON DELETE CASCADE, NOT NULL", description: "Linked client account." },
      { name: "status", type: "varchar(50)", constraints: "NOT NULL", description: "Active subscription state: 'active', 'trialing', 'canceled', 'past_due'." },
      { name: "plan_tier", type: "varchar(50)", constraints: "NOT NULL", description: "Subscription tier: 'free', 'creator', 'pro', 'agency'." },
      { name: "stripe_subscription_id", type: "varchar(255)", constraints: "UNIQUE", description: "Stripe recurring index string." },
      { name: "stripe_customer_id", type: "varchar(255)", constraints: "NOT NULL", description: "Stripe customer reference." },
      { name: "current_period_start", type: "timestamp with time zone", constraints: "NOT NULL", description: "Current billing period start." },
      { name: "current_period_end", type: "timestamp with time zone", constraints: "NOT NULL", description: "Active billing interval expiration." }
    ],
    indexes: [
      "CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);",
      "CREATE INDEX idx_subscriptions_status_tier ON subscriptions(status, plan_tier);"
    ],
    relationships: ["users.id -> subscriptions.user_id (1:Many relationship)"]
  },
  {
    name: "usage_tracking",
    purpose: "Maintains real-time logs of available quota, credits consumption, and request volume for anti-abuse boundaries.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique tracker identity." },
      { name: "user_id", type: "uuid", constraints: "REFERENCES users(id) ON DELETE CASCADE, NOT NULL", description: "Associated account holder identifier." },
      { name: "billing_period_start", type: "timestamp with time zone", constraints: "NOT NULL", description: "Beginning date matching subscription interval." },
      { name: "credits_total", type: "integer", constraints: "NOT NULL", description: "Total quota assigned for this period (e.g. 500)." },
      { name: "credits_used", type: "integer", constraints: "DEFAULT 0, NOT NULL", description: "Total consumed credits." },
      { name: "daily_requests_count", type: "integer", constraints: "DEFAULT 0", description: "Requests performed today (resets daily via cron)." },
      { name: "last_request_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "Timestamp representing previous system usage." }
    ],
    indexes: [
      "CREATE INDEX idx_usage_user_period ON usage_tracking(user_id, billing_period_start);"
    ],
    relationships: ["users.id -> usage_tracking.user_id (1:Many relationship)"]
  },
  {
    name: "projects",
    purpose: "Acts as a workspace folder system grouping multiple analyses, script outputs, and trend research parameters.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique project workspace identifier." },
      { name: "user_id", type: "uuid", constraints: "REFERENCES users(id) ON DELETE CASCADE, NOT NULL", description: "Workspace owner account." },
      { name: "title", type: "varchar(255)", constraints: "NOT NULL", description: "Name of the workspace or content channel focus." },
      { name: "niche", type: "varchar(100)", constraints: "NULL", description: "Target vertical (e.g. 'SaaS Dev', 'Tech Review')." },
      { name: "created_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "Workspace creation record." }
    ],
    indexes: ["CREATE INDEX idx_projects_user_id ON projects(user_id);"],
    relationships: ["users.id -> projects.user_id (1:Many relationship)"]
  },
  {
    name: "video_analyses",
    purpose: "Holds parsing results from parsed YouTube URLs, video metrics, transcripts, and Gemini content gap breakdowns.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Analysis unique ID." },
      { name: "project_id", type: "uuid", constraints: "REFERENCES projects(id) ON DELETE CASCADE, NOT NULL", description: "Parent project folder mapping." },
      { name: "video_url", type: "varchar(512)", constraints: "NOT NULL", description: "Inspected video URL link." },
      { name: "title", type: "varchar(255)", constraints: "NOT NULL", description: "Fetched YouTube video title." },
      { name: "views", type: "bigint", constraints: "DEFAULT 0", description: "Cached YouTube view count." },
      { name: "engagement_metrics", type: "jsonb", constraints: "DEFAULT '{}'::jsonb", description: "Like count, comment count, and custom performance metrics." },
      { name: "gemini_analysis", type: "jsonb", constraints: "NOT NULL", description: "Gemini-generated structural analysis, hooks strategy, and content gap findings." },
      { name: "created_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "DateTime analyzed." }
    ],
    indexes: [
      "CREATE INDEX idx_analyses_project_id ON video_analyses(project_id);",
      "CREATE INDEX idx_analyses_created ON video_analyses(created_at DESC);"
    ],
    relationships: ["projects.id -> video_analyses.project_id (1:Many relationship)"]
  },
  {
    name: "content_opportunities",
    purpose: "Stores automatically identified channel video gaps and low-competition search keyword insights.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Opportunity ID." },
      { name: "project_id", type: "uuid", constraints: "REFERENCES projects(id) ON DELETE CASCADE, NOT NULL", description: "Linked project workspace." },
      { name: "keyword_phrase", type: "varchar(255)", constraints: "NOT NULL", description: "Target search intent phrase." },
      { name: "search_volume_score", type: "integer", constraints: "DEFAULT 50", description: "Estimated interest score index." },
      { name: "competition_score", type: "integer", constraints: "DEFAULT 50", description: "Difficulty metric rating (0-100)." },
      { name: "gap_opportunity_ratio", type: "numeric(5,2)", constraints: "NOT NULL", description: "Calculated opportunity quotient." },
      { name: "suggested_angles", type: "jsonb", constraints: "DEFAULT '[]'::jsonb", description: "Suggested storytelling directions from Gemini." },
      { name: "created_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "Creation date." }
    ],
    indexes: [
      "CREATE INDEX idx_opportunities_project ON content_opportunities(project_id);",
      "CREATE INDEX idx_opportunities_ratio ON content_opportunities(gap_opportunity_ratio DESC);"
    ],
    relationships: ["projects.id -> content_opportunities.project_id (1:Many relationship)"]
  },
  {
    name: "generated_scripts",
    purpose: "Saves video script iterations, custom structures, visual directions, and audio cues built by the script generator.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Script record ID." },
      { name: "project_id", type: "uuid", constraints: "REFERENCES projects(id) ON DELETE CASCADE, NOT NULL", description: "Project workspace context." },
      { name: "title", type: "varchar(255)", constraints: "NOT NULL", description: "Target video conceptual title." },
      { name: "script_sections", type: "jsonb", constraints: "NOT NULL", description: "Structured JSON containing array of script lines, scene directions, and pacing instructions." },
      { name: "video_duration_est", type: "integer", constraints: "NOT NULL", description: "Estimated length of video in seconds." },
      { name: "voice_tone", type: "varchar(100)", constraints: "DEFAULT 'educational'", description: "Style preset: 'hype', 'casual', 'docu-style'." },
      { name: "created_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "Script creation log." }
    ],
    indexes: ["CREATE INDEX idx_scripts_project ON generated_scripts(project_id);"],
    relationships: ["projects.id -> generated_scripts.project_id (1:Many relationship)"]
  },
  {
    name: "saved_prompts",
    purpose: "Keeps AI image generator prompts crafted for video thumbnails and visual assets.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Saved prompt ID." },
      { name: "project_id", type: "uuid", constraints: "REFERENCES projects(id) ON DELETE CASCADE, NOT NULL", description: "Workspace container ID." },
      { name: "raw_idea", type: "text", constraints: "NOT NULL", description: "Initial video concept or hook keyword." },
      { name: "imagen_prompt", type: "text", constraints: "NOT NULL", description: "Optimized multi-modal prompt formatted for hyper-realistic thumbnail assets." },
      { name: "style_preset", type: "varchar(100)", constraints: "DEFAULT '3D Render'", description: "Chosen aesthetic preset." },
      { name: "created_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "Timestamp of creation." }
    ],
    indexes: ["CREATE INDEX idx_prompts_project ON saved_prompts(project_id);"],
    relationships: ["projects.id -> saved_prompts.project_id (1:Many relationship)"]
  },
  {
    name: "trend_reports",
    purpose: "Holds regional YouTube trend updates, category radar metrics, and rising search breakouts.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Trend report record ID." },
      { name: "category", type: "varchar(100)", constraints: "NOT NULL", description: "Target category focus (e.g. 'Gaming', 'Finance')." },
      { name: "rising_keywords", type: "jsonb", constraints: "NOT NULL", description: "Array of search queries spiking in the last 48 hours." },
      { name: "viral_templates", type: "jsonb", constraints: "DEFAULT '[]'::jsonb", description: "Common title/thumbnail frameworks used." },
      { name: "updated_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "Last refreshed timestamp." }
    ],
    indexes: ["CREATE INDEX idx_trends_category ON trend_reports(category);"],
    relationships: ["None (Global category lookup context)"]
  },
  {
    name: "api_logs",
    purpose: "Monitors internal API call performance, external HTTP latencies, credit logs, and exceptions.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Primary audit key." },
      { name: "user_id", type: "uuid", constraints: "REFERENCES users(id) ON DELETE SET NULL", description: "Involved user index if authenticated." },
      { name: "endpoint", type: "varchar(255)", constraints: "NOT NULL", description: "Called API endpoint (e.g. '/api/content-gap')." },
      { name: "latency_ms", type: "integer", constraints: "NOT NULL", description: "Roundtrip duration tracked in milliseconds." },
      { name: "status_code", type: "integer", constraints: "NOT NULL", description: "Returned HTTP status." },
      { name: "error_message", type: "text", constraints: "NULL", description: "Exception details if process crashed." },
      { name: "created_at", type: "timestamp with time zone", constraints: "DEFAULT now()", description: "Log timestamp." }
    ],
    indexes: [
      "CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);",
      "CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);"
    ],
    relationships: ["users.id -> api_logs.user_id (1:Many relationship)"]
  }
];

export const RLS_POLICIES = [
  {
    table: "users",
    policyName: "Enable read access to own user profile",
    definition: "CREATE POLICY \"Enable read access for own user\" ON users FOR SELECT USING (auth.uid() = id);"
  },
  {
    table: "users",
    policyName: "Admins can inspect all users",
    definition: "CREATE POLICY \"Admins select all users\" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));"
  },
  {
    table: "profiles",
    policyName: "Users can select their own profile details",
    definition: "CREATE POLICY \"Select own profile\" ON profiles FOR SELECT USING (auth.uid() = id);"
  },
  {
    table: "profiles",
    policyName: "Users can update their own profile details",
    definition: "CREATE POLICY \"Update own profile\" ON profiles FOR UPDATE USING (auth.uid() = id);"
  },
  {
    table: "subscriptions",
    policyName: "Select own subscriptions",
    definition: "CREATE POLICY \"Select own subscription\" ON subscriptions FOR SELECT USING (auth.uid() = user_id);"
  },
  {
    table: "projects",
    policyName: "All operations bound to owner",
    definition: "CREATE POLICY \"Project owner isolation\" ON projects FOR ALL USING (auth.uid() = user_id);"
  },
  {
    table: "video_analyses",
    policyName: "Analyses accessible only if owner has parent project",
    definition: "CREATE POLICY \"Video analysis owner isolation\" ON video_analyses FOR ALL USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = video_analyses.project_id AND projects.user_id = auth.uid()));"
  },
  {
    table: "generated_scripts",
    policyName: "Script operations bound to owner projects",
    definition: "CREATE POLICY \"Generated scripts owner isolation\" ON generated_scripts FOR ALL USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = generated_scripts.project_id AND projects.user_id = auth.uid()));"
  }
];

export const SUBSCRIPTION_LOGIC = {
  tiers: [
    {
      name: "Free Plan",
      monthlyCredits: "50 Credits",
      cost: "$0 / month",
      features: [
        "Basic keyword suggestions",
        "1 Video analysis per day",
        "AI Prompts standard speed",
        "No historical save database"
      ],
      limits: "5 analyses/month, standard model response times."
    },
    {
      name: "Creator Plan",
      monthlyCredits: "500 Credits",
      cost: "$19 / month",
      features: [
        "Full Content Gap Analyzer access",
        "Unlimited search queries",
        "20 video analyses per month",
        "Script generator v1",
        "Saves outputs in Projects"
      ],
      limits: "20 analyses/month, custom writing tone options."
    },
    {
      name: "Pro Plan",
      monthlyCredits: "2,000 Credits",
      cost: "$49 / month",
      features: [
        "All Creator capabilities",
        "Unlimited URL Analyses",
        "Trend radar hourly tracker",
        "Imagen-based thumbnail prompt optimizer",
        "Multi-agent content planner integration"
      ],
      limits: "Unlimited standard queries, high priority server access."
    },
    {
      name: "Agency Plan",
      monthlyCredits: "10,000 Credits",
      cost: "$149 / month",
      features: [
        "All Pro capabilities",
        "Multi-channel profiles (up to 5 channels)",
        "Team collaborative workspaces",
        "Dedicated analytics logs",
        "Whitelabel export options"
      ],
      limits: "10k credits, team access, priority custom support."
    }
  ],
  accessControlLogic: `
-- PostgreSQL DB function to check active quota constraints
CREATE OR REPLACE FUNCTION verify_user_quota(p_user_id UUID, p_credits_required INT)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_used INT;
  v_current_total INT;
  v_role VARCHAR;
BEGIN
  -- 1. Resolve role
  SELECT role INTO v_role FROM users WHERE id = p_user_id;
  
  -- Admins bypass quota completely
  IF v_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- 2. Query usage details
  SELECT credits_used, credits_total INTO v_current_used, v_current_total
  FROM usage_tracking
  WHERE user_id = p_user_id AND billing_period_start <= now()
  ORDER BY billing_period_start DESC
  LIMIT 1;

  -- 3. Validate
  IF v_current_used + p_credits_required <= v_current_total THEN
    -- Quota sufficient, update in-flight consumed credits
    UPDATE usage_tracking
    SET credits_used = credits_used + p_credits_required,
        last_request_at = now()
    WHERE user_id = p_user_id AND billing_period_start <= now();
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `
};

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "POST",
    path: "/api/content-gap",
    description: "Analyzes high-volume creator niches and outputs discovered video topic gaps using Gemini algorithms.",
    requestFormat: `{
  "projectId": "uuid-workspace-id",
  "niche": "Software Engineering",
  "keywords": ["react tutorials", "next.js", "docker basics"]
}`,
    responseFormat: `{
  "success": true,
  "niche": "Software Engineering",
  "gapsDiscovered": [
    {
      "title": "React 19 Server Components for Absolute Beginners",
      "gapScore": 9.2,
      "estimatedVolume": "High",
      "reasoning": "High current search spikes for React 19 but lack of comprehensive starter videos focusing strictly on Server Components in node environments."
    }
  ]
}`,
    validationRules: [
      "projectId must be a valid UUID present in owner's projects workspace.",
      "niche must be a non-empty string under 100 characters.",
      "keywords must be an array of strings (1-10 keywords)."
    ],
    errorHandling: "Returns 401 Unauthorized if workspace validation fails, 403 Forbidden if quota credits are exhausted, or 500 Internal Error on LLM parsing fault."
  },
  {
    method: "POST",
    path: "/api/url-analysis",
    description: "Accepts a viral YouTube video URL, parses high-engagement comment signals and structure, and returns viral indicators.",
    requestFormat: `{
  "projectId": "uuid-workspace-id",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}`,
    responseFormat: `{
  "success": true,
  "videoMetadata": {
    "title": "Ultimate Next.js Enterprise boilerplate tour",
    "views": 450000,
    "channel": "TechArchitectureLabs"
  },
  "viralHookPattern": "The 'I built this in 48 hours' narrative framework that maximizes viewer retention.",
  "engagementSignals": {
    "primaryPainPoints": [
      "Handling nested layout route hydration issues",
      "Deploying migrations safely on isolated production databases"
    ]
  }
}`,
    validationRules: [
      "videoUrl must be a syntactically correct YouTube URL link.",
      "Requires 5 credits to execute this analysis."
    ],
    errorHandling: "Returns 400 Bad Request if URL layout is invalid or video has transcripts disabled. Returns 403 on credit limits exceed."
  },
  {
    method: "POST",
    path: "/api/script-generator",
    description: "Generates high-retention video script structures, hook templates, scene pacing indicators, and structural visual directions.",
    requestFormat: `{
  "projectId": "uuid-workspace-id",
  "targetTitle": "React 19 Server Components for Beginners",
  "durationSeconds": 600,
  "voiceTone": "educational"
}`,
    responseFormat: `{
  "success": true,
  "estimatedDuration": 600,
  "sections": [
    {
      "timeframe": "0:00 - 0:45",
      "segment": "Visual Hook",
      "scriptText": "Most tutorials show you React 19... but they forget the node backend. Today, we change that.",
      "sceneDirection": "Close-up zoom on code terminal showing Vite startup, high energy background ambient track fades in.",
      "pacing": "Fast, high-retention cuts"
    }
  ]
}`,
    validationRules: [
      "targetTitle must be a non-empty string.",
      "durationSeconds must be between 60 and 3600.",
      "voiceTone must match predefined presets ('educational', 'hype', 'casual')."
    ],
    errorHandling: "Returns 422 Unprocessable Entity if parameters are invalid. Returns 403 if credits check fails."
  }
];

export const SCALABILITY_AND_COSTS = {
  scalingStages: [
    {
      scale: "100 Active Users",
      dbTech: "Single PostgreSQL Node (Supabase Free/Micro tier). No specialized connection pools needed.",
      queryHandling: "Direct relational SELECT and standard indexing. Schema remains entirely vanilla.",
      cacheTier: "In-memory local variables or simple node memory cache.",
      apiCosts: "Minimal Gemini API fees ($10 - $50/month) based on raw creator request frequency."
    },
    {
      scale: "1,000 Active Users",
      dbTech: "Database Poolers (Supabase PgBouncer / Supabase Supavisor) enabled for handling active concurrent connections.",
      queryHandling: "Index optimizations on compound keys like (user_id, created_at DESC).",
      cacheTier: "Standard PostgreSQL Materialized Views for Trends reports, refreshed twice daily via pg_cron.",
      apiCosts: "$200 - $600/month. Introduce dynamic request limits and LLM prompt temperature throttling."
    },
    {
      scale: "10,000 Active Users",
      dbTech: "Dedicated database instances with read-replicas. Scale up compute to handle high throughput.",
      queryHandling: "Introduction of database partition tables on usage_tracking (partitioned by month).",
      cacheTier: "Upstream Redis layer caching YouTube Data API metadata to minimize expensive external API quotas.",
      apiCosts: "$2,000 - $5,000/month. Migrate to Gemini 1.5 Flash for routine tasks and Gemini 1.5 Pro solely for scripts."
    },
    {
      scale: "100,000+ Active Users",
      dbTech: "Distributed multi-region database replication with write-path connection balancing.",
      queryHandling: "Archival policies offloading historic logs (api_logs) older than 30 days to cold block storage (Supabase Bucket).",
      cacheTier: "Edge CDN caching for global trends reports and common viral template queries.",
      apiCosts: "Enterprise custom pricing tier with Google Cloud. Self-hosted caching and local semantic search deduplication vectors."
    }
  ],
  costReductionStrategies: [
    {
      strategy: "Gemini Prompt Engineering & Response Formats",
      details: "Use system instructions with strictly defined JSON structures to avoid model conversational filler. Use Gemini 1.5 Flash for 90% of processing (analysis, keywords, prompts) and only upgrade to Gemini 1.5 Pro for full length script generations."
    },
    {
      strategy: "YouTube Data API Quota Safeguarding",
      details: "Cache viral video metrics, views, and comments in the video_analyses table. If another user inspects the exact same video URL within 48 hours, serve the results directly from the cache rather than spending external YouTube API quotas (which is highly restricted)."
    },
    {
      strategy: "Semantic Deduplication Caching",
      details: "Store vector embeddings of analyzed topics. If a user asks for 'React server actions gap' and another asked for the same concept 10 minutes ago, fetch the cached content gap result directly."
    }
  ]
};

export const ENTERPRISE_FOLDER_STRUCTURE = `
viralgap-ai-enterprise/
├── .env.example                # Example global application environmental vars
├── .gitignore                  # Git tracking exclusion specifications
├── package.json                # Project dependencies and deployment scripts
├── tsconfig.json               # TypeScript path resolution configurations
├── tailwind.config.js          # Styling themes and layout parameters
│
├── src/
│   ├── main.tsx                # Client-side SPA index node
│   ├── App.tsx                 # Core Layout UI, visual workspace
│   ├── index.css               # Global CSS tailwind configurations
│   │
│   ├── components/             # Reusable UI component modules
│   │   ├── common/             # Pure visual layout cards, buttons, status indicators
│   │   │   ├── Button.tsx
│   │   │   └── CodeBlock.tsx   # Elegant syntax visualizer
│   │   ├── dashboard/          # Feature specific dashboard blocks
│   │   │   ├── SchemaViewer.tsx
│   │   │   ├── ApiSpecs.tsx
│   │   │   ├── QuotaMatrix.tsx
│   │   │   └── ScalabilityRoadmap.tsx
│   │   └── icons/              # Styled svg path containers
│   │
│   ├── data/                   # Structured blueprint assets
│   │   └── architectureData.ts # System design definitions, schemas, and endpoints
│   │
│   ├── db/                     # Relational definitions and setup blueprints
│   │   ├── schema.sql          # Complete DDL execution script
│   │   └── rls-policies.sql    # Security isolation commands
│   │
│   └── utils/                  # Core development helpers
│       ├── clipboard.ts        # Fast copy utility wrappers
│       └── formatters.ts       # Byte, JSON, and timestamp text formatters
`;
