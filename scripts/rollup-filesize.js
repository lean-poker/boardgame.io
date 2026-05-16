/*
 * Copyright 2026 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { brotliCompressSync, gzipSync } from 'node:zlib';

const fmt = (bytes) =>
  bytes >= 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${bytes} B`;

export default function filesize() {
  const rawSizes = new Map();

  return {
    name: 'filesize',

    renderChunk(code, chunk) {
      rawSizes.set(chunk.fileName, Buffer.byteLength(code, 'utf8'));
      return null;
    },

    generateBundle(_, bundle) {
      const entries = Object.entries(bundle).filter(
        ([, item]) => item.type === 'chunk',
      );

      entries.forEach(([fileName, item], index) => {
        const raw =
          rawSizes.get(fileName) ?? Buffer.byteLength(item.code, 'utf8');
        const minified = Buffer.byteLength(item.code, 'utf8');
        const gzipped = gzipSync(item.code).length;
        const brotli = brotliCompressSync(item.code).length;

        if (index > 0) console.log('');
        console.log(`Destination: ${fileName}`);
        console.log(`Bundle Size: ${fmt(raw)}`);
        console.log(`Minified Size: ${fmt(minified)}`);
        console.log(`Gzipped Size: ${fmt(gzipped)}`);
        console.log(`Brotli size: ${fmt(brotli)}`);
      });
    },
  };
}
