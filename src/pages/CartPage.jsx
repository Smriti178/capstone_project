import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Breadcrumb from "../components/ui/Breadcrumb";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import BookCarousel from "../components/books/BookCarousel";
import { useCart } from "../context/CartContext";
import { books } from "../data/books";

/* Suggested books: highest-rated titles not already in cart */
const getSuggestions = (cartItems) => {
  const cartIds = new Set(cartItems.map((i) => i.bookId));
  return [...books]
    .filter((b) => !cartIds.has(b.id))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);
};

/* ── Empty state ─────────────────────────────────────── */
const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-5">
    <div className="rounded-full bg-gray-100 p-8">
      <ShoppingCart size={48} className="text-gray-300" />
    </div>
    <div className="text-center">
      <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
      <p className="mt-1 text-sm text-gray-500">
        Looks like you haven't added anything yet.
      </p>
    </div>
    <Link
      to="/books"
      className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2e5490] transition-colors"
    >
      Browse Books <ArrowRight size={16} />
    </Link>
  </div>
);

/* ── Page ────────────────────────────────────────────── */
const CartPage = () => {
  const { items, itemCount, clearCart } = useCart();
  const suggestions = getSuggestions(items);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-10">

        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Shopping Cart" }]} />

        {/* Heading */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart
            {itemCount > 0 && (
              <span className="ml-2 text-base font-normal text-gray-400">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
          {itemCount > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── Item list ── */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white px-6 divide-y divide-gray-100">
              {items.map((item) => (
                <CartItem key={item.bookId} item={item} />
              ))}
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1 sticky top-24">
              <CartSummary />
            </div>
          </div>
        )}

        {/* You might also like */}
        {suggestions.length > 0 && (
          <BookCarousel
            title="You might also like"
            books={suggestions}
            seeAllLink="/books?sort=rating"
          />
        )}

      </div>
    </PageWrapper>
  );
};

export default CartPage;
