import { expect, test } from "@playwright/test";

test.describe("Authentication Pages", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
    await expect(
      page.getByText("Sign in with your @xyz.vc Google account")
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continue with Google" })
    ).toBeVisible();
  });

  test("unauthenticated users are redirected to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });
});
