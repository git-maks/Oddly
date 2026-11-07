import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createStaticServer } from '../scripts/serve.js';

test('static assets work under a GitHub Pages repository prefix', async (t) => {
  const server = createStaticServer('/a-repository/');
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); }));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const page = await fetch(`${origin}/a-repository/`);
  assert.equal(page.status, 200);
  const html = await page.text();
  const assetPaths = [...html.matchAll(/(?:src|href)="(\.\/[^\"]+)"/g)].map((match) => match[1]);
  assert.ok(assetPaths.length >= 3);
  for (const assetPath of assetPaths) {
    const asset = await fetch(new URL(assetPath, page.url));
    assert.equal(asset.status, 200, assetPath);
  }
  const module = await fetch(`${origin}/a-repository/src/app.js`);
  assert.match(module.headers.get('content-type'), /javascript/);
  for (const file of ['generator.js', 'words.js', 'storage.js']) assert.equal((await fetch(`${origin}/a-repository/src/${file}`)).status, 200);
  assert.equal((await fetch(`${origin}/a-repository/.git/config`)).status, 404);
  assert.equal((await fetch(`${origin}/a-repository/package.json`)).status, 404);
  assert.equal((await fetch(`${origin}/a-repository/%2e%2e%2fpackage.json`)).status, 404);
});
