import React from "react";
import { Star } from "lucide-react";

/**
 * Renders a star rating row.
 * @param {number} rating  0–5 (supports .5 steps)
 * @param {number} count   Number of reviews
 * @param {boolean} showCount
 */
const StarRating = ({ rating = 0, count = 0, showCount = true, size = 14 }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <Star
            key={star}
            size={size}
            className={
              filled || half
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300 fill-gray-300"
            }
          />
        );
      })}
      {showCount && (
        <span className="text-xs text-gray-500 ml-1">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;
