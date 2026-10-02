'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import FramerHeading from '@/components/FramerHeading';
import FramerReveal from '@/components/FramerReveal';

export default function LookbookPage() {
  const chapters = [
    {
      marker: 'CHAPTER 01 / 04',
      location: 'STUDIO & SOCIAL REELS',
      title: 'VIRAL MOTION',
      number: '01',
      image: 'https://framerusercontent.com/images/yK4XUXV4VZI7R1eOGyVAeBe8l0.jpg?width=2400&height=1600',
      description: 'High-velocity cinematic reels shot on cinema glass. Engineered with sound design, rhythmic cuts, and high viewer retention for social amplification.',
      link: '/shop',
    },
    {
      marker: 'CHAPTER 02 / 04',
      location: 'CHILDREN & MILESTONES',
      title: 'FIRST WONDERS',
      number: '02',
      image: 'https://framerusercontent.com/images/EdLfpUlrdNH789CJi2j2HF2mD7Y.jpg?width=2400&height=1645',
      description: 'Joyful, candid child birthday photography, 1st birthday cake smash sessions, and family documentary videography that preserves genuine childhood magic.',
      link: '/shop',
    },
    {
      marker: 'CHAPTER 03 / 04',
      location: 'ADULT CELEBRATIONS',
      title: 'GOLDEN HOURS',
      number: '03',
      image: 'https://framerusercontent.com/images/T3UZEpdSyxWwKNV8YQFWIOPDBs.jpg?width=2400&height=1600',
      description: 'Luxury adult milestone birthdays, anniversaries, and private parties captured with red-carpet lighting, candid portraits, and cinematic recap films.',
      link: '/shop',
    },
    {
      marker: 'CHAPTER 04 / 04',
      location: 'DIGITAL MARKETING',
      title: 'BRAND SIGNALS',
      number: '04',
      image: 'https://framerusercontent.com/images/n6REkd6XQ16HSjFB10nTvpTIkMA.jpg?width=2400&height=1898',
      description: 'Full-service digital marketing visual assets, ad creatives, commercial product shoots, and brand campaigns designed to scale conversion.',
      link: '/shop',
    },
  ];

  const uneditedLooks = [
    { id: 'look-01', number: 'FRAME 01', image: 'https://framerusercontent.com/images/ITfCMa6fwM1EtFnPePgDXLgovb4.jpg?width=1200&height=1756' },
    { id: 'look-02', number: 'FRAME 02', image: 'https://framerusercontent.com/images/aOct8Kl0eiH2U7ojU4vbCY1bcI.jpg?width=1200&height=2135' },
    { id: 'look-03', number: 'FRAME 03', image: 'https://framerusercontent.com/images/2Dw1MLUkbjRF06SMIb1vQYlA0.jpg?width=1200&height=1660' },
    { id: 'look-04', number: 'FRAME 04', image: 'https://framerusercontent.com/images/IfjRLOCPu12FT7PTsmqggBvSB3I.jpg?width=1200&height=1800' },
    { id: 'look-05', number: 'FRAME 05', image: 'https://framerusercontent.com/images/wCg2th1BsekyfxC3aXmZefpdLl0.jpg?width=1200&height=1800' },
    { id: 'look-06', number: 'FRAME 06', image: 'https://framerusercontent.com/images/Butfly2iiy6mcU5mDCTzOzBL4.jpg?width=1200&height=2004' },
    { id: 'look-07', number: 'FRAME 07', image: 'https://framerusercontent.com/images/LvZkIM2Ak56HncTjNbV8IDgqQ.jpg?width=1200&height=1800' },
    { id: 'look-08', number: 'FRAME 08', image: 'https://framerusercontent.com/images/WwbW1NfYszESZHlrDZen7rnF2Os.jpg?width=1200&height=1500' },
    { id: 'look-09', number: 'FRAME 09', image: 'https://framerusercontent.com/images/CzLrfmrzOW96YAq08D8PBYAjkY.jpg?width=1200&height=1800' },
  ];

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-20 sm:space-y-28">
        
        {/* Top Meta Bar */}
        <FramerReveal delay={0.02} yOffset={10}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] animate-pulse" />
              <span>(Visual Archive) — Productions in Four Chapters</span>
            </div>
            <div>SCROLL TO EXPLORE FRAMES</div>
          </div>
        </FramerReveal>

        {/* Hero Title */}
        <div className="space-y-6 pb-12 border-b border-[#ece8e1]/10">
          <FramerHeading
            text="CAPTURED IN 4K"
            as="h1"
            className="font-anton text-7xl sm:text-9xl lg:text-[168px] leading-[0.88] tracking-[-0.01em] uppercase text-[#ece8e1]"
          />
          <FramerReveal delay={0.15}>
            <p className="font-sans text-base sm:text-xl text-[#8c8880] max-w-2xl leading-relaxed">
              From viral reels and childhood milestone birthdays to adult celebrations and digital marketing campaigns — explore our signature visual productions.
            </p>
          </FramerReveal>
        </div>

        {/* 4 Chapters Stack */}
        <FramerReveal delay={0.22} yOffset={32}>
          <div className="space-y-36 sm:space-y-48">
          {chapters.map((ch, idx) => (
            <div key={idx} className="space-y-6 border-b border-[#ece8e1]/10 pb-20">
              
              {/* Chapter Meta Row */}
              <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase">
                <span className="text-[#ff3d17] font-bold">{ch.marker}</span>
                <span>{ch.location}</span>
              </div>

              {/* Full Bleed Chapter Visual */}
              <div className="relative aspect-[16/10] sm:aspect-[21/10] w-full bg-[#171716] overflow-hidden group">
                <Image
                  src={ch.image}
                  alt={ch.title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="100vw"
                  priority={idx === 0}
                />
                
                {/* Floating Chapter Number Overlay */}
                <div className="absolute bottom-6 right-6 font-anton text-6xl sm:text-8xl text-[#ece8e1]/30 select-none pointer-events-none">
                  {ch.number}
                </div>
              </div>

              {/* Chapter Title & Link Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-end">
                <div className="lg:col-span-8 space-y-4">
                  <h2 className="font-anton text-5xl sm:text-7xl lg:text-[96px] leading-[0.92] text-[#ece8e1] uppercase tracking-tight">
                    {ch.title}
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-[#8c8880] leading-relaxed max-w-2xl">
                    {ch.description}
                  </p>
                </div>

                <div className="lg:col-span-4 flex lg:justify-end">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-[#ece8e1] text-[#0c0c0b] font-bold px-6 py-4 hover:bg-[#ff3d17] transition-colors"
                  >
                    <span>VIEW WORK ARCHIVE</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          </div>
        </FramerReveal>

        {/* Section: EVERY FRAME, RAW & GRADED */}
        <FramerReveal delay={0.18} yOffset={32} className="space-y-12 sm:space-y-16 pt-8">
          <div className="space-y-4">
            <div className="text-xs font-mono tracking-widest text-[#ff3d17] uppercase">
              (Archive) — Production Stills & Contact Sheets
            </div>
            <FramerHeading
              text="EVERY FRAME, RAW & GRADED"
              as="h2"
              className="font-anton text-6xl sm:text-8xl lg:text-[112px] leading-[0.9] tracking-tight uppercase text-[#ece8e1]"
            />
          </div>

          {/* 3-Column Grid of 9 Editorial Looks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {uneditedLooks.map((look) => (
              <div key={look.id} className="group flex flex-col space-y-3">
                <div className="relative aspect-[3/4.2] w-full bg-[#171716] overflow-hidden">
                  <Image
                    src={look.image}
                    alt={look.number}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-[#0c0c0b]/80 backdrop-blur-sm text-[#ece8e1] text-[11px] font-mono px-2.5 py-1 tracking-wider uppercase">
                    {look.number}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FramerReveal>

      </div>
    </div>
  );
}
