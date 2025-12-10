'use client';

import NextImage from 'next/image';

interface HoodieMockupProps {
  imageUrl: string;
  imageAlt: string;
}

/**
 * Simple hoodie mockup showing print area
 */
export function HoodieMockup({ imageUrl, imageAlt }: HoodieMockupProps) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 rounded-xl p-6 flex items-center justify-center overflow-hidden">
      {/* Print area indicator */}
      <div className="relative w-[85%] h-[85%] flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-dashed border-slate-400/20 rounded-lg" />
        <div className="relative w-[110%] h-[110%]">
          <NextImage
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
      
      {/* Print area label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <p className="text-xs text-slate-300 font-medium">Front Print Area</p>
      </div>
    </div>
  );
}

