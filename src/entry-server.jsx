import { renderToString } from "react-dom/server";
import App from "./App";
import { guideAtPath } from "./content/guides";
import { loadGuide } from "./guides/loadGuide";
export { projects, projectPath } from "./content/projects";
export { guides, guidePath } from "./content/guides";
export async function render(path) {
  const guide = guideAtPath(path);
  const article = guide ? await loadGuide(guide.slug) : null;
  return renderToString(<App path={path} guideArticle={article} />);
}
