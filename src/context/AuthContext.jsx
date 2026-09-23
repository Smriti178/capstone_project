import React, { createContext, useContext, useState, useCallback } from "react";
import { mockUser } from "../data/user";

const AuthContext = createContext(null);

/**
 * Provides authentication state and actions.
 * Uses mock data — replace with real API calls when ready.
 */
export const AuthProvider = ({ children }) => {
  // null = logged out; object = logged-in user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));
    if (email && password) {
      setUser(mockUser);
      setLoading(false);
      return true;
    }
    setError("Invalid email or password.");
    setLoading(false);
    return false;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 600));
    if (name && email && password) {
      setUser({ ...mockUser, name, email });
      setLoading(false);
      return true;
    }
    setError("Please fill in all fields.");
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
