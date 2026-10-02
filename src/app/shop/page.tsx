'use client';

import React, { useState } from 'react';
import { useCards } from '@/context/CardsContext';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const { sectionCards: shopCards } = useCards('shop');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'OUTERWEAR', 'TAILORING', 'KNITWEAR', 'ACCESSORIES'];

  const filteredCards = shopCards.filter((card) => {
    if (selectedCategory === 'ALL') return true;
    return card.metadata?.category?.toUpperCase() === selectedCategory;
  });

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-12 sm:space-y-16">
        {/* Top Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] animate-pulse" />
            <span>(Shop) — SS27 / Seasonless</span>
          </div>
          <div>{filteredCards.length.toString().padStart(2, '0')} PIECES — SHIPS WORLDWIDE</div>
        </div>

        {/* Hero Title & Category Tabs Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#ece8e1]/10">
          <div>
            <h1 className="font-anton text-7xl sm:text-9xl lg:text-[168px] leading-[0.88] tracking-[-0.01em] uppercase text-[#ece8e1]">
              THE SHOP
            </h1>
          </div>

          <div className="space-y-5 lg:text-right max-w-xl">
            <p className="text-xs sm:text-sm font-sans text-[#8c8880] leading-relaxed">
              Every piece is cut in small runs in Porto and stays online until the last one is gone. No markdowns, no seasons.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 lg:justify-end pt-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-200 border cursor-pointer ${
                      isActive
                        ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1] font-semibold'
                        : 'bg-transparent text-[#8c8880] border-[#ece8e1]/15 hover:border-[#ece8e1]/40 hover:text-[#ece8e1]'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17]" />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Grid (3 Columns Desktop) */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <div className="font-anton text-3xl text-[#8c8880]">NO PIECES FOUND</div>
            <p className="font-mono text-xs text-[#6b675f]">
              Try selecting another category or check the complete collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-16">
            {filteredCards.map((card, idx) => (
              <ProductCard key={card.id} card={card} index={idx} columns={3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
