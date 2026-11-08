import { supabase } from "./client";

const plainText = (html) => {
  if (typeof DOMParser !== "undefined") {
    return new DOMParser().parseFromString(html || "", "text/html").body.textContent?.replace(/\s+/g, " ").trim() || "";
  }
  return String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const mapArticle = (row) => {
  const contentHtml = row.contentHtml || "";
  const contentText = plainText(contentHtml);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    seoTitle: row.seoTitle || "",
    seoDescription: row.seoDescription || "",
    excerpt: row.excerpt || (contentText.length > 190 ? contentText.slice(0, 187).trim() + "..." : contentText),
    contentHtml,
    contentText,
    coverImageUrl: row.coverImageUrl || "",
    status: row.status,
    publishedAt: row.publishedAt || null,
    updatedAt: row.updated_at,
    // A listing intentionally omits contentHtml, so never invent a reading time.
    readingTime: Object.hasOwn(row, "contentHtml")
      ? Math.max(1, Math.ceil(contentText.split(/\s+/).filter(Boolean).length / 200))
      : null,
    author: row.author || "Redaktion Shaykh Sayed",
    category: row.category || "Artikel",
    language: row.language || "Deutsch",
    featured: Boolean(row.featured),
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
};

// Lightweight public metadata for homepage cards and article navigation.
// Full texts are fetched only for the archive's full-text search or detail pages.
export async function getPublishedArticleSummaries() {
  const { data, error } = await supabase
    .from("articles")
    .select("id,slug,title,excerpt,coverImageUrl,status,publishedAt,updated_at,author,category,language,featured,tags")
    .eq("status", "published")
    .order("publishedAt", { ascending: false, nullsFirst: false })
    .range(0, 999);

  if (error) throw error;
  return (data || []).filter((row) => row.slug && row.title).map(mapArticle);
}

export async function getPublishedArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("publishedAt", { ascending: false, nullsFirst: false })
    .range(0, 999);

  if (error) throw error;
  return (data || []).filter((row) => row.slug && row.title).map(mapArticle);
}

export async function getPublishedArticleBySlug(slug) {
  if (!String(slug || "").trim()) return null;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", String(slug).trim())
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? mapArticle(data) : null;
}


// Lightweight, paginated lookup for the XML sitemap. Only published article
// URLs are returned; drafts and unpublished articles must never be listed.
export async function getPublishedArticleIndex() {
  const pageSize = 500;
  const maxArticles = 49_000;
  const articles = [];

  for (let offset = 0; offset < maxArticles; offset += pageSize) {
    const { data, error } = await supabase
      .from("articles")
      .select("slug,publishedAt,updated_at")
      .eq("status", "published")
      .order("publishedAt", { ascending: false, nullsFirst: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    const rows = data || [];
    articles.push(...rows
      .filter((row) => typeof row.slug === "string" && row.slug.trim() && !row.slug.includes("/"))
      .map((row) => ({
        slug: row.slug.trim(),
        lastModified: row.updated_at || row.publishedAt || null,
      })));

    if (rows.length < pageSize) break;
  }

  return articles;
}

 
// Recommend only genuinely published articles with matching subjects/tags.
// A small metadata-only query avoids fetching their full religious texts on SSR.
export async function getRelatedPublishedArticles(referenceArticle, maxResults = 4) {
  if (!referenceArticle?.slug) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("slug,title,excerpt,category,tags,publishedAt")
    .eq("status", "published")
    .neq("slug", referenceArticle.slug)
    .order("publishedAt", { ascending: false, nullsFirst: false })
    .limit(100);

  if (error) throw error;

  const referenceCategory = String(referenceArticle.category || "").trim().toLowerCase();
  const referenceTags = new Set(
    (referenceArticle.tags || []).map((tag) => String(tag).trim().toLowerCase()).filter(Boolean),
  );

  const candidates = (data || [])
    .filter((row) => typeof row.slug === "string" &&
      row.slug.trim() && !row.slug.includes("/") && row.title)
    .map((row) => {
      const tags = Array.isArray(row.tags) ? row.tags : [];
      const sharedTags = tags.filter((tag) =>
        referenceTags.has(String(tag).trim().toLowerCase())).length;
      const categoryMatches = referenceCategory &&
        String(row.category || "").trim().toLowerCase() === referenceCategory;
      return {
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt || "",
        category: row.category || "",
        score: sharedTags * 3 + (categoryMatches ? 2 : 0),
        publishedAt: row.publishedAt || null,
      };
    });

  return candidates
    .filter((candidate) => candidate.score > 0)
    .sort((first, second) => second.score - first.score ||
      (new Date(second.publishedAt || 0) - new Date(first.publishedAt || 0)))
    .slice(0, Math.max(0, Math.min(6, maxResults)))
    .map((candidate) => ({
      slug: candidate.slug,
      title: candidate.title,
      excerpt: candidate.excerpt,
      category: candidate.category,
      publishedAt: candidate.publishedAt,
    }));
}
