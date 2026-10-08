'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export interface CameraCTAButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  showIcon?: boolean;
  showDot?: boolean;
  showBrackets?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export default function CameraCTAButton({
  href,
  onClick,
  type = 'button',
  disabled = false,
  target,
  rel,
  children,
  icon,
  showIcon = true,
  showDot = true,
  showBrackets = true,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
}: CameraCTAButtonProps) {
  // Size classes
  const sizeClasses =
    size === 'sm'
      ? 'px-4 py-2 gap-2.5 text-xs'
      : size === 'lg'
      ? 'px-8 sm:px-10 py-4 sm:py-4.5 gap-4 text-base sm:text-lg'
      : 'px-6 sm:px-8 py-3 sm:py-3.5 gap-3.5 text-sm sm:text-base';

  // Variant color styles
  let variantStyles =
    'bg-[#0c0c0b]/85 hover:bg-[#ff3d17] text-[#ece8e1] hover:text-[#0c0c0b] border border-[#ece8e1]/30 hover:border-[#ff3d17] shadow-[0_12px_32px_rgba(0,0,0,0.85)] hover:shadow-[0_0_24px_rgba(255,61,23,0.6)]';

  if (variant === 'danger') {
    variantStyles =
      'bg-[#0c0c0b]/85 hover:bg-[#ff3d17] text-[#ff3d17] hover:text-[#0c0c0b] border border-[#ff3d17]/40 hover:border-[#ff3d17] shadow-[0_12px_32px_rgba(0,0,0,0.85)] hover:shadow-[0_0_24px_rgba(255,61,23,0.6)]';
  } else if (variant === 'secondary') {
    variantStyles =
      'bg-[#171716]/90 hover:bg-[#ece8e1] text-[#ece8e1] hover:text-[#0c0c0b] border border-[#ece8e1]/20 hover:border-[#ece8e1] shadow-[0_12px_32px_rgba(0,0,0,0.85)] hover:shadow-[0_0_24px_rgba(236,232,225,0.4)]';
  }

  const baseClasses = `group relative z-30 inline-flex items-center justify-center font-unica transition-all duration-300 active:translate-y-0.5 active:scale-[0.98] select-none rounded-none backdrop-blur-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${variantStyles} ${className}`;

  const content = (
    <>
      {/* Camera Shutter Indicator Dot */}
      {showDot && (
        <span className="w-2 h-2 rounded-full bg-[#ff3d17] group-hover:bg-[#0c0c0b] shadow-[0_0_8px_#ff3d17] group-hover:shadow-none transition-colors shrink-0" />
      )}

      {/* Label in Unica Font */}
      <span className="font-unica tracking-[0.14em] uppercase">
        {children}
      </span>

      {/* Directional Shutter Arrow or Custom Icon */}
      {showIcon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 inline-flex items-center justify-center">
          {icon ? (
            icon
          ) : (
            <ArrowUpRight className="w-4 h-4 text-[#ece8e1] group-hover:text-[#0c0c0b] transition-colors" />
          )}
        </span>
      )}

      {/* Sharp Camera Corner Viewfinder Brackets */}
      {showBrackets && (
        <>
          <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors pointer-events-none" />
          <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors pointer-events-none" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors pointer-events-none" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#ece8e1]/40 group-hover:border-[#0c0c0b] transition-colors pointer-events-none" />
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        prefetch={false}
        className={baseClasses}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={baseClasses}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
