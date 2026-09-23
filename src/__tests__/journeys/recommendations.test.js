import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import { AuthProvider } from "../../context/AuthContext";
import { OrderProvider } from "../../context/OrderContext";
import RecommendationStrip from "../../components/books/RecommendationStrip";

// ---------------------------------------------------------------------------
// Mock both context hooks
// ---------------------------------------------------------------------------
jest.mock("../../context/AuthContext", () => {
  const actual = jest.requireActual("../../context/AuthContext");
  const mockUseAuth = jest.fn().mockReturnValue({ user: null });
  return { ...actual, useAuth: mockUseAuth };
});
jest.mock("../../context/OrderContext", () => {
  const actual = jest.requireActual("../../context/OrderContext");
  const mockUseOrders = jest.fn().mockReturnValue({ orders: [] });
  return { ...actual, useOrders: mockUseOrders };
});

const { useAuth } = require("../../context/AuthContext");
const { useOrders } = require("../../context/OrderContext");

const render$ = (limit = 5) =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <RecommendationStrip limit={limit} />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Guest
// ---------------------------------------------------------------------------
describe("RecommendationStrip — guest user", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: null });
    useOrders.mockReturnValue({ orders: [] });
  });

  test("shows 'Popular Right Now'", () => {
    render$();
    expect(screen.getByText(/popular right now/i)).toBeInTheDocument();
  });

  test("shows sign-in link", () => {
    render$();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
  });

  test("does NOT show personalised subtitle", () => {
    render$();
    expect(screen.queryByText(/based on your/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Logged in, no order history
// ---------------------------------------------------------------------------
describe("RecommendationStrip — logged in, no orders", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { name: "Alex" } });
    useOrders.mockReturnValue({ orders: [] });
  });

  test("shows 'Popular Right Now' fallback", () => {
    render$();
    expect(screen.getByText(/popular right now/i)).toBeInTheDocument();
  });

  test("shows 'Start ordering' subtitle", () => {
    render$();
    expect(screen.getByText(/start ordering/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Logged in WITH history
// ---------------------------------------------------------------------------
describe("RecommendationStrip — personalised", () => {
  const deliveredOrder = {
    id: "ORD-TEST", status: "delivered",
    items: [{ bookId: "b001", quantity: 1, book: { id: "b001", title: "Test", author: "Author", category: "fiction", rating: 4.5 } }],
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ user: { name: "Alex" } });
    useOrders.mockReturnValue({ orders: [deliveredOrder] });
  });

  test("shows 'Recommended for You'", () => {
    render$();
    expect(screen.getByText(/recommended for you/i)).toBeInTheDocument();
  });

  test("shows 'Based on your reading history' subtitle", () => {
    render$();
    expect(screen.getByText(/based on your/i)).toBeInTheDocument();
  });

  test("shows the order history link", () => {
    render$();
    expect(screen.getByRole("link", { name: /view order history/i })).toBeInTheDocument();
  });

  test("shows the personalised quality callout", () => {
    render$();
    expect(screen.getByText(/recommendations are based on/i)).toBeInTheDocument();
  });
});
