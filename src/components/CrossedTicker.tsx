'use client';

import React from 'react';

export default function CrossedTicker() {
  const tape1 = [
    'NO SEASON', '✱', 'NO RULES', '✱', 'BUREAU27', '✱', 'SS27 OUT NOW', '✱',
    'NO SEASON', '✱', 'NO RULES', '✱', 'BUREAU27', '✱', 'SS27 OUT NOW', '✱',
    'NO SEASON', '✱', 'NO RULES', '✱', 'BUREAU27', '✱', 'SS27 OUT NOW', '✱',
  ];

  const tape2 = [
    'Cut in Porto', '✧', 'Small runs', '✧', 'Worn loudly', '✧', 'Built to outlive', '✧',
    'Cut in Porto', '✧', 'Small runs', '✧', 'Worn loudly', '✧', 'Built to outlive', '✧',
    'Cut in Porto', '✧', 'Small runs', '✧', 'Worn loudly', '✧', 'Built to outlive', '✧',
  ];

  return (
    <div className="relative w-full py-20 sm:py-28 bg-[#ff3d17] overflow-hidden select-none">
      {/* Tape 1: Black Tape angled slightly */}
      <div className="w-[120%] -ml-[10%] bg-[#0c0c0b] py-3 sm:py-4 -rotate-2 transform shadow-2xl overflow-hidden mb-4 sm:mb-6">
        <div className="animate-marquee-left flex items-center space-x-6 text-[#ece8e1] font-anton text-2xl sm:text-4xl tracking-wider uppercase whitespace-nowrap">
          {tape1.concat(tape1).map((item, idx) => (
            <span
              key={idx}
              className={item === '✱' ? 'text-[#ff3d17] text-xl sm:text-2xl px-2' : ''}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Tape 2: Cream Tape crossed at opposite angle */}
      <div className="w-[120%] -ml-[10%] bg-[#ece8e1] py-3 sm:py-4 rotate-2 transform shadow-2xl overflow-hidden">
        <div className="animate-marquee-right flex items-center space-x-6 text-[#0c0c0b] font-serif-italic text-2xl sm:text-4xl whitespace-nowrap">
          {tape2.concat(tape2).map((item, idx) => (
            <span
              key={idx}
              className={item === '✧' ? 'text-[#ff3d17] text-xl sm:text-2xl px-2' : ''}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
