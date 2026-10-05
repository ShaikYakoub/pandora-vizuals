'use client';

import React from 'react';
import FramerHeading from '@/components/FramerHeading';

export default function ContactPage() {
  const socials = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/pandoravizuals',
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61595026984781',
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@PandoraVizuals',
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
        </svg>
      ),
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
          <div className="space-y-2.5">
            <span className="font-dune text-xs sm:text-sm tracking-[0.16em] text-[#ff3d17] block">
              EMAIL
            </span>
            <a
              href="mailto:satpandora@gmail.com"
              className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#ece8e1] hover:text-[#ff3d17] transition-colors duration-200 block"
            >
              satpandora@gmail.com
            </a>
          </div>

          <div className="hidden sm:block w-px h-16 bg-[#ece8e1]/10" />

          {/* Phone Block */}
          <div className="space-y-2.5">
            <span className="font-dune text-xs sm:text-sm tracking-[0.16em] text-[#ff3d17] block">
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
        <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center space-y-5">
          <span className="font-dune text-xs sm:text-sm tracking-[0.16em] text-[#ff3d17] block">
            SOCIALS
          </span>

          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#ece8e1]/15 bg-[#141413] hover:border-[#ff3d17] hover:bg-[#ff3d17]/10 hover:text-[#ff3d17] text-[#ece8e1] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg group cursor-pointer"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
