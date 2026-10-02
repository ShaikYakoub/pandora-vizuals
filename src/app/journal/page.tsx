'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface JournalStory {
  slug: string;
  category: string;
  readTime: string;
  title: string;
  subtitle: string;
  image: string;
  isLatest?: boolean;
}

export default function JournalPage() {
  const [hoveredStory, setHoveredStory] = useState<string | null>(null);

  const featuredStory: JournalStory = {
    slug: 'why-we-stopped-making-seasons',
    category: 'MANIFESTO',
    readTime: '5 MIN',
    title: 'WHY WE STOPPED MAKING SEASONS',
    subtitle: 'Two collections a year was never the rhythm of the people who wear us. So we quit the calendar.',
    image: 'https://framerusercontent.com/images/2RVerqm7mfgDOiAAKSIoWnGN78.jpg?width=2400&height=1591',
    isLatest: true,
  };

  const archiveStories: JournalStory[] = [
    {
      slug: 'inside-the-porto-atelier',
      category: 'STUDIO',
      readTime: '7 MIN',
      title: 'INSIDE THE PORTO ATELIER',
      subtitle: 'Pattern cutting, raw edge finishing, and the quiet precision of Rua das Flores.',
      image: 'https://framerusercontent.com/images/NSzlXc18chTtPGHfqMdIKqgd67Q.jpg?width=2400&height=1600',
    },
    {
      slug: 'a-field-guide-to-raw-edges',
      category: 'CRAFT',
      readTime: '4 MIN',
      title: 'A FIELD GUIDE TO RAW EDGES',
      subtitle: 'Why leaving seam edges unhemmed reveals the true weight of woven wool.',
      image: 'https://framerusercontent.com/images/7COqo4Z937mHWqKiKkFaK9zM.jpg?width=1200&height=1800',
    },
    {
      slug: 'ss27-shot-at-04-00-in-marseille',
      category: 'CAMPAIGN',
      readTime: '3 MIN',
      title: 'SS27 — SHOT AT 04:00 IN MARSEILLE',
      subtitle: 'Behind the lens of our night campaign across the Mediterranean coastline.',
      image: 'https://framerusercontent.com/images/WEDdkAfRPcaX7jjaHEd9G4yKAss.jpg?width=2400&height=1602',
    },
  ];

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-16 sm:space-y-24">
        
        {/* Top Meta Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3d17] animate-pulse" />
            <span>(Journal) — Notes from the atelier</span>
          </div>
          <div>UPDATED WITH EVERY DROP</div>
        </div>

        {/* Hero Banner: JOURNAL Left, Instrument Serif Subtitle Right */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-[#ece8e1]/10">
          <div>
            <h1 className="font-anton text-7xl sm:text-9xl lg:text-[168px] leading-[0.88] tracking-[-0.01em] uppercase text-[#ece8e1]">
              JOURNAL
            </h1>
          </div>
          <div className="max-w-xl lg:text-right">
            <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#ece8e1] leading-snug">
              Stories about craft, cities and the people who make every Bureau27 garment.
            </p>
          </div>
        </div>

        {/* Featured Latest Story Section */}
        <div className="border border-[#ece8e1]/15 bg-[#141413] group overflow-hidden">
          <Link
            href={`/journal/${featuredStory.slug}`}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10"
          >
            <div className="lg:col-span-7 relative aspect-[16/10] w-full bg-[#1c1c1a] overflow-hidden">
              <span className="absolute top-4 left-4 z-10 bg-[#ff3d17] text-[#0c0c0b] text-xs font-mono font-bold px-3 py-1 tracking-wider uppercase">
                LATEST STORY
              </span>
              <Image
                src={featuredStory.image}
                alt={featuredStory.title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between py-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-xs font-mono tracking-widest uppercase">
                  <span className="text-[#ff3d17] font-bold">{featuredStory.category}</span>
                  <span className="text-[#8c8880]">•</span>
                  <span className="text-[#8c8880]">{featuredStory.readTime}</span>
                </div>
                <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors leading-[0.95] uppercase">
                  {featuredStory.title}
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#8c8880] leading-relaxed">
                  {featuredStory.subtitle}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors pt-4 border-t border-[#ece8e1]/10">
                <span>READ THE STORY</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* All Stories Archive: Full-width Editorial List Rows */}
        <div className="space-y-8 pt-8">
          <div className="text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10">
            (ALL STORIES)
          </div>

          <div className="divide-y divide-[#ece8e1]/10 border-b border-[#ece8e1]/10">
            {archiveStories.map((story) => {
              const isHovered = hoveredStory === story.slug;
              return (
                <Link
                  key={story.slug}
                  href={`/journal/${story.slug}`}
                  onMouseEnter={() => setHoveredStory(story.slug)}
                  onMouseLeave={() => setHoveredStory(null)}
                  className="group relative flex flex-col lg:flex-row lg:items-center justify-between py-8 sm:py-10 transition-colors hover:bg-[#141413]/50 px-2 sm:px-4"
                >
                  {/* Category & Read Time */}
                  <div className="w-40 shrink-0 text-xs font-mono tracking-widest uppercase text-[#8c8880] group-hover:text-[#ff3d17] transition-colors mb-3 lg:mb-0">
                    <div className="font-bold">{story.category}</div>
                    <div className="text-[#6b675f]">{story.readTime}</div>
                  </div>

                  {/* Monumental Title */}
                  <div className="flex-1 pr-6">
                    <h3 className="font-anton text-3xl sm:text-5xl lg:text-6xl text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors uppercase tracking-tight">
                      {story.title}
                    </h3>
                  </div>

                  {/* Circular Vermilion Arrow Button */}
                  <div className="shrink-0 mt-4 lg:mt-0">
                    <div className="w-12 h-12 rounded-full border border-[#ece8e1]/20 flex items-center justify-center text-[#ece8e1] group-hover:bg-[#ff3d17] group-hover:text-[#0c0c0b] group-hover:border-[#ff3d17] transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Hover Floating Thumbnail Preview */}
                  {isHovered && (
                    <div className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2 w-48 h-32 pointer-events-none z-30 shadow-2xl overflow-hidden border border-[#ece8e1]/20 animate-in fade-in zoom-in-95 duration-200">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
