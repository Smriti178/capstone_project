import React from "react";
import BookCard from "./BookCard";

/**
 * Responsive book grid — auto-fills columns based on screen width.
 * Accepts an optional `size` prop to pass down to each BookCard.
 */
const BookGrid = ({ books = [], size = "md", emptyMessage = "No books found." }) => {
  if (!books.length) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">{emptyMessage}</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} size={size} />
      ))}
    </div>
  );
};

export default BookGrid;
