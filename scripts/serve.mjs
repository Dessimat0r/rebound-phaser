import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT ?? 8080);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let requestedPath = decodeURIComponent(url.pathname);
    if (requestedPath.endsWith('/')) {
      requestedPath += 'index.html';
    }

    const filePath = path.join(ROOT, requestedPath);

    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      if (!req.url.endsWith('/')) {
        req.url = `${req.url}/`;
        server.emit('request', req, res);
        return;
      }
      res.writeHead(404).end('Not Found');
    } else {
      console.error(error);
      res.writeHead(500).end('Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Rebound Phaser dev server running at http://localhost:${PORT}`);
});
