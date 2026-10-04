'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useLenis } from './SmoothScroll';

const ROUTE_INDEXES: Record<string, number> = {
  '/': 0,
  '/shop': 1,
  '/lookbook': 2,
  '/about': 3,
  '/contact': 4,
};

const cameraSlideVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '18vw' : '-18vw',
    opacity: 0.55,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1] as const, // camera app mode switch decel curve
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-18vw' : '18vw',
    opacity: 0.55,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lenis } = useLenis();
  const prevPathnameRef = useRef<string>(pathname);

  const currentIndex = ROUTE_INDEXES[pathname] ?? 1;
  const prevIndex = ROUTE_INDEXES[prevPathnameRef.current] ?? 0;
  const direction = currentIndex >= prevIndex ? 1 : -1;

  useEffect(() => {
    prevPathnameRef.current = pathname;
    // Reset scroll position immediately on route change, matching Framer's instant top reset
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return (
    <div className="relative w-full overflow-x-clip">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={cameraSlideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full will-change-transform"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
