'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface JournalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function JournalDetailPage({ params }: JournalDetailPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const allArticles: Record<
    string,
    {
      category: string;
      readTime: string;
      title: string;
      subtitle: string;
      image: string;
      sections: {
        heading?: string;
        headingSerif?: string;
        paragraphs: string[];
      }[];
    }
  > = {
    'why-we-stopped-making-seasons': {
      category: 'MANIFESTO',
      readTime: '5 MIN',
      title: 'WHY WE STOPPED MAKING SEASONS',
      subtitle: 'Two collections a year was never the rhythm of the people who wear us. So we quit the calendar.',
      image: 'https://framerusercontent.com/images/2RVerqm7mfgDOiAAKSIoWnGN78.jpg?width=2400&height=1591',
      sections: [
        {
          heading: 'THE CALENDAR WAS NEVER OURS',
          paragraphs: [
            'Fashion runs on a clock that has nothing to do with weather, bodies or taste. Spring arrives in November. Coats are sold in July. For years we followed it anyway, because everyone did.',
            'In 2024 we missed a delivery window and nothing happened. Nobody complained. The pieces sold when they arrived, and they kept selling. That was the moment we stopped pretending.',
          ],
        },
        {
          headingSerif: 'What changes',
          paragraphs: [
            'We release when a garment is ready — not when a trade show says so. Some drops are three pieces. Some are thirty. Every piece stays online until it is gone.',
            'Every pattern is drawn by hand on kraft paper in our Porto studio on Rua das Flores. When a silhouette works — like our Void Overcoat or the Fold Blazer — it remains in our catalog permanently. We do not mark it down at the end of August. We do not replace it with an inferior revision next spring.',
            'Instead, we cut when cloth is sourced, sew twenty-seven pieces, and ship directly to individuals across Tokyo, Paris, Berlin, and Marseille. When the roll of fabric is exhausted, that run is archived. The garments continue their life on the street, gaining patina, breaking in, and outliving every flash trend.',
          ],
        },
      ],
    },
    'inside-the-porto-atelier': {
      category: 'STUDIO',
      readTime: '7 MIN',
      title: 'INSIDE THE PORTO ATELIER',
      subtitle: 'Pattern cutting, raw edge finishing, and the quiet precision of Rua das Flores.',
      image: 'https://framerusercontent.com/images/NSzlXc18chTtPGHfqMdIKqgd67Q.jpg?width=2400&height=1600',
      sections: [
        {
          heading: 'THE WEIGHT OF GRANITE',
          paragraphs: [
            'Our studio occupies an old cork warehouse two blocks from the Douro river. The light comes from the north through three-meter industrial casements.',
            'Here we cut heavy wools on seven-meter oak tables that have been oiled weekly since 1948. There are no automated laser cutters; every curve is traced with chalk and cut with heavy shears.',
          ],
        },
      ],
    },
    'a-field-guide-to-raw-edges': {
      category: 'CRAFT',
      readTime: '4 MIN',
      title: 'A FIELD GUIDE TO RAW EDGES',
      subtitle: 'Why leaving seam edges unhemmed reveals the true weight of woven wool.',
      image: 'https://framerusercontent.com/images/7COqo4Z937mHWqKiKkFaK9zM.jpg?width=1200&height=1800',
      sections: [
        {
          heading: 'HONESTY IN WEFT AND WARP',
          paragraphs: [
            'A conventional hem conceals the structure of the cloth. It folds the wool back onto itself, doubling the bulk and creating artificial stiffness.',
            'Leaving a perimeter raw allows the textile to move organically against the body. After twelve months of wear, the edge softens, rolls slightly, and records the wearer’s habits.',
          ],
        },
      ],
    },
    'ss27-shot-at-04-00-in-marseille': {
      category: 'CAMPAIGN',
      readTime: '3 MIN',
      title: 'SS27 — SHOT AT 04:00 IN MARSEILLE',
      subtitle: 'Behind the lens of our night campaign across the Mediterranean coastline.',
      image: 'https://framerusercontent.com/images/WEDdkAfRPcaX7jjaHEd9G4yKAss.jpg?width=2400&height=1602',
      sections: [
        {
          heading: 'ONE LIGHT, FOUR NINETEENTH-CENTURY DOCKS',
          paragraphs: [
            'We worked without a lighting truck. One battery-powered tungsten lamp and the existing sodium vapor streetlights of the port.',
            'The models were not asked to pose; they walked the length of the breakwater as the mist rolled off the Mediterranean.',
          ],
        },
      ],
    },
  };

  const article = allArticles[slug] || allArticles['why-we-stopped-making-seasons'];

  // Other stories for KEEP READING
  const keepReading = Object.entries(allArticles)
    .filter(([key]) => key !== slug)
    .map(([key, data]) => ({ slug: key, ...data }));

  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-8">
      <div className="max-w-[1580px] mx-auto space-y-16 sm:space-y-24">
        
        {/* Back Link & Meta Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#ece8e1]/10">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#ece8e1] hover:text-[#ff3d17] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#ff3d17]" />
              <span>BACK TO JOURNAL</span>
            </Link>
            <div className="font-mono text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="text-[#ff3d17] font-bold">{article.category}</span>
              <span className="text-[#8c8880]">•</span>
              <span className="text-[#8c8880]">{article.readTime}</span>
            </div>
          </div>

          {/* Monumental Anton Title */}
          <h1 className="font-anton text-6xl sm:text-8xl lg:text-[130px] leading-[0.88] tracking-[-0.02em] uppercase text-[#ece8e1]">
            {article.title}
          </h1>

          {/* Subtitle in Instrument Serif Italic */}
          <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#ece8e1] max-w-4xl leading-relaxed">
            {article.subtitle}
          </p>
        </div>

        {/* Full Bleed Hero Cover Photo */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#171716] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Article Text Content */}
        <article className="max-w-3xl mx-auto space-y-12 sm:space-y-16 py-8">
          {article.sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              {section.heading && (
                <h2 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-[#ece8e1] pt-4">
                  {section.heading}
                </h2>
              )}
              {section.headingSerif && (
                <h3 className="font-serif italic text-3xl sm:text-4xl text-[#ff3d17] pt-4">
                  {section.headingSerif}
                </h3>
              )}
              <div className="space-y-6 text-base sm:text-lg font-sans text-[#8c8880] leading-relaxed">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </article>

        {/* KEEP READING Section */}
        <div className="pt-16 border-t border-[#ece8e1]/10 space-y-12">
          <h2 className="font-anton text-6xl sm:text-8xl tracking-tight uppercase text-[#ece8e1]">
            KEEP READING
          </h2>

          <div className="divide-y divide-[#ece8e1]/10 border-b border-[#ece8e1]/10">
            {keepReading.map((story) => (
              <Link
                key={story.slug}
                href={`/journal/${story.slug}`}
                className="group flex flex-col lg:flex-row lg:items-center justify-between py-8 transition-colors hover:bg-[#141413]/50 px-2 sm:px-4"
              >
                <div className="w-40 shrink-0 text-xs font-mono tracking-widest uppercase text-[#8c8880] group-hover:text-[#ff3d17] transition-colors mb-2 lg:mb-0">
                  <div className="font-bold">{story.category}</div>
                  <div className="text-[#6b675f]">{story.readTime}</div>
                </div>

                <div className="flex-1 pr-6">
                  <h3 className="font-anton text-2xl sm:text-4xl lg:text-5xl text-[#ece8e1] group-hover:text-[#ff3d17] transition-colors uppercase tracking-tight">
                    {story.title}
                  </h3>
                </div>

                <div className="shrink-0 mt-4 lg:mt-0">
                  <div className="w-12 h-12 rounded-full border border-[#ece8e1]/20 flex items-center justify-center text-[#ece8e1] group-hover:bg-[#ff3d17] group-hover:text-[#0c0c0b] group-hover:border-[#ff3d17] transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
