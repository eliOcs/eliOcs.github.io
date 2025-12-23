import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  maxFailures: 1,
  expect: {
    timeout: 3000,
  },
  use: {
    baseURL: "http://localhost:3000",
    actionTimeout: 5000,
  },
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
