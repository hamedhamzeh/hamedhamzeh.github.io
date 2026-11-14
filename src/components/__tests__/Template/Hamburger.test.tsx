import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import type { AnchorHTMLAttributes } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Hamburger from '../../Template/Hamburger';

const onRouteSelect = vi.fn();

vi.mock('next/navigation', () => ({ usePathname: vi.fn(() => '/resume/') }));
vi.mock('next/link', () => ({
  default: ({
    onNavigate,
    prefetch: _prefetch,
    scroll: _scroll,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    onNavigate?: (event: { preventDefault: () => void }) => void;
    prefetch?: boolean;
    scroll?: boolean;
  }) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.(event);
      }}
    />
  ),
}));

describe('Hamburger', () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue('/resume/');
    onRouteSelect.mockClear();
  });
  it('renders the hamburger button', () => {
    render(<Hamburger onRouteSelect={onRouteSelect} />);

    const button = screen.getByRole('button', {
      name: /open navigation menu/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('has correct initial aria attributes', () => {
    render(<Hamburger onRouteSelect={onRouteSelect} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'mobile-nav-menu');
  });

  it('toggles menu open on click', () => {
    render(<Hamburger onRouteSelect={onRouteSelect} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-label', 'Close navigation menu');
  });

  it('toggles menu closed on second click', () => {
    render(<Hamburger onRouteSelect={onRouteSelect} />);

    const button = screen.getByRole('button');
    fireEvent.click(button); // Open
    fireEvent.click(button); // Close

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-label', 'Open navigation menu');
  });

  it('shows hamburger icon when closed', () => {
    render(<Hamburger onRouteSelect={onRouteSelect} />);

    const icon = document.querySelector('.hamburger-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveClass('hamburger-icon--open');
  });

  it('changes icon to close state when open', () => {
    render(<Hamburger onRouteSelect={onRouteSelect} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const icon = document.querySelector('.hamburger-icon');
    expect(icon).toHaveClass('hamburger-icon--open');
  });

  it('renders navigation links in slide menu', () => {
    render(<Hamburger onRouteSelect={onRouteSelect} />);

    // Open the menu
    fireEvent.click(screen.getByRole('button'));

    // Check for navigation links
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /publications/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('closes the menu as soon as a destination is selected', () => {
    const { rerender } = render(<Hamburger onRouteSelect={onRouteSelect} />);

    // Open the menu
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Click a link
    const aboutLink = screen.getByRole('link', { name: /about/i });
    fireEvent.click(aboutLink);

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(onRouteSelect).toHaveBeenCalledWith({
      label: 'About',
      path: '/about',
    });
    vi.mocked(usePathname).mockReturnValue('/about/');
    rerender(<Hamburger onRouteSelect={onRouteSelect} />);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    vi.mocked(usePathname).mockReturnValue('/resume/');
    rerender(<Hamburger onRouteSelect={onRouteSelect} />);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes immediately when choosing the current page', () => {
    render(<Hamburger onRouteSelect={onRouteSelect} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('link', { name: 'Resume' }));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
