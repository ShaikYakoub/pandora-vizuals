'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { EditableCard } from '@/types/card';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/utils/youtube';
import { X } from 'lucide-react';

interface ProductCardProps {
  card: EditableCard;
  index?: number;
  columns?: 2 | 3 | 4;
  isPlaying?: boolean;
  onPlay?: (card: EditableCard) => void;
  onStop?: (card: EditableCard) => void;
}

export default function ProductCard({
  card,
  index = 0,
  columns = 4,
  isPlaying: controlledIsPlaying,
  onPlay,
  onStop,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [localPlaying, setLocalPlaying] = useState(false);

  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : localPlaying;

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

  const handleCardClick = () => {
    if (isVideo && !isPlaying) {
      setLocalPlaying(true);
      if (onPlay) {
        onPlay(card);
      }
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalPlaying(false);
    if (onStop) {
      onStop(card);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`group relative flex flex-col will-change-transform select-none w-full ${
        isVideo && !isPlaying ? 'cursor-pointer' : ''
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
        {/* Primary Media: Direct Inline Video Player, Video Lite Facade, or Image */}
        {isVideo ? (
          <>
            {isPlaying ? (
              <div className="absolute inset-0 z-20 w-full h-full bg-black">
                {youtubeId ? (
                  <iframe
                    src={getYouTubeEmbedUrl(youtubeId, true)}
                    title={card.title || 'Pandora Vizuals Production'}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    poster={card.image}
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <div className="w-full h-full bg-[#141413] flex items-center justify-center text-xs font-mono text-[#8c8880]">
                    NO VIDEO STREAM AVAILABLE
                  </div>
                )}

                {/* Subtle Dismiss Button to Return to Poster View */}
                <button
                  type="button"
                  onClick={handleStop}
                  aria-label="Stop playing video"
                  className="cursor-pointer absolute top-2.5 right-2.5 z-30 p-1.5 rounded-full bg-black/75 hover:bg-[#ff3d17] text-[#ece8e1] hover:text-white border border-white/20 backdrop-blur-md transition-all duration-200 shadow-xl group"
                >
                  <X className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
                </button>
              </div>
            ) : (
              <>
                {/* Lite Facade Poster (0ms initial network cost, crisp fast loading) */}
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
            )}
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

        {/* Corner Viewfinder Camera Marks on Hover (hidden while playing) */}
        {!isPlaying && (
          <>
            <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </>
        )}
      </div>
    </div>
  );
}
