import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: process.env.TEST_BROWSER || "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve.mjs",
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
