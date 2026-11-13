import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

/* Keep the ordinary page budget tight. An interactive 3D hero is an optional,
   separately lazy-loaded chunk, so it receives its own explicit ceiling. */
const budgets = {
  initialJavaScript: 750_000,
  threeDimensionalChunk: 3_500_000,
  totalJavaScript: 4_300_000,
  css: 230_000,
};

const directory = new URL("../dist/assets/", import.meta.url);
const totals = {
  initialJavaScript: 0,
  threeDimensionalChunk: 0,
  totalJavaScript: 0,
  css: 0,
};
let hasThreeDimensionalChunk = false;

for (const file of readdirSync(directory)) {
  const bytes = statSync(join(directory.pathname, file)).size;

  if (file.endsWith(".css")) {
    totals.css += bytes;
    continue;
  }

  if (!file.endsWith(".js")) continue;

  totals.totalJavaScript += bytes;

  /* Vite names the dynamically imported entry after HangingLanternScene.
     This is not included in the initial route code or required for SEO/SSR. */
  if (file.startsWith("HangingLanternScene-")) {
    hasThreeDimensionalChunk = true;
    totals.threeDimensionalChunk += bytes;
  } else {
    totals.initialJavaScript += bytes;
  }
}

assert.ok(hasThreeDimensionalChunk, "The 3D effect must remain in its own deferred chunk");

for (const [name, bytes] of Object.entries(totals)) {
  console.log(name + ": " + bytes + " bytes; budget " + budgets[name]);
  assert.ok(bytes <= budgets[name], "Asset size budget exceeded for " + name);
}

console.log("PASS: base-site and deferred 3D/CSS budgets");
