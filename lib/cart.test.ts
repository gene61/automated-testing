/**
 * UNIT TESTS — run with `npm test` (Vitest, no browser)
 *
 * Tests the pure pricing functions in lib/cart.ts by calling them directly.
 * No React, no DOM, no server. Fastest tier (~4ms for all 11).
 *
 * Tier 1 of 3:
 *   1. UNIT      lib/cart.test.ts             ← you are here
 *   2. COMPONENT components/cart-demo.test.tsx
 *   3. E2E       e2e/*.spec.ts
 */

import { describe, expect, test } from "vitest";
import {
  type CartItem,
  lineTotal,
  subtotal,
  discount,
  total,
  formatCents,
  DISCOUNT_THRESHOLD_IN_CENTS,
} from "@/lib/cart";

function item(priceInCents: number, quantity = 1): CartItem {
  return { id: "x", name: "Item", priceInCents, quantity };
}

describe("lineTotal", () => {
  test("multiplies price by quantity", () => {
    expect(lineTotal(item(2_500, 3))).toBe(7_500);
  });

  test("is zero when quantity is zero", () => {
    expect(lineTotal(item(2_500, 0))).toBe(0);
  });
});

describe("subtotal", () => {
  test("is zero for an empty cart", () => {
    expect(subtotal([])).toBe(0);
  });

  test("sums every line", () => {
    expect(subtotal([item(2_500, 2), item(500)])).toBe(5_500);
  });
});

describe("discount", () => {
  test("does not apply below the threshold", () => {
    expect(discount([item(DISCOUNT_THRESHOLD_IN_CENTS - 1)])).toBe(0);
  });

  test("applies at exactly the threshold", () => {
    expect(discount([item(DISCOUNT_THRESHOLD_IN_CENTS)])).toBe(1_000);
  });

  test("applies above the threshold", () => {
    expect(discount([item(30_000)])).toBe(3_000);
  });
});

describe("total", () => {
  test("is the subtotal when there is no discount", () => {
    expect(total([item(2_500)])).toBe(2_500);
  });

  test("subtracts the discount once the threshold is reached", () => {
    expect(total([item(15_000)])).toBe(13_500);
  });
});

describe("formatCents", () => {
  test("formats cents as dollars", () => {
    expect(formatCents(12_345)).toBe("$123.45");
  });

  test("keeps two decimal places", () => {
    expect(formatCents(500)).toBe("$5.00");
  });
});
