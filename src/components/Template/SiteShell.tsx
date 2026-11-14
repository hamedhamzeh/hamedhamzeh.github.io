'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from 'react';

import type { Route } from '@/data/routes';

import Navigation from './Navigation';

function normalizePath(path: string) {
  return path.replace(/\/$/, '') || '/';
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = normalizePath(usePathname() ?? '/');
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [destination, setDestination] = useState<{
    route: Route;
    from: string;
  } | null>(null);
  const pendingRoute =
    isPending && destination?.from === pathname ? destination.route : null;

  useEffect(() => {
    const clearDestination = () => setDestination(null);
    window.addEventListener('popstate', clearDestination);
    return () => window.removeEventListener('popstate', clearDestination);
  }, []);

  useLayoutEffect(() => {
    if (!destination || pendingRoute) return;

    if (pathname === destination.route.path) {
      const heading = contentRef.current?.querySelector<HTMLElement>('main h1');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
    setDestination(null);
  }, [destination, pathname, pendingRoute]);

  function navigate(route: Route) {
    if (route.path === pathname) {
      // Supersede any pending push when the user chooses the page already open.
      if (destination) {
        setDestination(null);
        const { search, hash } = window.location;
        startTransition(() =>
          router.replace(`${pathname}${search}${hash}`, { scroll: false }),
        );
      }
      return;
    }

    setDestination({ route, from: pathname });
    startTransition(() => router.push(route.path, { scroll: false }));
  }

  return (
    <div className="site-wrapper">
      <Navigation onRouteSelect={navigate} pendingPath={pendingRoute?.path} />
      <div ref={contentRef}>{children}</div>
      <div className="sr-only" role="status">
        {pendingRoute ? `Loading ${pendingRoute.label}` : ''}
      </div>
    </div>
  );
}
