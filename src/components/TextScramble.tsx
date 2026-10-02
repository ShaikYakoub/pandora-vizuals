'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  trigger?: 'inView' | 'hover' | 'both';
  duration?: number;
  glyphs?: string;
  className?: string;
  as?: 'span' | 'h2' | 'p' | 'div';
}

const DEFAULT_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>_';

export default function TextScramble({
  text,
  trigger = 'both',
  duration = 0.9,
  glyphs = DEFAULT_GLYPHS,
  className = '',
  as: Component = 'span',
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);
  const elementRef = useRef<HTMLElement>(null);

  const scramble = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    const chars = text.split('');
    const totalSteps = Math.floor(duration * 60);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;

      const updated = chars
        .map((char, index) => {
          if (char === ' ') return ' ';
          const charThreshold = (index / chars.length) * 0.8;
          if (progress >= 1 || progress >= charThreshold + 0.2) {
            return char;
          }
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      setDisplayText(updated);

      if (step >= totalSteps) {
        clearInterval(interval);
        setDisplayText(text);
        isScramblingRef.current = false;
      }
    }, 1000 / 60);
  };

  useEffect(() => {
    setDisplayText(text);
    if (trigger === 'inView' || trigger === 'both') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            scramble();
          }
        },
        { threshold: 0.5 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }
  }, [text, trigger]);

  return (
    <Component
      ref={elementRef as unknown as React.RefObject<HTMLParagraphElement>}
      onMouseEnter={trigger === 'hover' || trigger === 'both' ? scramble : undefined}
      className={`select-none cursor-default font-mono tabular-nums ${className}`}
    >
      {displayText}
    </Component>
  );
}
