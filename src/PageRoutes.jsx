import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Shaykh from "./pages/Shaykh/Shaykh";
import Duruus from "./pages/Duruus/Duruus";
import Articles from "./pages/Articles/Articles";
import ArticleDetails from "./pages/Articles/components/ArticleDetails/ArticleDetails";
import Contact from "./pages/Contact/Contact";
import Datenschutz from "./pages/Datenschutz/Datenschutz";
import Impressum from "./pages/Impressum/Impressum";
import NotFound from "./pages/NotFound/NotFound";

export default function PageRoutes() {
  return (
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
  );
}
