'use client';

import React from 'react';
import FramerHeading from '@/components/FramerHeading';
import SocialBrandLogo, { SocialPlatform } from '@/components/SocialBrandLogo';

export default function ContactPage() {
  const socials: { name: string; platform: SocialPlatform; url: string }[] = [
    {
      name: 'Instagram',
      platform: 'instagram',
      url: 'https://www.instagram.com/pandoravizuals',
    },
    {
      name: 'YouTube',
      platform: 'youtube',
      url: 'https://www.youtube.com/@PandoraVizuals',
    },
    {
      name: 'Facebook',
      platform: 'facebook',
      url: 'https://www.facebook.com/profile.php?id=61595026984781',
    },
  ];

  return (
    <div
      id="about"
      className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 sm:px-8 selection:bg-[#ff3d17] selection:text-[#0c0c0b]"
    >
      <div className="max-w-[1400px] mx-auto text-center space-y-12 sm:space-y-16">
        {/* Main Heading */}
        <div className="pb-8 sm:pb-12 border-b border-[#ece8e1]/10">
          <FramerHeading
            text="Get in touch"
            as="h1"
            className="font-dune text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] tracking-tight uppercase text-[#ece8e1]"
          />
        </div>

        {/* Email & Phone with Dune Font Headings */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 pt-2">
          {/* Email Block */}
          <div className="space-y-3 flex flex-col items-center">
            <span className="font-dune font-bold text-base sm:text-lg tracking-[0.18em] text-[#ece8e1] inline-block border-b-2 border-[#ff3d17] pb-1 uppercase [-webkit-text-stroke:0.6px_currentColor]">
              EMAIL
            </span>
            <a
              href="mailto:pandoravisualsat@gmail.com"
              className="font-sans font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#ece8e1] hover:text-[#ff3d17] transition-colors duration-200 block tracking-tight"
            >
              pandoravisualsat@gmail.com
            </a>
          </div>

          <div className="hidden sm:block w-px h-16 bg-[#ece8e1]/10" />

          {/* Phone Block */}
          <div className="space-y-3 flex flex-col items-center">
            <span className="font-dune font-bold text-base sm:text-lg tracking-[0.18em] text-[#ece8e1] inline-block border-b-2 border-[#ff3d17] pb-1 uppercase [-webkit-text-stroke:0.6px_currentColor]">
              PHONE
            </span>
            <a
              href="tel:+916309897003"
              className="font-sans font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#ece8e1] hover:text-[#ff3d17] transition-colors duration-200 block tracking-tight"
            >
              +91 63098 97003
            </a>
          </div>
        </div>

        {/* Horizontal List of Socials under Dune Font Heading */}
        <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center space-y-6">
          <span className="font-dune font-bold text-base sm:text-lg tracking-[0.18em] text-[#ece8e1] inline-block border-b-2 border-[#ff3d17] pb-1 uppercase [-webkit-text-stroke:0.6px_currentColor]">
            SOCIAL
          </span>

          <div className="flex flex-wrap items-center justify-center gap-7 sm:gap-10 md:gap-12 pt-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Pandora Visuals ${social.name}`}
                className="inline-flex items-center"
              >
                <SocialBrandLogo
                  platform={social.platform}
                  theme="white"
                  className="h-8 sm:h-10 md:h-11 w-auto"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
