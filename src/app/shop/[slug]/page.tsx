'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCards } from '@/context/CardsContext';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { cards } = useCards();
  const { addItem } = useCart();

  // Find card by matching slug with title or id
  const product = cards.find((c) => {
    const cardSlug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return cardSlug === slug || c.id === slug || c.ctaLink?.endsWith(slug);
  }) || cards.find((c) => c.section === 'home-edit'); // fallback to first edit piece if not found

  const sizes = product?.metadata?.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [added, setAdded] = useState(false);

  if (!product) {
    return notFound();
  }

  const numericPrice = product.price ? parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0 : 0;

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}`,
      title: product.title,
      price: product.price || '€0',
      priceNumber: numericPrice,
      image: product.image,
      size: selectedSize,
      colorway: product.metadata?.colorway
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-8 sm:py-16 px-4 sm:px-8">
      <div className="max-w-[1720px] mx-auto space-y-12">
        {/* Breadcrumb / Back Link */}
        <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] pb-4 border-b border-[#ece8e1]/10">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 hover:text-[#ff3d17] transition-colors uppercase font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO SHOP</span>
          </Link>
          <div className="uppercase">
            SHOP / {product.metadata?.category || 'COLLECTION'}
          </div>
        </div>

        {/* Product Grid: Image Gallery Left, Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Visual Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full bg-[#171716] overflow-hidden border border-[#ece8e1]/15">
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
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>

          {/* Product Info & Purchase Column */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-3 border-b border-[#ece8e1]/10 pb-6">
              <div className="text-xs font-mono tracking-widest text-[#8c8880]">
                {product.metadata?.itemNumber || '001'}
              </div>
              <h1 className="font-anton text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[#ece8e1] uppercase">
                {product.title}
              </h1>
              {product.price && (
                <div className="font-serif-italic text-3xl sm:text-4xl text-[#ff3d17]">
                  {product.price}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="font-sans text-base sm:text-lg text-[#dcd6cc] leading-relaxed">
              {product.description}
            </p>

            {/* Colorway & Specs */}
            {product.metadata?.colorway && (
              <div className="flex justify-between items-center py-3 border-t border-b border-[#ece8e1]/10 text-xs font-mono tracking-widest text-[#8c8880]">
                <span>COLORWAY</span>
                <span className="text-[#ece8e1] font-bold">{product.metadata.colorway}</span>
              </div>
            )}

            {/* Sizes Selection */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono tracking-widest text-[#8c8880]">
                <span>SIZES</span>
                <span className="text-[#ece8e1]">CHOOSE SIZE</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((sz: string) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 text-xs font-mono font-bold tracking-wider border transition-all ${
                        isSelected
                          ? 'border-[#ff3d17] bg-[#ff3d17] text-[#0c0c0b]'
                          : 'border-[#ece8e1]/20 bg-[#171716] text-[#ece8e1] hover:border-[#ece8e1]'
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
                className="w-full bg-[#ff3d17] hover:bg-[#e0320f] text-[#0c0c0b] font-mono text-sm font-bold uppercase tracking-widest py-4 px-6 flex items-center justify-center gap-2 transition-all shadow-xl"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <span>BUY NOW</span>
                    <ArrowUpRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-[11px] font-mono text-center tracking-wider text-[#8c8880] uppercase">
                FREE SHIPPING OVER €300 • 30-DAY RETURNS • MADE IN PORTO
              </div>
            </div>

            {/* Craft & Origin Bullet Details */}
            <div className="border-t border-[#ece8e1]/10 pt-6 space-y-3 text-xs font-sans text-[#8c8880]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17]" />
                <span>Double-faced recycled wool, 900 gsm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17]" />
                <span>Made in small runs in Porto, Portugal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17]" />
                <span>Dry clean only — or don't, it ages well</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
