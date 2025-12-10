import NextImage from 'next/image';

interface PetFoodMatMockupProps {
  imageUrl: string;
  imageAlt: string;
}

export function PetFoodMatMockup({ imageUrl, imageAlt }: PetFoodMatMockupProps) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100 rounded-xl overflow-hidden flex items-center justify-center p-8">
      {/* Pet food mat - landscape rectangle */}
      <div
        className="relative w-[90%] aspect-[1.44/1] bg-neutral-800 shadow-2xl rounded-lg"
        style={{
          transform: 'perspective(800px) rotateX(8deg)',
        }}
      >
        {/* Design print area - image covers whole mat */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
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

        {/* Rubber texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none rounded-lg"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
          }}
        />

        {/* Soft highlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
          }}
        />

        {/* Edge depth */}
        <div className="absolute inset-0 rounded-lg shadow-inner pointer-events-none" />
      </div>

      {/* Ground shadow */}
      <div
        className="absolute bottom-6 w-[75%] h-6 bg-gradient-to-r from-transparent via-stone-900/15 to-transparent rounded-full blur-xl"
      />
    </div>
  );
}
