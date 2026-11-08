import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import handler from "../api/render.js";
import sitemapHandler from "../api/sitemap.js";
import { parseServerArticleContent } from "../src/utils/serverArticleContent.js";
import { articleSeo, conciseDescription, articleLanguage, SITE_ORIGIN } from "../src/utils/articleSeo.js";
import { createSectionId } from "../src/utils/articleSections.js";

async function request(path, pageHandler = handler, method = "GET") {
  const response = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = String(body);
      return this;
    },
    end(body = "") {
      this.body = String(body);
      return this;
    },
  };

  await pageHandler({ method, query: { path } }, response);
  return response;
}

const htmlTemplate = readFileSync(new URL("../index.html", import.meta.url), "utf8");
for (const obsolete of [
  "X-UA-Compatible", "name=\"creator\"", "name=\"publisher\"",
  "name=\"subject\"", "name=\"classification\"", "name=\"category\"",
  "name=\"rating\"", "name=\"distribution\"", "name=\"coverage\"",
  "name=\"googlebot\"", "name=\"bingbot\"",
  "name=\"msapplication-TileColor\"", "name=\"mobile-web-app-capable\"",
  "name=\"apple-mobile-web-app-capable\"",
  "name=\"apple-mobile-web-app-status-bar-style\"",
]) {
  assert.ok(!htmlTemplate.includes(obsolete), "obsolete metadata remains: " + obsolete);
}
assert.ok(htmlTemplate.includes('name="robots"'), "HTML fallback needs general robots metadata");
assert.ok(htmlTemplate.includes('name="description"'), "HTML fallback needs a description");
assert.ok(htmlTemplate.includes('name="twitter:card"'), "HTML fallback needs Twitter metadata");
console.log("PASS: obsolete and duplicate meta tags removed from HTML fallback");

const pages = [
  ["/", "Islam lernen auf Deutsch"],
  ["/shaykh", "Shaykh Sayed Ibn Basyuni | Biografie und Werdegang"],
  ["/durous", "Islamische Unterrichte und Durous"],
  ["/artikel", "Islamische Artikel auf Deutsch"],
  ["/kontakt", "Kontakt"],
  ["/impressum", "Impressum"],
];

for (const [path, title] of pages) {
  const response = await request(path);
  assert.equal(response.statusCode, 200, path);
  assert.match(response.body, /<h1\b/i, path + ": missing server-rendered H1");
  assert.equal(
    (response.body.match(/<h1\b/gi) || []).length,
    1,
    path + ": expected exactly one main H1; shared sections should use H2",
  );
  assert.ok(response.body.includes("<title>" + title), path + ": wrong title");
  assert.ok(response.body.includes('<html lang="de" dir="ltr">'), path + ": default language must be German");
  assert.ok(!/rel="alternate"[^>]*hreflang=/i.test(response.body), path + ": do not emit single-language hreflang");
  assert.ok(response.body.includes('rel="canonical" href="https://www.shaykh-sayed.de' + path + '"'), path + ": wrong canonical");
  assert.ok(response.body.includes('/assets/index-'), path + ": missing client assets");
  assert.match(response.body, /<script\b[^>]*src="\/assets\/[^"]+\.js"[^>]*><\/script>/i,
    path + ": client bundle script must be properly closed for hydration");
  assert.match(response.body, /<link\b[^>]*href="\/assets\/[^"]+\.css"[^>]*>/i,
    path + ": SSR page must include its CSS asset");
  assert.ok(response.body.includes('id="root"'), path + ": missing React root");
  assert.ok(response.body.includes('property="og:url" content="https://www.shaykh-sayed.de' + path + '"'), path + ": wrong Open Graph URL");
  assert.ok(response.body.includes('property="og:image:alt" content="Shaykh Sayed Ibn Basyuni - offizielles Logo"'), path + ": missing fallback logo alt");
  assert.ok(response.body.includes('name="twitter:image:alt" content="Shaykh Sayed Ibn Basyuni - offizielles Logo"'), path + ": missing Twitter image alt");
  assert.ok(response.body.includes('name="twitter:card" content="summary"'), path + ": square logo should use summary card");
  assert.ok(response.body.includes('property="og:image:type" content="image/png"'), path + ": missing fallback image type");

  if (path === "/") {
    const dataMatch = response.body.match(/<script>window\.__SSR_DATA__=([\s\S]*?);<\/script>/);
    assert.ok(dataMatch, "home: SSR preload data missing");
    const preload = JSON.parse(dataMatch[1]);
    assert.equal(preload.__ssrPath, "/", "home: SSR route identifier missing");
    assert.ok(Array.isArray(preload.articles), "home: article summaries missing");
    assert.ok(preload.articles.every((item) => !item.contentHtml && !item.contentText),
      "home: full article bodies must not be serialized to the client");

    assert.ok(
      response.body.includes('name="description" content="Islam lernen auf Deutsch:'),
      "home: missing keyword in SSR description",
    );
    assert.ok(
      response.body.includes('mit Quran und Sunnah.'),
      "home: missing learning focus in server-rendered hero",
    );
    assert.ok(
      response.body.includes('über islamische Wissenschaften, Quran und Sunnah'),
      "home: H1 topic terms must appear naturally in the paragraph",
    );
    assert.ok(
      response.body.includes('property="og:title" content="Islam lernen auf Deutsch'),
      "home: Open Graph title does not match",
    );
  }
  if (path === "/artikel") {
    const dataMatch = response.body.match(/<script>window\.__SSR_DATA__=([\s\S]*?);<\/script>/);
    assert.ok(dataMatch, "archive: SSR preload missing");
    const archivePreload = JSON.parse(dataMatch[1]);
    assert.equal(archivePreload.__ssrPath, "/artikel", "archive: SSR route mismatch");
    assert.ok(archivePreload.articles.every((item) => !item.contentHtml && !item.contentText),
      "archive: full article bodies must not be in the SSR payload");
    assert.equal(archivePreload.archivePagination.page, 1);
    assert.equal(archivePreload.archivePagination.total, 2);
  }
  if (path === "/shaykh") {
    assert.ok(
      response.body.includes('name="description" content="Biografie von Dr. Shaykh Sayed Ibn Basyuni:'),
      "shaykh: missing biography-specific SSR description",
    );
    assert.ok(
      response.body.includes('property="og:title" content="Shaykh Sayed Ibn Basyuni | Biografie und Werdegang"'),
      "shaykh: wrong social title",
    );
    assert.ok(
      response.body.includes('seine islamischen'),
      "shaykh: missing topic introduction in SSR body",
    );
    const schemaMatch = response.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(schemaMatch, "shaykh: structured data missing");
    const schema = JSON.parse(schemaMatch[1]);
    const person = schema["@graph"].find((item) => item["@type"] === "Person");
    const page = schema["@graph"].find((item) => item["@type"] === "WebPage");
    assert.equal(person?.alumniOf?.name, "Al-Azhar-Universität", "shaykh: education missing in schema");
    assert.equal(page?.mainEntity?.["@id"], "https://www.shaykh-sayed.de/#person", "shaykh: wrong main entity");
  }
  if (path === "/durous") {
    assert.ok(
      response.body.includes('name="description" content="Islamische Unterrichte von Shaykh Sayed'),
      "durous: incorrect SEO description",
    );
    assert.ok(
      response.body.includes('property="og:title" content="Islamische Unterrichte und Durous'),
      "durous: missing social title",
    );
    assert.ok(
      response.body.includes('Islamische Unterrichte'),
      "durous: missing learning keyword in the rendered page",
    );
    assert.ok(
      response.body.includes('href="/artikel"'),
      "durous: no contextual link to existing articles",
    );
    assert.ok(
      response.body.includes('href="/shaykh"'),
      "durous: no contextual link to existing Shaykh page",
    );

    const schedule = JSON.parse(
      readFileSync(new URL("../public/data/durus-schedule.json", import.meta.url), "utf8"),
    );
    for (const lesson of schedule.lessons.filter((item) => item.enabled !== false)) {
      assert.ok(response.body.includes(lesson.subject), "durous: missing scheduled subject " + lesson.subject);
      assert.ok(response.body.includes(lesson.time), "durous: wrong schedule time " + lesson.time);
    }

    const schemaMatch = response.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(schemaMatch, "durous: structured data missing");
    const schema = JSON.parse(schemaMatch[1]);
    const page = schema["@graph"].find((item) => item["@type"] === "CollectionPage");
    assert.ok(page, "durous: CollectionPage schema missing");
    assert.equal(page.about?.["@id"], "https://www.shaykh-sayed.de/#person");
    const itemList = schema["@graph"].find((item) => item["@type"] === "ItemList");
    if (itemList) {
      assert.ok(itemList.numberOfItems > 0, "durous: empty ItemList must not be emitted");
      assert.ok(itemList.itemListElement.length > 0, "durous: missing published item entries");
      assert.equal(page.mainEntity?.["@id"], itemList["@id"], "durous: wrong collection link");
    } else {
      assert.equal(page.mainEntity, undefined, "durous: no empty recording collection should be referenced");
    }
  }
  if (path === "/artikel") {
    assert.ok(
      response.body.includes('name="description" content="Islamische Artikel auf Deutsch'),
      "artikel: missing index-specific description",
    );
    assert.ok(
      response.body.includes('property="og:title" content="Islamische Artikel auf Deutsch'),
      "artikel: missing social metadata",
    );
    assert.ok(response.body.includes("Islamische Artikel"), "artikel: missing article-related H1");
    assert.ok(response.body.includes("auf Deutsch lesen."), "artikel: missing keyword in H1");

    const structuredDataMatch = response.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(structuredDataMatch, "artikel: structured data missing");
    const graph = JSON.parse(structuredDataMatch[1])["@graph"];
    const collection = graph.find((item) => item["@type"] === "CollectionPage");
    assert.ok(collection, "artikel: CollectionPage schema missing");
    const breadcrumbs = graph.find((item) => item["@type"] === "BreadcrumbList");
    assert.equal(breadcrumbs?.itemListElement?.length, 2, "artikel: wrong breadcrumb navigation");

    const initialDataMatch = response.body.match(/<script>window.__SSR_DATA__=([\s\S]*?);<\/script>/);
    assert.ok(initialDataMatch, "artikel: missing SSR data");
    const publishedArticles = JSON.parse(initialDataMatch[1]).articles || [];
    const publishedItemList = graph.find((item) => item["@type"] === "ItemList");

    if (publishedArticles.length > 0) {
      assert.ok(publishedItemList, "artikel: missing list of published article links");
      assert.equal(publishedItemList.numberOfItems, Math.min(12, publishedArticles.length));
      assert.ok(
        response.body.includes('href="/artikel/'),
        "artikel: published article links missing in server-rendered HTML",
      );
    } else {
      assert.equal(publishedItemList, undefined, "artikel: must not expose an empty ItemList");
    }

    assert.match(
      response.body,
      /class="sib-articles-overview-description"[\s\S]*?href="\/durous"/,
      "artikel: no contextual link to Durous",
    );
  }
  console.log("PASS:", path, "(200, correct metadata and SSR body)");
}

for (const path of ["/unknown-route", "/artikel/unknown-article-for-test"]) {
  const response = await request(path);
  assert.equal(response.statusCode, 404, path);
  assert.ok(response.body.includes('name="robots" content="noindex'), path + ": missing noindex");
  assert.ok(!response.body.includes('rel="canonical"'), path + ": 404 should not have canonical");
  assert.match(response.body, /<h1\b/i, path + ": missing not-found H1");
  console.log("PASS:", path, "(404, noindex and SSR body)");
}

const serverContent = parseServerArticleContent(
  '<h2>Einleitung</h2><p>Wissen &amp; Lernen.</p>' +
  '<h2>Grundlagen</h2><p>Ein <strong>zweiter</strong> Absatz.</p>' +
  '<img src="x" onerror="alert(1)"><script>alert(1)</script>',
  (title, index) => "abschnitt-" + (index + 1),
);
assert.deepEqual(serverContent.sections.map((section) => section.title), ["Einleitung", "Grundlagen"]);
assert.ok(serverContent.sections[0].html.includes("<p>Wissen &amp; Lernen.</p>"));
assert.ok(serverContent.sections[1].html.includes("<p>Ein <strong>zweiter</strong> Absatz.</p>"));
assert.ok(!JSON.stringify(serverContent).includes("onerror"), "SSR article parser must remove unsafe attributes");
assert.ok(!JSON.stringify(serverContent).includes("alert(1)"), "SSR article parser must remove scripts");
const richContent = parseServerArticleContent(
  '<h2>Belege</h2><p>Siehe <a href="https://example.org/quelle" target="_blank">Quelle 1</a>.</p>' +
  '<p><a href="javascript:alert(1)" onclick="alert(1)">Unsicherer Link</a></p>' +
  '<blockquote>Eine belegte Aussage.</blockquote>' +
  '<table><tr><td>Begriff</td><td>Bedeutung</td></tr></table>',
  createSectionId,
);
assert.ok(richContent.sections[0].html.includes('href="https://example.org/quelle"'),
  "SSR article parser removes genuine reference links");
assert.ok(richContent.sections[0].html.includes("<blockquote>Eine belegte Aussage.</blockquote>"),
  "SSR article parser removes actual quotations");
assert.ok(richContent.sections[0].html.includes("<table>"),
  "SSR article parser removes source tables");
assert.ok(!richContent.sections[0].html.includes("javascript:"),
  "SSR article parser must remove unsafe URLs");
assert.ok(!richContent.sections[0].html.includes("onclick="),
  "SSR article parser must remove event handler attributes");

const exampleSeo = articleSeo({
  title: "Was ist Fiqh?",
  excerpt: "Eine kurze Erklärung der Grundlagen &amp; Begriffe.",
  author: "Redaktion Shaykh Sayed",
  category: "Fiqh",
  tags: ["Fiqh", "Islamisches Wissen", "Fiqh"],
  language: "Deutsch",
  publishedAt: null,
  updatedAt: null,
  contentText: "Fiqh ist islamisches Wissen.",
});
assert.equal(exampleSeo.title, "Was ist Fiqh? | Shaykh Sayed");
assert.equal(exampleSeo.description, "Eine kurze Erklärung der Grundlagen & Begriffe.");
assert.equal(exampleSeo.author.type, "Organization", "editorial authors are not fake people");
assert.equal(exampleSeo.author.profileUrl, null, "editorial team has no invented personal profile");
assert.deepEqual(exampleSeo.tags, ["Fiqh", "Islamisches Wissen"]);
assert.equal(exampleSeo.publishedAt, null, "never invent publication timestamps");
assert.equal(exampleSeo.updatedAt, null, "never invent modified timestamps");
assert.equal(exampleSeo.image, null, "never claim a generic logo is the article image");
assert.equal(articleLanguage("Arabisch"), "ar");
assert.equal(articleLanguage("English"), "en");
assert.ok(conciseDescription("Test ".repeat(100)).length <= 165,
  "article description must be concise");
const scholarlyTitle = "Die Unterscheidung zwischen den verschiedenen Begriffen und ihrer wissenschaftlichen Anwendung in der islamischen Rechtsmethodik";
assert.equal(articleSeo({ title: scholarlyTitle }).headline, scholarlyTitle,
  "long scholarly article headlines must retain their actual meaning");
assert.equal(articleSeo({ author: "Dr. Shaykh Sayed Ibn Basyuni" }).author.profileUrl,
  SITE_ORIGIN + "/shaykh");
console.log("PASS: dynamic article SEO metadata, real authorship, source formatting and language");

console.log("PASS: article SSR preserves sections and escapes unsafe markup");

const sitemapResponse = await request("/sitemap.xml", sitemapHandler);
assert.equal(sitemapResponse.statusCode, 200, "dynamic sitemap: wrong status");
assert.match(sitemapResponse.headers["content-type"], /application\/xml/, "dynamic sitemap: wrong content type");
assert.match(sitemapResponse.body, /^<\?xml version="1\.0"/, "dynamic sitemap: invalid XML header");
assert.ok(
  sitemapResponse.body.includes("<loc>https://www.shaykh-sayed.de/artikel</loc>"),
  "dynamic sitemap: article overview missing",
);
assert.ok(
  !sitemapResponse.body.includes("https://shaykh-sayed.de/"),
  "dynamic sitemap: wrong canonical host",
);

const sitemapUrls = Array.from(sitemapResponse.body.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, "dynamic sitemap: duplicate URLs");

const articleIndexResponse = await request("/artikel");
const articleDataMatch = articleIndexResponse.body.match(/<script>window.__SSR_DATA__=([\s\S]*?);<\/script>/);
const articles = articleDataMatch ? JSON.parse(articleDataMatch[1]).articles || [] : [];

for (const article of articles) {
  assert.ok(
    sitemapResponse.body.includes("<loc>https://www.shaykh-sayed.de/artikel/" + encodeURIComponent(article.slug) + "</loc>"),
    "dynamic sitemap: published article missing: " + article.slug,
  );
}

if (articles.length > 0) {
  const first = articles[0];
  const response = await request("/artikel/" + encodeURIComponent(first.slug));
  assert.equal(response.statusCode, 200, "published article: not server rendered");
  const match = response.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, "published article: structured data missing");
  const graph = JSON.parse(match[1])["@graph"];
  const articleSchema = graph.find((item) => item["@type"] === "Article");
  assert.equal(articleSchema?.headline, first.title, "published article: incorrect headline schema");
  assert.ok(graph.some((item) => item["@type"] === "BreadcrumbList"), "published article: breadcrumb missing");
  assert.ok(response.body.includes('name="robots" content="index'), "published article: should be indexable");
  const detailDataMatch = response.body.match(/<script>window\.__SSR_DATA__=([\s\S]*?);<\/script>/);
  assert.ok(detailDataMatch, "published article: SSR detail data missing");
  const detailArticle = JSON.parse(detailDataMatch[1]).article;
  const seo = articleSeo(detailArticle);
  assert.equal(articleSchema.description, seo.description,
    "published article: description must match the editorial excerpt");
  assert.equal(articleSchema.inLanguage, seo.language,
    "published article: language must match the source");
  assert.ok(response.body.includes('<html lang="' + seo.language + '"'),
    "published article: HTML language must match article language");
  assert.ok(response.body.includes('property="og:locale" content="' +
    (seo.language === "ar" ? "ar_AR" : seo.language === "en" ? "en_US" : "de_DE") + '"'),
    "published article: Open Graph locale must match article language");
  assert.equal(articleSchema.wordCount, seo.wordCount,
    "published article: word count must reflect the article content");
  assert.equal(articleSchema.author.name, seo.author.name,
    "published article: author must match the source");
  assert.equal(articleSchema.url, SITE_ORIGIN + "/artikel/" + encodeURIComponent(first.slug));
  assert.equal(articleSchema.datePublished, seo.publishedAt || undefined,
    "published article: do not invent datePublished");
  assert.equal(articleSchema.image, seo.image || undefined,
    "published article: use only the actual cover image");
  const pageSchema = graph.find((entry) => entry["@type"] === "WebPage");
  assert.equal(pageSchema.mainEntity["@id"], articleSchema["@id"],
    "published article: page mainEntity must resolve to the article");
  assert.ok(response.body.includes('aria-label="Seitenpfad"'),
    "published article: visible breadcrumbs missing");
  assert.ok(response.body.includes('name="description" content="'),
    "published article: metadata description missing");
  assert.ok(response.body.includes('property="og:url" content="' + SITE_ORIGIN + '/artikel/' + encodeURIComponent(first.slug) + '"'),
    "published article: Open Graph URL must match canonical");
  assert.ok(response.body.includes('property="og:title" content="'),
    "published article: Open Graph title missing");
  assert.ok(response.body.includes('name="twitter:title" content="'),
    "published article: Twitter title missing");
  assert.ok(response.body.includes('property="og:image:alt" content="'),
    "published article: Open Graph image alternative text missing");
  assert.ok(response.body.includes('name="twitter:image:alt" content="'),
    "published article: Twitter image alternative text missing");
  assert.ok(response.body.includes('name="twitter:card" content="' + (seo.image ? "summary_large_image" : "summary") + '"'),
    "published article: Twitter card should match whether a real cover image exists");
  assert.ok(response.body.includes('property="og:type" content="article"'),
    "published article: missing Article Open Graph type");
  assert.ok(response.body.includes('<title>' + seo.title.replace(/&/g, "&amp;")),
    "published article: title not generated from article metadata");
  const sourceHeadings = (first.contentHtml.match(/<h[1-3]\b/gi) || []).length;
  if (sourceHeadings > 0) {
    const renderedHeadings = (response.body.match(/<h2\b/gi) || []).length;
    assert.ok(renderedHeadings >= sourceHeadings,
      "published article: authored section headings were flattened during SSR");
  }
  console.log("PASS: published article SSR metadata, schema, breadcrumbs and headings");
}

const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const sitemapRouteIndex = vercel.routes.findIndex((route) => route.dest === "/api/sitemap");
const filesystemRouteIndex = vercel.routes.findIndex((route) => route.handle === "filesystem");
assert.ok(sitemapRouteIndex >= 0 && sitemapRouteIndex < filesystemRouteIndex,
  "dynamic sitemap: route must override static fallback before filesystem");
assert.ok(vercel.functions["api/sitemap.js"], "dynamic sitemap: server bundle inclusion missing");
console.log("PASS: dynamic sitemap indexes published articles and has correct routing");

const robots = readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
assert.ok(robots.includes("Sitemap: https://www.shaykh-sayed.de/sitemap.xml"));
assert.ok(sitemap.includes("<loc>https://www.shaykh-sayed.de/durous</loc>"));
assert.ok(!sitemap.includes("https://shaykh-sayed.de/"), "sitemap: non-www host contradicts redirects and canonicals");
assert.ok(!sitemap.includes("/artikel/mondsichtung-ramadan"), "sitemap: unpublished article still indexed");
assert.ok(!sitemap.includes("/artikel/die-bedeutung-von-wissen-und-aufrichtigem-lernen"), "sitemap: missing article still indexed");
assert.ok(sitemap.includes("/artikel/die-unterscheidung-zwischen-konsens-und-uebereinstimmung-der-gelehrten-in-der-islamischen-rechtsmethodik"), "sitemap: known published article missing");
console.log("PASS: canonical host matches sitemap and robots.txt");
console.log("SSR smoke tests passed.");

for (const path of ["/artikel?page=2", "/artikel?page=0", "/artikel?page=invalid"]) {
  const response = await request(path);
  assert.equal(response.statusCode, 404, "invalid archive pagination should return 404: " + path);
  assert.ok(response.body.includes('name="robots" content="noindex'));
  assert.ok(!response.body.includes('rel="canonical"'));
}
const firstArchivePage = await request("/artikel?page=1");
assert.equal(firstArchivePage.statusCode, 200);
assert.ok(firstArchivePage.body.includes('rel="canonical" href="https://www.shaykh-sayed.de/artikel"'));
assert.ok(!firstArchivePage.body.includes('rel="canonical" href="https://www.shaykh-sayed.de/artikel?page=1"'));
console.log("PASS: archive query parameters, canonical normalization and invalid-page 404");
