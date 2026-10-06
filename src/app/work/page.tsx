'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useCards } from '@/context/CardsContext';
import { EditableCard } from '@/types/card';
import ProductCard from '@/components/ProductCard';
import StudioHeading from '@/components/StudioHeading';
import StudioReveal from '@/components/StudioReveal';

type MediaTypeFilter = 'photos' | 'videos';

export default function WorkPage() {
  const { cards, sectionCards: workCards } = useCards('work');
  const [mediaType, setMediaType] = useState<MediaTypeFilter>('photos');

  // Support both 'work' and existing 'shop' card sections for seamless continuity
  const availableCards = useMemo(() => {
    return workCards.length > 0
      ? workCards
      : cards.filter((c) => c.section === 'work' || c.section === 'shop');
  }, [workCards, cards]);

  // Strictly distinguish videos from photos
  const isVideoCard = useCallback((card: EditableCard): boolean => {
    return Boolean(
      card.id.startsWith('work-video-') ||
      card.videoUrl ||
      card.metadata?.videoUrl ||
      card.metadata?.mediaType === 'video'
    );
  }, []);

  // Filtered card lists
  const photosCards = useMemo(() => {
    return availableCards.filter((card) => !isVideoCard(card));
  }, [availableCards, isVideoCard]);

  const videosCards = useMemo(() => {
    return availableCards.filter((card) => isVideoCard(card));
  }, [availableCards, isVideoCard]);

  // Symmetrical sub-groupings for video layout
  const widescreenVideos = useMemo(() => {
    return videosCards.filter((c) => c.aspectRatio === '16:9' || c.metadata?.aspectRatio === '16:9');
  }, [videosCards]);

  const verticalVideos = useMemo(() => {
    return videosCards.filter((c) => c.aspectRatio === '9:16' || c.metadata?.aspectRatio === '9:16');
  }, [videosCards]);

  const filteredCards = useMemo(() => {
    return mediaType === 'photos' ? photosCards : videosCards;
  }, [mediaType, photosCards, videosCards]);



  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-screen pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 sm:px-8 selection:bg-[#ff3d17] selection:text-[#0c0c0b]">
      <div className="max-w-[1580px] mx-auto space-y-10 sm:space-y-14">

        {/* Hero Title */}
        <div className="text-center pb-6 sm:pb-10 border-b border-[#ece8e1]/10">
          <StudioHeading
            text="Our work"
            as="h1"
            className="font-anton text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.92] tracking-tight uppercase text-[#ece8e1]"
          />
        </div>

        {/* Photos vs Videos Segmented Toggler */}
        <div className="flex items-center justify-center pt-2">
          <div className="relative inline-flex items-center p-1.5 rounded-full bg-[#141413] border border-[#ece8e1]/15 shadow-2xl backdrop-blur-md select-none w-[320px] sm:w-[380px]">
            {/* Smooth Sliding Pill Indicator */}
            <div
              className="absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-[#ece8e1] shadow-lg shadow-white/10 transition-transform duration-300 ease-out will-change-transform"
              style={{
                width: 'calc(50% - 6px)',
                transform: mediaType === 'photos' ? 'translateX(0)' : 'translateX(calc(100% + 6px))',
              }}
            />

            <button
              type="button"
              onClick={() => setMediaType('photos')}
              className={`relative z-10 flex-1 cursor-pointer py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-sans font-bold tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2 ${
                mediaType === 'photos'
                  ? 'text-[#0c0c0b]'
                  : 'text-[#8c8880] hover:text-[#ece8e1]'
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>PHOTOS</span>
              <span
                className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-mono transition-colors duration-300 ${
                  mediaType === 'photos' ? 'bg-[#0c0c0b]/15 text-[#0c0c0b]' : 'bg-white/5 text-[#8c8880]'
                }`}
              >
                {photosCards.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMediaType('videos')}
              className={`relative z-10 flex-1 cursor-pointer py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-sans font-bold tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2 ${
                mediaType === 'videos'
                  ? 'text-[#0c0c0b]'
                  : 'text-[#8c8880] hover:text-[#ece8e1]'
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <span>VIDEOS</span>
              <span
                className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-mono transition-colors duration-300 ${
                  mediaType === 'videos' ? 'bg-[#0c0c0b]/15 text-[#0c0c0b]' : 'bg-white/5 text-[#8c8880]'
                }`}
              >
                {videosCards.length}
              </span>
            </button>
          </div>
        </div>

        {/* Productions Grid with Smooth Crossfade */}
        <div key={mediaType} className="animate-fade-in">
          {filteredCards.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <div className="font-anton text-3xl text-[#8c8880]">
                NO {mediaType.toUpperCase()} AVAILABLE
              </div>
              <p className="font-sans text-xs text-[#6b675f]">
                Switch to {mediaType === 'photos' ? 'Videos' : 'Photos'} to view our portfolio.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setMediaType(mediaType === 'photos' ? 'videos' : 'photos')}
                  className="px-5 py-2.5 rounded-full text-xs uppercase font-sans font-semibold bg-[#ece8e1] text-[#0c0c0b]"
                >
                  VIEW {mediaType === 'photos' ? 'VIDEOS' : 'PHOTOS'}
                </button>
              </div>
            </div>
          ) : mediaType === 'videos' ? (
            /* Perfectly Symmetric Video Showcase: 16:9 Cinema Pairs & 9:16 Vertical Reel Quads */
            <div className="space-y-6 sm:space-y-10">
              {/* Row 1: Two 16:9 Widescreen Cinema Productions (50% / 50% split) */}
              {widescreenVideos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
                  {widescreenVideos.slice(0, 2).map((card, idx) => (
                    <ProductCard key={card.id} card={card} index={idx} columns={2} />
                  ))}
                </div>
              )}

              {/* Row 2: Four 9:16 Vertical Mobile Reels (25% each across) */}
              {verticalVideos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                  {verticalVideos.slice(0, 4).map((card, idx) => (
                    <ProductCard key={card.id} card={card} index={idx} columns={4} />
                  ))}
                </div>
              )}

              {/* Row 3: Two 16:9 Widescreen Cinema Productions (50% / 50% split) */}
              {widescreenVideos.length > 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
                  {widescreenVideos.slice(2, 4).map((card, idx) => (
                    <ProductCard key={card.id} card={card} index={idx} columns={2} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Photos: Clean Uniform Responsive Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 items-start">
              {filteredCards.map((card, idx) => (
                <ProductCard
                  key={card.id}
                  card={card}
                  index={idx}
                  columns={4}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
