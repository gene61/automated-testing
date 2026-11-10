/**
 * The interactive half of the practice app: a cart you can click.
 *
 * This component holds NO pricing logic. It only stores quantities, then asks
 * the pure functions in lib/cart.ts for the numbers to display. That split is
 * what lets the rules be unit tested without a browser, and lets this file be
 * tested by clicking (component test) or by a real browser (E2E test).
 */

// "use client" marks this as a Client Component. Next.js then ships it to the
// browser so React can run useState/onClick. Without this line the component
// would render on the server only, and clicks would do nothing.
"use client";

import { useState } from "react";
import {
  type CartItem,
  formatCents,
  subtotal,
  discount,
  total,
} from "@/lib/cart";

/**
 * The products on sale — fixed data, not state.
 *
 * `Omit<CartItem, "quantity">` means "a CartItem without the quantity field":
 * the catalog knows the price, while how many are in the cart is decided at
 * runtime by `quantities` below.
 *
 * Prices are in cents (2_500 = $25.00) so money math stays in whole numbers.
 */
const CATALOG: Omit<CartItem, "quantity">[] = [
  { id: "tshirt", name: "T-shirt", priceInCents: 2_500 },
  { id: "hoodie", name: "Hoodie", priceInCents: 6_000 },
  { id: "stickers", name: "Sticker pack", priceInCents: 500 },
];

export default function CartDemo() {
  /**
   * The ONLY state in this component: product id -> how many are in the cart.
   *
   * It is intentionally a map instead of a list of items, because a map makes
   * "add one more of this product" a single lookup-and-increment. Everything
   * else (items, subtotal, discount, total) is derived on each render, so there
   * is only one source of truth and nothing can drift out of sync.
   */
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  /**
   * Derived cart: the catalog joined with the current quantities.
   *
   * - `.map` gives every product its quantity (defaulting to 0 when absent).
   * - `.filter` drops anything not in the cart, which is why the cart starts
   *   empty and why `subtotal([])` returns 0 with no special-casing.
   */
  const items: CartItem[] = CATALOG.map((product) => ({
    ...product,
    quantity: quantities[product.id] ?? 0,
  })).filter((item) => item.quantity > 0);

  /**
   * Adds one of the given product.
   *
   * The updater function form `setQuantities(current => ...)` is used instead of
   * `setQuantities({ ...quantities, ... })` so rapid clicks can't read a stale
   * copy of the state and overwrite each other.
   */
  function add(id: string) {
    setQuantities((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }

  return (
    // `aria-labelledby` ties the section to its heading, giving screen readers
    // (and getByRole("region") in tests) a proper name for this area.
    <section
      aria-labelledby="cart-heading"
      className="w-full max-w-md rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
    >
      <h2 id="cart-heading" className="text-xl font-semibold">
        Demo cart
      </h2>
      {/* 10_000 cents is hard-coded here on purpose: this is display copy, not
          the rule. The rule itself lives in lib/cart.ts. */}
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Spend {formatCents(10_000)} or more to get 10% off.
      </p>

      <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
        {/* `key` lets React match each row between renders instead of rebuilding. */}
        {CATALOG.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between gap-4 py-3"
          >
            <span>
              {product.name}{" "}
              <span className="text-sm text-zinc-500">
                {formatCents(product.priceInCents)}
              </span>
            </span>
            {/* `aria-label` gives the button a unique accessible name:
                "Add Hoodie", "Add T-shirt". All three buttons read "Add" on
                screen, so without this a test searching for "Add" would match
                three elements and be ambiguous. It also helps screen readers. */}
            <button
              type="button"
              onClick={() => add(product.id)}
              aria-label={`Add ${product.name}`}
              className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Add
            </button>
          </li>
        ))}
      </ul>

      {/* A definition list (<dl>) is the semantically correct element for
          label/value pairs like these. */}
      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt>Items</dt>
          {/* `data-testid` is a stable hook for tests. Tests could also use the
              visible text, but test ids survive copy changes and styling. */}
          <dd data-testid="item-count">
            {/* Total number of units, so 2 hoodies counts as 2 (distinct from
                "2 different products"). */}
            {items.reduce((sum, item) => sum + item.quantity, 0)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd data-testid="subtotal">{formatCents(subtotal(items))}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Discount</dt>
          {/* The minus sign is rendered here rather than returned by the pricing
              function, which only ever returns a positive amount (0 when the
              threshold is not reached) — hence "-$0.00" for an empty cart. */}
          <dd data-testid="discount">-{formatCents(discount(items))}</dd>
        </div>
        <div className="flex justify-between font-semibold">
          <dt>Total</dt>
          <dd data-testid="total">{formatCents(total(items))}</dd>
        </div>
      </dl>
    </section>
  );
}
