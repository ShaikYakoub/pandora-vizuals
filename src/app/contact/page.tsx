'use client';

import React from 'react';
import StudioHeading from '@/components/StudioHeading';
import SocialBrandLogo, { SocialPlatform } from '@/components/SocialBrandLogo';

export default function ContactPage() {
  const socials: { name: string; platform: SocialPlatform; url: string; username: string }[] = [
    {
      name: 'Instagram',
      platform: 'instagram',
      url: 'https://www.instagram.com/pandoravizuals',
      username: '#pandoravizuals',
    },
    {
      name: 'YouTube',
      platform: 'youtube',
      url: 'https://www.youtube.com/@PandoraVizuals',
      username: '@PandoraVizuals',
    },
    {
      name: 'Facebook',
      platform: 'facebook',
      url: 'https://www.facebook.com/profile.php?id=61595026984781',
      username: '@Pandora Vizuals',
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
          <StudioHeading
            text="Get in touch"
            as="h1"
            className="font-unica text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] tracking-tight uppercase text-[#ece8e1]"
          />
        </div>

        {/* Email & Phone with Sans Font Headings */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 pt-2">
          {/* Email Block */}
          <div className="space-y-3.5 flex flex-col items-center">
            <span className="font-unica text-xl sm:text-2xl md:text-3xl tracking-[0.14em] text-[#ece8e1] inline-block border-b-2 border-[#ff3d17] pb-1 uppercase">
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
          <div className="space-y-3.5 flex flex-col items-center">
            <span className="font-unica text-xl sm:text-2xl md:text-3xl tracking-[0.14em] text-[#ece8e1] inline-block border-b-2 border-[#ff3d17] pb-1 uppercase">
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

        {/* Horizontal List of Socials under Sans Font Heading */}
        <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center space-y-6">
          <span className="font-unica text-xl sm:text-2xl md:text-3xl tracking-[0.14em] text-[#ece8e1] inline-block border-b-2 border-[#ff3d17] pb-1 uppercase">
            SOCIAL
          </span>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Pandora Visuals ${social.name} (${social.username})`}
                className="group inline-flex items-center"
              >
                <SocialBrandLogo
                  platform={social.platform}
                  username={social.username}
                  theme="white"
                  className="px-5 py-3 sm:px-6 sm:py-3.5 rounded-full border border-[#ece8e1]/15 bg-[#141413]/70 hover:border-[#ff3d17]/50 hover:bg-[#1a1a19] transition-all duration-200 shadow-lg"
                  iconClassName="w-6 h-6 sm:w-7 sm:h-7"
                  textClassName="text-base sm:text-lg md:text-xl font-sans font-semibold text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
