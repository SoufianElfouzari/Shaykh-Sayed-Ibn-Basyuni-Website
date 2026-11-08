import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { articleSeo, SITE_FALLBACK_IMAGE } from "../src/utils/articleSeo.js";
import { staticMetadata } from "../src/utils/staticSeo.js";

const origin = "https://www.shaykh-sayed.de";
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

const routeModulePaths = {
  "/shaykh": "src/pages/Shaykh/Shaykh.jsx",
  "/durous": "src/pages/Duruus/Duruus.jsx",
  "/artikel": "src/pages/Articles/Articles.jsx",
  "/kontakt": "src/pages/Contact/Contact.jsx",
  "/datenschutz": "src/pages/Datenschutz/Datenschutz.jsx",
  "/impressum": "src/pages/Impressum/Impressum.jsx",
};

let clientManifest;

function getAssets(pathname, status) {
  if (assetTags === undefined) {
    const template = readFileSync(templatePath, "utf8");
    assetTags = (template.match(/<(?:script|link)\b[^>]*>/gi) || [])
      .filter((tag) => /(?:src|href)="\/assets\//.test(tag))
      .map((tag) => /^<script\b/i.test(tag) ? tag + "</script>" : tag);
    if (!assetTags.some((tag) => tag.includes("/assets/"))) {
      throw new Error("The Vite client assets were not found in dist/index.html");
    }
  }

  const styles = assetTags.filter((tag) => /^<link\b/i.test(tag));
  const scripts = assetTags.filter((tag) => /^<script\b/i.test(tag));
  const routeEntry = status === 404
    ? "src/pages/NotFound/NotFound.jsx"
    : pathname.startsWith("/artikel/")
      ? "src/pages/Articles/components/ArticleDetails/ArticleDetails.jsx"
      : routeModulePaths[pathname];

  if (routeEntry) {
    if (!clientManifest) {
      clientManifest = JSON.parse(readFileSync(
        fileURLToPath(new URL("../dist/.vite/manifest.json", import.meta.url)),
        "utf8",
      ));
    }

    const seenChunks = new Set();
    const cssFiles = new Set();
    function addChunkStyles(key) {
      if (seenChunks.has(key)) return;
      seenChunks.add(key);
      const chunk = clientManifest[key];
      if (!chunk) throw new Error("Client manifest is missing route chunk: " + key);
      for (const cssFile of chunk.css || []) cssFiles.add(cssFile);
      for (const imported of chunk.imports || []) addChunkStyles(imported);
    }
    addChunkStyles(routeEntry);
    for (const cssFile of cssFiles) {
      const href = "/" + cssFile;
      if (!styles.some((tag) => tag.includes('href="' + href + '"'))) {
        styles.push('<link rel="stylesheet" href="' + escapeHtml(href) + '">');
      }
    }
  }

  return {
    head: styles.join("\n"),
    body: scripts.join("\n"),
  };
}

function absoluteImage(source) {
  if (typeof source === "string" && source.trim()) {
    try {
      const url = new URL(source, origin);
      if (url.protocol === "https:" || url.protocol === "http:") return url.href;
    } catch { /* use default image */ }
  }
  return SITE_FALLBACK_IMAGE;
}

function metadataFor(pathname, article, status) {
  if (status === 404) {
    return {
      title: "Seite nicht gefunden | Shaykh Sayed",
      description: "Die gesuchte Seite oder der Artikel ist nicht verfügbar."
    };
  }
  if (article) {
    const seo = articleSeo(article);
    return {
      title: seo.title,
      description: seo.description,
      image: seo.image,
      type: "article"
    };
  }
  return staticMetadata[pathname] || staticMetadata["/"];
}

function structuredData(pathname, metadata, article, status, data) {
  if (status === 404) return "";
  const url = origin + pathname + (pathname === "/artikel" && data?.pagination?.page > 1 ? "?page=" + data.pagination.page : "");
  const graph = [
    {
      "@type": "WebSite",
      "@id": origin + "/#website",
      url: origin + "/",
      name: siteName,
      inLanguage: "de",
      publisher: { "@id": origin + "/#person" }
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
  if (pathname === "/shaykh") {
    Object.assign(graph[1], {
      description: "Dr. Shaykh Sayed Ibn Basyuni ist Imam, Khatib und Lehrer islamischer Wissenschaften in Kassel.",
      jobTitle: ["Imam", "Khatib", "Lehrer für islamische Wissenschaften"],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Al-Azhar-Universität"
      },
      knowsAbout: ["Fiqh", "Aqidah", "Hadith", "Tafsir", "islamische Wissenschaften"]
    });
    graph[2].about = { "@id": origin + "/#person" };
    graph[2].mainEntity = { "@id": origin + "/#person" };
  }
  if (pathname === "/durous") {
    Object.assign(graph[2], {
      "@type": "CollectionPage",
      about: { "@id": origin + "/#person" }
    });

    const recordings = Array.isArray(data?.duruus)
      ? data.duruus.filter((recording) => recording?.title && recording?.series)
      : [];

    if (recordings.length > 0) {
      graph[2].mainEntity = { "@id": url + "#aufnahmen" };
      graph.push({
        "@type": "ItemList",
        "@id": url + "#aufnahmen",
        name: "Veröffentlichte Durous und Unterrichtsreihen",
        numberOfItems: recordings.length,
        itemListElement: recordings.slice(0, 20).map((recording, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            name: recording.title,
            description: recording.description || undefined,
            inLanguage: recording.language || undefined,
            isPartOf: {
              "@type": "CreativeWorkSeries",
              name: recording.series
            },
            author: { "@id": origin + "/#person" }
          }
        }))
      });
    }
  }
  if (pathname === "/artikel") {
    Object.assign(graph[2], {
      "@type": "CollectionPage",
      about: { "@type": "Thing", name: "Islamische Wissenschaften" }
    });

    const publishedArticles = Array.isArray(data?.articles)
      ? data.articles.filter((entry) => typeof entry?.slug === "string" && entry.slug && !entry.slug.includes("/") && entry.title)
      : [];

    const visibleArticles = [...publishedArticles]
      .sort((first, second) => (new Date(second.publishedAt || 0).getTime() || 0) -
        (new Date(first.publishedAt || 0).getTime() || 0))
      .slice(0, 12);

    if (visibleArticles.length > 0) {
      graph[2].mainEntity = { "@id": url + "#artikelliste" };
      graph.push({
        "@type": "ItemList",
        "@id": url + "#artikelliste",
        name: "Veröffentlichte islamische Artikel",
        numberOfItems: visibleArticles.length,
        itemListElement: visibleArticles.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.title,
          url: origin + "/artikel/" + encodeURIComponent(entry.slug)
        }))
      });
    }
  }

  if (pathname === "/artikel" || article) {
    const breadcrumbs = [
      { "@type": "ListItem", position: 1, name: "Startseite", item: origin + "/" },
      { "@type": "ListItem", position: 2, name: "Islamische Artikel", item: origin + "/artikel" }
    ];

    if (article) {
      breadcrumbs.push({
        "@type": "ListItem",
        position: 3,
        name: String(article.title),
        item: url
      });
    }

    graph.push({
      "@type": "BreadcrumbList",
      "@id": url + "#breadcrumbs",
      itemListElement: breadcrumbs
    });
    graph[2].breadcrumb = { "@id": url + "#breadcrumbs" };
  }

  if (article) {
    const seo = articleSeo(article);
    graph[2].mainEntity = { "@id": url + "#article" };
    graph[2].inLanguage = seo.language;

    const author = {
      "@type": seo.author.type,
      name: seo.author.name
    };
    if (seo.author.profileUrl) author.url = seo.author.profileUrl;
    // Only link the named author to this Person when articleSeo has
    // verified that the actual author name resolves to the Shaykh.
    if (seo.author.profileUrl === origin + "/shaykh" && seo.author.type === "Person") {
      author["@id"] = origin + "/#person";
    }

    const schema = {
      "@type": "Article",
      "@id": url + "#article",
      url,
      mainEntityOfPage: { "@id": url + "#webpage" },
      headline: seo.headline,
      description: seo.description,
      inLanguage: seo.language,
      author,
      publisher: { "@id": origin + "/#person" },
      isAccessibleForFree: true,
      timeRequired: "PT" + seo.readingTime + "M"
    };
    if (seo.wordCount > 0) schema.wordCount = seo.wordCount;
    if (seo.publishedAt) schema.datePublished = seo.publishedAt;
    if (seo.updatedAt) schema.dateModified = seo.updatedAt;
    if (seo.image) schema.image = seo.image;
    if (seo.category) schema.articleSection = seo.category;
    if (seo.tags.length) schema.keywords = seo.tags.join(", ");
    graph.push(schema);
  }
  return '<script type="application/ld+json">' +
    safeJson({ "@context": "https://schema.org", "@graph": graph }) +
    "</script>";
}

function buildHtml(result) {
  const { markup, data, status, pathname } = result;
  const meta = metadataFor(pathname, data.article, status);
  const url = origin + pathname + (pathname === "/artikel" && data?.pagination?.page > 1 ? "?page=" + data.pagination.page : "");
  const image = absoluteImage(meta.image);
  const imageIsFallback = !meta.image;
  const imageAlt = imageIsFallback ? siteName + " - offizielles Logo" : (data.article?.title || meta.title);
  const socialCard = imageIsFallback ? "summary" : "summary_large_image";
  const robots = status === 404 ? "noindex, follow" : "index, follow, max-image-preview:large";
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const canonical = escapeHtml(url);
  const ld = structuredData(pathname, meta, data.article, status, data);
  const assets = getAssets(pathname, status);
  const articleDetails = data.article && status === 200 ? articleSeo(data.article) : null;
  const pageLanguage = articleDetails?.language || "de";
  const ogLocale = pageLanguage === "ar" ? "ar_AR" : pageLanguage === "en" ? "en_US" : "de_DE";

  return [
    "<!doctype html>",
    '<html lang="' + pageLanguage + '" dir="' + (pageLanguage === "ar" ? "rtl" : "ltr") + '"><head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">',
    "<title>" + title + "</title>",
    '<meta name="description" content="' + description + '">',
    '<meta name="robots" content="' + robots + '">',
    status === 404 ? "" : '<link rel="canonical" href="' + canonical + '">',
    '<meta property="og:locale" content="' + ogLocale + '">',
    '<meta property="og:site_name" content="' + escapeHtml(siteName) + '">',
    '<meta property="og:type" content="' + (meta.type || "website") + '">',
    '<meta property="og:title" content="' + title + '">',
    '<meta property="og:description" content="' + description + '">',
    '<meta property="og:url" content="' + canonical + '">',
    '<meta property="og:image" content="' + escapeHtml(image) + '">',
    image.startsWith("https://") ? '<meta property="og:image:secure_url" content="' + escapeHtml(image) + '">' : "",
    imageIsFallback ? '<meta property="og:image:type" content="image/png">' : "",
    '<meta property="og:image:alt" content="' + escapeHtml(imageAlt) + '">',
    articleDetails?.publishedAt ? '<meta property="article:published_time" content="' + escapeHtml(articleDetails.publishedAt) + '">' : "",
    articleDetails?.updatedAt ? '<meta property="article:modified_time" content="' + escapeHtml(articleDetails.updatedAt) + '">' : "",
    articleDetails?.author?.name ? '<meta name="author" content="' + escapeHtml(articleDetails.author.name) + '">' : "",
    '<meta name="twitter:card" content="' + socialCard + '">',
    '<meta name="twitter:title" content="' + title + '">',
    '<meta name="twitter:description" content="' + description + '">',
    '<meta name="twitter:image" content="' + escapeHtml(image) + '">',
    '<meta name="twitter:image:alt" content="' + escapeHtml(imageAlt) + '">',
    articleDetails?.author?.profileUrl ? '<link rel="author" href="' + escapeHtml(articleDetails.author.profileUrl) + '">' : "",
    '<meta name="theme-color" content="#084c3c">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    assets.head,
    ld,
    "</head><body>",
    '<div id="root">' + markup + "</div>",
    "<script>window.__SSR_DATA__=" + safeJson(data) + ";</script>",
    assets.body,
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
  let page;
  try {
    const parsedPath = new URL(rawPath, origin);
    pathname = decodeURI(parsedPath.pathname);
    const requestUrl = new URL(request.url || "/", origin);
    page = typeof request.query?.page === "string"
      ? request.query.page
      : (parsedPath.searchParams.get("page") ?? requestUrl.searchParams.get("page"));
  } catch {
    return response.status(400).end("Invalid path");
  }
  try {
    const { renderPage } = await import("../dist-ssr/entry-server.js");
    const result = await renderPage(pathname, { page });
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
