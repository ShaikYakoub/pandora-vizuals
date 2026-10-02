'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function AboutPage() {
  const pillars = [
    {
      num: '01',
      title: 'ZERO SEASONS',
      desc: 'We do not follow fashion weeks, drop schedules, or markdowns. A piece exists until the fabric run is finished.',
    },
    {
      num: '02',
      title: 'ELEVEN ARTISANS',
      desc: 'Our single atelier in Porto houses our entire team of cutters, pattern-makers, pressers, and tailors under one roof.',
    },
    {
      num: '03',
      title: 'RUNS OF 27',
      desc: 'Most garments are cut in strictly limited editions of twenty-seven numbered units. When it is gone, it is archived.',
    },
    {
      num: '04',
      title: 'LIFETIME PATINA',
      desc: 'Heavy raw selvedge wool, unwashed denim, and veg-tanned leather designed to soften and mold to the wearer over decades.',
    },
  ];

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-12 sm:py-20 px-4 sm:px-8">
      <div className="max-w-[1720px] mx-auto space-y-20">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
          <div>(About) — Bureau27 since 2019</div>
          <div>PORTO, PORTUGAL</div>
        </div>

        {/* Hero Title */}
        <div className="space-y-6 pb-12 border-b border-[#ece8e1]/10">
          <h1 className="font-anton text-6xl sm:text-8xl lg:text-[11vw] leading-[0.88] tracking-tight text-[#ece8e1] uppercase">
            MADE SLOWLY. <br className="hidden sm:inline" />
            <span className="text-[#ff3d17]">WORN LOUDLY.</span>
          </h1>
          <p className="font-serif-italic text-2xl sm:text-3xl lg:text-4xl text-[#ece8e1] max-w-3xl leading-relaxed pt-4">
            Bureau27 is an avant-garde studio founded on the belief that clothing should be permanent, architectural, and defiant of commercial seasons.
          </p>
        </div>

        {/* Studio Hero Image */}
        <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full bg-[#171716] overflow-hidden border border-[#ece8e1]/15">
          <Image
            src="https://framerusercontent.com/images/NSzlXc18chTtPGHfqMdIKqgd67Q.jpg?width=2400&height=1600"
            alt="Porto Atelier Table"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-[#ece8e1]/10">
          <div className="lg:col-span-4 space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff3d17] font-bold">
              THE MANIFESTO
            </span>
            <h2 className="font-anton text-4xl text-[#ece8e1]">
              WHY 27?
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 font-sans text-base sm:text-lg text-[#8c8880] leading-relaxed">
            <p>
              In 2019, we set up three antique cutting tables on Rua das Flores in Porto. We noticed that modern fashion had become an extractive machine designed around inventory clearance dates rather than human movement.
            </p>
            <p>
              The number 27 was our first run: twenty-seven overcoats hand-cut from deadstock military wool found in a warehouse outside Guimarães. They sold to twenty-seven strangers across Europe in forty-eight hours. We decided that every pattern we ever made would honor that proportion: small runs, exact attention, no surplus, no markdowns.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-[#ece8e1]/10">
          {pillars.map((p) => (
            <div key={p.num} className="space-y-4 border border-[#ece8e1]/10 bg-[#141413] p-8">
              <span className="font-mono text-xs text-[#ff3d17] font-bold tracking-widest">
                ({p.num})
              </span>
              <h3 className="font-anton text-2xl text-[#ece8e1] tracking-wide">
                {p.title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#8c8880] leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="p-12 sm:p-16 bg-[#171716] border border-[#ece8e1]/15 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-anton text-3xl sm:text-4xl text-[#ece8e1]">
              EXPERIENCE THE SS27 DROP
            </h3>
            <p className="font-mono text-xs text-[#8c8880] tracking-wider uppercase">
              Limited runs available until roll exhaustion.
            </p>
          </div>
          <Link
            href="/shop"
            className="bureau-btn bureau-btn-primary whitespace-nowrap"
          >
            <span>VISIT THE SHOP</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
