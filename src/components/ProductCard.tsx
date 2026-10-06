'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { EditableCard } from '@/types/card';

interface ProductCardProps {
  card: EditableCard;
  index?: number;
  columns?: 2 | 3 | 4;
}

export default function ProductCard({ card, index = 0, columns = 4 }: ProductCardProps) {
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

  const is16by9 = card.aspectRatio === '16:9' || card.metadata?.aspectRatio === '16:9';
  const is9by16 = card.aspectRatio === '9:16' || card.metadata?.aspectRatio === '9:16';
  const aspectClass = is16by9 ? 'aspect-video' : is9by16 ? 'aspect-[9/16]' : 'aspect-[3/4]';

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col will-change-transform select-none w-full"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'rotateX(0deg) translateY(0)'
          : 'rotateX(15deg) translateY(30px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s`,
      }}
    >
      {/* Visual Showcase Frame */}
      <div
        className={`relative w-full overflow-hidden bg-[#171716] ${aspectClass} border border-[#ece8e1]/10 group-hover:border-[#ece8e1]/35 transition-colors duration-500`}
      >
        {/* Primary Media: Video or Image */}
        {(card.videoUrl || card.metadata?.videoUrl) ? (
          <video
            src={card.videoUrl || card.metadata?.videoUrl}
            poster={card.image}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <Image
            src={card.image}
            alt={card.title || 'Pandora Vizuals production'}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        )}


        {/* Corner Viewfinder Camera Marks on Hover */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
