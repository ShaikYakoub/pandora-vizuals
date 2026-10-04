'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import PandoraLogo from './PandoraLogo';

export default function Footer() {
  const [timeString, setTimeString] = useState<string>('16:00:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/London',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#000000] p-2 sm:p-3 lg:p-4 select-none">
      {/* Curved Container Card with black-to-white monochrome luminous gradient background */}
      <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#090909] text-white flex flex-col justify-between border border-white/10">
        {/* Background: Deep cinematic black graduating to radiant monochrome white glow at bottom */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#090909]" />
          
          {/* Luminous bottom silver-white radial horizon */}
          <div 
            className="absolute -bottom-20 sm:-bottom-32 left-1/2 -translate-x-1/2 w-[160%] sm:w-[130%] h-[75%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255, 255, 255, 0.32) 0%, rgba(215, 220, 230, 0.12) 40%, rgba(9, 9, 9, 0) 80%)',
            }}
          />

          {/* Ambient vertical linear glow from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/[0.08] via-transparent to-transparent pointer-events-none" />

          {/* Film grain noise overlay */}
          <div className="absolute inset-0 bg-noise opacity-25 pointer-events-none" />
        </div>

        {/* Top Section: Three Columns (Navigation, Social, Legals) */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 sm:gap-14 lg:gap-24">
            
            {/* Column 1: Navigation */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <span className="text-white/60 text-xs sm:text-sm font-medium tracking-wide">
                Navigation
              </span>
              <nav className="flex flex-col gap-3 sm:gap-4" aria-label="Footer Navigation">
                <Link
                  href="/about"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  About
                </Link>
                <Link
                  href="/shop"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  Works
                </Link>
                <Link
                  href="/lookbook"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Column 2: Social */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <span className="text-white/60 text-xs sm:text-sm font-medium tracking-wide">
                Social
              </span>
              <div className="flex flex-col gap-3 sm:gap-4">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  Twitter(X)
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  Instagram
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  YouTube
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Column 3: Legals */}
            <div className="flex flex-col gap-4 sm:gap-5 col-span-2 md:col-span-1">
              <span className="text-white/60 text-xs sm:text-sm font-medium tracking-wide">
                Legals
              </span>
              <div className="flex flex-col gap-3 sm:gap-4">
                <Link
                  href="/contact"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/contact"
                  className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white/80 hover:text-white transition-colors duration-200 tracking-tight inline-block w-fit"
                >
                  Term of Service
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Info Row + Monumental Wordmark */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col gap-8 sm:gap-12">
          
          {/* Middle Meta Row: Copyright | Studio Clock | Back to Top */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm text-white/65 font-sans">
            {/* Copyright */}
            <p className="order-1">
              © {new Date().getFullYear()} Pandora Visuals. All rights reserved.
            </p>

            {/* Live Clock */}
            <div className="order-3 sm:order-2 flex items-center gap-1.5 font-mono text-xs sm:text-sm tracking-wider text-white/70">
              <span className="text-white/50">London →</span>
              <span className="tabular-nums font-medium text-white" suppressHydrationWarning>
                {timeString}
              </span>
            </div>

            {/* Back to top button in crisp white/silver */}
            <button
              onClick={scrollToTop}
              className="order-2 sm:order-3 text-white/80 hover:text-white transition-colors duration-200 font-medium inline-flex items-center gap-1 cursor-pointer group"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-white/90" />
            </button>
          </div>

          {/* Monumental Brand Wordmark over the glowing white horizon */}
          <div className="w-full pt-4 pb-28 sm:pb-32 md:pb-36 overflow-hidden">
            <Link
              href="/"
              className="w-full block select-none group"
              aria-label="Pandora Vizuals Home"
            >
              <PandoraLogo 
                theme="white"
                className="w-full h-auto text-white/95 group-hover:text-white transition-all duration-300 drop-shadow-[0_0_45px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_70px_rgba(255,255,255,0.7)]" 
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
