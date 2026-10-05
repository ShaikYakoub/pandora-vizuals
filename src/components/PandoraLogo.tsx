import React from 'react';
import Image from 'next/image';

export interface PandoraLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  theme?: 'white' | 'dark';
  priority?: boolean;
  sizes?: string;
}

export default function PandoraLogo({
  className = 'w-auto h-6',
  theme = 'white',
  priority = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 2560px',
  ...props
}: PandoraLogoProps) {
  const logoSrc =
    theme === 'dark'
      ? '/images/pandora-logo-dark.svg'
      : '/images/pandora-logo-white.svg';

  return (
    <div
      className={`relative inline-flex items-center justify-center aspect-[1024/208] ${className}`}
      {...props}
    >
      <Image
        src={logoSrc}
        alt="Pandora Vizuals"
        fill
        priority={priority}
        className="object-contain pointer-events-none select-none"
        sizes={sizes}
      />
    </div>
  );
}

