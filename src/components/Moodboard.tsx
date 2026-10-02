'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCards } from '@/context/CardsContext';
import TextScramble from './TextScramble';

export default function Moodboard() {
  const { sectionCards } = useCards('home-moodboard');
  const sectionRef = useRef<HTMLElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [zIndexMap, setZIndexMap] = useState<Record<string, number>>({});
  const [highestZ, setHighestZ] = useState(10);
  const [scrollYOffset, setScrollYOffset] = useState(0);

  // Parallax float on scroll
  useEffect(() => {
    let animationFrameId = 0;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const centerOffset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.08;
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

  const startDrag = (id: string, clientX: number, clientY: number) => {
    setDraggingId(id);
    setDragStart({ x: clientX, y: clientY });

    const nextZ = highestZ + 1;
    setHighestZ(nextZ);
    setZIndexMap((prev) => ({ ...prev, [id]: nextZ }));
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!draggingId || !dragStart) return;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    setPositions((prev) => {
      const current = prev[draggingId] || { x: 0, y: 0 };
      return {
        ...prev,
        [draggingId]: { x: current.x + deltaX, y: current.y + deltaY },
      };
    });

    setDragStart({ x: clientX, y: clientY });
  };

  const endDrag = () => {
    setDraggingId(null);
    setDragStart(null);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
      onMouseUp={endDrag}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={endDrag}
      className="py-24 sm:py-32 px-4 sm:px-8 bg-[#ece8e1] text-[#0c0c0b] relative overflow-hidden select-none border-b border-[#0c0c0b]/15"
    >
      <div className="max-w-[1720px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#6b675f] uppercase pb-4 border-b border-[#0c0c0b]/15 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[#ff3d17] font-bold">(04)</span>
            <TextScramble text="— MOODBOARD · DRAG THE PIECES" />
          </div>
          <div>
            <TextScramble text="INTERACTIVE STUDIO BOARD" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="font-anton text-5xl sm:text-7xl lg:text-9xl tracking-tight text-[#0c0c0b]">
            PIN IT. DRAG IT. <span className="text-[#ff3d17]">WEAR IT.</span>
          </h2>
          <p className="text-xs font-mono text-[#6b675f] tracking-wider uppercase">
            Click and drag polaroids around the atelier board.
          </p>
        </div>

        {/* Polaroids Canvas Grid */}
        <div className="relative min-h-[580px] sm:min-h-[640px] w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-8">
          {sectionCards.map((card, index) => {
            const rot =
              card.metadata?.rotation ??
              (index % 2 === 0 ? -1 : 1) * ((index * 3) % 8 + 2);
            const pos = positions[card.id] || { x: 0, y: 0 };
            const z = zIndexMap[card.id] || index + 1;
            const isDragging = draggingId === card.id;

            // Staggered parallax float per column
            const parallaxMultiplier = (index % 3 - 1) * 1.2;
            const cardParallaxY = scrollYOffset * parallaxMultiplier;

            return (
              <div
                key={card.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  startDrag(card.id, e.clientX, e.clientY);
                }}
                onTouchStart={(e) => {
                  startDrag(card.id, e.touches[0].clientX, e.touches[0].clientY);
                }}
                style={{
                  transform: `translate(${pos.x}px, ${pos.y + cardParallaxY}px) rotate(${rot}deg) scale(${isDragging ? 1.06 : 1})`,
                  zIndex: z,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  touchAction: 'none',
                }}
                className="bg-white p-3 pb-8 polaroid-shadow border border-[#dcd6cc] transition-transform duration-75 relative group select-none max-w-[240px] mx-auto w-full will-change-transform"
              >
                {/* Simulated Tape at top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-[#ece8e1]/70 backdrop-blur-sm -rotate-3 border border-black/5 opacity-80" />

                {/* Photo Area */}
                <div className="relative aspect-[3/4] w-full bg-[#171716] overflow-hidden mb-3">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    draggable={false}
                    className="object-cover pointer-events-none select-none"
                    sizes="240px"
                  />
                </div>

                {/* Polaroid Caption */}
                <div className="font-mono text-[10px] sm:text-[11px] font-bold text-[#0c0c0b] uppercase tracking-wider text-center pt-1 truncate">
                  {card.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
