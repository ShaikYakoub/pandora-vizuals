'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
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

// Memoized Trail Item: Isolated GPU rendering prevents re-rendering siblings on every pointer event
const TrailItemView = React.memo(function TrailItemView({ item }: { item: TrailItem }) {
  return (
    <div
      className="absolute pointer-events-none will-change-[transform,opacity]"
      style={{
        left: item.isPercent ? `${item.x}%` : `${item.x}px`,
        top: item.isPercent ? `${item.y}%` : `${item.y}px`,
        zIndex: 10 + (item.id % 30),
        ['--trail-rot' as any]: `${item.rotate}deg`,
        animation: item.isMobileAmbient
          ? 'mobileAmbientFloat 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          : 'cursorTrailAppear 0.08s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        transform: 'translate3d(-50%, -50%, 0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div
        className={`overflow-hidden rounded-full aspect-square border-2 border-[#ece8e1]/40 shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_15px_rgba(255,255,255,0.06)] ${
          item.isMobileAmbient
            ? 'w-[150px] sm:w-[185px] h-[150px] sm:h-[185px]'
            : 'w-[220px] sm:w-[260px] h-[220px] sm:h-[260px]'
        }`}
      >
        <img
          src={item.src}
          alt=""
          decoding="async"
          loading="eager"
          className="w-full h-full object-cover rounded-full select-none pointer-events-none"
        />
        {item.isMobileAmbient && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
});

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

    return FALLBACK_WORK_IMAGES;
  }, [cards]);

  const workImagesRef = useRef(workImages);
  useEffect(() => {
    workImagesRef.current = workImages;
  }, [workImages]);

  // Warm image cache on mount to prevent decoding latency on pointer motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    workImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
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

  // Desktop Pointer Move Trail with RAF throttling
  const addPointerPoint = useCallback((x: number, y: number) => {
    const id = counterRef.current++;
    const src = getRandomImage();
    const rotate = (Math.random() * 2 - 1) * 6; // -6 to +6 degrees natural tilt

    setItems((prev) => [...prev.slice(-5), { id, x, y, rotate, src }]);

    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 700);
  }, [getRandomImage]);

  useEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let pendingPoint: { x: number; y: number } | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const containerEl = containerRef.current;
      if (!containerEl) return;

      const rect = containerEl.getBoundingClientRect();
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
      const distSq = dx * dx + dy * dy;

      // 80px distance threshold: 80 * 80 = 6400
      if (distSq >= 6400) {
        lastPosRef.current = { x, y };
        pendingPoint = { x, y };

        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            rafId = null;
            if (pendingPoint) {
              addPointerPoint(pendingPoint.x, pendingPoint.y);
              pendingPoint = null;
            }
          });
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [isMobile, addPointerPoint]);

  // Mobile Ambient Loop: continuous smooth perimeter display
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
      const jitterX = (Math.random() * 2 - 1) * 5;
      const jitterY = (Math.random() * 2 - 1) * 4;
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
      {items.map((item) => (
        <TrailItemView key={item.id} item={item} />
      ))}
    </div>
  );
}
