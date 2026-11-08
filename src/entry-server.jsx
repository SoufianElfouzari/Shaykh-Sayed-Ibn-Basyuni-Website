import { renderToString } from "react-dom/server";
import { readFileSync } from "node:fs";
import { StaticRouter } from "react-router";
import PageRoutes from "./PageRoutes";
import NotFound from "./pages/NotFound/NotFound";
import { SsrDataContext } from "./SsrDataContext";
import { getPublishedArticlePage, getPublishedArticleSummaries, getPublishedArticleBySlug, getPublishedArticleIndex, getRelatedPublishedArticles } from "./supabase/articleService";
import { getPublishedDuruus } from "./supabase/duruusService";
import { getActivePublishedNotices } from "./supabase/noticesService";
import { createSectionId } from "./utils/articleSections";
import { parseServerArticleContent } from "./utils/serverArticleContent";

const pages = new Set([
  "/", "/shaykh", "/durous", "/artikel", "/kontakt", "/impressum", "/datenschutz"
]);

// Used by the production sitemap endpoint. Shares the same published-only RLS client.
export async function getSitemapArticles() {
  return getPublishedArticleIndex();
}

function getWeeklyLessons() {
  // Vite copies the editable public JSON into dist/data at build time.
  // The SSR function and the browser therefore read the same deployed file.
  const scheduleUrl = new URL("../dist/data/durus-schedule.json", import.meta.url);
  const parsed = JSON.parse(readFileSync(scheduleUrl, "utf8"));
  if (!Array.isArray(parsed.lessons)) throw new Error("Invalid published lesson schedule");
  return parsed.lessons
    .filter((lesson) => lesson.enabled !== false)
    .filter((lesson) => lesson.day && lesson.time && lesson.subject);
}

export async function renderPage(pathname, options = {}) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const data = { __ssrPath: path };
  let status = 200;

  if (path === "/") {
    data.lessons = getWeeklyLessons();
    data.articles = await getPublishedArticleSummaries(6);
  } else if (path === "/artikel") {
    const requestedPage = String(options.page ?? "1");
    if (!/^[1-9]\d{0,5}$/.test(requestedPage)) {
      status = 404;
      data.__notFoundPath = path;
    } else {
      const page = Number(requestedPage);
      const archive = await getPublishedArticlePage(page);
      if (page > archive.pageCount || (page > 1 && archive.articles.length === 0)) {
        status = 404;
        data.__notFoundPath = path;
      } else {
        data.articles = archive.articles;
        data.pagination = {
          page: archive.page,
          pageSize: archive.pageSize,
          totalCount: archive.totalCount,
          pageCount: archive.pageCount,
        };
        data.__ssrPage = page;
      }
    }
  } else if (path === "/durous") {
    data.lessons = getWeeklyLessons();
    const [duruus, notices] = await Promise.all([
      getPublishedDuruus(),
      getActivePublishedNotices().catch((error) => {
        console.error("Aktuelle Hinweise konnten serverseitig nicht geladen werden:", error);
        return [];
      }),
    ]);
    data.duruus = duruus;
    data.notices = notices;
  } else if (path.startsWith("/artikel/")) {
    const slug = path.slice("/artikel/".length);
    if (slug && !slug.includes("/")) {
      data.article = await getPublishedArticleBySlug(slug);
    }
    if (!data.article) {
      status = 404;
      data.__notFoundPath = path;
    } else {
      data.articleContent = parseServerArticleContent(data.article.contentHtml, createSectionId);
      data.relatedArticles = await getRelatedPublishedArticles(data.article).catch((error) => {
        console.error("Verwandte Artikel konnten nicht geladen werden:", error);
        return [];
      });
    }
  } else if (!pages.has(path)) {
    status = 404;
  }

  const markup = renderToString(
    <StaticRouter location={path}>
      <SsrDataContext.Provider value={data}>
        <div className="app">
          {status === 404 ? <NotFound /> : <PageRoutes />}
        </div>
      </SsrDataContext.Provider>
    </StaticRouter>
  );

  return { markup, data, status, pathname: path };
}
