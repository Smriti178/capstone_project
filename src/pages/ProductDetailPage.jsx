import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
  BookOpen,
  Calendar,
  Hash,
  ThumbsUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Breadcrumb from "../components/ui/Breadcrumb";
import RelatedBooks from "../components/books/RelatedBooks";
import StarRating from "../components/ui/StarRating";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { books } from "../data/books";
import { brands } from "../data/brands";
import { categories } from "../data/categories";
import { getReviewsForBook } from "../data/reviews";
import { useCart } from "../context/CartContext";
import { formatCurrency, discountPercent } from "../utils/formatCurrency";
import { getTentativeDelivery } from "../utils/deliveryDate";

/* ── Rating breakdown bar ────────────────────────────── */
const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span className="w-4 text-right">{star}</span>
      <span className="text-gray-400">★</span>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-gray-400">{pct}%</span>
    </div>
  );
};

/* ── Single review card ──────────────────────────────── */
const ReviewCard = ({ review }) => (
  <div className="border-b border-gray-100 pb-5 last:border-0">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-sm font-bold text-white">
          {review.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{review.user}</p>
          <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
        </div>
      </div>
      <StarRating rating={review.rating} showCount={false} size={13} />
    </div>
    <h4 className="mt-3 text-sm font-semibold text-gray-900">{review.title}</h4>
    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{review.body}</p>
    <button className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
      <ThumbsUp size={12} /> Helpful ({review.helpful})
    </button>
  </div>
);

/* ── Tabs: Description / Details / Reviews ───────────── */
const TABS = ["Description", "Details", "Reviews"];

const BookTabs = ({ book, reviews }) => {
  const [active, setActive] = useState("Description");

  const brand = brands.find((b) => b.id === book.brand);
  const category = categories.find((c) => c.id === book.category);

  // Synthetic rating breakdown from mock
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  return (
    <div>
      {/* Tab bar — allow scroll on very narrow screens */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`shrink-0 px-4 sm:px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
              active === tab
                ? "border-[#1e3a5f] text-[#1e3a5f]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
            {tab === "Reviews" && (
              <span className="ml-1.5 text-xs text-gray-400">({reviews.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab bodies */}
      <div className="pt-6">
        {active === "Description" && (
          <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">
            {book.description}
          </p>
        )}

        {active === "Details" && (
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 text-sm max-w-lg">
            {[
              { label: "Author", value: book.author },
              { label: "Publisher", value: brand?.name ?? "—" },
              { label: "Category", value: category?.label ?? "—" },
              { label: "Published", value: book.publishedYear },
              { label: "Pages", value: book.pages },
              { label: "ISBN", value: book.isbn },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-gray-400 uppercase tracking-wide">{label}</dt>
                <dd className="mt-0.5 font-medium text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {active === "Reviews" && (
          <div className="flex flex-col gap-8 max-w-2xl">
            {/* Aggregate */}
            <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex flex-col items-center justify-center gap-1 shrink-0">
                <span className="text-5xl font-bold text-gray-900">{book.rating}</span>
                <StarRating rating={book.rating} showCount={false} size={16} />
                <span className="text-xs text-gray-400">{book.reviewCount.toLocaleString()} reviews</span>
              </div>
              <div className="flex flex-col justify-center gap-2 flex-1">
                {starCounts.map(({ star, count }) => (
                  <RatingBar key={star} star={star} count={count} total={reviews.length} />
                ))}
              </div>
            </div>

            {/* Review list */}
            <div className="flex flex-col gap-5">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Page ────────────────────────────────────────────── */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();

  const book = books.find((b) => b.id === id);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  if (!book) {
    return (
      <PageWrapper>
        <div className="py-24 text-center">
          <p className="text-gray-400 text-lg">Book not found.</p>
          <Button className="mt-6" onClick={() => navigate("/books")}>
            Back to All Books
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const reviews = getReviewsForBook(book.id);
  const discount = discountPercent(book.originalPrice, book.price);
  const inCart = items.some((i) => i.bookId === book.id);
  const brand = brands.find((b) => b.id === book.brand);
  const category = categories.find((c) => c.id === book.category);
  const deliveryWindow = getTentativeDelivery(3, 5);

  const handleAddToCart = () => {
    addItem(book, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(book, qty);
    navigate("/cart");
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-12">

        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Home", to: "/" },
          { label: "Books", to: "/books" },
          ...(category ? [{ label: category.label, to: `/categories?cat=${category.id}` }] : []),
          { label: book.title },
        ]} />

        {/* Main product section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* ── Cover ── */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative w-full max-w-xs">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-lg aspect-[3/4]">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                {/* Fallback */}
                <div
                  className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2e5490] text-white px-6 text-center"
                  style={{ display: "none" }}
                >
                  <div>
                    <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="font-bold text-lg leading-snug">{book.title}</p>
                    <p className="text-sm text-white/70 mt-1">{book.author}</p>
                  </div>
                </div>
              </div>

              {/* Discount badge */}
              {discount > 0 && (
                <span className="absolute top-3 left-3 rounded-lg bg-red-500 px-2 py-1 text-sm font-bold text-white shadow">
                  -{discount}%
                </span>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => setWishlisted((v) => !v)}
                className={`absolute top-3 right-3 rounded-full p-2 shadow-md transition-colors ${
                  wishlisted
                    ? "bg-red-50 text-red-500"
                    : "bg-white text-gray-400 hover:text-red-400"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={18} className={wishlisted ? "fill-red-500" : ""} />
              </button>
            </div>
          </div>

          {/* ── Info ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Tags */}
            {book.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <Badge
                    key={tag}
                    color={
                      tag === "bestseller" ? "amber" :
                      tag === "new" ? "green" :
                      tag === "award-winner" ? "blue" : "gray"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                {book.title}
              </h1>
              <p className="mt-1 text-base text-gray-500">by{" "}
                <Link
                  to={`/books?q=${encodeURIComponent(book.author)}`}
                  className="text-[#1e3a5f] hover:underline font-medium"
                >
                  {book.author}
                </Link>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={book.rating} count={book.reviewCount} size={16} />
              <button
                type="button"
                onClick={() => document.getElementById("book-tabs")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm text-[#1e3a5f] hover:underline font-medium"
              >
                {book.reviewCount.toLocaleString()} reviews
              </button>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {formatCurrency(book.price)}
              </span>
              {book.originalPrice > book.price && (
                <>
                  <span className="text-base sm:text-lg text-gray-400 line-through">
                    {formatCurrency(book.originalPrice)}
                  </span>
                  <span className="rounded-md bg-red-50 px-2 py-0.5 text-sm font-semibold text-red-600">
                    Save {formatCurrency(book.originalPrice - book.price)}
                  </span>
                </>
              )}
            </div>

            {/* Publisher & category meta */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              {brand && (
                <span className="flex items-center gap-1.5">
                  <BookOpen size={14} />
                  <Link to={`/books?brand=${brand.id}`} className="hover:text-[#1e3a5f] hover:underline">
                    {brand.name}
                  </Link>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Hash size={14} /> {book.pages} pages
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {book.publishedYear}
              </span>
            </div>

            {/* Delivery estimate */}
            <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
              <Truck size={16} className="text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold text-green-700">Free delivery</span>
                <span className="text-green-600"> · Estimated arrival: </span>
                <span className="font-medium text-green-700">{deliveryWindow}</span>
              </div>
            </div>

            {/* Stock status */}
            <div className="text-sm">
              {book.stock > 10 ? (
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <CheckCircle2 size={14} /> In Stock
                </span>
              ) : book.stock > 0 ? (
                <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <AlertCircle size={14} /> Only {book.stock} left — order soon
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-red-500 font-medium">
                  <XCircle size={14} /> Out of Stock
                </span>
              )}
            </div>

            {/* Quantity + actions */}
            <div className="flex flex-col gap-3 pt-1">
              {/* Qty selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-gray-900 border-x border-gray-200 min-w-[2.5rem] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(book.stock, q + 1))}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  variant={added ? "ghost" : "primary"}
                  size="lg"
                  className={`flex-1 ${added ? "!bg-green-600 !text-white" : ""}`}
                >
                  <ShoppingCart size={18} />
                  {added ? "Added to Cart!" : inCart ? "Add More to Cart" : "Add to Cart"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={book.stock === 0}
                  variant="accent"
                  size="lg"
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>

              {/* Share + wishlist row */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setWishlisted((v) => !v)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    wishlisted ? "text-red-500" : "text-gray-500 hover:text-red-400"
                  }`}
                >
                  <Heart size={15} className={wishlisted ? "fill-red-500" : ""} />
                  {wishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <Share2 size={15} /> Share
                </button>
              </div>
            </div>

            {/* Guarantee strip */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4">
              {[
                { icon: ShieldCheck, label: "Secure checkout" },
                { icon: RotateCcw, label: "30-day returns" },
                { icon: Truck, label: "Free over $25" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Icon size={14} className="text-[#1e3a5f] shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div id="book-tabs" className="rounded-2xl border border-gray-200 bg-white p-6">
          <BookTabs book={book} reviews={reviews} />
        </div>

        {/* ── Related books ── */}
        <RelatedBooks currentBook={book} />

      </div>
    </PageWrapper>
  );
};

export default ProductDetailPage;
