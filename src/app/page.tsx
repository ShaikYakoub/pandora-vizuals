'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CursorTracker from '@/components/CursorTracker';
import ManifestoScroll from '@/components/ManifestoScroll';
import DropScroller from '@/components/DropScroller';
import ProductCard from '@/components/ProductCard';
import CrossedTicker from '@/components/CrossedTicker';
import Moodboard from '@/components/Moodboard';
import StockedAtTicker from '@/components/StockedAtTicker';
import { useCards } from '@/context/CardsContext';
import { ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  const { sectionCards: editProducts } = useCards('home-edit');
  const { sectionCards: journalStories } = useCards('home-journal');

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] flex flex-col">
      {/* Realtime Cursor Tracker Strip */}
      <CursorTracker />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between px-4 sm:px-8 pt-16 pb-8 border-b border-[#ece8e1]/10 overflow-hidden bg-noise">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff3d17]/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Center Editorial Quote */}
        <div className="flex-1 flex items-center justify-center text-center px-4 z-10 my-auto py-12">
          <h2 className="font-serif-italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#ece8e1] max-w-4xl tracking-tight leading-tight">
            Garments for people who refuse a season.
          </h2>
        </div>

        {/* Giant Hero Wordmark */}
        <div className="w-full max-w-[1720px] mx-auto z-10">
          <h1 className="font-anton text-[21vw] sm:text-[22vw] leading-[0.8] tracking-tighter select-none flex items-baseline justify-center sm:justify-start">
            <span className="text-[#ece8e1]">BUREAU</span>
            <span className="text-[#ff3d17]">27</span>
          </h1>
        </div>
      </section>

      {/* (01) — MANIFESTO with word reveal */}
      <ManifestoScroll />

      {/* (02) — THE DROP (Horizontal looks slider) */}
      <DropScroller />

      {/* (02) — THE EDIT (Signature 8 pieces grid) */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-[#0c0c0b]">
        <div className="max-w-[1720px] mx-auto space-y-12">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#ece8e1]/10 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#8c8880] uppercase mb-2">
                <span className="text-[#ff3d17] font-bold">(02)</span>
                <span>— THE EDIT</span>
              </div>
              <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-[#ece8e1] tracking-tight">
                EIGHT PIECES, NO SEASON.
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#ece8e1] border border-[#ece8e1]/20 px-6 py-3.5 hover:border-[#ff3d17] hover:text-[#ff3d17] transition-all bg-[#171716]"
            >
              <span>SHOP ALL PIECES</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Dynamic Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
            {editProducts.map((card, idx) => (
              <ProductCard key={card.id} card={card} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* (03) — LOOKBOOK, CHAPTER 04: WORN IN THE DARK */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex flex-col justify-between p-6 sm:p-12 border-b border-[#ece8e1]/10 bg-[#0c0c0b] overflow-hidden">
        {/* Full Bleed Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://framerusercontent.com/images/i7GXd7j0ZuZK0DjqGwubN4b7JNI.jpg?width=2400&height=1600"
            alt="Marseille Lookbook Chapter 04"
            fill
            className="object-cover opacity-60 transition-transform duration-1000 scale-100 hover:scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0b] via-black/40 to-[#0c0c0b]/80" />
        </div>

        {/* Top Info Bar */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono tracking-widest text-[#ece8e1] uppercase">
          <div className="flex items-center space-x-2">
            <span className="text-[#ff3d17] font-bold">(03)</span>
            <span>— LOOKBOOK, CHAPTER 04</span>
          </div>
          <div>000%</div>
        </div>

        {/* Center / Bottom Giant Title */}
        <div className="relative z-10 space-y-4 my-auto py-16 text-center">
          <h2 className="font-anton text-6xl sm:text-8xl md:text-9xl lg:text-[11vw] leading-[0.9] text-[#ece8e1] tracking-tighter uppercase select-none">
            WORN IN THE DARK
          </h2>
          <p className="font-mono text-xs sm:text-sm tracking-widest text-[#dcd6cc] uppercase">
            SHOT AT 04:00 AM IN MARSEILLE — NO RETOUCHING
          </p>
          <div className="pt-4">
            <Link
              href="/lookbook"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-[#ece8e1] text-[#0c0c0b] font-bold px-6 py-3.5 hover:bg-[#ff3d17] hover:text-[#0c0c0b] transition-all"
            >
              <span>VIEW FULL LOOKBOOK</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Metadata Grid */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#ece8e1]/20 text-[11px] font-mono tracking-widest text-[#dcd6cc] uppercase">
          <div>Cut in Porto</div>
          <div>Small runs</div>
          <div>Worn loudly</div>
          <div>Built to outlive</div>
        </div>
      </section>

      {/* Dual Crossed Angled Banner */}
      <CrossedTicker />

      {/* (04) — MOODBOARD (Draggable Polaroids) */}
      <Moodboard />

      {/* (05) — JOURNAL (Notes from the Atelier) */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-[#0c0c0b]">
        <div className="max-w-[1720px] mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#ece8e1]/10 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#8c8880] uppercase mb-2">
                <span className="text-[#ff3d17] font-bold">(05)</span>
                <span>— JOURNAL</span>
              </div>
              <h2 className="font-anton text-4xl sm:text-6xl lg:text-7xl text-[#ece8e1] tracking-tight">
                NOTES FROM THE ATELIER
              </h2>
            </div>

            <Link
              href="/journal"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#ece8e1] border border-[#ece8e1]/20 px-6 py-3.5 hover:border-[#ff3d17] hover:text-[#ff3d17] transition-all bg-[#171716]"
            >
              <span>ALL STORIES</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Dynamic Journal Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journalStories.map((story) => (
              <Link
                key={story.id}
                href={story.ctaLink || `/journal/${story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="group flex flex-col space-y-4 border border-[#ece8e1]/10 bg-[#141413] p-6 hover:border-[#ff3d17] transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full bg-[#1c1c1a] overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Metadata Row */}
                <div className="flex items-center justify-between text-xs font-mono text-[#8c8880] pt-2">
                  <span className="text-[#ff3d17] font-bold tracking-wider uppercase">
                    {story.badge || 'ATELIER'}
                  </span>
                  <span>{story.metadata?.readTime || '5 MIN'}</span>
                </div>

                {/* Story Title */}
                <h3 className="font-anton text-2xl sm:text-3xl tracking-wide text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors leading-tight">
                  {story.title}
                </h3>

                {/* Description */}
                {story.description && (
                  <p className="text-xs font-sans text-[#8c8880] line-clamp-3 leading-relaxed flex-1">
                    {story.description}
                  </p>
                )}

                {/* Arrow Action */}
                <div className="flex items-center justify-between pt-4 border-t border-[#ece8e1]/10 text-xs font-mono text-[#dcd6cc] group-hover:text-[#ff3d17] transition-colors">
                  <span>{story.ctaText || 'READ STORY'}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Boutiques Ticker Marquee */}
      <StockedAtTicker />
    </div>
  );
}
