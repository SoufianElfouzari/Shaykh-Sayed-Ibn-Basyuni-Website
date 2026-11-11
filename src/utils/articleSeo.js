// A single source of truth for the metadata of each published article.
// Use the author's actual title, summary, dates, image, language and topic data.
// Never invent a publication date, credentials, sources, ratings or keywords.

export const SITE_ORIGIN = "https://www.shaykh-sayed.de";
export const SITE_NAME = "Shaykh Sayed Ibn Basyuni";
export const SITE_FALLBACK_IMAGE = SITE_ORIGIN + "/ShaykhSayedLogo.png";

export function cleanSeoText(value) {
  return String(value || "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function conciseDescription(value, maxLength = 165) {
  const text = cleanSeoText(value);
  if (text.length <= maxLength) return text;

  // Keep a complete natural sentence when possible.
  const window = text.slice(0, maxLength + 1);
  const punctuation = Array.from(window.matchAll(/[.!?](?=\s|$)/g))
    .map((match) => match.index + 1)
    .filter((position) => position >= 90 && position <= maxLength);
  if (punctuation.length) return text.slice(0, punctuation[punctuation.length - 1]);

  const lastSpace = window.lastIndexOf(" ", maxLength - 1);
  const end = lastSpace >= 105 ? lastSpace : maxLength - 1;
  return text.slice(0, end).replace(/[,;: ]+$/, "") + "…";
}

export function articleLanguage(value) {
  const normalized = cleanSeoText(value).toLowerCase();
  if (normalized === "arabisch" || normalized === "arabic" ||
      normalized === "ar" || normalized.startsWith("ar-")) return "ar";
  if (normalized === "englisch" || normalized === "english" ||
      normalized === "en" || normalized.startsWith("en-")) return "en";
  return "de";
}

export function safeIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function articleImage(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim(), SITE_ORIGIN);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.href;
  } catch {
    return null;
  }
}

export function articleAuthor(article) {
  const name = cleanSeoText(article?.author) || "Redaktion Shaykh Sayed";
  const isEditorial = name.toLowerCase().includes("redaktion");
  const isShaykh = /sayed\s+(?:ibn|bin)\s+basyuni/i.test(name);
  return {
    name,
    type: isEditorial ? "Organization" : "Person",
    profileUrl: isShaykh ? SITE_ORIGIN + "/shaykh" : null,
  };
}

export function articleSeo(article) {
  const headline = cleanSeoText(article?.title) || "Islamischer Artikel";
  const explicitTitle = cleanSeoText(article?.seoTitle);
  // Never append site branding to a scholarly article's title. Older SEO
  // fields may still contain a templated brand prefix/suffix; strip only that
  // boilerplate without changing the author's actual headline.
  const title = (explicitTitle || headline)
    .replace(/^(?:Dr\.?\s*)?Shaykh Sayed(?: Ibn Basyuni)?\s*\|\s*/i, "")
    .replace(/\s*\|\s*(?:Dr\.?\s*)?Shaykh Sayed(?: Ibn Basyuni)?$/i, "")
    .trim() || headline;
  const rawDescription = article?.seoDescription || article?.excerpt ||
    article?.contentText || headline;
  const description = conciseDescription(rawDescription) || headline;
  const author = articleAuthor(article);
  const tags = Array.isArray(article?.tags)
    ? [...new Set(article.tags.map(cleanSeoText).filter(Boolean))].slice(0, 15)
    : [];
  const category = cleanSeoText(article?.category);
  const publishedAt = safeIsoDate(article?.publishedAt);
  const updatedAt = safeIsoDate(article?.updatedAt);
  const wordCount = cleanSeoText(article?.contentText).split(/\s+/).filter(Boolean).length;
  const image = articleImage(article?.coverImageUrl);
  const language = articleLanguage(article?.language);

  return {
    headline,
    title,
    description,
    author,
    tags,
    category: category && category !== "Artikel" ? category : null,
    language,
    publishedAt,
    updatedAt,
    image,
    wordCount,
    readingTime: Math.max(1, Number(article?.readingTime) || Math.ceil(wordCount / 200) || 1),
  };
}
