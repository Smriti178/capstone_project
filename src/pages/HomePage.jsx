import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, RotateCcw, Gift, Headphones } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import BookCarousel from "../components/books/BookCarousel";
import RecommendationStrip from "../components/books/RecommendationStrip";
import { books } from "../data/books";
import { categories } from "../data/categories";

/* ── Helpers ─────────────────────────────────────────── */
const featured = books.filter((b) => b.tags?.includes("bestseller")).slice(0, 8);
const newArrivals = books.filter((b) => b.tags?.includes("new")).slice(0, 8);
const topRated = [...books].sort((a, b) => b.rating - a.rating).slice(0, 8);

const trustBadges = [
  { icon: Truck, label: "Free Delivery", sub: "On orders over $25" },
  { icon: RotateCcw, label: "Easy Returns", sub: "Within 30 days" },
  { icon: Gift, label: "Gift Points", sub: "Earn on every order" },
  { icon: Headphones, label: "24/7 Support", sub: "We're always here" },
];

/* ── Hero banner ─────────────────────────────────────── */
const HeroBanner = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2e5490] px-5 py-10 sm:px-8 sm:py-14 md:px-16 text-white">
    <div className="relative z-10 max-w-lg">
      <span className="inline-block rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium mb-3 sm:mb-4">
        🎉 New arrivals every week
      </span>
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-3 sm:mb-4">
        Your next great<br />read is here.
      </h1>
      <p className="text-white/70 text-sm md:text-base mb-6 sm:mb-8 leading-relaxed">
        Browse thousands of titles across every genre. Earn gift points with every purchase.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/books"
          className="inline-flex items-center gap-2 rounded-xl bg-[#f59e0b] hover:bg-amber-500 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white transition-colors"
        >
          Browse All Books <ArrowRight size={16} />
        </Link>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white transition-colors"
        >
          View Categories
        </Link>
      </div>
    </div>
    {/* Decorative circles — hidden on tiny screens so they don't spill */}
    <div className="hidden sm:block absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/5" />
    <div className="hidden sm:block absolute -right-4 bottom-0 h-48 w-48 rounded-full bg-white/5" />
  </div>
);

/* ── Category strip ──────────────────────────────────── */
const CategoryStrip = () => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold text-gray-900">Browse by Category</h2>
      <Link to="/categories" className="text-sm text-[#1e3a5f] font-medium hover:underline flex items-center gap-1 shrink-0 ml-4">
        All categories <ArrowRight size={14} />
      </Link>
    </div>
    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/categories?cat=${cat.id}`}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-2 sm:p-3 hover:border-[#1e3a5f] hover:shadow-sm transition-all text-center group"
        >
          <span className="text-xl sm:text-2xl">{cat.icon}</span>
          <span className="text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-[#1e3a5f] leading-tight line-clamp-2">
            {cat.label}
          </span>
          <span className="hidden sm:block text-xs text-gray-400">{cat.count}</span>
        </Link>
      ))}
    </div>
  </section>
);

/* ── Trust badges ────────────────────────────────────── */
const TrustBadges = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {trustBadges.map(({ icon: Icon, label, sub }) => (
      <div
        key={label}
        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4"
      >
        <div className="rounded-lg bg-[#1e3a5f]/10 p-2">
          <Icon size={18} className="text-[#1e3a5f]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{sub}</p>
        </div>
      </div>
    ))}
  </div>
);

/* ── Page ────────────────────────────────────────────── */
const HomePage = () => (
  <PageWrapper>
    <div className="flex flex-col gap-12">
      <HeroBanner />
      <CategoryStrip />
      <TrustBadges />
      {/* Personalised recommendations — shows top-rated fallback for guests */}
      <RecommendationStrip limit={10} />
      <BookCarousel title="Bestsellers" books={featured} seeAllLink="/books?tag=bestseller" />
      <BookCarousel title="New Arrivals" books={newArrivals} seeAllLink="/books?tag=new" />
      <BookCarousel title="Top Rated" books={topRated} seeAllLink="/books?sort=rating" />
    </div>
  </PageWrapper>
);

export default HomePage;
