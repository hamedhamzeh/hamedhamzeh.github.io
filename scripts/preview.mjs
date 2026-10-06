import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

// Preview the same static files GitHub Pages serves. Bind only to this computer.
const root = resolve('out');
const port = Number(process.env.PREVIEW_PORT ?? 4174);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    );
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const { size } = await stat(file);
    const headers = {
      'Content-Type': contentTypes[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Accept-Ranges': 'bytes',
    };
    const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]);
      const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      if (start > end || start >= size) {
        response.writeHead(416, { 'Content-Range': `bytes */${size}` }).end();
        return;
      }
      response.writeHead(206, {
        ...headers,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${size}`,
      });
      createReadStream(file, { start, end }).pipe(response);
    } else {
      response.writeHead(200, { ...headers, 'Content-Length': size });
      if (request.method === 'HEAD') response.end();
      else createReadStream(file).pipe(response);
    }
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Static preview: http://127.0.0.1:${port}`);
});
