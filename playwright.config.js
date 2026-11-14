import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  // Hosted runners render WebGL in software; isolate browsers and allow
  // longer workflows while retaining every behavioral assertion.
  workers: process.env.CI ? 1 : 2,
  timeout: process.env.CI ? 90000 : 30000,
  expect: { timeout: process.env.CI ? 15000 : 5000 },
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
