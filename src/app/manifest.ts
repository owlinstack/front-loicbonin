import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Loïc Bonin — Développeur Fullstack',
    short_name: 'Loïc Bonin',
    description: 'Portfolio professionnel et veille technologique de Loïc Bonin',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0c0b',
    theme_color: '#0c0c0b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
