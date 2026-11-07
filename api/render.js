import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const origin = "https://shaykh-sayed.de";
const siteName = "Shaykh Sayed Ibn Basyuni";
const templatePath = fileURLToPath(new URL("../dist/index.html", import.meta.url));
let assetTags;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function getAssets() {
  if (assetTags === undefined) {
    const template = readFileSync(templatePath, "utf8");
    assetTags = (template.match(/<(?:script|link)\b[^>]*>/gi) || [])
      .filter((tag) => /(?:src|href)="\/assets\//.test(tag))
      .join("\n");
    if (!assetTags.includes("/assets/")) {
      throw new Error("The Vite client assets were not found in dist/index.html");
    }
  }
  return assetTags;
}

function absoluteImage(source) {
  if (typeof source === "string" && source.trim()) {
    try {
      const url = new URL(source, origin);
      if (url.protocol === "https:" || url.protocol === "http:") return url.href;
    } catch { /* use default image */ }
  }
  return origin + "/ShaykhSayedLogo.png";
}

const staticMetadata = {
  "/": {
    title: "Shaykh Sayed Ibn Basyuni | Durous und islamische Artikel",
    description: "Islamische Unterrichte, Artikel und Informationen über Shaykh Sayed Ibn Basyuni. Entdecke Wissen über Quran, Sunnah, Aqidah und Fiqh."
  },
  "/shaykh": {
    title: "Biografie und Werdegang | Shaykh Sayed Ibn Basyuni",
    description: "Erfahre mehr über Shaykh Sayed Ibn Basyuni, seinen wissenschaftlichen Werdegang und seine Tätigkeit als Imam und Lehrer."
  },
  "/durous": {
    title: "Islamische Unterrichte auf Deutsch | Shaykh Sayed",
    description: "Aktuelle Unterrichtszeiten, islamische Unterrichte und aufgezeichnete Durous von Shaykh Sayed Ibn Basyuni."
  },
  "/artikel": {
    title: "Islamische Artikel über Quran und Sunnah | Shaykh Sayed",
    description: "Lies islamische Artikel und wissenschaftliche Beiträge über Quran, Sunnah, Aqidah, Fiqh und weitere Themen."
  },
  "/kontakt": {
    title: "Kontakt | Shaykh Sayed Ibn Basyuni",
    description: "Kontaktmöglichkeiten und Informationen zur offiziellen Website von Shaykh Sayed Ibn Basyuni."
  },
  "/impressum": {
    title: "Impressum | Shaykh Sayed Ibn Basyuni",
    description: "Impressum und rechtliche Angaben zur Website von Shaykh Sayed Ibn Basyuni."
  },
  "/datenschutz": {
    title: "Datenschutz | Shaykh Sayed Ibn Basyuni",
    description: "Datenschutzhinweise und Informationen über den Umgang mit personenbezogenen Daten auf shaykh-sayed.de."
  }
};

function metadataFor(pathname, article, status) {
  if (status === 404) {
    return {
      title: "Seite nicht gefunden | Shaykh Sayed",
      description: "Die gesuchte Seite oder der Artikel ist nicht verfügbar."
    };
  }
  if (article) {
    return {
      title: String(article.title || "Artikel") + " | Shaykh Sayed",
      description: String(article.excerpt || article.contentText || "").slice(0, 180),
      image: article.coverImageUrl,
      type: "article"
    };
  }
  return staticMetadata[pathname] || staticMetadata["/"];
}

function structuredData(pathname, metadata, article, status) {
  if (status === 404) return "";
  const url = origin + pathname;
  const graph = [
    {
      "@type": "WebSite",
      "@id": origin + "/#website",
      url: origin + "/",
      name: siteName,
      inLanguage: "de"
    },
    {
      "@type": "Person",
      "@id": origin + "/#person",
      url: origin + "/shaykh",
      name: siteName
    },
    {
      "@type": "WebPage",
      "@id": url + "#webpage",
      url,
      name: metadata.title,
      description: metadata.description,
      inLanguage: "de",
      isPartOf: { "@id": origin + "/#website" }
    }
  ];
  if (article) {
    const schema = {
      "@type": "Article",
      "@id": url + "#article",
      mainEntityOfPage: { "@id": url + "#webpage" },
      headline: article.title,
      description: metadata.description,
      inLanguage: "de",
      author: { "@type": "Person", name: article.author || "Redaktion Shaykh Sayed" },
      publisher: { "@id": origin + "/#person" }
    };
    if (article.publishedAt) schema.datePublished = article.publishedAt;
    if (article.updatedAt) schema.dateModified = article.updatedAt;
    if (article.coverImageUrl) schema.image = absoluteImage(article.coverImageUrl);
    graph.push(schema);
  }
  return '<script type="application/ld+json">' +
    safeJson({ "@context": "https://schema.org", "@graph": graph }) +
    "</script>";
}

function buildHtml(result) {
  const { markup, data, status, pathname } = result;
  const meta = metadataFor(pathname, data.article, status);
  const url = origin + pathname;
  const image = absoluteImage(meta.image);
  const robots = status === 404 ? "noindex, follow" : "index, follow, max-image-preview:large";
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const canonical = escapeHtml(url);
  const ld = structuredData(pathname, meta, data.article, status);

  return [
    "<!doctype html>",
    '<html lang="de" dir="ltr"><head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">',
    "<title>" + title + "</title>",
    '<meta name="description" content="' + description + '">',
    '<meta name="robots" content="' + robots + '">',
    status === 404 ? "" : '<link rel="canonical" href="' + canonical + '">',
    '<meta property="og:locale" content="de_DE">',
    '<meta property="og:site_name" content="' + escapeHtml(siteName) + '">',
    '<meta property="og:type" content="' + (meta.type || "website") + '">',
    '<meta property="og:title" content="' + title + '">',
    '<meta property="og:description" content="' + description + '">',
    '<meta property="og:url" content="' + canonical + '">',
    '<meta property="og:image" content="' + escapeHtml(image) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + title + '">',
    '<meta name="twitter:description" content="' + description + '">',
    '<meta name="twitter:image" content="' + escapeHtml(image) + '">',
    '<meta name="theme-color" content="#084c3c">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    ld,
    "</head><body>",
    '<div id="root">' + markup + "</div>",
    "<script>window.__SSR_DATA__=" + safeJson(data) + ";</script>",
    getAssets(),
    "</body></html>"
  ].join("\n");
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).end();
  }
  const rawPath = typeof request.query?.path === "string"
    ? request.query.path
    : new URL(request.url, origin).searchParams.get("path") || "/";
  if (!rawPath.startsWith("/") || rawPath.startsWith("//") || rawPath.length > 2048) {
    return response.status(400).end("Invalid path");
  }
  let pathname;
  try {
    pathname = decodeURI(rawPath).split("?")[0];
  } catch {
    return response.status(400).end("Invalid path");
  }
  try {
    const { renderPage } = await import("../dist-ssr/entry-server.js");
    const result = await renderPage(pathname);
    const html = buildHtml(result);
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", result.status === 404
      ? "public, s-maxage=30, stale-while-revalidate=60"
      : "public, s-maxage=60, stale-while-revalidate=300");
    return response.status(result.status).send(html);
  } catch (error) {
    console.error("SSR rendering failed:", error);
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("X-Robots-Tag", "noindex");
    response.setHeader("Cache-Control", "no-store");
    return response.status(503).send(
      '<!doctype html><html lang="de"><meta charset="utf-8"><title>Vorübergehend nicht verfügbar</title>' +
      '<main><h1>Diese Seite ist vorübergehend nicht verfügbar.</h1><p>Bitte versuche es später erneut.</p></main></html>'
    );
  }
}
