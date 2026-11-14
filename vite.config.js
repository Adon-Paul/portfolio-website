import { directoryDevPlugin } from "./scripts/site-directory.mjs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { guideMarkdownPlugin } from "./scripts/guides/compile.mjs";
export default defineConfig({
  build: { minify: "terser", terserOptions: { compress: { passes: 2 } } },
  base: "/",
  plugins: [guideMarkdownPlugin(), react(), directoryDevPlugin()],
  server: { port: 3000, open: false },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    include: ["src/**/*.test.{js,jsx}"],
  },
});
