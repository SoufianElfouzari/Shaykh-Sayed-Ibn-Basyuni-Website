import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { structuredData } from "../../api/render.js";

const origin = "https://www.shaykh-sayed.de";
function graph(path, article, data = {}) {
  const json = structuredData(path, { title: "Testseite", description: "Veröffentlichte Inhalte" }, article, 200, data);
  const payload = json.replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, "");
  return JSON.parse(payload)["@graph"];
}

test("homepage includes real recording and article entities with stable deep links", () => {
  const g = graph("/", null, {
    duruus: [{ id: "recording-1", title: "Fiqh-Unterricht", series: "Fiqh", description: "Öffentliche Aufnahme", language: "Deutsch", durationSeconds: 540 }],
    articles: [{ slug: "fiqh-grundlagen", title: "Grundlagen des Fiqh" }],
  });
  assert.equal(g.find((node) => node["@type"] === "Person")["@id"], origin + "/#person");
  assert.equal(g.find((node) => node["@type"] === "Organization")["@id"], origin + "/#redaktion");
  const audio = g.flatMap((node) => node.itemListElement || [])
    .map((element) => element.item).find((item) => item?.["@type"] === "AudioObject");
  assert.equal(audio.url, origin + "/durous#aufnahme-recording-1");
  assert.equal(audio.duration, "PT540S");
  assert.equal(audio.inLanguage, "de");
  assert.ok(g.some((node) => (node.itemListElement || []).some((element) =>
    element.url === origin + "/artikel/fiqh-grundlagen")));
});

test("article schema separates the declared author from the publisher", () => {
  const article = {
    slug: "mein-beitrag",
    title: "Fachartikel",
    author: "Redaktion Shaykh Sayed",
    category: "Fiqh",
    tags: ["Reinigung"],
    language: "Deutsch",
    contentText: "Ein fachlicher Testartikel.",
    publishedAt: "2026-11-10T12:00:00Z",
  };
  const g = graph("/artikel/mein-beitrag", article);
  const schema = g.find((node) => node["@type"] === "Article");
  assert.equal(schema.author.name, "Redaktion Shaykh Sayed");
  assert.equal(schema.author["@type"], "Organization");
  assert.deepEqual(schema.publisher, { "@id": origin + "/#redaktion" });
  assert.deepEqual(schema.about.map((topic) => topic.name), ["Fiqh", "Reinigung"]);
});

test("server-rendered homepage loads recordings and schedule from the published sources", () => {
  const server = readFileSync(new URL("../../src/entry-server.jsx", import.meta.url), "utf8");
  const schedule = readFileSync(new URL("../../src/pages/common/LessonSchedule/LessonSchedule.jsx", import.meta.url), "utf8");
  const archive = readFileSync(new URL("../../src/pages/Duruus/components/DuruusArchive/DuruusArchive.jsx", import.meta.url), "utf8");
  assert.match(server, /\[data\.articles, data\.duruus\] = await Promise\.all/);
  assert.match(server, /path === "\/" \|\| path === "\/durous"/);
  assert.match(schedule, /__ssrPath === "\/"/);
  assert.match(archive, /<DescriptionText text=\{fullText\} \/>/);
  assert.match(archive, /id=\{`aufnahme-\$\{recording\.id\}`\}/);
});
