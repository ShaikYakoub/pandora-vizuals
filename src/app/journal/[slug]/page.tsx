'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCards } from '@/context/CardsContext';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface JournalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function JournalDetailPage({ params }: JournalDetailPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { cards } = useCards();

  const story = cards.find((c) => {
    const cardSlug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return cardSlug === slug || c.id === slug || c.ctaLink?.endsWith(slug);
  }) || cards.find((c) => c.section === 'home-journal');

  if (!story) {
    return notFound();
  }

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen py-12 sm:py-20 px-4 sm:px-8">
      <article className="max-w-4xl mx-auto space-y-12">
        {/* Back Link */}
        <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#8c8880] pb-4 border-b border-[#ece8e1]/10">
          <Link
            href="/journal"
            className="flex items-center gap-1.5 hover:text-[#ff3d17] transition-colors uppercase font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO JOURNAL</span>
          </Link>
          <div className="uppercase">
            {story.badge || 'ATELIER ESSAY'} — {story.metadata?.readTime || '5 MIN READ'}
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="text-xs font-mono text-[#ff3d17] uppercase tracking-widest font-bold">
            {story.metadata?.date || 'SEPTEMBER 2026'} — BY {story.metadata?.author || 'BUREAU27 ATELIER'}
          </div>
          <h1 className="font-anton text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#ece8e1] uppercase leading-[0.95]">
            {story.title}
          </h1>
          <p className="font-sans text-lg sm:text-xl text-[#dcd6cc] leading-relaxed">
            {story.description}
          </p>
        </header>

        {/* Hero Article Image */}
        <div className="relative aspect-[16/10] w-full bg-[#171716] overflow-hidden border border-[#ece8e1]/15">
          <Image
            src={story.image}
            alt={story.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        {/* Pull Quote */}
        <div className="py-6 border-y border-[#ece8e1]/15 my-8">
          <blockquote className="font-serif-italic text-2xl sm:text-3xl text-[#ece8e1] text-center leading-relaxed">
            &ldquo;When a piece has no expiration date, the urgency shifts from selling fast to making it indestructible.&rdquo;
          </blockquote>
        </div>

        {/* Article Body Content */}
        <div className="space-y-6 font-sans text-base sm:text-lg text-[#8c8880] leading-relaxed">
          <p>
            The seasonal calendar was invented in the nineteenth century for Parisian department stores to ensure high inventory turnover. It created an artificial cycle: Spring/Summer, Autumn/Winter, Pre-Fall, Cruise, and resort. Each cycle demands novelty, and novelty in high volume always demands compromise in material, stitching, and labor.
          </p>
          <p>
            At Bureau27, we dismantled that apparatus completely. Every pattern is drawn by hand on kraft paper in our Porto studio on Rua das Flores. When a silhouette works — like our Void Overcoat or the Fold Blazer — it remains in our catalog permanently. We do not mark it down at the end of August. We do not replace it with an inferior revision next spring.
          </p>
          <p>
            Instead, we cut when cloth is sourced, sew twenty-seven pieces, and ship directly to individuals across Tokyo, Paris, Berlin, and Marseille. When the roll of fabric is exhausted, that run is archived. The garments continue their life on the street, gaining patina, breaking in, and outliving every flash trend.
          </p>
        </div>

        {/* Article Bottom Actions */}
        <div className="pt-12 border-t border-[#ece8e1]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            href="/shop"
            className="bureau-btn bureau-btn-primary"
          >
            <span>EXPLORE SS27 PIECES</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/journal"
            className="font-mono text-xs text-[#8c8880] hover:text-[#ff3d17] transition-colors uppercase tracking-widest"
          >
            READ MORE ATELIER NOTES ↗
          </Link>
        </div>
      </article>
    </div>
  );
}
