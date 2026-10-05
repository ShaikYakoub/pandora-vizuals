'use client';

import React from 'react';
import Link from 'next/link';
import PandoraLogo from './PandoraLogo';

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden select-none bg-[#0c0c0b] text-[#ece8e1] border-t border-[#ece8e1]/10 flex flex-col justify-between">
      {/* Subtle Noise Texture Overlay matching the rest of the website */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none z-0" aria-hidden="true" />

      {/* Top Section: Three Columns (Navigation, Social, Legals) with Large Headings */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 sm:gap-14 lg:gap-24">
          
          {/* Column 1: Social */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#ece8e1]">
              Social
            </h3>
            <div className="flex flex-col gap-2.5 sm:gap-3.5">
              <a
                href="https://www.instagram.com/pandoravizuals"
                target="_blank"
                rel="noreferrer"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit"
              >
                Instagram
              </a>
              <a
                href="https://www.youtube.com/@PandoraVizuals"
                target="_blank"
                rel="noreferrer"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit"
              >
                YouTube
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61595026984781"
                target="_blank"
                rel="noreferrer"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#ece8e1]">
              Navigation
            </h3>
            <nav className="flex flex-col gap-2.5 sm:gap-3.5" aria-label="Footer Navigation">
              <Link
                href="/contact#about"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit"
              >
                About
              </Link>
              <Link
                href="/shop"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit"
              >
                Works
              </Link>
              <Link
                href="/lookbook"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit"
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col gap-4 sm:gap-6 col-span-2 md:col-span-1">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#ece8e1]">
              Legal
            </h3>
            <div className="flex flex-col gap-2.5 sm:gap-3.5">
              <Link
                href="/contact"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit"
              >
                Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit"
              >
                Term of Service
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Middle Meta Row: Copyright */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="w-full pt-6 border-t border-[#ece8e1]/10 text-xs sm:text-sm text-[#ece8e1]/50 font-sans">
          <p>
            © {new Date().getFullYear()} Pandora Visuals. All rights reserved.
          </p>
        </div>
      </div>

      {/* Full-Width Monumental Brand Wordmark spanning entire width edge-to-edge */}
      <div className="relative z-10 w-full px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-24 sm:pb-28 md:pb-32 overflow-hidden">
        <Link
          href="/"
          className="w-full block select-none cursor-pointer"
          aria-label="Pandora Vizuals Home"
        >
          <PandoraLogo 
            theme="white"
            className="w-full h-auto text-[#ece8e1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]" 
          />
        </Link>
      </div>
    </footer>
  );
}
