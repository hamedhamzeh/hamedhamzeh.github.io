'use client';

import { useCallback, useState } from 'react';

import { publicAssetUrl } from '@/lib/public-assets';
import { PROJECT_IMAGE } from '@/lib/utils';

interface CardPosterProps {
  src: string;
  alt: string;
  prioritize?: boolean;
  draggable?: boolean;
}

export default function CardPoster({
  src,
  alt,
  prioritize = false,
  draggable,
}: CardPosterProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );
  const checkLoadedImage = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete) {
      setStatus(image.naturalWidth > 0 ? 'loaded' : 'error');
    }
  }, []);

  return (
    <div className="project-card-image card-poster" data-status={status}>
      {/* biome-ignore lint/performance/noImgElement: Card posters are static assets, and native events preserve their source across hydration. */}
      <img
        src={
          src.startsWith('/') && !src.startsWith('//')
            ? publicAssetUrl(src)
            : src
        }
        alt={alt}
        width={PROJECT_IMAGE.width}
        height={PROJECT_IMAGE.height}
        draggable={draggable}
        loading={prioritize ? 'eager' : 'lazy'}
        fetchPriority={prioritize ? 'high' : undefined}
        decoding="async"
        ref={checkLoadedImage}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
      {status === 'error' && (
        <span className="card-poster-fallback">Image unavailable</span>
      )}
    </div>
  );
}
