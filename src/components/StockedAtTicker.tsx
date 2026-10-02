'use client';

import React from 'react';

export default function StockedAtTicker() {
  const stockists = [
    'Maison Oblique — Paris',
    'Kiosk Nine — Tokyo',
    'Loop Store — Berlin',
    'Hall 27 — Seoul',
    'Norte — Porto',
    'Atelier Nul — Antwerp',
    'Salt & Steel — New York',
  ];

  return (
    <div className="w-full bg-[#0c0c0b] border-t border-b border-[#ece8e1]/10 py-5 overflow-hidden select-none">
      <div className="flex items-center">
        <div className="animate-marquee-left flex items-center space-x-12 whitespace-nowrap">
          {stockists.concat(stockists).concat(stockists).map((item, idx) => (
            <div key={idx} className="flex items-center space-x-12">
              <span className="font-mono text-xs text-[#8c8880] tracking-widest uppercase">
                STOCKED AT
              </span>
              <span className="font-anton text-2xl sm:text-3xl text-[#ece8e1] tracking-wide">
                {item}
              </span>
              <span className="text-[#ff3d17] font-mono text-lg">✱</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
