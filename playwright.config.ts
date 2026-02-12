import { defineConfig, devices } from "@playwright/test";
import path from "path";

const WEB_URL = process.env.WEB_URL ?? "http://localhost:8080";
const API_URL = process.env.API_URL ?? "http://localhost:3000/api";

const authFile = path.join(__dirname, "playwright", ".auth", "user.json");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,

  use: {
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    // 1) Generates storageState once
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: { baseURL: WEB_URL },
    },

    // 2) Unauthenticated UI tests
    {
      name: "chromium",
      testIgnore: /.*\.auth\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: WEB_URL },
    },

    // 3) Authenticated UI tests (depends on setup)
    {
      name: "chromium-auth",
      dependencies: ["setup"],
      testMatch: /.*\.auth\.spec\.ts/,
      use: { storageState: authFile, baseURL: WEB_URL, ...devices["Desktop Chrome"] },
    },

    // 4) API contract tests (no browser needed)
    {
      name: "api",
      testMatch: /contracts\/.*\.spec\.ts/,
      use: { baseURL: API_URL },
    },
  ],
});
