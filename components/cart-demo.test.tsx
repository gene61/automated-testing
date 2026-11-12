/**
 * COMPONENT TESTS — run with `npm test` (Vitest + jsdom, no real browser)
 *
 * Renders <CartDemo /> into a simulated DOM and clicks its buttons.
 * Tests the UI wiring: state, handlers, what appears on screen.
 * Does NOT test the pricing formulas directly (that's lib/cart.test.ts)
 * and does NOT test the real page (that's e2e/).
 *
 * Tier 2 of 3:
 *   1. UNIT      lib/cart.test.ts
 *   2. COMPONENT components/cart-demo.test.tsx  ← you are here
 *   3. E2E       e2e/*.spec.ts
 */

import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartDemo from "@/components/cart-demo";

describe("CartDemo", () => {
  test("starts empty", () => {
    render(<CartDemo />);

    expect(screen.getByTestId("item-count")).toHaveTextContent("0");
    expect(screen.getByTestId("total")).toHaveTextContent("$0.00");
  });

  test("adds items and updates the summary", async () => {
    const user = userEvent.setup();
    render(<CartDemo />);

    await user.click(screen.getByRole("button", { name: /add t-shirt/i }));

    expect(screen.getByTestId("item-count")).toHaveTextContent("1");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("$25.00");
    expect(screen.getByTestId("discount")).toHaveTextContent("-$0.00");
    expect(screen.getByTestId("total")).toHaveTextContent("$25.00");
  });

  test("applies the 10% discount once the threshold is reached", async () => {
    const user = userEvent.setup();
    render(<CartDemo />);

    const hoodie = screen.getByRole("button", { name: /add hoodie/i });
    await user.click(hoodie);
    await user.click(hoodie);

    expect(screen.getByTestId("subtotal")).toHaveTextContent("$120.00");
    expect(screen.getByTestId("discount")).toHaveTextContent("-$12.00");
    expect(screen.getByTestId("total")).toHaveTextContent("$108.00");
  });
});
