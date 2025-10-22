'use client';

import NextImage from 'next/image';

interface BeachTowelMockupProps {
  imageUrl: string;
  imageAlt: string;
}

/**
 * High-quality beach towel mockup component that displays an image on a beach towel
 * Uses CSS transforms to create a realistic 3D perspective effect
 */
export function BeachTowelMockup({ imageUrl, imageAlt }: BeachTowelMockupProps) {
  return (
    <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl p-8">
      <div className="relative w-full h-full">
        {/* Beach towel container with 3D perspective */}
        <div
          className="relative w-full h-full"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Beach towel base */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Towel body - rectangular with rounded corners and subtle fold effect */}
            <div
              className="relative bg-white rounded-lg shadow-2xl"
              style={{
                width: '85%',
                height: '90%',
                transform: 'perspective(800px) rotateX(2deg) rotateY(-1deg)',
                boxShadow: '0 25px 70px rgba(0,0,0,0.2), inset 0 -2px 15px rgba(0,0,0,0.05)',
              }}
            >
              {/* Design print area - full coverage with subtle texture */}
              <div
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{
                  margin: '3%',
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
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(0,0,0,0.03) 100%)',
                    borderRadius: '4px',
                  }}
                />
              </div>

              {/* Towel border/edge effect */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  border: '3px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
                }}
              />

              {/* Subtle fold line for depth */}
              <div
                className="absolute left-0 right-0 h-1"
                style={{
                  top: '60%',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, transparent 100%)',
                }}
              />
            </div>
          </div>

          {/* Sand/beach shadow underneath */}
          <div
            className="absolute bottom-0 left-1/2 w-4/5 h-12 rounded-full blur-2xl bg-gradient-to-r from-amber-900/20 via-orange-900/30 to-amber-900/20"
            style={{
              transform: 'translateX(-50%) translateY(50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

