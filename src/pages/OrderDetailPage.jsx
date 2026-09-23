import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Truck, MapPin, CreditCard,
  RotateCcw, XCircle, AlertTriangle, ShoppingCart,
  CheckCircle2, Gift, BookOpen,
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Breadcrumb from "../components/ui/Breadcrumb";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import StatusBadge, { STATUS_CONFIG } from "../components/ui/StatusBadge";
import BookCarousel from "../components/books/BookCarousel";
import { useOrders } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import { isCancellable, cancellationTimeRemaining } from "../utils/cancellationGuard";
import { books } from "../data/books";

/* ── Order progress tracker ──────────────────────────── */
const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

const ProgressTracker = ({ status }) => {
  const currentStep = STATUS_CONFIG[status]?.step ?? 1;
  if (status === "cancelled") return null;

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-1">
      {STEPS.map((label, idx) => {
        const done = idx < currentStep;
        const active = idx === currentStep - 1;
        const isLast = idx === STEPS.length - 1;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5 min-w-[3.5rem] sm:min-w-0 flex-shrink-0 sm:flex-1">
              <div
                className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  done || active
                    ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                {done && !active ? "✓" : idx + 1}
              </div>
              <span className={`text-[10px] sm:text-xs text-center leading-tight ${active ? "font-semibold text-[#1e3a5f]" : done ? "text-gray-600" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mt-3.5 mx-1 transition-colors shrink ${done ? "bg-[#1e3a5f]" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ── Page ────────────────────────────────────────────── */
const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, cancelOrder } = useOrders();
  const { addItem } = useCart();

  const order = orders.find((o) => o.id === id);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [buyAgainBookIds, setBuyAgainBookIds] = useState(new Set());

  if (!order) {
    return (
      <PageWrapper>
        <div className="py-24 text-center flex flex-col items-center gap-4">
          <p className="text-gray-500">Order not found.</p>
          <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
        </div>
      </PageWrapper>
    );
  }

  const canCancel = isCancellable(order.date) && order.status !== "cancelled" && order.status !== "delivered";
  const timeLeft = cancellationTimeRemaining(order.date);

  const orderDate = new Date(order.date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const handleCancelConfirm = () => {
    cancelOrder(order.id);
    setCancelled(true);
    setCancelModalOpen(false);
  };

  const handleBuyAgain = (item) => {
    if (item.book) {
      addItem(item.book, item.quantity ?? 1);
      setBuyAgainBookIds((prev) => new Set([...prev, item.bookId]));
    }
  };

  const handleBuyAllAgain = () => {
    order.items?.forEach((item) => {
      if (item.book) addItem(item.book, item.quantity ?? 1);
    });
    navigate("/cart");
  };

  /* Books from same categories for recommendation strip */
  const relatedCategories = [...new Set(order.items?.map((i) => i.book?.category).filter(Boolean))];
  const suggestions = books
    .filter((b) => relatedCategories.includes(b.category) && !order.items?.some((i) => i.bookId === b.id))
    .sort((a, bk) => bk.rating - a.rating)
    .slice(0, 8);

  const currentStatus = cancelled ? "cancelled" : order.status;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">

        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Home", to: "/" },
          { label: "Orders", to: "/orders" },
          { label: order.id },
        ]} />

        {/* Header bar */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <StatusBadge status={currentStatus} />
            </div>
            <p className="text-sm text-gray-500 mt-1 font-mono">{order.id} · Placed {orderDate}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Buy All Again */}
            {order.status !== "cancelled" && (
              <Button variant="secondary" size="sm" onClick={handleBuyAllAgain}>
                <RotateCcw size={14} /> Buy All Again
              </Button>
            )}

            {/* Cancel */}
            {canCancel && !cancelled && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setCancelModalOpen(true)}
              >
                <XCircle size={14} /> Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* 48-hour cancellation warning */}
        {canCancel && !cancelled && timeLeft && (
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              <span className="font-semibold">Cancellation window closes in {timeLeft}.</span>
              {" "}After 48 hours from order placement, cancellations are no longer available.
            </p>
          </div>
        )}

        {/* Cancellation success notice */}
        {cancelled && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <XCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-700 font-medium">
              This order has been cancelled. A refund will be processed within 5–7 business days.
            </p>
          </div>
        )}

        {/* Progress tracker */}
        {currentStatus !== "cancelled" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Order Progress</h2>
            <ProgressTracker status={currentStatus} />
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Items column */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen size={15} className="text-[#1e3a5f]" /> Items
              </h2>
              <span className="text-xs text-gray-400">
                {order.items?.length} {order.items?.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="flex flex-col gap-4 divide-y divide-gray-100">
              {order.items?.map((item) => {
                const alreadyAdded = buyAgainBookIds.has(item.bookId);
                return (
                  <div key={item.bookId} className="flex gap-3 pt-4 first:pt-0">
                    {/* Cover */}
                    <Link to={`/books/${item.bookId}`} className="shrink-0">
                      <div className="w-14 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={item.book?.cover}
                          alt={item.book?.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <Link
                        to={`/books/${item.bookId}`}
                        className="text-sm font-semibold text-gray-900 hover:text-[#1e3a5f] line-clamp-2 leading-snug"
                      >
                        {item.book?.title ?? `Book #${item.bookId}`}
                      </Link>
                      <p className="text-xs text-gray-500">{item.book?.author}</p>
                      <div className="flex items-center gap-4 mt-auto flex-wrap">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency((item.priceAtPurchase ?? item.book?.price ?? 0) * item.quantity)}
                        </span>
                        <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                        <span className="text-xs text-gray-400">
                          {formatCurrency(item.priceAtPurchase ?? item.book?.price ?? 0)} each
                        </span>
                      </div>
                    </div>

                    {/* Buy Again */}
                    <div className="shrink-0 flex items-end">
                      <button
                        onClick={() => handleBuyAgain(item)}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          alreadyAdded
                            ? "border-green-300 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-600 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
                        }`}
                      >
                        {alreadyAdded ? (
                          <><CheckCircle2 size={12} /> Added!</>
                        ) : (
                          <><ShoppingCart size={12} /> Buy Again</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: delivery + payment + points */}
          <div className="flex flex-col gap-4">

            {/* Delivery */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                <Truck size={14} className="text-[#1e3a5f]" /> Delivery
              </h3>
              <dl className="text-sm flex flex-col gap-2">
                {order.delivery?.label && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Type</dt>
                    <dd className="font-medium text-gray-900">{order.delivery.label}</dd>
                  </div>
                )}
                {order.delivery?.window && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Estimate</dt>
                    <dd className="font-medium text-gray-900">{order.delivery.window}</dd>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Delivered</dt>
                    <dd className="font-medium text-green-700">
                      {new Date(order.deliveredAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </dd>
                  </div>
                )}
              </dl>
              {order.address && (
                <div className="flex items-start gap-2 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                  <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {order.address.name}<br />
                    {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />
                    {order.address.city}, {order.address.state} {order.address.zip}
                  </p>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                <CreditCard size={14} className="text-[#1e3a5f]" /> Payment
              </h3>
              <dl className="text-sm flex flex-col gap-2">
                <div className="flex justify-between text-gray-600">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</dd>
                </div>
                {(order.giftDiscount ?? 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <dt>Gift Points</dt>
                    <dd className="font-medium">−{formatCurrency(order.giftDiscount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <dt>Delivery</dt>
                  <dd className={`font-medium ${(order.deliveryFee ?? 0) === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {(order.deliveryFee ?? 0) === 0 ? "FREE" : formatCurrency(order.deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                  <dt>Total</dt>
                  <dd>{formatCurrency(order.total)}</dd>
                </div>
              </dl>
              {order.paymentMethod && (
                <p className="text-xs text-gray-500">
                  Paid via{" "}
                  <span className="font-medium text-gray-700 capitalize">{order.paymentMethod}</span>
                  {order.paymentLast4 && order.paymentLast4 !== "0000" && (
                    <> ending ···· {order.paymentLast4}</>
                  )}
                </p>
              )}
            </div>

            {/* Gift points */}
            {(order.giftPointsEarned ?? 0) > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
                <Gift size={18} className="text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    +{order.giftPointsEarned} points earned
                  </p>
                  <p className="text-xs text-amber-600">
                    ≈ ${(order.giftPointsEarned * 0.01).toFixed(2)} redeemable
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations strip */}
        {suggestions.length > 0 && (
          <BookCarousel
            title="More books you might like"
            books={suggestions}
            seeAllLink="/books"
          />
        )}

      </div>

      {/* ── Cancel confirmation modal ── */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Order"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              This will permanently cancel order <span className="font-mono font-bold">{order.id}</span>.
              A refund will be initiated within 5–7 business days.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Reason for cancellation (optional)
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            >
              <option value="">Select a reason…</option>
              <option value="changed-mind">Changed my mind</option>
              <option value="found-cheaper">Found a better price elsewhere</option>
              <option value="wrong-item">Ordered the wrong item</option>
              <option value="delay">Delivery taking too long</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <Button variant="secondary" onClick={() => setCancelModalOpen(false)}>
              Keep Order
            </Button>
            <Button variant="danger" onClick={handleCancelConfirm}>
              <XCircle size={15} /> Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default OrderDetailPage;
