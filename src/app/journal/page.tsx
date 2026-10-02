'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCards } from '@/context/CardsContext';
import { ArrowUpRight } from 'lucide-react';

export default function JournalPage() {
  const { sectionCards: stories } = useCards('home-journal');

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-12 sm:py-20 px-4 sm:px-8">
      <div className="max-w-[1720px] mx-auto space-y-16">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
          <div>(Journal) — Notes from the atelier</div>
          <div>UPDATED WITH EVERY DROP</div>
        </div>

        {/* Page Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#ece8e1]/10 items-end">
          <div className="lg:col-span-7">
            <h1 className="font-anton text-6xl sm:text-8xl lg:text-[10vw] leading-[0.9] tracking-tight text-[#ece8e1] uppercase">
              JOURNAL
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="font-serif-italic text-2xl sm:text-3xl lg:text-4xl text-[#ece8e1] leading-relaxed">
              Stories about craft, cities and the people who make every Bureau27 garment.
            </p>
          </div>
        </div>

        {/* Featured Story Banner (First card) */}
        {stories.length > 0 && (
          <div className="border border-[#ece8e1]/15 bg-[#141413] group overflow-hidden">
            <Link
              href={stories[0].ctaLink || `/journal/${stories[0].title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10"
            >
              <div className="lg:col-span-7 relative aspect-[16/10] w-full bg-[#1c1c1a] overflow-hidden">
                <span className="absolute top-4 left-4 z-10 bg-[#ff3d17] text-[#0c0c0b] text-xs font-mono font-bold px-3 py-1 tracking-wider uppercase">
                  LATEST STORY
                </span>
                <Image
                  src={stories[0].image}
                  alt={stories[0].title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between py-2 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs font-mono text-[#8c8880]">
                    <span className="text-[#ff3d17] font-bold tracking-widest uppercase">
                      {stories[0].badge || 'MANIFESTO'}
                    </span>
                    <span>•</span>
                    <span>{stories[0].metadata?.readTime || '5 MIN READ'}</span>
                  </div>
                  <h2 className="font-anton text-3xl sm:text-5xl tracking-wide text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors leading-tight">
                    {stories[0].title}
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-[#8c8880] leading-relaxed">
                    {stories[0].description}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors pt-4 border-t border-[#ece8e1]/10">
                  <span>READ STORY</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {stories.slice(1).map((story) => (
            <Link
              key={story.id}
              href={story.ctaLink || `/journal/${story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="group flex flex-col space-y-4 border border-[#ece8e1]/10 bg-[#141413] p-6 hover:border-[#ff3d17] transition-all"
            >
              <div className="relative aspect-[16/10] w-full bg-[#1c1c1a] overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#8c8880] pt-2">
                <span className="text-[#ff3d17] font-bold tracking-wider uppercase">
                  {story.badge || 'ATELIER'}
                </span>
                <span>{story.metadata?.readTime || '5 MIN'}</span>
              </div>

              <h3 className="font-anton text-2xl sm:text-3xl tracking-wide text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors leading-tight">
                {story.title}
              </h3>

              {story.description && (
                <p className="text-xs font-sans text-[#8c8880] line-clamp-3 leading-relaxed flex-1">
                  {story.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#ece8e1]/10 text-xs font-mono text-[#dcd6cc] group-hover:text-[#ff3d17] transition-colors">
                <span>{story.ctaText || 'READ STORY'}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
