/**
 * END-TO-END TESTS — run with `npm run test:e2e` (Playwright + real Chromium)
 *
 * Loads the real app over HTTP and clicks like a user. This is the ONLY
 * tier that verifies app/page.tsx assembled correctly: the <h1> below lives
 * in the page, not in <CartDemo />.
 *
 * Tier 3 of 3:
 *   1. UNIT      lib/cart.test.ts
 *   2. COMPONENT components/cart-demo.test.tsx
 *   3. E2E       e2e/cart.spec.ts  ← you are here (hand-written)
 *                e2e/test-cases.spec.ts (generated from the CSV)
 */

import { test, expect } from "@playwright/test";

test("home page shows the heading and an empty cart", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Automated Testing CI Lab" }),
  ).toBeVisible();
  await expect(page.getByTestId("total")).toHaveText("$0.00");
});

test("adding two hoodies applies the 10% discount", async ({ page }) => {
  await page.goto("/");

  const hoodie = page.getByRole("button", { name: "Add Hoodie" });
  await hoodie.click();
  await hoodie.click();

  await expect(page.getByTestId("item-count")).toHaveText("2");
  await expect(page.getByTestId("subtotal")).toHaveText("$120.00");
  await expect(page.getByTestId("discount")).toHaveText("-$12.00");
  await expect(page.getByTestId("total")).toHaveText("$108.00");
});
