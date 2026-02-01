import { expect, test as setup } from "@playwright/test";

const STORAGE_STATE_PATH = "tests/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Navigate to the login page
  await page.goto("/login");

  // Wait for the Playwright test login button (only visible in test mode)
  const testLoginButton = page.getByTestId("playwright-login");
  await expect(testLoginButton).toBeVisible({ timeout: 15000 });

  // Click the test login button
  await testLoginButton.click();

  // Wait for redirect to home page (authenticated)
  await page.waitForURL("/", { timeout: 30000 });

  // Verify we're authenticated by checking for an element that only shows when logged in
  await expect(page.getByTestId("multimodal-input")).toBeVisible({
    timeout: 30000,
  });

  // Save the authentication state
  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
