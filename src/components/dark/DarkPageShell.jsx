import React from "react";
import DarkNavbar from "./DarkNavbar";

/**
 * Shared shell for all dark-theme "Book Worm" pages.
 * Renders the full-height dark background, the DarkNavbar,
 * and a centred max-width content container.
 *
 * Props:
 *   bg        {string}  — Tailwind bg class (default: "bg-[#0d1117]")
 *   className {string}  — extra classes on the inner content wrapper
 *   children  {node}
 */
const DarkPageShell = ({
  bg = "bg-[#0d1117]",
  className = "",
  children,
}) => (
  <div className={`min-h-screen ${bg} text-white flex flex-col`}>
    <DarkNavbar />
    <div className={`mx-auto max-w-screen-xl w-full px-4 py-5 flex flex-col gap-6 ${className}`}>
      {children}
    </div>
  </div>
);

export default DarkPageShell;
