'use client';

import React from 'react';

export type SocialPlatform = 'instagram' | 'facebook' | 'youtube';

export const SOCIAL_USERNAMES: Record<SocialPlatform, string> = {
  instagram: '#pandoravizuals',
  facebook: '@Pandora Vizuals',
  youtube: '@PandoraVizuals',
};

export interface SocialBrandIconProps extends React.SVGProps<SVGSVGElement> {
  platform: SocialPlatform;
  className?: string;
  badgeFill?: string;
  glyphFill?: string;
}

export function SocialBrandIcon({
  platform,
  className = 'w-6 h-6',
  badgeFill = '#ece8e1',
  glyphFill = '#0c0c0b',
  ...props
}: SocialBrandIconProps) {
  if (platform === 'instagram') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        aria-label="Instagram Icon"
        className={`select-none flex-shrink-0 ${className}`}
        {...props}
      >
        {/* White Squircle Badge Background (Camera Body) */}
        <rect
          width="24"
          height="24"
          rx="6.5"
          fill={badgeFill}
          className="transition-colors duration-200"
        />
        {/* Black Camera Lens Ring */}
        <circle
          cx="12"
          cy="12"
          r="4.9"
          stroke={glyphFill}
          strokeWidth="2.5"
          fill="none"
          className="transition-colors duration-200"
        />
        {/* Black Flash Dot */}
        <circle
          cx="18"
          cy="6"
          r="1.45"
          fill={glyphFill}
          className="transition-colors duration-200"
        />
      </svg>
    );
  }

  if (platform === 'facebook') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        fill="none"
        role="img"
        aria-label="Facebook Icon"
        className={`select-none flex-shrink-0 ${className}`}
        {...props}
      >
        {/* White Circle Badge Background */}
        <path
          fill={badgeFill}
          className="transition-colors duration-200"
          d="M16.7 39.8C7.2 38.1 0 29.9 0 20 0 9 9 0 20 0s20 9 20 20c0 9.9-7.2 18.1-16.7 19.8l-1.1-.9h-4.4l-1.1.9z"
        />
        {/* Black Lowercase 'f' Glyph */}
        <path
          fill={glyphFill}
          className="transition-colors duration-200"
          d="m27.8 25.6.9-5.6h-5.3v-3.9c0-1.6.6-2.8 3-2.8H29V8.2c-1.4-.2-3-.4-4.4-.4-4.6 0-7.8 2.8-7.8 7.8V20h-5v5.6h5v14.1c1.1.2 2.2.3 3.3.3 1.1 0 2.2-.1 3.3-.3V25.6h4.4z"
        />
      </svg>
    );
  }

  // platform === 'youtube'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28.57 20"
      fill="none"
      role="img"
      aria-label="YouTube Icon"
      className={`select-none flex-shrink-0 ${className}`}
      {...props}
    >
      {/* White Rounded Play Badge Background */}
      <path
        d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
        fill={badgeFill}
        className="transition-colors duration-200"
      />
      {/* Black Triangle Glyph */}
      <path
        d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"
        fill={glyphFill}
        className="transition-colors duration-200"
      />
    </svg>
  );
}

export interface SocialBrandLogoProps {
  platform: SocialPlatform;
  username?: string;
  showIcon?: boolean;
  showUsername?: boolean;
  theme?: 'white' | 'dark';
  badgeFill?: string;
  glyphFill?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export default function SocialBrandLogo({
  platform,
  username,
  showIcon = true,
  showUsername = true,
  theme = 'white',
  badgeFill = '#ece8e1',
  glyphFill = '#0c0c0b',
  className = '',
  iconClassName = '',
  textClassName = '',
}: SocialBrandLogoProps) {
  const displayedUsername = username || SOCIAL_USERNAMES[platform];
  const textColor = theme === 'dark' ? 'text-black' : 'text-[#ece8e1]';

  return (
    <span className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {showIcon && (
        <SocialBrandIcon
          platform={platform}
          badgeFill={badgeFill}
          glyphFill={glyphFill}
          className={iconClassName || 'w-5 h-5 sm:w-6 sm:h-6'}
        />
      )}
      {showUsername && (
        <span
          className={`font-sans font-semibold tracking-tight transition-colors duration-200 ${
            textClassName || `${textColor} group-hover:text-[#ff3d17]`
          }`}
        >
          {displayedUsername}
        </span>
      )}
    </span>
  );
}
