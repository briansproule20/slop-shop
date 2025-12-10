'use client';

import NextImage from 'next/image';

interface GreetingCardMockupProps {
  imageUrl: string;
  imageAlt: string;
}

export function GreetingCardMockup({ imageUrl, imageAlt }: GreetingCardMockupProps) {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
      <div className="relative w-full h-full">
        <div
          className="relative w-full h-full"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Card - vertical orientation */}
            <div
              className="relative bg-white shadow-2xl"
              style={{
                width: '55%',
                height: '75%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15), inset 0 -2px 10px rgba(0,0,0,0.05)',
              }}
            >
              {/* Design print area */}
              <div
                className="absolute"
                style={{
                  left: '5%',
                  top: '5%',
                  width: '90%',
                  height: '90%',
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <NextImage
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    style={{
                      filter: 'contrast(1.02) brightness(0.99)',
                    }}
                    priority
                  />
                </div>

                {/* Subtle highlight */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Shadow underneath */}
          <div
            className="absolute bottom-0 left-1/2 w-1/2 h-8 rounded-full blur-xl opacity-30 bg-gray-800"
            style={{
              transform: 'translateX(-50%) translateY(50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
