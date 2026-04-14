import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InstaFlow | Enterprise Automation',
  description: 'Premium Instagram digital product automation platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#fafafa] dark:bg-[#09090b] selection:bg-indigo-500/30`}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
