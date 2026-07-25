import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Shaykh from "./pages/Shaykh/Shaykh";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shaykh" element={<Shaykh />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;