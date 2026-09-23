import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderProvider, useOrders } from "../../context/OrderContext";
import { getEnrichedOrders } from "../../data/orders";

const mockOrderData = {
  items: [{ bookId: "b001", quantity: 1, priceAtPurchase: 14.99 }],
  subtotal: 14.99, deliveryFee: 0, giftDiscount: 0, total: 14.99,
  paymentMethod: "card", paymentLast4: "4242", status: "processing",
};

const OrderConsumer = () => {
  const { orders, placeOrder, cancelOrder } = useOrders();
  return (
    <div>
      <div data-testid="count">{orders.length}</div>
      <div data-testid="first-status">{orders[0]?.status ?? "none"}</div>
      <button data-testid="place" onClick={() => placeOrder(mockOrderData)}>Place</button>
      <button data-testid="cancel" onClick={() => { if (orders.length > 0) cancelOrder(orders[0].id); }}>Cancel</button>
    </div>
  );
};

const render$ = () => render(<OrderProvider><OrderConsumer /></OrderProvider>);

describe("OrderContext — initial state", () => {
  test("loads mock orders on init", () => {
    render$();
    const count = parseInt(screen.getByTestId("count").textContent, 10);
    expect(count).toBe(getEnrichedOrders().length);
  });
});

describe("OrderContext — placeOrder", () => {
  test("increments order count by 1", async () => {
    render$();
    const before = parseInt(screen.getByTestId("count").textContent, 10);
    await userEvent.click(screen.getByTestId("place"));
    expect(parseInt(screen.getByTestId("count").textContent, 10)).toBe(before + 1);
  });

  test("new order appears first with status=processing", async () => {
    render$();
    await userEvent.click(screen.getByTestId("place"));
    expect(screen.getByTestId("first-status").textContent).toBe("processing");
  });
});

describe("OrderContext — cancelOrder", () => {
  test("marks first order as cancelled", async () => {
    render$();
    await userEvent.click(screen.getByTestId("place"));
    await userEvent.click(screen.getByTestId("cancel"));
    expect(screen.getByTestId("first-status").textContent).toBe("cancelled");
  });
});

describe("OrderContext — guard", () => {
  test("throws outside OrderProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const Bad = () => { useOrders(); return null; };
    expect(() => render(<Bad />)).toThrow("useOrders must be used inside <OrderProvider>");
    spy.mockRestore();
  });
});
