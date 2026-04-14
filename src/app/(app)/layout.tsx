import { Sidebar } from '@/components/Sidebar';
import { CommandPalette } from '@/components/CommandPalette';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CommandPalette />
      <Sidebar>{children}</Sidebar>
    </>
  );
}
