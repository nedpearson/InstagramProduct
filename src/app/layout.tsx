import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InstaFlow · AI Instagram Automation',
  description: 'Neural-powered Instagram automation — build, schedule, and scale digital product funnels with AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans bg-[#030304] text-foreground selection:bg-indigo-500/20 antialiased`}>
        {children}
      </body>
    </html>
  );
}
