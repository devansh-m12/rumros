import '@/app/globals.css';

import { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';
import { sans } from '@/lib/fonts';
import { cn } from '@/lib/utils';


export const metadata: Metadata = {
  metadataBase: new URL('https://www.rumros.com'),
  title: 'Rumros',
  openGraph: {
    type: 'website',
    title: 'Rumros',
    description: 'The AI Analytics Platform',
    images: {
      url: '/opengraph-image.png',
      alt: 'Rumros'
    }
  },
  twitter: {
    card: 'summary',
    description: 'The AI Analytics Platform',
    title: 'Rumros',
    images: {
      url: '/twitter-image.png',
      alt: 'Rumros'
    }
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn('h-full antialiased', sans.variable)}>
        <body
          className="flex flex-col h-full"
        > 
          <div className="flex">
            <div className="flex flex-col flex-grow max-w-full min-h-screen">
              <main className="z-10 flex flex-col flex-grow">{children}</main>
              <Toaster />
            </div>
          </div>
        </body>
    </html>
  );
}
