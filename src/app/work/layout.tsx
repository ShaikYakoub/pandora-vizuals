import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work & Productions — Cinematic Videography & Photography',
  description:
    'Explore curated visual productions from Pandora Visuals: viral 4K social reels, kids 1st birthday & cake smash shoots, milestone adult celebrations, commercial lookbooks, and monthly video retainers.',
  alternates: {
    canonical: 'https://pandoravizuals.com/work/',
  },
  openGraph: {
    title: 'Work & Productions | Pandora Visuals',
    description:
      'Explore curated production packages: viral 4K social reels, kids 1st birthday & cake smash shoots, milestone adult celebrations, commercial lookbooks, and monthly video retainers.',
    url: 'https://pandoravizuals.com/work/',
    siteName: 'Pandora Visuals',
    type: 'website',
    images: [
      {
        url: 'https://pandoravizuals.com/images/portrait_2160x3840.webp',
        width: 810,
        height: 1440,
        alt: 'Pandora Visuals Work Productions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work & Productions | Pandora Visuals',
    description:
      'Curated 4K reels, kids birthday photography, milestone events, and commercial video production.',
    images: ['https://pandoravizuals.com/images/portrait_2160x3840.webp'],
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
