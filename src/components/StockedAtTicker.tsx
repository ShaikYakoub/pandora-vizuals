'use client';

import React from 'react';

export default function StockedAtTicker() {
  const highlights = [
    'Viral Reels — 10M+ Organic Views',
    'Kids Milestone Birthdays & Cake Smash',
    'Adult Milestone Events & Galas',
    'Full-Funnel Digital Marketing',
    'Cinematic 4K Video Production',
    'Creative Brand Direction & Campaigns',
    'Private Celebrations & Luxury Parties',
  ];

  return (
    <div className="w-full bg-[#0c0c0b] border-t border-b border-[#ece8e1]/10 py-5 overflow-hidden select-none">
      <div className="flex items-center">
        <div className="animate-marquee-left flex items-center space-x-12 whitespace-nowrap">
          {highlights.concat(highlights).concat(highlights).map((item, idx) => (
            <div key={idx} className="flex items-center space-x-12">
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
