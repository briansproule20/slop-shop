'use client';

import NextImage from 'next/image';

interface GolfTowelMockupProps {
  imageUrl: string;
  imageAlt: string;
}

/**
 * High-quality golf towel mockup component that displays an image on a golf towel
 * Features gold grommet and ring detail, with golf course themed styling
 */
export function GolfTowelMockup({ imageUrl, imageAlt }: GolfTowelMockupProps) {
  return (
    <div className="relative w-full aspect-[2/3] bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-xl p-8">
      <div className="relative w-full h-full">
        {/* Golf towel container with 3D perspective */}
        <div
          className="relative w-full h-full"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Golf towel base */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Towel body - 16" × 24" aspect ratio (2:3) */}
            <div
              className="relative bg-white rounded-lg shadow-2xl"
              style={{
                width: '80%',
                height: '90%',
                transform: 'perspective(700px) rotateX(2deg) rotateY(-1deg)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.18), inset 0 -2px 12px rgba(0,0,0,0.04)',
              }}
            >
              {/* Gold grommet and ring at top */}
              <div
                className="absolute"
                style={{
                  left: '50%',
                  top: '-8px',
                  transform: 'translateX(-50%)',
                  zIndex: 10,
                }}
              >
                {/* Grommet hole */}
                <div
                  className="relative rounded-full"
                  style={{
                    width: '16px',
                    height: '16px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e5ad 50%, #c5941a 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(212,175,55,0.4)',
                  }}
                >
                  {/* Inner hole */}
                  <div
                    className="absolute inset-0 m-auto rounded-full"
                    style={{
                      width: '8px',
                      height: '8px',
                      background: 'rgba(0,0,0,0.15)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
                    }}
                  />
                </div>
                {/* Ring */}
                <div
                  className="absolute rounded-full border-2"
                  style={{
                    width: '22px',
                    height: '22px',
                    left: '-3px',
                    top: '-3px',
                    borderColor: '#d4af37',
                    opacity: 0.7,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </div>

              {/* Design print area */}
              <div
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{
                  margin: '4%',
                }}
              >
                {/* Actual user design */}
                <div className="relative w-full h-full">
                  <NextImage
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    style={{
                      filter: 'contrast(1.03) brightness(0.98)',
                    }}
                    priority
                  />
                </div>

                {/* Subtle fabric texture overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(255, 255, 255, 0.02) 2px,
                        rgba(255, 255, 255, 0.02) 4px
                      ),
                      repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(255, 255, 255, 0.02) 2px,
                        rgba(255, 255, 255, 0.02) 4px
                      )
                    `,
                  }}
                />

                {/* Subtle highlight for realism */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 35%, rgba(0,0,0,0.03) 100%)',
                    borderRadius: '4px',
                  }}
                />
              </div>

              {/* Towel border/edge effect */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  border: '2px solid rgba(255, 255, 255, 0.85)',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.04)',
                }}
              />
            </div>
          </div>

          {/* Grass/green shadow underneath */}
          <div
            className="absolute bottom-0 left-1/2 w-3/4 h-10 rounded-full blur-2xl bg-gradient-to-r from-green-900/20 via-emerald-900/30 to-green-900/20"
            style={{
              transform: 'translateX(-50%) translateY(50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

