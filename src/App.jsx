import { useEffect, useLayoutEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import ClientPageRoutes from "./ClientPageRoutes";
import NotFound from "./pages/NotFound/NotFound";
import { SsrDataContext } from "./SsrDataContext";
import { staticMetadata, SITE_ORIGIN } from "./utils/staticSeo";
import { SITE_FALLBACK_IMAGE } from "./utils/articleSeo";


function updateMeta(attribute, key, value) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

function RouteSeo({ notFoundPath }) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const isArticle = /^\/artikel\/[^/]+$/.test(path);
    const metadata = staticMetadata[path];
    const isNotFound = notFoundPath === path || (!metadata && !isArticle);
    const canonical = document.head.querySelector('link[rel="canonical"]');

    if (isNotFound) {
      canonical?.remove();
      document.title = "Seite nicht gefunden | Shaykh Sayed";
      updateMeta("name", "robots", "noindex, follow");
      updateMeta("name", "description", "Die gesuchte Seite oder der Artikel ist nicht verfügbar.");
      updateMeta("property", "og:type", "website");
      updateMeta("property", "og:title", document.title);
      updateMeta("property", "og:description", "Die gesuchte Seite oder der Artikel ist nicht verfügbar.");
      document.head.querySelector('meta[property="og:url"]')?.remove();
      return;
    }

    const archivePage = path === "/artikel"
      ? Number(new URLSearchParams(search).get("page") || 1)
      : 1;
    const suffix = path === "/artikel" && Number.isSafeInteger(archivePage) && archivePage > 1
      ? "?page=" + archivePage
      : "";
    const canonicalUrl = SITE_ORIGIN + path + suffix;
    let canonicalElement = canonical;
    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute("href", canonicalUrl);
    updateMeta("name", "robots", "index, follow, max-image-preview:large");
    updateMeta("property", "og:url", canonicalUrl);

    // ArticleDetails is authoritative for the article-specific SEO metadata.
    if (isArticle) return;

    document.title = metadata.title;
    updateMeta("name", "description", metadata.description);
    updateMeta("property", "og:title", metadata.title);
    updateMeta("property", "og:description", metadata.description);
    updateMeta("property", "og:type", "website");
    updateMeta("property", "og:image", SITE_FALLBACK_IMAGE);
    updateMeta("name", "twitter:title", metadata.title);
    updateMeta("name", "twitter:description", metadata.description);
    updateMeta("name", "twitter:image", SITE_FALLBACK_IMAGE);
    document.head.querySelectorAll(
      'meta[property="article:published_time"], meta[property="article:modified_time"], meta[name="author"]',
    ).forEach((element) => element.remove());
  }, [pathname, search, notFoundPath]);
  return null;
}

function ClientRoutes({ notFoundPath }) {
  const { pathname } = useLocation();
  if (notFoundPath && pathname === notFoundPath) {
    return <NotFound />;
  }
  return <ClientPageRoutes />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App({ initialData = {} }) {
  return (
    <SsrDataContext.Provider value={initialData}>
      <BrowserRouter>
        <ScrollToTop />
        <RouteSeo notFoundPath={initialData.__notFoundPath} />
        <div className="app">
          <ClientRoutes notFoundPath={initialData.__notFoundPath} />
        </div>
      </BrowserRouter>
    </SsrDataContext.Provider>
  );
}
