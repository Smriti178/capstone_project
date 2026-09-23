import React from "react";
import { Link } from "react-router-dom";
import { books } from "../../data/books";
import BookCard from "./BookCard";

/**
 * Shows a row of books from the same category, excluding the current book.
 * Used on the ProductDetailPage.
 */
const RelatedBooks = ({ currentBook, maxItems = 5 }) => {
  const related = books
    .filter(
      (b) => b.category === currentBook.category && b.id !== currentBook.id
    )
    .slice(0, maxItems);

  if (!related.length) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">You might also like</h2>
        <Link
          to={`/categories?cat=${currentBook.category}`}
          className="text-sm text-[#1e3a5f] font-medium hover:underline"
        >
          See all in {currentBook.category}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {related.map((book) => (
          <BookCard key={book.id} book={book} size="sm" />
        ))}
      </div>
    </section>
  );
};

export default RelatedBooks;
