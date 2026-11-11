import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "../..");

test("Apple touch icon is declared in static and SSR HTML and points to a valid PNG", () => {
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const renderer = readFileSync(resolve(root, "api/render.js"), "utf8");
  const link = html.match(/<link\b(?=[^>]*\brel=["']apple-touch-icon["'])[^>]*>/i);
  assert.ok(link, "Missing Apple touch icon link in HTML head");
  const href = link[0].match(/\bhref=["']([^"']+)["']/i)?.[1];
  assert.ok(href?.startsWith("/"), "Apple touch icon must use an absolute site path");
  assert.ok(renderer.includes('rel="apple-touch-icon"'), "Production SSR must declare the Apple touch icon");
  assert.ok(renderer.includes(href), "Static and production SSR should use the same icon");
  const iconPath = resolve(root, "public", href.slice(1));
  assert.ok(statSync(iconPath).isFile(), "Apple touch icon must exist in public");
  const image = readFileSync(iconPath);
  assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  const width = image.readUInt32BE(16);
  const height = image.readUInt32BE(20);
  assert.ok(width >= 180 && height >= 180, "Apple touch icon must be at least 180x180 pixels");
  assert.equal(width, height, "Apple touch icon must be square");
});
