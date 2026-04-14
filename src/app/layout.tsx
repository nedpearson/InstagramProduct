import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InstaFlow · AI Automation Platform',
  description: 'Neural-powered Instagram automation — build, schedule, and scale digital product funnels with AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-background text-foreground selection:bg-indigo-500/20 antialiased`}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
