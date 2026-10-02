'use client';

import React, { useEffect, useState } from 'react';

export default function CursorTracker() {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [visible]);

  return (
    <div className="border-b border-[#ece8e1]/10 bg-[#0c0c0b] py-2.5 px-4 sm:px-8 text-[11px] font-mono tracking-widest text-[#8c8880] select-none">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17]" />
          <span>SS27 — No Season Collection</span>
        </div>
        <div className="hidden md:block">PORTO — MARSEILLE — ONLINE</div>
        <div className="flex items-center space-x-2">
          <span className="text-[#ece8e1]">
            {visible ? `X: ${coords.x} Y: ${coords.y}` : 'MOVE YOUR CURSOR'}
          </span>
        </div>
      </div>
    </div>
  );
}
