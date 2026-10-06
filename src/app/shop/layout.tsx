import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Pricing — Video & Photo Production',
  description:
    'Explore curated production packages from Pandora Visuals: viral 4K social reels, kids 1st birthday & cake smash shoots, milestone adult celebrations, commercial lookbooks, and monthly video retainers.',
  alternates: {
    canonical: 'https://pandoravisuals.studio/shop',
  },
  openGraph: {
    title: 'Production Services & Pricing | Pandora Visuals',
    description:
      'Explore curated production packages: viral 4K social reels, kids 1st birthday & cake smash shoots, milestone adult celebrations, commercial lookbooks, and monthly video retainers.',
    url: 'https://pandoravisuals.studio/shop',
    siteName: 'Pandora Visuals',
    type: 'website',
    images: [
      {
        url: 'https://pandoravisuals.studio/images/portrait_2160x3840.webp',
        width: 810,
        height: 1440,
        alt: 'Pandora Visuals Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Production Services & Pricing | Pandora Visuals',
    description:
      'Curated 4K reels, kids birthday photography, milestone events, and commercial video production.',
    images: ['https://pandoravisuals.studio/images/portrait_2160x3840.webp'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
