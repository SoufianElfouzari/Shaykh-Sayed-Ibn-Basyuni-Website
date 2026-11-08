import { useEffect, useLayoutEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import PageRoutes from "./PageRoutes";
import NotFound from "./pages/NotFound/NotFound";
import { SsrDataContext } from "./SsrDataContext";

const routeMetadata = {
  "/": {
    title: "Islam lernen auf Deutsch | Shaykh Sayed Ibn Basyuni",
    description: "Islam lernen auf Deutsch: Unterrichte und Artikel von Shaykh Sayed Ibn Basyuni zu Fiqh, Aqidah und weiteren islamischen Wissenschaften.",
  },
  "/shaykh": {
    title: "Shaykh Sayed Ibn Basyuni | Biografie und Werdegang",
    description: "Biografie von Dr. Shaykh Sayed Ibn Basyuni: Ausbildung an der Al-Azhar-Universität, Lehrer, Forschung und islamische Unterrichte in Kassel.",
  },
  "/durous": {
    title: "Islamische Unterrichte und Durous | Shaykh Sayed",
    description: "Islamische Unterrichte von Shaykh Sayed Ibn Basyuni: Fiqh-Unterrichtszeiten in Kassel, aktuelle Hinweise und veröffentlichte Durous als Audioaufnahmen.",
  },
  "/artikel": {
    title: "Islamische Artikel auf Deutsch | Shaykh Sayed Ibn Basyuni",
    description: "Islamische Artikel auf Deutsch von Shaykh Sayed Ibn Basyuni. Entdecke veröffentlichte Beiträge zu islamischen Wissenschaften und vertiefe dein Wissen.",
  },
  "/kontakt": {
    title: "Kontakt | Shaykh Sayed Ibn Basyuni",
    description: "Kontaktmöglichkeiten und Informationen zur offiziellen Website von Shaykh Sayed Ibn Basyuni.",
  },
  "/impressum": {
    title: "Impressum | Shaykh Sayed Ibn Basyuni",
    description: "Impressum und rechtliche Angaben zur Website von Shaykh Sayed Ibn Basyuni.",
  },
  "/datenschutz": {
    title: "Datenschutz | Shaykh Sayed Ibn Basyuni",
    description: "Datenschutzhinweise und Informationen über den Umgang mit personenbezogenen Daten auf shaykh-sayed.de.",
  },
};

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
      document.title = "Seite nicht gefunden | Shaykh Sayed";
      updateMeta("name", "description", "Die gesuchte Seite oder der Artikel ist nicht verfügbar.");
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

    const metadata = routeMetadata[normalizedPath];
    if (metadata) {
      document.documentElement.lang = "de";
      document.documentElement.dir = "ltr";
      updateMeta("property", "og:locale", "de_DE");
      updateMeta("name", "twitter:card", "summary");
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
