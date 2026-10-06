'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useCards } from '@/context/CardsContext';
import { useLenis } from '@/components/SmoothScroll';

export default function DropScroller() {
  const { sectionCards, loading } = useCards('home-drop');
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { lenis } = useLenis();

  const [maxScrollDistance, setMaxScrollDistance] = useState(2000);
  const maxScrollDistanceRef = useRef(2000);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    maxScrollDistanceRef.current = maxScrollDistance;
  }, [maxScrollDistance]);

  // Measure track scroll width vs viewport width
  useEffect(() => {
    const calculateDistance = () => {
      if (!trackRef.current || !sectionRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const distance = Math.max(trackWidth - viewportWidth + 80, 0);
      setMaxScrollDistance(distance);
      maxScrollDistanceRef.current = distance;
      setIsMobile(viewportWidth < 810);
    };

    calculateDistance();
    const resizeObserver = new ResizeObserver(calculateDistance);
    if (trackRef.current) resizeObserver.observe(trackRef.current);
    window.addEventListener('resize', calculateDistance);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateDistance);
    };
  }, [sectionCards]);

  // Smooth scroll sync: direct hardware-accelerated translate3d synced with Lenis
  useEffect(() => {
    let lastProgress = -1;

    const updateScroller = () => {
      if (!sectionRef.current || !trackRef.current) return;
      const totalScrollableHeight = maxScrollDistanceRef.current;
      if (totalScrollableHeight <= 0) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Skip computation if outside active viewport bounds and already settled
      if (rect.bottom < 0 && lastProgress === 1) return;
      if (rect.top > windowHeight && lastProgress === 0) return;

      const scrolledIntoSection = -rect.top;
      const progress = Math.min(Math.max(scrolledIntoSection / totalScrollableHeight, 0), 1);

      if (Math.abs(progress - lastProgress) < 0.0005) return;
      lastProgress = progress;

      const targetX = progress * totalScrollableHeight;
      trackRef.current.style.transform = `translate3d(-${targetX.toFixed(1)}px, 0, 0)`;
    };

    if (lenis) {
      lenis.on('scroll', updateScroller);
    } else {
      window.addEventListener('scroll', updateScroller, { passive: true });
    }

    updateScroller();

    return () => {
      if (lenis) {
        lenis.off('scroll', updateScroller);
      } else {
        window.removeEventListener('scroll', updateScroller);
      }
    };
  }, [lenis, maxScrollDistance]);

  if (loading && sectionCards.length === 0) {
    return (
      <section className="py-24 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-[#0c0c0b] animate-pulse">
        <div className="h-12 w-64 bg-[#171716] mb-8" />
        <div className="h-96 w-full bg-[#171716]" />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0c0c0b] border-b border-[#ece8e1]/10"
      style={{
        height: `calc(${maxScrollDistance}px + 100vh)`,
      }}
    >
      {/* Sticky Full-Viewport Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center gap-6 sm:gap-10 py-6 sm:py-10">
        {/* Top Header Bar */}
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-12 select-none z-10">
          <h2 className="font-anton text-4xl sm:text-7xl lg:text-[104px] leading-[0.9] text-[#ece8e1] tracking-tight">
            RECENT WORKS
          </h2>
        </div>

        {/* Scrubbing Horizontal Track */}
        <div
          ref={trackRef}
          className="flex gap-5 sm:gap-8 px-6 sm:px-12 w-max will-change-transform"
          style={{
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {sectionCards.map((card, index) => {
            const cardWidth = isMobile ? '270px' : '440px';

            return (
              <div
                key={card.id}
                className="flex-none group select-none cursor-pointer"
                style={{
                  width: cardWidth,
                }}
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[3/4] bg-[#171716] overflow-hidden border border-[#ece8e1]/10 group-hover:border-[#ece8e1]/30 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-500">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                    sizes="(max-width: 810px) 270px, 440px"
                    priority={index < 4}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
