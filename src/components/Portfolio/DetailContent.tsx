'use client';

import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import type { ComponentProps } from 'react';

import LightboxGallery from '@/components/Media/LightboxGallery';
import VideoGallery from '@/components/Media/VideoGallery';
import SectionNav from '@/components/Navigation/SectionNav';
import { createHeadingId, createUniqueHeadingIds } from '@/lib/anchors';
import type { PortfolioMedia } from '@/lib/portfolio-content';

interface DetailContentProps {
  content: string;
  media: PortfolioMedia;
  sectionNavLabel?: string;
}

function getSectionItems(content: string) {
  const headings: { level: number; title: string }[] = [];
  let fence: string | null = null;

  for (const line of content.split(/\r?\n/)) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) {
        fence = marker;
      } else if (marker[0] === fence[0] && marker.length >= fence.length) {
        fence = null;
      }
      continue;
    }
    if (fence) continue;

    const headingMatch = line.match(/^ {0,3}(#{1,6})[ \t]+(.+?)\s*$/);
    if (!headingMatch) continue;
    const title = headingMatch[2].replace(/[ \t]+#+[ \t]*$/, '').trim();
    if (title) headings.push({ level: headingMatch[1].length, title });
  }

  const ids = createUniqueHeadingIds(headings.map(({ title }) => title));
  return headings.flatMap((heading, index) =>
    heading.level === 2 ? [{ id: ids[index], name: heading.title }] : [],
  );
}

export default function DetailContent({
  content,
  media,
  sectionNavLabel = 'Page sections',
}: DetailContentProps) {
  if (!content) return null;

  const sectionItems = getSectionItems(content);
  const hasDenseSectionNav = sectionItems.length > 7;
  const headingCounts = new Map<string, number>();
  const slugify = (value: string) => {
    const base = createHeadingId(value);
    const count = (headingCounts.get(base) ?? 0) + 1;
    headingCounts.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  };

  return (
    <div
      className={[
        'portfolio-detail-content',
        hasDenseSectionNav && 'has-dense-section-nav',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {sectionItems.length > 0 && (
        <SectionNav
          items={sectionItems}
          ariaLabel={sectionNavLabel}
          initialActiveId={sectionItems[0].id}
        />
      )}
      <div className="portfolio-detail-prose prose">
        <Markdown
          options={{
            slugify,
            overrides: {
              h2: {
                component: ({
                  children,
                  className,
                  ...props
                }: ComponentProps<'h2'>) => (
                  <h2
                    {...props}
                    className={['section-title', className]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {children}
                  </h2>
                ),
              },
              ImageBlock: {
                component: ({
                  id,
                  display,
                }: {
                  id: string;
                  display?: string;
                }) => {
                  const image = media.images?.[id];
                  if (!image) return null;
                  if (display === 'card') {
                    return (
                      <LightboxGallery
                        images={[image]}
                        triggerLabel={`${id} image`}
                        dialogLabel={image.title ?? `${id} image`}
                        display="grid"
                        showThumbnailCaptions={false}
                      />
                    );
                  }
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
                      {image.caption && (
                        <figcaption>{image.caption}</figcaption>
                      )}
                    </figure>
                  );
                },
              },
              Gallery: {
                component: ({
                  id,
                  showCaptions,
                }: {
                  id: string;
                  showCaptions?: string;
                }) => {
                  const images = media.galleries?.[id];
                  if (!images) return null;
                  return (
                    <LightboxGallery
                      images={images}
                      triggerLabel={`${id} image gallery`}
                      dialogLabel={`${id} image gallery`}
                      display="grid"
                      showThumbnailCaptions={showCaptions !== 'false'}
                    />
                  );
                },
              },
              VideoGallery: {
                component: ({
                  id,
                  showTitle,
                }: {
                  id: string;
                  showTitle?: string;
                }) => {
                  const videos = media.videoGalleries?.[id];
                  if (!videos) return null;
                  return (
                    <VideoGallery
                      videos={videos}
                      label={`${id} videos`}
                      showTitle={showTitle !== 'false'}
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
    </div>
  );
}
