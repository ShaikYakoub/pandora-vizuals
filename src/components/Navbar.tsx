'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Menu, X, ShoppingBag, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'SHOP', href: '/shop' },
    { label: 'LOOKBOOK', href: '/lookbook' },
    { label: 'JOURNAL', href: '/journal' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0c0c0b]/90 backdrop-blur-md border-b border-[#ece8e1]/10 transition-all duration-300">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="font-anton text-2xl sm:text-3xl tracking-tight text-[#ece8e1] hover:text-[#ff3d17] transition-colors"
          >
            BUREAU27
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono font-medium tracking-widest text-[#8c8880]">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors uppercase tracking-[0.16em] py-1 ${
                    active ? 'text-[#ff3d17] font-bold' : 'text-[#ece8e1] hover:text-[#ff3d17]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Quick Admin Panel Link */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-wider text-[#dcd6cc] bg-[#171716] border border-[#ece8e1]/20 rounded hover:border-[#ff3d17] hover:text-[#ff3d17] transition-all"
              title="Card Management CMS"
            >
              <Settings className="w-3 h-3 text-[#ff3d17]" />
              <span>ADMIN CMS</span>
            </Link>
          </nav>

          {/* Right Action: Live Status & Bag Trigger */}
          <div className="flex items-center space-x-4">
            <button
              onClick={openCart}
              className="group flex items-center space-x-2 text-xs font-mono tracking-widest text-[#ece8e1] hover:text-[#ff3d17] transition-colors py-2 px-3 rounded"
              aria-label="Open Shopping Bag"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff3d17] animate-pulse" />
              <span className="hidden sm:inline">SS27 LIVE — </span>
              <span className="font-bold">BAG ({totalCount})</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#ece8e1] p-1 hover:text-[#ff3d17] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-[#0c0c0b] px-6 py-10 flex flex-col justify-between md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-6">
            <div className="text-[11px] font-mono text-[#8c8880] uppercase tracking-widest border-b border-[#ece8e1]/10 pb-2">
              SS27 Navigation
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-anton text-4xl tracking-wide ${
                  isActive(link.href) ? 'text-[#ff3d17]' : 'text-[#ece8e1] hover:text-[#ff3d17]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 font-mono text-sm tracking-wider text-[#ff3d17] pt-4"
            >
              <Settings className="w-4 h-4" />
              <span>EDITABLE CARDS ADMIN PANEL</span>
            </Link>
          </div>

          <div className="pt-8 border-t border-[#ece8e1]/10 flex flex-col space-y-2 text-xs font-mono text-[#8c8880]">
            <div>PORTO — MARSEILLE — ONLINE</div>
            <div>EST. 2019 — ALL GARMENTS SEASONLESS</div>
          </div>
        </div>
      )}
    </>
  );
}
