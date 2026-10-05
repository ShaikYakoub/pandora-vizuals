'use client';

import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import FramerHeading from '@/components/FramerHeading';
import FramerReveal from '@/components/FramerReveal';
import ManifestoScroll from '@/components/ManifestoScroll';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'General question',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', topic: 'General question', message: '' });
    }, 4000);
  };

  // Structured Data for AI & Search Engine Optimization (AEO/SEO)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://pandoravisuals.studio/contact#about',
        'name': 'About Pandora Visuals Studio',
        'description': 'Pandora Visuals is a creative visual media studio specializing in viral reels, milestone birthday celebrations for kids and adults, commercial photography, and full-funnel digital marketing.',
        'url': 'https://pandoravisuals.studio/contact',
      },
      {
        '@type': 'ContactPage',
        '@id': 'https://pandoravisuals.studio/contact#contact',
        'name': 'Contact & Booking — Pandora Visuals Studio',
        'url': 'https://pandoravisuals.studio/contact',
      },
      {
        '@type': 'ProfessionalService',
        'name': 'Pandora Visuals',
        'url': 'https://pandoravisuals.studio',
        'email': 'hello@pandoravisuals.studio',
        'description': 'Premier videography, milestone event photography, cinematic reels, and digital marketing studio.',
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'contactType': 'Bookings & Shoots',
            'email': 'bookings@pandoravisuals.studio',
          },
          {
            '@type': 'ContactPoint',
            'contactType': 'General & Studio Inquiries',
            'email': 'hello@pandoravisuals.studio',
          },
          {
            '@type': 'ContactPoint',
            'contactType': 'Digital Marketing',
            'email': 'marketing@pandoravisuals.studio',
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen flex flex-col">
      {/* Schema.org Structured Data for AI Engines & Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 1. About / Studio Manifesto Hero Section */}
      <section id="about" className="w-full pt-28 sm:pt-36 pb-14 sm:pb-20 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-noise select-none">
        <ManifestoScroll
          isStandalone={true}
          ctaText="BOOK A SHOOT"
          ctaLink="#inquire"
          secondaryCtaText="EXPLORE WORK"
          secondaryCtaLink="/shop"
        />
      </section>

      {/* 2. Direct Studio Info & Inquiry Form Section */}
      <div id="inquire" className="w-full pt-16 sm:pt-24 pb-24 sm:pb-32 px-4 sm:px-8 border-b border-[#ece8e1]/10">
        <div className="max-w-[1580px] mx-auto space-y-16 sm:space-y-24">
        

        {/* Two-Column Grid: Studio Info Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Studio Contacts */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6">
              <FramerHeading
                lines={['SAY', 'HELLO']}
                as="h1"
                className="font-anton text-6xl sm:text-7xl lg:text-[104px] leading-[0.92] tracking-wide uppercase text-[#ece8e1]"
              />

              <FramerReveal delay={0.12}>
                <a
                  href="mailto:hello@pandoravisuals.studio"
                  className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-[#ece8e1] underline decoration-1 underline-offset-8 hover:text-[#ff3d17] transition-colors inline-block"
                >
                  hello@pandoravisuals.studio
                </a>
              </FramerReveal>
            </div>

            {/* 4 Studio Rows */}
            <FramerReveal delay={0.18} yOffset={24} className="space-y-8 pt-8 border-t border-[#ece8e1]/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8 border-b border-[#ece8e1]/10">
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#ff3d17] font-bold">
                    STUDIO
                  </div>
                  <div className="font-sans text-sm text-[#dcd6cc] leading-relaxed">
                    Production Studio & On-Location Coverage
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#ff3d17] font-bold">
                    BOOKINGS
                  </div>
                  <div className="font-sans text-sm text-[#dcd6cc]">
                    <a href="mailto:bookings@pandoravisuals.studio" className="hover:text-[#ff3d17] transition-colors">
                      bookings@pandoravisuals.studio
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#ff3d17] font-bold">
                    DIGITAL MARKETING
                  </div>
                  <div className="font-sans text-sm text-[#dcd6cc]">
                    <a href="mailto:marketing@pandoravisuals.studio" className="hover:text-[#ff3d17] transition-colors">
                      marketing@pandoravisuals.studio
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#ff3d17] font-bold">
                    PROJECTS & REELS
                  </div>
                  <div className="font-sans text-sm text-[#dcd6cc]">
                    <a href="mailto:projects@pandoravisuals.studio" className="hover:text-[#ff3d17] transition-colors">
                      projects@pandoravisuals.studio
                    </a>
                  </div>
                </div>
              </div>
            </FramerReveal>
          </div>

          {/* Right Column: Framer Form Container */}
          <FramerReveal delay={0.22} yOffset={32} className="lg:col-span-6 bg-[#141413] border border-[#ece8e1]/15 p-8 sm:p-12 lg:p-14 space-y-8">
            <FramerHeading
              text="TELL US WHAT YOU’RE AFTER."
              as="h2"
              className="font-anton text-2xl sm:text-3xl lg:text-[38px] text-[#ece8e1] uppercase tracking-wide leading-[1.12]"
            />

            {submitted ? (
              <div className="p-8 bg-[#171716] border border-[#ff3d17] text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-[#ff3d17] text-[#0c0c0b] mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="font-anton text-2xl text-[#ece8e1] uppercase">INQUIRY RECEIVED</h3>
                <p className="font-mono text-xs text-[#8c8880]">
                  Our visual production coordinator will review your shoot details and respond within 24-48 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 font-mono text-xs">
                {/* Name */}
                <div className="space-y-2 border-b border-[#ece8e1]/20 pb-2">
                  <label htmlFor="contact-name" className="tracking-widest text-[#8c8880] uppercase block text-[11px] cursor-pointer">
                    YOUR NAME
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-transparent text-[#ece8e1] placeholder-[#6b675f] text-sm font-sans focus:outline-none py-1"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 border-b border-[#ece8e1]/20 pb-2">
                  <label htmlFor="contact-email" className="tracking-widest text-[#8c8880] uppercase block text-[11px] cursor-pointer">
                    EMAIL
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@studio.com"
                    className="w-full bg-transparent text-[#ece8e1] placeholder-[#6b675f] text-sm font-sans focus:outline-none py-1"
                  />
                </div>

                {/* Topic */}
                <div className="space-y-2 border-b border-[#ece8e1]/20 pb-2">
                  <label htmlFor="contact-topic" className="tracking-widest text-[#8c8880] uppercase block text-[11px] cursor-pointer">
                    TOPIC
                  </label>
                  <select
                    id="contact-topic"
                    name="topic"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full bg-transparent text-[#ece8e1] text-sm font-sans focus:outline-none py-1 cursor-pointer"
                  >
                    <option value="Reels & Short-Form Video" className="bg-[#141413] text-[#ece8e1]">Reels &amp; Short-Form Video</option>
                    <option value="Child Birthday / Cake Smash" className="bg-[#141413] text-[#ece8e1]">Child Birthday / Cake Smash</option>
                    <option value="Adult Milestone Celebration" className="bg-[#141413] text-[#ece8e1]">Adult Milestone Celebration</option>
                    <option value="Digital Marketing & Social Growth" className="bg-[#141413] text-[#ece8e1]">Digital Marketing &amp; Social Growth</option>
                    <option value="Commercial & Brand Photography" className="bg-[#141413] text-[#ece8e1]">Commercial &amp; Brand Photography</option>
                    <option value="General Inquiry" className="bg-[#141413] text-[#ece8e1]">General Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2 border-b border-[#ece8e1]/20 pb-2">
                  <label htmlFor="contact-message" className="tracking-widest text-[#8c8880] uppercase block text-[11px] cursor-pointer">
                    MESSAGE / SHOOT DETAILS
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your shoot, date, event type, or marketing objectives..."
                    className="w-full bg-transparent text-[#ece8e1] placeholder-[#6b675f] text-sm font-sans focus:outline-none resize-none py-1"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#0c0c0b] hover:bg-[#ff3d17] hover:text-[#0c0c0b] text-[#ece8e1] border border-[#ece8e1]/20 font-mono text-xs uppercase tracking-widest px-8 py-4.5 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>SEND MESSAGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </FramerReveal>

        </div>
      </div>
    </div>
    </div>
  );
}
