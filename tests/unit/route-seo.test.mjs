import test from "node:test";
import assert from "node:assert/strict";
import { routeMetadata, notFoundMetadata, getRouteMetadata } from "../../src/utils/routeSeo.js";
import { articleSeo } from "../../src/utils/articleSeo.js";

test("each indexable static route has unique, content-specific metadata", () => {
  const entries = Object.entries(routeMetadata);
  assert.equal(entries.length, 7);
  assert.equal(new Set(entries.map(([, meta]) => meta.title)).size, entries.length);
  assert.equal(new Set(entries.map(([, meta]) => meta.description)).size, entries.length);
  for (const [path, meta] of entries) {
    assert.equal(getRouteMetadata(path), meta);
    assert.ok(meta.title.length >= 30 && meta.title.length <= 70, path + ": title length");
    assert.ok(meta.description.length >= 100 && meta.description.length <= 170, path + ": description length");
    assert.doesNotMatch(meta.title, /Shaykh Sayed/i, path + ": repetitive name in title");
  }
  assert.match(routeMetadata["/"].description, /Islam lernen/i);
  assert.match(routeMetadata["/artikel"].description, /Fiqh|Hadith/);
  assert.match(routeMetadata["/durous"].description, /Unterrichte/i);
  assert.match(routeMetadata["/kontakt"].description, /Fatwa/i);
});

test("paginated article pages keep dedicated metadata and canonical semantics", () => {
  assert.equal(getRouteMetadata("/artikel", 1), routeMetadata["/artikel"]);
  assert.equal(getRouteMetadata("/artikel", 2).title, "Islamische Artikel lesen | Archiv Seite 2");
  assert.notEqual(getRouteMetadata("/artikel", 2).description, getRouteMetadata("/artikel", 3).description);
  assert.equal(getRouteMetadata("/unknown"), null);
  assert.match(notFoundMetadata.description, /nicht verfügbar/);
});

test("published article SEO never appends or preserves a templated site-name suffix", () => {
  assert.equal(articleSeo({ title: "Grundlagen des Hadith" }).title, "Grundlagen des Hadith");
  assert.equal(articleSeo({ title: "Grundlagen des Hadith", seoTitle: "Grundlagen des Hadith | Shaykh Sayed" }).title, "Grundlagen des Hadith");
  assert.equal(articleSeo({ title: "Grundlagen des Hadith", seoTitle: "Shaykh Sayed Ibn Basyuni | Grundlagen des Hadith" }).title, "Grundlagen des Hadith");
});
