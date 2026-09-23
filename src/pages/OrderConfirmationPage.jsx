import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  PackageCheck, Truck, Star, ShoppingBag, ArrowRight, BookOpen, Gift,
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Button from "../components/ui/Button";
import BookCarousel from "../components/books/BookCarousel";
import { useOrders } from "../context/OrderContext";
import { books } from "../data/books";
import { formatCurrency } from "../utils/formatCurrency";

/* Points earned for this order */
const POINTS_PER_DOLLAR = 1;

/* Top-rated books for the "You might enjoy" strip */
const suggestions = [...books].sort((a, b) => b.rating - a.rating).slice(0, 8);

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrders();

  const orderId = location.state?.orderId;
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <PageWrapper>
        <div className="py-24 text-center flex flex-col items-center gap-4">
          <p className="text-gray-500">Order not found.</p>
          <Button onClick={() => navigate("/orders")}>View All Orders</Button>
        </div>
      </PageWrapper>
    );
  }

  const pointsEarned = order.giftPointsEarned ?? Math.floor(order.total ?? 0) * POINTS_PER_DOLLAR;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-10">

        {/* Hero confirmation banner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2e5490] px-8 py-12 text-white flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-white/10 p-5">
            <PackageCheck size={48} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Order Confirmed! 🎉</h1>
            <p className="mt-2 text-white/70 text-sm max-w-md">
              Thank you for your purchase. Your books are being packed and will be on their way soon.
            </p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/20 px-6 py-3 font-mono text-lg font-semibold tracking-wide">
            {order.id}
          </div>
        </div>

        {/* Order detail card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Items */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <BookOpen size={16} className="text-[#1e3a5f]" /> Items Ordered
            </h2>
            <div className="flex flex-col gap-3">
              {order.items?.map((item) => (
                <div key={item.bookId} className="flex items-center gap-3">
                  <Link to={`/books/${item.bookId}`} className="shrink-0">
                    <div className="w-10 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={item.book?.cover}
                        alt={item.book?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.book?.title ?? `Book #${item.bookId}`}
                    </p>
                    <p className="text-xs text-gray-500">{item.book?.author}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency((item.priceAtPurchase ?? item.book?.price) * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery + financials */}
          <div className="flex flex-col gap-4">

            {/* Delivery */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Truck size={15} className="text-[#1e3a5f]" /> Delivery
              </h3>
              <dl className="text-sm flex flex-col gap-2">
                {order.delivery?.window && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Estimated arrival</dt>
                    <dd className="font-medium text-gray-900">{order.delivery.window}</dd>
                  </div>
                )}
                {order.address && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500 shrink-0">Deliver to</dt>
                    <dd className="font-medium text-gray-900 text-right">
                      {order.address.line1}, {order.address.city}, {order.address.state}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Delivery fee</dt>
                  <dd className={`font-medium ${order.deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {order.deliveryFee === 0 ? "FREE" : formatCurrency(order.deliveryFee)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Financial summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-3">
              <h3 className="font-semibold text-gray-900">Payment Summary</h3>
              <dl className="text-sm flex flex-col gap-2">
                <div className="flex justify-between text-gray-600">
                  <dt>Subtotal</dt>
                  <dd className="font-medium">{formatCurrency(order.subtotal)}</dd>
                </div>
                {order.giftDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <dt>Gift Points</dt>
                    <dd className="font-medium">−{formatCurrency(order.giftDiscount)}</dd>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                  <dt>Total Paid</dt>
                  <dd>{formatCurrency(order.total)}</dd>
                </div>
              </dl>
            </div>

            {/* Gift points earned */}
            {pointsEarned > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
                <Gift size={20} className="text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    You earned {pointsEarned} gift points!
                  </p>
                  <p className="text-xs text-amber-600">
                    Redeemable on your next order (≈ ${(pointsEarned * 0.01).toFixed(2)})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button fullWidth onClick={() => navigate("/orders")}>
            <PackageCheck size={16} /> View Order History
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate("/books")}>
            <ShoppingBag size={16} /> Continue Shopping <ArrowRight size={15} />
          </Button>
        </div>

        {/* Rate your purchase nudge */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 flex-wrap">
          <Star size={20} className="text-amber-400 fill-amber-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Love your books?</p>
            <p className="text-xs text-gray-500">Leave a review and help other readers discover great titles.</p>
          </div>
          <Link
            to="/orders"
            className="shrink-0 text-sm font-medium text-[#1e3a5f] hover:underline flex items-center gap-1"
          >
            Write a Review <ArrowRight size={13} />
          </Link>
        </div>

        {/* Recommendations */}
        <BookCarousel
          title="You might also enjoy"
          books={suggestions}
          seeAllLink="/books?sort=rating"
        />

      </div>
    </PageWrapper>
  );
};

export default OrderConfirmationPage;
