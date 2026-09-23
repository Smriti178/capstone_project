import { isCancellable, cancellationTimeRemaining } from "../../utils/cancellationGuard";

describe("isCancellable", () => {
  test("returns true for an order placed 1 hour ago", () => {
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
    expect(isCancellable(oneHourAgo)).toBe(true);
  });

  test("returns true for an order placed 47h 59m ago", () => {
    const justUnder48h = new Date(Date.now() - (48 * 60 * 60 * 1000 - 60 * 1000)).toISOString();
    expect(isCancellable(justUnder48h)).toBe(true);
  });

  test("returns false for an order placed exactly 48 hours ago", () => {
    const exactly48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    expect(isCancellable(exactly48h)).toBe(false);
  });

  test("returns false for an order placed 5 days ago", () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(isCancellable(fiveDaysAgo)).toBe(false);
  });
});

describe("cancellationTimeRemaining", () => {
  test("returns a formatted string for an order placed 1h ago", () => {
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
    const result = cancellationTimeRemaining(oneHourAgo);
    expect(result).toMatch(/^\d+h \d+m remaining$/);
  });

  test("returns null for an order placed 49 hours ago", () => {
    const expired = new Date(Date.now() - 49 * 60 * 60 * 1000).toISOString();
    expect(cancellationTimeRemaining(expired)).toBeNull();
  });

  test("returns null for an old mock order date", () => {
    expect(cancellationTimeRemaining("2024-01-01T10:30:00Z")).toBeNull();
  });

  test("includes both hours and minutes in the output", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const result = cancellationTimeRemaining(twoHoursAgo);
    expect(result).toMatch(/\d+h \d+m remaining/);
  });
});
