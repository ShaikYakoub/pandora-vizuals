'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalCount } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 300;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121211] border-l border-[#ece8e1]/15 text-[#ece8e1] flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="px-6 py-6 border-b border-[#ece8e1]/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff3d17]" />
              <h2 className="font-anton text-xl tracking-wider">YOUR BAG ({totalCount})</h2>
            </div>
            <button
              onClick={closeCart}
              className="text-[#8c8880] hover:text-[#ece8e1] transition-colors p-1"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-[#171716] border-b border-[#ece8e1]/10">
            <div className="text-[11px] font-mono tracking-wider text-[#dcd6cc] flex justify-between mb-1.5">
              <span>
                {remainingForFree > 0
                  ? `ADD €${remainingForFree.toFixed(0)} FOR FREE SHIPPING`
                  : 'YOU QUALIFY FOR FREE WORLDWIDE SHIPPING'}
              </span>
              <span className="text-[#ff3d17]">{progressToFreeShipping.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1 bg-[#262523] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#ff3d17] transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1c1c1a] border border-[#ece8e1]/10 flex items-center justify-center text-[#8c8880]">
                  0
                </div>
                <div className="font-anton text-2xl tracking-wide">BAG IS EMPTY</div>
                <p className="text-xs font-mono text-[#8c8880] max-w-xs">
                  All Bureau27 garments are cut in limited runs in Porto. Browse our pieces before the run closes.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="bureau-btn bureau-btn-primary mt-2"
                >
                  EXPLORE SHOP ↗
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-[#ece8e1]/10 group">
                  <div className="relative w-20 h-28 bg-[#1a1a18] flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-anton text-base tracking-wide uppercase">{item.title}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#6b675f] hover:text-[#ff3d17] transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs font-mono text-[#ff3d17] mt-0.5">{item.price}</div>
                      {item.colorway && (
                        <div className="text-[11px] font-mono text-[#8c8880] mt-1">{item.colorway}</div>
                      )}
                      {item.size && (
                        <div className="text-[11px] font-mono text-[#8c8880]">SIZE: {item.size}</div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <div className="flex items-center border border-[#ece8e1]/20 bg-[#0c0c0b]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-[#8c8880] hover:text-[#ece8e1] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-[#ece8e1]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-[#8c8880] hover:text-[#ece8e1] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-[#0c0c0b] border-t border-[#ece8e1]/10 space-y-4">
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#8c8880]">
                  <span>SUBTOTAL</span>
                  <span className="text-[#ece8e1]">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#8c8880]">
                  <span>WORLDWIDE SHIPPING</span>
                  <span className="text-[#ece8e1]">
                    {subtotal >= freeShippingThreshold ? 'FREE' : '€25.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#ece8e1]/10 text-[#ece8e1]">
                  <span>TOTAL ESTIMATE</span>
                  <span className="text-[#ff3d17]">
                    €{(subtotal + (subtotal >= freeShippingThreshold ? 0 : 25)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert('Demo checkout simulated! In production, this connects to Stripe or Cloudflare Commerce.')}
                className="w-full bureau-btn bureau-btn-primary py-3.5 flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] font-mono text-center text-[#6b675f] uppercase tracking-wider">
                COMPLIMENTARY 30-DAY RETURNS • SHIPPED FROM PORTO
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
