import React from 'react';
import Image from 'next/image';

export interface PandoraLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  theme?: 'white' | 'dark';
  priority?: boolean;
}

export default function PandoraLogo({
  className = 'w-auto h-6',
  theme = 'white',
  priority = true,
  ...props
}: PandoraLogoProps) {
  const logoSrc =
    theme === 'dark'
      ? '/images/PANDORA LOGO UPDATED.png'
      : '/images/PANDORA LOGO UPDATED WHITE copy.png';

  return (
    <div
      className={`relative inline-flex items-center justify-center aspect-[5000/1568] ${className}`}
      {...props}
    >
      <Image
        src={logoSrc}
        alt="Pandora Vizuals"
        fill
        priority={priority}
        className="object-contain pointer-events-none select-none"
        sizes="(max-width: 640px) 240px, (max-width: 1024px) 480px, 1200px"
      />
    </div>
  );
}
