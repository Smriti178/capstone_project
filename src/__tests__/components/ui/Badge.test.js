import React from "react";
import { render, screen } from "@testing-library/react";
import Badge from "../../../components/ui/Badge";

describe("Badge", () => {
  test("renders children text", () => {
    render(<Badge>bestseller</Badge>);
    expect(screen.getByText("bestseller")).toBeInTheDocument();
  });

  test("applies gray colour by default", () => {
    render(<Badge>default</Badge>);
    expect(screen.getByText("default").className).toContain("bg-gray-100");
  });

  test("applies amber colour for color='amber'", () => {
    render(<Badge color="amber">amber</Badge>);
    expect(screen.getByText("amber").className).toContain("bg-amber-100");
  });

  test("applies green colour for color='green'", () => {
    render(<Badge color="green">new</Badge>);
    expect(screen.getByText("new").className).toContain("bg-green-100");
  });

  test("applies red colour for color='red'", () => {
    render(<Badge color="red">sale</Badge>);
    expect(screen.getByText("sale").className).toContain("bg-red-100");
  });

  test("applies blue colour for color='blue'", () => {
    render(<Badge color="blue">info</Badge>);
    expect(screen.getByText("info").className).toContain("bg-blue-100");
  });

  test("merges additional className prop", () => {
    render(<Badge className="ml-2">extra</Badge>);
    expect(screen.getByText("extra").className).toContain("ml-2");
  });

  test("renders as a <span> element", () => {
    render(<Badge>span check</Badge>);
    expect(screen.getByText("span check").tagName).toBe("SPAN");
  });
});
