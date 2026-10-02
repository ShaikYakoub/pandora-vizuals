'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PandoraLogo from './PandoraLogo';

export default function Navbar() {
  const pathname = usePathname();

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
