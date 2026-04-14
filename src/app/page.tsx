import { redirect } from 'next/navigation';

export default function RootPage() {
  // Root redirects to the landing page handled in (marketing)/page.tsx
  // This file should not be reachable but kept as safety redirect
  redirect('/overview');
}
