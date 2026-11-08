import { renderToString } from "react-dom/server";
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

export async function renderPage(pathname) {
  const requestedUrl = new URL(pathname, "https://www.shaykh-sayed.de");
  const path = requestedUrl.pathname === "/" ? "/" : requestedUrl.pathname.replace(/\/+$/, "");
  const data = { __ssrPath: path };
  let status = 200;

  if (path === "/") {
    data.articles = await getPublishedArticleSummaries();
  } else if (path === "/artikel") {
    const rawPage = requestedUrl.searchParams.get("page");
    const requestedPage = rawPage === null ? 1 : Number(rawPage);
    if ((rawPage !== null && !/^[1-9]\\d*$/.test(rawPage)) ||
        !Number.isSafeInteger(requestedPage) || requestedPage > 1000000) {
      status = 404;
    } else {
      const archive = await getPublishedArticlePage(requestedPage);
      if (requestedPage > archive.totalPages) {
        status = 404;
      } else {
        data.articles = archive.articles;
        data.archivePagination = {
          page: archive.page,
          total: archive.total,
          totalPages: archive.totalPages,
        };
      }
    }
  } else if (path === "/durous") {
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

  if (status === 404) {
    data.__notFoundPath = path + requestedUrl.search;
  }

  const markup = renderToString(
    <StaticRouter location={path + requestedUrl.search}>
      <SsrDataContext.Provider value={data}>
        <div className="app">
          {status === 404 ? <NotFound /> : <PageRoutes />}
        </div>
      </SsrDataContext.Provider>
    </StaticRouter>
  );

  return { markup, data, status, pathname: path, search: requestedUrl.search };
}
