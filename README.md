# 🚀 ViralGap AI Production Deployment & Operations Guide

### Crafted by: **Senior Deployment Engineer**

This guide provides a comprehensive production roadmap and blueprints to deploy **ViralGap AI** to **Vercel** with peak performance, advanced edge security, and third-party API integrations (Gemini, Supabase, Stripe, and YouTube).

---

## 📐 Production Architecture Blueprint

Our deployment topology is designed as a **highly-optimized Hybrid Static/Serverless architecture**:

```
                              ┌────────────────────────┐
                              │    Client (Browser)    │
                              └───────────┬────────────┘
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │      Vercel Edge Network        │
                         │   (Dynamic Routing & CDN)       │
                         └────────┬───────────────┬────────┘
                                  │               │
            Static Files (dist/)  │               │ API Requests (/api/*)
                                  ▼               ▼
                       ┌──────────────┐       ┌──────────────────────┐
                       │ Edge Assets  │       │ Serverless Node.js   │
                       │ (HTML, JS)   │       │ Function (Express)   │
                       └──────────────┘       └──────────┬───────────┘
                                                         │
                                    ┌────────────────────┼───────────────────┐
                                    ▼                    ▼                   ▼
                           ┌─────────────────┐  ┌─────────────────┐ ┌─────────────────┐
                           │   Supabase DB   │  │   Gemini AI     │ │   Stripe API    │
                           └─────────────────┘  └─────────────────┘ └─────────────────┘
```

1. **Static SPA Frontend (`/dist`)**: Served via Vercel's global Edge CDN network with maximum cache-control.
2. **Serverless API Backend (`/api/index.ts`)**: Runs on Vercel Node.js Serverless Functions, routing dynamic API endpoints directly into the Express sub-engine.
3. **Edge Security Middleware (`/middleware.ts`)**: Intercepts requests instantly at the Edge to handle bot blocking, CSRF validations, and inject custom high-protection HTTP security headers.

---

## 🛠️ One-Click Deployment Workflows

Select one of the standard workflows below to provision and deploy ViralGap AI in under 3 minutes.

### Option A: The Git Git-Ops Workflow (Recommended)
1. **Push your code** to a private or public repository on GitHub, GitLab, or Bitbucket.
2. Visit the [Vercel Dashboard](https://vercel.com/new).
3. Click **Import** next to your repository.
4. Expand the **Environment Variables** panel and add the keys listed in the **Configuration Blueprint** section.
5. Click **Deploy**. Vercel will build and host the app automatically on every subsequent git-push.

### Option B: The Vercel CLI Fast-Track Workflow
For engineers seeking instant terminal deployments, use the Vercel CLI:

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Pull settings and link project (follow prompts)
vercel link

# 4. Inject Environment Secrets directly from your terminal
vercel env add GEMINI_API_KEY "your_key_here"
vercel env add SUPABASE_URL "your_supabase_url"
vercel env add SUPABASE_ANON_KEY "your_anon_key"

# 5. Build and Deploy instantly to Production
vercel --prod
```

---

## ⚙️ Third-Party Integration Configuration Blueprint

Ensure all keys are populated inside the Vercel dashboard **before** triggering the initial production deployment.

### 🧠 1. Google Gemini AI Setup
Provides the core content gap analyzer, trend radar, video validation scoring, and copilot content generators.

1. **Obtain API Key**: Head to [Google AI Studio](https://aistudio.google.com/) and click **Get API Key**.
2. **Setup Vercel**: Create an environment variable named:
   - `GEMINI_API_KEY` (Keep hidden, Serverless-only).
3. **Optimization Tip**: Edge Caching implemented in `server.ts` automatically saves repeated keyword scans in-memory for 120 seconds, protecting Gemini token usage from excessive queries.

### ⚡ 2. Supabase Database & Auth Setup
Handles user authentication state, saved research portfolios, trend tracking alerts, and activity telemetry databases.

1. **Provision Project**: Open [Supabase](https://supabase.com/), click **New Project**, and select your region.
2. **Extract Credentials**: Go to **Project Settings -> API**.
3. **Setup Vercel**: Populate these variables:
   - `SUPABASE_URL`: `https://[your-project-id].supabase.co`
   - `SUPABASE_ANON_KEY`: `[Your JWT Anon API Key]`
4. **Database Schemas**: Table creations and queries are handled dynamically via client-side libraries. Ensure your database allows standard operations.

### 💳 3. Stripe Billing Integration Setup
Handles real-time Stripe pricing tables, customized checkout simulator flows, active portals, and customer webhook syncs.

1. **Stripe Developer Mode**: Go to [Stripe Dashboard](https://dashboard.stripe.com/), toggle **Developer Mode**.
2. **Define Pricing Tiers**: Create a Subscription Product with three pricing tiers:
   - **Creator**: Suggested $15.00/mo
   - **Pro**: Suggested $49.00/mo
   - **Agency**: Suggested $199.00/mo
3. **Webhooks Integration**:
   - Inside Stripe Dashboard -> **Webhooks**, click **Add Endpoint**.
   - Point the URL to your deployed Vercel domain: `https://your-app-domain.vercel.app/api/stripe/webhook`.
   - Select events: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`.
   - Copy the Signing Secret starting with `whsec_`.
4. **Setup Vercel**: Populate the following parameters:
   - `STRIPE_PUBLISHABLE_KEY`: `pk_test_...`
   - `STRIPE_SECRET_KEY`: `sk_test_...`
   - `STRIPE_WEBHOOK_SECRET`: `whsec_...`
   - `STRIPE_PRICE_CREATOR`: `price_...`
   - `STRIPE_PRICE_PRO`: `price_...`
   - `STRIPE_PRICE_AGENCY`: `price_...`

### 📺 4. YouTube API Integration Setup
Facilitates YouTube content searches, trend category grounding, keyword scoring, and channel metadata lookups.

1. **Enable API**: Go to the [Google Cloud Console](https://console.cloud.google.com/). Select or create a project, then search for **YouTube Data API v3** and click **Enable**.
2. **Generate API Key**: Navigate to **APIs & Services -> Credentials**. Click **Create Credentials** -> select **API Key**.
3. **Generate OAuth Client (Optional)**: If the application needs to perform writes/access private user channel statistics:
   - In Credentials, select **OAuth Client ID** -> configure the OAuth Consent Screen.
   - Add authorized Redirect URI: `https://your-app-domain.vercel.app/api/oauth/callback/youtube`.
4. **Setup Vercel**: Add these variables:
   - `YOUTUBE_API_KEY`: `[Your YouTube API Key]`
   - `YOUTUBE_CLIENT_ID`: `[Your Client ID]`
   - `YOUTUBE_CLIENT_SECRET`: `[Your Client Secret]`

---

## ⚡ Production Optimizations & Hardening

Our Vercel deployment leverages deep optimizations to ensure speed, stability, and premium defense:

### 🛡️ Edge CDN & Security Headers
Configured directly in `vercel.json` and handled natively by the platform edge nodes:
* **MIME Sniffing Defense**: `X-Content-Type-Options: nosniff` locks files from being parsed as different types.
* **Clickjacking Mitigation**: `X-Frame-Options: SAMEORIGIN` locks the interface inside the parent layout.
* **XSS Armor**: `X-XSS-Protection: 1; mode=block` instructs modern browsers to block rendering when scripting attacks are detected.
* **CDN Caching Strategy**: Asset directories under `/assets` are served with `Cache-Control: public, max-age=31536000, immutable` for immediate Edge loading, saving backend roundtrips.

### 🛡️ Edge Middleware (`middleware.ts`)
Executes inside Vercel's Edge runtime (V8 engine) before reaching the serverless function.
1. **Malicious Crawler Blockers**: Suspicious automation clients (such as Curl, Python, Selenium, Headless, Wget, Scrapy) trying to scrape or spam heavy analytical API endpoints are rejected immediately at the gateway with a `403 Forbidden` response.
2. **CSRF Cross-Origin Blocking**: Any dynamic state-changing `POST` API request with a spoofed or external cross-origin origin header is automatically intercepted and dropped before spawning any backend processing.

### 🪵 Live DevOps Console Integration
Our React frontend includes a built-in **DevOps & Telemetry Dashboard** accessible right from the UI sidebar:
* Track real-time **Cache Hit Rates** (Edge vs Cold Gemini calls).
* Monitor CPU Heap memory consumption.
* Analyze system logs, security rate limits, and bot blocking events.
* Run automated event simulations to test telemetry integrity.

---

## ⚙️ Local Development & Pre-Production Testing

To run the application locally on your workstation:

```bash
# 1. Clone repository & install dependencies
npm install

# 2. Configure Local Environment Variables
cp .env.example .env
# Open .env and add your development API keys and Supabase credentials

# 3. Start high-responsiveness Development Server
npm run dev
# The application binds automatically to host 0.0.0.0 and Port 3000

# 4. Run TypeScript Compilation Checks
npm run lint
```

---

## 📌 Troubleshooting Production Deployments

| Symptom | Root Cause | Immediate Resolution |
| :--- | :--- | :--- |
| **404 Page Not Found on browser refresh** | SPA Routing mismatch on client-side paths (e.g. `/content-gap`). | Ensure the `vercel.json` contains the configured rewrite rule redirecting all non-file URLs to `/index.html`. |
| **"Please wait while your application starts..." stays indefinitely** | Missing environment variables or API key validation crash on startup. | Our codebase utilizes lazy initialization for SDK clients. Ensure all credentials inside `vercel.json` or Vercel Settings are correctly capitalized without quotes or whitespace. |
| **Stripe Webhook fails with 400 Bad Request** | Missing or incorrect Webhook Secret or modified raw-body parsing. | Verify that the `STRIPE_WEBHOOK_SECRET` matches your Stripe dashboard exactly. Our Express server handles raw request buffering specifically for `/api/stripe/webhook` automatically. |
| **Vercel Build Error during `tsc --noEmit`** | Strict TypeScript discrepancies. | Ensure all local files conform to typescript typing. Run `npm run lint` locally to debug compile-time errors prior to pushing to Vercel. |
