import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import handler from "../api/render.js";
import sitemapHandler from "../api/sitemap.js";
import { parseServerArticleContent } from "../src/utils/serverArticleContent.js";

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
  assert.ok(response.body.includes("<title>" + title), path + ": wrong title");
  assert.ok(response.body.includes('rel="canonical" href="https://www.shaykh-sayed.de' + path + '"'), path + ": wrong canonical");
  assert.ok(response.body.includes('/assets/index-'), path + ": missing client assets");
  assert.ok(response.body.includes('id="root"'), path + ": missing React root");
  if (path === "/") {
    assert.ok(
      response.body.includes('name="description" content="Islam lernen auf Deutsch:'),
      "home: missing keyword in SSR description",
    );
    assert.ok(
      response.body.includes('mit Quran und Sunnah.'),
      "home: missing learning focus in server-rendered hero",
    );
    assert.ok(
      response.body.includes('property="og:title" content="Islam lernen auf Deutsch'),
      "home: Open Graph title does not match",
    );
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
assert.ok(serverContent.sections[1].html.includes("<p>Ein zweiter Absatz.</p>"));
assert.ok(!JSON.stringify(serverContent).includes("onerror"), "SSR article parser must remove unsafe attributes");
assert.ok(!JSON.stringify(serverContent).includes("alert(1)"), "SSR article parser must remove scripts");
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
  const sourceHeadings = (first.contentHtml.match(/<h[1-3]\\b/gi) || []).length;
  if (sourceHeadings > 0) {
    const renderedHeadings = (response.body.match(/<h2\\b/gi) || []).length;
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
