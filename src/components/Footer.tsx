'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PandoraLogo from './PandoraLogo';

import SocialBrandLogo from './SocialBrandLogo';

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
            <div className="flex flex-col gap-3.5 sm:gap-4.5">
              <a
                href="https://www.instagram.com/pandoravizuals"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center w-fit group"
                aria-label="Pandora Visuals Instagram (#pandoravizuals)"
              >
                <SocialBrandLogo
                  platform="instagram"
                  username="#pandoravizuals"
                  theme="white"
                  iconClassName="w-5 h-5 sm:w-6 sm:h-6"
                  textClassName="text-base sm:text-lg text-[#ece8e1]/75 group-hover:text-[#ece8e1] transition-colors duration-200 font-sans"
                />
              </a>
              <a
                href="https://www.youtube.com/@PandoraVizuals"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center w-fit group"
                aria-label="Pandora Visuals YouTube (@PandoraVizuals)"
              >
                <SocialBrandLogo
                  platform="youtube"
                  username="@PandoraVizuals"
                  theme="white"
                  iconClassName="w-6 h-4.5 sm:w-7 sm:h-5"
                  textClassName="text-base sm:text-lg text-[#ece8e1]/75 group-hover:text-[#ece8e1] transition-colors duration-200 font-sans"
                />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61595026984781"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center w-fit group"
                aria-label="Pandora Visuals Facebook (@Pandora Vizuals)"
              >
                <SocialBrandLogo
                  platform="facebook"
                  username="@Pandora Vizuals"
                  theme="white"
                  iconClassName="w-5 h-5 sm:w-6 sm:h-6"
                  textClassName="text-base sm:text-lg text-[#ece8e1]/75 group-hover:text-[#ece8e1] transition-colors duration-200 font-sans"
                />
              </a>
            </div>
          </div>

          {/* Column 2: Contact */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#ece8e1]">
              Contact
            </h3>
            <div className="flex flex-col gap-2.5 sm:gap-3.5">
              <a
                href="tel:+916309897003"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit font-sans"
              >
                +91 63098 97003
              </a>
              <a
                href="mailto:pandoravisualsat@gmail.com"
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit font-sans"
              >
                pandoravisualsat@gmail.com
              </a>
            </div>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col gap-4 sm:gap-6 col-span-2 md:col-span-1">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#ece8e1]">
              Legal
            </h3>
            <div className="flex flex-col gap-2.5 sm:gap-3.5">
              <Link
                href="/terms/"
                prefetch={false}
                className="text-base sm:text-lg text-[#ece8e1]/65 hover:text-[#ece8e1] transition-colors duration-200 tracking-normal inline-block w-fit font-sans"
              >
                Terms & Policy
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Middle Meta Row: Copyright & Website by Techmecs */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="w-full py-8 sm:py-10 border-t border-[#ece8e1]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-base sm:text-lg text-[#ece8e1]/80 font-sans">
          <p>
            © {new Date().getFullYear()} Pandora Visuals. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-[#ece8e1]/65">Website by</span>
            <a
              href="https://techmecs.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Techmecs (opens in a new tab)"
              className="inline-flex items-center transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/techmecs-logo-white.webp"
                alt="Techmecs"
                width={136}
                height={24}
                className="h-5 sm:h-6 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Full-Width Monumental Brand Wordmark spanning entire width edge-to-edge */}
      <div className="relative z-10 w-full px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-24 sm:pb-28 md:pb-32 overflow-hidden">
        <Link
          href="/"
          prefetch={false}
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
