'use client';

import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import FramerHeading from '@/components/FramerHeading';
import FramerReveal from '@/components/FramerReveal';

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

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-16 sm:space-y-24">
        
        {/* Top Meta Bar */}
        <FramerReveal delay={0.02} yOffset={10}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] animate-pulse" />
              <span>(Contact) — Replies within 48h</span>
            </div>
            <div>MON-FRI, 10-18 WET</div>
          </div>
        </FramerReveal>

        {/* Two-Column Grid: Studio Info Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Studio Contacts */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6">
              <FramerHeading
                text="SAY HELLO"
                as="h1"
                className="font-anton text-7xl sm:text-9xl lg:text-[168px] leading-[0.88] tracking-[-0.01em] uppercase text-[#ece8e1]"
              />

              <FramerReveal delay={0.12}>
                <a
                  href="mailto:hello@bureau27.studio"
                  className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-[#ece8e1] underline decoration-1 underline-offset-8 hover:text-[#ff3d17] transition-colors inline-block"
                >
                  hello@bureau27.studio
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
                    Rua das Flores 27, 4050-265 Porto
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#ff3d17] font-bold">
                    PRESS
                  </div>
                  <div className="font-sans text-sm text-[#dcd6cc]">
                    <a href="mailto:press@bureau27.studio" className="hover:text-[#ff3d17] transition-colors">
                      press@bureau27.studio
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#ff3d17] font-bold">
                    WHOLESALE
                  </div>
                  <div className="font-sans text-sm text-[#dcd6cc]">
                    <a href="mailto:stockists@bureau27.studio" className="hover:text-[#ff3d17] transition-colors">
                      stockists@bureau27.studio
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#ff3d17] font-bold">
                    ORDERS
                  </div>
                  <div className="font-sans text-sm text-[#dcd6cc]">
                    <a href="mailto:orders@bureau27.studio" className="hover:text-[#ff3d17] transition-colors">
                      orders@bureau27.studio
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
              className="font-anton text-4xl sm:text-5xl lg:text-6xl text-[#ece8e1] uppercase tracking-tight leading-[0.95]"
            />

            {submitted ? (
              <div className="p-8 bg-[#171716] border border-[#ff3d17] text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-[#ff3d17] text-[#0c0c0b] mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="font-anton text-2xl text-[#ece8e1] uppercase">MESSAGE RECEIVED</h3>
                <p className="font-mono text-xs text-[#8c8880]">
                  Our Porto atelier coordinator will respond within 48 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 font-mono text-xs">
                {/* Name */}
                <div className="space-y-2 border-b border-[#ece8e1]/20 pb-2">
                  <label className="tracking-widest text-[#8c8880] uppercase block text-[11px]">
                    YOUR NAME
                  </label>
                  <input
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
                  <label className="tracking-widest text-[#8c8880] uppercase block text-[11px]">
                    EMAIL
                  </label>
                  <input
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
                  <label className="tracking-widest text-[#8c8880] uppercase block text-[11px]">
                    TOPIC
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full bg-transparent text-[#ece8e1] text-sm font-sans focus:outline-none py-1 cursor-pointer"
                  >
                    <option value="General question" className="bg-[#141413] text-[#ece8e1]">General question</option>
                    <option value="Press & Media" className="bg-[#141413] text-[#ece8e1]">Press &amp; Media</option>
                    <option value="Wholesale inquiry" className="bg-[#141413] text-[#ece8e1]">Wholesale inquiry</option>
                    <option value="Custom order" className="bg-[#141413] text-[#ece8e1]">Custom order</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2 border-b border-[#ece8e1]/20 pb-2">
                  <label className="tracking-widest text-[#8c8880] uppercase block text-[11px]">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Sizes, stockists, collaborations..."
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
  );
}
