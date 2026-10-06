'use client';

import React from 'react';
import { useCards } from '@/context/CardsContext';
import ProductCard from '@/components/ProductCard';
import FramerHeading from '@/components/FramerHeading';
import FramerReveal from '@/components/FramerReveal';
import CameraCTAButton from '@/components/CameraCTAButton';

export default function ShopPage() {
  const { cards, sectionCards: shopCards } = useCards('shop');

  const availableCards = shopCards.length > 0 ? shopCards : cards.filter((c) => c.section === 'shop');

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-12 sm:space-y-16">

        {/* Hero Title */}
        <div className="text-center pb-8 sm:pb-12 border-b border-[#ece8e1]/10">
          <FramerHeading
            text="Our work"
            as="h1"
            className="font-anton text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] tracking-tight uppercase text-[#ece8e1]"
          />
        </div>

        {/* Productions Grid: 4 columns desktop (xl), 3 columns laptop & tablet (sm/lg), 2 columns phones (base) */}
        <FramerReveal delay={0.12} yOffset={24}>
          {availableCards.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <div className="font-anton text-3xl text-[#8c8880]">NO PRODUCTIONS FOUND</div>
              <p className="font-sans text-xs text-[#6b675f]">
                Productions will appear here shortly.
              </p>
              <div className="pt-2">
                <CameraCTAButton href="/contact">
                  BOOK CUSTOM SHOOT
                </CameraCTAButton>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {availableCards.map((card, idx) => (
                  <ProductCard key={card.id} card={card} index={idx} columns={4} />
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
                  <CameraCTAButton href="/contact">
                    START A PROJECT
                  </CameraCTAButton>
                </div>
              </div>
            </div>
          )}
        </FramerReveal>
      </div>
    </div>
  );
}

