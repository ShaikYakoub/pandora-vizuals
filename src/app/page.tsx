'use client';

import React from 'react';
import ImageTrail from '@/components/ImageTrail';
import DropScroller from '@/components/DropScroller';
import Moodboard from '@/components/Moodboard';
import StudioHeading from '@/components/StudioHeading';
import CameraCTAButton from '@/components/CameraCTAButton';

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
          <StudioHeading
            text="Visuals crafted for moments that refuse to fade."
            as="h1"
            variant="subtle"
            className="font-unica text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ece8e1] max-w-5xl tracking-normal leading-tight"
          />

          {/* Camera-Styled Sharp Box CTA Button */}
          <div className="relative z-30 pointer-events-auto pt-2">
            <CameraCTAButton href="/work/" ariaLabel="Explore The Work">
              EXPLORE WORK
            </CameraCTAButton>
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
