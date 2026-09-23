import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../../context/AuthContext";

const AuthConsumer = () => {
  const { user, loading, error, login, register, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.name : "null"}</div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error ?? "null"}</div>
      <button data-testid="login" onClick={() => login({ email: "a@b.com", password: "pass" })}>Login</button>
      <button data-testid="login-empty" onClick={() => login({ email: "", password: "" })}>Login empty</button>
      <button data-testid="register" onClick={() => register({ name: "Jane", email: "j@j.com", password: "pass" })}>Register</button>
      <button data-testid="logout" onClick={logout}>Logout</button>
    </div>
  );
};

const render$ = () => render(<AuthProvider><AuthConsumer /></AuthProvider>);

describe("AuthContext — initial state", () => {
  test("user is null", () => { render$(); expect(screen.getByTestId("user").textContent).toBe("null"); });
  test("loading is false", () => { render$(); expect(screen.getByTestId("loading").textContent).toBe("false"); });
  test("error is null", () => { render$(); expect(screen.getByTestId("error").textContent).toBe("null"); });
});

describe("AuthContext — login", () => {
  test("sets user after valid login", async () => {
    render$();
    await userEvent.click(screen.getByTestId("login"));
    await waitFor(() => expect(screen.getByTestId("user").textContent).not.toBe("null"), { timeout: 2000 });
  });

  test("sets error for empty credentials", async () => {
    render$();
    await userEvent.click(screen.getByTestId("login-empty"));
    await waitFor(() => expect(screen.getByTestId("error").textContent).not.toBe("null"), { timeout: 2000 });
  });
});

describe("AuthContext — register", () => {
  test("sets user name after register", async () => {
    render$();
    await userEvent.click(screen.getByTestId("register"));
    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("Jane"), { timeout: 2000 });
  });
});

describe("AuthContext — logout", () => {
  test("clears user after logout", async () => {
    render$();
    await userEvent.click(screen.getByTestId("login"));
    await waitFor(() => expect(screen.getByTestId("user").textContent).not.toBe("null"), { timeout: 2000 });
    await userEvent.click(screen.getByTestId("logout"));
    expect(screen.getByTestId("user").textContent).toBe("null");
  });
});

describe("AuthContext — guard", () => {
  test("throws outside AuthProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const Bad = () => { useAuth(); return null; };
    expect(() => render(<Bad />)).toThrow("useAuth must be used inside <AuthProvider>");
    spy.mockRestore();
  });
});
