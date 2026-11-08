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
    excerpt: row.excerpt || (contentText.length > 190 ? contentText.slice(0, 187).trim() + "..." : contentText),
    contentHtml,
    contentText,
    coverImageUrl: row.coverImageUrl || "",
    status: row.status,
    publishedAt: row.publishedAt || row.updated_at,
    updatedAt: row.updated_at,
    readingTime: Math.max(1, Math.ceil(contentText.split(/\s+/).filter(Boolean).length / 200)),
    author: row.author || "Redaktion Shaykh Sayed",
    category: row.category || "Artikel",
    language: row.language || "Deutsch",
    featured: Boolean(row.featured),
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
};

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
