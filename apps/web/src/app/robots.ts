import type { MetadataRoute } from 'next';

/**
 * Витрина открыта для индексации, всё рабочее — нет.
 *
 * Это не защита — она в middleware, — а просьба не держать в выдаче адреса,
 * за которыми лежат данные клиента.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/ai', '/erp/', '/stage-reports/', '/login'],
      },
    ],
    sitemap: 'https://nanocem.app/sitemap.xml',
  };
}
