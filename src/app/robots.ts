import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin'],
      },
      // Explicitly allow leading AI search & answer engines for AEO indexing
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
          'Bingbot',
        ],
        allow: '/',
        disallow: ['/api/', '/admin'],
      },
    ],
    sitemap: 'https://pandoravisuals.studio/sitemap.xml',
  };
}

