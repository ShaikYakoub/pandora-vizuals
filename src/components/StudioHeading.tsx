'use client';

import React from 'react';
import { motion } from 'motion/react';

interface StudioHeadingProps {
  text?: string;
  lines?: string[];
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  baseDelay?: number;
  variant?: 'default' | 'journal' | 'subtle';
  children?: React.ReactNode;
}

export default function StudioHeading({
  text,
  lines,
  as: Component = 'h1',
  className = '',
  baseDelay = 0.05,
  variant = 'default',
  children,
}: StudioHeadingProps) {
  // If children passed instead of text, extract text or render as is if not string
  const rawText = text || (typeof children === 'string' ? children : '');
  const textLines = lines || (rawText ? rawText.split('\n') : []);

  const resolvedClassName = className.includes('font-') ? className : `font-unica ${className}`.trim();

  if (textLines.length === 0 && children) {
    return <Component className={resolvedClassName}>{children}</Component>;
  }

  let globalCharCount = 0;

  return (
    <Component className={resolvedClassName}>
      {textLines.map((line, lineIdx) => {
        const words = line.trim().split(/\s+/);
        return (
          <React.Fragment key={lineIdx}>
            <span className="inline-block whitespace-normal">
              {words.map((word, wordIdx) => {
                const chars = Array.from(word);
                return (
                  <span
                    key={wordIdx}
                    className="inline-block whitespace-nowrap mr-[0.28em]"
                  >
                    {chars.map((char, charIdx) => {
                      const charIndex = globalCharCount++;
                      const delay = baseDelay + charIndex * 0.016;

                      // Smooth cinematic appear physics
                      const initialProps =
                        variant === 'journal'
                          ? {
                              opacity: 0.001,
                              filter: 'blur(16px)',
                              y: -40,
                              rotate: -8,
                            }
                          : variant === 'subtle'
                          ? {
                              opacity: 0.001,
                              filter: 'blur(12px)',
                              y: 8,
                              scale: 1.15,
                            }
                          : {
                              opacity: 0.001,
                              filter: 'blur(24px)',
                              y: 12,
                              scale: 1.45,
                            };

                      const animateProps =
                        variant === 'journal'
                          ? {
                              opacity: 1,
                              filter: 'blur(0px)',
                              y: 0,
                              rotate: 0,
                            }
                          : {
                              opacity: 1,
                              filter: 'blur(0px)',
                              y: 0,
                              scale: 1,
                            };

                      return (
                        <motion.span
                          key={charIdx}
                          initial={initialProps}
                          animate={animateProps}
                          transition={{
                            duration: 0.65,
                            ease: [0.16, 1, 0.3, 1],
                            delay,
                          }}
                          style={{
                            display: 'inline-block',
                            willChange: 'transform, filter, opacity',
                          }}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </span>
                );
              })}
            </span>
            {lineIdx < textLines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </Component>
  );
}
