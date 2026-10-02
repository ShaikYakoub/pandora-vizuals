'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function LookbookPage() {
  const chapters = [
    {
      number: 'CHAPTER 01 / 04',
      city: 'MARSEILLE — 04:00',
      title: 'THE DOCKS AT DAWN',
      subtitle: 'VOID OVERCOAT & PLEAT TROUSER 04',
      image: 'https://framerusercontent.com/images/i7GXd7j0ZuZK0DjqGwubN4b7JNI.jpg?width=2400&height=1600',
      description: 'Shot at the old port of Marseille under high-pressure sodium street lamps. Recycled wool overcoat draped without interior canvas.',
      link: '/shop/void-overcoat',
    },
    {
      number: 'CHAPTER 02 / 04',
      city: 'BERLIN — 02:30',
      title: 'KREUZBERG CONCRETE',
      subtitle: 'FOLD BAZER & STOMP BOOT',
      image: 'https://framerusercontent.com/images/0nLgNHI2I09hUmNIv3HlhqNjrE.jpg?width=1000&height=1500',
      description: 'Sharp tailoring against industrial brutalism. Asymmetrical wrap closure fastened with hidden dark horn buttons.',
      link: '/shop/fold-blazer',
    },
    {
      number: 'CHAPTER 03 / 04',
      city: 'PORTO — 06:15',
      title: 'RUA DAS FLORES',
      subtitle: 'MONO KNIT 27 & CARRY TOTE',
      image: 'https://framerusercontent.com/images/GTn9pLq00uE3ZcQhSgcA1qFPNLY.jpg?width=1000&height=1500',
      description: 'First morning sunlight piercing the steep granite alleys of Ribeira. Heavy gauge uncarded Italian merino.',
      link: '/shop/mono-knit-27',
    },
    {
      number: 'CHAPTER 04 / 04',
      city: 'SEOUL — 01:00',
      title: 'EULJIRO NEON',
      subtitle: 'RAW EDGE CARDIGAN & COLUMN SHIRT',
      image: 'https://framerusercontent.com/images/o3PRQp77gGJeh1W9vE4vP2dOmBE.jpg?width=1000&height=1497',
      description: 'Midnight light reflections in the alleyways of Euljiro metal workshops. Unfinished perimeter edges designed to break in over years.',
      link: '/shop/raw-edge-cardigan',
    },
  ];

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-12 sm:py-20 px-4 sm:px-8">
      <div className="max-w-[1720px] mx-auto space-y-20">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase pb-4 border-b border-[#ece8e1]/10 gap-2">
          <div>(Lookbook) — SS27 in four chapters</div>
          <div>SCROLL TO TURN THE PAGE</div>
        </div>

        {/* Hero Title */}
        <div className="space-y-6 pb-12 border-b border-[#ece8e1]/10">
          <h1 className="font-anton text-6xl sm:text-8xl lg:text-[10vw] leading-[0.9] tracking-tight text-[#ece8e1] uppercase">
            WORN AFTER DARK
          </h1>
          <p className="font-sans text-lg sm:text-xl text-[#8c8880] max-w-2xl leading-relaxed">
            Four cities, four nights, one light. The SS27 campaign was shot on location with a crew of five and no retouching.
          </p>
        </div>

        {/* Chapters Stack */}
        <div className="space-y-32">
          {chapters.map((ch, idx) => (
            <div key={idx} className="space-y-6 border-b border-[#ece8e1]/10 pb-20">
              {/* Chapter Meta */}
              <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] uppercase">
                <span className="text-[#ff3d17] font-bold">{ch.number}</span>
                <span>{ch.city}</span>
              </div>

              {/* Large Chapter Visual */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#171716] overflow-hidden border border-[#ece8e1]/15 group">
                <Image
                  src={ch.image}
                  alt={ch.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Chapter Description & Link */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 items-end">
                <div className="md:col-span-8 space-y-2">
                  <div className="text-xs font-mono text-[#ff3d17] tracking-wider uppercase font-bold">
                    {ch.subtitle}
                  </div>
                  <h2 className="font-anton text-3xl sm:text-5xl text-[#ece8e1] tracking-wide">
                    {ch.title}
                  </h2>
                  <p className="font-sans text-sm sm:text-base text-[#8c8880] leading-relaxed max-w-2xl">
                    {ch.description}
                  </p>
                </div>

                <div className="md:col-span-4 flex md:justify-end">
                  <Link
                    href={ch.link}
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-[#ece8e1] text-[#0c0c0b] font-bold px-6 py-3.5 hover:bg-[#ff3d17] transition-colors"
                  >
                    <span>SHOP PIECE</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
