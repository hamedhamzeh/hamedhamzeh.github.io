import type { Metadata } from 'next';
import { Raleway, Source_Sans_3 } from 'next/font/google';

import { SiteSchema } from '@/components/Schema';
import GoogleAnalytics from '@/components/Template/GoogleAnalytics';
import Navigation from '@/components/Template/Navigation';
import ScrollToTop from '@/components/Template/ScrollToTop';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import {
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_IMAGE_DIMENSIONS,
  SITE_IMAGE_PATH,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/utils';
import './tailwind.css';

const sourceSans = Source_Sans_3({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

const raleway = Raleway({
  weight: ['400', '800'],
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${AUTHOR_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    AUTHOR_NAME,
    'computer vision',
    'robotics',
    'deep learning',
    'machine learning',
    'mlops',
    'sports analytics',
    'industrial monitoring',
  ],
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: '/images/favicon/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/images/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/images/favicon/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/`,
    siteName: AUTHOR_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_IMAGE_PATH,
        width: SITE_IMAGE_DIMENSIONS.width,
        height: SITE_IMAGE_DIMENSIONS.height,
        alt: AUTHOR_NAME,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${raleway.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply the theme before hydration, including full-document navigation. */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <SiteSchema />
      </head>
      <body>
        <ScrollToTop />
        <div className="site-wrapper">
          <Navigation />
          {children}
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
