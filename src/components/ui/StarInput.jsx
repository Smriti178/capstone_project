import React from "react";
import { Star } from "lucide-react";

/**
 * Interactive star rating input.
 * Used in review forms (e.g. DarkProductDetailPage).
 *
 * @param {number}   value    — currently selected rating (1–5, 0 = none)
 * @param {Function} onChange — called with the new rating number on click
 */
const StarInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} onClick={() => onChange(s)} type="button">
        <Star
          size={18}
          className={
            s <= value
              ? "text-amber-400 fill-amber-400"
              : "text-gray-600 fill-gray-600"
          }
        />
      </button>
    ))}
  </div>
);

export default StarInput;
