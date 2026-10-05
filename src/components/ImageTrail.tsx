'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useCards } from '@/context/CardsContext';

interface TrailItem {
  id: number;
  x: number;
  y: number;
  isPercent?: boolean;
  rotate: number;
  src: string;
  isMobileAmbient?: boolean;
}

// Fallback studio work images if context is initializing
const FALLBACK_WORK_IMAGES = [
  '/images/IMG_20260814_192431_1.webp',
  '/images/IMG_20260929_180412.webp',
  '/images/IMG_20260929_181412.webp',
  '/images/IMG_20260929_181426.webp',
  '/images/IMG_20260929_181441.webp',
  '/images/IMG_20261003_171238.webp',
  '/images/IMG_20261003_174658.webp',
  '/images/portrait_2160x3840.webp',
];

// Strategic perimeter zones for mobile screens so photos frame the quote and camera button
const MOBILE_ZONES = [
  { xPercent: 25, yPercent: 24 }, // Top Left
  { xPercent: 75, yPercent: 74 }, // Bottom Right
  { xPercent: 75, yPercent: 26 }, // Top Right
  { xPercent: 24, yPercent: 72 }, // Bottom Left
  { xPercent: 18, yPercent: 48 }, // Mid Left
  { xPercent: 82, yPercent: 50 }, // Mid Right
];

export default function ImageTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TrailItem[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const counterRef = useRef(0);
  const lastZoneRef = useRef(0);
  const lastImageIndexRef = useRef<number>(-1);
  const [isMobile, setIsMobile] = useState(false);

  // Retrieve dynamic cards from context
  const { cards } = useCards();

  // Dynamic pool of work images from active portfolio cards
  const workImages = useMemo(() => {
    // 1. Prioritize active cards from work-specific sections ('shop' / Our Work, 'home-drop', 'home-edit', 'lookbook')
    const workCards = cards.filter(
      (c) =>
        c.isActive !== false &&
        typeof c.image === 'string' &&
        c.image.trim().length > 0 &&
        (c.section === 'shop' ||
          c.section === 'home-drop' ||
          c.section === 'home-edit' ||
          c.section === 'lookbook')
    );

    const uniqueWorkImages = Array.from(new Set(workCards.map((c) => c.image.trim())));
    if (uniqueWorkImages.length > 0) {
      return uniqueWorkImages;
    }

    // 2. If work-specific cards are empty, include any active non-moodboard card image
    const anyStudioCards = Array.from(
      new Set(
        cards
          .filter(
            (c) =>
              c.isActive !== false &&
              typeof c.image === 'string' &&
              c.image.trim().length > 0 &&
              c.section !== 'home-moodboard'
          )
          .map((c) => c.image.trim())
      )
    );

    if (anyStudioCards.length > 0) {
      return anyStudioCards;
    }

    // 3. Fallback to default studio work images
    return FALLBACK_WORK_IMAGES;
  }, [cards]);

  const workImagesRef = useRef(workImages);
  useEffect(() => {
    workImagesRef.current = workImages;
  }, [workImages]);

  // Pick a random work image, avoiding immediate consecutive duplicates
  const getRandomImage = useCallback(() => {
    const pool = workImagesRef.current;
    if (!pool || pool.length === 0) {
      return FALLBACK_WORK_IMAGES[Math.floor(Math.random() * FALLBACK_WORK_IMAGES.length)];
    }
    if (pool.length === 1) return pool[0];

    let nextIdx: number;
    let attempts = 0;
    do {
      nextIdx = Math.floor(Math.random() * pool.length);
      attempts++;
    } while (nextIdx === lastImageIndexRef.current && attempts < 10);

    lastImageIndexRef.current = nextIdx;
    return pool[nextIdx];
  }, []);

  // Detect mobile / touch devices
  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      const isSmall = window.innerWidth < 820;
      setIsMobile(isTouch || isSmall);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop Pointer Move Trail
  const addPointerPoint = useCallback((x: number, y: number) => {
    const id = counterRef.current++;
    const src = getRandomImage();
    const rotate = (Math.random() * 2 - 1) * 6; // -6 to +6 degrees natural tilt

    setItems((prev) => [...prev.slice(-7), { id, x, y, rotate, src }]);

    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  }, [getRandomImage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lastPosRef.current = null;
        return;
      }

      if (!lastPosRef.current) {
        lastPosRef.current = { x, y };
        return;
      }

      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist >= 95) {
        lastPosRef.current = { x, y };
        addPointerPoint(x, y);
      }
    };

    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - lastWheelTime < 240) return;
      if (!lastPosRef.current) return;

      if (Math.abs(e.deltaY) > 30) {
        lastWheelTime = now;
        const jitterX = (Math.random() * 2 - 1) * 35;
        const jitterY = (Math.random() * 2 - 1) * 35;
        addPointerPoint(lastPosRef.current.x + jitterX, lastPosRef.current.y + jitterY);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [addPointerPoint]);

  // Mobile Ambient Loop: continuous flow keeping 1-2 images alive at all times
  useEffect(() => {
    if (!isMobile) return;

    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const spawnMobileImage = () => {
      if (isCancelled) return;

      const id = counterRef.current++;
      const src = getRandomImage();

      // Pick zone different from previous to prevent overlap
      const nextZoneIdx =
        (lastZoneRef.current + 1 + Math.floor(Math.random() * (MOBILE_ZONES.length - 2))) %
        MOBILE_ZONES.length;
      lastZoneRef.current = nextZoneIdx;

      const baseZone = MOBILE_ZONES[nextZoneIdx];
      // Subtle organic jitter
      const jitterX = (Math.random() * 2 - 1) * 6;
      const jitterY = (Math.random() * 2 - 1) * 5;
      const x = Math.min(Math.max(baseZone.xPercent + jitterX, 15), 85);
      const y = Math.min(Math.max(baseZone.yPercent + jitterY, 18), 82);
      const rotate = (Math.random() * 2 - 1) * 5;

      const newItem: TrailItem = {
        id,
        x,
        y,
        isPercent: true,
        rotate,
        src,
        isMobileAmbient: true,
      };

      // Keep max 2 ambient images simultaneously alive
      setItems((prev) => [...prev.slice(-1), newItem]);

      // Remove after 2.8s total lifetime
      setTimeout(() => {
        if (isCancelled) return;
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, 2800);

      // Spawn next image in 1.4s (seamless 50% overlap cycle)
      timeoutId = setTimeout(spawnMobileImage, 1400);
    };

    // First spawn immediately
    spawnMobileImage();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isMobile, getRandomImage]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {items.map((item, index) => {
        // Calculate age relative to newest item (0 is newest/first image at cursor)
        const age = items.length - 1 - index;
        // First image is largest (1.40x ~350px), subsequent trailing images reduce size one after another
        const scale = item.isMobileAmbient
          ? age === 0 ? 1.15 : 0.85
          : Math.max(1.4 * Math.pow(0.82, age), 0.32);

        return (
          <div
            key={item.id}
            className="absolute pointer-events-none will-change-[transform,opacity]"
            style={{
              left: item.isPercent ? `${item.x}%` : `${item.x}px`,
              top: item.isPercent ? `${item.y}%` : `${item.y}px`,
              zIndex: 10 + index,
              ['--trail-rot' as any]: `${item.rotate}deg`,
              animation: item.isMobileAmbient
                ? 'mobileAmbientFloat 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                : 'framerTrailReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Inner Scaling Container: newest image is biggest, trailing circles step down progressively */}
            <div
              className={`overflow-hidden rounded-full aspect-square border-2 border-[#ece8e1]/40 shadow-[0_24px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.06)] will-change-transform ${
                item.isMobileAmbient
                  ? 'w-[150px] sm:w-[185px] h-[150px] sm:h-[185px]'
                  : 'w-[210px] sm:w-[250px] h-[210px] sm:h-[250px]'
              }`}
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <img
                src={item.src}
                alt=""
                decoding="async"
                className="w-full h-full object-cover rounded-full select-none pointer-events-none"
              />
              {item.isMobileAmbient && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
