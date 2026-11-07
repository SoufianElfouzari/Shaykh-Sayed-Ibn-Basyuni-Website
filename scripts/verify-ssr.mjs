import assert from "node:assert/strict";
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
  ["/shaykh", "Biografie und Werdegang"],
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

console.log("SSR smoke tests passed.");
