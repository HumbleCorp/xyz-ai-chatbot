import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import { config } from "dotenv";

config({
  path: ".env.local",
});

/* Use process.env.PORT by default and fallback to port 3000 */
const PORT = process.env.PORT || 3000;

/**
 * Set webServer.url and use.baseURL with the location
 * of the WebServer respecting the correct set port
 */
const baseURL = `http://localhost:${PORT}`;

const STORAGE_STATE_PATH = "tests/.auth/user.json";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Limit workers to prevent browser crashes */
  workers: process.env.CI ? 2 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
  },

  /* Configure global timeout for each test */
  timeout: 240 * 1000, // 240 seconds
  expect: {
    timeout: 240 * 1000,
  },

  /* Configure projects */
  projects: [
    // Setup project - authenticates and saves state
    {
      name: "setup",
      testMatch: /global-setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // Auth tests - run without authentication (test login page, etc.)
    {
      name: "auth",
      testMatch: /e2e\/auth\.test\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // E2E tests - run with authentication
    {
      name: "e2e",
      testMatch: /e2e\/(?!auth).*\.test\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE_PATH,
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "PLAYWRIGHT=True NEXT_PUBLIC_PLAYWRIGHT=true pnpm dev",
    url: `${baseURL}/ping`,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
