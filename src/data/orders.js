import { books } from "./books";

export const mockOrders = [
  {
    id: "ORD-20240101",
    date: "2024-01-01T10:30:00Z",
    status: "delivered",
    items: [
      { bookId: "b001", quantity: 1, priceAtPurchase: 399 },
      { bookId: "b003", quantity: 1, priceAtPurchase: 359 },
    ],
    addressId: "addr1",
    subtotal: 758,
    discount: 0,
    deliveryFee: 0,
    total: 758,
    giftPointsUsed: 50,
    giftPointsEarned: 28,
    paymentMethod: "card",
    paymentLast4: "4242",
    deliveredAt: "2024-01-04T14:00:00Z",
  },
  {
    id: "ORD-20240210",
    date: "2024-02-10T09:15:00Z",
    status: "delivered",
    items: [
      { bookId: "b007", quantity: 2, priceAtPurchase: 149 },
    ],
    addressId: "addr1",
    subtotal: 298,
    discount: 0,
    deliveryFee: 0,
    total: 298,
    giftPointsUsed: 0,
    giftPointsEarned: 24,
    paymentMethod: "card",
    paymentLast4: "4242",
    deliveredAt: "2024-02-13T11:30:00Z",
  },
  {
    id: "ORD-20240315",
    date: "2024-03-15T16:45:00Z",
    status: "cancelled",
    items: [
      { bookId: "b004", quantity: 1, priceAtPurchase: 299 },
    ],
    addressId: "addr2",
    subtotal: 299,
    discount: 0,
    deliveryFee: 0,
    total: 299,
    giftPointsUsed: 0,
    giftPointsEarned: 0,
    paymentMethod: "card",
    paymentLast4: "4242",
    deliveredAt: null,
  },
];

/** Enrich order items with full book data */
export const getEnrichedOrders = () =>
  mockOrders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      book: books.find((b) => b.id === item.bookId),
    })),
  }));
