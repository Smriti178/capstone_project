import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../../../components/ui/Input";

describe("Input — rendering", () => {
  test("renders a text input by default", () => {
    render(<Input id="name" label="Name" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("renders the label text", () => {
    render(<Input id="email" label="Email address" />);
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  test("renders placeholder text", () => {
    render(<Input id="ph" label="Field" placeholder="Enter value" />);
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument();
  });

  test("renders error message when error prop is provided", () => {
    render(<Input id="err" label="Field" error="This field is required." />);
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });

  test("does not render error text when error prop is absent", () => {
    render(<Input id="ok" label="Field" />);
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  test("applies red border class when error is present", () => {
    render(<Input id="err" label="Field" error="Bad input" />);
    expect(screen.getByRole("textbox").className).toContain("border-red-500");
  });

  test("applies gray border class when error is absent", () => {
    render(<Input id="ok" label="Field" />);
    expect(screen.getByRole("textbox").className).toContain("border-gray-300");
  });
});

describe("Input — interaction", () => {
  test("calls onChange when user types", async () => {
    const handler = jest.fn();
    render(<Input id="test" label="Test" onChange={handler} />);
    await userEvent.type(screen.getByRole("textbox"), "hello");
    expect(handler).toHaveBeenCalled();
  });

  test("reflects typed value via controlled value prop", async () => {
    const TestWrapper = () => {
      const [val, setVal] = React.useState("");
      return <Input id="ctrl" label="Ctrl" value={val} onChange={(e) => setVal(e.target.value)} />;
    };
    render(<TestWrapper />);
    await userEvent.type(screen.getByRole("textbox"), "world");
    expect(screen.getByRole("textbox")).toHaveValue("world");
  });
});
