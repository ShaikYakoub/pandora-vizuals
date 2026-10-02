'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PandoraLogo from './PandoraLogo';

export default function Navbar() {
  const pathname = usePathname();

  // HOME in the middle of all visible links
  const navLinks = [
    { label: 'WORK', href: '/shop' },
    { label: 'ABOUT', href: '/about' },
    { label: 'HOME', href: '/' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/shop') return pathname.startsWith('/shop') || pathname === '/lookbook';
    if (href === '/about') return pathname.startsWith('/about');
    if (href === '/contact') return pathname.startsWith('/contact');
    return false;
  };

  return (
    <>
      {/* Absolute / Fixed Brand Logo on Top Center */}
      <div className="fixed top-5 sm:top-7 md:top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <Link 
          href="/" 
          className="block text-[#ece8e1] select-none drop-shadow-lg cursor-pointer"
          aria-label="Pandora Visuals Home"
        >
          <PandoraLogo className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto block select-none" />
        </Link>
      </div>

      {/* Floating Bottom Navbar Dock: All Links Visible with HOME in Middle */}
      <nav 
        className="fixed bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none max-w-[calc(100vw-24px)]"
        aria-label="Primary Navigation"
      >
        <div className="bg-[#0c0c0b]/92 backdrop-blur-2xl border border-[#ece8e1]/15 px-4 sm:px-8 py-2 sm:py-2.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-center space-x-3.5 sm:space-x-7">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-dune relative py-1 px-1 flex items-center gap-1.5 text-[11px] sm:text-sm tracking-[0.08em] sm:tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer select-none ${
                  active
                    ? 'text-[#ff3d17] font-bold drop-shadow-[0_0_12px_rgba(255,61,23,0.8)] scale-105'
                    : 'text-[#ece8e1]/70 hover:text-[#ece8e1] hover:scale-102'
                }`}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] animate-pulse shadow-[0_0_8px_#ff3d17] shrink-0" />
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
