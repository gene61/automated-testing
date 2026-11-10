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
