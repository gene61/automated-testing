/**
 * Cart pricing rules — the "business logic" half of this practice project.
 *
 * Keep the rules here, not in components: pure functions are easy to unit test,
 * and unit tests are what give you a fast, reliable CI signal on every push.
 */

export type CartItem = {
  id: string;
  name: string;
  /** Price in cents, to avoid floating-point money bugs. */
  priceInCents: number;
  quantity: number;
};

export const DISCOUNT_THRESHOLD_IN_CENTS = 10_000; // $100.00
export const DISCOUNT_RATE = 0.1; // 10%

export function lineTotal(item: CartItem): number {
  return item.priceInCents * item.quantity;
}

export function subtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

/**
 * A single 10% discount applies once the subtotal reaches the threshold.
 * Returns the amount discounted, in cents (rounded to the nearest cent).
 */
export function discount(items: CartItem[]): number {
  const total = subtotal(items);
  if (total < DISCOUNT_THRESHOLD_IN_CENTS) {
    return 0;
  }
  return Math.round(total * DISCOUNT_RATE);
}

export function total(items: CartItem[]): number {
  return subtotal(items) - discount(items);
}

/** Formats cents as dollars, e.g. 12345 -> "$123.45". */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
