import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import FramerHeading from '@/components/FramerHeading';
import FramerReveal from '@/components/FramerReveal';

export function generateStaticParams() {
  return [
    { slug: 'crafting-viral-reels-for-modern-brands' },
    { slug: 'the-art-of-capturing-child-birthdays' },
    { slug: 'lighting-adult-milestone-galas' },
    { slug: 'how-visual-content-drives-digital-marketing' },
  ];
}

interface JournalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalDetailPage({ params }: JournalDetailPageProps) {
  const { slug } = await params;

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
    'crafting-viral-reels-for-modern-brands': {
      category: 'REELS & MOTION',
      readTime: '5 MIN',
      title: 'CRAFTING VIRAL REELS FOR MODERN BRANDS',
      subtitle: 'Rhythm, sound design, and the psychology of the three-second hook. How we engineer short-form video that commands attention.',
      image: 'https://framerusercontent.com/images/2RVerqm7mfgDOiAAKSIoWnGN78.jpg?width=2400&height=1591',
      sections: [
        {
          heading: 'THE FIRST THREE SECONDS DECIDE EVERYTHING',
          paragraphs: [
            'Short-form vertical video is not simply horizontal cinema cropped to 9:16. It is a completely distinct visual language governed by pacing, kinetic movement, and immediate sensory gratification.',
            'When creating reels for brands or personal milestones, we treat the opening 0.8 seconds as prime real estate. We combine abrupt camera movement, high-contrast framing, and an immediate audio cue that pulls the viewer through the screen before their thumb can swipe away.',
          ],
        },
        {
          headingSerif: 'Sound design as an emotional amplifier',
          paragraphs: [
            'Visuals catch the eye, but sound grips the subconscious. Every viral reel we produce features layered foley: the crisp snap of a camera shutter, deep sub-bass risers, textural whooshes, and meticulously synced beat drops.',
            'By grading in 4K ProRes on Sony FX cinema bodies and pairing color with tempo, our short-form productions deliver cinematic fidelity to handheld devices. The result is content that achieves millions of organic impressions without feeling like an advertisement.',
          ],
        },
      ],
    },
    'the-art-of-capturing-child-birthdays': {
      category: 'KIDS & MILESTONES',
      readTime: '6 MIN',
      title: 'THE ART OF CAPTURING CHILD BIRTHDAYS',
      subtitle: 'From first birthday cake smashes to genuine giggles: why authentic childhood moments require patience over posing.',
      image: 'https://framerusercontent.com/images/NSzlXc18chTtPGHfqMdIKqgd67Q.jpg?width=2400&height=1600',
      sections: [
        {
          heading: 'PATIENCE OVER POSING',
          paragraphs: [
            'Children do not perform on cue, and attempting to force a toddler into a rigid studio pose is a guarantee of tears. Our approach is entirely observational.',
            'We spend the first twenty minutes without touching the camera—letting the child explore the environment, feel comfortable with our presence, and become absorbed in play.',
          ],
        },
        {
          headingSerif: 'The cake smash & uninhibited joy',
          paragraphs: [
            'First birthdays are a once-in-a-lifetime milestone. When the cake is placed down, we switch to high-speed continuous autofocus on 35mm and 50mm f/1.2 cinema glass.',
            'Every smeared frosting hand, wide-eyed surprise, and belly laugh is frozen with razor-sharp precision and warm, filmic skin tones. Parents receive not just photos, but a documentary record of innocent wonder.',
          ],
        },
      ],
    },
    'lighting-adult-milestone-galas': {
      category: 'ADULT CELEBRATIONS',
      readTime: '4 MIN',
      title: 'LIGHTING ADULT MILESTONE GALAS',
      subtitle: 'Documenting 21st, 30th, and 50th celebrations in low ambient light with cinema glass and zero intrusive flashes.',
      image: 'https://framerusercontent.com/images/7COqo4Z937mHWqKiKkFaK9zM.jpg?width=1200&height=1800',
      sections: [
        {
          heading: 'RESPECTING THE AMBIENCE',
          paragraphs: [
            'A private 30th or 50th birthday dinner has an intimate mood carefully curated by candlelight, architectural fixtures, and warm shadows. Blasting on-camera speedlights instantly flattens the atmosphere and makes guests self-conscious.',
            'We utilize dual-native ISO cinema sensors capable of capturing clean, rich imagery under 0.5 foot-candles of light. The champagne toasts, subtle glances, and roaring laughter are recorded exactly as they felt in the room.',
          ],
        },
        {
          headingSerif: 'From champagne speeches to the afterparty',
          paragraphs: [
            'Milestone celebrations transition through distinct emotional acts: the arrival and reunions, the speeches that bring tears, and the midnight dancefloor energy.',
            'We shoot with handheld gimbals and lightweight prime lenses, moving seamlessly among guests without ever breaking the flow of the celebration.',
          ],
        },
      ],
    },
    'how-visual-content-drives-digital-marketing': {
      category: 'DIGITAL MARKETING',
      readTime: '5 MIN',
      title: 'HOW VISUAL CONTENT DRIVES DIGITAL MARKETING',
      subtitle: 'Bridging the gap between cinematic art and high-ROI ad performance across Meta, TikTok, and brand campaigns.',
      image: 'https://framerusercontent.com/images/WEDdkAfRPcaX7jjaHEd9G4yKAss.jpg?width=2400&height=1602',
      sections: [
        {
          heading: 'AESTHETICS AS A CONVERSION ENGINE',
          paragraphs: [
            'Many digital marketing agencies understand numbers but lack visual taste. Conversely, traditional video houses produce pretty footage that converts zero customers.',
            'Pandora Visuals operates at the intersection. We build creative asset libraries designed specifically for paid performance funnels: rapid hooks, UGC-style authenticity paired with cinema color grading, and clear behavioral calls-to-action.',
          ],
        },
        {
          headingSerif: 'Testing creative velocity',
          paragraphs: [
            'In digital advertising, ad fatigue occurs within weeks. By batching production across full shoot days, we generate dozens of cut-downs, aspect ratio variants, and hook variations.',
            'Our clients see lower customer acquisition costs and higher brand prestige because their campaigns look like high-budget editorial films while functioning as performance marketing engines.',
          ],
        },
      ],
    },
  };

  const article = allArticles[slug] || allArticles['crafting-viral-reels-for-modern-brands'];

  // Other stories for KEEP READING
  const keepReading = Object.entries(allArticles)
    .filter(([key]) => key !== (allArticles[slug] ? slug : 'crafting-viral-reels-for-modern-brands'))
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
          <FramerHeading
            text={article.title}
            as="h1"
            variant="journal"
            className="font-anton text-6xl sm:text-8xl lg:text-[130px] leading-[0.88] tracking-[-0.02em] uppercase text-[#ece8e1]"
          />

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
