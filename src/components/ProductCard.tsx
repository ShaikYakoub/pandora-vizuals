'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { EditableCard } from '@/types/card';

interface ProductCardProps {
  card: EditableCard;
  index?: number;
  columns?: 3 | 4;
}

export default function ProductCard({ card, index = 0, columns = 4 }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const itemCode = card.metadata?.itemNumber || (index + 1).toString().padStart(3, '0');
  const tag = card.metadata?.category || card.badge || 'EDITION';

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
      className="group flex flex-col will-change-transform select-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'rotateX(0deg) translateY(0)'
          : 'rotateX(20deg) translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s`,
      }}
    >
      {/* Visual Showcase Frame */}
      <div className="relative w-full overflow-hidden bg-[#171716] aspect-[3/4.2] border border-[#ece8e1]/10">
        {/* Top-Left Badge */}
        {card.badge && (
          <span className="absolute top-3 left-3 z-20 bg-[#ff3d17] text-[#0c0c0b] text-[11px] font-mono font-bold px-2.5 py-1 tracking-wider uppercase">
            {card.badge}
          </span>
        )}

        {/* Primary Image */}
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Subtle Dark Vignette on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Floating Atelier Material/Colorway Pill on Hover */}
        {card.metadata?.colorway && (
          <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="bg-[#0c0c0b]/80 backdrop-blur-md border border-[#ece8e1]/20 text-[#ece8e1] px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
              {card.metadata.colorway}
            </span>
          </div>
        )}
      </div>

      {/* Meta Row below photo */}
      <div className="flex items-baseline justify-between pt-3 text-xs font-mono">
        <div className="flex items-baseline gap-2 truncate pr-2">
          <span className="text-[#8c8880] shrink-0">{itemCode}</span>
          <h4 className="font-sans text-[15px] font-medium text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors truncate">
            {card.title}
          </h4>
        </div>
        <span className="font-mono text-xs text-[#8c8880] uppercase tracking-wider shrink-0">
          {tag}
        </span>
      </div>
    </div>
  );
}
