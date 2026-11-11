import { renderToString } from "react-dom/server";
import App from "./App";
export { projects, projectPath } from "./content/projects";
export function render(path) {
  return renderToString(<App path={path} />);
}
