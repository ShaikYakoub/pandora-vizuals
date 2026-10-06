'use client';

import React from 'react';
import Link from 'next/link';
import ImageTrail from '@/components/ImageTrail';
import DropScroller from '@/components/DropScroller';
import Moodboard from '@/components/Moodboard';
import FramerHeading from '@/components/FramerHeading';
import { ArrowUpRight } from 'lucide-react';

export default function HomePage() {
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
            as="h1"
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

      {/* THE DROP (Pinned horizontal scroll gallery with velocity skew) — RECENT WORKS */}
      <DropScroller />

      {/* FRAME IT. SHOOT IT. FEEL IT. — Interactive Draggable Moodboard */}
      <Moodboard />
    </div>
  );
}
