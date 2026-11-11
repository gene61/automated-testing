import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // One test at a time locally so the headed browser is easy to follow.
  workers: process.env.CI ? 1 : 1,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    launchOptions: {
      // Pause between each action so you can watch it happen.
      // Set to 0 (or use CI) for normal speed.
      slowMo: process.env.CI ? 0 : 800,
    },
  },
  projects: [
    {
      name: "chromium",
      // Visible browser locally so you can follow along; headless on CI,
      // which has no display.
      use: { ...devices["Desktop Chrome"], headless: !!process.env.CI },
    },
  ],
  // CI runs the already-built production server (`npm run build` + `next start`)
  // to test what users actually get. Locally it boots the dev server.
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
