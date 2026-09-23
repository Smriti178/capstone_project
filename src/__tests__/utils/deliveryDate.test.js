import { getTentativeDelivery } from "../../utils/deliveryDate";

describe("getTentativeDelivery", () => {
  test("returns a non-empty string", () => {
    expect(typeof getTentativeDelivery(3, 5)).toBe("string");
    expect(getTentativeDelivery(3, 5).length).toBeGreaterThan(0);
  });

  test("contains an en-dash separator between the two dates", () => {
    expect(getTentativeDelivery(3, 5)).toContain("–");
  });

  test("includes abbreviated weekday names in the output", () => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const result = getTentativeDelivery(1, 2);
    expect(weekdays.some((d) => result.includes(d))).toBe(true);
  });

  test("produces two distinct date parts separated by the dash", () => {
    const parts = getTentativeDelivery(2, 5).split(" – ");
    expect(parts).toHaveLength(2);
    expect(parts[0]).not.toBe(parts[1]);
  });

  test("works with default arguments", () => {
    expect(getTentativeDelivery()).toContain("–");
  });
});
