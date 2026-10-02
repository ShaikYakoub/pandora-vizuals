'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import FramerHeading from '@/components/FramerHeading';
import FramerReveal from '@/components/FramerReveal';

export default function AboutPage() {
  const stats = [
    { num: '500+', label: 'EVENTS & SHOOTS CAPTURED', isOrange: false },
    { num: '10M+', label: 'ORGANIC REEL VIEWS', isOrange: true },
    { num: '100%', label: 'CINEMATIC 4K MASTERS', isOrange: false },
    { num: '08', label: 'CREATIVES BEHIND THE LENS', isOrange: false },
  ];

  const timeline = [
    {
      year: '2019',
      title: 'First Camera, First Frame',
      desc: 'Founded with a single cinema camera, documenting intimate family milestones and candid street portraiture.',
    },
    {
      year: '2021',
      title: 'Studio & Lighting Lab',
      desc: 'Opened our dedicated visual production studio with specialized setups for newborn, cake smash, and editorial portraits.',
    },
    {
      year: '2023',
      title: 'Viral Reels & Short-Form',
      desc: 'Pioneered high-velocity cinematic reels for events and brands, crossing 10M+ organic impressions across platforms.',
    },
    {
      year: '2025',
      title: 'Milestone Celebrations',
      desc: 'Covered hundreds of 1st birthdays, adult milestone galas, private celebrations, and brand launches.',
    },
    {
      year: '2027',
      title: 'Full-Funnel Digital Growth',
      desc: 'Unifying cinema-grade visual storytelling with high-ROI social media management, paid ads, and brand marketing.',
    },
  ];

  const team = [
    {
      name: 'Tomás Reis',
      role: 'FOUNDER & LEAD CINEMATOGRAPHER',
      image: 'https://framerusercontent.com/images/nZgRReIfcykI5NRr7OB4w4W0.jpg?width=1200&height=1800',
    },
    {
      name: 'Lena Okafor',
      role: 'HEAD OF CREATIVE & DIGITAL MARKETING',
      image: 'https://framerusercontent.com/images/IfjRLOCPu12FT7PTsmqggBvSB3I.jpg?width=1200&height=1800',
    },
    {
      name: 'Mia Santos',
      role: 'LEAD EVENT & PORTRAIT PHOTOGRAPHER',
      image: 'https://framerusercontent.com/images/YuZUfwh260mN36Ar0UOPABK4V6Q.jpg?width=1200&height=1500',
    },
  ];

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-24 sm:space-y-36">
        
        {/* Top Meta Bar */}
        <FramerReveal delay={0.02} yOffset={10}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] animate-pulse" />
              <span>(About) — Pandora Visuals Studio</span>
            </div>
            <div>STUDIO & ON-LOCATION PRODUCTION</div>
          </div>
        </FramerReveal>

        {/* Hero Title */}
        <div className="space-y-6 pb-12 border-b border-[#ece8e1]/10">
          <FramerHeading
            lines={['FRAME THE MOMENT.', 'CAPTURE THE SOUL.']}
            as="h1"
            className="font-anton text-7xl sm:text-9xl lg:text-[168px] leading-[0.88] tracking-[-0.01em] uppercase text-[#ece8e1]"
          />
        </div>

        {/* Hero Atelier Visual & Sections */}
        <FramerReveal delay={0.2} yOffset={32} className="space-y-24 sm:space-y-36">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#171716] overflow-hidden">
          <span className="absolute top-4 left-4 z-10 bg-[#ff3d17] text-[#0c0c0b] text-xs font-mono font-bold px-3 py-1 tracking-wider uppercase">
            PANDORA VISUALS — PRODUCTION LAB & STAGE
          </span>
          <Image
            src="https://framerusercontent.com/images/8rwex56qBkVkbQOq9L9NfilS1c.jpg?width=2400&height=1600"
            alt="Pandora Visuals Production Studio"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* (01) — THE STORY */}
        <div className="space-y-16 border-b border-[#ece8e1]/10 pb-24">
          <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10">
            (01) — THE VISION
          </div>

          <h2 className="font-anton text-4xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-tight uppercase text-[#ece8e1] max-w-6xl">
            Pandora Visuals was built on one belief: moments deserve cinema. From vibrant child birthdays and milestone adult events to high-converting reels and digital growth, we capture the raw{' '}
            <span className="font-serif italic text-[#ff3d17] lowercase font-normal">energy</span> of every story.
          </h2>

          {/* 4 Monumental Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2 border-t border-[#ece8e1]/10 pt-6">
                <div
                  className={`font-anton text-7xl sm:text-9xl lg:text-[112px] leading-none ${
                    stat.isOrange ? 'text-[#ff3d17]' : 'text-[#ece8e1]'
                  }`}
                >
                  {stat.num}
                </div>
                <div className="font-mono text-xs tracking-widest text-[#8c8880] uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* (02) — TIMELINE */}
        <div className="space-y-16 border-b border-[#ece8e1]/10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Sticky Header */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
              <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase">
                (02) — OUR JOURNEY
              </div>
              <h2 className="font-anton text-5xl sm:text-7xl lg:text-[100px] leading-[0.9] tracking-tight uppercase text-[#ece8e1]">
                BEHIND THE <br />
                CAMERA
              </h2>
            </div>

            {/* Right Timeline Rows */}
            <div className="lg:col-span-7 divide-y divide-[#ece8e1]/10">
              {timeline.map((item) => (
                <div key={item.year} className="py-8 sm:py-10 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-12">
                  <div className="font-anton text-5xl sm:text-6xl text-[#ff3d17] w-28 shrink-0">
                    {item.year}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[#ece8e1]">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-[#8c8880] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* (03) — THE PEOPLE */}
        <div className="space-y-12 pb-12">
          <div className="space-y-4">
            <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase">
              (03) — THE CREATIVES
            </div>
            <h2 className="font-anton text-6xl sm:text-8xl lg:text-[112px] leading-[0.9] tracking-tight uppercase text-[#ece8e1]">
              MINDS BEHIND THE VISION
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {team.map((member) => (
              <div key={member.name} className="group flex flex-col space-y-4">
                <div className="relative aspect-[3/4.2] w-full bg-[#171716] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans text-lg font-medium text-[#ece8e1]">
                    {member.name}
                  </h4>
                  <div className="font-mono text-xs tracking-widest text-[#8c8880] uppercase">
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Bleed Vermilion CTA Banner */}
        <div className="w-full bg-[#ff3d17] text-[#0c0c0b] p-8 sm:p-16 lg:p-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <h2 className="font-anton text-5xl sm:text-7xl lg:text-[96px] leading-[0.9] tracking-tight uppercase text-[#0c0c0b]">
            WANT TO WORK WITH US?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0c0c0b] text-[#ece8e1] hover:bg-black font-mono text-xs uppercase tracking-widest px-8 py-5 shrink-0 transition-colors cursor-pointer"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        </FramerReveal>

      </div>
    </div>
  );
}
