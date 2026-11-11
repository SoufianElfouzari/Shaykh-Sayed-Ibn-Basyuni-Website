import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');

test('Apple touch icon is declared and points to a valid PNG', () => {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const link = html.match(/<link\\b(?=[^>]*\\brel=["']apple-touch-icon["'])[^>]*>/i);
  assert.ok(link, 'Missing Apple touch icon link in HTML head');
  const href = link[0].match(/\\bhref=["']([^"']+)["']/i)?.[1];
  assert.ok(href?.startsWith('/'), 'Apple touch icon must use an absolute site path');
  const iconPath = resolve(root, 'public', href.slice(1));
  assert.ok(statSync(iconPath).isFile(), 'Apple touch icon must exist in public');
  const image = readFileSync(iconPath);
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'Apple touch icon must be PNG');
  const width = image.readUInt32BE(16);
  const height = image.readUInt32BE(20);
  assert.ok(width >= 180 && height >= 180, 'Apple touch icon must be at least 180x180 pixels');
  assert.equal(width, height, 'Apple touch icon must be square');
});
