import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "../../context/CartContext";

const mockBook = (id = "b001", price = 14.99) => ({
  id, title: `Book ${id}`, author: "Author", price,
  originalPrice: price + 5, cover: null, category: "fiction", stock: 10,
});

const CartConsumer = ({ book, qty = 1 }) => {
  const { items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart } = useCart();
  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="subtotal">{subtotal.toFixed(2)}</div>
      <div data-testid="items-json">{JSON.stringify(items.map((i) => ({ id: i.bookId, qty: i.quantity })))}</div>
      <button onClick={() => addItem(book, qty)} data-testid="add">Add</button>
      <button onClick={() => removeItem(book.id)} data-testid="remove">Remove</button>
      <button onClick={() => updateQuantity(book.id, 3)} data-testid="update">Update</button>
      <button onClick={() => clearCart()} data-testid="clear">Clear</button>
    </div>
  );
};

const render$ = (book, qty) =>
  render(<CartProvider><CartConsumer book={book} qty={qty} /></CartProvider>);

describe("CartContext — initial state", () => {
  test("starts with empty cart", () => {
    render$(mockBook());
    expect(screen.getByTestId("item-count").textContent).toBe("0");
    expect(screen.getByTestId("subtotal").textContent).toBe("0.00");
  });
});

describe("CartContext — addItem", () => {
  test("adds a new item and increments itemCount", async () => {
    render$(mockBook("b001", 10));
    await userEvent.click(screen.getByTestId("add"));
    expect(screen.getByTestId("item-count").textContent).toBe("1");
  });

  test("adding same book twice merges into one item with qty=2", async () => {
    render$(mockBook("b001", 10), 1);
    await userEvent.click(screen.getByTestId("add"));
    await userEvent.click(screen.getByTestId("add"));
    const items = JSON.parse(screen.getByTestId("items-json").textContent);
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(2);
  });

  test("updates subtotal correctly", async () => {
    render$(mockBook("b001", 10), 2);
    await userEvent.click(screen.getByTestId("add"));
    expect(screen.getByTestId("subtotal").textContent).toBe("20.00");
  });
});

describe("CartContext — removeItem", () => {
  test("removes item from cart", async () => {
    render$(mockBook("b001", 10));
    await userEvent.click(screen.getByTestId("add"));
    await userEvent.click(screen.getByTestId("remove"));
    expect(screen.getByTestId("item-count").textContent).toBe("0");
  });
});

describe("CartContext — updateQuantity", () => {
  test("updates quantity and recalculates subtotal", async () => {
    render$(mockBook("b001", 5));
    await userEvent.click(screen.getByTestId("add")); // qty 1, subtotal 5
    await userEvent.click(screen.getByTestId("update")); // qty 3, subtotal 15
    expect(screen.getByTestId("subtotal").textContent).toBe("15.00");
  });
});

describe("CartContext — clearCart", () => {
  test("empties the cart", async () => {
    render$(mockBook("b001", 10));
    await userEvent.click(screen.getByTestId("add"));
    await userEvent.click(screen.getByTestId("clear"));
    expect(screen.getByTestId("item-count").textContent).toBe("0");
  });
});

describe("CartContext — guard", () => {
  test("throws when useCart is called outside CartProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const Bad = () => { useCart(); return null; };
    expect(() => render(<Bad />)).toThrow("useCart must be used inside <CartProvider>");
    spy.mockRestore();
  });
});
