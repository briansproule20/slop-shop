import NextImage from 'next/image';

interface PosterMockupProps {
  imageUrl: string;
  imageAlt: string;
}

export function PosterMockup({ imageUrl, imageAlt }: PosterMockupProps) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100 rounded-xl overflow-hidden flex items-center justify-center p-8">
      {/* Poster - vertical format (11x14 ratio) */}
      <div
        className="relative h-[90%] aspect-[11/14] bg-white shadow-2xl"
        style={{
          transform: 'perspective(800px) rotateY(-3deg) rotateX(2deg)',
        }}
      >
        {/* Design print area */}
        <div className="absolute inset-0 overflow-hidden">
          <NextImage
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            style={{
              filter: 'contrast(1.02) saturate(1.05)',
            }}
          />
        </div>

        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Soft highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)',
          }}
        />

        {/* Border/edge */}
        <div className="absolute inset-0 border border-stone-200/50 pointer-events-none" />
      </div>

      {/* Wall shadow */}
      <div
        className="absolute bottom-6 w-[65%] h-8 bg-gradient-to-r from-transparent via-stone-900/10 to-transparent rounded-full blur-xl"
      />
    </div>
  );
}
