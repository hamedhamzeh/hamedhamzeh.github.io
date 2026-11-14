'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import routes, { type Route } from '../../data/routes';
import SlideMenu from './SlideMenu';

const MENU_ID = 'mobile-nav-menu';

export default function Hamburger({
  onRouteSelect,
}: {
  onRouteSelect: (route: Route) => void;
}) {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath !== null && openPath === pathname;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = useCallback(
    () => setOpenPath((prev) => (prev === pathname ? null : pathname)),
    [pathname],
  );
  const closeMenu = useCallback(() => setOpenPath(null), []);

  // Clear the opening route so back navigation cannot reopen a stale menu.
  useEffect(() => {
    setOpenPath(null);
  }, [pathname]);

  const slideMenu = (
    <SlideMenu
      id={MENU_ID}
      isOpen={open}
      onClose={closeMenu}
      position="right"
      returnFocusRef={buttonRef}
    >
      <ul className="hamburger-ul">
        {routes.map((l) => (
          <li key={l.label}>
            <Link
              href={l.path}
              prefetch={false}
              onNavigate={(event) => {
                event.preventDefault();
                closeMenu();
                onRouteSelect(l.index ? { ...l, label: 'Home' } : l);
              }}
            >
              <h3 className={l.index ? 'index-li' : undefined}>{l.label}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </SlideMenu>
  );

  return (
    <>
      <div className="hamburger-container">
        <nav className="main" id="hamburger-nav">
          <ul>
            <li className="menu">
              <button
                ref={buttonRef}
                type="button"
                onClick={toggleMenu}
                className="hamburger-button"
                aria-label={
                  open ? 'Close navigation menu' : 'Open navigation menu'
                }
                aria-expanded={open}
                aria-controls={MENU_ID}
              >
                {/* CSS-based hamburger/close icon for cross-platform consistency */}
                <span
                  className={`hamburger-icon${open ? ' hamburger-icon--open' : ''}`}
                >
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      {mounted && createPortal(slideMenu, document.body)}
    </>
  );
}
