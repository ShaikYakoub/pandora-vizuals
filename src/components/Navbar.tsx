'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PandoraLogo from './PandoraLogo';

export const getNavIndex = (path: string): number => {
  if (!path || path === '/') return 1; // HOME
  if (path.startsWith('/work') || path.startsWith('/shop') || path === '/lookbook') return 0; // WORK
  if (path.startsWith('/contact') || path.startsWith('/about')) return 2; // CONTACT
  return 1;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: 'WORK', href: '/work/' },
    { label: 'HOME', href: '/' },
    { label: 'CONTACT', href: '/contact/' },
  ];

  const [activeIndex, setActiveIndex] = useState(() => getNavIndex(pathname));
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [translateX, setTranslateX] = useState<number | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isTopOverLight, setIsTopOverLight] = useState<boolean>(false);
  const [isBottomOverLight, setIsBottomOverLight] = useState<boolean>(false);

  // Sync active index with router pathname
  useEffect(() => {
    setActiveIndex(getNavIndex(pathname));
  }, [pathname]);

  // Center the active item in the camera track
  useEffect(() => {
    const updatePosition = () => {
      const activeEl = itemRefs.current[activeIndex];
      if (activeEl && trackRef.current) {
        const itemCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2;
        setTranslateX(-itemCenter);
      }
    };

    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);

    if (!isReady) {
      const timer = setTimeout(() => setIsReady(true), 60);
      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timer);
      };
    }

    window.addEventListener('resize', updatePosition);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
    };
  }, [activeIndex, isReady]);

  // Dynamic light/dark background detection for adaptive glass contrast (throttled with rAF)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const lightElements = document.querySelectorAll(
            '[data-theme="light"], [data-bg="white"], [data-bg="light"], .bg-white, .bg-\\[\\#ece8e1\\], .bg-\\[\\#ffffff\\], .bg-\\[\\#fff\\]'
          );
          if (lightElements.length > 0) {
            const windowHeight = window.innerHeight;
            let topLight = false;
            let bottomLight = false;

            lightElements.forEach((el) => {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 75 && rect.bottom >= 10) {
                topLight = true;
              }
              if (rect.top <= windowHeight - 20 && rect.bottom >= windowHeight - 80) {
                bottomLight = true;
              }
            });

            setIsTopOverLight(topLight);
            setIsBottomOverLight(bottomLight);
          } else {
            setIsTopOverLight(false);
            setIsBottomOverLight(false);
          }
          ticking = false;
        });
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, idx: number) => {
    const currentClean = (pathname || '/').replace(/\/$/, '') || '/';
    const targetClean = href.replace(/\/$/, '') || '/';

    if (currentClean === targetClean) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveIndex(idx);
  };

  return (
    <>
      {/* Full-width Progressive Gradient Blur Top Navbar (No sharp cut, smooth feathered flow) */}
      <header
        className="fixed top-0 left-0 right-0 w-full h-24 sm:h-28 md:h-32 z-40 pointer-events-none select-none overflow-hidden"
        aria-label="Top Brand Bar"
      >
        {/* High-performance hardware-accelerated progressive backdrop blur */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
              transform: 'translateZ(0)',
            }}
          />
          {/* Adaptive frosted glass gradient (Smoothly fades in over light sections, transparent over dark) */}
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out ${
              isTopOverLight ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0) 100%)',
            }}
          />
        </div>

        {/* Centered Pandora Logo - Twice the previous size */}
        <div className="relative z-10 w-full h-full flex items-start justify-center pt-3 sm:pt-3.5 md:pt-4">
          <Link 
            href="/" 
            prefetch={false}
            className={`pointer-events-auto inline-flex items-center justify-center select-none cursor-pointer ${
              isTopOverLight ? 'text-[#0c0c0b]' : 'text-[#ece8e1]'
            }`}
            aria-label="Pandora Visuals Home"
          >
            <PandoraLogo 
              theme={isTopOverLight ? 'dark' : 'white'}
              className={`h-11 sm:h-11 md:h-13 lg:h-15 max-w-[86vw] sm:max-w-none w-auto block select-none ${
                isTopOverLight 
                ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]' 
                : 'drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]'
              }`} 
            />
          </Link>
        </div>
      </header>

      {/* Full-width Progressive Gradient Blur Bottom Navbar (Camera Mode Switcher, No Pill Box) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 w-full h-18 sm:h-22 md:h-24 z-50 pointer-events-none select-none overflow-hidden"
        aria-label="Primary Navigation"
      >
        {/* High-performance hardware-accelerated progressive backdrop blur */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
              transform: 'translateZ(0)',
            }}
          />
          {/* Adaptive frosted glass gradient (Smoothly fades in over light sections, transparent over dark) */}
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out ${
              isBottomOverLight ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0) 100%)',
            }}
          />
        </div>

        {/* Center Reticle / Subtle Camera Indicator Dot */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2.5 sm:bottom-3.5 pointer-events-none flex flex-col items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] shadow-[0_0_10px_#ff3d17] animate-pulse" />
        </div>

        {/* Camera Mode Sliding Track */}
        <div className="relative z-10 w-full h-full flex items-center">
          <div 
            ref={trackRef}
            className="absolute flex items-center space-x-6 sm:space-x-10 pointer-events-auto whitespace-nowrap will-change-transform pb-2 sm:pb-3"
            style={{
              left: '50%',
              transform: translateX !== null ? `translateX(${translateX}px)` : 'translateX(-50%)',
              transition: isReady ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            }}
          >
            {navLinks.map((link, idx) => {
              const active = idx === activeIndex;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  prefetch={false}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onClick={(e) => handleNavClick(e, link.href, idx)}
                  className={`font-dune relative py-2 px-3 sm:px-4 flex items-center gap-1.5 text-[13px] sm:text-[15px] md:text-base tracking-[0.12em] sm:tracking-[0.14em] uppercase font-semibold transition-all duration-300 cursor-pointer select-none ${
                    active
                      ? 'text-[#ff3d17] !font-bold scale-110 drop-shadow-[0_0_14px_rgba(255,61,23,0.9)]'
                      : isBottomOverLight
                      ? 'text-[#0c0c0b]/75 hover:text-[#0c0c0b] scale-95'
                      : 'text-[#ece8e1]/65 hover:text-[#ece8e1] scale-95'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
