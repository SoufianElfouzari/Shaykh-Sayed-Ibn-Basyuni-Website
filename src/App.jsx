import { useEffect, useLayoutEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import PageRoutes from "./PageRoutes";
import NotFound from "./pages/NotFound/NotFound";
import { SsrDataContext } from "./SsrDataContext";
import { SITE_FALLBACK_IMAGE } from "./utils/articleSeo";
import { getRouteMetadata, notFoundMetadata, routeMetadata } from "./utils/routeSeo";

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
    const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const rawPage = normalizedPath === "/artikel" ? new URLSearchParams(search).get("page") : null;
    const invalidPage = rawPage !== null && (!/^[1-9]\d*$/.test(rawPage) || !Number.isSafeInteger(Number(rawPage)));
    const pageQuery = rawPage !== null && !invalidPage && Number(rawPage) > 1 ? "?page=" + Number(rawPage) : "";
    const canonicalUrl = "https://www.shaykh-sayed.de" + normalizedPath + pageQuery;
    const knownRoute = Object.hasOwn(routeMetadata, normalizedPath) || /^\/artikel\/[^/]+$/.test(normalizedPath);
    const isNotFound = normalizedPath + search === notFoundPath || !knownRoute || invalidPage;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (isNotFound) {
      document.documentElement.lang = "de";
      document.documentElement.dir = "ltr";
      canonical?.remove();
      updateMeta("name", "robots", "noindex, follow");
      document.title = notFoundMetadata.title;
      updateMeta("name", "description", notFoundMetadata.description);
      updateMeta("property", "og:title", notFoundMetadata.title);
      updateMeta("property", "og:description", notFoundMetadata.description);
      updateMeta("name", "twitter:title", notFoundMetadata.title);
      updateMeta("name", "twitter:description", notFoundMetadata.description);
      return;
    }
    updateMeta("name", "robots", "index, follow, max-image-preview:large");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    updateMeta("property", "og:url", canonicalUrl);

    const metadata = getRouteMetadata(normalizedPath, rawPage === null ? 1 : Number(rawPage));
    if (metadata) {
      document.documentElement.lang = "de";
      document.documentElement.dir = "ltr";
      updateMeta("property", "og:locale", "de_DE");
      updateMeta("name", "twitter:card", "summary");
      updateMeta("property", "og:image", SITE_FALLBACK_IMAGE);
      updateMeta("name", "twitter:image", SITE_FALLBACK_IMAGE);
      updateMeta("property", "og:image:alt", "Shaykh Sayed Ibn Basyuni - offizielles Logo");
      updateMeta("name", "twitter:image:alt", "Shaykh Sayed Ibn Basyuni - offizielles Logo");
      document.title = metadata.title;
      updateMeta("name", "description", metadata.description);
      updateMeta("property", "og:title", metadata.title);
      updateMeta("property", "og:description", metadata.description);
      updateMeta("name", "twitter:title", metadata.title);
      updateMeta("name", "twitter:description", metadata.description);
      updateMeta("property", "og:type", "website");
    }
  }, [pathname, search, notFoundPath]);
  return null;
}

function ClientRoutes({ notFoundPath }) {
  const { pathname, search } = useLocation();
  if (notFoundPath && pathname + search === notFoundPath) {
    return <NotFound />;
  }
  return <PageRoutes />;
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
