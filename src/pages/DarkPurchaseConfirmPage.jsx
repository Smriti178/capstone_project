import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import DarkNavbar from "../components/dark/DarkNavbar";
import { useOrders } from "../context/OrderContext";
import { coverColorAt } from "../data/coverColors";

/* ── Confirmed book mini-card ────────────────────────── */
const ConfirmedBookCard = ({ item, idx }) => {
  const book = item.book ?? item;
  const priceINR = Math.round((item.priceAtPurchase ?? book?.price ?? 2) * 83);

  return (
    <div className="flex gap-3">
      {/* Cover */}
      <div
        className="w-20 h-28 rounded-lg shrink-0 flex items-end justify-center pb-2 text-center text-white overflow-hidden"
        style={{ background: coverColorAt(idx) }}
      >
        <div className="px-1">
          <p className="text-xs font-bold uppercase leading-tight">{book?.title}</p>
          <p className="text-xs opacity-70 mt-0.5">{book?.author}</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-snug">{book?.title}</p>
        <p className="text-xs text-gray-400">
          by <span className="text-blue-400">{book?.author}</span>
        </p>
        <p className="text-xs text-gray-400 line-clamp-2">{book?.description}</p>
        <p className="text-xs text-gray-500">Paperback</p>
        <div className="flex gap-1 text-xs">
          <span className="text-blue-400">Non-Fiction</span>
          <span className="text-gray-600">,</span>
          <span className="text-blue-400">Self Help</span>
        </div>
        <p className="text-sm font-bold text-white mt-1">₹{priceINR}</p>
        <p className="text-xs text-gray-400">Delivery by <span className="text-white font-medium">Mon, 21 Jul</span></p>
      </div>
    </div>
  );
};

/* ── Mock items for when context has no order ─────────── */
const MOCK_ITEMS = [
  { bookId: "m1", quantity: 1, priceAtPurchase: 1.80, book: { title: "Joy of Minimalism", author: "Daniel Reed", description: "Declutter your life to uncover peace, clarity, and joy.", price: 1.80 } },
  { bookId: "m2", quantity: 1, priceAtPurchase: 4.33, book: { title: "The Path to Success", author: "James Wright", description: "A practical guide to achieving goals with clarity and confidence.", price: 4.33 } },
];

/* ── Page ─────────────────────────────────────────────── */
const DarkPurchaseConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrders();

  const orderId = location.state?.orderId;
  const order = orders.find((o) => o.id === orderId);
  const displayItems = order?.items?.length ? order.items : MOCK_ITEMS;

  return (
    <div className="min-h-screen bg-[#0d1629] text-white flex flex-col overflow-hidden">
      <DarkNavbar />

      {/* Dark illustrated background */}
      <div className="relative flex-1 flex items-center justify-center p-6">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-900/30" />
          <div className="absolute top-1/4 -left-16 w-48 h-48 rounded-full bg-teal-900/20" />
          <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-orange-900/20" />

          {/* Floating books */}
          <div className="absolute top-8 left-1/5 text-7xl opacity-50" style={{ transform: "rotate(-15deg)" }}>📚</div>
          <div className="absolute top-12 right-1/6 text-5xl opacity-40" style={{ transform: "rotate(10deg)" }}>📖</div>
          <div className="absolute bottom-16 left-10 text-6xl opacity-45" style={{ transform: "rotate(-5deg)" }}>📕</div>
          <div className="absolute bottom-12 right-1/5 text-6xl opacity-40" style={{ transform: "rotate(8deg)" }}>📗</div>
          <div className="absolute top-1/3 left-6 text-xl opacity-30 text-amber-400">◆</div>
          <div className="absolute top-1/4 right-10 text-lg opacity-35 text-amber-400">◆</div>
          <div className="absolute bottom-1/3 left-1/3 text-sm opacity-30 text-amber-300">◆</div>

          {/* Wavy lines */}
          <svg className="absolute bottom-20 left-1/4 opacity-15" width="200" height="60" viewBox="0 0 200 60">
            <path d="M0 30 Q50 0 100 30 T200 30" stroke="#f59e0b" strokeWidth="2" fill="none" />
          </svg>
          <svg className="absolute top-32 right-1/3 opacity-15 rotate-180" width="160" height="50" viewBox="0 0 160 50">
            <path d="M0 25 Q40 0 80 25 T160 25" stroke="#60a5fa" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Confirmation modal */}
        <div className="relative z-10 w-full max-w-xl">
          <div className="rounded-2xl bg-[#1e2535] border border-white/10 shadow-2xl p-6 flex flex-col items-center gap-5">
            {/* Success icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <CheckCircle2 size={28} className="text-white fill-white" />
            </div>

            {/* Heading */}
            <div className="text-center">
              <p className="text-sm text-gray-300 leading-relaxed">
                Your purchase of the<br />following reads is successful
              </p>
            </div>

            {/* Purchased books */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {displayItems.slice(0, 2).map((item, idx) => (
                <ConfirmedBookCard key={item.bookId ?? idx} item={item} idx={idx} />
              ))}
            </div>

            {/* Continue shopping */}
            <button
              onClick={() => navigate("/dark")}
              className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 mt-1 transition-colors"
            >
              <ShoppingBag size={15} />
              Continue your Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkPurchaseConfirmPage;
