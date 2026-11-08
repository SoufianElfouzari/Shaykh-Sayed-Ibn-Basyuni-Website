import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import handler from "../../api/render.js";
import sitemapHandler from "../../api/sitemap.js";

const port = Number(process.env.QA_TEST_PORT || 4179);
const cwd = process.cwd();
const publicRoot = resolve(cwd, "public");
const distRoot = resolve(cwd, "dist");
const types = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2",
  ".json": "application/json", ".webm": "video/webm", ".mp3": "audio/mpeg",
};
const inside = (path, root) => path === root || path.startsWith(root + sep);

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const isAsset = pathname.startsWith("/assets/");
    const root = isAsset ? distRoot : publicRoot;
    const filepath = resolve(root, "." + pathname);
    if (pathname !== "/sitemap.xml" && inside(filepath, root) &&
        (isAsset || pathname.includes("."))) {
      try {
        response.setHeader("content-type", types[extname(filepath)] || "application/octet-stream");
        response.end(await readFile(filepath));
      } catch {
        response.writeHead(404).end("Not found");
      }
      return;
    }
    const adapter = {
      setHeader(key, value) { response.setHeader(key, value); return this; },
      status(code) { response.statusCode = code; return this; },
      send(body) {
        if (!response.hasHeader("content-type")) response.setHeader("content-type", "text/html; charset=utf-8");
        response.end(String(body));
        return this;
      },
      end(body = "") { response.end(String(body)); return this; },
    };
    const target = pathname === "/sitemap.xml" ? sitemapHandler : handler;
    await target({ method: request.method, query: { path: pathname }, url: request.url }, adapter);
  } catch (error) {
    console.error("SSR fixture error:", error);
    response.writeHead(500).end("Fixture error");
  }
}).listen(port, "127.0.0.1", () => {
  console.log("Deterministic SSR test server on http://127.0.0.1:" + port);
});
