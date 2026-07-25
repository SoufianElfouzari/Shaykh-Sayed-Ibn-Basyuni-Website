import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Shaykh from "./pages/Shaykh/Shaykh";
import Duruus from "./pages/Duruus/Duruus";
import Articles from "./pages/Articles/Articles";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shaykh" element={<Shaykh />} />
          <Route path="/duruus" element={<Duruus />} />
          <Route path="/artikel" element={<Articles />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;