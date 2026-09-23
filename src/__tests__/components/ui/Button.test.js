import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../../../components/ui/Button";

describe("Button — rendering", () => {
  test("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  test("applies primary variant bg by default", () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole("button").className).toContain("bg-[#1e3a5f]");
  });

  test("applies danger variant classes when variant='danger'", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button").className).toContain("bg-red-600");
  });

  test("applies secondary variant classes when variant='secondary'", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button").className).toContain("border-[#1e3a5f]");
  });

  test("applies w-full when fullWidth=true", () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole("button").className).toContain("w-full");
  });

  test("applies lg size classes when size='lg'", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("px-6");
  });

  test("merges extra className prop", () => {
    render(<Button className="my-custom">Custom</Button>);
    expect(screen.getByRole("button").className).toContain("my-custom");
  });
});

describe("Button — disabled state", () => {
  test("is disabled when disabled=true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("applies opacity-50 when disabled", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button").className).toContain("opacity-50");
  });

  test("does not fire onClick when disabled", async () => {
    const handler = jest.fn();
    render(<Button disabled onClick={handler}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).not.toHaveBeenCalled();
  });
});

describe("Button — interaction", () => {
  test("calls onClick when clicked", async () => {
    const handler = jest.fn();
    render(<Button onClick={handler}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
