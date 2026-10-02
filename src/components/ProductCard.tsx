'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EditableCard } from '@/types/card';
import { useCart } from '@/context/CartContext';
import { ArrowUpRight, Plus } from 'lucide-react';

interface ProductCardProps {
  card: EditableCard;
  index?: number;
  columns?: 3 | 4;
}

export default function ProductCard({ card, index = 0, columns = 4 }: ProductCardProps) {
  const { addItem } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const itemCode = card.metadata?.itemNumber || (index + 1).toString().padStart(3, '0');
  const numericPrice = card.price ? parseFloat(card.price.replace(/[^0-9.]/g, '')) || 0 : 0;

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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: card.id,
      title: card.title,
      price: card.price || '€0',
      priceNumber: numericPrice,
      image: card.image,
      size: card.metadata?.sizes?.[0] || 'M',
      colorway: card.metadata?.colorway,
    });
  };

  const productUrl =
    card.ctaLink && card.ctaLink !== '#'
      ? card.ctaLink
      : `/shop/${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const staggerDelay = (index % (columns || 3)) * 0.08;

  return (
    <div
      ref={cardRef}
      className="group flex flex-col will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'rotateX(0deg) translateY(0)'
          : 'rotateX(20deg) translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s`,
      }}
    >
      <Link href={productUrl} className="block relative w-full overflow-hidden bg-[#171716] aspect-[3/4.2]">
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

        {/* Floating View Piece Pill on Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <div className="bg-[#ece8e1] text-[#0c0c0b] px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-300">
            <span>{card.ctaText || 'View piece'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Quick Add Button on Hover (Bottom Bar) */}
        <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            title="Quick add to bag"
            className="w-9 h-9 bg-[#0c0c0b]/90 text-[#ece8e1] hover:bg-[#ff3d17] hover:text-[#0c0c0b] flex items-center justify-center transition-colors shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </Link>

      {/* Meta Row below photo */}
      <div className="flex items-baseline justify-between pt-3 text-xs font-mono">
        <div className="flex items-baseline gap-2 truncate pr-2">
          <span className="text-[#8c8880] shrink-0">{itemCode}</span>
          <h4 className="font-sans text-[15px] font-medium text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors truncate">
            <Link href={productUrl}>{card.title}</Link>
          </h4>
        </div>
        {card.price && (
          <span className="font-mono text-sm text-[#ece8e1] shrink-0 font-medium">
            {card.price}
          </span>
        )}
      </div>
    </div>
  );
}
