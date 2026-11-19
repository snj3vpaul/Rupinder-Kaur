import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT || 3123);
// Optional: point at an installed Chrome (e.g. CHROME_PATH=/usr/bin/google-chrome) instead of downloaded browsers.
// SwiftShader keeps WebGL deterministic in headless CI.
const args = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
const launchOptions = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, args } : { args };

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    launchOptions,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.BASE_URL ? undefined : {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
