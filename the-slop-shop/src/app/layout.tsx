import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'The Slop Shop',
  description: 'the creation portal',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo/slopshop favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'The Slop Shop',
    description: 'the creation portal',
    images: [
      {
        url: '/logo/slopshop favicon.png',
        width: 512,
        height: 512,
        alt: 'The Slop Shop Logo',
      },
    ],
    siteName: 'The Slop Shop',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'The Slop Shop',
    description: 'the creation portal',
    images: ['/logo/slopshop favicon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
