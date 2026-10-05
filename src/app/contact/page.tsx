'use client';

import React, { useState } from 'react';
import { Mail, Phone, ArrowUpRight, MapPin, Copy, Check, ExternalLink } from 'lucide-react';

const CONTACT_INFO = {
  email: 'hello@pandoravisuals.studio',
  phone: '+91 98765 43210',
  displayPhone: '+91 98765 43210',
  location: 'Jubilee Hills, Hyderabad, Telangana, India',
  mapQuery: 'Jubilee Hills, Hyderabad',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jubilee+Hills+Hyderabad',
  socials: [
    {
      name: 'Instagram',
      handle: '@pandoravisuals',
      url: 'https://instagram.com',
    },
    {
      name: 'Twitter(X)',
      handle: '@pandoravizuals',
      url: 'https://x.com',
    },
    {
      name: 'YouTube',
      handle: 'Pandora Visuals',
      url: 'https://youtube.com',
    },
    {
      name: 'LinkedIn',
      handle: 'Pandora Visuals Studio',
      url: 'https://linkedin.com',
    },
  ],
};

export default function ContactPage() {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  const copyToClipboard = async (text: string, field: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2200);
    } catch {
      // Fallback if clipboard API is restricted
      setCopiedField(null);
    }
  };

  // Structured Data for AI Engines & Search Engines (AEO/SEO)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': 'https://pandoravisuals.studio/contact',
    'name': 'Contact — Pandora Visuals Studio',
    'url': 'https://pandoravisuals.studio/contact',
    'mainEntity': {
      '@type': 'ProfessionalService',
      'name': 'Pandora Visuals',
      'email': CONTACT_INFO.email,
      'telephone': CONTACT_INFO.phone,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Hyderabad',
        'addressRegion': 'Telangana',
        'addressCountry': 'IN',
      },
      'sameAs': CONTACT_INFO.socials.map((s) => s.url),
    },
  };

  return (
    <div id="about" className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen flex flex-col justify-between pt-24 sm:pt-32 pb-36 sm:pb-44 px-4 sm:px-8 lg:px-16 selection:bg-[#ff3d17] selection:text-[#0c0c0b]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main Container */}
      <div className="w-full max-w-[1400px] mx-auto space-y-12 sm:space-y-16">
        
        {/* Page Header */}
        <div className="space-y-3 sm:space-y-4 border-b border-[#ece8e1]/10 pb-8 sm:pb-12">
          <div className="font-mono text-xs uppercase tracking-widest text-[#ff3d17]">
            // CONTACT & STUDIO LOCATION
          </div>
          <h1 className="font-anton text-5xl sm:text-7xl lg:text-9xl uppercase tracking-tight text-[#ece8e1] leading-[0.9]">
            GET IN TOUCH
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#ece8e1]/60 max-w-xl">
            Direct channels for production bookings, milestone shoots, commercial projects, and studio visits.
          </p>
        </div>

        {/* 2-Column Content Grid: Contact Details Left, Map Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Email, Phone, Socials */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8 sm:space-y-10">
            
            {/* 1. Email Card */}
            <div className="p-6 sm:p-8 bg-[#141413] border border-[#ece8e1]/12 hover:border-[#ece8e1]/25 transition-colors group">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3d17] flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  EMAIL
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(CONTACT_INFO.email, 'email')}
                  className="font-mono text-[11px] text-[#ece8e1]/50 hover:text-[#ece8e1] transition-colors flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded bg-[#ece8e1]/5 hover:bg-[#ece8e1]/10"
                  aria-label="Copy email address"
                >
                  {copiedField === 'email' ? (
                    <>
                      <Check className="w-3 h-3 text-[#ff3d17]" />
                      <span className="text-[#ff3d17]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#ece8e1] hover:text-[#ff3d17] transition-colors break-all inline-block"
              >
                {CONTACT_INFO.email}
              </a>
            </div>

            {/* 2. Number (Phone) Card */}
            <div className="p-6 sm:p-8 bg-[#141413] border border-[#ece8e1]/12 hover:border-[#ece8e1]/25 transition-colors group">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff3d17] flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  PHONE / WHATSAPP
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(CONTACT_INFO.phone, 'phone')}
                  className="font-mono text-[11px] text-[#ece8e1]/50 hover:text-[#ece8e1] transition-colors flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded bg-[#ece8e1]/5 hover:bg-[#ece8e1]/10"
                  aria-label="Copy phone number"
                >
                  {copiedField === 'phone' ? (
                    <>
                      <Check className="w-3 h-3 text-[#ff3d17]" />
                      <span className="text-[#ff3d17]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="font-sans font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#ece8e1] hover:text-[#ff3d17] transition-colors inline-block tracking-tight"
              >
                {CONTACT_INFO.displayPhone}
              </a>
            </div>

            {/* 3. Socials Card */}
            <div className="p-6 sm:p-8 bg-[#141413] border border-[#ece8e1]/12 space-y-4">
              <div className="font-mono text-xs uppercase tracking-widest text-[#ff3d17]">
                SOCIALS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {CONTACT_INFO.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 bg-[#0c0c0b] border border-[#ece8e1]/10 hover:border-[#ff3d17]/60 hover:bg-[#1a1a19] transition-all flex items-center justify-between group rounded-none"
                  >
                    <div className="space-y-0.5">
                      <div className="font-sans font-medium text-sm text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors">
                        {social.name}
                      </div>
                      <div className="font-mono text-[11px] text-[#ece8e1]/40">
                        {social.handle}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#ece8e1]/40 group-hover:text-[#ff3d17] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Studio Map */}
          <div className="lg:col-span-6 flex flex-col bg-[#141413] border border-[#ece8e1]/12 overflow-hidden">
            
            {/* Map Header Bar */}
            <div className="p-5 sm:p-6 border-b border-[#ece8e1]/10 flex flex-wrap items-center justify-between gap-4 bg-[#141413]">
              <div className="space-y-1">
                <div className="font-mono text-xs uppercase tracking-widest text-[#ff3d17] flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  STUDIO LOCATION
                </div>
                <div className="font-sans text-sm text-[#ece8e1]/80">
                  {CONTACT_INFO.location}
                </div>
              </div>

              <a
                href={CONTACT_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-[#ece8e1] bg-[#0c0c0b] hover:bg-[#ff3d17] hover:text-[#0c0c0b] border border-[#ece8e1]/20 px-3.5 py-2 transition-all flex items-center gap-2 shadow-sm"
              >
                <span>OPEN IN MAPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Dark Theme Google Map */}
            <div className="relative w-full flex-1 min-h-[380px] sm:min-h-[440px] bg-[#0c0c0b]">
              <iframe
                title="Pandora Visuals Studio Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(CONTACT_INFO.mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full min-h-[380px] sm:min-h-[440px] border-0"
                style={{
                  filter: 'invert(90%) hue-rotate(180deg) contrast(90%)',
                }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
