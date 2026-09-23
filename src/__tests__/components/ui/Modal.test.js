import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../../../components/ui/Modal";

describe("Modal — visibility", () => {
  test("renders nothing when isOpen=false", () => {
    render(<Modal isOpen={false} onClose={() => {}} title="Test"><p>Content</p></Modal>);
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  test("renders children when isOpen=true", () => {
    render(<Modal isOpen={true} onClose={() => {}} title="Test"><p>Modal body</p></Modal>);
    expect(screen.getByText("Modal body")).toBeInTheDocument();
  });

  test("renders the title when open", () => {
    render(<Modal isOpen={true} onClose={() => {}} title="My Modal"><p>body</p></Modal>);
    expect(screen.getByText("My Modal")).toBeInTheDocument();
  });
});

describe("Modal — close button", () => {
  test("calls onClose when the close button is clicked", async () => {
    const onClose = jest.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Title"><p>body</p></Modal>);
    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when the backdrop overlay is clicked", async () => {
    const onClose = jest.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={onClose} title="Backdrop"><p>inner</p></Modal>
    );
    // Click the outermost fixed overlay div
    await userEvent.click(container.firstChild);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Modal — keyboard", () => {
  test("calls onClose when Escape key is pressed", async () => {
    const onClose = jest.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Esc test"><p>body</p></Modal>);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
