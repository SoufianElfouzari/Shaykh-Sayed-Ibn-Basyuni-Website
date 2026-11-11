import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./a11y-contrast.css";

const root = document.getElementById("root");
const ssrDataElement = document.getElementById("ssr-data");
const hasServerData = Boolean(ssrDataElement);
const initialData = hasServerData
  ? JSON.parse(ssrDataElement.content.textContent || "{}")
  : {};
const app = (
  <StrictMode>
    <App initialData={initialData} />
  </StrictMode>
);

// Production SSR renders the complete React tree into #root.
// The static Vite fallback is not React SSR and must be mounted normally.
if (hasServerData && root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
