import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/site.css";
const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App path={root.dataset.route || window.location.pathname} />
  </React.StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
document.documentElement.classList.add("js");
