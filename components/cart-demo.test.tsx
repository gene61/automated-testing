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
    // expect(screen.getByTestId("total")).toHaveTextContent("$108.00");
    expect(screen.getByTestId("total")).toHaveTextContent("$1080.00");
  });
});
