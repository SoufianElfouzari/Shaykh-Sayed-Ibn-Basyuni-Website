import { useEffect, useLayoutEffect } from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Shaykh from "./pages/Shaykh/Shaykh";
import Duruus from "./pages/Duruus/Duruus";
import Articles from "./pages/Articles/Articles";
import ArticleDetails from "./pages/Articles/components/ArticleDetails/ArticleDetails";
import Contact from "./pages/Contact/Contact";
import Datenschutz from "./pages/Datenschutz/Datenschutz";
import Impressum from "./pages/Impressum/Impressum";
import NotFound from "./pages/NotFound/NotFound";

function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const canonicalUrl = `https://shaykh-sayed.de${normalizedPath}`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);

    const alternates = document.querySelectorAll('link[rel="alternate"][hreflang]');
    alternates.forEach((alternate) => alternate.setAttribute("href", canonicalUrl));
  }, [pathname]);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteSeo />

      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shaykh"
            element={<Shaykh />}
          />

          <Route
            path="/durous"
            element={<Duruus />}
          />

          <Route
            path="/artikel"
            element={<Articles />}
          />

          <Route
            path="/artikel/:slug"
            element={<ArticleDetails />}
          />

          <Route
            path="/kontakt"
            element={<Contact />}
          />

          <Route
            path="/datenschutz"
            element={<Datenschutz />}
          />

          <Route
            path="/impressum"
            element={<Impressum />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;