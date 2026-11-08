import test, { after } from "node:test";
import assert from "node:assert/strict";
import { createServer as createViteServer } from "vite";
import handler from "../../api/render.js";
import sitemapHandler from "../../api/sitemap.js";
import { rows } from "../fixtures/data.mjs";

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
after(async () => { await vite.close(); });

const {
  getPublishedArticles,
  getPublishedArticleSummaries,
  getPublishedArticleBySlug,
  getPublishedArticleIndex,
  getRelatedPublishedArticles,
} = await vite.ssrLoadModule("/src/supabase/articleService.js");
const { getPublishedDuruus } = await vite.ssrLoadModule("/src/supabase/duruusService.js");
const { getActivePublishedNotices } = await vite.ssrLoadModule("/src/supabase/noticesService.js");

function testResponse() {
  return {
    code: 200,
    headers: {},
    setHeader(key, value) { this.headers[key.toLowerCase()] = value; return this; },
    status(value) { this.code = value; return this; },
    send(value) { this.body = String(value); return this; },
    end(value = "") { this.body = String(value); return this; },
  };
}

test("published-only article listings and lightweight homepage payload", async () => {
  const full = await getPublishedArticles();
  const summaries = await getPublishedArticleSummaries();
  assert.equal(full.length, 2);
  assert.equal(summaries.length, 2);
  assert.ok(full.every((article) => article.status === "published" && article.contentHtml));
  assert.ok(summaries.every((article) => !article.contentHtml && !article.contentText));
  assert.ok(summaries.every((article) => article.readingTime === null));
});

test("individual drafts cannot be loaded via the public service", async () => {
  assert.equal(await getPublishedArticleBySlug("geheimer-entwurf"), null);
  assert.equal(await getPublishedArticleBySlug(""), null);
  assert.equal((await getPublishedArticleBySlug("fiqh-grundlagen")).slug, "fiqh-grundlagen");
});

test("related items and sitemap index contain no unpublished entries", async () => {
  const current = await getPublishedArticleBySlug("fiqh-grundlagen");
  const related = await getRelatedPublishedArticles(current);
  assert.ok(related.some((item) => item.slug === "tahara-reinigung"));
  assert.ok(related.every((item) => item.slug !== "geheimer-entwurf"));
  const index = await getPublishedArticleIndex();
  assert.equal(index.length, 2);
  assert.ok(index.every((item) => item.slug !== "geheimer-entwurf"));
});

test("only published Durous and notices reach public services", async () => {
  const duruus = await getPublishedDuruus();
  const notices = await getActivePublishedNotices();
  assert.equal(duruus.length, 1);
  assert.equal(notices.length, 1);
  assert.equal(duruus[0].title, "Fiqh Unterricht 1");
});

test("SSR and sitemap return no private drafts", async () => {
  const detail = testResponse();
  await handler({ method: "GET", query: { path: "/artikel/geheimer-entwurf" } }, detail);
  assert.equal(detail.code, 404);
  assert.ok(detail.body.includes("noindex"));
  const sitemap = testResponse();
  await sitemapHandler({ method: "GET", query: { path: "/sitemap.xml" } }, sitemap);
  assert.equal(sitemap.code, 200);
  assert.ok(sitemap.body.includes("/artikel/fiqh-grundlagen"));
  assert.ok(!sitemap.body.includes("geheimer-entwurf"));
});


test("archive pagination serves all published pages, valid canonicals and real 404 statuses", async () => {
  const extra = Array.from({ length: 13 }, (_, index) => ({
    ...rows.articles[1],
    id: "fixture-paginated-" + index,
    slug: "veroeffentlichter-testartikel-" + index,
    title: "Veröffentlichter Testartikel " + index,
    publishedAt: "2026-10-11T08:00:00Z",
  }));
  rows.articles.push(...extra);

  try {
    const first = testResponse();
    await handler({ method: "GET", query: { path: "/artikel" } }, first);
    assert.equal(first.code, 200);
    assert.ok(first.body.includes('href="/artikel?page=2"'),
      "page one must link to page two without JavaScript");
    const firstData = JSON.parse(first.body.match(/<script>window\.__SSR_DATA__=([\s\S]*?);<\/script>/)[1]);
    assert.equal(firstData.articles.length, 12);
    assert.equal(firstData.pagination.totalCount, 15);
    assert.ok(firstData.articles.every((entry) => !entry.contentHtml),
      "article bodies must not be sent in list HTML");

    const second = testResponse();
    await handler({ method: "GET", query: { path: "/artikel", page: "2" } }, second);
    assert.equal(second.code, 200);
    assert.ok(second.body.includes('rel="canonical" href="https://www.shaykh-sayed.de/artikel?page=2"'));
    assert.ok(second.body.includes('href="/artikel"'), "page two must link to page one");
    assert.ok(!second.body.includes("geheimer-entwurf"), "drafts must not appear");

    const notFound = testResponse();
    await handler({ method: "GET", query: { path: "/artikel", page: "99" } }, notFound);
    assert.equal(notFound.code, 404);
    assert.ok(notFound.body.includes('name="robots" content="noindex'));
    assert.ok(!notFound.body.includes('rel="canonical"'));

    const malformed = testResponse();
    await handler({ method: "GET", query: { path: "/artikel", page: "0" } }, malformed);
    assert.equal(malformed.code, 404);
  } finally {
    rows.articles.splice(-extra.length);
  }
});
