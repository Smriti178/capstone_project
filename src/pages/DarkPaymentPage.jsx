import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import DarkNavbar from "../components/dark/DarkNavbar";
import { useOrders } from "../context/OrderContext";
import { useCart } from "../context/CartContext";

/* ── Payment method tabs ─────────────────────────────── */
const METHODS = ["Credit Card", "Debit card", "UPI", "Wallet"];

/* ── Payment modal ───────────────────────────────────── */
const PaymentModal = ({ payableAmount, onPay, processing }) => {
  const [method, setMethod] = useState("Credit Card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  const inputCls = "w-full bg-[#2a3550] border border-white/10 rounded text-white text-xs px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  const fmtCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1-").replace(/-$/, "");
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <div className="rounded-xl bg-[#1e2535] border border-white/10 shadow-2xl w-full max-w-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white">Complete Payment</h2>
        <span className="text-xs text-gray-300">
          Payable Amount: <span className="font-bold text-white">₹{payableAmount}</span>
        </span>
      </div>

      <div className="flex">
        {/* Method sidebar */}
        <div className="flex flex-col border-r border-white/10 py-3 min-w-[100px]">
          {METHODS.map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`text-left px-4 py-2 text-xs transition-colors ${
                method === m
                  ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Card form */}
        <div className="flex-1 p-5 flex flex-col gap-3">
          {method === "Credit Card" || method === "Debit card" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Card Number</label>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(fmtCard(e.target.value))}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className={inputCls}
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Name on Card</label>
                  <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">CVV</label>
                  <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="XXX" className={inputCls} inputMode="numeric" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Date of Expiry</label>
                  <input value={expiry} onChange={(e) => setExpiry(fmtExpiry(e.target.value))} placeholder="MM/YYYY" className={inputCls} inputMode="numeric" />
                </div>
              </div>
            </>
          ) : method === "UPI" ? (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">UPI ID</label>
              <input placeholder="yourname@upi" className={inputCls} />
              <p className="text-xs text-gray-500 mt-2">We'll send a payment request to your UPI app.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 py-2">
              <p className="text-xs text-gray-400">Select your wallet:</p>
              {["Paytm", "PhonePe", "Google Pay", "Amazon Pay"].map((w) => (
                <button key={w} className="text-left text-xs text-gray-300 hover:text-blue-400 transition-colors py-1">{w}</button>
              ))}
            </div>
          )}

          {/* Pay Now */}
          <button
            onClick={onPay}
            disabled={processing}
            className={`mt-2 flex items-center justify-center gap-2 rounded-lg text-white text-sm font-semibold py-2.5 transition-colors ${
              processing ? "bg-blue-800 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Lock size={13} />
            {processing ? "Processing…" : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Decorative floating shapes ─────────────────────────── */
const FloatingShape = ({ style, children }) => (
  <div className="absolute pointer-events-none select-none" style={style}>{children}</div>
);

/* ── Page ─────────────────────────────────────────────── */
const DarkPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { placeOrder } = useOrders();
  const { clearCart } = useCart();

  const order = location.state?.order ?? { total: 580 };
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));

    const placed = placeOrder({
      ...order,
      paymentMethod: "card",
      paymentLast4: "4242",
      giftPointsEarned: Math.floor((order.total ?? 580) / 10),
      status: "processing",
    });

    clearCart();
    setProcessing(false);
    navigate("/dark/confirmation", { state: { orderId: placed.id } });
  };

  return (
    <div className="min-h-screen bg-[#0d1629] text-white flex flex-col overflow-hidden">
      <DarkNavbar />

      {/* Dark illustrated background with floating book shapes */}
      <div className="relative flex-1 flex items-center justify-center p-6">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-900/30" />
          <div className="absolute top-1/4 -left-16 w-48 h-48 rounded-full bg-teal-900/20" />
          <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-orange-900/20" />

          {/* Floating book illustrations */}
          <FloatingShape style={{ top: "8%", left: "20%", fontSize: "80px", transform: "rotate(-15deg)", opacity: 0.6 }}>
            📚
          </FloatingShape>
          <FloatingShape style={{ top: "12%", right: "15%", fontSize: "50px", transform: "rotate(10deg)", opacity: 0.5 }}>
            📖
          </FloatingShape>
          <FloatingShape style={{ bottom: "15%", left: "8%", fontSize: "60px", transform: "rotate(-5deg)", opacity: 0.55 }}>
            📕
          </FloatingShape>
          <FloatingShape style={{ bottom: "10%", right: "20%", fontSize: "70px", transform: "rotate(8deg)", opacity: 0.5 }}>
            📗
          </FloatingShape>
          <FloatingShape style={{ top: "45%", left: "5%", fontSize: "30px", opacity: 0.4 }}>
            ◆
          </FloatingShape>
          <FloatingShape style={{ top: "30%", right: "8%", fontSize: "24px", color: "#f59e0b", opacity: 0.5 }}>
            ◆
          </FloatingShape>
          <FloatingShape style={{ bottom: "35%", left: "30%", fontSize: "18px", color: "#f59e0b", opacity: 0.4 }}>
            ◆
          </FloatingShape>

          {/* Wavy lines */}
          <svg className="absolute bottom-20 left-1/4 opacity-20" width="200" height="60" viewBox="0 0 200 60">
            <path d="M0 30 Q50 0 100 30 T200 30" stroke="#f59e0b" strokeWidth="2" fill="none" />
          </svg>
          <svg className="absolute top-32 right-1/3 opacity-20 rotate-180" width="160" height="50" viewBox="0 0 160 50">
            <path d="M0 25 Q40 0 80 25 T160 25" stroke="#60a5fa" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Payment modal centered */}
        <div className="relative z-10 w-full max-w-md">
          <PaymentModal
            payableAmount={order.total ?? 580}
            onPay={handlePay}
            processing={processing}
          />
        </div>
      </div>
    </div>
  );
};

export default DarkPaymentPage;
