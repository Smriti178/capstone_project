import React from "react";

/** Reusable text / email / password input */
const Input = React.forwardRef(
  ({ label, error, id, className = "", ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          aria-describedby={errorId}
          aria-invalid={error ? "true" : undefined}
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent",
            error ? "border-red-500" : "border-gray-300",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
