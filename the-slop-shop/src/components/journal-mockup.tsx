'use client';

import NextImage from 'next/image';

interface JournalMockupProps {
  imageUrl: string;
  imageAlt: string;
}

/**
 * Clean journal mockup component that displays an image on a blank journal
 */
export function JournalMockup({ imageUrl, imageAlt }: JournalMockupProps) {
  return (
    <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-xl p-8">
      <div className="relative w-full h-full">
        {/* Journal container */}
        <div
          className="relative w-full h-full"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Journal base */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Journal body */}
            <div
              className="relative bg-white rounded-md shadow-2xl"
              style={{
                width: '70%',
                height: '85%',
                transform: 'perspective(800px) rotateX(2deg) rotateY(-2deg)',
                boxShadow: '0 25px 70px rgba(0,0,0,0.25), inset 0 -2px 15px rgba(0,0,0,0.05)',
              }}
            >
              {/* Cover design */}
              <div
                className="absolute inset-0 rounded-md overflow-hidden"
                style={{
                  margin: '2%',
                }}
              >
                {/* User design */}
                <div className="relative w-full h-full">
                  <NextImage
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    style={{
                      filter: 'contrast(1.05) brightness(0.97)',
                    }}
                    priority
                  />
                </div>

                {/* Subtle paper texture overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 1px,
                        rgba(0, 0, 0, 0.01) 1px,
                        rgba(0, 0, 0, 0.01) 2px
                      )
                    `,
                  }}
                />

                {/* Highlight for realism */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.05) 100%)',
                    borderRadius: '4px',
                  }}
                />
              </div>

              {/* Journal border/edge */}
              <div
                className="absolute inset-0 rounded-md"
                style={{
                  border: '2px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.03)',
                }}
              />

              {/* Spine effect (left edge) */}
              <div
                className="absolute left-0 top-0 bottom-0 w-2"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 100%)',
                  borderRadius: '4px 0 0 4px',
                }}
              />
            </div>
          </div>

          {/* Shadow underneath */}
          <div
            className="absolute bottom-0 left-1/2 w-3/5 h-10 rounded-full blur-2xl bg-gradient-to-r from-slate-900/20 via-gray-900/30 to-slate-900/20"
            style={{
              transform: 'translateX(-50%) translateY(50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
