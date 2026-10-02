'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

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
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-12 sm:py-20 px-4 sm:px-8">
      <div className="max-w-[1720px] mx-auto space-y-16">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
          <div>(Contact) — Replies within 48h</div>
          <div>MON-FRI, 10-18 WET</div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-6 space-y-12">
            <div className="space-y-4">
              <h1 className="font-anton text-7xl sm:text-9xl tracking-tight text-[#ece8e1] uppercase leading-[0.9]">
                SAY <br /> HELLO
              </h1>
              <div className="pt-4">
                <a
                  href="mailto:hello@bureau27.studio"
                  className="font-serif-italic text-3xl sm:text-4xl text-[#ece8e1] underline hover:text-[#ff3d17] transition-colors"
                >
                  hello@bureau27.studio
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-[#ece8e1]/10">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[#ff3d17] font-bold">
                  STUDIO
                </div>
                <div className="font-sans text-base text-[#dcd6cc]">
                  Rua das Flores 27<br />
                  4050-265 Porto<br />
                  Portugal
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[#ff3d17] font-bold">
                  PRESS & ARCHIVE
                </div>
                <div className="font-sans text-base text-[#dcd6cc]">
                  <a href="mailto:press@bureau27.studio" className="hover:text-[#ff3d17] underline">
                    press@bureau27.studio
                  </a>
                  <div className="text-xs font-mono text-[#8c8880] pt-1">
                    Direct editorial requests
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-6 border border-[#ece8e1]/15 bg-[#141413] p-8 sm:p-12">
            <h2 className="font-anton text-3xl sm:text-5xl text-[#ece8e1] tracking-wide mb-8">
              TELL US WHAT YOU&apos;RE AFTER.
            </h2>

            {submitted ? (
              <div className="p-8 bg-[#171716] border border-[#ff3d17] text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-[#ff3d17] text-[#0c0c0b] mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="font-anton text-2xl text-[#ece8e1]">MESSAGE RECEIVED</h3>
                <p className="font-mono text-xs text-[#8c8880]">
                  Our Porto atelier coordinator will respond within 48 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
                {/* Name */}
                <div className="space-y-2">
                  <label className="tracking-widest text-[#8c8880] uppercase block">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3.5 text-[#ece8e1] placeholder-[#6b675f] focus:border-[#ff3d17] outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="tracking-widest text-[#8c8880] uppercase block">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@studio.com"
                    className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3.5 text-[#ece8e1] placeholder-[#6b675f] focus:border-[#ff3d17] outline-none transition-colors"
                  />
                </div>

                {/* Topic */}
                <div className="space-y-2">
                  <label className="tracking-widest text-[#8c8880] uppercase block">
                    TOPIC
                  </label>
                  <select
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3.5 text-[#ece8e1] focus:border-[#ff3d17] outline-none transition-colors cursor-pointer"
                  >
                    <option value="General question">General question</option>
                    <option value="Sizing & Fit Advice">Sizing &amp; Fit Advice</option>
                    <option value="Order & Shipping Status">Order &amp; Shipping Status</option>
                    <option value="Press & Stockist Inquiry">Press &amp; Stockist Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="tracking-widest text-[#8c8880] uppercase block">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Sizes, stockists, collaborations..."
                    className="w-full bg-[#0c0c0b] border border-[#ece8e1]/20 p-3.5 text-[#ece8e1] placeholder-[#6b675f] focus:border-[#ff3d17] outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bureau-btn bureau-btn-primary py-4"
                >
                  <span>SEND TRANSMISSION</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
