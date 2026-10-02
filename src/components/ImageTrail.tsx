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
  'https://framerusercontent.com/images/GTn9pLq00uE3ZcQhSgcA1qFPNLY.jpg?width=1000&height=1500',
  'https://framerusercontent.com/images/0nLgNHI2I09hUmNIv3HlhqNjrE.jpg?width=1000&height=1500',
  'https://framerusercontent.com/images/o3PRQp77gGJeh1W9vE4vP2dOmBE.jpg?width=1000&height=1497',
  'https://framerusercontent.com/images/mZnHFEEvP2RtX33sJmhtxQWlFU.jpg?width=1000&height=1500',
  'https://framerusercontent.com/images/F8nsRHrUNKzR4Mwj0156LySkAA.jpg?width=1000&height=1500',
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
    const rotate = (Math.random() * 2 - 1) * 8; // -8 to +8 degrees

    setItems((prev) => [...prev.slice(-9), { id, x, y, rotate, src }]);

    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 900);
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

      if (dist >= 90) {
        lastPosRef.current = { x, y };
        addPoint(x, y);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Touch / mobile fallback interval
    let autoInterval: NodeJS.Timeout;
    if (window.matchMedia('(hover: none)').matches) {
      autoInterval = setInterval(() => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const rx = rect.width * (0.2 + Math.random() * 0.6);
        const ry = rect.height * (0.25 + Math.random() * 0.5);
        addPoint(rx, ry);
      }, 800);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (autoInterval) clearInterval(autoInterval);
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
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[160px] sm:w-[200px] aspect-[3/4] bg-[#171716] p-1.5 shadow-2xl border border-white/10 transition-opacity duration-300"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
            animation: 'trailFade 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-[#0c0c0b]">
            <Image
              src={item.src}
              alt=""
              fill
              className="object-cover"
              sizes="200px"
              priority={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
