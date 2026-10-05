import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function StatsPage() {
  // Retain the route source for future work without serving an empty public page.
  notFound();
}
