import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import PageRoutes from "./PageRoutes";
import NotFound from "./pages/NotFound/NotFound";
import { SsrDataContext } from "./SsrDataContext";
import { getPublishedArticles, getPublishedArticleBySlug } from "./supabase/articleService";
import { getPublishedDuruus } from "./supabase/duruusService";
import { getActivePublishedNotices } from "./supabase/noticesService";

const pages = new Set([
  "/", "/shaykh", "/durous", "/artikel", "/kontakt", "/impressum", "/datenschutz"
]);

export async function renderPage(pathname) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const data = {};
  let status = 200;

  if (path === "/" || path === "/artikel") {
    data.articles = await getPublishedArticles();
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
    if (!data.article) status = 404;
  } else if (!pages.has(path)) {
    status = 404;
  }

  const markup = renderToString(
    <StaticRouter location={path}>
      <SsrDataContext.Provider value={data}>
        <div className="app">
          {status === 404 && path.startsWith("/artikel/") ? <NotFound /> : <PageRoutes />}
        </div>
      </SsrDataContext.Provider>
    </StaticRouter>
  );

  return { markup, data, status, pathname: path };
}
