'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface TrailItem {
  id: number;
  x: number;
  y: number;
  isPercent?: boolean;
  rotate: number;
  src: string;
  isMobileAmbient?: boolean;
}

const TRAIL_IMAGES = [
  'https://framerusercontent.com/images/W41nPdozIWFrp0l6HsSpmAhQj38.jpg?width=600&height=906',
  'https://framerusercontent.com/images/zMHq6UeG6UUOgGTtP0AhTVMSiA.jpg?width=600&height=900',
  'https://framerusercontent.com/images/v6StnbgGcvM2K33ViXLn6WPioQ.jpg?width=600&height=750',
  'https://framerusercontent.com/images/ZZ83Utg2JYHfYT5n18eWqOVIq4.jpg?width=600&height=900',
  'https://framerusercontent.com/images/iRsQcqmr5eJsfsuie4S9EwAmA.jpg?width=600&height=840',
  'https://framerusercontent.com/images/GTn9pLq00uE3ZcQhSgcA1qFPNLY.jpg?width=1000&height=1500',
  'https://framerusercontent.com/images/0nLgNHI2I09hUmNIv3HlhqNjrE.jpg?width=1000&height=1500',
  'https://framerusercontent.com/images/o3PRQp77gGJeh1W9vE4vP2dOmBE.jpg?width=1000&height=1497',
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
  const imgIndexRef = useRef(0);
  const lastZoneRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

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
  const addPointerPoint = (x: number, y: number) => {
    const id = counterRef.current++;
    const src = TRAIL_IMAGES[imgIndexRef.current % TRAIL_IMAGES.length];
    imgIndexRef.current++;
    const rotate = (Math.random() * 2 - 1) * 6; // -6 to +6 degrees natural tilt

    setItems((prev) => [...prev.slice(-7), { id, x, y, rotate, src }]);

    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 1100);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
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

      if (dist >= 130) {
        lastPosRef.current = { x, y };
        addPointerPoint(x, y);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Mobile Ambient Loop: continuous flow keeping 1-2 images alive at all times
  useEffect(() => {
    if (!isMobile) return;

    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const spawnMobileImage = () => {
      if (isCancelled) return;

      const id = counterRef.current++;
      const src = TRAIL_IMAGES[imgIndexRef.current % TRAIL_IMAGES.length];
      imgIndexRef.current++;

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
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute pointer-events-none will-change-[transform,opacity,filter] overflow-hidden rounded-none ${
            item.isMobileAmbient
              ? 'w-[130px] sm:w-[165px] h-[175px] sm:h-[220px] border border-[#ece8e1]/20 shadow-[0_16px_40px_rgba(0,0,0,0.85)]'
              : 'w-[210px] sm:w-[240px] h-[275px] sm:h-[312px] shadow-2xl'
          }`}
          style={{
            left: item.isPercent ? `${item.x}%` : `${item.x}px`,
            top: item.isPercent ? `${item.y}%` : `${item.y}px`,
            ['--trail-rot' as any]: `${item.rotate}deg`,
            animation: item.isMobileAmbient
              ? 'mobileAmbientFloat 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              : 'framerTrailReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <Image
            src={item.src}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 165px, 240px"
            priority={false}
          />
          {item.isMobileAmbient && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          )}
        </div>
      ))}
    </div>
  );
}
