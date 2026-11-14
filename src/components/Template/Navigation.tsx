'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import routes, { type Route } from '@/data/routes';

import Hamburger from './Hamburger';
import ThemeToggle from './ThemeToggle';

export default function Navigation({
  onRouteSelect,
  pendingPath,
}: {
  onRouteSelect: (route: Route) => void;
  pendingPath?: string;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header className="site-header">
      <Link
        href="/"
        prefetch={false}
        className="site-logo"
        data-pending={pendingPath === '/' ? true : undefined}
        onNavigate={(event) => {
          event.preventDefault();
          onRouteSelect({ path: '/', label: 'Home' });
        }}
      >
        <span className="logo-text">HMZ</span>
      </Link>

      <nav className="nav-links">
        {routes
          .filter((l) => !l.index)
          .map((l) => (
            <Link
              key={l.label}
              href={l.path}
              prefetch={false}
              className={`nav-link ${isActive(l.path) ? 'active' : ''}`}
              aria-current={isActive(l.path) ? 'page' : undefined}
              data-pending={pendingPath === l.path ? true : undefined}
              onNavigate={(event) => {
                event.preventDefault();
                onRouteSelect(l);
              }}
            >
              {l.label}
            </Link>
          ))}
      </nav>

      <div className="nav-actions">
        <ThemeToggle />
        <Hamburger onRouteSelect={onRouteSelect} />
      </div>
    </header>
  );
}
