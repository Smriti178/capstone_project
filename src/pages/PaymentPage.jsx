import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard, Lock, ShieldCheck,
  Smartphone, Building2, Check,
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Breadcrumb from "../components/ui/Breadcrumb";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import PriceSummaryRows from "../components/ui/PriceSummaryRows";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { formatCurrency } from "../utils/formatCurrency";

/* ── helpers ─────────────────────────────────────────── */

/** Format card number with spaces every 4 digits */
const fmtCard = (raw) =>
  raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

/** Format MM/YY expiry */
const fmtExpiry = (raw) => {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/* ── Payment method tabs ─────────────────────────────── */
const METHODS = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
];

/* ── Card form ───────────────────────────────────────── */
const CardForm = ({ form, setForm, errors }) => {
  const [showCvv, setShowCvv] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex flex-col gap-4">
      <Input
        id="card-name"
        label="Cardholder name"
        placeholder="Alex Johnson"
        value={form.name}
        onChange={set("name")}
        error={errors.name}
        autoComplete="cc-name"
      />
      <div className="relative">
        <Input
          id="card-number"
          label="Card number"
          placeholder="1234 5678 9012 3456"
          value={form.number}
          onChange={(e) =>
            setForm((f) => ({ ...f, number: fmtCard(e.target.value) }))
          }
          error={errors.number}
          autoComplete="cc-number"
          inputMode="numeric"
        />
        <CreditCard
          size={15}
          className="absolute right-3 top-8 text-gray-400 pointer-events-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="card-expiry"
          label="Expiry (MM/YY)"
          placeholder="08/27"
          value={form.expiry}
          onChange={(e) =>
            setForm((f) => ({ ...f, expiry: fmtExpiry(e.target.value) }))
          }
          error={errors.expiry}
          autoComplete="cc-exp"
          inputMode="numeric"
        />
        <div className="relative">
          <Input
            id="card-cvv"
            label="CVV"
            placeholder="•••"
            type={showCvv ? "text" : "password"}
            value={form.cvv}
            onChange={(e) =>
              setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))
            }
            error={errors.cvv}
            autoComplete="cc-csc"
            inputMode="numeric"
          />
          <button
            type="button"
            onClick={() => setShowCvv((v) => !v)}
            className="absolute right-3 top-8 text-xs text-gray-400 hover:text-gray-600"
          >
            {showCvv ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Save card toggle */}
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.saveCard}
          onChange={(e) => setForm((f) => ({ ...f, saveCard: e.target.checked }))}
          className="rounded border-gray-300 accent-[#1e3a5f]"
        />
        Save card for future purchases
      </label>
    </div>
  );
};

/* ── UPI form ────────────────────────────────────────── */
const UpiForm = ({ form, setForm, errors }) => (
  <div className="flex flex-col gap-4">
    <Input
      id="upi-id"
      label="UPI ID"
      placeholder="yourname@upi"
      value={form.upiId}
      onChange={(e) => setForm((f) => ({ ...f, upiId: e.target.value }))}
      error={errors.upiId}
    />
    <p className="text-xs text-gray-400">
      Enter your UPI ID and we'll send a payment request to your UPI app.
    </p>
  </div>
);

/* ── Net-banking form ────────────────────────────────── */
const BANKS = ["Chase", "Bank of America", "Wells Fargo", "Citibank", "US Bank"];

const NetBankingForm = ({ form, setForm, errors }) => (
  <div className="flex flex-col gap-4">
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">Select Bank</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {BANKS.map((bank) => (
          <button
            key={bank}
            type="button"
            onClick={() => setForm((f) => ({ ...f, bank }))}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              form.bank === bank
                ? "border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f]"
                : "border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            {bank}
          </button>
        ))}
      </div>
      {errors.bank && <p className="text-xs text-red-600 mt-1">{errors.bank}</p>}
    </div>
    <p className="text-xs text-gray-400">
      You'll be redirected to your bank's secure portal to complete the payment.
    </p>
  </div>
);

/* ── Order mini-summary ──────────────────────────────── */
const MiniSummary = ({ order }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-3 sticky top-24">
    <h3 className="font-semibold text-gray-900 text-sm">Order Summary</h3>
    <PriceSummaryRows
      subtotal={order.subtotal}
      deliveryFee={order.deliveryFee}
      giftDiscount={order.giftDiscount}
      total={order.total}
    />

    {/* Delivery info */}
    {order.delivery?.window && (
      <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 text-xs text-gray-500">
        📦 Estimated delivery: <span className="font-medium text-gray-700">{order.delivery.window}</span>
      </div>
    )}

    {/* Deliver to */}
    {order.address && (
      <div className="text-xs text-gray-500">
        <span className="font-medium text-gray-700">Deliver to: </span>
        {order.address.line1}, {order.address.city}, {order.address.state}
      </div>
    )}
  </div>
);

/* ── Page ────────────────────────────────────────────── */
const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { placeOrder } = useOrders();

  const order = location.state?.order;

  const [method, setMethod] = useState("card");
  const [cardForm, setCardForm] = useState({
    name: "", number: "", expiry: "", cvv: "", saveCard: false,
  });
  const [upiForm, setUpiForm] = useState({ upiId: "" });
  const [netForm, setNetForm] = useState({ bank: "" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // Guard: if navigated here without order state, go back
  if (!order) {
    return (
      <PageWrapper>
        <div className="py-24 text-center flex flex-col items-center gap-4">
          <p className="text-gray-500">No order found. Please start from your cart.</p>
          <Button onClick={() => navigate("/cart")}>Back to Cart</Button>
        </div>
      </PageWrapper>
    );
  }

  const validate = () => {
    const e = {};
    if (method === "card") {
      if (!cardForm.name.trim()) e.name = "Name is required.";
      const digits = cardForm.number.replace(/\s/g, "");
      if (digits.length < 16) e.number = "Enter a valid 16-digit card number.";
      if (!/^\d{2}\/\d{2}$/.test(cardForm.expiry)) e.expiry = "Use MM/YY format.";
      else {
        const [mm] = cardForm.expiry.split("/").map(Number);
        if (mm < 1 || mm > 12) e.expiry = "Invalid month.";
      }
      if (cardForm.cvv.length < 3) e.cvv = "CVV must be 3–4 digits.";
    }
    if (method === "upi") {
      if (!upiForm.upiId.includes("@")) e.upiId = "Enter a valid UPI ID (e.g. name@upi).";
    }
    if (method === "netbanking") {
      if (!netForm.bank) e.bank = "Please select a bank.";
    }
    return e;
  };

  const handlePay = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setErrors({});
    setProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1500));

    const last4 =
      method === "card"
        ? cardForm.number.replace(/\s/g, "").slice(-4)
        : "0000";

    // Place the order in OrderContext
    const placed = placeOrder({
      ...order,
      paymentMethod: method,
      paymentLast4: last4,
      giftPointsEarned: Math.floor(order.total),
      status: "processing",
    });

    clearCart();
    setProcessing(false);

    navigate("/payment/confirmation", {
      state: { orderId: placed.id, method, last4, total: order.total },
    });
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">

        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout", to: "/checkout" },
          { label: "Payment" },
        ]} />

        <h1 className="text-2xl font-bold text-gray-900">Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left: payment form ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-6">

              {/* Method selector */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Payment Method</p>
                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                  {METHODS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => { setMethod(id); setErrors({}); }}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 sm:px-4 py-2.5 text-sm font-medium transition-all ${
                        method === id
                          ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form for the selected method */}
              <div>
                {method === "card" && (
                  <CardForm form={cardForm} setForm={setCardForm} errors={errors} />
                )}
                {method === "upi" && (
                  <UpiForm form={upiForm} setForm={setUpiForm} errors={errors} />
                )}
                {method === "netbanking" && (
                  <NetBankingForm form={netForm} setForm={setNetForm} errors={errors} />
                )}
              </div>

              {/* Pay button */}
              <Button
                fullWidth
                size="lg"
                onClick={handlePay}
                disabled={processing}
                className={processing ? "animate-pulse" : ""}
              >
                <Lock size={15} />
                {processing
                  ? "Processing Payment…"
                  : `Pay ${formatCurrency(order.total)}`}
              </Button>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-green-500" /> 256-bit SSL
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock size={12} /> PCI-DSS Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={12} className="text-green-500" /> Verified by Visa / MC
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: mini summary ── */}
          <div className="hidden lg:block lg:col-span-1">
            <MiniSummary order={order} />
          </div>
        </div>

        {/* Mobile summary */}
        <div className="lg:hidden">
          <MiniSummary order={order} />
        </div>

      </div>
    </PageWrapper>
  );
};

export default PaymentPage;
