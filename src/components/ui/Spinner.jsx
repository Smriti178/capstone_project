import React from "react";

/** Loading spinner with optional label */
const Spinner = ({ size = 24, label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500">
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin text-[#1e3a5f]"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="40"
        strokeDashoffset="10"
        strokeLinecap="round"
      />
    </svg>
    {label && <span className="text-sm">{label}</span>}
  </div>
);

export default Spinner;
