'use client';

import NextImage from 'next/image';

interface MugMockupProps {
  imageUrl: string;
  imageAlt: string;
}

/**
 * High-quality mug mockup component that displays an image on a ceramic mug
 * Uses CSS transforms to create a realistic 3D perspective effect
 */
export function MugMockup({ imageUrl, imageAlt }: MugMockupProps) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
      <div className="relative w-full h-full">
        {/* Mug container with 3D perspective */}
        <div
          className="relative w-full h-full"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* White ceramic mug base */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Mug body - white rounded rectangle with shadow */}
            <div
              className="relative bg-white rounded-2xl shadow-2xl"
              style={{
                width: '70%',
                height: '75%',
                borderRadius: '20px 20px 25px 25px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15), inset 0 -2px 10px rgba(0,0,0,0.05)',
              }}
            >
              {/* Mug handle */}
              <div
                className="absolute bg-white border-4 border-white"
                style={{
                  right: '-15%',
                  top: '20%',
                  width: '25%',
                  height: '50%',
                  borderRadius: '0 50px 50px 0',
                  boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.1), 3px 3px 15px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(90deg, #ffffff 0%, #f5f5f5 100%)',
                }}
              />

              {/* Design print area with realistic placement */}
              <div
                className="absolute"
                style={{
                  left: '15%',
                  top: '22%',
                  width: '70%',
                  height: '55%',
                  transform: 'perspective(600px) rotateY(-3deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Inner shadow for depth */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)',
                  }}
                />

                {/* Actual user design */}
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <NextImage
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-contain"
                    style={{
                      filter: 'contrast(1.05) brightness(0.98)',
                    }}
                    priority
                  />
                </div>

                {/* Subtle highlight for realism */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
                    borderRadius: '8px',
                  }}
                />
              </div>

              {/* Mug rim highlight */}
              <div
                className="absolute top-0 left-0 right-0 h-4 rounded-t-2xl"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
                }}
              />
            </div>
          </div>

          {/* Soft shadow underneath */}
          <div
            className="absolute bottom-0 left-1/2 w-3/4 h-8 rounded-full blur-xl opacity-30 bg-gray-800"
            style={{
              transform: 'translateX(-50%) translateY(50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
