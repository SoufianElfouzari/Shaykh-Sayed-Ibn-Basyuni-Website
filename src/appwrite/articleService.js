import {
  Query,
} from "appwrite";

import {
  appwriteArticlesTableId,
  appwriteDatabaseId,
  tablesDB,
} from "./appwrite";

const ARTICLE_LANGUAGE = "Deutsch";
const ARTICLE_CATEGORY = "Artikel";
const DEFAULT_ARTICLE_AUTHOR =
  "Redaktion Shaykh Sayed";

function getRowData(row) {
  if (
    row?.data &&
    typeof row.data === "object" &&
    !Array.isArray(row.data)
  ) {
    return {
      ...row,
      ...row.data,
    };
  }

  return row ?? {};
}

function htmlToPlainText(html) {
  if (!html) {
    return "";
  }

  if (typeof DOMParser === "undefined") {
    return String(html)
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const document = new DOMParser().parseFromString(
    String(html),
    "text/html",
  );

  return (document.body.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
}

function createExcerpt({
  excerpt,
  contentText,
}) {
  const existingExcerpt =
    String(excerpt || "").trim();

  if (existingExcerpt) {
    return existingExcerpt;
  }

  if (!contentText) {
    return "";
  }

  if (contentText.length <= 190) {
    return contentText;
  }

  return `${contentText
    .slice(0, 187)
    .trim()}...`;
}

function calculateReadingTime(contentText) {
  const words = String(contentText || "")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return 1;
  }

  return Math.max(
    1,
    Math.ceil(words.length / 200),
  );
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function normalizeAuthor(author) {
  const normalizedAuthor =
    String(author || "").trim();

  if (normalizedAuthor) {
    return normalizedAuthor;
  }

  return DEFAULT_ARTICLE_AUTHOR;
}

function mapArticleRow(row) {
  const data = getRowData(row);

  const contentHtml =
    String(data.contentHtml || "").trim();

  const contentText =
    htmlToPlainText(contentHtml);

  const publishedAt =
    parseDate(data.publishedAt) ||
    parseDate(data.$updatedAt) ||
    parseDate(row?.$updatedAt);

  const updatedAt =
    parseDate(data.$updatedAt) ||
    parseDate(row?.$updatedAt) ||
    publishedAt;

  return {
    id:
      row?.$id ||
      data.$id ||
      data.id ||
      data.slug,

    slug:
      String(data.slug || "").trim(),

    title:
      String(data.title || "").trim(),

    excerpt: createExcerpt({
      excerpt: data.excerpt,
      contentText,
    }),

    contentHtml,
    contentText,

    coverImageUrl:
      String(
        data.coverImageUrl || "",
      ).trim(),

    status:
      String(
        data.status || "draft",
      ).trim(),

    publishedAt:
      publishedAt?.toISOString() || null,

    updatedAt:
      updatedAt?.toISOString() || null,

    readingTime:
      calculateReadingTime(contentText),

    author:
      normalizeAuthor(data.author),

    category:
      String(
        data.category ||
          ARTICLE_CATEGORY,
      ).trim(),

    language:
      String(
        data.language ||
          ARTICLE_LANGUAGE,
      ).trim(),

    featured:
      Boolean(data.featured),

    tags:
      Array.isArray(data.tags)
        ? data.tags
            .map((tag) =>
              String(tag).trim(),
            )
            .filter(Boolean)
        : [],
  };
}

function sortArticlesByPublishedDate(
  firstArticle,
  secondArticle,
) {
  const firstDate =
    firstArticle.publishedAt
      ? new Date(
          firstArticle.publishedAt,
        ).getTime()
      : 0;

  const secondDate =
    secondArticle.publishedAt
      ? new Date(
          secondArticle.publishedAt,
        ).getTime()
      : 0;

  return secondDate - firstDate;
}

export async function getPublishedArticles() {
  const response =
    await tablesDB.listRows({
      databaseId: appwriteDatabaseId,
      tableId:
        appwriteArticlesTableId,
      queries: [
        Query.limit(100),
      ],
      total: false,
      ttl: 60,
    });

  return response.rows
    .map(mapArticleRow)
    .filter((article) => {
      return (
        article.status === "published" &&
        article.slug.length > 0 &&
        article.title.length > 0
      );
    })
    .sort(
      sortArticlesByPublishedDate,
    );
}

export async function getPublishedArticleBySlug(
  slug,
) {
  const normalizedSlug =
    String(slug || "").trim();

  if (!normalizedSlug) {
    return null;
  }

  const response =
    await tablesDB.listRows({
      databaseId: appwriteDatabaseId,
      tableId:
        appwriteArticlesTableId,
      queries: [
        Query.equal(
          "slug",
          normalizedSlug,
        ),
        Query.equal(
          "status",
          "published",
        ),
        Query.limit(1),
      ],
      total: false,
      ttl: 60,
    });

  if (response.rows.length === 0) {
    return null;
  }

  return mapArticleRow(
    response.rows[0],
  );
}