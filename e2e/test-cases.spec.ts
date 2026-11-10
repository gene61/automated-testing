import { test, expect } from "@playwright/test";
import { loadTestCases } from "../lib/test-cases";

/**
 * Runs every row in test-cases/cart-cases.csv as an end-to-end test.
 *
 * This file never changes when cases are added — edit the CSV instead.
 */

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
