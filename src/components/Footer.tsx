'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);

  // In-view observer for 3D unfold entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Smooth scroll parallax for the monumental wordmark
  useEffect(() => {
    let animationFrameId = 0;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!footerRef.current) return;
        const rect = footerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
          // As user reaches bottom of page, scrub subtle upward translation
          const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
          const offset = (progress - 0.5) * -30;
          setParallaxY(offset);
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 6000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-[#ece8e1] text-[#0c0c0b] pt-28 sm:pt-32 pb-8 px-6 sm:px-12 select-none overflow-hidden relative"
    >
      <div className="max-w-[1720px] mx-auto space-y-16 sm:space-y-24">
        {/* Top Section: Newsletter & Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Newsletter Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase">
              NEWSLETTER — NO SPAM, ONLY DROPS
            </div>
            <h3 className="font-serif-italic text-3xl sm:text-4xl lg:text-[44px] text-[#0c0c0b] leading-[1.08] tracking-tight">
              Drops land in your inbox before they land online.
            </h3>

            {subscribed ? (
              <div className="p-4 bg-[#0c0c0b] text-[#ece8e1] font-mono text-xs tracking-wider">
                ✓ YOU ARE ON THE PRIVATE DROP LIST. ATELIER ACCESS GRANTED.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center max-w-[500px] w-full pt-2">
                {/* Input with bottom border */}
                <div className="flex-1 h-14 border-b border-[#0c0c0b] flex items-center pr-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-transparent font-mono text-[15px] placeholder-[#8c8880] text-[#0c0c0b] outline-none"
                  />
                </div>
                {/* Attached Black Subscribe Button with Arrow */}
                <button
                  type="submit"
                  className="h-14 px-6 bg-[#0c0c0b] text-[#ece8e1] font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 hover:bg-[#ff3d17] transition-colors shrink-0 group cursor-pointer"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:pl-12">
            {/* INDEX */}
            <div className="space-y-4">
              <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase">INDEX</div>
              <ul className="space-y-2.5 font-medium text-sm sm:text-base text-[#0c0c0b]">
                <li>
                  <Link href="/shop" className="hover:text-[#ff3d17] transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/lookbook" className="hover:text-[#ff3d17] transition-colors">
                    Lookbook
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="hover:text-[#ff3d17] transition-colors">
                    Journal
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#ff3d17] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#ff3d17] transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* FOLLOW */}
            <div className="space-y-4">
              <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase">FOLLOW</div>
              <ul className="space-y-2.5 font-medium text-sm sm:text-base text-[#0c0c0b]">
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#ff3d17] transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[#ff3d17] transition-colors">
                    TikTok
                  </a>
                </li>
                <li>
                  <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#ff3d17] transition-colors">
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>

            {/* STUDIO */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase">STUDIO</div>
              <address className="not-italic text-sm sm:text-base text-[#0c0c0b] space-y-1 font-medium">
                <div>Rua das Flores 27</div>
                <div>4050-265 Porto</div>
                <div className="pt-2">
                  <a
                    href="mailto:hello@bureau27.studio"
                    className="hover:text-[#ff3d17] transition-colors underline underline-offset-4 decoration-[#0c0c0b]/40 hover:decoration-[#ff3d17]"
                  >
                    Write to us
                  </a>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Monumental Brand Wordmark with 3D In-View Unfold & Scroll Parallax */}
        <div
          ref={wordmarkRef}
          style={{
            transform: isInView
              ? `translateY(${parallaxY}px) rotateX(0deg) skewY(0deg)`
              : 'translateY(180px) rotateX(-50deg) skewY(6deg)',
            opacity: isInView ? 1 : 0,
            transformOrigin: 'bottom center',
            transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, opacity',
          }}
          className="w-full overflow-hidden select-none pt-4 sm:pt-8"
        >
          <h1 className="font-anton text-[21.5vw] leading-[0.76] tracking-tighter text-[#0c0c0b] uppercase select-none text-center sm:text-left block w-full pointer-events-none">
            BUREAU27
          </h1>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono tracking-widest text-[#0c0c0b] pt-6 border-t border-[#0c0c0b]/15 gap-4">
          <div>&copy; 2027 Bureau27. All rights reserved.</div>
          <div>Cut in Porto — Worn everywhere</div>
          <button
            onClick={scrollToTop}
            className="hover:text-[#ff3d17] flex items-center gap-1.5 transition-colors uppercase font-medium cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
