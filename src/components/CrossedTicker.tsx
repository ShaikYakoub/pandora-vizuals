'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CrossedTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDelta, setScrollDelta] = useState(0);

  useEffect(() => {
    let animationFrameId = 0;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // Only track when near or in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setScrollDelta(window.scrollY);
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

  const tapeInk = [
    'NO SEASON', '✦', 'SS27', '✦', 'PERMANENT FORM', '✦', 'NO RULES', '✦',
    'PANDORA VISUALS', '✦', 'AUTONOMY', '✦', 'SMALL BATCH', '✦',
  ];

  const tapeBone = [
    'Cut in Porto', '✧', 'Small runs', '✧', 'Worn loudly', '✧', 'Built to outlive', '✧',
    'Eleven makers', '✧', 'No markdowns', '✧', 'Permanent collection', '✧',
  ];

  // Dynamic scroll offset for kinetic responsiveness in both up and down directions
  const offsetInk = -(scrollDelta * 0.35) % 1200;
  const offsetBone = (scrollDelta * 0.35) % 1200;

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 sm:py-36 bg-[#0c0c0b] border-b border-[#ece8e1]/10 overflow-hidden select-none flex items-center justify-center min-h-[380px] sm:min-h-[440px]"
    >
      {/* Band Ink: -4deg Angle */}
      <div
        className="absolute w-[130%] -left-[15%] bg-[#171716] border-y border-[#ece8e1]/15 py-3.5 sm:py-5 shadow-2xl overflow-hidden will-change-transform z-10"
        style={{
          transform: 'rotate(-4deg)',
        }}
      >
        <div
          className="flex items-center space-x-8 text-[#ece8e1] font-anton text-3xl sm:text-5xl lg:text-6xl tracking-wider uppercase whitespace-nowrap will-change-transform"
          style={{
            transform: `translateX(${offsetInk}px)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {tapeInk.concat(tapeInk).concat(tapeInk).map((item, idx) => (
            <span
              key={idx}
              className={item === '✦' ? 'text-[#ff3d17] text-2xl sm:text-4xl px-2' : ''}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Band Bone: +3deg Angle */}
      <div
        className="absolute w-[130%] -left-[15%] bg-[#ece8e1] py-3.5 sm:py-5 shadow-2xl overflow-hidden will-change-transform z-20"
        style={{
          transform: 'rotate(3deg)',
        }}
      >
        <div
          className="flex items-center space-x-8 text-[#0c0c0b] font-serif-italic text-3xl sm:text-5xl lg:text-6xl whitespace-nowrap will-change-transform"
          style={{
            transform: `translateX(${offsetBone}px)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {tapeBone.concat(tapeBone).concat(tapeBone).map((item, idx) => (
            <span
              key={idx}
              className={item === '✧' ? 'text-[#ff3d17] text-2xl sm:text-4xl px-2' : ''}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
