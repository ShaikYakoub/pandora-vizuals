'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useCards } from '@/context/CardsContext';

export default function DropScroller() {
  const { sectionCards, loading } = useCards('home-drop');
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [maxScrollDistance, setMaxScrollDistance] = useState(2000);
  const [currentTranslateX, setCurrentTranslateX] = useState(0);
  const [velocitySkew, setVelocitySkew] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Measure track scroll width vs viewport width
  useEffect(() => {
    const calculateDistance = () => {
      if (!trackRef.current || !sectionRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const distance = Math.max(trackWidth - viewportWidth + 80, 0);
      setMaxScrollDistance(distance);
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

  // Scroll listener for sticky pinning, progress scrubbing, and velocity skew
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let skewDecayTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const now = performance.now();
      const currentScrollY = window.scrollY;

      // Scroll delta & velocity
      const dt = Math.max(now - lastTime, 16);
      const dy = currentScrollY - lastScrollY;
      const velocity = (dy / dt) * 1000; // pixels per second

      lastScrollY = currentScrollY;
      lastTime = now;

      // When section is in view / pinning
      // Section starts pinning when top reaches 0, ends when bottom reaches window.innerHeight
      const totalScrollableHeight = sectionRef.current.offsetHeight - window.innerHeight;
      if (totalScrollableHeight > 0) {
        const scrolledIntoSection = -rect.top;
        const progress = Math.min(Math.max(scrolledIntoSection / totalScrollableHeight, 0), 1);
        const targetX = progress * maxScrollDistance;
        setCurrentTranslateX(targetX);

        // Calculate velocity skew
        // Slower or faster skew clamped between -6 and +6 degrees
        const rawSkew = Math.max(Math.min(velocity / 240, 6), -6);
        setVelocitySkew(-rawSkew);

        // Smoothly decay skew back to 0 when scroll ceases
        clearTimeout(skewDecayTimeout);
        skewDecayTimeout = setTimeout(() => {
          setVelocitySkew(0);
        }, 120);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(skewDecayTimeout);
    };
  }, [maxScrollDistance]);

  const looksCount = (sectionCards.length || 8).toString().padStart(2, '0');

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
            transform: `translateX(-${currentTranslateX}px)`,
            transition: 'transform 0.08s linear',
          }}
        >
          {sectionCards.map((card, index) => {
            const cardWidth = isMobile ? '270px' : '440px';

            return (
              <div
                key={card.id}
                className="flex-none group select-none will-change-transform"
                style={{
                  width: cardWidth,
                  transform: `skewX(${velocitySkew.toFixed(2)}deg)`,
                  transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[3/4] bg-[#171716] overflow-hidden border border-[#ece8e1]/10">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 810px) 270px, 440px"
                    priority={index < 2}
                  />

                  {/* Subtle Vignette on Hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
