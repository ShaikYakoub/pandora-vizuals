import type { Metadata } from 'next';
import { Anton, Instrument_Serif, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';
import { CardsProvider } from '@/context/CardsContext';
import { CartProvider } from '@/context/CartContext';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

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
  title: 'Bureau27 — Avant-Garde Fashion Label',
  description: 'Bureau27 is an avant-garde fashion label. Seasonless garments, cut in small runs, shipped worldwide.',
  keywords: ['avant-garde fashion', 'bureau27', 'seasonless garments', 'porto atelier', 'sustainable luxury'],
  authors: [{ name: 'Bureau27 Atelier' }],
  metadataBase: new URL('https://bureau27.studio'),
  openGraph: {
    title: 'Bureau27 — Avant-Garde Fashion Label',
    description: 'Bureau27 is an avant-garde fashion label. Seasonless garments, cut in small runs, shipped worldwide.',
    url: 'https://bureau27.studio',
    siteName: 'Bureau27',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bureau27 — Avant-Garde Fashion Label',
    description: 'Seasonless garments, cut in small runs, shipped worldwide.',
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
      className={`${anton.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <head>
        <link rel="icon" href="https://framerusercontent.com/sites/icons/default-favicon-light.v1.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0c0c0b] text-[#ece8e1]">
        <CardsProvider>
          <CartProvider>
            <SmoothScroll>
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <CartDrawer />
              <Footer />
            </SmoothScroll>
          </CartProvider>
        </CardsProvider>
      </body>
    </html>
  );
}
