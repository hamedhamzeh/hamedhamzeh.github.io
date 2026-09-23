'use client';

import Markdown from 'markdown-to-jsx';
import Image from 'next/image';

import LightboxGallery from '@/components/Media/LightboxGallery';
import { createHeadingId } from '@/lib/anchors';
import type { PortfolioMedia } from '@/lib/portfolio-content';

interface DetailContentProps {
  content: string;
  media: PortfolioMedia;
}

export default function DetailContent({ content, media }: DetailContentProps) {
  if (!content) return null;

  const headingCounts = new Map<string, number>();
  const slugify = (value: string) => {
    const base = createHeadingId(value);
    const count = (headingCounts.get(base) ?? 0) + 1;
    headingCounts.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  };

  return (
    <div className="portfolio-detail-content prose">
      <Markdown
        options={{
          slugify,
          overrides: {
            ImageBlock: {
              component: ({ id }: { id: string }) => {
                const image = media.images?.[id];
                if (!image) return null;
                return (
                  <figure className="portfolio-detail-figure">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 800px) 100vw, 800px"
                      loading="lazy"
                    />
                    {image.caption && <figcaption>{image.caption}</figcaption>}
                  </figure>
                );
              },
            },
            Gallery: {
              component: ({ id }: { id: string }) => {
                const images = media.galleries?.[id];
                if (!images) return null;
                return (
                  <LightboxGallery
                    images={images}
                    triggerLabel={`${id} image gallery`}
                    dialogLabel={`${id} image gallery`}
                    display="grid"
                  />
                );
              },
            },
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
