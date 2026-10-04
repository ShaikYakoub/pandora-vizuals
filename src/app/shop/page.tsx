'use client';

import React, { useState } from 'react';
import { useCards } from '@/context/CardsContext';
import ProductCard from '@/components/ProductCard';
import FramerHeading from '@/components/FramerHeading';
import FramerReveal from '@/components/FramerReveal';

export default function ShopPage() {
  const { cards, sectionCards: shopCards } = useCards('shop');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'REELS', 'KIDS BIRTHDAYS', 'ADULT EVENTS', 'DIGITAL MARKETING', 'COMMERCIAL'];

  const availableCards = shopCards.length > 0 ? shopCards : cards.filter((c) => c.section === 'shop');

  const filteredCards = availableCards.filter((card) => {
    if (selectedCategory === 'ALL') return true;
    return card.metadata?.category?.toUpperCase() === selectedCategory;
  });

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-12 sm:space-y-16">

        {/* Hero Title & Category Tabs */}
        <div className="text-center space-y-6 sm:space-y-8 pb-10 border-b border-[#ece8e1]/10">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#ff3d17]">
              // SELECTED ARCHIVE
            </span>
            <FramerHeading
              text="Our work"
              as="h1"
              className="font-anton text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] tracking-tight uppercase text-[#ece8e1]"
            />
          </div>

          <FramerReveal delay={0.15}>
            {/* Centered Category Filter Tabs with Elevated Camera Dial Styling */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-4xl mx-auto px-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`group relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 rounded-full cursor-pointer border select-none ${
                      isActive
                        ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1] font-semibold shadow-[0_0_24px_rgba(236,232,225,0.3)] scale-[1.02]'
                        : 'bg-[#141413]/70 text-[#8c8880] border-[#ece8e1]/15 hover:border-[#ece8e1]/40 hover:text-[#ece8e1] hover:bg-[#1a1a19]'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] shadow-[0_0_6px_#ff3d17] animate-pulse" />
                    )}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </FramerReveal>
        </div>

        {/* Productions Grid: 4 columns desktop (xl), 3 columns laptop & tablet (sm/lg), 2 columns phones (base) */}
        <FramerReveal delay={0.22} yOffset={32}>
          {filteredCards.length === 0 ? (
            <div className="text-center py-24 space-y-3">
              <div className="font-anton text-3xl text-[#8c8880]">NO PRODUCTIONS FOUND</div>
              <p className="font-mono text-xs text-[#6b675f]">
                Try selecting another category or view all productions in our archive.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredCards.map((card, idx) => (
                <ProductCard key={card.id} card={card} index={idx} columns={4} />
              ))}
            </div>
          )}
        </FramerReveal>
      </div>
    </div>
  );
}
