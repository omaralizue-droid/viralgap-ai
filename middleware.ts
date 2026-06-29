import { next } from '@vercel/edge';

// Edge Security Bot Detection list
const BLOCKED_BOTS = [
  'curl',
  'python',
  'wget',
  'scrapy',
  'headless',
  'selenium',
  'puppeteer',
  'shodan',
  'censys'
];

export function middleware(request: Request) {
  const url = new URL(request.url);
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  
  // 1. Bot Protection on API endpoints
  if (url.pathname.startsWith('/api')) {
    const isBot = BLOCKED_BOTS.some(bot => userAgent.includes(bot));
    // Exclude legitimate crawlers or dev tools if necessary, but block malicious scrapers
    if (isBot && !userAgent.includes('googlebot') && !userAgent.includes('bingbot')) {
      return new Response(
        JSON.stringify({ 
          error: 'Access denied. Automated crawlers are blocked at the CDN edge by ViralGap Shield.',
          code: 'EDGE_BOT_BLOCKED'
        }), 
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'X-ViralGap-Shield': 'BLOCKED_BOT'
          }
        }
      );
    }
  }

  // 2. CSRF Mitigation: Block unsafe cross-origin post requests
  if (request.method === 'POST' && url.pathname.startsWith('/api') && url.pathname !== '/api/stripe/webhook') {
    const origin = request.headers.get('origin') || '';
    const host = request.headers.get('host') || '';
    if (origin && !url.href.startsWith(origin) && !origin.includes(host)) {
      return new Response(
        JSON.stringify({ 
          error: 'Access denied. Security CSRF validation failed at Edge.',
          code: 'EDGE_CSRF_BLOCKED'
        }), 
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'X-ViralGap-Shield': 'BLOCKED_CSRF'
          }
        }
      );
    }
  }

  // 3. Performance & Route Optimization
  // Append response and set secure, high-protection headers
  const response = next();
  
  // Strict Security Headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // Prevent Clickjacking
  response.headers.set('X-Content-Type-Options', 'nosniff'); // Prevent MIME Sniffing
  response.headers.set('X-XSS-Protection', '1; mode=block'); // Prevent XSS execution
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); // Secure Referrer info
  response.headers.set('X-ViralGap-Shield', 'ACTIVE'); // Flag edge protection state

  // Cache-Control headers for static assets
  if (url.pathname.startsWith('/assets') || url.pathname.includes('.')) {
    // Cache static assets at edge for up to 1 year
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (url.pathname.startsWith('/api')) {
    // API responses should not be cached by default at browser level
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  }

  return response;
}

// Config matcher to run middleware on all relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
