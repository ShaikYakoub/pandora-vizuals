import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Anton, Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CardsProvider } from '@/context/CardsContext';
import SmoothScroll from '@/components/SmoothScroll';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppBubble from '@/components/WhatsAppBubble';

import StructuredData from '@/components/StructuredData';

const dune = localFont({
  src: './fonts/Dune_Rise.ttf',
  variable: '--font-dune',
  display: 'swap',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pandoravisuals.studio'),
  title: {
    default: 'Pandora Visuals — Cinematic Videography, Photography & Media Studio',
    template: '%s | Pandora Visuals',
  },
  description:
    'Pandora Visuals is a creative media studio crafting viral 4K social reels, milestone birthday photography for kids & adults, event videography, and full-funnel digital marketing campaigns.',
  applicationName: 'Pandora Visuals',
  keywords: [
    'Pandora Visuals',
    'cinematic videography',
    'viral reels production',
    'kids birthday photography',
    '1st birthday cake smash Hyderabad',
    'event videography Hyderabad',
    'commercial photography studio',
    'social media video retainer',
    'digital marketing video agency',
    'event photography Telangana',
    '4K video production',
    'creative agency Hyderabad',
  ],
  authors: [{ name: 'Pandora Visuals Studio', url: 'https://pandoravisuals.studio' }],
  creator: 'Pandora Visuals',
  publisher: 'Pandora Visuals',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pandora Visuals — Cinematic Videography, Photography & Media Studio',
    description:
      'Viral 4K short-form reels, childhood milestone celebrations, adult birthday events, commercial lookbooks, and high-impact digital marketing.',
    url: 'https://pandoravisuals.studio',
    siteName: 'Pandora Visuals',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://pandoravisuals.studio/images/portrait_2160x3840.webp',
        width: 810,
        height: 1440,
        alt: 'Pandora Visuals Studio Showreel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pandora Visuals — Cinematic Videography & Media Studio',
    description:
      'Viral 4K short-form reels, milestone celebrations for kids & adults, and digital marketing campaigns.',
    images: ['https://pandoravisuals.studio/images/portrait_2160x3840.webp'],
  },
  icons: {
    icon: [
      { url: '/images/pandora-logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/images/portrait_2160x3840.webp', sizes: '180x180', type: 'image/webp' },
    ],
  },
  category: 'media & entertainment',
  other: {
    // GEO Tags for local search engines and Answer Engines
    'geo.region': 'IN-TG',
    'geo.placename': 'Hyderabad',
    'geo.position': '17.385044;78.486671',
    'ICBM': '17.385044, 78.486671',
    'theme-color': '#0c0c0b',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dune.variable} ${anton.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/pandora-logo.svg" />
        <StructuredData />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0c0c0b] text-[#ece8e1]">
        <CardsProvider>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1 w-full">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <WhatsAppBubble />
          </SmoothScroll>
        </CardsProvider>
      </body>
    </html>
  );
}
