'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCards } from '@/context/CardsContext';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import FramerHeading from '@/components/FramerHeading';
import FramerReveal from '@/components/FramerReveal';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { cards, sectionCards: shopCards } = useCards('shop');
  const { addItem } = useCart();

  // Find card by matching slug with title or id
  const product =
    cards.find((c) => {
      const cardSlug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return cardSlug === slug || c.id === slug || c.ctaLink?.endsWith(slug);
    }) || shopCards[0];

  const sizes = product?.metadata?.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [added, setAdded] = useState(false);

  if (!product) {
    return notFound();
  }

  const numericPrice = product.price ? parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0 : 0;
  const itemCode = product.metadata?.itemNumber || '001';
  const category = product.metadata?.category || 'OUTERWEAR';
  const colorway = product.metadata?.colorway || 'INK / UNLINED';

  // Details bullets
  const craftDetails = product.metadata?.details || [
    'Double-faced recycled wool, 900 gsm',
    'Made in small runs in Porto, Portugal',
    'Dry clean only — or don’t, it ages well'
  ];

  // Secondary editorial image for gallery scroll
  const secondaryImage =
    product.metadata?.secondaryImage ||
    shopCards.find((c) => c.id !== product.id)?.image ||
    product.image;

  // 4 related pieces for "YOU MAY ALSO LIKE"
  const relatedPieces = (shopCards.length > 0 ? shopCards : cards)
    .filter((c) => c.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}`,
      title: product.title,
      price: product.price || '€0',
      priceNumber: numericPrice,
      image: product.image,
      size: selectedSize,
      colorway: colorway
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-16 sm:space-y-24">
        {/* Main Product Layout: Multi-photo Gallery Left, Sticky Sidebar Right */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Gallery: Vertical Stack of Editorial Imagery */}
          <div className="flex-1 w-full space-y-8">
            {/* Main Shot */}
            <div className="relative aspect-[3/4.2] w-full bg-[#171716] overflow-hidden">
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 bg-[#ff3d17] text-[#0c0c0b] text-xs font-mono font-bold px-3 py-1 tracking-wider uppercase">
                  {product.badge}
                </span>
              )}
              <Image
                src={product.image}
                alt={product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            </div>

            {/* Second Editorial Detail Shot */}
            {secondaryImage && (
              <div className="relative aspect-[3/4.2] w-full bg-[#171716] overflow-hidden">
                <Image
                  src={secondaryImage}
                  alt={`${product.title} Detail`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              </div>
            )}
          </div>

          {/* Right Column: Sticky Product Specs & Buy Actions */}
          <div className="w-full lg:w-[420px] shrink-0 sticky top-28 self-start space-y-8">
            
            {/* Header / Category / Breadcrumb */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase">
                <Link
                  href="/shop"
                  className="hover:text-[#ff3d17] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>SHOP / {category}</span>
                </Link>
                <span className="text-[#ff3d17] font-bold">{itemCode}</span>
              </div>

              {/* Huge Anton Title */}
              <FramerHeading
                text={product.title}
                as="h1"
                className="font-anton text-6xl lg:text-[76px] leading-[0.92] tracking-[-0.03em] uppercase text-[#ece8e1]"
              />

              {/* Price in Instrument Serif Italic Vermilion */}
              {product.price && (
                <div className="font-serif italic text-4xl text-[#ff3d17] pt-1">
                  {product.price}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="font-sans text-sm sm:text-base text-[#8c8880] leading-relaxed">
              {product.description}
            </p>

            {/* Colorway Row */}
            <div className="flex justify-between items-center py-3 border-t border-b border-[#ece8e1]/10 text-xs font-mono tracking-widest uppercase">
              <span className="text-[#8c8880]">COLORWAY</span>
              <span className="text-[#ece8e1] font-semibold">{colorway}</span>
            </div>

            {/* Sizes Selection Row */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase">
                <span>SIZES</span>
                <span className="text-[#ece8e1]">CHOOSE SIZE</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz: string) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2.5 text-xs font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#ff3d17] bg-[#ff3d17] text-[#0c0c0b] font-bold'
                          : 'border-[#ece8e1]/20 bg-transparent text-[#ece8e1] hover:border-[#ece8e1]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buy Action Button */}
            <div className="space-y-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#ff3d17] hover:bg-[#e0320f] text-[#0c0c0b] font-mono text-sm font-bold uppercase tracking-widest py-4 px-6 flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <span>BUY NOW</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] font-mono text-center tracking-wider text-[#8c8880] uppercase">
                FREE SHIPPING OVER €300 · 30-DAY RETURNS · MADE IN PORTO
              </div>
            </div>

            {/* Craft & Technical Bullet Details */}
            <div className="border-t border-[#ece8e1]/10 pt-6 space-y-3 text-xs font-sans text-[#8c8880]">
              {craftDetails.map((detail: string, i: number) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: YOU MAY ALSO LIKE */}
        <div className="pt-16 border-t border-[#ece8e1]/10 space-y-12">
          <h2 className="font-anton text-6xl sm:text-8xl tracking-tight uppercase text-[#ece8e1]">
            YOU MAY ALSO LIKE
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPieces.map((card, idx) => (
              <ProductCard key={card.id} card={card} index={idx} columns={4} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
