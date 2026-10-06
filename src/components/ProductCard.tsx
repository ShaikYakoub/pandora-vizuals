'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { EditableCard } from '@/types/card';

interface ProductCardProps {
  card: EditableCard;
  index?: number;
  columns?: 3 | 4;
  onSelect?: (card: EditableCard) => void;
}

export default function ProductCard({ card, index = 0, columns = 4, onSelect }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const staggerDelay = (index % (columns || 3)) * 0.08;

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect?.(card)}
      className={`group relative flex flex-col will-change-transform select-none ${
        onSelect ? 'cursor-pointer' : ''
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'rotateX(0deg) translateY(0)'
          : 'rotateX(15deg) translateY(30px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s`,
      }}
    >
      {/* Visual Showcase Frame */}
      <div className="relative w-full overflow-hidden bg-[#171716] aspect-[3/4] border border-[#ece8e1]/10 group-hover:border-[#ece8e1]/35 transition-colors duration-500">
        {/* Primary Image */}
        <Image
          src={card.image}
          alt={card.title || 'Pandora Vizuals production'}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Category Pill Tag on Hover */}
        {card.metadata?.category && (
          <div className="absolute top-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-block px-2 py-0.5 text-[10px] sm:text-xs font-sans font-semibold tracking-wider uppercase bg-[#0c0c0b]/80 backdrop-blur-md text-[#ece8e1] border border-white/15 rounded-full">
              {card.metadata.category}
            </span>
          </div>
        )}

        {/* Subtle Title Gradient Overlay at Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
          <h3 className="font-sans font-semibold text-xs sm:text-sm text-[#ece8e1] tracking-tight line-clamp-1">
            {card.title}
          </h3>
          {card.description && (
            <p className="font-sans text-[11px] text-[#ece8e1]/70 line-clamp-1 mt-0.5">
              {card.description}
            </p>
          )}
        </div>

        {/* Corner Viewfinder Camera Marks on Hover */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
