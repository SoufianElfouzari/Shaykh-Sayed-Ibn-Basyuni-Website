import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import handler from "../api/render.js";

async function request(path) {
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

  await handler({ method: "GET", query: { path } }, response);
  return response;
}

const pages = [
  ["/", "Islam lernen auf Deutsch"],
  ["/shaykh", "Shaykh Sayed Ibn Basyuni | Biografie und Werdegang"],
  ["/durous", "Islamische Unterrichte und Durous"],
  ["/kontakt", "Kontakt"],
  ["/impressum", "Impressum"],
];

for (const [path, title] of pages) {
  const response = await request(path);
  assert.equal(response.statusCode, 200, path);
  assert.match(response.body, /<h1\b/i, path + ": missing server-rendered H1");
  assert.ok(response.body.includes("<title>" + title), path + ": wrong title");
  assert.ok(response.body.includes('rel="canonical" href="https://shaykh-sayed.de' + path + '"'), path + ": wrong canonical");
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
    assert.equal(page?.mainEntity?.["@id"], "https://shaykh-sayed.de/#person", "shaykh: wrong main entity");
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
    assert.equal(page.about?.["@id"], "https://shaykh-sayed.de/#person");
    const itemList = schema["@graph"].find((item) => item["@type"] === "ItemList");
    if (itemList) {
      assert.ok(itemList.numberOfItems > 0, "durous: empty ItemList must not be emitted");
      assert.ok(itemList.itemListElement.length > 0, "durous: missing published item entries");
      assert.equal(page.mainEntity?.["@id"], itemList["@id"], "durous: wrong collection link");
    } else {
      assert.equal(page.mainEntity, undefined, "durous: no empty recording collection should be referenced");
    }
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

const robots = readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
assert.ok(robots.includes("Sitemap: https://shaykh-sayed.de/sitemap.xml"));
assert.ok(sitemap.includes("<loc>https://shaykh-sayed.de/durous</loc>"));
assert.ok(!sitemap.includes("https://www.shaykh-sayed.de/"), "sitemap: www host contradicts canonicals");
console.log("PASS: canonical host matches sitemap and robots.txt");
console.log("SSR smoke tests passed.");
