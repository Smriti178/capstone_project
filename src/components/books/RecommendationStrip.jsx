import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import BookCarousel from "./BookCarousel";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { getRecommendations, hasOrderHistory } from "../../utils/recommendations";
import { books } from "../../data/books";

/**
 * Personalised recommendation strip.
 *
 * Behaviour:
 * - Logged-in user WITH order history → personalised carousel with "Based on your orders" label
 * - Logged-in user WITHOUT order history → top-rated fallback ("Popular Right Now")
 * - Guest (not logged in) → top-rated fallback with sign-in nudge
 *
 * Used on HomePage and OrderHistoryPage.
 */
const RecommendationStrip = ({ limit = 10 }) => {
  const { user } = useAuth();
  const { orders } = useOrders();

  const isPersonalised = user && hasOrderHistory(orders);

  const recommended = isPersonalised
    ? getRecommendations(orders, limit)
    : [...books].sort((a, b) => b.rating - a.rating).slice(0, limit);

  const title = isPersonalised ? "Recommended for You" : "Popular Right Now";
  const subtitle = isPersonalised
    ? "Based on your reading history"
    : user
    ? "Start ordering to get personalised picks"
    : "Sign in to get personalised recommendations";

  if (!recommended.length) return null;

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#f59e0b]" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!user && (
            <Link
              to="/login"
              className="text-sm text-[#1e3a5f] font-medium hover:underline flex items-center gap-1"
            >
              Sign in <ArrowRight size={13} />
            </Link>
          )}
          {isPersonalised && (
            <Link
              to="/orders"
              className="text-sm text-gray-500 hover:text-[#1e3a5f] hover:underline flex items-center gap-1"
            >
              View order history <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>

      {/* Carousel */}
      <BookCarousel books={recommended} seeAllLink="/books?sort=rating" />

      {/* Personalised quality callout */}
      {isPersonalised && (
        <p className="text-xs text-gray-400 text-center">
          ✨ Recommendations are based on categories and authors you've previously purchased.
        </p>
      )}
    </section>
  );
};

export default RecommendationStrip;
