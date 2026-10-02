'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import TextScramble from './TextScramble';

export default function ScrollZoomLookbook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const calculateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollable > 0) {
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
        setScrollProgress(progress);
      }
      setIsMobile(window.innerWidth < 810);
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(calculateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    calculateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Framer mathematical mapping
  // Progress 0 to 0.60: clipPath expands from startInset down to 0
  const startInset = isMobile ? 22 : 34;
  const clipProgress = Math.min(scrollProgress / 0.6, 1);
  const currentInsetY = startInset * (1 - clipProgress);
  const currentInsetX = currentInsetY * 1.1;
  const borderRadius = currentInsetY > 0.5 ? 4 : 0;

  // Scale: 1.35 down to 1.00
  const imageScale = 1.35 - scrollProgress * 0.35;

  // Title translation and opacity: progress 0.15 to 0.75
  const titleProgress = Math.min(Math.max((scrollProgress - 0.15) / 0.6, 0), 1);
  const titleTranslateY = (1 - titleProgress) * 50; // 50px down to 0px
  const titleOpacity = Math.min(Math.max((scrollProgress - 0.12) / 0.38, 0), 1);

  // Dark overlay: 0 to 0.45 from 0.3 to 0.9
  const darkOverlayOpacity = Math.min(Math.max((scrollProgress - 0.3) / 0.6, 0), 0.45);

  // Percentage counter string: 000% to 100%
  const percentString = `${String(Math.round(scrollProgress * 100)).padStart(3, '0')}%`;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0c0c0b] border-b border-[#ece8e1]/10"
      style={{ height: '280vh' }}
    >
      {/* Sticky Fullscreen Cinema Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 sm:p-12">
        {/* Expanding Background Image with Clip-Path & Zoom */}
        <div
          className="absolute inset-0 overflow-hidden will-change-transform z-0"
          style={{
            clipPath: `inset(${currentInsetY.toFixed(2)}% ${currentInsetX.toFixed(2)}% ${currentInsetY.toFixed(2)}% ${currentInsetX.toFixed(2)}% round ${borderRadius}px)`,
          }}
        >
          <div
            className="relative w-full h-full will-change-transform"
            style={{
              transform: `scale(${imageScale.toFixed(3)})`,
            }}
          >
            <Image
              src="https://framerusercontent.com/images/i7GXd7j0ZuZK0DjqGwubN4b7JNI.jpg?width=2400&height=1600"
              alt="Lookbook Chapter 04 — Worn in the dark"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          {/* Dark Overlay Vignette */}
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-150"
            style={{ opacity: darkOverlayOpacity }}
          />
        </div>

        {/* Top Info Bar */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono tracking-widest text-[#ece8e1] uppercase select-none">
          <div className="flex items-center space-x-2">
            <span className="text-[#ff3d17] font-bold">(03)</span>
            <TextScramble text="— CINEMATIC VISUAL ARCHIVE" />
          </div>
          <div className="font-mono tabular-nums text-xs text-[#8c8880]">
            {percentString}
          </div>
        </div>

        {/* Center / Bottom Giant Editorial Headline */}
        <div
          className="relative z-10 space-y-4 my-auto py-12 text-center will-change-transform"
          style={{
            transform: `translateY(${titleTranslateY.toFixed(1)}px)`,
            opacity: titleOpacity,
          }}
        >
          <h2 className="font-anton text-5xl sm:text-8xl md:text-9xl lg:text-[11vw] leading-[0.88] text-[#ece8e1] tracking-tighter uppercase select-none">
            CAPTURED IN THE MOMENT
          </h2>
          <p className="font-mono text-xs sm:text-sm tracking-widest text-[#dcd6cc] uppercase">
            SHOT ON CINEMA GLASS & SONY FX SERIES — UNFILTERED EMOTION
          </p>
          <div className="pt-4">
            <Link
              href="/lookbook"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-[#ece8e1] text-[#0c0c0b] font-bold px-6 py-3.5 hover:bg-[#ff3d17] hover:text-[#0c0c0b] transition-all shadow-lg"
            >
              <span>EXPLORE VISUAL ARCHIVE</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Metadata Grid */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#ece8e1]/20 text-[11px] font-mono tracking-widest text-[#dcd6cc] uppercase select-none">
          <div>4K Cinema & Reels</div>
          <div>Milestone Celebrations</div>
          <div>Color Grading & Audio</div>
          <div>Digital Growth & Ads</div>
        </div>
      </div>
    </section>
  );
}
