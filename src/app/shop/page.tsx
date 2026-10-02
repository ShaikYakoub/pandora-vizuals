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
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-12 sm:py-20 px-4 sm:px-8">
      <div className="max-w-[1720px] mx-auto space-y-12">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
          <div>(Shop) — SS27 / Seasonless</div>
          <div>{filteredCards.length.toString().padStart(2, '0')} PIECES — SHIPS WORLDWIDE</div>
        </div>

        {/* Hero Banner & Categories Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#ece8e1]/10">
          <div>
            <h1 className="font-anton text-6xl sm:text-8xl lg:text-9xl tracking-tight text-[#ece8e1]">
              THE SHOP
            </h1>
          </div>

          <div className="space-y-4 lg:text-right">
            <p className="text-xs sm:text-sm font-sans text-[#8c8880] max-w-md">
              Every piece is cut in small runs in Porto and stays online until the last one is gone. No markdowns, ever.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-all ${
                      isActive
                        ? 'bg-[#ece8e1] text-[#0c0c0b] border-[#ece8e1] font-bold'
                        : 'border-[#ece8e1]/20 text-[#8c8880] hover:border-[#ff3d17] hover:text-[#ece8e1] bg-[#141413]'
                    }`}
                  >
                    {isActive && <span className="text-[#ff3d17] mr-1.5">•</span>}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredCards.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <div className="font-anton text-3xl text-[#8c8880]">NO PIECES FOUND</div>
            <p className="font-mono text-xs text-[#6b675f]">
              Try selecting another category or check the complete collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
            {filteredCards.map((card, idx) => (
              <ProductCard key={card.id} card={card} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
