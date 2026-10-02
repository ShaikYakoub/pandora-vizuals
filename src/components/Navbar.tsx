'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import PandoraLogo from './PandoraLogo';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'WORK', href: '/shop' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const getActiveIndex = useCallback((path: string) => {
    if (path === '/') return 0;
    if (path.startsWith('/shop') || path === '/lookbook') return 1;
    if (path.startsWith('/about')) return 2;
    if (path.startsWith('/contact')) return 3;
    return 0;
  }, []);

  const activeIndex = getActiveIndex(pathname);
  const [selectedIndex, setSelectedIndex] = useState(activeIndex);
  const [translateX, setTranslateX] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Sync selected index whenever pathname changes
  useEffect(() => {
    setSelectedIndex(activeIndex);
  }, [activeIndex]);

  // Center the active element precisely in the middle of containerRef
  const updatePosition = useCallback((index: number) => {
    const container = containerRef.current;
    const activeEl = itemsRef.current[index];
    if (!container || !activeEl) return;

    const containerWidth = container.offsetWidth;
    const itemCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2;
    const targetX = containerWidth / 2 - itemCenter;
    setTranslateX(targetX);
  }, []);

  useEffect(() => {
    updatePosition(selectedIndex);
  }, [selectedIndex, updatePosition]);

  useEffect(() => {
    const handleResize = () => updatePosition(selectedIndex);
    window.addEventListener('resize', handleResize);

    const rafId = requestAnimationFrame(() => {
      updatePosition(selectedIndex);
    });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        updatePosition(selectedIndex);
      });
      ro.observe(containerRef.current);
      itemsRef.current.forEach((el) => {
        if (el) ro?.observe(el);
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      ro?.disconnect();
    };
  }, [selectedIndex, updatePosition]);

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

      {/* Camera Mode Dial Navbar at Bottom Center */}
      <nav 
        className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none"
        aria-label="Camera Mode Navigation"
      >
        <div 
          ref={containerRef}
          className="relative w-[300px] sm:w-[360px] md:w-[400px] h-11 sm:h-12 bg-[#0c0c0b]/90 backdrop-blur-2xl border border-[#ece8e1]/15 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center overflow-hidden"
        >
          {/* Top Center Camera Reticle Pip Indicator */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] shadow-[0_0_8px_#ff3d17]" />
          </div>

          {/* Vignette / Edge Mask for Camera Dial Cylindrical Fade */}
          <div 
            className="w-full h-full flex items-center overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)',
            }}
          >
            {/* Sliding Track with Spring Physics */}
            <motion.div
              className="flex items-center space-x-6 sm:space-x-8 px-8 whitespace-nowrap will-change-transform"
              animate={{ x: translateX }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30,
                mass: 0.8,
              }}
            >
              {navLinks.map((link, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <Link
                    key={link.label}
                    ref={(el) => {
                      itemsRef.current[idx] = el;
                    }}
                    href={link.href}
                    onClick={() => {
                      setSelectedIndex(idx);
                      updatePosition(idx);
                    }}
                    className={`relative py-1 px-3 text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer select-none ${
                      isSelected
                        ? 'text-[#ff3d17] font-bold drop-shadow-[0_0_12px_rgba(255,61,23,0.8)] scale-105'
                        : 'text-[#ece8e1]/40 hover:text-[#ece8e1]/80 font-medium scale-95'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </div>
      </nav>
    </>
  );
}
