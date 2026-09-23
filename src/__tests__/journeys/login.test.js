import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import LoginForm from "../../components/auth/LoginForm";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const render$ = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </MemoryRouter>
  );

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------
describe("Login — happy path", () => {
  beforeEach(() => mockNavigate.mockClear());

  test("navigates to / after submitting valid credentials", async () => {
    render$();
    await userEvent.type(screen.getByLabelText(/email address/i), "alex@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"), { timeout: 2000 });
  });
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
describe("Login — validation", () => {
  beforeEach(() => mockNavigate.mockClear());

  test("shows 'Email is required' when email is empty", async () => {
    render$();
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  test("shows 'Enter a valid email' for malformed email", async () => {
    render$();
    await userEvent.type(screen.getByLabelText(/email address/i), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  test("shows 'Password is required' when password is empty", async () => {
    render$();
    await userEvent.type(screen.getByLabelText(/email address/i), "test@test.com");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test("shows 'at least 6 characters' for short password", async () => {
    render$();
    await userEvent.type(screen.getByLabelText(/email address/i), "test@test.com");
    await userEvent.type(screen.getByLabelText("Password"), "abc");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/6 characters/i)).toBeInTheDocument();
  });

  test("does not navigate when validation fails", async () => {
    render$();
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Password visibility
// ---------------------------------------------------------------------------
describe("Login — password toggle", () => {
  test("password field is hidden by default", () => {
    render$();
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  test("toggles to text type when show button is clicked", async () => {
    render$();
    await userEvent.click(screen.getByRole("button", { name: /show password/i }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  });
});
