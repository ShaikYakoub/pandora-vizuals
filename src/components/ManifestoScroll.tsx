'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import TextScramble from './TextScramble';

const MANIFESTO_TEXT = 'We capture stories that outlive the moment. Viral reels, candid milestone celebrations, visual campaigns engineered to inspire.';
const ACCENT_WORDS = new Set(['stories', 'celebrations', 'inspire']);

export default function ManifestoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const calculateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Range: start unblurring when top of container reaches 85% of viewport
      // Finish unblurring when bottom reaches 45% of viewport
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.40;

      const progress = (start - rect.top) / (rect.height + (start - end));
      const clamped = Math.min(Math.max(progress, 0), 1);
      setScrollProgress(clamped);
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

  const rawWords = MANIFESTO_TEXT.split(' ');

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-36 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-[#0c0c0b] overflow-hidden"
    >
      <div className="max-w-[1720px] mx-auto space-y-16">
        {/* Label Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-6 border-b border-[#ece8e1]/10 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[#ff3d17] font-bold">(01)</span>
            <TextScramble text="— MANIFESTO" />
          </div>
          <div>
            <TextScramble text="EST. 2019 — VISUAL PRODUCTION" />
          </div>
        </div>

        {/* Scroll Text Reveal Typography */}
        <div className="max-w-6xl">
          <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.98] sm:leading-[0.94] tracking-tight text-[#ece8e1]">
            {rawWords.map((wordWithPunct, index) => {
              const cleanWord = wordWithPunct.toLowerCase().replace(/[^a-z0-9]/g, '');
              const isAccent = ACCENT_WORDS.has(cleanWord);

              // Calculate individual word interpolation window
              const totalWords = rawWords.length;
              const wordStart = index / totalWords;
              const wordEnd = (index + 1) / totalWords;

              // Local progress for this word: 0 to 1
              const localProgress = Math.min(
                Math.max((scrollProgress - wordStart) / (wordEnd - wordStart), 0),
                1
              );

              // Smooth interpolation
              const blurAmount = (1 - localProgress) * 7; // 7px down to 0px
              const translateY = (1 - localProgress) * 0.18; // 0.18em down to 0em
              const opacity = 0.14 + localProgress * 0.86;

              return (
                <span
                  key={index}
                  className="inline-block mr-3 sm:mr-5 whitespace-pre select-none will-change-transform"
                  style={{
                    filter: `blur(${blurAmount.toFixed(1)}px)`,
                    transform: `translateY(${translateY.toFixed(3)}em)`,
                    opacity,
                    color: isAccent
                      ? localProgress > 0.4
                        ? '#ff3d17'
                        : 'rgba(236, 232, 225, 0.14)'
                      : localProgress > 0.1
                      ? '#ece8e1'
                      : 'rgba(236, 232, 225, 0.14)',
                  }}
                >
                  {isAccent ? (
                    <span className="font-serif-italic font-normal lowercase tracking-normal">
                      {wordWithPunct}
                    </span>
                  ) : (
                    wordWithPunct
                  )}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Story Subtext & Action */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#ece8e1]/10 items-end">
          <div className="md:col-span-8 lg:col-span-7">
            <p className="font-sans text-base sm:text-lg text-[#8c8880] leading-relaxed">
              At Pandora Visuals, we blend cinematic storytelling with digital strategy. From high-energy viral reels and intimate child milestone birthdays to luxury adult celebrations and full-scale brand campaigns — every frame is directed with soul and technical precision.
            </p>
          </div>
          <div className="md:col-span-4 lg:col-span-5 flex md:justify-end">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 group font-mono text-xs uppercase tracking-widest text-[#ece8e1] border border-[#ece8e1]/20 px-6 py-4 hover:border-[#ff3d17] hover:text-[#ff3d17] transition-all bg-[#171716]"
            >
              <span>READ OUR STORY</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
