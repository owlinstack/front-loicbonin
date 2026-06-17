import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://loicbonin.com';

  // Pages statiques principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/realisations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/code`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profil`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Articles de veille dynamiques
  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const articlesData = await getArticles({ page: 1, pageSize: 1000 });
    articleEntries = articlesData.articles.map((art) => ({
      url: `${baseUrl}/article/${art.slug}`,
      lastModified: new Date(art.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('[Sitemap Generation Error]:', error);
  }

  return [...staticPages, ...articleEntries];
}
