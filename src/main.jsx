import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/site.css";
import "./styles/guides.css";
import { readPalette, applyPalette } from "./content/palette";
import { guideAtPath } from "./content/guides";
import { loadGuide } from "./guides/loadGuide";
applyPalette(readPalette());
const root = document.getElementById("root");
const path = root.dataset.route || window.location.pathname;
async function start() {
  const guide = guideAtPath(path);
  let article = null;
  try {
    if (guide) article = await loadGuide(guide.slug);
  } catch {
    // Keep the complete prerendered page usable when its enhancement chunk fails.
    if (!root.hasChildNodes())
      root.textContent = "This guide could not load. Please reload the page.";
    return;
  }
  const app = (
    <React.StrictMode>
      <App path={path} guideArticle={article} />
    </React.StrictMode>
  );
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
  document.documentElement.classList.add("js");
}
start();
