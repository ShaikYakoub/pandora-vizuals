'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCards } from '@/context/CardsContext';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import TextScramble from './TextScramble';

export default function JournalTeaser() {
  const { sectionCards: journalStories } = useCards('home-journal');

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 border-b border-[#ece8e1]/10 bg-[#0c0c0b] text-[#ece8e1]">
      <div className="max-w-[1720px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#ece8e1]/15 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono tracking-widest text-[#8c8880] uppercase">
              <span className="text-[#ff3d17] font-bold">(05)</span>
              <TextScramble text="— JOURNAL" />
            </div>
            <h2 className="font-anton text-5xl sm:text-7xl lg:text-[88px] text-[#ece8e1] tracking-tight uppercase leading-[0.95]">
              NOTES FROM <span className="text-[#ff3d17]">THE ATELIER</span>
            </h2>
          </div>

          <Link
            href="/journal"
            className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-[#ece8e1] border border-[#ece8e1]/20 px-6 py-3.5 hover:border-[#ff3d17] hover:text-[#ff3d17] transition-all bg-transparent group shrink-0"
          >
            <span>ALL STORIES</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Full-Width Editorial List Rows */}
        <div className="border-t border-[#ece8e1]/15 divide-y divide-[#ece8e1]/15">
          {journalStories.map((story) => {
            const storySlug =
              story.ctaLink ||
              `/journal/${story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

            return (
              <Link
                key={story.id}
                href={storySlug}
                className="group flex flex-col md:flex-row md:items-center justify-between py-8 sm:py-10 lg:py-12 px-2 sm:px-4 gap-6 transition-colors duration-300 relative cursor-pointer"
              >
                {/* Column 1: Metadata (Category & Read Time) */}
                <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col justify-between md:justify-center gap-1 font-mono text-xs uppercase tracking-widest">
                  <span className="text-[#ece8e1] font-semibold">
                    {story.badge || 'MANIFESTO'}
                  </span>
                  <span className="text-[#8c8880]">
                    {story.metadata?.readTime || '5 MIN'}
                  </span>
                </div>

                {/* Column 2: Anton Headline */}
                <h3 className="font-anton text-3xl sm:text-5xl lg:text-[54px] text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors duration-300 uppercase tracking-tight leading-[1.05] flex-1">
                  {story.title}
                </h3>

                {/* Column 3: Thumbnail Preview + Circular Arrow Button */}
                <div className="flex items-center gap-6 sm:gap-8 self-end md:self-center shrink-0">
                  {/* Pop-in Thumbnail Image */}
                  <div className="relative w-44 sm:w-56 lg:w-60 aspect-[16/10] overflow-hidden bg-[#171716] hidden md:block pointer-events-none opacity-0 scale-75 -rotate-6 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 transition-all duration-400 ease-out shadow-2xl">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>

                  {/* Circular Arrow Button (turns solid orange with right arrow on hover) */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#ece8e1]/25 flex items-center justify-center text-[#ece8e1] group-hover:bg-[#ff3d17] group-hover:border-[#ff3d17] group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
