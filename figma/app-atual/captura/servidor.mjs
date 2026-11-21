// Servidor estático temporário para a exportação web do app (só para tirar os prints).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const root = process.argv[2] || join(import.meta.dirname, 'app-web');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.map': 'application/json' };
const dynamic = [[/^\/service\/[^/]+$/, '/service/[id].html'], [/^\/oauth\/[^/]+$/, '/oauth/[provider].html']];

async function exists(p) { try { return (await stat(p)).isFile(); } catch { return false; } }

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const candidates = [path, path + '.html', join(path, 'index.html')];
  for (const [re, file] of dynamic) if (re.test(path)) candidates.push(file);
  candidates.push('/+not-found.html', '/index.html');
  for (const c of candidates) {
    const file = join(root, c);
    if (file.startsWith(root) && (await exists(file))) {
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
      res.end(await readFile(file));
      return;
    }
  }
  res.writeHead(404).end();
}).listen(8090, () => console.log('ok http://localhost:8090'));
