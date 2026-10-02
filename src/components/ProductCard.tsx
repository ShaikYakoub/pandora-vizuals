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
}

export default function ProductCard({ card, index = 0 }: ProductCardProps) {
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

  const staggerDelay = (index % 4) * 0.08;

  return (
    <div
      ref={cardRef}
      className="group flex flex-col space-y-3 perspective-1000 will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'rotateX(0deg) translateY(0)'
          : 'rotateX(20deg) translateY(50px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s`,
      }}
    >
      {/* Top Header Row: Code & Price */}
      <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#8c8880] pb-1 border-b border-[#ece8e1]/10">
        <span className="text-[#ece8e1]">{itemCode}</span>
        {card.price && <span className="font-bold text-[#ff3d17]">{card.price}</span>}
      </div>

      {/* Title */}
      <h4 className="font-anton text-xl sm:text-2xl tracking-wide text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors truncate">
        <Link href={productUrl}>{card.title}</Link>
      </h4>

      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#171716] overflow-hidden border border-[#ece8e1]/10">
        {/* Badge */}
        {card.badge && (
          <span className="absolute top-3 left-3 z-10 bg-[#ff3d17] text-[#0c0c0b] text-[10px] font-mono font-bold px-2 py-0.5 tracking-wider uppercase">
            {card.badge}
          </span>
        )}

        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 space-y-2">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#ff3d17] text-[#0c0c0b] font-mono text-xs font-bold uppercase tracking-widest py-2.5 px-3 flex items-center justify-center gap-1.5 hover:bg-[#e0320f] transition-colors shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>QUICK ADD TO BAG</span>
          </button>

          <Link
            href={productUrl}
            className="w-full bg-[#ece8e1] text-[#0c0c0b] font-mono text-xs font-bold uppercase tracking-widest py-2 px-3 flex items-center justify-between hover:bg-white transition-colors"
          >
            <span>{card.ctaText || 'VIEW PIECE'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Short Description */}
      {card.description && (
        <p className="text-xs font-sans text-[#8c8880] line-clamp-2 leading-relaxed pt-1">
          {card.description}
        </p>
      )}
    </div>
  );
}
