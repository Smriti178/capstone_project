import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import { OrderProvider } from "../../context/OrderContext";
import { AuthProvider } from "../../context/AuthContext";
import { getEnrichedOrders } from "../../data/orders";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "ORD-20240101" }),
}));

import OrderHistoryPage from "../../pages/OrderHistoryPage";
import OrderDetailPage from "../../pages/OrderDetailPage";

const Providers = ({ children }) => (
  <MemoryRouter>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>{children}</OrderProvider>
      </CartProvider>
    </AuthProvider>
  </MemoryRouter>
);

// ---------------------------------------------------------------------------
// Order History Page — happy path
// ---------------------------------------------------------------------------
describe("OrderHistoryPage — happy path", () => {
  test("renders the Order History heading", () => {
    render(<Providers><OrderHistoryPage /></Providers>);
    expect(screen.getByRole("heading", { name: /order history/i })).toBeInTheDocument();
  });

  test("renders a link for each mock order", () => {
    render(<Providers><OrderHistoryPage /></Providers>);
    const links = screen.getAllByRole("link").filter((l) =>
      l.getAttribute("href")?.startsWith("/orders/")
    );
    expect(links.length).toBe(getEnrichedOrders().length);
  });

  test("renders at least one Delivered status badge", () => {
    render(<Providers><OrderHistoryPage /></Providers>);
    expect(screen.getAllByText(/delivered/i).length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Order History Page — search filter
// ---------------------------------------------------------------------------
describe("OrderHistoryPage — search filter", () => {
  test("filters to matching order when ID is typed", async () => {
    render(<Providers><OrderHistoryPage /></Providers>);
    await userEvent.type(screen.getByPlaceholderText(/search by order/i), "ORD-20240101");
    await waitFor(() => {
      const links = screen.getAllByRole("link").filter((l) =>
        l.getAttribute("href")?.startsWith("/orders/")
      );
      expect(links.length).toBe(1);
    });
  });

  test("shows no-match message for non-existent ID", async () => {
    render(<Providers><OrderHistoryPage /></Providers>);
    await userEvent.type(screen.getByPlaceholderText(/search by order/i), "NONEXISTENT-XYZ");
    expect(await screen.findByText(/no orders match/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Order History Page — status filter
// ---------------------------------------------------------------------------
describe("OrderHistoryPage — status filter", () => {
  test("clicking Delivered pill filters to delivered orders", async () => {
    render(<Providers><OrderHistoryPage /></Providers>);
    await userEvent.click(screen.getByRole("button", { name: /^delivered$/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/delivered/i).length).toBeGreaterThan(0);
    });
  });
});

// ---------------------------------------------------------------------------
// Order Detail Page — delivered order (ORD-20240101)
// ---------------------------------------------------------------------------
describe("OrderDetailPage — delivered order", () => {
  test("renders Order Details heading", () => {
    render(<Providers><OrderDetailPage /></Providers>);
    expect(screen.getByRole("heading", { name: /order details/i })).toBeInTheDocument();
  });

  test("shows order ID in the view", () => {
    render(<Providers><OrderDetailPage /></Providers>);
    expect(screen.getByText("ORD-20240101")).toBeInTheDocument();
  });

  test("does NOT show Cancel Order button for delivered orders", () => {
    render(<Providers><OrderDetailPage /></Providers>);
    expect(screen.queryByRole("button", { name: /cancel order/i })).not.toBeInTheDocument();
  });

  test("shows 'Buy All Again' button", () => {
    render(<Providers><OrderDetailPage /></Providers>);
    expect(screen.getByRole("button", { name: /buy all again/i })).toBeInTheDocument();
  });

  test("clicking 'Buy All Again' navigates to /cart", async () => {
    render(<Providers><OrderDetailPage /></Providers>);
    await userEvent.click(screen.getByRole("button", { name: /buy all again/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });
});

// ---------------------------------------------------------------------------
// Order Detail Page — Buy Again per item
// ---------------------------------------------------------------------------
describe("OrderDetailPage — Buy Again per item", () => {
  test("each item has a Buy Again button", () => {
    render(<Providers><OrderDetailPage /></Providers>);
    expect(screen.getAllByRole("button", { name: /buy again/i }).length).toBeGreaterThan(0);
  });

  test("clicking Buy Again shows 'Added!' feedback", async () => {
    render(<Providers><OrderDetailPage /></Providers>);
    await userEvent.click(screen.getAllByRole("button", { name: /buy again/i })[0]);
    expect(await screen.findByText(/added!/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Order Detail Page — not found
// ---------------------------------------------------------------------------
describe("OrderDetailPage — not found", () => {
  test("shows 'Order not found' for unknown ID", () => {
    jest.spyOn(require("react-router-dom"), "useParams")
      .mockReturnValue({ id: "ORD-DOESNT-EXIST" });
    render(<Providers><OrderDetailPage /></Providers>);
    expect(screen.getByText(/order not found/i)).toBeInTheDocument();
  });
});
