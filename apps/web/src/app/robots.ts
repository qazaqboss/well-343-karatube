import type { MetadataRoute } from 'next';

/**
 * Индексировать нечего: сайт закрыт целиком, снаружи доступен только вход.
 * Это не защита — она в middleware, — а просьба не хранить адреса в выдаче.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', disallow: '/' }] };
}
