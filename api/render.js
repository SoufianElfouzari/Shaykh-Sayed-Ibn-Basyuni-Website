import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { articleSeo, SITE_FALLBACK_IMAGE } from "../src/utils/articleSeo.js";
import { getRouteMetadata, notFoundMetadata } from "../src/utils/routeSeo.js";

const origin = "https://www.shaykh-sayed.de";
const siteName = "Shaykh Sayed Ibn Basyuni";
const templatePath = fileURLToPath(new URL("../dist/index.html", import.meta.url));
let assetResources;

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
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function getAssets() {
  if (assetResources === undefined) {
    const template = readFileSync(templatePath, "utf8");
    const tags = (template.match(/<(?:script|link)\b[^>]*>/gi) || [])
      .filter((tag) => /(?:src|href)="\/assets\//.test(tag));
    assetResources = {
      head: tags.filter((tag) => /^<link\b/i.test(tag)).join("\n"),
      scripts: tags.filter((tag) => /^<script\b/i.test(tag))
        .map((tag) => tag + "</script>")
        .join("\n"),
    };
    if (!assetResources.head.includes("/assets/") ||
        !assetResources.scripts.includes("/assets/")) {
      throw new Error("The Vite CSS and JavaScript assets were not found in dist/index.html");
    }
  }
  return assetResources;
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

function metadataFor(pathname, article, status, data) {
  if (status === 404) {
    return notFoundMetadata;
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
  return getRouteMetadata(pathname, data?.archivePagination?.page) || getRouteMetadata("/");
}

export function structuredData(pathname, metadata, article, status, data) {
  if (status === 404) return "";
  const url = origin + pathname + (data?.archivePagination?.page > 1 ? "?page=" + data.archivePagination.page : "");
  const graph = [
    {
      "@type": "WebSite",
      "@id": origin + "/#website",
      url: origin + "/",
      name: siteName,
      inLanguage: "de",
      description: "Islamische Unterrichte und Fachartikel zu Quran, Sunnah, Fiqh und weiteren islamischen Wissenschaften.",
      publisher: { "@id": origin + "/#redaktion" }
    },
    {
      "@type": "Person",
      "@id": origin + "/#person",
      url: origin + "/shaykh",
      name: siteName,
      description: "Dr. Shaykh Sayed Ibn Basyuni ist Imam, Khatib und Lehrer islamischer Wissenschaften in Kassel.",
      jobTitle: ["Imam", "Khatib", "Lehrer für islamische Wissenschaften"],
      alumniOf: { "@type": "CollegeOrUniversity", name: "Al-Azhar-Universität" },
      knowsAbout: ["Fiqh", "Aqidah", "Hadith", "islamische Wissenschaften"]
    },
    {
      "@type": "Organization",
      "@id": origin + "/#redaktion",
      name: "Redaktion Shaykh Sayed",
      url: origin + "/",
      description: "Redaktionelle Veröffentlichung der Artikel und Unterrichte auf der offiziellen Website."
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
    graph[3].about = { "@id": origin + "/#person" };
    graph[3].mainEntity = { "@id": origin + "/#person" };
  }
  // All recordings have canonical, public anchor URLs, even before individual
  // transcript pages exist. Never expose short-lived signed audio URLs in JSON-LD.
  const recordings = Array.isArray(data?.duruus)
    ? data.duruus.filter((recording) => recording?.id && recording?.title && recording?.series)
    : [];
  if (pathname === "/" || pathname === "/durous") {
    if (pathname === "/durous") {
      Object.assign(graph[3], {
        "@type": "CollectionPage",
        about: { "@type": "Thing", name: "Islamische Unterrichte" }
      });
    }
    if (recordings.length > 0) {
      const listId = pathname === "/" ? url + "#start-aufnahmen" : url + "#aufnahmen";
      if (pathname === "/durous") graph[3].mainEntity = { "@id": listId };
      else graph[3].hasPart = [{ "@id": listId }];
      graph.push({
        "@type": "ItemList",
        "@id": listId,
        name: "Veröffentlichte Durous und Unterrichtsreihen",
        numberOfItems: recordings.length,
        itemListElement: recordings.slice(0, 20).map((recording, index) => {
          const lessonUrl = origin + "/durous#aufnahme-" + encodeURIComponent(String(recording.id));
          const language = String(recording.language || "").toLowerCase();
          const audio = {
            "@type": "AudioObject",
            "@id": lessonUrl,
            url: lessonUrl,
            name: recording.title,
            description: recording.description || undefined,
            inLanguage: language.includes("arab") ? "ar" : language.includes("engl") ? "en" : "de",
            creator: { "@id": origin + "/#person" },
            isPartOf: { "@type": "CreativeWorkSeries", name: recording.series },
            isAccessibleForFree: true
          };
          if (recording.durationSeconds > 0) audio.duration = "PT" + Math.floor(recording.durationSeconds) + "S";
          if (recording.date) audio.dateCreated = recording.date;
          if (recording.publishedAt) audio.datePublished = recording.publishedAt;
          return { "@type": "ListItem", position: index + 1, url: lessonUrl, item: audio };
        })
      });
    }
  }
  if (pathname === "/") {
    const latest = Array.isArray(data?.articles)
      ? data.articles.filter((entry) => entry?.slug && !entry.slug.includes("/") && entry.title).slice(0, 9)
      : [];
    if (latest.length) {
      const id = url + "#start-artikel";
      graph[3].hasPart = [...(graph[3].hasPart || []), { "@id": id }];
      graph.push({
        "@type": "ItemList",
        "@id": id,
        name: "Neueste islamische Artikel",
        numberOfItems: latest.length,
        itemListElement: latest.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.title,
          url: origin + "/artikel/" + encodeURIComponent(entry.slug)
        }))
      });
    }
  }
  if (pathname === "/artikel") {
    Object.assign(graph[3], {
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
      graph[3].mainEntity = { "@id": url + "#artikelliste" };
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
    graph[3].breadcrumb = { "@id": url + "#breadcrumbs" };
  }

  if (article) {
    const seo = articleSeo(article);
    graph[3].mainEntity = { "@id": url + "#article" };
    graph[3].inLanguage = seo.language;

    const author = {
      "@type": seo.author.type,
      name: seo.author.name
    };
    if (seo.author.profileUrl) author.url = seo.author.profileUrl;

    const schema = {
      "@type": "Article",
      "@id": url + "#article",
      url,
      mainEntityOfPage: { "@id": url + "#webpage" },
      headline: seo.headline,
      description: seo.description,
      inLanguage: seo.language,
      author,
      publisher: { "@id": origin + "/#redaktion" },
      isAccessibleForFree: true,
      timeRequired: "PT" + seo.readingTime + "M"
    };
    if (seo.wordCount > 0) schema.wordCount = seo.wordCount;
    if (seo.publishedAt) schema.datePublished = seo.publishedAt;
    if (seo.updatedAt) schema.dateModified = seo.updatedAt;
    if (seo.image) schema.image = seo.image;
    if (seo.category) schema.articleSection = seo.category;
    if (seo.tags.length) schema.keywords = seo.tags.join(", ");
    const topics = [...new Set([seo.category, ...seo.tags].filter(Boolean))];
    if (topics.length) schema.about = topics.map((name) => ({ "@type": "Thing", name }));
    graph.push(schema);
  }
  return '<script type="application/ld+json">' +
    safeJson({ "@context": "https://schema.org", "@graph": graph }) +
    "</script>";
}

function buildHtml(result) {
  const { markup, data, status, pathname } = result;
  const meta = metadataFor(pathname, data.article, status, data);
  const url = origin + pathname + (data.archivePagination?.page > 1 ? "?page=" + data.archivePagination.page : "");
  const image = absoluteImage(meta.image);
  const imageIsFallback = !meta.image;
  const imageAlt = imageIsFallback ? siteName + " - offizielles Logo" : (data.article?.title || meta.title);
  const socialCard = imageIsFallback ? "summary" : "summary_large_image";
  const robots = status === 404 ? "noindex, follow" : "index, follow, max-image-preview:large";
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const canonical = escapeHtml(url);
  const ld = structuredData(pathname, meta, data.article, status, data);
  const articleDetails = data.article && status === 200 ? articleSeo(data.article) : null;
  const assets = getAssets();
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
    '<link rel="apple-touch-icon" sizes="180x180" href="/ShaykhSayedLogo.png">',
    assets.head,
    ld,
    "</head><body>",
    '<div id="root">' + markup + "</div>",
    '<template id="ssr-data">' + safeJson(data) + "</template>",
    assets.scripts,
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
    pathname = decodeURI(rawPath.split("?")[0]);
  } catch {
    return response.status(400).end("Invalid path");
  }
  try {
    const { renderPage } = await import("../dist-ssr/entry-server.js");
    const rawPage = new URLSearchParams(rawPath.split("?").slice(1).join("?")).get("page");
    const forwardedPage = typeof request.query?.page === "string" ? request.query.page : new URL(request.url || "/", origin).searchParams.get("page");
    const pageValue = rawPage ?? forwardedPage;
    const renderPath = pathname === "/artikel" && pageValue !== null
      ? pathname + "?page=" + encodeURIComponent(pageValue)
      : pathname;
    const result = await renderPage(renderPath);
    const html = buildHtml(result);
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", result.status === 404
      ? "public, s-maxage=30, stale-while-revalidate=60"
      : "public, s-maxage=60, stale-while-revalidate=300");
    return request.method === "HEAD"
      ? response.status(result.status).end()
      : response.status(result.status).send(html);
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
