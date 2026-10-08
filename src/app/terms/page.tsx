import type { Metadata } from 'next';
import CameraCTAButton from '@/components/CameraCTAButton';

export const metadata: Metadata = {
  title: 'Terms & Policy — Production & Privacy Guidelines',
  description:
    'Terms of service, production guidelines, usage licensing, and privacy policy for Pandora Visuals creative studio clients.',
  alternates: {
    canonical: 'https://pandoravizuals.com/terms/',
  },
  openGraph: {
    title: 'Terms & Policy | Pandora Visuals',
    description:
      'Transparent terms of service, creative direction guidelines, and client privacy policy for Pandora Visuals.',
    url: 'https://pandoravizuals.com/terms/',
  },
};

export default function TermsAndPolicyPage() {
  const lastUpdated = 'January 2026';

  const sections = [
    {
      num: '01',
      title: 'Studio & Engagement',
      content:
        'Pandora Visuals operates as an independent creative production studio specializing in cinematic videography, event and milestone photography, and digital marketing strategy. Project timelines, deliverables, and shoot schedules are confirmed in writing prior to production kickoff.',
    },
    {
      num: '02',
      title: 'Deliverables & Creative Direction',
      content:
        'All raw footage, color grades, sound design, and master edits remain under artistic direction aligned with agreed creative briefs. Standard packages include one round of consolidated revisions within 14 days of rough cut delivery. Final masters are delivered via private cloud download.',
    },
    {
      num: '03',
      title: 'Usage & Intellectual Property',
      content:
        'Upon full settlement of invoices, clients receive perpetual, worldwide rights for the agreed promotional, commercial, or personal usage channels. Pandora Visuals retains the non-exclusive artistic right to showcase selected excerpts in showreels, portfolios, and awards submissions unless an NDA is explicitly signed prior.',
    },
    {
      num: '04',
      title: 'Bookings & Rescheduling',
      content:
        'A booking retainer secures dates and crew allocations. In the event of unforeseen weather or client schedule shifts, shoots may be rescheduled with at least 72 hours advance notice without penalty, subject to studio calendar availability.',
    },
    {
      num: '05',
      title: 'Privacy & Data Protection',
      content:
        'We value your confidentiality. Contact information, project briefs, and personal shoot assets are strictly handled for production, invoicing, and delivery. We do not sell, rent, or trade your data to third parties. Media archives are securely preserved for 90 days post-delivery.',
    },
    {
      num: '06',
      title: 'Questions & Inquiries',
      content:
        'For inquiries regarding custom commercial licenses, non-disclosure agreements, or specific data retention requests, contact our studio team directly at pandoravisualsat@gmail.com or +91 63098 97003.',
    },
  ];

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-32 pb-24 sm:pt-40 sm:pb-32 px-5 sm:px-8 lg:px-12 selection:bg-[#ff3d17] selection:text-[#0c0c0b]">
      <div className="max-w-[1000px] mx-auto space-y-16 sm:space-y-24">
        
        {/* Header Block */}
        <header className="space-y-6 pb-12 border-b border-[#ece8e1]/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#ff3d17]" />
            <span className="font-dune text-xs sm:text-sm tracking-[0.2em] text-[#ff3d17] uppercase">
              Legal & Privacy
            </span>
          </div>
          
          <h1 className="font-unica text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight uppercase text-[#ece8e1]">
            Terms & Policy
          </h1>

          <p className="text-base sm:text-lg text-[#ece8e1]/65 max-w-2xl leading-relaxed font-sans">
            Minimalist principles guiding our productions, client collaborations, usage rights, and data privacy.
          </p>

          <p className="text-xs sm:text-sm text-[#ece8e1]/40 tracking-wider uppercase font-sans">
            Effective · {lastUpdated}
          </p>
        </header>

        {/* Minimalist Policy Clauses */}
        <section className="space-y-14 sm:space-y-16">
          {sections.map((sec) => (
            <article
              key={sec.num}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pt-8 border-t border-[#ece8e1]/5 first:border-t-0 first:pt-0"
            >
              <div className="md:col-span-4 flex items-baseline gap-3">
                <span className="text-xs font-sans font-bold text-[#ff3d17] tracking-wider">
                  [{sec.num}]
                </span>
                <h2 className="font-unica text-xl sm:text-2xl font-normal tracking-wide text-[#ece8e1]">
                  {sec.title}
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-base sm:text-lg text-[#ece8e1]/70 leading-relaxed font-sans">
                  {sec.content}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* Bottom Direct CTA */}
        <footer className="pt-12 border-t border-[#ece8e1]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-sm text-[#ece8e1]/50 font-sans">Need custom production terms?</span>
            <p className="text-base font-semibold text-[#ece8e1]">Let&apos;s draft an agreement for your project.</p>
          </div>
          <CameraCTAButton href="/contact/">
            GET IN TOUCH
          </CameraCTAButton>
        </footer>

      </div>
    </div>
  );
}
