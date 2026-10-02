'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function ManifestoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far down the viewport the element is
      const total = rect.height + windowHeight;
      const current = windowHeight - rect.top;
      const progress = Math.min(Math.max(current / (total * 0.75), 0.1), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const words = [
    { text: 'We', highlight: false },
    { text: 'cut', highlight: false },
    { text: 'garments', highlight: false },
    { text: 'for', highlight: false },
    { text: 'people', highlight: false },
    { text: 'who', highlight: false },
    { text: 'refuse', italic: true, red: true },
    { text: 'a', highlight: false },
    { text: 'season.', highlight: false },
    { text: 'Built', highlight: false },
    { text: 'slowly', highlight: false },
    { text: 'in', highlight: false },
    { text: 'small', highlight: false },
    { text: 'runs,', highlight: false },
    { text: 'worn', highlight: false },
    { text: 'loudly,', highlight: false },
    { text: 'and', highlight: false },
    { text: 'made', highlight: false },
    { text: 'to', highlight: false },
    { text: 'outlive', highlight: false },
    { text: 'every', highlight: false },
    { text: 'trend', highlight: false },
    { text: 'that', highlight: false },
    { text: 'tries', highlight: false },
    { text: 'to', highlight: false },
    { text: 'replace', highlight: false },
    { text: 'them.', highlight: false },
  ];

  return (
    <section ref={containerRef} className="py-24 sm:py-36 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-[#0c0c0b]">
      <div className="max-w-[1720px] mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-6 border-b border-[#ece8e1]/10 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[#ff3d17] font-bold">(01)</span>
            <span>— MANIFESTO</span>
          </div>
          <div>EST. 2019 — PORTO</div>
        </div>

        {/* Animated Manifesto Typography */}
        <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-anton leading-[1.08] tracking-tight max-w-6xl">
          {words.map((item, index) => {
            const wordThreshold = index / words.length;
            const isRevealed = scrollProgress >= wordThreshold * 0.8;
            
            return (
              <span
                key={index}
                className="inline-block mr-3 sm:mr-5 transition-all duration-500 ease-out"
                style={{
                  opacity: isRevealed ? 1 : 0.18,
                  filter: isRevealed ? 'blur(0px)' : 'blur(4px)',
                  transform: isRevealed ? 'translateY(0)' : 'translateY(6px)',
                  color: item.red
                    ? '#ff3d17'
                    : isRevealed
                    ? '#ece8e1'
                    : '#8c8880',
                }}
              >
                {item.italic ? (
                  <span className="font-serif-italic font-normal lowercase tracking-normal px-1">
                    {item.text}
                  </span>
                ) : (
                  item.text
                )}
              </span>
            );
          })}
        </div>

        {/* Story Subtext & Action */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#ece8e1]/10 items-end">
          <div className="md:col-span-8 lg:col-span-7">
            <p className="font-sans text-base sm:text-lg text-[#8c8880] leading-relaxed">
              Every Bureau27 piece is cut, sewn and pressed by eleven people in one Porto atelier. 
              No seasons, no markdowns, no overproduction — a garment stays online until the last one is gone.
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
