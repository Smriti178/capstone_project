import React from "react";
import { Link } from "react-router-dom";

/**
 * Renders a styled SVG book cover using the book's coverBgColor + coverTextColor.
 * Matches the illustrated look in the screenshots.
 */
export const BookCover = ({ book, width = 96, height = 136, className = "" }) => {
  const bg    = book.coverBgColor  ?? "#1e2a4a";
  const fg    = book.coverTextColor ?? "#ffffff";
  const title = book.title ?? "";
  const author = book.author ?? "";

  // Split title into up to 3 lines of ~12 chars each for the SVG
  const words = title.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > 13 && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
    if (lines.length === 3) { line = ""; break; }
  }
  if (line) lines.push(line.trim());

  const lineH = 14;
  const totalH = lines.length * lineH;
  const startY = 50 - totalH / 2 + lineH / 2;

  return (
    <div
      className={`overflow-hidden rounded ${className}`}
      style={{ width, height, background: bg, flexShrink: 0 }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width={width} height={height} fill={bg} />

        {/* Decorative accent stripe */}
        <rect x="0" y={height - 22} width={width} height="22" fill={fg} fillOpacity="0.12" />

        {/* Title lines — centred upper area */}
        {lines.map((l, i) => (
          <text
            key={i}
            x={width / 2}
            y={startY + i * lineH}
            textAnchor="middle"
            fill={fg}
            fontSize="10"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.3"
          >
            {l.toUpperCase()}
          </text>
        ))}

        {/* Divider */}
        <line
          x1={width * 0.2}
          y1={startY + lines.length * lineH + 6}
          x2={width * 0.8}
          y2={startY + lines.length * lineH + 6}
          stroke={fg}
          strokeOpacity="0.4"
          strokeWidth="0.8"
        />

        {/* Author — bottom stripe */}
        <text
          x={width / 2}
          y={height - 8}
          textAnchor="middle"
          fill={fg}
          fontSize="7.5"
          fontWeight="500"
          fontFamily="system-ui, sans-serif"
          fillOpacity="0.85"
        >
          {author.toUpperCase()}
        </text>
      </svg>
    </div>
  );
};

/**
 * Coloured genre tag list  e.g. "Non-Fiction, Self Help"
 */
export const GenreTagList = ({ tags = [] }) => (
  <p className="text-xs">
    {tags.map((tag, i) => (
      <span key={tag}>
        <Link to={`/dark?cat=${encodeURIComponent(tag.toLowerCase())}`} className="text-blue-400 hover:underline">
          {tag}
        </Link>
        {i < tags.length - 1 && <span className="text-gray-500">, </span>}
      </span>
    ))}
  </p>
);

/**
 * "Delivery by Mon, 21 Jul" line
 */
export const DeliveryBadge = ({ text }) => (
  <p className="text-xs text-gray-400">{text}</p>
);

/** Shared delivery text helper */
const getDelivery = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return `Delivery by ${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}`;
};

/**
 * Catalogue book card — two variants:
 *
 *  default  : horizontal card for section-row grids
 *  compact  : narrower card for Related Reads sidebar
 */
const CatalogueBookCard = ({ book, compact = false }) => {
  const deliveryText = getDelivery();
  const genres = book.genres ?? (book.category ? [book.category] : []);

  /* ── Compact variant (Related Reads sidebar) ── */
  if (compact) {
    return (
      <Link
        to={`/dark/books/${book.id}`}
        className="flex gap-3 py-3 border-b border-white/5 last:border-0 hover:opacity-90 transition-opacity"
      >
        <BookCover book={book} width={64} height={88} className="shrink-0" />
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">{book.title}</p>
          <p className="text-xs text-gray-400">
            by <span className="text-blue-400">{book.author}</span>
          </p>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-0.5">{book.description}</p>
          <p className="text-xs text-gray-500 mt-0.5">{book.format ?? "Paperback"}</p>
          <GenreTagList tags={genres.slice(0, 2)} />
          <p className="text-sm font-bold text-white mt-0.5">₹{book.price}</p>
          <DeliveryBadge text={deliveryText} />
        </div>
      </Link>
    );
  }

  /* ── Default variant (section-row grid card) ── */
  return (
    <div className="flex gap-3 border-b border-white/5 last:border-0 py-4 hover:bg-white/[0.02] transition-colors">
      <Link to={`/dark/books/${book.id}`} className="shrink-0">
        <BookCover book={book} width={96} height={136} />
      </Link>

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <Link
          to={`/dark/books/${book.id}`}
          className="text-sm font-semibold text-white leading-snug line-clamp-2 hover:text-blue-300 transition-colors"
        >
          {book.title}
        </Link>
        <p className="text-xs text-gray-400">
          by <span className="text-blue-400 cursor-pointer hover:underline">{book.author}</span>
        </p>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{book.description}</p>
        <p className="text-xs text-gray-500 mt-0.5">{book.format ?? "Paperback"}</p>
        <GenreTagList tags={genres.slice(0, 2)} />
        <p className="text-sm font-bold text-white mt-0.5">₹{book.price}</p>
        <DeliveryBadge text={deliveryText} />
      </div>
    </div>
  );
};

export default CatalogueBookCard;
