import NextImage from 'next/image';

interface PetBandanaMockupProps {
  imageUrl: string;
  imageAlt: string;
}

export function PetBandanaMockup({ imageUrl, imageAlt }: PetBandanaMockupProps) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl overflow-hidden flex items-center justify-center p-8">
      {/* Bandana laid flat - triangular shape pointing down */}
      <div
        className="relative w-[85%] aspect-square"
        style={{
          transform: 'perspective(800px) rotateX(5deg)',
        }}
      >
        {/* Triangle bandana shape */}
        <div
          className="relative w-full h-full overflow-hidden shadow-2xl"
          style={{
            clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
          }}
        >
          {/* Design print area */}
          <div className="absolute inset-0">
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

          {/* Fabric texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 1px,
                rgba(0,0,0,0.1) 1px,
                rgba(0,0,0,0.1) 2px
              )`,
            }}
          />

          {/* Soft highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.05) 100%)',
            }}
          />
        </div>
      </div>

      {/* Ground shadow */}
      <div
        className="absolute bottom-6 w-[60%] h-6 bg-gradient-to-r from-transparent via-amber-900/15 to-transparent rounded-full blur-xl"
      />
    </div>
  );
}
