'use client';

import React from 'react';
import Link from 'next/link';
import PandoraLogo from './PandoraLogo';

export default function Footer() {
  return (
    <footer className="w-full bg-[#000000] p-2 sm:p-3 lg:p-4 select-none">
      {/* Curved Container Card with Sleek Dark Glass and Black Aesthetic */}
      <div 
        className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden flex flex-col justify-between border border-white/[0.12] shadow-[0_24px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl"
        style={{
          background: 'linear-gradient(180deg, #111114 0%, #0a0a0c 45%, #040405 100%)',
        }}
      >
        {/* Glassmorphic Ambient Highlights & Atmospheric Overlays */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* Top Specular Glass Edge Highlight */}
          <div 
            className="absolute top-0 inset-x-0 h-40 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(255, 255, 255, 0) 100%)',
            }}
          />

          {/* Diagonal Frosted Glass Sheen Reflection */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: 'linear-gradient(125deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 45%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.5) 100%)',
            }}
          />

          {/* Bottom Horizon Luminous Silver-White Glass Horizon behind the wordmark */}
          <div 
            className="absolute -bottom-20 sm:-bottom-32 left-1/2 -translate-x-1/2 w-[160%] sm:w-[130%] h-[70%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255, 255, 255, 0.28) 0%, rgba(200, 205, 215, 0.10) 40%, rgba(4, 4, 5, 0) 80%)',
            }}
          />

          {/* Film grain noise overlay for authentic photographic texture */}
          <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        </div>

        {/* Top Section: Three Columns (Navigation, Social, Legals) with Large Headings */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 sm:gap-14 lg:gap-24">
            
            {/* Column 1: Navigation */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Navigation
              </h3>
              <nav className="flex flex-col gap-2.5 sm:gap-3.5" aria-label="Footer Navigation">
                <Link
                  href="/about"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  About
                </Link>
                <Link
                  href="/shop"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  Works
                </Link>
                <Link
                  href="/lookbook"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Column 2: Social */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Social
              </h3>
              <div className="flex flex-col gap-2.5 sm:gap-3.5">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  Twitter(X)
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  Instagram
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  YouTube
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Column 3: Legals */}
            <div className="flex flex-col gap-4 sm:gap-6 col-span-2 md:col-span-1">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Legals
              </h3>
              <div className="flex flex-col gap-2.5 sm:gap-3.5">
                <Link
                  href="/contact"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/contact"
                  className="text-base sm:text-lg text-white/65 hover:text-white transition-colors duration-200 tracking-normal inline-block w-fit"
                >
                  Term of Service
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Middle Meta Row: Copyright */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16">
          <div className="w-full pt-6 border-t border-white/10 text-xs sm:text-sm text-white/50 font-sans">
            <p>
              © {new Date().getFullYear()} Pandora Visuals. All rights reserved.
            </p>
          </div>
        </div>

        {/* Full-Width Monumental Brand Wordmark spanning entire card width */}
        <div className="relative z-10 w-full px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-24 sm:pb-28 md:pb-32 overflow-hidden">
          <Link
            href="/"
            className="w-full block select-none group"
            aria-label="Pandora Vizuals Home"
          >
            <PandoraLogo 
              theme="white"
              sizes="100vw"
              className="w-full h-auto text-white/95 group-hover:text-white transition-all duration-300 drop-shadow-[0_0_45px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_70px_rgba(255,255,255,0.7)]" 
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
