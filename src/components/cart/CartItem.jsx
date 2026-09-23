import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import BookCoverArt from "../ui/BookCoverArt";

/**
 * A single cart line-item row.
 * Used in both CartDrawer and CartPage.
 * `compact` = smaller layout for the drawer.
 */
const CartItem = ({ item, compact = false }) => {
  const { removeItem, updateQuantity } = useCart();
  const { book, quantity } = item;

  if (!book) return null;

  return (
    <div className={`flex gap-3 ${compact ? "py-3" : "py-4"} border-b border-gray-100 last:border-0 min-w-0`}>
      {/* Cover thumbnail */}
      <Link to={`/books/${book.id}`} className="shrink-0">
        <BookCoverArt
          book={book}
          className={`rounded-lg border border-gray-200 ${compact ? "w-12 h-16" : "w-16 sm:w-20 h-24 sm:h-28"}`}
        />
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link
          to={`/books/${book.id}`}
          className={`font-semibold text-gray-900 hover:text-[#1e3a5f] leading-snug line-clamp-2 ${compact ? "text-xs" : "text-sm"}`}
        >
          {book.title}
        </Link>
        <p className="text-xs text-gray-500 truncate">
          {book.author}
        </p>

        <div className="flex items-center justify-between gap-2 mt-auto pt-1 flex-wrap min-w-0">
          {/* Quantity stepper */}
          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden shrink-0">
            <button
              onClick={() =>
                quantity <= 1
                  ? removeItem(book.id)
                  : updateQuantity(book.id, quantity - 1)
              }
              className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label={`Decrease quantity of ${book.title}`}
            >
              <Minus size={12} />
            </button>
            <span className={`px-2 py-1 font-semibold text-gray-900 border-x border-gray-200 min-w-[1.75rem] text-center ${compact ? "text-xs" : "text-sm"}`}>
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(book.id, quantity + 1)}
              className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label={`Increase quantity of ${book.title}`}
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Line total */}
            <span className={`font-bold text-gray-900 ${compact ? "text-sm" : "text-sm sm:text-base"}`}>
              {formatCurrency(book.price * quantity)}
            </span>

            {/* Remove */}
            <button
              onClick={() => removeItem(book.id)}
              className="text-gray-300 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={compact ? 13 : 15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
