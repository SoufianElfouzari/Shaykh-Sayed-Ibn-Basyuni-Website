import { readdirSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import assert from "node:assert/strict";

const budgets = { ".js": 750_000, ".css": 230_000 };
const directory = new URL("../dist/assets/", import.meta.url);
const totals = { ".js": 0, ".css": 0 };
const gzipTotals = { ".js": 0, ".css": 0 };
for (const file of readdirSync(directory)) {
  for (const ext of Object.keys(budgets)) {
    if (file.endsWith(ext)) {
      const filePath = join(directory.pathname, file);
      totals[ext] += statSync(filePath).size;
      gzipTotals[ext] += gzipSync(readFileSync(filePath)).byteLength;
    }
  }
}
for (const [ext, bytes] of Object.entries(totals)) {
  console.log(ext + " assets: " + bytes + " bytes minified, " + gzipTotals[ext] + " bytes gzip; budget " + budgets[ext]);
  assert.ok(bytes <= budgets[ext], "Asset size budget exceeded for " + ext);
}
console.log("PASS: production JS/CSS size budgets");

const manifest = JSON.parse(readFileSync(new URL("../dist/.vite/manifest.json", import.meta.url), "utf8"));
const entry = manifest["index.html"];
if (!entry?.file) throw new Error("Cannot determine the initial entry script from Vite manifest");
const entryBuffer = readFileSync(new URL("../dist/" + entry.file, import.meta.url));
console.log("INITIAL ENTRY JS: " + entryBuffer.byteLength + " bytes minified, " +
  gzipSync(entryBuffer).byteLength + " bytes gzip (not total lazy assets)");
