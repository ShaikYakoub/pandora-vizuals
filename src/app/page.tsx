'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImageTrail from '@/components/ImageTrail';
import TextScramble from '@/components/TextScramble';
import ManifestoScroll from '@/components/ManifestoScroll';
import DropScroller from '@/components/DropScroller';
import ProductCard from '@/components/ProductCard';
import FramerHeading from '@/components/FramerHeading';
import ScrollZoomLookbook from '@/components/ScrollZoomLookbook';
import CrossedTicker from '@/components/CrossedTicker';
import Moodboard from '@/components/Moodboard';
import JournalTeaser from '@/components/JournalTeaser';
import StockedAtTicker from '@/components/StockedAtTicker';
import { useCards } from '@/context/CardsContext';
import { ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  const { sectionCards: editProducts } = useCards('home-edit');

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] flex flex-col">
      {/* Hero Cover Section with Interactive Image Trail */}
      <section className="relative h-screen min-h-[640px] sm:min-h-[720px] max-h-[1080px] flex flex-col justify-between px-4 sm:px-10 pt-20 sm:pt-24 pb-8 sm:pb-10 border-b border-[#ece8e1]/10 overflow-hidden bg-noise select-none">
        {/* Interactive Pointer Image Trail */}
        <ImageTrail />

        {/* Ambient Subtle Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff3d17]/5 rounded-full blur-[140px] pointer-events-none" />


        {/* Center Editorial Quote & Camera CTA Button */}
        <div className="relative z-30 flex-1 flex flex-col items-center justify-center text-center px-4 my-auto py-6 pointer-events-none gap-8 sm:gap-10">
          <FramerHeading
            text="Visuals crafted for moments that refuse to fade."
            as="h2"
            variant="subtle"
            className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ece8e1] max-w-5xl tracking-tight leading-tight"
          />

          {/* Camera-Styled Sharp Box CTA Button */}
          <div className="relative z-30 pointer-events-auto pt-2">
            <Link
              href="/shop"
              className="group relative z-30 inline-flex items-center gap-3.5 bg-[#0c0c0b]/85 hover:bg-[#ff3d17] text-[#ece8e1] hover:text-[#0c0c0b] border border-[#ece8e1]/30 hover:border-[#ff3d17] px-6 sm:px-8 py-3 sm:py-3.5 transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.85)] hover:shadow-[0_0_24px_rgba(255,61,23,0.6)] active:translate-y-0.5 active:scale-[0.98] select-none rounded-none backdrop-blur-md"
              aria-label="Explore The Work"
            >
              {/* Camera Shutter Indicator Dot */}
              <span className="w-2 h-2 rounded-full bg-[#ff3d17] group-hover:bg-[#0c0c0b] shadow-[0_0_8px_#ff3d17] group-hover:shadow-none transition-colors shrink-0" />

              {/* Shutter Label in Dune Font */}
              <span className="font-dune text-xs sm:text-sm tracking-[0.18em] uppercase font-bold">
                EXPLORE WORK
              </span>

              {/* Directional Shutter Arrow */}
              <ArrowUpRight className="w-4 h-4 text-[#ece8e1] group-hover:text-[#0c0c0b] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />

              {/* Sharp Camera Corner Viewfinder Brackets */}
              <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors" />
              <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors" />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* (01) — MANIFESTO with word reveal on scroll */}
      <ManifestoScroll />

      {/* (02) — THE DROP (Pinned horizontal scroll gallery with velocity skew) */}
      <DropScroller />

      {/* (02) — THE EDIT (Signature Productions grid with 3D scroll tilt) */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-[#0c0c0b]">
        <div className="max-w-[1720px] mx-auto space-y-12">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#ece8e1]/10 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#8c8880] uppercase mb-2">
                <span className="text-[#ff3d17] font-bold">(02)</span>
                <TextScramble text="— FEATURED PRODUCTIONS" />
              </div>
              <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-[#ece8e1] tracking-tight">
                CURATED FRAMES, TIMELESS STORIES.
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#ece8e1] border border-[#ece8e1]/20 px-6 py-3.5 hover:border-[#ff3d17] hover:text-[#ff3d17] transition-all bg-[#171716]"
            >
              <span>VIEW ALL WORK</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Dynamic Products Grid with 3D perspective enter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
            {editProducts.map((card, idx) => (
              <ProductCard key={card.id} card={card} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* (03) — LOOKBOOK, CHAPTER 04 (Pinned 280vh Scroll Zoom Lookbook) */}
      <ScrollZoomLookbook />

      {/* Kinetic Crossed Ticker with Scroll Scrubbing */}
      <CrossedTicker />

      {/* (04) — MOODBOARD (Draggable Polaroids with Parallax) */}
      <Moodboard />

      {/* (05) — JOURNAL (Notes from the Atelier - Full-Width Editorial Rows) */}
      <JournalTeaser />

      {/* Boutiques Ticker Marquee */}
      <StockedAtTicker />
    </div>
  );
}
