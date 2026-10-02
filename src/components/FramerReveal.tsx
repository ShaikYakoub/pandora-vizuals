'use client';

import React from 'react';
import { motion } from 'motion/react';

interface FramerRevealProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
  className?: string;
}

export default function FramerReveal({
  children,
  delay = 0.15,
  yOffset = 24,
  duration = 0.65,
  className = '',
}: FramerRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
