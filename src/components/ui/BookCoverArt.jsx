import React from "react";

/**
 * BookCoverArt — always renders a styled SVG book cover.
 * Used everywhere a book thumbnail appears (cart, orders, product detail).
 * Falls back gracefully when book.cover is null/undefined/broken.
 *
 * Props:
 *   book      {object}  — book data (needs .title, .author, .coverBgColor, .coverTextColor)
 *   className {string}  — extra classes (e.g. "w-16 h-24 rounded-lg")
 */
const BookCoverArt = ({ book = {}, className = "" }) => {
  const bg = book.coverBgColor  ?? "#1e3a5f";
  const fg = book.coverTextColor ?? "#ffffff";

  // Wrap title into up to 4 lines of ≤12 chars
  const words = (book.title ?? "Untitled").split(" ");
  const lines = [];
  let current = "";
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > 12 && current) {
      lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
    if (lines.length === 4) { current = ""; break; }
  }
  if (current) lines.push(current);

  const lineH  = 15;
  const totalH = lines.length * lineH;
  const startY = 88 - totalH / 2 + lineH / 2;

  return (
    <div className={`overflow-hidden ${className}`} aria-label={book.title}>
      <svg
        viewBox="0 0 120 170"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background */}
        <rect width="120" height="170" fill={bg} />

        {/* Spine accent strip on left */}
        <rect x="0" y="0" width="6" height="170" fill={fg} fillOpacity="0.18" />

        {/* Bottom bar */}
        <rect x="0" y="148" width="120" height="22" fill={fg} fillOpacity="0.13" />

        {/* Title lines */}
        {lines.map((l, i) => (
          <text
            key={i}
            x="63"
            y={startY + i * lineH}
            textAnchor="middle"
            fill={fg}
            fontSize="11"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.3"
          >
            {l.toUpperCase()}
          </text>
        ))}

        {/* Divider */}
        <line
          x1="28" y1={startY + lines.length * lineH + 5}
          x2="92" y2={startY + lines.length * lineH + 5}
          stroke={fg} strokeOpacity="0.3" strokeWidth="0.8"
        />

        {/* Author */}
        <text
          x="63" y="160"
          textAnchor="middle"
          fill={fg} fontSize="7.5"
          fontFamily="system-ui, -apple-system, sans-serif"
          fillOpacity="0.75"
          fontWeight="500"
        >
          {(book.author ?? "").toUpperCase()}
        </text>
      </svg>
    </div>
  );
};

export default BookCoverArt;
