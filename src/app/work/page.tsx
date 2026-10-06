'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCards } from '@/context/CardsContext';
import { EditableCard } from '@/types/card';
import ProductCard from '@/components/ProductCard';
import StudioHeading from '@/components/StudioHeading';
import StudioReveal from '@/components/StudioReveal';
import CameraCTAButton from '@/components/CameraCTAButton';

const CATEGORIES = [
  'ALL',
  'KIDS BIRTHDAYS',
  'REELS',
  'ADULT EVENTS',
  'COMMERCIAL',
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

export default function WorkPage() {
  const { cards, sectionCards: workCards } = useCards('work');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');
  const [activeCard, setActiveCard] = useState<EditableCard | null>(null);

  // Support both 'work' and existing 'shop' card sections for seamless continuity
  const availableCards = useMemo(() => {
    return workCards.length > 0
      ? workCards
      : cards.filter((c) => c.section === 'work' || c.section === 'shop');
  }, [workCards, cards]);

  // Filtered productions by category
  const filteredCards = useMemo(() => {
    if (selectedCategory === 'ALL') return availableCards;
    return availableCards.filter(
      (card) =>
        card.metadata?.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [availableCards, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: availableCards.length };
    availableCards.forEach((c) => {
      const cat = c.metadata?.category?.toUpperCase();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [availableCards]);

  // Lightbox Navigation (Previous / Next)
  const currentIndex = useMemo(() => {
    if (!activeCard) return -1;
    return filteredCards.findIndex((c) => c.id === activeCard.id);
  }, [activeCard, filteredCards]);

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) {
      setActiveCard(filteredCards[filteredCards.length - 1]);
    } else {
      setActiveCard(filteredCards[currentIndex - 1]);
    }
  }, [currentIndex, filteredCards]);

  const handleNext = useCallback(() => {
    if (currentIndex >= filteredCards.length - 1) {
      setActiveCard(filteredCards[0]);
    } else {
      setActiveCard(filteredCards[currentIndex + 1]);
    }
  }, [currentIndex, filteredCards]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!activeCard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCard(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCard, handlePrev, handleNext]);

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 sm:px-8 selection:bg-[#ff3d17] selection:text-[#0c0c0b]">
      <div className="max-w-[1580px] mx-auto space-y-10 sm:space-y-14">

        {/* Hero Title */}
        <div className="text-center pb-6 sm:pb-10 border-b border-[#ece8e1]/10">
          <StudioHeading
            text="Our work"
            as="h1"
            className="font-anton text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] tracking-tight uppercase text-[#ece8e1]"
          />
          <p className="font-sans text-xs sm:text-sm text-[#8c8880] tracking-widest uppercase mt-4">
            Curated 4K Productions &bull; Milestone Celebrations &bull; Commercial Stills
          </p>
        </div>

        {/* Interactive Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#ece8e1] text-[#0c0c0b] shadow-lg shadow-white/10 scale-105'
                    : 'bg-[#141413] text-[#8c8880] hover:text-[#ece8e1] hover:bg-[#1a1a19] border border-[#ece8e1]/10'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-[#0c0c0b]/15 text-[#0c0c0b]' : 'text-[#8c8880]/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Productions Grid: 4 columns desktop (xl), 3 columns laptop (sm/lg), 2 columns phones (base) */}
        <StudioReveal delay={0.12} yOffset={24}>
          {filteredCards.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <div className="font-anton text-3xl text-[#8c8880]">NO PRODUCTIONS IN THIS CATEGORY</div>
              <p className="font-sans text-xs text-[#6b675f]">
                Select another filter to view our portfolio.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className="px-5 py-2.5 rounded-full text-xs uppercase font-sans font-semibold bg-[#ece8e1] text-[#0c0c0b]"
                >
                  SHOW ALL PRODUCTIONS
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {filteredCards.map((card, idx) => (
                  <ProductCard
                    key={card.id}
                    card={card}
                    index={idx}
                    columns={4}
                    onSelect={(c) => setActiveCard(c)}
                  />
                ))}
              </div>

              {/* Bottom Inquire CTA */}
              <div className="text-center pt-12 pb-6 border-t border-[#ece8e1]/10 flex flex-col items-center justify-center space-y-4">
                <h2 className="font-anton text-3xl sm:text-5xl uppercase text-[#ece8e1] tracking-tight">
                  READY TO CAPTURE YOUR MOMENTS?
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#8c8880] max-w-lg leading-relaxed">
                  From viral reels and milestone celebrations to commercial campaigns, let&apos;s produce something unforgettable.
                </p>
                <div className="pt-3">
                  <CameraCTAButton href="/contact/">
                    START A PROJECT
                  </CameraCTAButton>
                </div>
              </div>
            </div>
          )}
        </StudioReveal>
      </div>

      {/* Interactive Production Lightbox Viewer */}
      {activeCard && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 lg:p-8 animate-fadeIn"
          onClick={() => setActiveCard(null)}
        >
          {/* Lightbox Content Container */}
          <div
            className="relative w-full max-w-5xl bg-[#141413] border border-[#ece8e1]/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveCard(null)}
              aria-label="Close Lightbox"
              className="absolute top-4 right-4 z-20 cursor-pointer w-10 h-10 rounded-full bg-black/60 hover:bg-[#ff3d17] text-white flex items-center justify-center border border-white/20 transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Previous Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Production"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer w-11 h-11 rounded-full bg-black/60 hover:bg-[#ff3d17] text-white flex items-center justify-center border border-white/20 transition-all duration-200 hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Production"
              className="absolute right-4 lg:right-auto lg:left-[calc(55%+16px)] top-1/2 -translate-y-1/2 z-20 cursor-pointer w-11 h-11 rounded-full bg-black/60 hover:bg-[#ff3d17] text-white flex items-center justify-center border border-white/20 transition-all duration-200 hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Left: High-Definition Image Showcase */}
            <div className="relative w-full lg:w-[58%] aspect-[3/4] lg:aspect-auto lg:min-h-[580px] bg-[#0c0c0b] flex items-center justify-center overflow-hidden">
              <Image
                src={activeCard.image}
                alt={activeCard.title}
                fill
                priority
                className="object-contain p-2 sm:p-4"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            {/* Right: Production Specifications & Booking CTA */}
            <div className="w-full lg:w-[42%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#141413]">
              <div className="space-y-4">
                {/* Category & Badge */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {activeCard.metadata?.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wider bg-[#ece8e1] text-[#0c0c0b]">
                      {activeCard.metadata.category}
                    </span>
                  )}
                  {activeCard.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider bg-[#ff3d17]/20 text-[#ff3d17] border border-[#ff3d17]/40">
                      {activeCard.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-anton text-2xl sm:text-4xl text-[#ece8e1] uppercase tracking-tight">
                  {activeCard.title}
                </h3>

                {/* Format / Deliverable Spec */}
                {activeCard.metadata?.colorway && (
                  <div className="font-mono text-xs text-[#8c8880] tracking-wider uppercase">
                    SPECS: {activeCard.metadata.colorway}
                  </div>
                )}

                {/* Description */}
                <p className="font-sans text-sm sm:text-base text-[#8c8880] leading-relaxed">
                  {activeCard.description}
                </p>

                {/* Pricing Guide */}
                {activeCard.price && (
                  <div className="pt-2">
                    <span className="text-xs uppercase font-sans tracking-wider text-[#8c8880]/70 block">
                      INVESTMENT:
                    </span>
                    <span className="font-sans font-bold text-xl text-[#ece8e1]">
                      {activeCard.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Inquire Button */}
              <div className="pt-4 border-t border-[#ece8e1]/10 space-y-3">
                <Link
                  href="/contact/"
                  onClick={() => setActiveCard(null)}
                  className="w-full inline-flex items-center justify-center gap-3 py-3.5 px-6 rounded-full bg-[#ff3d17] hover:bg-[#ff5533] text-white font-sans font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#ff3d17]/20 hover:scale-[1.02]"
                >
                  <span>BOOK A SIMILAR SHOOT</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <p className="text-center font-sans text-[11px] text-[#8c8880]">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-[10px]">ESC</kbd> to close &bull; <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-[10px]">&larr;</kbd> <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-[10px]">&rarr;</kbd> to navigate
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
