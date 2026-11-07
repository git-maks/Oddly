import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles } from './build.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };

export function createStaticServer(base = '/') {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) throw new Error('Base must look like / or /repo-name/.');
  return http.createServer(async (req, res) => {
    try {
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
      const pathname = new URL(req.url, 'http://localhost').pathname;
      if (base !== '/' && (pathname === '/' || pathname === base.slice(0, -1))) {
        res.writeHead(302, { Location: base }); res.end(); return;
      }
      if (!pathname.startsWith(base)) { res.writeHead(404); res.end('Not found'); return; }
      const file = decodeURIComponent(pathname.slice(base.length)) || 'index.html';
      if (!publicFiles.includes(file)) { res.writeHead(404); res.end('Not found'); return; }
      const body = await readFile(path.join(root, file));
      res.writeHead(200, {
        'Content-Type': types[path.extname(file)] || 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(400); res.end('Bad request'); }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const base = process.argv.find((arg) => arg.startsWith('--base='))?.slice(7) || '/';
  const port = Number(process.env.PORT || 4173);
  const server = createStaticServer(base);
  server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Oddly is ready: http://127.0.0.1:${port}${base}`));
}
