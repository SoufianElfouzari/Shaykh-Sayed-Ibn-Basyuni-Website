import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

const port = 4179;
const baseURL = "http://127.0.0.1:" + port;

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/e2e/**/*.spec.js", "**/accessibility/**/*.spec.js"],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30000,
  expect: { timeout: 10000 },
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: false,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "node --import ./tests/fixtures/install-fetch.mjs tests/support/ssr-server.mjs",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 45000,
    env: { QA_TEST_PORT: String(port) },
  },
});
