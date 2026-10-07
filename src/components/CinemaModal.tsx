'use client';

import React, { useEffect, useCallback } from 'react';
import { EditableCard } from '@/types/card';
import { extractYouTubeId, getYouTubeEmbedUrl } from '@/utils/youtube';
import { X } from 'lucide-react';

interface CinemaModalProps {
  card: EditableCard | null;
  onClose: () => void;
}

export default function CinemaModal({ card, onClose }: CinemaModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!card) return;

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while cinema player is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [card, handleKeyDown]);

  if (!card) return null;

  const rawVideoUrl = card.videoUrl || card.metadata?.videoUrl || '';
  const youtubeId = extractYouTubeId(rawVideoUrl);
  const is16by9 = card.aspectRatio === '16:9' || card.metadata?.aspectRatio === '16:9';
  const is9by16 = card.aspectRatio === '9:16' || card.metadata?.aspectRatio === '9:16';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6 md:p-10 animate-fade-in"
      onClick={onClose}
    >
      {/* Top Floating Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Cinema Player"
        className="cursor-pointer absolute top-4 right-4 sm:top-6 sm:right-6 z-[130] p-2.5 rounded-full bg-white/10 hover:bg-[#ff3d17] text-[#ece8e1] hover:text-white border border-white/15 backdrop-blur-md transition-all duration-300 group shadow-2xl"
      >
        <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
      </button>

      {/* Responsive Player Showcase Frame */}
      <div
        className={`relative w-full overflow-hidden bg-black shadow-2xl border border-white/15 transition-all duration-500 ${
          is9by16
            ? 'max-w-[420px] aspect-[9/16] max-h-[88vh] rounded-2xl'
            : is16by9
            ? 'max-w-5xl aspect-video max-h-[85vh] rounded-xl'
            : 'max-w-4xl aspect-video max-h-[85vh] rounded-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {youtubeId ? (
          <iframe
            src={getYouTubeEmbedUrl(youtubeId, true)}
            title={card.title || 'Pandora Vizuals Production'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : rawVideoUrl ? (
          <video
            src={rawVideoUrl}
            poster={card.image}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#8c8880]">
            NO VIDEO STREAM AVAILABLE
          </div>
        )}
      </div>
    </div>
  );
}
