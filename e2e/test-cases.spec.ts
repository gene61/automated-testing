/**
 * END-TO-END TESTS (data-driven) — run with `npm run test:e2e`
 * (Playwright + real Chromium)
 *
 * Runs every row in test-cases/cart-cases.csv as an E2E test: one row = one
 * browser test. This file never changes when cases are added — edit the CSV.
 *
 * Tier 3 of 3:
 *   1. UNIT      lib/cart.test.ts
 *   2. COMPONENT components/cart-demo.test.tsx
 *   3. E2E       e2e/test-cases.spec.ts  ← you are here
 *                e2e/cart.spec.ts (hand-written page checks)
 *
 * Reached via: test-cases/cart-cases.csv -> lib/test-cases.ts -> this file
 */

import { test, expect } from "@playwright/test";
import { loadTestCases } from "../lib/test-cases";

const testCases = loadTestCases();

test.describe("predetermined cart test cases", () => {
  for (const testCase of testCases) {
    test(`${testCase.id} ${testCase.title}`, async ({ page }) => {
      await page.goto("/");

      // Apply the cart actions for this case.
      for (const { product, quantity } of testCase.adds) {
        const button = page.getByRole("button", {
          name: `Add ${PRODUCT_LABELS[product]}`,
        });
        for (let i = 0; i < quantity; i += 1) {
          await button.click();
        }
      }

      // Assert the expected summary.
      await expect(page.getByTestId("subtotal")).toHaveText(testCase.subtotal);
      await expect(page.getByTestId("discount")).toHaveText(testCase.discount);
      await expect(page.getByTestId("total")).toHaveText(testCase.total);
    });
  }
});

/** Product keys used in the CSV mapped to the names shown in the UI. */
const PRODUCT_LABELS: Record<string, string> = {
  tshirt: "T-shirt",
  hoodie: "Hoodie",
  stickers: "Sticker pack",
};
