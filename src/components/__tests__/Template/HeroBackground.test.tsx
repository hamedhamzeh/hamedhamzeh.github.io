import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import HeroBackground from '../../Template/HeroBackground';

describe('HeroBackground', () => {
  const originalWidth = window.innerWidth;
  let frames: Map<number, FrameRequestCallback>;
  let frameId: number;
  let context: {
    setTransform: ReturnType<typeof vi.fn>;
    clearRect: ReturnType<typeof vi.fn>;
    beginPath: ReturnType<typeof vi.fn>;
    arc: ReturnType<typeof vi.fn>;
    fill: ReturnType<typeof vi.fn>;
    moveTo: ReturnType<typeof vi.fn>;
    lineTo: ReturnType<typeof vi.fn>;
    stroke: ReturnType<typeof vi.fn>;
  };
  let media: {
    matches: boolean;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };
  let onVisibility: IntersectionObserverCallback;
  let disconnect: ReturnType<typeof vi.fn>;

  const step = (time: number) => {
    const callbacks = [...frames.values()];
    frames.clear();
    act(() => {
      for (const callback of callbacks) callback(time);
    });
  };
  const setWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: width,
    });
  };

  beforeEach(() => {
    frames = new Map();
    frameId = 0;
    context = {
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    };
    media = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    disconnect = vi.fn();
    setWidth(1280);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(0, 0, window.innerWidth, 800),
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => media),
    );
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++frameId, callback);
      return frameId;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      frames.delete(id);
    });
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          onVisibility = callback;
        }
        observe = vi.fn();
        disconnect = disconnect;
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    setWidth(originalWidth);
  });

  it.each([
    [390, 150],
    [736, 150],
    [737, 250],
    [1024, 250],
    [1025, 400],
  ])('draws the responsive dot count at %i pixels', (width: number, count: number) => {
    setWidth(width);
    render(
      <section>
        <HeroBackground />
      </section>,
    );
    step(40);
    expect(context.arc).toHaveBeenCalledTimes(count);
  });

  it('updates density on resize and maintains a single animation loop', () => {
    render(
      <section>
        <HeroBackground />
      </section>,
    );
    step(40);
    context.arc.mockClear();
    setWidth(800);
    fireEvent(window, new Event('resize'));
    expect(frames.size).toBe(1);
    step(80);
    expect(context.arc).toHaveBeenCalledTimes(250);
  });

  it('does not initialize canvas for reduced motion or touch-only input', () => {
    media.matches = false;
    render(
      <section>
        <HeroBackground />
      </section>,
    );
    expect(HTMLCanvasElement.prototype.getContext).not.toHaveBeenCalled();
    expect(frames.size).toBe(0);
    expect(document.querySelector('.hero-bg')).toHaveAttribute(
      'data-animated',
      'false',
    );
  });

  it('uses the fallback if a canvas context is unavailable', () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
    render(
      <section>
        <HeroBackground />
      </section>,
    );
    expect(frames.size).toBe(0);
    expect(document.querySelector('.hero-bg')).toHaveAttribute(
      'data-animated',
      'false',
    );
  });

  it('stops and resumes when visibility or motion preference changes', () => {
    render(
      <section>
        <HeroBackground />
      </section>,
    );
    const hidden = vi.spyOn(document, 'hidden', 'get');
    hidden.mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    expect(frames.size).toBe(0);
    hidden.mockReturnValue(false);
    fireEvent(document, new Event('visibilitychange'));
    expect(frames.size).toBe(1);
    const changeMotion = media.addEventListener.mock.calls[0][1] as () => void;
    media.matches = false;
    act(changeMotion);
    expect(frames.size).toBe(0);
    media.matches = true;
    act(changeMotion);
    expect(frames.size).toBe(1);
  });

  it('pauses outside the viewport and cancels frames and observers on unmount', () => {
    const { unmount } = render(
      <section>
        <HeroBackground />
      </section>,
    );
    const visibility = (isIntersecting: boolean) =>
      act(() =>
        onVisibility(
          [{ isIntersecting } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ),
      );
    visibility(false);
    expect(frames.size).toBe(0);
    visibility(true);
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    expect(disconnect).toHaveBeenCalledOnce();
    expect(media.removeEventListener).toHaveBeenCalled();
    fireEvent(window, new Event('resize'));
    expect(frames.size).toBe(0);
  });

  it('connects points around the pointer and fades connections after leaving', () => {
    render(
      <section>
        <HeroBackground />
      </section>,
    );
    fireEvent(
      document,
      new MouseEvent('pointermove', { clientX: 150, clientY: 400 }),
    );
    step(40);
    expect(context.lineTo).toHaveBeenCalled();
    context.lineTo.mockClear();
    fireEvent(document.documentElement, new Event('pointerleave'));
    step(80);
    expect(context.lineTo).not.toHaveBeenCalled();
  });

  it('caps drawing frequency without skipping the next scheduled frame', () => {
    render(
      <section>
        <HeroBackground />
      </section>,
    );
    step(40);
    step(56);
    expect(context.clearRect).toHaveBeenCalledTimes(1);
    expect(frames.size).toBe(1);
    step(80);
    expect(context.clearRect).toHaveBeenCalledTimes(2);
  });

  it('renders a decorative fallback during static export without running browser effects', () => {
    const html = renderToString(<HeroBackground />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('hero-vision-fallback');
    expect(HTMLCanvasElement.prototype.getContext).not.toHaveBeenCalled();
    expect(frames.size).toBe(0);
  });
});
