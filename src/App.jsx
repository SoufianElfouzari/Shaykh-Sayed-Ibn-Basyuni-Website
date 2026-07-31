import { useLayoutEffect } from "react";
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
            path="/duruus"
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;