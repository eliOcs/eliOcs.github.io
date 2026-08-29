import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  maxFailures: 1,
  expect: {
    timeout: 3000,
    toHaveScreenshot: {
      // Share baselines across operating systems while tolerating minor
      // differences in browser font rasterization.
      pathTemplate:
        "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}",
      maxDiffPixelRatio: 0.005,
    },
  },
  use: {
    baseURL: "http://localhost:3000",
    actionTimeout: 5000,
  },
  webServer: {
    command: "npm run serve",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
