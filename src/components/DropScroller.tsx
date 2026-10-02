'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCards } from '@/context/CardsContext';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

export default function DropScroller() {
  const { sectionCards, loading } = useCards('home-drop');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 450;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading && sectionCards.length === 0) {
    return (
      <section className="py-24 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-[#0c0c0b] animate-pulse">
        <div className="h-12 w-64 bg-[#171716] mb-8" />
        <div className="h-96 w-full bg-[#171716]" />
      </section>
    );
  }

  const looksCount = sectionCards.length.toString().padStart(2, '0');

  return (
    <section className="py-20 sm:py-28 border-b border-[#ece8e1]/10 bg-[#0c0c0b] overflow-hidden">
      {/* Top Header */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase mb-2">
            SEASON COLLECTION
          </div>
          <h2 className="font-anton text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#ece8e1]">
            THE DROP — SS27
          </h2>
        </div>

        <div className="flex items-center space-x-6 text-xs font-mono tracking-widest text-[#8c8880]">
          <span>SCROLL ⟶ {looksCount} LOOKS</span>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 border border-[#ece8e1]/20 flex items-center justify-center hover:border-[#ff3d17] hover:text-[#ff3d17] transition-colors"
              aria-label="Previous Look"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 border border-[#ece8e1]/20 flex items-center justify-center hover:border-[#ff3d17] hover:text-[#ff3d17] transition-colors"
              aria-label="Next Look"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto no-scrollbar px-4 sm:px-8 pb-8 pt-2 scroll-smooth"
      >
        {sectionCards.map((card, index) => {
          const itemNum = card.metadata?.itemNumber || (index + 1).toString().padStart(2, '0');
          return (
            <div
              key={card.id}
              className="flex-none w-[320px] sm:w-[420px] lg:w-[460px] group flex flex-col space-y-4"
            >
              {/* Image Frame with Badge */}
              <div className="relative aspect-[3/4] w-full bg-[#171716] overflow-hidden border border-[#ece8e1]/10">
                <span className="absolute top-4 left-4 z-10 bg-[#ff3d17] text-[#0c0c0b] text-[11px] font-mono font-bold px-2 py-1 tracking-wider">
                  {itemNum}
                </span>

                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 320px, 460px"
                />

                {/* Hover CTA Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <Link
                    href={card.ctaLink || '/shop'}
                    className="w-full bg-[#ece8e1] text-[#0c0c0b] font-mono text-xs uppercase tracking-widest font-bold py-3 px-4 flex items-center justify-between hover:bg-[#ff3d17] transition-colors"
                  >
                    <span>{card.ctaText || 'SHOP THE LOOK'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Look Info Bar */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <h3 className="font-anton text-2xl tracking-wide text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors">
                    {card.title}
                  </h3>
                  {card.description && (
                    <div className="text-xs font-mono text-[#8c8880] tracking-wider uppercase mt-0.5">
                      {card.description}
                    </div>
                  )}
                </div>

                <Link
                  href={card.ctaLink || '/shop'}
                  className="text-xs font-mono tracking-wider text-[#8c8880] group-hover:text-[#ff3d17] flex items-center gap-1 transition-colors uppercase"
                >
                  <span className="hidden sm:inline">EXPLORE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
