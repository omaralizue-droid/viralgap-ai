import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage: string;
  toolName: string;
}

export const SEO_DATA: Record<string, SEOMetadata> = {
  home: {
    title: 'ViralGap AI - All-In-One YouTube SEO, Content Gap & Retention Suite',
    description: 'Deconstruct the YouTube algorithm. Dominate your niche with our automated content gap analyzer, competitor keyword alerts, live trend radar, high-retention script architect, and CTR predictors.',
    keywords: ['YouTube SEO', 'Content Gap Finder', 'YouTube Keyword Research', 'Creator Copilot', 'YouTube Algorithm', 'Viral Analytics'],
    canonical: 'https://viralgap.ai/',
    ogImage: 'https://viralgap.ai/assets/seo/homepage.png',
    toolName: 'ViralGap Workspace'
  },
  'youtube-idea-generator': {
    title: 'AI YouTube Idea Generator - Infinite Viral Video Ideas & Angles',
    description: 'Supercharge your YouTube channel with our free AI YouTube Idea Generator. Uncover high-retention video concepts, structured content hooks, and psychological angles designed to trigger algorithm recommendation feeds.',
    keywords: ['YouTube Idea Generator', 'Video Ideas AI', 'YouTube Content Creator', 'Viral Concept Generator', 'Creative Hooks'],
    canonical: 'https://viralgap.ai/tools/youtube-idea-generator',
    ogImage: 'https://viralgap.ai/assets/seo/youtube-idea-generator.png',
    toolName: 'YouTube Idea Generator'
  },
  'content-gap-finder': {
    title: 'YouTube Content Gap Finder - Uncover High-Demand Unexplored Topics',
    description: 'Find high-traffic, low-competition content gaps in your YouTube niche. Scan search trends, competitor weaknesses, and viewer feedback to build a content strategy that guarantees organic search dominance.',
    keywords: ['Content Gap Finder', 'YouTube Niche Analysis', 'Low Competition Keywords', 'Search Demand tool', 'Competitor Gap Finder'],
    canonical: 'https://viralgap.ai/tools/content-gap-finder',
    ogImage: 'https://viralgap.ai/assets/seo/content-gap-finder.png',
    toolName: 'Content Gap Finder'
  },
  'viral-video-analyzer': {
    title: 'Viral Video Analyzer & Optimizer - Predict Retention & Click-Through-Rate',
    description: 'Deconstruct high-performing YouTube videos. Analyze pacing, hook structures, visual pattern interrupts, and audience retention curves to clone success on your own channel.',
    keywords: ['Viral Video Analyzer', 'YouTube Retention tool', 'Audience Retention AI', 'Video Pacing Analysis', 'CTR Optimizer'],
    canonical: 'https://viralgap.ai/tools/viral-video-analyzer',
    ogImage: 'https://viralgap.ai/assets/seo/viral-video-analyzer.png',
    toolName: 'Viral Video Analyzer'
  },
  'thumbnail-generator': {
    title: 'AI YouTube Thumbnail Concept Architect - Maximize Impression CTR',
    description: 'Build high-CTR thumbnail blueprints. Plan text overlays, visual composition grids, emotional color theories, and psychological curiosity loops that double your click-through rates.',
    keywords: ['YouTube Thumbnail Generator', 'AI Thumbnail Concepts', 'CTR Thumbnail Blueprint', 'Visual Composition AI', 'YouTube Design Matrix'],
    canonical: 'https://viralgap.ai/tools/thumbnail-generator',
    ogImage: 'https://viralgap.ai/assets/seo/thumbnail-generator.png',
    toolName: 'Thumbnail Concept Architect'
  },
  'hook-generator': {
    title: 'AI YouTube Hook Generator - Explode First 5-Second Retention Rates',
    description: 'Stop the scroll and retain viewers. Generate professional opening hooks using visual, auditory, and cognitive open loops tailored to lock down audience retention from the first frames.',
    keywords: ['YouTube Hook Generator', 'Audience Retention Hooks', 'Intro Scripts AI', 'Open Loops Generator', 'Scroll Stopper Hooks'],
    canonical: 'https://viralgap.ai/tools/hook-generator',
    ogImage: 'https://viralgap.ai/assets/seo/hook-generator.png',
    toolName: 'Retention Hook Generator'
  },
  'script-generator': {
    title: 'AI YouTube Script Generator - Write High-Retention Video Script Blueprints',
    description: 'Structure engaging scripts optimized for YouTube recommendation loops. Generate intro hooks, content sections, pattern interrupts, and highly contextual conversion triggers.',
    keywords: ['YouTube Script Generator', 'AI Video Scriptwriting', 'High Retention Scripts', 'Pattern Interrupts Creator', 'YouTube Script Blueprint'],
    canonical: 'https://viralgap.ai/tools/script-generator',
    ogImage: 'https://viralgap.ai/assets/seo/script-generator.png',
    toolName: 'Video Script Architect'
  }
};

export function injectSEO(reqPath: string, html: string): string {
  // Normalize path
  const cleanPath = reqPath.replace(/\/$/, '').toLowerCase();
  let meta = SEO_DATA.home;

  if (cleanPath.includes('/tools/youtube-idea-generator')) {
    meta = SEO_DATA['youtube-idea-generator'];
  } else if (cleanPath.includes('/tools/content-gap-finder')) {
    meta = SEO_DATA['content-gap-finder'];
  } else if (cleanPath.includes('/tools/viral-video-analyzer')) {
    meta = SEO_DATA['viral-video-analyzer'];
  } else if (cleanPath.includes('/tools/thumbnail-generator')) {
    meta = SEO_DATA['thumbnail-generator'];
  } else if (cleanPath.includes('/tools/hook-generator')) {
    meta = SEO_DATA['hook-generator'];
  } else if (cleanPath.includes('/tools/script-generator')) {
    meta = SEO_DATA['script-generator'];
  }

  // Generate dynamic JSON-LD
  const schemas: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://viralgap.ai/#organization',
      'name': 'ViralGap AI',
      'url': 'https://viralgap.ai',
      'logo': 'https://viralgap.ai/assets/logo.png',
      'sameAs': [
        'https://twitter.com/viralgap_ai',
        'https://youtube.com/@viralgap_ai'
      ],
      'description': 'The elite enterprise-grade productivity suite for professional YouTube creators, video strategists, and marketing teams.'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://viralgap.ai/#website',
      'name': 'ViralGap AI',
      'url': 'https://viralgap.ai',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://viralgap.ai/?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  // Breadcrumbs schema for sub-pages
  if (meta !== SEO_DATA.home) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${meta.canonical}/#breadcrumbs`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://viralgap.ai/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Tools',
          'item': 'https://viralgap.ai/tools/'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': meta.toolName,
          'item': meta.canonical
        }
      ]
    });

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${meta.canonical}/#software`,
      'name': meta.toolName,
      'operatingSystem': 'All',
      'applicationCategory': 'BusinessApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '247'
      }
    });
  }

  // Construct dynamic tag block
  const seoBlock = `
    <!-- Technical SEO Meta Tags (Dynamically Injected at Vercel Edge) -->
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta name="keywords" content="${meta.keywords.join(', ')}" />
    <link rel="canonical" href="${meta.canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

    <!-- Open Graph (OG) Tags -->
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="${meta === SEO_DATA.home ? 'website' : 'article'}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:url" content="${meta.canonical}" />
    <meta property="og:site_name" content="ViralGap AI" />
    <meta property="og:image" content="${meta.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />

    <!-- Twitter Cards Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@viralgap_ai" />
    <meta name="twitter:creator" content="@viralgap_ai" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.ogImage}" />

    <!-- JSON-LD Structured Data Schema -->
    ${schemas.map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join('\n')}
  `;

  // Strip existing tags from default index.html to avoid duplicates
  let processedHtml = html;
  
  // Replace default title and description
  processedHtml = processedHtml.replace(/<title>[^<]*<\/title>/i, '');
  processedHtml = processedHtml.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, '');
  
  // Inject into the <head> block
  processedHtml = processedHtml.replace('</head>', `${seoBlock}\n</head>`);

  return processedHtml;
}
