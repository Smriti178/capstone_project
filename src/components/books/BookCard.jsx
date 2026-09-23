import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency, discountPercent } from "../../utils/formatCurrency";
import StarRating from "../ui/StarRating";
import Badge from "../ui/Badge";

/**
 * Renders a styled SVG book cover that always shows — no broken images.
 * Uses the book's coverBgColor / coverTextColor from mock data.
 */
const CoverArt = ({ book }) => {
  const bg  = book.coverBgColor  ?? "#1e3a5f";
  const fg  = book.coverTextColor ?? "#ffffff";

  const words = (book.title ?? "").split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > 12 && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
    if (lines.length === 4) { line = ""; break; }
  }
  if (line) lines.push(line.trim());

  const lineH  = 16;
  const totalH = lines.length * lineH;
  const startY = 90 - totalH / 2 + lineH / 2;

  return (
    <svg
      viewBox="0 0 200 280"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect width="200" height="280" fill={bg} />
      {/* Bottom accent bar */}
      <rect x="0" y="248" width="200" height="32" fill={fg} fillOpacity="0.15" />
      {/* Title lines */}
      {lines.map((l, i) => (
        <text
          key={i}
          x="100"
          y={startY + i * lineH}
          textAnchor="middle"
          fill={fg}
          fontSize="14"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.5"
        >
          {l.toUpperCase()}
        </text>
      ))}
      {/* Divider */}
      <line
        x1="50" y1={startY + lines.length * lineH + 8}
        x2="150" y2={startY + lines.length * lineH + 8}
        stroke={fg} strokeOpacity="0.35" strokeWidth="1"
      />
      {/* Author */}
      <text
        x="100" y="265"
        textAnchor="middle"
        fill={fg} fontSize="10"
        fontFamily="system-ui, sans-serif"
        fillOpacity="0.8"
        fontWeight="500"
      >
        {(book.author ?? "").toUpperCase()}
      </text>
    </svg>
  );
};

/**
 * BookCard — single book tile used in grids and carousels.
 * Supports two display sizes: "md" (default) and "sm".
 */
const BookCard = ({ book, size = "md" }) => {
  const { addItem, items } = useCart();
  const [added, setAdded]           = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const inCart   = items.some((i) => i.bookId === book.id);
  const discount = discountPercent(book.originalPrice, book.price);
  const isSmall  = size === "sm";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((v) => !v);
  };

  return (
    <Link
      to={`/books/${book.id}`}
      className="group relative flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Cover area */}
      <div className="relative bg-gray-100 overflow-hidden aspect-[3/4]">
        <CoverArt book={book} />

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 rounded-md bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white z-10">
            -{discount}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Info area */}
      <div className="flex flex-col flex-1 gap-1.5 p-3">
        {/* Tags */}
        {!isSmall && book.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} color={tag === "bestseller" ? "amber" : tag === "new" ? "green" : "gray"}>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h3 className={`font-semibold text-gray-900 leading-snug line-clamp-2 ${isSmall ? "text-xs" : "text-sm"}`}>
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 truncate">{book.author}</p>

        <StarRating rating={book.rating} count={book.reviewCount} size={isSmall ? 11 : 13} />

        {/* Price row */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="font-bold text-gray-900">{formatCurrency(book.price)}</span>
          {book.originalPrice > book.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(book.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        {!isSmall && (
          <button
            onClick={handleAddToCart}
            className={`mt-1 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-colors ${
              added || inCart
                ? "bg-green-600 text-white"
                : "bg-[#1e3a5f] hover:bg-[#2e5490] text-white"
            }`}
          >
            <ShoppingCart size={13} />
            {added ? "Added!" : inCart ? "In Cart" : "Add to Cart"}
          </button>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
