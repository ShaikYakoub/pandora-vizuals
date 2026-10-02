import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Anton, Instrument_Serif, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';
import { CardsProvider } from '@/context/CardsContext';
import SmoothScroll from '@/components/SmoothScroll';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pandora Visuals — Cinematic Videography, Photography & Digital Marketing',
  description: 'Pandora Visuals is a premier creative media studio specializing in viral reels, milestone birthday photography for kids & adults, event videography, and full-funnel digital marketing campaigns.',
  keywords: ['pandora visuals', 'videography', 'photography', 'reels production', 'child birthday photography', 'birthday videography', 'event photography', 'digital marketing', 'social media growth', 'creative direction'],
  authors: [{ name: 'Pandora Visuals Studio' }],
  metadataBase: new URL('https://pandoravisuals.studio'),
  openGraph: {
    title: 'Pandora Visuals — Cinematic Videography, Photography & Digital Marketing',
    description: 'Cinematic reels, childhood milestone celebrations, adult birthday events, commercial photography, and high-impact digital marketing.',
    url: 'https://pandoravisuals.studio',
    siteName: 'Pandora Visuals',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pandora Visuals — Cinematic Videography & Photography',
    description: 'Cinematic reels, birthday celebrations for children and adults, and full-service digital marketing.',
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
      className={`${dune.variable} ${anton.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <head>
        <link rel="icon" href="https://framerusercontent.com/sites/icons/default-favicon-light.v1.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0c0c0b] text-[#ece8e1]">
        <CardsProvider>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1 w-full">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </SmoothScroll>
        </CardsProvider>
      </body>
    </html>
  );
}
