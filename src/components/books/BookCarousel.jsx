import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "./BookCard";

/**
 * Horizontally scrollable book carousel with prev/next arrow buttons.
 */
const BookCarousel = ({ books = [], title, seeAllLink }) => {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  if (!books.length) return null;

  return (
    <section className="space-y-4">
      {/* Header row */}
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-3">
            {seeAllLink && (
              <a href={seeAllLink} className="text-sm text-[#1e3a5f] font-medium hover:underline" aria-label={`See all ${title ?? "books"}`}>
                See all
              </a>
            )}
            <div className="flex gap-1">
              <button
                onClick={() => scroll(-1)}
                className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll(1)}
                className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {books.map((book) => (
          <div key={book.id} className="w-36 sm:w-44 shrink-0">
            <BookCard book={book} size="sm" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookCarousel;
