const origin = "https://www.shaykh-sayed.de";
const staticPaths = [
  "/",
  "/shaykh",
  "/durous",
  "/artikel",
  "/kontakt",
  "/impressum",
  "/datenschutz",
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function validLastModified(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function renderUrl(url, lastModified) {
  return [
    "  <url>",
    "    <loc>" + escapeXml(url) + "</loc>",
    lastModified ? "    <lastmod>" + escapeXml(lastModified) + "</lastmod>" : "",
    "  </url>",
  ].filter(Boolean).join("\n");
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).end();
  }

  try {
    // Import the built server bundle so Supabase is initialized by Vite,
    // using the same published-only query as the public article pages.
    const { getSitemapArticles } = await import("../dist-ssr/entry-server.js");
    const articles = await getSitemapArticles();
    const urls = staticPaths.map((path) => renderUrl(origin + path));
    const seen = new Set(staticPaths.map((path) => origin + path));

    for (const article of articles) {
      if (typeof article.slug !== "string") continue;
      const slug = article.slug.trim();
      if (!slug || slug.includes("/") || slug.includes("\\") || /[\x00-\x1F\x7F]/.test(slug)) continue;

      const url = origin + "/artikel/" + encodeURIComponent(slug);
      if (seen.has(url)) continue;
      seen.add(url);
      urls.push(renderUrl(url, validLastModified(article.lastModified || article.updatedAt || article.publishedAt)));
    }

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls,
      "</urlset>",
    ].join("\n");

    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    return request.method === "HEAD"
      ? response.status(200).end()
      : response.status(200).send(xml);
  } catch (error) {
    console.error("Dynamic sitemap failed:", error);
    response.setHeader("Cache-Control", "no-store");
    return response.status(503).end();
  }
}
