import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GiftPointsRedeemer from "../../components/checkout/GiftPointsRedeemer";
import DeliveryDatePicker from "../../components/checkout/DeliveryDatePicker";

// ---------------------------------------------------------------------------
// Mock useAuth to control user gift points
// ---------------------------------------------------------------------------
jest.mock("../../context/AuthContext", () => {
  const actual = jest.requireActual("../../context/AuthContext");
  const mockUseAuth = jest.fn().mockReturnValue({ user: { giftPoints: 340 } });
  return { ...actual, useAuth: mockUseAuth };
});
const { useAuth } = require("../../context/AuthContext");

// Re-apply the default return value before every test so mockReturnValueOnce
// calls in one test don't leave the mock returning undefined in the next.
beforeEach(() => {
  useAuth.mockReturnValue({ user: { giftPoints: 340 } });
});

const renderRedeemer = (onRedeem = jest.fn()) =>
  render(<GiftPointsRedeemer redeemedPoints={0} onRedeem={onRedeem} />);

// ---------------------------------------------------------------------------
// GiftPointsRedeemer — happy path
// ---------------------------------------------------------------------------
describe("GiftPointsRedeemer — happy path", () => {
  test("displays the available balance", () => {
    renderRedeemer();
    expect(screen.getByText(/340/)).toBeInTheDocument();
  });

  test("applying valid points shows confirmation and calls onRedeem", async () => {
    const onRedeem = jest.fn();
    renderRedeemer(onRedeem);
    await userEvent.type(screen.getByRole("spinbutton"), "100");
    await userEvent.click(screen.getByRole("button", { name: /apply/i }));
    expect(await screen.findByText(/100 pts applied/i)).toBeInTheDocument();
    expect(onRedeem).toHaveBeenCalledWith(100, 1);
  });

  test("removing applied points calls onRedeem(0, 0)", async () => {
    const onRedeem = jest.fn();
    renderRedeemer(onRedeem);
    await userEvent.type(screen.getByRole("spinbutton"), "50");
    await userEvent.click(screen.getByRole("button", { name: /apply/i }));
    await userEvent.click(screen.getByLabelText(/remove gift points/i));
    expect(onRedeem).toHaveBeenLastCalledWith(0, 0);
  });
});

// ---------------------------------------------------------------------------
// GiftPointsRedeemer — validation
// ---------------------------------------------------------------------------
describe("GiftPointsRedeemer — validation", () => {
  test("shows error when 0 points are entered", async () => {
    renderRedeemer();
    await userEvent.type(screen.getByRole("spinbutton"), "0");
    await userEvent.click(screen.getByRole("button", { name: /apply/i }));
    expect(await screen.findByText(/valid number/i)).toBeInTheDocument();
  });

  test("shows error when points exceed balance", async () => {
    renderRedeemer();
    await userEvent.type(screen.getByRole("spinbutton"), "9999");
    await userEvent.click(screen.getByRole("button", { name: /apply/i }));
    expect(await screen.findByText(/only have 340 points/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// GiftPointsRedeemer — no points / not logged in
// ---------------------------------------------------------------------------
describe("GiftPointsRedeemer — hidden when not applicable", () => {
  test("renders nothing when user has 0 points", () => {
    useAuth.mockReturnValueOnce({ user: { giftPoints: 0 } });
    const { container } = render(<GiftPointsRedeemer redeemedPoints={0} onRedeem={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders nothing when user is null", () => {
    useAuth.mockReturnValueOnce({ user: null });
    const { container } = render(<GiftPointsRedeemer redeemedPoints={0} onRedeem={jest.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// DeliveryDatePicker
// ---------------------------------------------------------------------------
describe("DeliveryDatePicker — rendering", () => {
  const render$ = (selectedId = "standard", onSelect = jest.fn()) =>
    render(<DeliveryDatePicker selectedId={selectedId} onSelect={onSelect} />);

  test("shows Standard Delivery option", () => {
    render$();
    expect(screen.getByText(/standard delivery/i)).toBeInTheDocument();
  });

  test("shows Express Delivery option", () => {
    render$();
    expect(screen.getByText(/express delivery/i)).toBeInTheDocument();
  });

  test("shows FREE for standard delivery", () => {
    render$();
    expect(screen.getByText("FREE")).toBeInTheDocument();
  });

  test("shows price for express delivery", () => {
    render$();
    expect(screen.getByText("$7.99")).toBeInTheDocument();
  });

  test("calls onSelect with correct id when express is chosen", async () => {
    const onSelect = jest.fn();
    render$("standard", onSelect);
    const expressBtn = screen.getByText(/express delivery/i).closest("button");
    await userEvent.click(expressBtn);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "express", price: 7.99 }));
  });

  test("shows selected ring on the currently selected option", () => {
    render$("standard");
    const allBtns = screen.getAllByRole("button");
    const selected = allBtns.find((b) => b.className.includes("ring-1"));
    expect(selected).toBeTruthy();
  });
});
