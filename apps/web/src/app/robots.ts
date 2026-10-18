import type { MetadataRoute } from 'next';

/** Кабинет закрыт от индексации: /app/* — только по логину (08-public-site.md). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/app/', '/login'] }],
    sitemap: 'https://nanocem.app/sitemap.xml',
  };
}
