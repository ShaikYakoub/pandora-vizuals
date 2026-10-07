'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { EditableCard } from '@/types/card';
import { extractYouTubeId, getYouTubeThumbnail } from '@/utils/youtube';

interface ProductCardProps {
  card: EditableCard;
  index?: number;
  columns?: 2 | 3 | 4;
  onPlay?: (card: EditableCard) => void;
}

export default function ProductCard({ card, index = 0, columns = 4, onPlay }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const staggerDelay = (index % (columns || 3)) * 0.08;

  const is16by9 = card.aspectRatio === '16:9' || card.metadata?.aspectRatio === '16:9';
  const is9by16 = card.aspectRatio === '9:16' || card.metadata?.aspectRatio === '9:16';
  const aspectClass = is16by9 ? 'aspect-video' : is9by16 ? 'aspect-[9/16]' : 'aspect-[3/4]';

  const videoUrl = card.videoUrl || card.metadata?.videoUrl || '';
  const isVideo = Boolean(
    card.id.startsWith('work-video-') ||
    videoUrl ||
    card.metadata?.mediaType === 'video'
  );

  const youtubeId = extractYouTubeId(videoUrl);
  // Lite facade poster: card.image or YouTube maxresdefault thumbnail
  const posterUrl = card.image || (youtubeId ? getYouTubeThumbnail(youtubeId) : '');

  const handleClick = () => {
    if (isVideo && onPlay) {
      onPlay(card);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`group relative flex flex-col will-change-transform select-none w-full ${
        isVideo && onPlay ? 'cursor-pointer' : ''
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'rotateX(0deg) translateY(0)'
          : 'rotateX(15deg) translateY(30px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}s`,
      }}
    >
      {/* Visual Showcase Frame */}
      <div
        className={`relative w-full overflow-hidden bg-[#171716] ${aspectClass} border border-[#ece8e1]/10 group-hover:border-[#ece8e1]/35 transition-colors duration-500`}
      >
        {/* Primary Media: Video Lite Facade (YouTube / Cinema) or Direct Video or Image */}
        {isVideo ? (
          <>
            {/* Lite Facade Poster (0ms network cost, zero heavy iframe scripts) */}
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={card.title || 'Pandora Vizuals production'}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            ) : videoUrl && !youtubeId ? (
              <video
                src={videoUrl}
                poster={card.image}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-[#141413] flex items-center justify-center text-xs font-mono text-[#8c8880]">
                VIDEO
              </div>
            )}

            {/* Glowing Minimalist Cinema Play Button Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/55 border border-white/25 backdrop-blur-md flex items-center justify-center text-[#ece8e1] shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#ff3d17] group-hover:border-[#ff3d17] group-hover:text-white">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <Image
            src={card.image}
            alt={card.title || 'Pandora Vizuals production'}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        )}

        {/* Corner Viewfinder Camera Marks on Hover */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
