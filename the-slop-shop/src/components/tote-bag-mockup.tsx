import NextImage from 'next/image';

interface ToteBagMockupProps {
  imageUrl: string;
  imageAlt: string;
}

export function ToteBagMockup({ imageUrl, imageAlt }: ToteBagMockupProps) {
  return (
    <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-6">
      {/* Tote bag body with slight perspective */}
      <div
        className="relative w-[85%] h-[90%] bg-gradient-to-br from-[#F5F1E8] to-[#E8E4DB] rounded-sm shadow-2xl"
        style={{
          transform: 'perspective(1000px) rotateY(-2deg) rotateX(1deg)',
        }}
      >
        {/* Handles */}
        <div className="absolute -top-8 left-[20%] w-[15%] h-16 bg-gradient-to-b from-[#E8E4DB] to-[#D5D1C8] rounded-t-full border-2 border-[#C5C1B8]"
          style={{ transform: 'perspective(400px) rotateX(-20deg)' }}
        />
        <div className="absolute -top-8 right-[20%] w-[15%] h-16 bg-gradient-to-b from-[#E8E4DB] to-[#D5D1C8] rounded-t-full border-2 border-[#C5C1B8]"
          style={{ transform: 'perspective(400px) rotateX(-20deg)' }}
        />

        {/* Design print area */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full h-[70%]">
            <NextImage
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-contain drop-shadow-sm"
              style={{
                filter: 'contrast(1.05) saturate(1.1)',
              }}
            />
          </div>
        </div>

        {/* Canvas texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.1) 2px,
              rgba(0,0,0,0.1) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.1) 2px,
              rgba(0,0,0,0.1) 4px
            )`,
          }}
        />

        {/* Subtle shadow for depth */}
        <div className="absolute inset-0 shadow-inner rounded-sm pointer-events-none" />
      </div>

      {/* Ground shadow */}
      <div
        className="absolute bottom-4 w-[70%] h-4 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent rounded-full blur-md"
      />
    </div>
  );
}
