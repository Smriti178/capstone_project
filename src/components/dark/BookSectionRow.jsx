import React from "react";
import CatalogueBookCard from "./CatalogueBookCard";

/**
 * A titled section (Recommended / Bestsellers / New Launches) with a
 * 3-column grid of CatalogueBookCards — matches the screenshot layout.
 */
const BookSectionRow = ({ title, books = [] }) => {
  if (!books.length) return null;

  return (
    <section className="flex flex-col gap-2">
      {/* Section header */}
      <h2 className="text-base font-semibold text-white py-1">{title}</h2>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y divide-white/5 sm:divide-y-0">
        {books.slice(0, 3).map((book, i) => (
          <div
            key={book.id}
            className={`sm:border-b-0 ${
              i < books.slice(0, 3).length - 1 ? "sm:border-r border-white/5" : ""
            } px-0 sm:px-4 first:pl-0 last:pr-0`}
          >
            <CatalogueBookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookSectionRow;
