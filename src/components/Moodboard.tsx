'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCards } from '@/context/CardsContext';
import { EditableCard } from '@/types/card';
import {
  Heart,
  MessageCircle,
  MessageSquare,
  Send,
  Bookmark,
  MoreHorizontal,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Camera,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Music,
  Search,
} from 'lucide-react';

export type PosterFormat = 'instagram' | 'snapchat' | 'whatsapp' | 'youtube' | 'facebook' | 'polaroid';

const FORMATS: PosterFormat[] = ['instagram', 'facebook', 'youtube', 'snapchat', 'whatsapp'];

const getPosterFormat = (card: EditableCard, index: number): PosterFormat => {
  if (card.metadata?.format && FORMATS.includes(card.metadata.format as PosterFormat)) {
    return card.metadata.format as PosterFormat;
  }
  const idLower = (card.id || '').toLowerCase();
  const titleLower = (card.title || '').toLowerCase();

  if (titleLower.includes('insta') || titleLower.includes('shutter') || titleLower.includes('birthday') || titleLower.includes('applause') || idLower === 'mood-01') return 'instagram';
  if (titleLower.includes('facebook') || titleLower.includes('fb') || titleLower.includes('scout') || titleLower.includes('sweet') || titleLower.includes('cravings') || titleLower.includes('ice cream') || idLower === 'mood-06') return 'facebook';
  if (titleLower.includes('youtube') || titleLower.includes('shorts') || titleLower.includes('lighting') || titleLower.includes('streetwear') || titleLower.includes('botanical') || titleLower.includes('drip') || idLower === 'mood-04') return 'youtube';
  if (titleLower.includes('snap') || titleLower.includes('color') || titleLower.includes('mango') || titleLower.includes('smoothie') || titleLower.includes('shake') || idLower === 'mood-05') return 'snapchat';
  if (titleLower.includes('whatsapp') || titleLower.includes('status') || titleLower.includes('neon') || titleLower.includes('bridge') || titleLower.includes('garden') || idLower === 'mood-02') return 'whatsapp';

  return FORMATS[index % FORMATS.length];
};

interface SlotConfig {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  isCenter?: boolean;
  rot: number;
  width: number;
  aspect: string;
  mobileTop?: string;
  mobileBottom?: string;
  mobileLeft?: string;
  mobileRight?: string;
  mobileWidth: number;
}

const DEFAULT_SLOTS: SlotConfig[] = [
  {
    // Slot 0: Top-Left -> Instagram Post (4:5)
    top: '80px',
    left: '3.5%',
    rot: -6,
    width: 270,
    aspect: '4/5',
    mobileTop: '65px',
    mobileLeft: '2.5%',
    mobileWidth: 150,
  },
  {
    // Slot 1: Top-Right -> Facebook Post (4:5)
    top: '80px',
    right: '3.5%',
    rot: 5,
    width: 275,
    aspect: '4/5',
    mobileTop: '65px',
    mobileRight: '2.5%',
    mobileWidth: 155,
  },
  {
    // Slot 2: Bottom-Left -> YouTube Shorts (9:16)
    bottom: '50px',
    left: '3.5%',
    rot: -4,
    width: 225,
    aspect: '9/16',
    mobileBottom: '90px',
    mobileLeft: '2.5%',
    mobileWidth: 135,
  },
  {
    // Slot 3: Bottom-Middle (Center) -> Snapchat Snap (9:16)
    bottom: '35px',
    isCenter: true,
    rot: 1,
    width: 215,
    aspect: '9/16',
    mobileBottom: '20px',
    mobileWidth: 140,
  },
  {
    // Slot 4: Bottom-Right -> WhatsApp Status (9:16)
    bottom: '50px',
    right: '3.5%',
    rot: 4,
    width: 215,
    aspect: '9/16',
    mobileBottom: '90px',
    mobileRight: '2.5%',
    mobileWidth: 135,
  },
];

export default function Moodboard() {
  const { sectionCards: allMoodCards } = useCards('home-moodboard');
  const sectionCards = allMoodCards.filter((card) => {
    const idLower = (card.id || '').toLowerCase();
    const titleLower = (card.title || '').toLowerCase();
    if (idLower === 'mood-03' || titleLower.includes('twitter') || titleLower.includes('pacing')) {
      return false;
    }
    return true;
  });
  const containerRef = useRef<HTMLElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [zIndexMap, setZIndexMap] = useState<Record<string, number>>({});
  const [highestZ, setHighestZ] = useState(25);
  const [isMobile, setIsMobile] = useState(false);

  // High-performance drag references to eliminate React state latency during pointer movement
  const isDraggingRef = useRef(false);
  const activeIdRef = useRef<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Detect mobile screen for slot sizing
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Hardware-accelerated parallax float via CSS variable (0 React re-renders on scroll)
  useEffect(() => {
    let animationFrameId = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        animationFrameId = requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight && rect.bottom > 0) {
              const centerOffset = (windowHeight / 2 - (rect.top + rect.height / 2)) * 0.05;
              containerRef.current.style.setProperty('--parallax-offset', `${centerOffset.toFixed(1)}px`);
            }
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Pointer down trigger
  const handlePointerDown = (id: string, clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    activeIdRef.current = id;
    dragStartRef.current = { x: clientX, y: clientY };
    setDraggingId(id);
    setHighestZ((prev) => {
      const nextZ = prev + 1;
      setZIndexMap((zm) => ({ ...zm, [id]: nextZ }));
      return nextZ;
    });
  };

  // Global window listeners for drag move and pointer release
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current || !activeIdRef.current) return;
      const id = activeIdRef.current;
      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

      dragStartRef.current = { x: clientX, y: clientY };

      setPositions((prev) => {
        const curr = prev[id] || { x: 0, y: 0 };
        return {
          ...prev,
          [id]: { x: curr.x + deltaX, y: curr.y + deltaY },
        };
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        activeIdRef.current = null;
        setDraggingId(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
    };
  }, []);

  // Match each card to its visual slot
  const getSlotForCard = (card: EditableCard, index: number): SlotConfig => {
    const t = (card.title || '').toLowerCase();
    const id = (card.id || '').toLowerCase();

    // Slot 0: Top-Left (Instagram)
    if (id === 'mood-01' || t.includes('shutter') || t.includes('insta') || t.includes('birthday') || t.includes('applause')) return DEFAULT_SLOTS[0];
    // Slot 1: Top-Right (Facebook)
    if (id === 'mood-06' || t.includes('scout') || t.includes('facebook') || t.includes('fb') || t.includes('sweet') || t.includes('ice cream') || t.includes('cravings')) return DEFAULT_SLOTS[1];
    // Slot 2: Bottom-Left (YouTube Shorts)
    if (id === 'mood-04' || t.includes('youtube') || t.includes('shorts') || t.includes('lighting') || t.includes('streetwear') || t.includes('botanical') || t.includes('drip')) return DEFAULT_SLOTS[2];
    // Slot 3: Bottom-Middle (Snapchat)
    if (id === 'mood-05' || t.includes('snap') || t.includes('color') || t.includes('mango') || t.includes('smoothie') || t.includes('shake')) return DEFAULT_SLOTS[3];
    // Slot 4: Bottom-Right (WhatsApp)
    if (id === 'mood-02' || t.includes('whatsapp') || t.includes('status') || t.includes('neon') || t.includes('bridge') || t.includes('garden')) return DEFAULT_SLOTS[4];

    return DEFAULT_SLOTS[index % DEFAULT_SLOTS.length];
  };

  /* ------------------------------------------------------------- */
  /* INDIVIDUAL POSTER ARCHETYPE RENDERERS                         */
  /* ------------------------------------------------------------- */

  // 1. INSTAGRAM POST ARCHETYPE (4:5 Ratio)
  const renderInstagram = (card: EditableCard, cardWidth: number) => (
    <div className="w-full bg-white rounded-md overflow-hidden shadow-2xl border border-black/10 text-[#262626] relative select-none">
      {/* Frosted Atelier Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-[#ece8e1]/85 backdrop-blur-[2px] -rotate-2 border border-black/10 shadow-sm opacity-90 pointer-events-none z-20" />

      {/* IG Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 bg-white">
        <div className="flex items-center gap-2">
          {/* Sunset Gradient Avatar Ring */}
          <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0">
            <div className="w-full h-full rounded-full bg-white p-[1px] overflow-hidden flex items-center justify-center font-bold text-[8px] text-[#0c0c0b] font-sans">
              PV
            </div>
          </div>
          <div className="leading-tight text-left">
            <div className="flex items-center gap-1">
              <span className="font-sans font-bold text-[10px] sm:text-[11px] text-[#262626]">pandoravizuals</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0095f6]" />
            </div>
            <div className="text-[8px] sm:text-[9px] text-[#8e8e8e] font-sans">Pandora Studio • Original Audio</div>
          </div>
        </div>
        <MoreHorizontal className="w-3.5 h-3.5 text-[#262626] opacity-60" />
      </div>

      {/* Main Image (4:5 Ratio) */}
      <div className="relative w-full aspect-[4/5] bg-[#171716] overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          fill
          draggable={false}
          className="object-cover pointer-events-none select-none"
          sizes={`${cardWidth * 2}px`}
        />
      </div>

      {/* Action Bar */}
      <div className="px-3 pt-2 pb-2.5 bg-white text-[#262626]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 fill-[#ff3040] text-[#ff3040]" />
            <MessageCircle className="w-4 h-4 -rotate-90 stroke-[2.2]" />
            <Send className="w-4 h-4 stroke-[2.2]" />
          </div>
          <Bookmark className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="font-sans text-[10px] font-bold text-left mb-0.5">2,842 likes</div>
        <div className="font-sans text-[10px] text-left line-clamp-2 leading-tight">
          <span className="font-bold mr-1">pandoravizuals</span>
          {card.description || card.title}
        </div>
      </div>
    </div>
  );

  // 3. SNAPCHAT SNAP ARCHETYPE (9:16 Ratio)
  const renderSnapchat = (card: EditableCard, cardWidth: number) => (
    <div className="w-full relative aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl border-2 border-white/20 select-none">
      {/* Corner Washi Tape */}
      <div className="absolute -top-2.5 -left-3 w-12 h-4.5 bg-white/45 backdrop-blur-[3px] -rotate-45 border border-white/30 shadow-sm pointer-events-none z-20" />

      <Image
        src={card.image}
        alt={card.title}
        fill
        draggable={false}
        className="object-cover pointer-events-none select-none"
        sizes={`${cardWidth * 2}px`}
      />

      {/* Top Snapchat Header Overlay */}
      <div className="absolute top-0 inset-x-0 p-2.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[#fffc00] p-0.5 shrink-0 flex items-center justify-center shadow-sm">
            <span className="font-anton text-[7px] sm:text-[8px] text-black">PV</span>
          </div>
          <div className="text-left leading-tight">
            <div className="font-sans font-bold text-[10px] sm:text-[11px] text-white flex items-center gap-1">
              Pandora
              <span className="text-[9px] text-[#fffc00]">★</span>
            </div>
            <div className="text-[8px] sm:text-[9px] text-white/75 font-sans">2h ago</div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-sans text-white/90">
          <span>3s</span>
        </div>
      </div>

      {/* Classic Translucent Snapchat Center Banner */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 bg-black/65 backdrop-blur-md py-1.5 px-3 text-center z-10 border-y border-white/10">
        <p className="font-sans text-[11px] sm:text-xs text-white font-medium tracking-wide drop-shadow-md line-clamp-2">
          {card.description || card.title}
        </p>
      </div>

      {/* Bottom Chat Pill */}
      <div className="absolute bottom-2.5 inset-x-2.5 bg-black/55 backdrop-blur-md rounded-full px-3 py-1 flex items-center justify-between text-white/80 border border-white/20 z-10">
        <span className="text-[9px] sm:text-[10px] font-sans">Send a chat...</span>
        <Camera className="w-3 h-3 text-white/80" />
      </div>
    </div>
  );

  // 4. WHATSAPP STATUS ARCHETYPE (9:16 Ratio)
  const renderWhatsApp = (card: EditableCard, cardWidth: number) => (
    <div className="w-full relative aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0b141a] shadow-2xl border-2 border-[#25D366]/40 select-none">
      {/* Corner Washi Tape */}
      <div className="absolute -top-2.5 -right-3 w-12 h-4.5 bg-white/45 backdrop-blur-[3px] rotate-45 border border-white/30 shadow-sm pointer-events-none z-20" />

      <Image
        src={card.image}
        alt={card.title}
        fill
        draggable={false}
        className="object-cover pointer-events-none select-none"
        sizes={`${cardWidth * 2}px`}
      />

      {/* WhatsApp Top Header Bar */}
      <div className="absolute top-0 inset-x-0 p-2.5 bg-gradient-to-b from-[#0b141a]/95 via-[#0b141a]/60 to-transparent z-10">
        {/* Story Segment Bars */}
        <div className="flex gap-1 mb-2">
          <div className="h-0.5 flex-1 bg-white rounded-full shadow-sm" />
          <div className="h-0.5 flex-1 bg-white/40 rounded-full" />
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3 text-white" />
            <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full ring-2 ring-[#25D366] overflow-hidden p-0.5 bg-[#0b141a]">
              <div className="w-full h-full rounded-full bg-[#128C7E] flex items-center justify-center font-bold text-[7px] text-white">
                PV
              </div>
            </div>
            <div className="text-left leading-none">
              <div className="font-sans font-semibold text-[10px] sm:text-[11px] text-white">Pandora Visuals</div>
              <div className="text-[8px] text-[#25D366] font-sans mt-0.5">Today, 5:48 PM</div>
            </div>
          </div>
          <MoreVertical className="w-3 h-3 text-white/80" />
        </div>
      </div>

      {/* Caption Overlay */}
      <div className="absolute bottom-11 inset-x-2.5 text-center z-10">
        <span className="bg-black/65 backdrop-blur-md text-white text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md inline-block max-w-full truncate font-sans border border-white/10">
          {card.description || card.title}
        </span>
      </div>

      {/* Bottom Reply Bar */}
      <div className="absolute bottom-2 inset-x-2.5 flex flex-col items-center gap-0.5 z-10">
        <div className="text-[9px] text-white/80 leading-none">^</div>
        <div className="w-full bg-white/20 backdrop-blur-md rounded-full py-1 text-center text-[9px] sm:text-[10px] text-white font-sans border border-white/25 flex items-center justify-center gap-1.5">
          <span>Reply</span>
          <span className="text-[10px]">💬</span>
        </div>
      </div>
    </div>
  );

  // 5. YOUTUBE SHORTS ARCHETYPE (Massive in India — Replacing Apple)
  const renderYouTube = (card: EditableCard, cardWidth: number) => (
    <div className="w-full relative aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl border-2 border-white/20 select-none text-white">
      {/* Corner Washi Tape */}
      <div className="absolute -top-2.5 -left-3 w-12 h-4.5 bg-white/45 backdrop-blur-[3px] -rotate-35 border border-white/30 shadow-sm pointer-events-none z-20" />

      {/* Main Video Background */}
      <Image
        src={card.image}
        alt={card.title}
        fill
        draggable={false}
        className="object-cover pointer-events-none select-none"
        sizes={`${cardWidth * 2}px`}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 p-2.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-sans border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#ff0000] inline-block animate-pulse" />
          <span className="font-bold tracking-wider text-[8px] sm:text-[9px]">SHORTS</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <Search className="w-3.5 h-3.5" />
          <MoreVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Right Column Action Rail (Iconic YouTube Shorts Bar) */}
      <div className="absolute right-2 bottom-12 flex flex-col items-center gap-3 z-10 text-white">
        {/* Like */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/15">
            <ThumbsUp className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] font-sans font-medium">142K</span>
        </div>

        {/* Dislike */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/15">
            <ThumbsDown className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] font-sans font-medium">Dislike</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/15">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] font-sans font-medium">2.8K</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/15">
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] font-sans font-medium">Share</span>
        </div>

        {/* Audio Disc */}
        <div className="w-6 h-6 rounded-full bg-[#ff0000] p-0.5 shadow-md flex items-center justify-center border border-white/30">
          <Music className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Bottom Creator Row & Title */}
      <div className="absolute bottom-2.5 left-2.5 right-12 z-10 text-left space-y-1">
        {/* Creator Channel & Red Subscribe Button */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#ff0000] text-white flex items-center justify-center font-bold text-[7px] font-sans shrink-0 shadow-sm">
            PV
          </div>
          <span className="font-sans font-bold text-[10px] text-white truncate max-w-[85px]">
            @PandoraVizuals
          </span>
          <button className="bg-[#ff0000] text-white font-unica text-[8px] sm:text-[9px] px-2.5 py-0.5 rounded-full tracking-wider uppercase shrink-0 shadow-sm pointer-events-none">
            SUBSCRIBE
          </button>
        </div>

        {/* Video Caption */}
        <div className="font-sans text-[9px] sm:text-[10px] text-white leading-tight line-clamp-2 drop-shadow-md">
          {card.description || 'Milestone cinematic cut. Every frame crafted with passion. 🎬✨'}
        </div>

        {/* Audio Track */}
        <div className="flex items-center gap-1 text-[8px] text-white/75 font-sans truncate">
          <Music className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">Pandora Visuals • Original Sound</span>
        </div>
      </div>

      {/* Red YouTube Scrub Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
        <div className="h-full bg-[#ff0000] w-[65%]" />
      </div>
    </div>
  );

  // 6. FACEBOOK POST ARCHETYPE (4:3 Ratio)
  const renderFacebook = (card: EditableCard, cardWidth: number) => (
    <div className="w-full bg-white rounded-xl shadow-xl border border-black/10 overflow-hidden text-[#050505] p-2.5 sm:p-3 relative select-none">
      {/* Frosted Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-[#ece8e1]/85 backdrop-blur-[2px] 1deg border border-black/10 shadow-sm opacity-90 pointer-events-none z-20" />

      {/* FB Header */}
      <div className="pb-2 flex items-center justify-between border-b border-black/5">
        <div className="flex items-center gap-1.5">
          <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#1877F2] text-white font-anton flex items-center justify-center text-[9px] shrink-0 shadow-sm">
            PV
          </div>
          <div className="text-left leading-tight">
            <div className="flex items-center gap-1">
              <span className="font-sans font-bold text-[10px] sm:text-[11px] text-[#050505]">Pandora Vizuals</span>
              <CheckCircle2 className="w-3 h-3 text-[#1877F2] fill-[#1877F2]" />
            </div>
            <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-[#65676B]">
              <span>3 hrs ago</span>
              <span>•</span>
              <Globe className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
        <MoreHorizontal className="w-3.5 h-3.5 text-[#65676B]" />
      </div>

      {/* Caption */}
      <div className="py-1 text-left text-[9px] sm:text-[10px] font-sans text-[#050505] line-clamp-2 leading-tight">
        {card.description || 'Behind the lens on our latest milestone production. Every frame crafted with precision.'}
      </div>

      {/* Image (4:5) */}
      <div className="relative w-full aspect-[4/5] bg-[#171716] overflow-hidden my-1">
        <Image
          src={card.image}
          alt={card.title}
          fill
          draggable={false}
          className="object-cover pointer-events-none select-none"
          sizes={`${cardWidth * 2}px`}
        />
      </div>

      {/* FB Reaction Stats Bar */}
      <div className="py-1 flex items-center justify-between text-[8px] sm:text-[9px] text-[#65676B] border-b border-black/5">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[7px]">👍</span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#FA383E] text-white flex items-center justify-center text-[7px]">❤️</span>
          </div>
          <span className="font-medium text-[#050505]">384</span>
        </div>
        <div>48 comments • 16 shares</div>
      </div>

      {/* Like / Comment / Share Buttons */}
      <div className="pt-1.5 flex items-center justify-around text-[#65676B] text-[9px] sm:text-[10px] font-semibold">
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" /> Like
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" /> Comment
        </span>
        <span className="flex items-center gap-1">
          <Share2 className="w-3 h-3" /> Share
        </span>
      </div>
    </div>
  );

  // 7. CLASSIC POLAROID FALLBACK
  const renderPolaroid = (card: EditableCard, cardWidth: number) => (
    <div className="bg-[#f8f6f1] p-2.5 sm:p-3 pb-6 sm:pb-8 border border-[#0c0c0b]/10 select-none shadow-xl relative">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-[#ece8e1]/85 backdrop-blur-[2px] -rotate-2 border border-black/5 shadow-sm opacity-90 pointer-events-none z-20" />
      <div className="relative w-full aspect-[3/4] bg-[#171716] overflow-hidden mb-2">
        <Image
          src={card.image}
          alt={card.title}
          fill
          draggable={false}
          className="object-cover pointer-events-none select-none"
          sizes={`${cardWidth * 2}px`}
        />
      </div>
      <div className="font-sans text-[10px] sm:text-[11px] font-bold text-[#0c0c0b] uppercase tracking-wider text-center pt-1 truncate select-none">
        {card.title}
      </div>
    </div>
  );

  // Dispatch renderer by archetype
  const renderCardContent = (format: PosterFormat, card: EditableCard, cardWidth: number) => {
    switch (format) {
      case 'instagram':
        return renderInstagram(card, cardWidth);
      case 'facebook':
        return renderFacebook(card, cardWidth);
      case 'snapchat':
        return renderSnapchat(card, cardWidth);
      case 'whatsapp':
        return renderWhatsApp(card, cardWidth);
      case 'youtube':
        return renderYouTube(card, cardWidth);
      default:
        return renderPolaroid(card, cardWidth);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[960px] sm:min-h-[1040px] lg:min-h-[1120px] w-full bg-[#0c0c0b] text-[#ece8e1] overflow-hidden select-none border-b border-[#ece8e1]/10"
    >
      {/* Subtle Noise Texture Overlay matching the rest of the website */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none z-0" aria-hidden="true" />

      {/* Ambient Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff3d17]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Monumental Center Headline */}
      <div className="absolute top-[48%] sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 text-center pointer-events-none select-none z-10">
        <h2 className="font-unica text-6xl sm:text-8xl md:text-9xl lg:text-[112px] leading-[0.92] tracking-tight text-[#ece8e1] uppercase">
          FRAME IT. SHOOT IT. <br />
          <span className="text-[#ff3d17]">FEEL IT.</span>
        </h2>
      </div>

      {/* Scattered Draggable Social Media & Mobile Video Cards */}
      <div className="absolute inset-0 w-full h-full">
        {sectionCards.map((card, index) => {
          const slot = getSlotForCard(card, index);
          const format = getPosterFormat(card, index);
          const pos = positions[card.id] || { x: 0, y: 0 };
          const z = zIndexMap[card.id] || 15 + index;
          const isDragging = draggingId === card.id;

          // Subtle organic parallax offset via CSS variable
          const parallaxMultiplier = (index % 3 - 1) * 1.2;

          const rot = card.metadata?.rotation ?? slot.rot;
          const cardWidth = isMobile ? slot.mobileWidth : slot.width;
          const topPos = isMobile ? slot.mobileTop : slot.top;
          const bottomPos = isMobile ? slot.mobileBottom : slot.bottom;
          const leftPos = isMobile ? slot.mobileLeft : slot.left;
          const rightPos = isMobile ? slot.mobileRight : slot.right;
          const isCenter = slot.isCenter;

          return (
            <div
              key={card.id}
              onMouseDown={(e) => {
                e.preventDefault();
                handlePointerDown(card.id, e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                handlePointerDown(card.id, touch.clientX, touch.clientY);
              }}
              style={{
                position: 'absolute',
                ...(topPos ? { top: topPos } : {}),
                ...(bottomPos ? { bottom: bottomPos } : {}),
                ...(isCenter
                  ? { left: `calc(50% - ${cardWidth / 2}px)` }
                  : {
                      ...(leftPos ? { left: leftPos } : {}),
                      ...(rightPos ? { right: rightPos } : {}),
                    }),
                width: `${cardWidth}px`,
                transform: `translate(${pos.x}px, calc(${pos.y}px + var(--parallax-offset, 0px) * ${parallaxMultiplier})) rotate(${rot}deg) scale(${
                  isDragging ? 1.05 : 1
                })`,
                zIndex: z,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              className={`select-none will-change-transform transition-shadow duration-200 ${
                isDragging
                  ? 'shadow-[0_36px_70px_rgba(0,0,0,0.85),0_8px_20px_rgba(0,0,0,0.5)]'
                  : 'shadow-[0_24px_50px_rgba(0,0,0,0.65),0_4px_12px_rgba(0,0,0,0.4)]'
              }`}
            >
              {renderCardContent(format, card, cardWidth)}
            </div>
          );
        })}
      </div>
    </section>
  );
}
