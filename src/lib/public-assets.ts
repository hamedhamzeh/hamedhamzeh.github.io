/** Public assets need an explicit prefix; Next.js only prefixes route links. */
export function publicAssetUrl(pathname: string): string {
  if (!pathname.startsWith('/') || pathname.startsWith('//')) {
    throw new Error('Public asset paths must start with a single slash');
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/+$/, '') ?? '';
  const encodedPath = pathname
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${basePath}${encodedPath}`;
}
