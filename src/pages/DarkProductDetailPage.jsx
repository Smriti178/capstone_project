import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Star, Globe, BarChart3, BookmarkPlus } from "lucide-react";
import DarkPageShell from "../components/dark/DarkPageShell";
import Breadcrumb from "../components/ui/Breadcrumb";
import StarInput from "../components/ui/StarInput";
import CatalogueBookCard, { BookCover } from "../components/dark/CatalogueBookCard";
import { books } from "../data/books";
import { getReviewsForBook } from "../data/reviews";
import { useCart } from "../context/CartContext";

/* ── Star row ─────────────────────────────────────────── */
const StarRow = ({ rating = 0, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-600 fill-gray-600"}
      />
    ))}
  </div>
);

/* ── Page ─────────────────────────────────────────────── */
const DarkProductDetailPage = () => {
  const { id } = useParams();
  const { addItem, items } = useCart();

  const book = books.find((b) => b.id === id) ?? books[0];
  const reviews = getReviewsForBook(book.id);
  const related = books.filter((b) => b.category === book.category && b.id !== book.id).slice(0, 3);

  const inCart = items.some((i) => i.bookId === book.id);
  const [added, setAdded] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = () => {
    addItem(book, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const priceINR = Math.round(book.price * 83);

  return (
    <DarkPageShell>
      {/* Breadcrumb */}
      <Breadcrumb theme="dark" items={[
        { label: "Home", to: "/dark" },
        { label: "Non-Fiction", to: "/dark?cat=non-fiction" },
        { label: "Self Help" },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: product detail + reviews ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* ── Top product section ── */}
          <div className="flex flex-col sm:flex-row gap-0">

            {/* Front cover */}
            <BookCover
              book={book}
              width={176}
              height={256}
              className="shrink-0 rounded-l-xl"
            />

            {/* Back cover / description panel */}
            <div className="w-44 shrink-0 h-64 rounded-r-xl bg-[#f5f0e8] text-[#1a1a1a] p-4 flex flex-col gap-2 overflow-hidden text-xs leading-relaxed">
              <p className="italic text-[10px] text-center text-gray-500 border-b border-gray-300 pb-2 mb-1">
                "A refreshing path to clarity in a cluttered world."
              </p>
              <p className="font-bold text-[10px]">Discover how less can truly be more.</p>
              <p className="text-[9px] text-gray-700 line-clamp-6">
                In <em>{book.title}</em>, {book.author} guides you through practical strategies to declutter your mind, space, and schedule. Whether you're overwhelmed, over-committed, or just over it—this book offers a calm, mindful approach to building a simpler, more fulfilling life.
              </p>
              <div className="mt-auto">
                <p className="font-bold text-[9px] text-gray-800">About the Author</p>
                <p className="text-[8px] text-gray-600 line-clamp-3">
                  {book.author} is a productivity coach and advocate for intentional living. Their work has helped thousands embrace minimalism as a lifestyle for clarity, freedom, and focus.
                </p>
              </div>
              {/* Barcode mock */}
              <div className="flex items-center gap-1 mt-1">
                <div className="flex gap-px opacity-60">
                  {[2,1,3,1,2,3,1,2,1,3,2,1,2,1,3].map((w, i) => (
                    <div key={i} className="bg-black h-5" style={{ width: `${w}px` }} />
                  ))}
                </div>
                <span className="text-[7px] text-gray-500 ml-1">ISBN 978-0-123456-78-9</span>
              </div>
            </div>

            {/* Info panel */}
            <div className="flex flex-col gap-3 flex-1 min-w-0 sm:pl-5 pt-4 sm:pt-0">
              <div>
                <h1 className="text-xl font-bold text-white leading-snug">{book.title}</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  by <span className="text-blue-400 hover:underline cursor-pointer">{book.author}</span>
                </p>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{book.description}</p>

              <p className="text-xs text-gray-500">
                Published by:{" "}
                <span className="text-blue-400 hover:underline cursor-pointer">ABC Publishers</span>
              </p>

              <p className="text-xs text-gray-400">Paperback</p>
              <div className="flex gap-2 text-xs">
                <Link to="#" className="text-blue-400 hover:underline">Non-fiction</Link>
                <span className="text-gray-600">,</span>
                <Link to="#" className="text-blue-400 hover:underline">Self Help</Link>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">₹{priceINR}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Delivery by <span className="text-white font-medium">Mon, 21 Jul</span>
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                    added ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <ShoppingCart size={15} />
                  {added ? "Added!" : inCart ? "Add More" : "Add to Cart"}
                </button>
                <button
                  onClick={() => setWishlisted((v) => !v)}
                  className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${
                    wishlisted
                      ? "border-red-500 text-red-400 bg-red-500/10"
                      : "border-white/20 text-gray-300 hover:border-white/40"
                  }`}
                >
                  <BookmarkPlus size={15} />
                  {wishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>

              {/* Meta row */}
              <div className="flex gap-5 flex-wrap text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1.5">
                  <Globe size={12} /> Language:{" "}
                  <span className="text-blue-400 ml-1">English</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={12} className="text-amber-400" />
                  <span>Rating</span>
                  <StarRow rating={book.rating} size={11} />
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 size={12} /> Sells:{" "}
                  <span className="text-white ml-1">145 copies sold</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── About the writer ── */}
          <div className="rounded-xl bg-[#161b27] border border-white/5 p-5 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-white">About the writer</h2>
            <div className="flex gap-4">
              {/* Author avatar */}
              <div className="shrink-0 h-16 w-16 rounded-full bg-gray-600 overflow-hidden border border-white/10 flex items-center justify-center text-2xl font-bold text-white">
                {/* Placeholder person silhouette */}
                <svg viewBox="0 0 64 64" className="w-full h-full opacity-60" fill="currentColor">
                  <circle cx="32" cy="22" r="12" />
                  <path d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24H8z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">{book.author}</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {book.author} is a writer, minimalist, and productivity coach based in San Francisco.
                  With a passion for intentional living, {book.author} has dedicated their career to
                  helping individuals simplify their lives — one habit, one space, and one thought at a time.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  They are the author of <em>{book.title}</em>, an acclaimed guide to decluttering both
                  physically and mentally. Their other works include <em>Less, But Better</em> and{" "}
                  <em>The Focus Reset</em>, which have helped thousands rethink consumerism, prioritize
                  what truly matters, and build sustainable systems for personal growth.
                </p>
              </div>
            </div>
          </div>

          {/* ── Reviews ── */}
          <div className="rounded-xl bg-[#161b27] border border-white/5 p-5 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-white">Reviews</h2>

            {/* Two-column layout: write review (left) + existing review (right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Write review — left */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Leave Your Review</span>
                  <span>{reviewText.length}/100</span>
                </div>
                <textarea
                  maxLength={100}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Placeholder text"
                  className="w-full bg-[#1e2a4a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 resize-none h-28 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Existing reviews — right */}
              <div className="flex flex-col gap-3">
                {reviews.slice(0, 1).map((r) => (
                  <div key={r.id} className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-white">{r.user}</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{r.body}</p>
                    <StarRow rating={r.rating} size={14} />
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-xs text-gray-500">No reviews yet. Be the first!</p>
                )}
              </div>
            </div>

            {/* Submit row */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <StarInput value={reviewRating} onChange={setReviewRating} />
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 transition-colors">
                Submit →
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Related Reads sidebar ── */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-[#161b27] border border-white/5 p-4 sticky top-16">
            <h3 className="text-sm font-semibold text-white mb-1">Related Reads</h3>
            <div className="flex flex-col">
              {related.map((b) => (
                <CatalogueBookCard key={b.id} book={b} compact />
              ))}
              {related.length === 0 && (
                <p className="text-xs text-gray-500">No related books found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DarkPageShell>
  );
};

export default DarkProductDetailPage;
