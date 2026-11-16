import type { Metadata } from 'next';

import {
  AUTHOR_NAME,
  SITE_IMAGE_DIMENSIONS,
  SITE_IMAGE_PATH,
  SITE_URL,
} from './utils';

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: `/${string}`;
  absoluteTitle?: boolean;
  image?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image = {
    url: SITE_IMAGE_PATH,
    width: SITE_IMAGE_DIMENSIONS.width,
    height: SITE_IMAGE_DIMENSIONS.height,
    alt: AUTHOR_NAME,
  },
}: PageMetadataOptions): Metadata {
  const absoluteUrl = path ? new URL(path, SITE_URL).toString() : undefined;
  const pageTitle = absoluteTitle ? title : `${title} | ${AUTHOR_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(absoluteUrl ? { alternates: { canonical: absoluteUrl } } : {}),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: AUTHOR_NAME,
      title: pageTitle,
      description,
      ...(absoluteUrl ? { url: absoluteUrl } : {}),
      images: [image],
    },
  };
}
