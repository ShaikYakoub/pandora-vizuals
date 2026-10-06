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
        viewBox="0 0 100 100"
        fill="none"
        role="img"
        aria-label="Instagram Icon"
        className={`select-none flex-shrink-0 ${className}`}
        {...props}
      >
        <g transform="scale(0.757576)">
          {/* White Squircle Badge Background */}
          <path
            fill={badgeFill}
            className="transition-colors duration-200"
            d="M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z"
            transform="translate(1.004 1)"
          />
          {/* Black Camera Lens & Flash Glyph */}
          <path
            fill={glyphFill}
            className="transition-colors duration-200"
            d="M66.004 18c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C18.06 51.327 18 52.964 18 66s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.668 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97c-3.18 0-5.76 2.577-5.76 5.758 0 3.18 2.58 5.76 5.76 5.76 3.18 0 5.76-2.58 5.76-5.76 0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C79.617 90.645 90.65 79.613 90.65 66S79.616 41.35 66.003 41.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z"
          />
        </g>
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
