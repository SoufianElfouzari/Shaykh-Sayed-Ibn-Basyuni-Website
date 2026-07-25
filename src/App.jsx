import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Shaykh from "./pages/Shaykh/Shaykh";
import Duruus from "./pages/Duruus/Duruus";
import Articles from "./pages/Articles/Articles";
import ArticleDetails from "./pages/Articles/components/ArticleDetails/ArticleDetails";


function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/shaykh"
            element={<Shaykh />}
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;