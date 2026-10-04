'use client';

import React from 'react';
import ManifestoScroll from '@/components/ManifestoScroll';

export default function AboutPage() {
  return (
    <div className="w-full bg-[#0c0c0b] text-[#ece8e1] min-h-[calc(100vh-80px)] flex flex-col justify-center px-4 sm:px-8 pt-24 sm:pt-28 pb-24 sm:pb-28 bg-noise select-none">
      <ManifestoScroll
        isStandalone={true}
        ctaText="EXPLORE WORK"
        ctaLink="/shop"
      />
    </div>
  );
}
