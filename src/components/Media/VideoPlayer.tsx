'use client';

import { type CSSProperties, useEffect, useId, useRef, useState } from 'react';

import { publicAssetUrl } from '@/lib/public-assets';
import type { VideoData } from '@/types/media';

interface VideoPlayerProps {
  video: VideoData;
  active?: boolean;
}

type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'error';

export default function VideoPlayer({
  video,
  active = true,
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const width = video.width ?? 1920;
  const height = video.height ?? 1080;
  const src = publicAssetUrl(video.src);
  const frameStyle = {
    '--video-aspect-ratio': `${width} / ${height}`,
  } as CSSProperties;

  useEffect(() => {
    const player = playerRef.current;
    const pauseIfLeaving = () => {
      if (document.visibilityState === 'hidden') player?.pause();
    };
    const pauseOnPageHide = () => player?.pause();

    document.addEventListener('visibilitychange', pauseIfLeaving);
    window.addEventListener('pagehide', pauseOnPageHide);
    return () => {
      document.removeEventListener('visibilitychange', pauseIfLeaving);
      window.removeEventListener('pagehide', pauseOnPageHide);
      player?.pause();
    };
  }, []);

  useEffect(() => {
    if (!active && !playerRef.current?.paused) playerRef.current?.pause();
  }, [active]);

  const startPlayback = () => {
    const player = playerRef.current;
    if (!player) return;
    setStatus('loading');
    try {
      const attempt = player.play();
      void attempt?.catch(() => setStatus('error'));
    } catch {
      setStatus('error');
    }
  };

  const handlePlay = () => {
    if (!active) {
      playerRef.current?.pause();
      return;
    }
    document.querySelectorAll('video').forEach((other) => {
      if (other !== playerRef.current && !other.paused) other.pause();
    });
    setStatus('loading');
  };

  return (
    <figure className="video-player">
      <div className="video-player-frame" style={frameStyle}>
        <video
          ref={playerRef}
          controls={active}
          tabIndex={active ? 0 : -1}
          preload="none"
          playsInline
          poster={publicAssetUrl(video.poster)}
          width={width}
          height={height}
          aria-labelledby={titleId}
          aria-describedby={video.description ? descriptionId : undefined}
          onPlay={handlePlay}
          onPlaying={() => setStatus('playing')}
          onWaiting={() => setStatus('loading')}
          onPause={() =>
            setStatus((current) => (current === 'error' ? current : 'idle'))
          }
          onEnded={() => setStatus('idle')}
          onError={() => setStatus('error')}
        >
          <source src={src} type="video/mp4" />
          {video.captions?.map((caption) => (
            <track
              key={`${caption.language}-${caption.src}`}
              src={publicAssetUrl(caption.src)}
              kind="captions"
              srcLang={caption.language}
              label={caption.label}
              default={caption.default}
            />
          ))}
          <p>
            Your browser cannot play this video. <a href={src}>Open the MP4</a>.
          </p>
        </video>
        {active && status === 'idle' && (
          <button
            className="video-player-play"
            type="button"
            onClick={startPlayback}
            aria-label={`Play ${video.title}`}
          >
            <span aria-hidden="true">▶</span> Play
          </button>
        )}
        {active && status === 'loading' && (
          <span className="video-player-loading" role="status">
            Loading video…
          </span>
        )}
        {active && status === 'error' && (
          <div className="video-player-error" role="alert">
            <span>This video could not be played.</span>
            <a href={src}>Open the MP4 file</a>
          </div>
        )}
      </div>
      <figcaption className="video-player-caption">
        <span className="video-player-visually-hidden" id={titleId}>
          {video.title}
        </span>
        {video.description && (
          <span className="video-player-visually-hidden" id={descriptionId}>
            {video.description}
          </span>
        )}
        {video.transcript && (
          <details className="video-player-transcript">
            <summary>Read transcript</summary>
            <p>{video.transcript}</p>
          </details>
        )}
      </figcaption>
    </figure>
  );
}
