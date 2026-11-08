import test from "node:test";
import assert from "node:assert/strict";
import { articleSeo, articleLanguage, conciseDescription } from "../../src/utils/articleSeo.js";
import { parseServerArticleContent } from "../../src/utils/serverArticleContent.js";
import { createSectionId } from "../../src/utils/articleSections.js";
import { queryFixture } from "../fixtures/data.mjs";

test("article metadata preserves the real headline and publication date", () => {
  const metadata = articleSeo({
    slug: "example", title: "Ein wissenschaftlicher Artikel",
    excerpt: "Kurzer Auszug", status: "published",
    author: "Shaykh Sayed Ibn Basyuni", publishedAt: null,
  });
  assert.equal(metadata.headline, "Ein wissenschaftlicher Artikel");
  assert.equal(metadata.publishedAt, null);
  assert.equal(metadata.author.name, "Shaykh Sayed Ibn Basyuni");
});

test("language and description metadata", () => {
  assert.equal(articleLanguage("Deutsch"), "de");
  assert.equal(articleLanguage("Arabisch"), "ar");
  assert.ok(conciseDescription("Ein Beitrag zur Rechtslehre.").length > 0);
});

test("rich article HTML is sanitized on the server", () => {
  const html = '<h2>Wasser und Reinheit</h2><p onclick="alert(1)">Text</p><script>alert(2)</script><a href="javascript:alert(3)">Link</a>';
  const sections = parseServerArticleContent(html, createSectionId);
  const result = JSON.stringify(sections);
  assert.ok(result.includes("Wasser und Reinheit"));
  assert.doesNotMatch(result, /<script|onclick|javascript:|alert\(/i);
});

test("metadata query hides draft content", () => {
  const result = queryFixture(
    "https://hwksfmccecfsxbxjlizm.supabase.co/rest/v1/articles?status=eq.published&select=slug,title",
  );
  assert.equal(result.body.length, 2);
  assert.ok(result.body.every((row) => !Object.hasOwn(row, "contentHtml")));
  assert.ok(result.body.every((row) => row.slug !== "geheimer-entwurf"));
});


test("nested scholarly headings retain their actual levels and unique IDs", () => {
  const content = parseServerArticleContent(
    "<h2>Hauptthema</h2><p>Text</p><h3>Unterthema</h3><p>Weitere Erklärung</p><h4>Detail</h4><h2>Hauptthema</h2>",
    createSectionId,
  );
  assert.deepEqual(content.sections.map((section) => section.level), [2, 3, 4, 2]);
  assert.deepEqual(content.sections.map((section) => section.id),
    ["hauptthema", "unterthema", "detail", "hauptthema-2"]);
  assert.ok(content.sections[1].html.includes("Weitere Erklärung"));
});
