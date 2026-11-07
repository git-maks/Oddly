import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const publicFiles = Object.freeze([
  'index.html', 'styles.css', 'assets/favicon.svg',
  'src/app.js', 'src/generator.js', 'src/words.js', 'src/storage.js', '.nojekyll',
]);

const root = fileURLToPath(new URL('../', import.meta.url));

export async function build() {
  for (const file of publicFiles) {
    const target = path.join(root, 'dist', file);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(path.join(root, file), target);
  }
  console.log(`Built ${publicFiles.length} static files into dist/. No dependencies needed.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
