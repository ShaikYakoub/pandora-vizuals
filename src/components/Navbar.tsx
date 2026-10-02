'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'WORK', href: '/shop' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/shop') return pathname.startsWith('/shop') || pathname === '/lookbook';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Absolute / Fixed Brand Logo on Top Left */}
      <div className="fixed top-6 sm:top-8 left-6 sm:left-10 z-50 pointer-events-auto">
        <Link 
          href="/" 
          className="font-anton text-2xl sm:text-3xl tracking-tight text-[#ece8e1] hover:text-[#ff3d17] transition-colors select-none drop-shadow-md"
        >
          BUREAU27
        </Link>
      </div>

      {/* Fixed Shopping Bag on Top Right */}
      <div className="fixed top-6 sm:top-8 right-6 sm:right-10 z-50 pointer-events-auto">
        <button
          onClick={openCart}
          className="group flex items-center space-x-2 text-xs font-mono tracking-widest text-[#ece8e1] hover:text-[#ff3d17] transition-all py-2 px-3.5 rounded-full bg-[#0c0c0b]/80 backdrop-blur-md border border-[#ece8e1]/15 shadow-lg cursor-pointer"
          aria-label="Open Shopping Bag"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff3d17] animate-pulse" />
          <span className="font-bold">BAG ({totalCount})</span>
        </button>
      </div>

      {/* Absolute / Fixed Floating Navigation Dock at Bottom */}
      <nav 
        className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-[calc(100vw-32px)]"
        aria-label="Primary Navigation"
      >
        <div className="bg-[#0c0c0b]/90 backdrop-blur-xl border border-[#ece8e1]/15 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.7)] flex items-center space-x-5 sm:space-x-8 text-[11px] sm:text-xs font-mono tracking-[0.18em] uppercase select-none">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative transition-all py-1 flex items-center gap-1.5 ${
                  active
                    ? 'text-[#ff3d17] font-bold drop-shadow-[0_0_8px_rgba(255,61,23,0.5)]'
                    : 'text-[#ece8e1]/80 hover:text-[#ff3d17]'
                }`}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] animate-pulse" />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
