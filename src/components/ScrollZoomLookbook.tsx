'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function ScrollZoomLookbook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const calculateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollable > 0) {
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
        setScrollProgress(progress);
      }
      setIsMobile(window.innerWidth < 810);
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(calculateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    calculateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Text mask zoom expansion calculation:
  // Starts at scale 1.0 (video perfectly masked inside the letters "HOW WE DO IT")
  // As user scrolls, the text mask smoothly scales up (zooming into the letters)
  const scaleProgress = Math.min(scrollProgress / 0.52, 1);
  const easedScale = Math.pow(scaleProgress, 2.2);
  const textScale = 1 + easedScale * 14;

  // Mask overlay opacity fades out as letters expand past view
  const maskOpacity = 1 - Math.min(Math.max((scrollProgress - 0.22) / 0.3, 0), 1);

  // Subtle parallax scale on the video footage
  const videoScale = 1.15 - scrollProgress * 0.15;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0c0c0b] border-b border-[#ece8e1]/10"
      style={{ height: '280vh' }}
    >
      {/* Hidden semantic heading for SEO & accessibility */}
      <h2 className="sr-only">HOW WE DO IT — Cinematic Visual Archive</h2>

      {/* Sticky Fullscreen Cinema Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0c0c0b]">
        {/* Fullscreen Video Underneath */}
        <div className="absolute inset-0 w-full h-full overflow-hidden will-change-transform z-0">
          <video
            ref={videoRef}
            src="/videos/hero-expand.mp4"
            poster="/videos/thumb1.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover will-change-transform"
            style={{
              transform: `scale(${videoScale.toFixed(3)})`,
            }}
          />
        </div>

        {/* SVG Cutout Text Mask: Shows Video Inside "HOW WE DO IT" and Expands on Scroll */}
        <svg
          className="absolute inset-0 w-full h-full z-10 will-change-transform select-none"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          style={{
            opacity: maskOpacity,
            pointerEvents: maskOpacity < 0.05 ? 'none' : 'auto',
          }}
        >
          <defs>
            <mask id="howWeDoItMask">
              {/* White background keeps the dark overlay visible */}
              <rect width="100%" height="100%" fill="white" />
              {/* Black text cuts a hole through the overlay, revealing video inside the letters */}
              <g
                style={{
                  transform: `scale(${textScale.toFixed(3)})`,
                  transformOrigin: '50% 50%',
                  willChange: 'transform',
                }}
              >
                {isMobile ? (
                  <>
                    <text
                      x="50%"
                      y="45%"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="black"
                      fontFamily="var(--font-anton), 'Dune Rise', Impact, sans-serif"
                      fontWeight="900"
                      fontSize="140"
                      letterSpacing="0.04em"
                    >
                      HOW WE
                    </text>
                    <text
                      x="50%"
                      y="57%"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="black"
                      fontFamily="var(--font-anton), 'Dune Rise', Impact, sans-serif"
                      fontWeight="900"
                      fontSize="140"
                      letterSpacing="0.04em"
                    >
                      DO IT
                    </text>
                  </>
                ) : (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="black"
                    fontFamily="var(--font-anton), 'Dune Rise', Impact, sans-serif"
                    fontWeight="900"
                    fontSize="160"
                    letterSpacing="0.06em"
                  >
                    HOW WE DO IT
                  </text>
                )}
              </g>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#0c0c0b" mask="url(#howWeDoItMask)" />
        </svg>
      </div>
    </section>
  );
}
