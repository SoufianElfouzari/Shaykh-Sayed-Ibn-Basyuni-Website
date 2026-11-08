import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";

// Keep the homepage in the initial client bundle. Load other pages only
// when actually visited. ServerPageRoutes renders the full tree for SSR.
const Shaykh = lazy(() => import("./pages/Shaykh/Shaykh"));
const Duruus = lazy(() => import("./pages/Duruus/Duruus"));
const Articles = lazy(() => import("./pages/Articles/Articles"));
const ArticleDetails = lazy(() => import("./pages/Articles/components/ArticleDetails/ArticleDetails"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Datenschutz = lazy(() => import("./pages/Datenschutz/Datenschutz"));
const Impressum = lazy(() => import("./pages/Impressum/Impressum"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

export default function ClientPageRoutes() {
  return (
    <Suspense fallback={<div role="status" aria-live="polite">Seite wird geladen.</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shaykh" element={<Shaykh />} />
        <Route path="/durous" element={<Duruus />} />
        <Route path="/artikel" element={<Articles />} />
        <Route path="/artikel/:slug" element={<ArticleDetails />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
