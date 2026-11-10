import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Loads the predetermined test cases from test-cases/cart-cases.csv.
 *
 * The CSV is the source of truth: adding a row adds a test, with no code
 * changes. Rows are validated so a typo fails loudly instead of silently
 * producing a test that checks nothing.
 */

const CSV_PATH = join(process.cwd(), "test-cases", "cart-cases.csv");

const COLUMNS = ["id", "title", "adds", "subtotal", "discount", "total"] as const;

export type TestCase = {
  id: string;
  title: string;
  /** Items to add, e.g. [{ product: "hoodie", quantity: 2 }] */
  adds: { product: string; quantity: number }[];
  subtotal: string;
  discount: string;
  total: string;
};

export function parseAdds(value: string, lineNumber: number): TestCase["adds"] {
  if (!value) {
    return [];
  }
  return value.split("|").map((part) => {
    const [product, quantityText] = part.split(":");
    const quantity = Number(quantityText);
    if (!product || !Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(
        `Test case CSV line ${lineNumber}: invalid "adds" entry "${part}" (expected "product:qty")`,
      );
    }
    return { product, quantity };
  });
}

export function parseTestCases(csv: string): TestCase[] {
  const lines = csv
    .split("\n")
    .map((line, index) => ({ text: line.trim(), lineNumber: index + 1 }))
    .filter(({ text }) => text !== "" && !text.startsWith("#"));

  const header = lines.shift();
  if (!header) {
    throw new Error(`Test case CSV is empty: ${CSV_PATH}`);
  }

  const headerColumns = header.text.split(",").map((column) => column.trim());
  if (headerColumns.join(",") !== COLUMNS.join(",")) {
    throw new Error(
      `Test case CSV header must be "${COLUMNS.join(",")}", got "${headerColumns.join(",")}"`,
    );
  }

  const seenIds = new Set<string>();
  const cases = lines.map(({ text, lineNumber }) => {
    const values = text.split(",").map((value) => value.trim());
    if (values.length !== COLUMNS.length) {
      throw new Error(
        `Test case CSV line ${lineNumber}: expected ${COLUMNS.length} columns, got ${values.length}`,
      );
    }

    const [id, title, adds, subtotal, discount, total] = values;
    if (!id || !title) {
      throw new Error(`Test case CSV line ${lineNumber}: id and title are required`);
    }
    if (seenIds.has(id)) {
      throw new Error(`Test case CSV line ${lineNumber}: duplicate id "${id}"`);
    }
    seenIds.add(id);

    return {
      id,
      title,
      adds: parseAdds(adds, lineNumber),
      subtotal,
      discount,
      total,
    };
  });

  return cases;
}

export function loadTestCases(): TestCase[] {
  return parseTestCases(readFileSync(CSV_PATH, "utf8"));
}
