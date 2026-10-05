import { fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import VideoGallery from '../../Media/VideoGallery';
import VideoPlayer from '../../Media/VideoPlayer';

const video = {
  src: '/videos/example/demo.mp4',
  poster: '/videos/example/posters/demo.webp',
  title: 'Robot demonstration',
  description: 'The robot crosses a test surface.',
  width: 1280,
  height: 720,
};

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});

afterAll(() => vi.restoreAllMocks());

describe('VideoPlayer', () => {
  it('renders native, accessible, non-preloading video markup', () => {
    const { container } = render(<VideoPlayer video={video} />);
    const player = screen.getByLabelText('Robot demonstration', {
      selector: 'video',
    });
    expect(player).toHaveAttribute('controls');
    expect(player).toHaveAttribute('preload', 'none');
    expect(player).toHaveAttribute('playsinline');
    expect(player).not.toHaveAttribute('autoplay');
    expect(player).toHaveAttribute('width', '1280');
    expect(player).toHaveAttribute('height', '720');
    expect(player).toHaveAttribute(
      'poster',
      '/videos/example/posters/demo.webp',
    );
    expect(container.querySelector('source')).toHaveAttribute(
      'src',
      '/videos/example/demo.mp4',
    );
    expect(screen.getByText(video.description)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Open the MP4 file' }),
    ).toBeNull();
  });

  it('renders optional selectable caption tracks and a transcript', () => {
    const { container } = render(
      <VideoPlayer
        video={{
          ...video,
          captions: [
            {
              src: '/videos/example/captions-en.vtt',
              language: 'en',
              label: 'English',
              default: true,
            },
          ],
          transcript: 'The robot crosses a test surface.',
        }}
      />,
    );
    expect(container.querySelector('track')).toMatchObject({
      kind: 'captions',
    });
    expect(container.querySelector('track')).toHaveAttribute(
      'src',
      '/videos/example/captions-en.vtt',
    );
    expect(container.querySelector('track')).toHaveAttribute('srclang', 'en');
    expect(container.querySelector('track')).toHaveAttribute('default');
    expect(screen.getByText('Read transcript')).toBeInTheDocument();
  });

  it('starts from the labeled button and shows an error fallback', () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockResolvedValue(undefined);
    render(<VideoPlayer video={video} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Play Robot demonstration' }),
    );
    expect(play).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('Loading video');

    fireEvent.error(
      screen.getByLabelText('Robot demonstration', {
        selector: 'video',
      }),
    );
    expect(screen.getByRole('alert')).toHaveTextContent('could not be played');
    expect(
      screen.getByRole('link', { name: 'Open the MP4 file' }),
    ).toHaveAttribute('href', '/videos/example/demo.mp4');
  });

  it('keeps every source mounted but only the selected video playable', () => {
    const { container } = render(
      <VideoGallery
        label="Robot demos"
        videos={[
          video,
          { ...video, src: '/videos/example/second.mp4', title: 'Second demo' },
          { ...video, src: '/videos/example/third.mp4', title: 'Third demo' },
        ]}
      />,
    );
    expect(container.querySelectorAll('source')).toHaveLength(3);
    const first = screen.getByLabelText('Robot demonstration', {
      selector: 'video',
    });
    const second = screen.getByLabelText('Second demo', { selector: 'video' });
    expect(first).toHaveAttribute('controls');
    expect(second).not.toHaveAttribute('controls');
    expect(
      screen.getByRole('button', { name: 'Play Robot demonstration' }),
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Play Second demo' }),
    ).toBeNull();
    expect(screen.getByRole('heading', { name: video.title })).toBeVisible();
    expect(screen.getAllByRole('button', { name: /^Show / })).toHaveLength(3);
    expect(
      screen.getByRole('button', { name: 'Show Robot demonstration (1 of 3)' }),
    ).toHaveAttribute('aria-current', 'true');
    expect(
      container.querySelectorAll('.video-gallery-indicator-mark'),
    ).toHaveLength(3);
    expect(
      container.querySelectorAll('.video-gallery-indicator.is-active'),
    ).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Next video' })).toBeNull();
  });

  it('can omit the visible title without removing the accessible video name', () => {
    render(
      <VideoGallery label="Robot demos" videos={[video]} showTitle={false} />,
    );
    expect(screen.queryByRole('heading', { name: video.title })).toBeNull();
    expect(
      screen.getByLabelText(video.title, { selector: 'video' }),
    ).toBeInTheDocument();
  });

  it('includes every video source in server-rendered HTML', () => {
    const html = renderToStaticMarkup(
      <VideoGallery
        label="Robot demos"
        videos={[
          video,
          { ...video, src: '/videos/example/second.mp4', title: 'Second demo' },
        ]}
      />,
    );
    expect(html).toContain('<source src="/videos/example/demo.mp4"');
    expect(html).toContain('<source src="/videos/example/second.mp4"');
    expect(html.match(/preload="none"/g)).toHaveLength(2);
  });

  it('pauses the current video when navigating to another slide', () => {
    const pause = vi.mocked(HTMLMediaElement.prototype.pause);
    render(
      <VideoGallery
        label="Robot demos"
        videos={[
          video,
          { ...video, src: '/videos/example/second.mp4', title: 'Second demo' },
        ]}
      />,
    );
    const first = screen.getByLabelText('Robot demonstration', {
      selector: 'video',
    });
    const second = screen.getByLabelText('Second demo', { selector: 'video' });
    Object.defineProperty(first, 'paused', {
      configurable: true,
      value: false,
    });
    expect(second).not.toHaveAttribute('controls');
    fireEvent.click(
      screen.getByRole('button', { name: 'Show Second demo (2 of 2)' }),
    );
    expect(pause.mock.instances).toContain(first);
    expect(first).not.toHaveAttribute('controls');
    expect(second).toHaveAttribute('controls');
    expect(screen.getByRole('heading', { name: 'Second demo' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Show Second demo (2 of 2)' }),
    ).toHaveAttribute('aria-current', 'true');
  });

  it('supports preview selection, keyboard arrows, and pointer swipes', () => {
    const { container } = render(
      <VideoGallery
        label="Robot demos"
        videos={[
          video,
          { ...video, src: '/videos/example/second.mp4', title: 'Second demo' },
          { ...video, src: '/videos/example/third.mp4', title: 'Third demo' },
        ]}
      />,
    );
    const preview = screen.getByRole('button', { name: 'Select Second demo' });
    fireEvent.pointerDown(preview, {
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      clientX: 300,
    });
    fireEvent.pointerUp(preview, {
      pointerId: 1,
      pointerType: 'mouse',
      clientX: 300,
    });
    fireEvent.click(preview);
    expect(screen.getByRole('heading', { name: 'Second demo' })).toBeVisible();

    const gallery = screen.getByRole('region', { name: 'Robot demos' });
    gallery.focus();
    fireEvent.keyDown(gallery, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { name: 'Third demo' })).toBeVisible();

    const viewport = container.querySelector('.video-gallery-viewport');
    expect(viewport).not.toBeNull();
    Object.defineProperty(viewport, 'clientWidth', {
      configurable: true,
      value: 800,
    });
    fireEvent.pointerDown(viewport!, {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 300,
    });
    fireEvent.pointerMove(viewport!, {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 160,
    });
    fireEvent.pointerUp(viewport!, {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 160,
    });
    expect(screen.getByRole('heading', { name: video.title })).toBeVisible();
  });

  it('pauses when the page is left', () => {
    const pause = vi.mocked(HTMLMediaElement.prototype.pause);
    render(<VideoPlayer video={video} />);
    fireEvent(window, new Event('pagehide'));
    expect(pause).toHaveBeenCalledOnce();
  });
});
