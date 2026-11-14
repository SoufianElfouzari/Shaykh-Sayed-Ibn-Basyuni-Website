import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const budgets = { ".js": 750_000, ".css": 230_000 };
const directory = new URL("../dist/assets/", import.meta.url);
const totals = { ".js": 0, ".css": 0 };
for (const file of readdirSync(directory)) {
  for (const ext of Object.keys(budgets)) {
    if (file.endsWith(ext)) totals[ext] += statSync(join(directory.pathname, file)).size;
  }
}
for (const [ext, bytes] of Object.entries(totals)) {
  console.log(ext + " assets: " + bytes + " bytes; budget " + budgets[ext]);
  assert.ok(bytes <= budgets[ext], "Asset size budget exceeded for " + ext);
}
console.log("PASS: production JS/CSS size budgets");
