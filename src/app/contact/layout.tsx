import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Booking — Start Your Visual Production',
  description:
    'Connect with Pandora Visuals. Call +91 63098 97003, email satpandora@gmail.com, or chat directly via WhatsApp for bookings, shoot schedules, and custom media quotes.',
  alternates: {
    canonical: 'https://pandoravisuals.studio/contact',
  },
  openGraph: {
    title: 'Contact & Booking | Pandora Visuals',
    description:
      'Connect with Pandora Visuals. Call +91 63098 97003, email satpandora@gmail.com, or chat directly via WhatsApp for bookings and custom media quotes.',
    url: 'https://pandoravisuals.studio/contact',
    siteName: 'Pandora Visuals',
    type: 'website',
    images: [
      {
        url: 'https://pandoravisuals.studio/images/portrait_2160x3840.webp',
        width: 810,
        height: 1440,
        alt: 'Contact Pandora Visuals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact & Booking | Pandora Visuals',
    description:
      'Book your session or request a production consultation with Pandora Visuals. Call +91 63098 97003 or WhatsApp.',
    images: ['https://pandoravisuals.studio/images/portrait_2160x3840.webp'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
