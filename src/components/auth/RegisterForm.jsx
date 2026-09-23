import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";

/**
 * Registration form — name, email, password, confirm password.
 * Inline validation before delegating to AuthContext.register.
 */
const RegisterForm = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (key) => (e) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!fields.name.trim()) errs.name = "Full name is required.";
    if (!fields.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errs.email = "Enter a valid email address.";
    if (!fields.password) errs.password = "Password is required.";
    else if (fields.password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(fields.password))
      errs.password = "Include at least one uppercase letter.";
    else if (!/[0-9]/.test(fields.password))
      errs.password = "Include at least one number.";
    if (fields.confirm !== fields.password)
      errs.confirm = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    const ok = await register(fields);
    if (ok) navigate("/");
  };

  // Live password strength indicator
  const strength = (() => {
    const p = fields.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="relative">
        <Input
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Alex Johnson"
          value={fields.name}
          onChange={set("name")}
          error={fieldErrors.name}
        />
        <User size={15} className="absolute right-3 top-8 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <Input
          id="reg-email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={set("email")}
          error={fieldErrors.email}
        />
        <Mail size={15} className="absolute right-3 top-8 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <Input
          id="reg-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          value={fields.password}
          onChange={set("password")}
          error={fieldErrors.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>

        {/* Strength meter */}
        {fields.password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    n <= strength ? strengthColor : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs font-medium ${
              ["", "text-red-500", "text-yellow-600", "text-blue-600", "text-green-600"][strength]
            }`}>
              {strengthLabel}
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        <Input
          id="confirm"
          label="Confirm password"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={fields.confirm}
          onChange={set("confirm")}
          error={fieldErrors.confirm}
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
        >
          {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      <p className="text-xs text-gray-400">
        By registering, you agree to our{" "}
        <Link to="#" className="text-[#1e3a5f] hover:underline">Terms of Service</Link>
        {" "}and{" "}
        <Link to="#" className="text-[#1e3a5f] hover:underline">Privacy Policy</Link>.
      </p>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-[#1e3a5f] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
