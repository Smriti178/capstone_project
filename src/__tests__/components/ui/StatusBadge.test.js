import React from "react";
import { render, screen } from "@testing-library/react";
import StatusBadge, { STATUS_CONFIG } from "../../../components/ui/StatusBadge";

describe("StatusBadge — rendering", () => {
  test("renders 'Processing' label", () => {
    render(<StatusBadge status="processing" />);
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });

  test("renders 'Shipped' label", () => {
    render(<StatusBadge status="shipped" />);
    expect(screen.getByText(/shipped/i)).toBeInTheDocument();
  });

  test("renders 'Delivered' label", () => {
    render(<StatusBadge status="delivered" />);
    expect(screen.getByText(/delivered/i)).toBeInTheDocument();
  });

  test("renders 'Cancelled' label", () => {
    render(<StatusBadge status="cancelled" />);
    expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
  });

  test("falls back to processing for unknown status", () => {
    render(<StatusBadge status="unknown" />);
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });

  test("applies green colour classes for delivered status", () => {
    const { container } = render(<StatusBadge status="delivered" />);
    expect(container.firstChild.className).toContain("bg-green-100");
  });

  test("applies red colour classes for cancelled status", () => {
    const { container } = render(<StatusBadge status="cancelled" />);
    expect(container.firstChild.className).toContain("bg-red-100");
  });
});

describe("STATUS_CONFIG", () => {
  test("exports an object with the four expected status keys", () => {
    ["processing", "shipped", "delivered", "cancelled"].forEach((key) => {
      expect(STATUS_CONFIG).toHaveProperty(key);
    });
  });

  test("each config entry has label, color, icon, and step", () => {
    Object.values(STATUS_CONFIG).forEach((cfg) => {
      expect(cfg).toHaveProperty("label");
      expect(cfg).toHaveProperty("color");
      expect(cfg).toHaveProperty("icon");
      expect(cfg).toHaveProperty("step");
    });
  });

  test("delivered has the highest step value", () => {
    const steps = Object.values(STATUS_CONFIG).map((c) => c.step);
    expect(STATUS_CONFIG.delivered.step).toBe(Math.max(...steps));
  });
});
