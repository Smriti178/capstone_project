import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import { AuthProvider } from "../../context/AuthContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";

const mockBook = {
  id: "b001", title: "The Midnight Library", author: "Matt Haig",
  price: 14.99, originalPrice: 19.99, cover: null, category: "fiction", stock: 10,
};
const mockItem = { bookId: "b001", quantity: 2, book: mockBook };

const renderItem = (item = mockItem) =>
  render(
    <MemoryRouter>
      <CartProvider>
        <CartItem item={item} />
      </CartProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// CartItem
// ---------------------------------------------------------------------------
describe("CartItem — rendering", () => {
  test("displays the book title", () => {
    renderItem();
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
  });

  test("displays the author", () => {
    renderItem();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();
  });

  test("displays the line total (price × quantity)", () => {
    renderItem(); // 14.99 × 2 = $29.98
    expect(screen.getByText("$29.98")).toBeInTheDocument();
  });

  test("displays the current quantity in the stepper", () => {
    renderItem();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("renders nothing if book is undefined", () => {
    const { container } = render(
      <MemoryRouter>
        <CartProvider>
          <CartItem item={{ bookId: "b999", quantity: 1, book: undefined }} />
        </CartProvider>
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});

describe("CartItem — quantity controls present", () => {
  test("has a decrease button", () => {
    renderItem();
    expect(screen.getByLabelText(/decrease/i)).toBeInTheDocument();
  });

  test("has an increase button", () => {
    renderItem();
    expect(screen.getByLabelText(/increase/i)).toBeInTheDocument();
  });

  test("has a remove button", () => {
    renderItem();
    expect(screen.getByLabelText(/remove item/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// CartSummary
// ---------------------------------------------------------------------------
const SummaryWrapper = ({ children }) => (
  <MemoryRouter>
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  </MemoryRouter>
);

describe("CartSummary — rendering", () => {
  test("renders 'Order Summary' heading", () => {
    render(<SummaryWrapper><CartSummary /></SummaryWrapper>);
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
  });

  test("shows 'Sign in to Checkout' CTA when not logged in", () => {
    render(<SummaryWrapper><CartSummary /></SummaryWrapper>);
    expect(screen.getByRole("button", { name: /sign in to checkout/i })).toBeInTheDocument();
  });

  test("shows subtotal, delivery, and total rows", () => {
    render(<SummaryWrapper><CartSummary /></SummaryWrapper>);
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    expect(screen.getAllByText(/delivery/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/^total$/i)).toBeInTheDocument();
  });
});
