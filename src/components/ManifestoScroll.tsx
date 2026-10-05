'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface TextItem {
  type: 'word';
  text: string;
  isAccent?: boolean;
}

interface ImageItem {
  type: 'image';
  src: string;
  alt: string;
  label?: string;
}

type ManifestoItem = TextItem | ImageItem;

const MANIFESTO_ITEMS: ManifestoItem[] = [
  { type: 'word', text: 'We' },
  { type: 'word', text: 'capture' },
  { type: 'word', text: 'stories', isAccent: true },
  {
    type: 'image',
    src: 'https://framerusercontent.com/images/GTn9pLq00uE3ZcQhSgcA1qFPNLY.jpg?width=600&height=400',
    alt: 'Visual Storytelling',
    label: 'STORY'
  },
  { type: 'word', text: 'that' },
  { type: 'word', text: 'outlive' },
  { type: 'word', text: 'the' },
  { type: 'word', text: 'moment.' },
  { type: 'word', text: 'Viral' },
  { type: 'word', text: 'reels,' },
  {
    type: 'image',
    src: 'https://framerusercontent.com/images/v6StnbgGcvM2K33ViXLn6WPioQ.jpg?width=600&height=400',
    alt: 'Viral Reels',
    label: 'REELS'
  },
  { type: 'word', text: 'candid' },
  { type: 'word', text: 'milestone' },
  { type: 'word', text: 'celebrations,', isAccent: true },
  {
    type: 'image',
    src: 'https://framerusercontent.com/images/0nLgNHI2I09hUmNIv3HlhqNjrE.jpg?width=600&height=400',
    alt: 'Milestone Celebrations',
    label: 'EVENTS'
  },
  { type: 'word', text: 'visual' },
  { type: 'word', text: 'campaigns' },
  {
    type: 'image',
    src: 'https://framerusercontent.com/images/o3PRQp77gGJeh1W9vE4vP2dOmBE.jpg?width=600&height=400',
    alt: 'Brand Campaigns',
    label: 'STUDIO'
  },
  { type: 'word', text: 'engineered' },
  { type: 'word', text: 'to' },
  { type: 'word', text: 'inspire.', isAccent: true },
];

interface ManifestoScrollProps {
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  isStandalone?: boolean;
}

export default function ManifestoScroll({
  ctaText = 'READ OUR STORY',
  ctaLink = '/shop',
  secondaryCtaText,
  secondaryCtaLink,
  isStandalone = false,
}: ManifestoScrollProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (isStandalone) {
      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        el.style.filter = 'none';
        el.style.transform = 'none';
        el.style.opacity = '1';
        const item = MANIFESTO_ITEMS[index];
        if (item.type === 'word' && item.isAccent) {
          el.style.color = '#ff3d17';
        }
      });
      return;
    }

    let animationFrameId: number;

    const calculateScroll = () => {
      const windowHeight = window.innerHeight;
      // Viewport center is where words and inline images reach 100% focus and unblur
      const viewportCenter = windowHeight * 0.50;
      // Items begin unblurring as they enter the middle zone (65% from top)
      const startThreshold = windowHeight * 0.65;

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;

        // Progress: 0 at/below startThreshold (lower screen), 1 at/above viewportCenter (center to top)
        const progress = Math.min(
          Math.max((startThreshold - itemCenter) / (startThreshold - viewportCenter), 0),
          1
        );

        const item = MANIFESTO_ITEMS[index];
        if (item.type === 'word') {
          const blurAmount = (1 - progress) * 7;
          const translateY = (1 - progress) * 0.12;
          const opacity = 0.12 + progress * 0.88;

          el.style.filter = `blur(${blurAmount.toFixed(1)}px)`;
          el.style.transform = `translateY(${translateY.toFixed(3)}em)`;
          el.style.opacity = opacity.toFixed(3);

          if (item.isAccent) {
            el.style.color = progress > 0.35 ? '#ff3d17' : '#ece8e1';
          }
        } else {
          // Inline Image Pill unblur & slight scale pop
          const blurAmount = (1 - progress) * 8;
          const translateY = (1 - progress) * 0.12;
          const scale = 0.90 + progress * 0.10;
          const opacity = 0.15 + progress * 0.85;

          el.style.filter = `blur(${blurAmount.toFixed(1)}px)`;
          el.style.transform = `translateY(${translateY.toFixed(3)}em) scale(${scale.toFixed(3)})`;
          el.style.opacity = opacity.toFixed(3);
        }
      });
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(calculateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    calculateScroll();

    // Re-check after layout settles to guarantee accurate positions
    const timeoutId = setTimeout(calculateScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${
        isStandalone
          ? 'py-8 sm:py-16'
          : 'py-24 sm:py-36 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-[#0c0c0b] overflow-hidden'
      }`}
    >
      <div className="max-w-[1720px] mx-auto space-y-16">

        {/* Scroll Text Reveal Typography - Smaller, Better, with Inline Images */}
        <div className="max-w-5xl mx-auto text-center px-2 sm:px-4">
          <h2
            ref={textRef}
            className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[62px] leading-[1.4] sm:leading-[1.32] md:leading-[1.28] tracking-tight text-[#ece8e1] text-center"
          >
            {MANIFESTO_ITEMS.map((item, index) => {
              if (item.type === 'word') {
                return (
                  <span
                    key={index}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    className={`inline-block mx-1 sm:mx-1.5 md:mx-2 whitespace-pre select-none will-change-[transform,opacity,filter] transition-[filter,opacity,transform,color] duration-300 ease-out ${
                      item.isAccent ? 'italic font-normal' : 'font-normal'
                    }`}
                    style={{
                      filter: isStandalone ? 'none' : 'blur(7px)',
                      transform: isStandalone ? 'none' : 'translateY(0.12em)',
                      opacity: isStandalone ? 1 : 0.12,
                      color: item.isAccent ? '#ff3d17' : '#ece8e1',
                    }}
                  >
                    {item.text}
                  </span>
                );
              }

              // Inline Sharp Image Frame
              return (
                <span
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="inline-flex items-center justify-center align-middle mx-1.5 sm:mx-2.5 md:mx-3 my-1 relative overflow-hidden rounded-none border border-[#ece8e1]/30 hover:border-[#ff3d17] transition-[filter,opacity,transform,border-color] duration-300 ease-out w-14 sm:w-20 md:w-24 lg:w-28 h-7 sm:h-9 md:h-11 lg:h-12 shadow-[0_6px_20px_rgba(0,0,0,0.6)] group select-none cursor-pointer will-change-[transform,opacity,filter]"
                  style={{
                    filter: isStandalone ? 'none' : 'blur(8px)',
                    transform: isStandalone ? 'none' : 'translateY(0.12em) scale(0.90)',
                    opacity: isStandalone ? 1 : 0.15,
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 60px, (max-width: 1024px) 96px, 120px"
                    className="object-cover group-hover:scale-115 transition-transform duration-500 ease-out pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  {/* Category Tag on Hover */}
                  {item.label && (
                    <span className="absolute bottom-1 left-2 font-mono text-[8px] tracking-widest text-[#ece8e1] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
                      {item.label}
                    </span>
                  )}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Action Buttons - Hero Camera Viewfinder Styled */}
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center pt-8 sm:pt-10 border-t border-[#ece8e1]/10">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={ctaLink}
              onClick={(e) => {
                if (ctaLink.startsWith('#')) {
                  e.preventDefault();
                  const target = document.querySelector(ctaLink);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="group relative inline-flex items-center gap-3.5 bg-[#0c0c0b]/85 hover:bg-[#ff3d17] text-[#ece8e1] hover:text-[#0c0c0b] border border-[#ece8e1]/30 hover:border-[#ff3d17] px-6 sm:px-8 py-3 sm:py-3.5 transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.85)] hover:shadow-[0_0_24px_rgba(255,61,23,0.6)] active:translate-y-0.5 active:scale-[0.98] select-none rounded-none backdrop-blur-md cursor-pointer"
              aria-label={ctaText}
            >
              {/* Camera Shutter Indicator Dot */}
              <span className="w-2 h-2 rounded-full bg-[#ff3d17] group-hover:bg-[#0c0c0b] shadow-[0_0_8px_#ff3d17] group-hover:shadow-none transition-colors shrink-0" />

              {/* Shutter Label in Dune Font */}
              <span className="font-dune text-xs sm:text-sm tracking-[0.18em] uppercase font-bold">
                {ctaText}
              </span>

              {/* Directional Shutter Arrow */}
              <ArrowUpRight className="w-4 h-4 text-[#ece8e1] group-hover:text-[#0c0c0b] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />

              {/* Sharp Camera Corner Viewfinder Brackets */}
              <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors" />
              <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors" />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors" />
            </Link>

            {secondaryCtaText && secondaryCtaLink && (
              <Link
                href={secondaryCtaLink}
                className="group relative inline-flex items-center gap-3.5 bg-transparent hover:bg-[#ece8e1]/10 text-[#ece8e1]/80 hover:text-white border border-[#ece8e1]/25 px-6 sm:px-8 py-3 sm:py-3.5 transition-all duration-300 select-none rounded-none backdrop-blur-md cursor-pointer"
                aria-label={secondaryCtaText}
              >
                <span className="font-dune text-xs sm:text-sm tracking-[0.18em] uppercase font-bold">
                  {secondaryCtaText}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#ece8e1]/80 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
