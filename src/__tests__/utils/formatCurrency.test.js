import { formatCurrency, discountPercent } from "../../utils/formatCurrency";

describe("formatCurrency", () => {
  test("formats a positive price with dollar sign and two decimals", () => {
    expect(formatCurrency(14.99)).toBe("$14.99");
  });

  test("formats a whole-number price", () => {
    expect(formatCurrency(10)).toBe("$10.00");
  });

  test("formats zero as $0.00", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  test("formats large amounts with comma separator", () => {
    expect(formatCurrency(1200.5)).toBe("$1,200.50");
  });

  test("rounds to two decimal places", () => {
    expect(formatCurrency(9.999)).toBe("$10.00");
  });
});

describe("discountPercent", () => {
  test("calculates 25% discount correctly", () => {
    expect(discountPercent(20, 15)).toBe(25);
  });

  test("returns 0 when sale equals original", () => {
    expect(discountPercent(20, 20)).toBe(0);
  });

  test("rounds to nearest integer", () => {
    expect(discountPercent(27, 16.99)).toBe(37);
  });

  test("handles large discounts", () => {
    expect(discountPercent(100, 50)).toBe(50);
  });
});
