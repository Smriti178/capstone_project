import React from "react";

const variants = {
  primary: "bg-[#1e3a5f] hover:bg-[#2e5490] text-white",
  secondary: "bg-white border border-[#1e3a5f] text-[#1e3a5f] hover:bg-gray-50",
  accent: "bg-[#f59e0b] hover:bg-amber-500 text-white",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

/**
 * Reusable Button atom.
 * @param {"primary"|"secondary"|"accent"|"ghost"|"danger"} variant
 * @param {"sm"|"md"|"lg"} size
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  fullWidth = false,
  ...props
}) => (
  <button
    disabled={disabled}
    className={[
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1e3a5f]",
      variants[variant],
      sizes[size],
      fullWidth ? "w-full" : "",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </button>
);

export default Button;
