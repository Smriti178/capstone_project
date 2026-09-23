import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import { OrderProvider } from "../../context/OrderContext";
import { AuthProvider } from "../../context/AuthContext";

const mockNavigate = jest.fn();
const mockOrder = {
  subtotal: 29.98, deliveryFee: 0, giftDiscount: 0, total: 29.98, items: [],
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { order: mockOrder } }),
}));

import PaymentPage from "../../pages/PaymentPage";

const render$ = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <PaymentPage />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe("PaymentPage — rendering", () => {
  test("shows the Payment heading", () => {
    render$();
    expect(screen.getByRole("heading", { name: /payment/i })).toBeInTheDocument();
  });

  test("shows Card, UPI, and Net Banking tabs", () => {
    render$();
    expect(screen.getByRole("button", { name: /^card$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^upi$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /net banking/i })).toBeInTheDocument();
  });

  test("shows card form fields by default", () => {
    render$();
    expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Card form — happy path
// ---------------------------------------------------------------------------
describe("PaymentPage — card happy path", () => {
  beforeEach(() => mockNavigate.mockClear());

  test("navigates to /payment/confirmation after valid card submission", async () => {
    render$();
    await userEvent.type(screen.getByLabelText(/cardholder name/i), "Alex Johnson");
    await userEvent.type(screen.getByLabelText(/card number/i), "4111111111111111");
    await userEvent.type(screen.getByLabelText(/expiry/i), "12/26");
    await userEvent.type(screen.getByLabelText(/cvv/i), "123");
    await userEvent.click(screen.getByRole("button", { name: /pay \$/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/payment/confirmation", expect.any(Object));
    }, { timeout: 3000 });
  });
});

// ---------------------------------------------------------------------------
// Card form — validation
// ---------------------------------------------------------------------------
describe("PaymentPage — card validation", () => {
  test("shows name required error when name is empty", async () => {
    render$();
    await userEvent.click(screen.getByRole("button", { name: /pay \$/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  test("shows card number error for incomplete number", async () => {
    render$();
    await userEvent.type(screen.getByLabelText(/cardholder name/i), "Alex");
    await userEvent.type(screen.getByLabelText(/card number/i), "1234");
    await userEvent.click(screen.getByRole("button", { name: /pay \$/i }));
    expect(await screen.findByText(/16-digit/i)).toBeInTheDocument();
  });

  test("shows CVV error for CVV shorter than 3 digits", async () => {
    render$();
    await userEvent.type(screen.getByLabelText(/cardholder name/i), "Alex");
    await userEvent.type(screen.getByLabelText(/card number/i), "4111111111111111");
    await userEvent.type(screen.getByLabelText(/expiry/i), "12/26");
    await userEvent.type(screen.getByLabelText(/cvv/i), "1");
    await userEvent.click(screen.getByRole("button", { name: /pay \$/i }));
    expect(await screen.findByText(/3.+digit/i)).toBeInTheDocument();
  });

  test("shows expiry format error for invalid format", async () => {
    render$();
    await userEvent.type(screen.getByLabelText(/cardholder name/i), "Alex");
    await userEvent.type(screen.getByLabelText(/card number/i), "4111111111111111");
    await userEvent.type(screen.getByLabelText(/expiry/i), "13");
    await userEvent.type(screen.getByLabelText(/cvv/i), "123");
    await userEvent.click(screen.getByRole("button", { name: /pay \$/i }));
    expect(await screen.findByText(/use MM\/YY format/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// UPI tab
// ---------------------------------------------------------------------------
describe("PaymentPage — UPI tab", () => {
  test("shows UPI ID input after switching to UPI tab", async () => {
    render$();
    await userEvent.click(screen.getByRole("button", { name: /^upi$/i }));
    expect(screen.getByLabelText(/upi id/i)).toBeInTheDocument();
  });

  test("shows UPI error when UPI ID lacks '@'", async () => {
    render$();
    await userEvent.click(screen.getByRole("button", { name: /^upi$/i }));
    await userEvent.type(screen.getByLabelText(/upi id/i), "invalidupi");
    await userEvent.click(screen.getByRole("button", { name: /pay \$/i }));
    expect(await screen.findByText(/valid UPI ID/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Net Banking tab
// ---------------------------------------------------------------------------
describe("PaymentPage — Net Banking tab", () => {
  test("shows bank selection after switching to Net Banking tab", async () => {
    render$();
    await userEvent.click(screen.getByRole("button", { name: /net banking/i }));
    expect(screen.getByText(/select bank/i)).toBeInTheDocument();
  });

  test("shows error if no bank is selected before paying", async () => {
    render$();
    await userEvent.click(screen.getByRole("button", { name: /net banking/i }));
    await userEvent.click(screen.getByRole("button", { name: /pay \$/i }));
    expect(await screen.findByText(/select a bank/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Missing order state guard
// ---------------------------------------------------------------------------
describe("PaymentPage — missing order state", () => {
  test("shows fallback message when no order is in location state", () => {
    jest.spyOn(require("react-router-dom"), "useLocation").mockReturnValueOnce({ state: null });
    render$();
    expect(screen.getByText(/no order found/i)).toBeInTheDocument();
  });
});
