import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lookbook — Cinematic Portfolio & Visual Stories',
  description:
    'Experience the Pandora Visuals lookbook: high-velocity cinematic reels, candid childhood milestones, luxury adult celebrations, and commercial digital campaigns shot on cinema primes.',
  alternates: {
    canonical: 'https://pandoravizuals.com/lookbook/',
  },
  openGraph: {
    title: 'Lookbook Portfolio | Pandora Visuals',
    description:
      'High-velocity cinematic reels, candid childhood milestones, luxury adult celebrations, and commercial digital campaigns shot on cinema primes.',
    url: 'https://pandoravizuals.com/lookbook/',
    siteName: 'Pandora Visuals',
    type: 'website',
    images: [
      {
        url: 'https://pandoravizuals.com/images/portrait_2160x3840.webp',
        width: 810,
        height: 1440,
        alt: 'Pandora Visuals Lookbook Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lookbook Portfolio | Pandora Visuals',
    description:
      'High-velocity cinematic reels, candid childhood milestones, and luxury adult celebrations.',
    images: ['https://pandoravizuals.com/images/portrait_2160x3840.webp'],
  },
};

export default function LookbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
