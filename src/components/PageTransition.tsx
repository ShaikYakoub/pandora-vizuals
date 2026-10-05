'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from './SmoothScroll';
import { getNavIndex } from './Navbar';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lenis } = useLenis();
  const prevPathnameRef = useRef<string>(pathname);
  const isFirstMountRef = useRef<boolean>(true);

  const prevIndex = getNavIndex(prevPathnameRef.current);
  const currentIndex = getNavIndex(pathname);

  // Determine slide direction matching the camera bottom track
  let animClass = '';
  if (!isFirstMountRef.current && currentIndex !== prevIndex) {
    animClass = currentIndex > prevIndex ? 'camera-slide-right' : 'camera-slide-left';
  }

  useEffect(() => {
    // Reset scroll position immediately on route change, matching camera app mode switch
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    prevPathnameRef.current = pathname;
    isFirstMountRef.current = false;
  }, [pathname, lenis]);

  return (
    <div className="relative w-full overflow-x-clip min-h-screen">
      <div key={pathname} className={`w-full ${animClass}`}>
        {children}
      </div>
    </div>
  );
}
