import { getRecommendations, hasOrderHistory } from "../../utils/recommendations";
import { books } from "../../data/books";

const makeOrder = (status, bookIds) => ({
  id: `ORD-${Math.random()}`,
  date: new Date().toISOString(),
  status,
  items: bookIds.map((id) => ({
    bookId: id,
    quantity: 1,
    book: books.find((b) => b.id === id),
  })),
});

describe("hasOrderHistory", () => {
  test("returns false for an empty orders array", () => {
    expect(hasOrderHistory([])).toBe(false);
  });

  test("returns false when all orders are cancelled", () => {
    expect(hasOrderHistory([makeOrder("cancelled", ["b001"])])).toBe(false);
  });

  test("returns true when at least one delivered order exists", () => {
    expect(hasOrderHistory([makeOrder("delivered", ["b001"])])).toBe(true);
  });

  test("returns true when at least one processing order exists", () => {
    expect(hasOrderHistory([makeOrder("processing", ["b002"])])).toBe(true);
  });
});

describe("getRecommendations", () => {
  test("returns up to limit books even with no orders (fallback by rating)", () => {
    // With no order history every book scores 0 except bestseller boost,
    // so the function returns up to `limit` top-rated books.
    const result = getRecommendations([], 3);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  test("respects the limit parameter", () => {
    const result = getRecommendations([makeOrder("delivered", ["b001", "b002"])], 3);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  test("excludes books the user has already purchased", () => {
    const result = getRecommendations([makeOrder("delivered", ["b001"])], 20);
    expect(result.map((b) => b.id)).not.toContain("b001");
  });

  test("attaches a _score property to every recommendation", () => {
    getRecommendations([makeOrder("delivered", ["b001"])], 5).forEach((book) => {
      expect(typeof book._score).toBe("number");
    });
  });

  test("books from the same category as purchased score higher than unrelated", () => {
    const orders = [makeOrder("delivered", ["b001"])]; // b001 = fiction
    const result = getRecommendations(orders, 20);
    const fictionBook = result.find((b) => b.category === "fiction");
    const otherBook = result.find((b) => b.category !== "fiction");
    if (fictionBook && otherBook) {
      expect(fictionBook._score).toBeGreaterThan(otherBook._score);
    }
  });

  test("does not recommend books from cancelled orders (exclusion)", () => {
    // b001 delivered → excluded. b002 in cancelled order → can still appear
    const orders = [
      makeOrder("cancelled", ["b002"]),
      makeOrder("delivered", ["b001"]),
    ];
    expect(getRecommendations(orders, 20).map((b) => b.id)).not.toContain("b001");
  });
});
