'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#ece8e1] text-[#0c0c0b] pt-24 pb-8 px-6 sm:px-12 transition-colors">
      <div className="max-w-[1720px] mx-auto space-y-20">
        {/* Top Section: Newsletter & Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Newsletter Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono tracking-widest text-[#6b675f] uppercase">
              NEWSLETTER — NO SPAM, ONLY DROPS
            </div>
            <h3 className="font-serif-italic text-3xl sm:text-4xl text-[#0c0c0b] leading-tight">
              Drops land in your inbox before they land online.
            </h3>

            {subscribed ? (
              <div className="p-4 bg-[#0c0c0b] text-[#ece8e1] font-mono text-xs tracking-wider">
                ✓ YOU ARE ON THE PRIVATE DROP LIST. ATELIER ACCESS GRANTED.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-[#0c0c0b] pb-2 pt-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="bg-transparent flex-1 font-mono text-sm placeholder-[#8c8880] text-[#0c0c0b] outline-none"
                />
                <button
                  type="submit"
                  className="font-mono text-xs font-bold uppercase tracking-widest text-[#0c0c0b] hover:text-[#ff3d17] transition-colors flex items-center gap-1.5"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            {/* INDEX */}
            <div className="space-y-4">
              <div className="text-xs font-mono tracking-widest text-[#6b675f] uppercase">INDEX</div>
              <ul className="space-y-2.5 font-medium text-base text-[#0c0c0b]">
                <li>
                  <Link href="/shop" className="hover:text-[#ff3d17] transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/lookbook" className="hover:text-[#ff3d17] transition-colors">
                    Lookbook
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="hover:text-[#ff3d17] transition-colors">
                    Journal
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#ff3d17] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#ff3d17] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-xs font-mono text-[#ff3d17] hover:underline pt-2 block">
                    ⚙ Admin CMS
                  </Link>
                </li>
              </ul>
            </div>

            {/* FOLLOW */}
            <div className="space-y-4">
              <div className="text-xs font-mono tracking-widest text-[#6b675f] uppercase">FOLLOW</div>
              <ul className="space-y-2.5 font-medium text-base text-[#0c0c0b]">
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#ff3d17] transition-colors">
                    Instagram ↗
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[#ff3d17] transition-colors">
                    TikTok ↗
                  </a>
                </li>
                <li>
                  <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#ff3d17] transition-colors">
                    Pinterest ↗
                  </a>
                </li>
              </ul>
            </div>

            {/* STUDIO */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <div className="text-xs font-mono tracking-widest text-[#6b675f] uppercase">STUDIO</div>
              <address className="not-italic text-sm text-[#0c0c0b] space-y-1">
                <div className="font-semibold">Rua das Flores 27</div>
                <div className="text-[#6b675f]">4050-265 Porto, Portugal</div>
                <div className="pt-2">
                  <a href="mailto:hello@bureau27.studio" className="font-mono text-xs underline hover:text-[#ff3d17] transition-colors">
                    hello@bureau27.studio
                  </a>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Massive Brand Wordmark */}
        <div className="border-t border-[#0c0c0b]/15 pt-8">
          <h1 className="font-anton text-[18vw] leading-none text-[#0c0c0b] tracking-tighter select-none overflow-hidden text-center sm:text-left">
            BUREAU27
          </h1>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono tracking-widest text-[#6b675f] pt-4 border-t border-[#0c0c0b]/10 gap-4">
          <div>© {new Date().getFullYear()} BUREAU27. ALL RIGHTS RESERVED.</div>
          <div>CUT IN PORTO — WORN EVERYWHERE</div>
          <button
            onClick={scrollToTop}
            className="hover:text-[#0c0c0b] flex items-center gap-1 transition-colors uppercase font-bold"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
