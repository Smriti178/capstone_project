import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Search, Filter } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Breadcrumb from "../components/ui/Breadcrumb";
import StatusBadge from "../components/ui/StatusBadge";
import RecommendationStrip from "../components/books/RecommendationStrip";
import { useOrders } from "../context/OrderContext";
import { formatCurrency } from "../utils/formatCurrency";

/* ── Single order row card ───────────────────────────── */
const OrderCard = ({ order }) => {
  const firstBook = order.items?.[0]?.book;
  const extraCount = (order.items?.length ?? 1) - 1;
  const orderDate = new Date(order.date).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <Link
      to={`/orders/${order.id}`}
      className="group flex flex-col sm:flex-row gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-gray-300 transition-all"
    >
      {/* Cover thumbnail stack */}
      <div className="relative h-20 w-14 shrink-0">
        <div className="absolute inset-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          {firstBook?.cover ? (
            <img
              src={firstBook.cover}
              alt={firstBook.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2e5490]">
              <Package size={18} className="text-white/60" />
            </div>
          )}
        </div>
        {extraCount > 0 && (
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1e3a5f] text-xs font-bold text-white">
            +{extraCount}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-mono text-xs text-gray-400">{order.id}</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {order.items?.length ?? 0} {order.items?.length === 1 ? "item" : "items"}
              {firstBook && ` · ${firstBook.title}${extraCount > 0 ? " & more" : ""}`}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
          <span>Placed {orderDate}</span>
          <span className="font-semibold text-gray-900">{formatCurrency(order.total)}</span>
          {order.deliveredAt && (
            <span>
              Delivered {new Date(order.deliveredAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={18}
        className="self-center text-gray-300 group-hover:text-[#1e3a5f] transition-colors shrink-0"
      />
    </Link>
  );
};

/* ── Empty state ─────────────────────────────────────── */
const EmptyOrders = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-5">
    <div className="rounded-full bg-gray-100 p-8">
      <Package size={48} className="text-gray-300" />
    </div>
    <div className="text-center">
      <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
      <p className="mt-1 text-sm text-gray-500">When you place an order, it will appear here.</p>
    </div>
    <Link
      to="/books"
      className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2e5490] transition-colors"
    >
      Start Shopping
    </Link>
  </div>
);

/* ── Page ────────────────────────────────────────────── */
const STATUS_FILTERS = ["all", "processing", "shipped", "delivered", "cancelled"];

const OrderHistoryPage = () => {
  const { orders } = useOrders();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.items?.some((i) => i.book?.title?.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">

        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Order History" }]} />

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {orders.length} {orders.length === 1 ? "order" : "orders"} placed
            </p>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="search"
              placeholder="Search by order ID or book title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            />
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-gray-400 shrink-0" />
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Order list */}
        {filtered.length === 0 ? (
          orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Package size={32} className="text-gray-300" />
              <p className="text-gray-500 text-sm font-medium">No orders match your filters.</p>
              <button
                onClick={() => { setStatusFilter("all"); setSearchQuery(""); }}
                className="text-sm text-[#1e3a5f] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* Personalised recommendations based on order history */}
        <RecommendationStrip limit={8} />

      </div>
    </PageWrapper>
  );
};

export default OrderHistoryPage;
