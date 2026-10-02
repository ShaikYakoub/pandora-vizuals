'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { num: '11', label: 'PEOPLE IN THE ATELIER', isOrange: false },
    { num: '01', label: 'ROOM IN PORTO', isOrange: false },
    { num: '00', label: 'MARKDOWNS, EVER', isOrange: true },
    { num: '27', label: 'STOCKISTS WORLDWIDE', isOrange: false },
  ];

  const timeline = [
    {
      year: '2019',
      title: 'The first coat',
      desc: 'Cut on a kitchen table in Porto from end-of-roll Scottish tweed.',
    },
    {
      year: '2021',
      title: 'The atelier opens',
      desc: 'We move above a tram depot on Rua das Flores and hire our first four tailors.',
    },
    {
      year: '2023',
      title: 'No more seasons',
      desc: 'We quit the fashion calendar. Pieces drop when they are ready and stay until they are gone.',
    },
    {
      year: '2025',
      title: '27 stockists',
      desc: 'From Paris to Seoul — independent stores that share one rule: no markdowns.',
    },
    {
      year: '2027',
      title: 'SS27 — No Season',
      desc: 'Our biggest drop yet, shot at 04:00 across four cities with one light.',
    },
  ];

  const team = [
    {
      name: 'Tomás Reis',
      role: 'FOUNDER & HEAD OF CUT',
      image: 'https://framerusercontent.com/images/nZgRReIfcykI5NRr7OB4w4W0.jpg?width=1200&height=1800',
    },
    {
      name: 'Lena Okafor',
      role: 'CREATIVE DIRECTOR',
      image: 'https://framerusercontent.com/images/IfjRLOCPu12FT7PTsmqggBvSB3I.jpg?width=1200&height=1800',
    },
    {
      name: 'Mia Santos',
      role: 'ATELIER LEAD',
      image: 'https://framerusercontent.com/images/YuZUfwh260mN36Ar0UOPABK4V6Q.jpg?width=1200&height=1500',
    },
  ];

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-24 sm:space-y-36">
        
        {/* Top Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] animate-pulse" />
            <span>(About) — Bureau27 since 2019</span>
          </div>
          <div>PORTO, PORTUGAL</div>
        </div>

        {/* Hero Title */}
        <div className="space-y-6 pb-12 border-b border-[#ece8e1]/10">
          <h1 className="font-anton text-7xl sm:text-9xl lg:text-[168px] leading-[0.88] tracking-[-0.01em] uppercase text-[#ece8e1]">
            MADE SLOWLY. <br />
            WORN LOUDLY.
          </h1>
        </div>

        {/* Hero Atelier Visual */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#171716] overflow-hidden">
          <span className="absolute top-4 left-4 z-10 bg-[#ff3d17] text-[#0c0c0b] text-xs font-mono font-bold px-3 py-1 tracking-wider uppercase">
            THE ATELIER — RUA DAS FLORES 27
          </span>
          <Image
            src="https://framerusercontent.com/images/8rwex56qBkVkbQOq9L9NfilS1c.jpg?width=2400&height=1600"
            alt="Bureau27 Atelier"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* (01) — THE STORY */}
        <div className="space-y-16 border-b border-[#ece8e1]/10 pb-24">
          <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10">
            (01) — THE STORY
          </div>

          <h2 className="font-anton text-4xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-tight uppercase text-[#ece8e1] max-w-6xl">
            Bureau27 began as a single overcoat, cut on a kitchen table in Porto. Eight years later we are eleven people, one atelier and a{' '}
            <span className="font-serif italic text-[#ff3d17] lowercase font-normal">refusal</span> to ever make more than we can sell.
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
                (02) — TIMELINE
              </div>
              <h2 className="font-anton text-5xl sm:text-7xl lg:text-[100px] leading-[0.9] tracking-tight uppercase text-[#ece8e1]">
                EIGHT YEARS, <br />
                ZERO SEASONS
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
              (03) — THE PEOPLE
            </div>
            <h2 className="font-anton text-6xl sm:text-8xl lg:text-[112px] leading-[0.9] tracking-tight uppercase text-[#ece8e1]">
              ELEVEN HANDS, ONE LINE
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

      </div>
    </div>
  );
}
