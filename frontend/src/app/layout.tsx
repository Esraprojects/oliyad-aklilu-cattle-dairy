import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Oliyad & Aklilu Cattle Fattening and Dairy | ኦሊያድ እና አቅሊሉ የከብት ማድለብ',
  description: 'Professional cattle fattening and dairy management system for Oliyad, Aklilu and Friends Farm',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="am-ET" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen" style={{ backgroundColor: '#FAFAF5' }}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { background: '#1B4332', color: '#fff', borderRadius: '10px' },
              success: { style: { background: '#166534', color: '#fff' } },
              error: { style: { background: '#991B1B', color: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
