'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useLenis } from './SmoothScroll';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lenis } = useLenis();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Reset scroll position immediately on route change
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, lenis]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Top Hairline Progress Sweep */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key={`progress-${pathname}`}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="fixed top-0 left-0 right-0 h-[2px] bg-[#ff3d17] z-[120] pointer-events-none shadow-[0_0_8px_rgba(255,61,23,0.8)]"
          />
        )}
      </AnimatePresence>

      {/* Shutter Reveal Curtain */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key={`curtain-${pathname}`}
            initial={{ y: '0%' }}
            animate={{ y: '-100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] pointer-events-none bg-[#0c0c0b] border-b border-[#ff3d17]/40 shadow-2xl flex items-center justify-center"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8c8880] select-none opacity-40">
              BUREAU27 // PORTO
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Route Content */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
