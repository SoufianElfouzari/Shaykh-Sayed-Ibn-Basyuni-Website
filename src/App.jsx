import { useEffect, useLayoutEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import "./App.css";
import PageRoutes from "./PageRoutes";
import { SsrDataContext } from "./SsrDataContext";

function RouteSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const canonicalUrl = "https://shaykh-sayed.de" + normalizedPath;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);
  }, [pathname]);
  return null;
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
        <RouteSeo />
        <div className="app">
          <PageRoutes />
        </div>
      </BrowserRouter>
    </SsrDataContext.Provider>
  );
}
