import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Breadcrumb from "../../../components/ui/Breadcrumb";

const items = [
  { label: "Home", to: "/" },
  { label: "Books", to: "/books" },
  { label: "Atomic Habits" },
];

describe("Breadcrumb — light theme (default)", () => {
  test("renders all item labels", () => {
    render(<MemoryRouter><Breadcrumb items={items} /></MemoryRouter>);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Books")).toBeInTheDocument();
    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
  });

  test("renders links for items with a 'to' prop", () => {
    render(<MemoryRouter><Breadcrumb items={items} /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Books" })).toBeInTheDocument();
  });

  test("last item is NOT a link", () => {
    render(<MemoryRouter><Breadcrumb items={items} /></MemoryRouter>);
    expect(screen.queryByRole("link", { name: "Atomic Habits" })).not.toBeInTheDocument();
  });

  test("last item has aria-current='page'", () => {
    render(<MemoryRouter><Breadcrumb items={items} /></MemoryRouter>);
    expect(screen.getByText("Atomic Habits")).toHaveAttribute("aria-current", "page");
  });

  test("renders a nav with aria-label='Breadcrumb'", () => {
    render(<MemoryRouter><Breadcrumb items={items} /></MemoryRouter>);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  test("renders (n-1) aria-hidden separators", () => {
    const { container } = render(<MemoryRouter><Breadcrumb items={items} /></MemoryRouter>);
    const hidden = container.querySelectorAll("[aria-hidden]");
    expect(hidden.length).toBe(items.length - 1);
  });
});

describe("Breadcrumb — dark theme", () => {
  test("renders without errors in dark theme", () => {
    render(<MemoryRouter><Breadcrumb theme="dark" items={items} /></MemoryRouter>);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("wrapper uses xs text size for dark theme", () => {
    render(<MemoryRouter><Breadcrumb theme="dark" items={items} /></MemoryRouter>);
    expect(screen.getByRole("navigation").className).toContain("text-xs");
  });
});

describe("Breadcrumb — edge cases", () => {
  test("renders an empty nav for an empty items array", () => {
    const { container } = render(<MemoryRouter><Breadcrumb items={[]} /></MemoryRouter>);
    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
    expect(nav.childNodes.length).toBe(0);
  });

  test("renders single item without a separator", () => {
    const { container } = render(
      <MemoryRouter><Breadcrumb items={[{ label: "Home" }]} /></MemoryRouter>
    );
    expect(container.querySelectorAll("[aria-hidden]").length).toBe(0);
  });
});
