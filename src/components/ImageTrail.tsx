'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface TrailItem {
  id: number;
  x: number;
  y: number;
  isPercent?: boolean;
  rotate: number;
  src: string;
  isMobileAmbient?: boolean;
}

// Curated high-performance portrait images (deterministic sequential assignment to eliminate random pick lag)
const CURATED_TRAIL_IMAGES = [
  '/images/IMG_20260929_180412.webp',
  '/images/IMG_20261003_171238.webp',
  '/images/IMG_20261003_174658.webp',
  '/images/IMG_20260814_192431_1.webp',
  '/images/IMG_20260929_181412.webp',
  '/images/portrait_2160x3840.webp',
];

// Progressive trail scales: newest/main image at cursor is biggest (1.25x), rest in decreasing order
const TRAIL_SCALES = [1.25, 1.05, 0.88, 0.74, 0.60];

// Perimeter zones for mobile screens
const MOBILE_ZONES = [
  { xPercent: 25, yPercent: 24 },
  { xPercent: 75, yPercent: 74 },
  { xPercent: 75, yPercent: 26 },
  { xPercent: 24, yPercent: 72 },
  { xPercent: 18, yPercent: 48 },
  { xPercent: 82, yPercent: 50 },
];

// Memoized Trail Item: Isolated GPU rendering with smooth hardware transform and ease-in/ease-out bloom motion
const TrailItemView = React.memo(function TrailItemView({
  item,
  scale,
}: {
  item: TrailItem;
  scale: number;
}) {
  return (
    <div
      className="absolute pointer-events-none will-change-[transform,opacity]"
      style={{
        left: item.isPercent ? `${item.x}%` : `${item.x}px`,
        top: item.isPercent ? `${item.y}%` : `${item.y}px`,
        zIndex: 10 + (item.id % 40),
        transform: `translate3d(-50%, -50%, 0) scale(${scale}) rotate(${item.rotate}deg)`,
        transition: item.isMobileAmbient
          ? 'none'
          : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div
        className="will-change-[transform,opacity]"
        style={{
          animation: item.isMobileAmbient
            ? 'mobileAmbientPop 2.8s forwards'
            : 'trailPopInOut 1100ms forwards',
          transformOrigin: 'center center',
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          className={`overflow-hidden rounded-full aspect-square border-2 border-[#ece8e1]/40 shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_15px_rgba(255,255,255,0.06)] ${
            item.isMobileAmbient
              ? 'w-[150px] sm:w-[185px] h-[150px] sm:h-[185px]'
              : 'w-[220px] sm:w-[250px] h-[220px] sm:h-[250px]'
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
    </div>
  );
});

export default function ImageTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TrailItem[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const counterRef = useRef(0);
  const imageSeqRef = useRef(0);
  const mobileZoneSeqRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // Warm image cache on mount to guarantee 0ms instant display
  useEffect(() => {
    if (typeof window === 'undefined') return;
    CURATED_TRAIL_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
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

  // Desktop Pointer Move: Deterministic round-robin sequential assignment with graceful fade-out exit
  const addPointerPoint = useCallback((x: number, y: number) => {
    const id = counterRef.current++;
    const src = CURATED_TRAIL_IMAGES[imageSeqRef.current % CURATED_TRAIL_IMAGES.length];
    imageSeqRef.current++;

    // Alternating subtle organic tilt (-3.5 deg to +3.5 deg)
    const rotate = (id % 2 === 0 ? 1 : -1) * 3.5;

    // Retain up to 8 items in state so tail items smoothly complete their 350ms fade-out
    setItems((prev) => [...prev.slice(-7), { id, x, y, rotate, src }]);

    // Smooth exit: at 1100ms the item has completely dissolved (opacity: 0) via trailPopInOut,
    // so removing it from DOM is 100% invisible with zero abrupt cut
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 1150);
  }, []);

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

  // Mobile Ambient Loop: sequential curated images with perimeter float
  useEffect(() => {
    if (!isMobile) return;

    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const spawnMobileImage = () => {
      if (isCancelled) return;

      const id = counterRef.current++;
      const src = CURATED_TRAIL_IMAGES[imageSeqRef.current % CURATED_TRAIL_IMAGES.length];
      imageSeqRef.current++;

      const zoneIdx = mobileZoneSeqRef.current % MOBILE_ZONES.length;
      mobileZoneSeqRef.current++;
      const baseZone = MOBILE_ZONES[zoneIdx];

      const rotate = (id % 2 === 0 ? 1 : -1) * 3;

      const newItem: TrailItem = {
        id,
        x: baseZone.xPercent,
        y: baseZone.yPercent,
        isPercent: true,
        rotate,
        src,
        isMobileAmbient: true,
      };

      setItems((prev) => [...prev.slice(-1), newItem]);

      // Ambient image lives for 2.8s then disappears
      setTimeout(() => {
        if (isCancelled) return;
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, 2800);

      timeoutId = setTimeout(spawnMobileImage, 1400);
    };

    spawnMobileImage();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {items.map((item, index) => {
        // Age relative to newest item: 0 is newest (main image at cursor), increasing for older items
        const age = items.length - 1 - index;
        const scale = item.isMobileAmbient ? 1.0 : (TRAIL_SCALES[age] ?? 0.50);

        return <TrailItemView key={item.id} item={item} scale={scale} />;
      })}
    </div>
  );
}
