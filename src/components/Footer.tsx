'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Exact Framer in-view trigger: threshold 0.2, animateOnce: false
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#ece8e1] text-[#0c0c0b] pt-[120px] pb-8 px-6 sm:px-8 select-none overflow-hidden flex flex-col items-center gap-20">
      {/* Top Container: Newsletter & Links Columns */}
      <div className="w-full max-w-[1600px] flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
        {/* Newsletter Column */}
        <div className="w-full lg:max-w-[520px] flex flex-col gap-6">
          <div className="font-mono text-xs tracking-widest text-[#8c8880] uppercase">
            Newsletter — No spam, only drops
          </div>
          <h3 className="font-serif-italic text-3xl sm:text-4xl lg:text-[44px] text-[#0c0c0b] leading-[1.08] tracking-tight">
            Drops land in your inbox before they land online.
          </h3>

          {subscribed ? (
            <div className="h-14 flex items-center px-4 bg-[#0c0c0b] text-[#ece8e1] font-mono text-xs tracking-wider">
              ✓ YOU ARE ON THE PRIVATE DROP LIST. ATELIER ACCESS GRANTED.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full max-w-[520px] h-14 flex items-center">
              {/* Input with bottom border */}
              <div className="flex-1 h-full border-b border-[#0c0c0b] flex items-center pr-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full h-full bg-transparent font-mono text-[15px] placeholder-[#8c8880] text-[#0c0c0b] outline-none"
                />
              </div>
              {/* Attached Black Subscribe Button */}
              <button
                type="submit"
                className="h-full px-[22px] bg-[#0c0c0b] text-[#ece8e1] font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 hover:bg-[#ff3d17] transition-colors shrink-0 group cursor-pointer"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>

        {/* Navigation Columns */}
        <div className="flex-1 flex flex-col sm:flex-row justify-start lg:justify-end gap-10 sm:gap-16 lg:gap-24">
          {/* INDEX */}
          <div className="flex flex-col gap-3 min-w-[100px]">
            <div className="font-mono text-xs tracking-widest text-[#8c8880] uppercase mb-1">
              Index
            </div>
            <Link href="/shop" className="font-sans text-[15px] font-medium text-[#0c0c0b] hover:text-[#ff3d17] transition-colors">
              Shop
            </Link>
            <Link href="/lookbook" className="font-sans text-[15px] font-medium text-[#0c0c0b] hover:text-[#ff3d17] transition-colors">
              Lookbook
            </Link>
            <Link href="/journal" className="font-sans text-[15px] font-medium text-[#0c0c0b] hover:text-[#ff3d17] transition-colors">
              Journal
            </Link>
            <Link href="/about" className="font-sans text-[15px] font-medium text-[#0c0c0b] hover:text-[#ff3d17] transition-colors">
              About
            </Link>
            <Link href="/contact" className="font-sans text-[15px] font-medium text-[#0c0c0b] hover:text-[#ff3d17] transition-colors">
              Contact
            </Link>
          </div>

          {/* FOLLOW */}
          <div className="flex flex-col gap-3 min-w-[100px]">
            <div className="font-mono text-xs tracking-widest text-[#8c8880] uppercase mb-1">
              Follow
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[15px] font-medium text-[#0c0c0b] hover:text-[#ff3d17] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[15px] font-medium text-[#0c0c0b] hover:text-[#ff3d17] transition-colors"
            >
              TikTok
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[15px] font-medium text-[#0c0c0b] hover:text-[#ff3d17] transition-colors"
            >
              Pinterest
            </a>
          </div>

          {/* STUDIO */}
          <div className="flex flex-col gap-3 min-w-[140px]">
            <div className="font-mono text-xs tracking-widest text-[#8c8880] uppercase mb-1">
              Studio
            </div>
            <div className="font-sans text-[15px] font-medium text-[#0c0c0b]">
              Rua das Flores 27
            </div>
            <div className="font-sans text-[15px] font-medium text-[#0c0c0b]">
              4050-265 Porto
            </div>
            <a
              href="mailto:hello@bureau27.studio"
              className="font-sans text-[15px] font-medium text-[#0c0c0b] hover:text-[#ff3d17] transition-colors"
            >
              Write to us
            </a>
          </div>
        </div>
      </div>

      {/* Monumental Wordmark (Exact Framer SVG viewBox 0 0 61 13 with 3D unfold) */}
      <div
        ref={wordmarkRef}
        style={{
          perspective: '1200px',
          width: '100%',
          maxWidth: '1600px',
        }}
        className="w-full flex justify-center overflow-visible"
      >
        <div
          style={{
            transform: isInView
              ? 'translateY(0px) rotateX(0deg) skewY(0deg)'
              : 'translateY(220px) rotateX(-60deg) skewY(8deg)',
            opacity: isInView ? 1 : 0,
            transformOrigin: 'bottom center',
            transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, opacity',
            width: '100%',
          }}
        >
          <svg
            viewBox="0 0 61 13"
            className="w-full h-auto overflow-visible select-none pointer-events-none block"
          >
            <foreignObject
              width="100%"
              height="100%"
              style={{ overflow: 'visible', transformOrigin: 'center center' }}
            >
              <p
                style={{
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '16px',
                  lineHeight: '0.8em',
                  textAlign: 'center',
                  color: '#0c0c0b',
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                BUREAU27
              </p>
            </foreignObject>
          </svg>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full max-w-[1600px] pt-5 border-t border-[#0c0c0b]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono tracking-widest text-[#0c0c0b] uppercase gap-3">
        <div>© 2027 BUREAU27. ALL RIGHTS RESERVED.</div>
        <div>CUT IN PORTO — WORN EVERYWHERE</div>
        <button
          onClick={scrollToTop}
          className="hover:text-[#ff3d17] flex items-center gap-1.5 transition-colors uppercase font-medium cursor-pointer"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
