'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface TrailItem {
  id: number;
  x: number;
  y: number;
  rotate: number;
  src: string;
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

export default function ImageTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TrailItem[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const counterRef = useRef(0);
  const imgIndexRef = useRef(0);

  const addPoint = (x: number, y: number) => {
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
        addPoint(x, y);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute pointer-events-none will-change-[transform,opacity] w-[210px] sm:w-[240px] h-[275px] sm:h-[312px] shadow-2xl overflow-hidden"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            ['--trail-rot' as any]: `${item.rotate}deg`,
            animation: 'framerTrailReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <Image
            src={item.src}
            alt=""
            fill
            className="object-cover"
            sizes="240px"
            priority={false}
          />
        </div>
      ))}
    </div>
  );
}
