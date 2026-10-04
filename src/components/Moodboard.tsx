'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCards } from '@/context/CardsContext';

interface SlotConfig {
  top: string;
  left?: string;
  right?: string;
  rot: number;
  width: number;
  aspect: string;
  mobileTop: string;
  mobileLeft?: string;
  mobileRight?: string;
  mobileWidth: number;
}

const DEFAULT_SLOTS: SlotConfig[] = [
  {
    // Slot 0: Top-Left (LOOK 11 — CAUTION)
    top: '110px',
    left: '4%',
    rot: -8,
    width: 250,
    aspect: '3/4',
    mobileTop: '75px',
    mobileLeft: '3%',
    mobileWidth: 150,
  },
  {
    // Slot 1: Top-Right (SIGNAL RED)
    top: '90px',
    right: '5%',
    rot: 7,
    width: 260,
    aspect: '3/4',
    mobileTop: '65px',
    mobileRight: '3%',
    mobileWidth: 155,
  },
  {
    // Slot 2: Bottom-Left (CASTING — NOAILLES)
    top: '590px',
    left: '3%',
    rot: 4,
    width: 195,
    aspect: '3/4',
    mobileTop: '540px',
    mobileLeft: '3%',
    mobileWidth: 135,
  },
  {
    // Slot 3: Bottom-Center-Left (NEON TEST, 3 AM)
    top: '650px',
    left: '19%',
    rot: 6,
    width: 215,
    aspect: '3/4',
    mobileTop: '610px',
    mobileLeft: '22%',
    mobileWidth: 140,
  },
  {
    // Slot 4: Bottom-Center-Right (FITTING WALL)
    top: '620px',
    right: '21%',
    rot: -5,
    width: 225,
    aspect: '3/4',
    mobileTop: '570px',
    mobileRight: '22%',
    mobileWidth: 140,
  },
  {
    // Slot 5: Bottom-Far-Right (PORTO, STAIRWELL)
    top: '610px',
    right: '3%',
    rot: -9,
    width: 275,
    aspect: '4/3',
    mobileTop: '630px',
    mobileRight: '3%',
    mobileWidth: 155,
  },
];

export default function Moodboard() {
  const { sectionCards } = useCards('home-moodboard');
  const containerRef = useRef<HTMLElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [zIndexMap, setZIndexMap] = useState<Record<string, number>>({});
  const [highestZ, setHighestZ] = useState(25);
  const [scrollYOffset, setScrollYOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // High-performance drag references to eliminate React state latency during pointer movement
  const isDraggingRef = useRef(false);
  const activeIdRef = useRef<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Detect mobile screen for slot sizing
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Parallax float on scroll
  useEffect(() => {
    let animationFrameId = 0;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const centerOffset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.05;
          setScrollYOffset(centerOffset);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Pointer down trigger
  const handlePointerDown = (id: string, clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    activeIdRef.current = id;
    dragStartRef.current = { x: clientX, y: clientY };
    setDraggingId(id);
    setHighestZ((prev) => {
      const nextZ = prev + 1;
      setZIndexMap((zm) => ({ ...zm, [id]: nextZ }));
      return nextZ;
    });
  };

  // Global window listeners for drag move and pointer release
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current || !activeIdRef.current) return;
      const id = activeIdRef.current;
      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

      dragStartRef.current = { x: clientX, y: clientY };

      setPositions((prev) => {
        const curr = prev[id] || { x: 0, y: 0 };
        return {
          ...prev,
          [id]: { x: curr.x + deltaX, y: curr.y + deltaY },
        };
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        activeIdRef.current = null;
        setDraggingId(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
    };
  }, []);

  // Match each card to its visual slot
  const getSlotForCard = (card: (typeof sectionCards)[0], index: number): SlotConfig => {
    const t = card.title.toLowerCase();
    if (card.id === 'mood-01' || t.includes('shutter') || t.includes('caution')) return DEFAULT_SLOTS[0];
    if (card.id === 'mood-03' || t.includes('pacing') || t.includes('signal')) return DEFAULT_SLOTS[1];
    if (card.id === 'mood-05' || t.includes('grading') || t.includes('color')) return DEFAULT_SLOTS[2];
    if (card.id === 'mood-02' || t.includes('neon') || t.includes('ambience')) return DEFAULT_SLOTS[3];
    if (card.id === 'mood-04' || t.includes('lighting') || t.includes('setup')) return DEFAULT_SLOTS[4];
    if (card.id === 'mood-06' || t.includes('scout') || t.includes('location')) return DEFAULT_SLOTS[5];
    return DEFAULT_SLOTS[index % DEFAULT_SLOTS.length];
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[920px] sm:min-h-[1000px] lg:min-h-[1060px] w-full bg-[#ece8e1] text-[#0c0c0b] overflow-hidden select-none border-b border-[#0c0c0b]/15"
    >
      {/* Monumental Center Headline */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 text-center pointer-events-none select-none z-10">
        <h2 className="font-anton text-6xl sm:text-8xl md:text-9xl lg:text-[112px] leading-[0.92] tracking-tight text-[#0c0c0b] uppercase">
          FRAME IT. SHOOT IT. <br />
          <span className="text-[#ff3d17]">FEEL IT.</span>
        </h2>
      </div>

      {/* Scattered Draggable Polaroids */}
      <div className="absolute inset-0 w-full h-full">
        {sectionCards.map((card, index) => {
          const slot = getSlotForCard(card, index);
          const pos = positions[card.id] || { x: 0, y: 0 };
          const z = zIndexMap[card.id] || 15 + index;
          const isDragging = draggingId === card.id;

          // Subtle organic parallax offset
          const parallaxMultiplier = (index % 3 - 1) * 1.2;
          const cardParallaxY = scrollYOffset * parallaxMultiplier;

          const rot = card.metadata?.rotation ?? slot.rot;
          const cardWidth = isMobile ? slot.mobileWidth : slot.width;
          const topPos = isMobile ? slot.mobileTop : slot.top;
          const leftPos = isMobile ? slot.mobileLeft : slot.left;
          const rightPos = isMobile ? slot.mobileRight : slot.right;

          return (
            <div
              key={card.id}
              onMouseDown={(e) => {
                e.preventDefault();
                handlePointerDown(card.id, e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                handlePointerDown(card.id, touch.clientX, touch.clientY);
              }}
              style={{
                position: 'absolute',
                top: topPos,
                ...(leftPos ? { left: leftPos } : {}),
                ...(rightPos ? { right: rightPos } : {}),
                width: `${cardWidth}px`,
                transform: `translate(${pos.x}px, ${pos.y + cardParallaxY}px) rotate(${rot}deg) scale(${isDragging ? 1.05 : 1})`,
                zIndex: z,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              className={`bg-[#f8f6f1] p-2.5 sm:p-3 pb-6 sm:pb-8 border border-[#0c0c0b]/10 select-none will-change-transform transition-shadow duration-200 ${
                isDragging
                  ? 'shadow-[0_36px_60px_rgba(12,12,11,0.28)]'
                  : 'shadow-[0_24px_48px_rgba(12,12,11,0.18)]'
              }`}
            >
              {/* Simulated Atelier Frosted Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-[#ece8e1]/75 backdrop-blur-[2px] -rotate-2 border border-black/5 shadow-sm opacity-85 pointer-events-none" />

              {/* Photo Frame */}
              <div
                className={`relative w-full bg-[#171716] overflow-hidden mb-2.5 sm:mb-3 ${
                  slot.aspect === '4/3' ? 'aspect-[4/3]' : 'aspect-[3/4]'
                }`}
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  draggable={false}
                  className="object-cover pointer-events-none select-none"
                  sizes={`${cardWidth * 2}px`}
                  priority={index < 2}
                />
              </div>

              {/* Polaroid Chin Caption */}
              <div className="font-mono text-[10px] sm:text-[11px] font-bold text-[#0c0c0b] uppercase tracking-wider text-center pt-1 truncate select-none">
                {card.title}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
