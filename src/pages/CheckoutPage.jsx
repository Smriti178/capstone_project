import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Breadcrumb from "../components/ui/Breadcrumb";
import AddressSelector from "../components/checkout/AddressSelector";
import GiftPointsRedeemer from "../components/checkout/GiftPointsRedeemer";
import DeliveryDatePicker from "../components/checkout/DeliveryDatePicker";
import CartItem from "../components/cart/CartItem";
import Button from "../components/ui/Button";
import PriceSummaryRows from "../components/ui/PriceSummaryRows";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatCurrency";

/* ── Section wrapper ─────────────────────────────────── */
const Section = ({ step, title, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-5">
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e3a5f] text-xs font-bold text-white shrink-0">
        {step}
      </span>
      <h2 className="font-bold text-gray-900 text-base">{title}</h2>
    </div>
    {children}
  </div>
);

/* ── Order summary sidebar ───────────────────────────── */
const OrderSummary = ({
  items, subtotal, deliveryFee, giftDiscount, total, onPlaceOrder, loading,
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4 sticky top-24">
    <h2 className="font-bold text-gray-900 text-base">Order Summary</h2>

    {/* Item thumbnails */}
    <div className="flex flex-col divide-y divide-gray-100 max-h-64 overflow-y-auto">
      {items.map((item) => (
        <CartItem key={item.bookId} item={item} compact />
      ))}
    </div>

    {/* Totals */}
    <div className="border-t border-gray-100 pt-4">
      <PriceSummaryRows
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        giftDiscount={giftDiscount}
        total={total}
      />
    </div>

    <Button fullWidth size="lg" onClick={onPlaceOrder} disabled={loading}>
      <Lock size={15} />
      {loading ? "Placing Order…" : "Place Order"}
    </Button>

    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
      <ShieldCheck size={13} className="text-green-500" />
      Secured by 256-bit SSL encryption
    </div>
  </div>
);

/* ── Page ────────────────────────────────────────────── */
const CheckoutPage = () => {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses?.find((a) => a.isDefault)?.id ?? user?.addresses?.[0]?.id ?? null
  );
  const [selectedAddress, setSelectedAddress] = useState(
    user?.addresses?.find((a) => a.isDefault) ?? user?.addresses?.[0] ?? null
  );
  const [delivery, setDelivery] = useState({
    id: "standard", label: "Standard Delivery", price: 0, window: null,
  });
  const [giftPoints, setGiftPoints] = useState(0);
  const [giftDiscount, setGiftDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = delivery.price;
  const total = subtotal + deliveryFee - giftDiscount;

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr.id);
    setSelectedAddress(addr);
  };

  const handleDeliverySelect = (opt) => setDelivery(opt);

  const handleGiftRedeem = (pts, discount) => {
    setGiftPoints(pts);
    setGiftDiscount(discount);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }
    setError("");
    setLoading(true);

    // Simulate processing
    await new Promise((r) => setTimeout(r, 800));

    // Build order payload and pass to payment page via state
    const orderPayload = {
      items: items.map((i) => ({
        bookId: i.bookId,
        quantity: i.quantity,
        priceAtPurchase: i.book?.price,
        book: i.book,
      })),
      address: selectedAddress,
      delivery,
      subtotal,
      deliveryFee,
      giftDiscount,
      giftPointsUsed: giftPoints,
      total: Math.max(0, total),
    };

    setLoading(false);
    navigate("/payment", { state: { order: orderPayload } });
  };

  // Redirect to cart if empty
  if (!items.length) {
    return (
      <PageWrapper>
        <div className="py-24 text-center flex flex-col items-center gap-4">
          <p className="text-gray-500">Your cart is empty. Add some books first!</p>
          <Button onClick={() => navigate("/books")}>Browse Books</Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">

        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]} />

        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left column: steps ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Step 1: Address */}
            <Section step="1" title="Delivery Address">
              <AddressSelector
                selectedId={selectedAddressId}
                onSelect={handleAddressSelect}
              />
            </Section>

            {/* Step 2: Delivery speed */}
            <Section step="2" title="Delivery Speed">
              <DeliveryDatePicker
                selectedId={delivery.id}
                onSelect={handleDeliverySelect}
              />
            </Section>

            {/* Step 3: Gift points */}
            <Section step="3" title="Gift Points & Discounts">
              <GiftPointsRedeemer
                redeemedPoints={giftPoints}
                onRedeem={handleGiftRedeem}
              />
              {/* GiftPointsRedeemer returns null when user has no points;
                  show a fallback only when explicitly zero (user exists but has no balance) */}
              {user && !user.giftPoints && (
                <p className="text-sm text-gray-400">No gift points available on this account.</p>
              )}
            </Section>

            {/* Step 4: Review items */}
            <Section step="4" title="Review Your Order">
              <div className="flex flex-col divide-y divide-gray-100">
                {items.map((item) => (
                  <CartItem key={item.bookId} item={item} />
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Need to change something?{" "}
                <Link to="/cart" className="text-[#1e3a5f] hover:underline">Edit cart</Link>
              </p>
            </Section>

            {/* Mobile place order */}
            <div className="lg:hidden">
              <Button fullWidth size="lg" onClick={handlePlaceOrder} disabled={loading}>
                <Lock size={15} />
                {loading ? "Placing Order…" : `Place Order · ${formatCurrency(Math.max(0, total))}`}
              </Button>
            </div>
          </div>

          {/* ── Right column: summary ── */}
          <div className="hidden lg:block lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              giftDiscount={giftDiscount}
              total={total}
              onPlaceOrder={handlePlaceOrder}
              loading={loading}
            />
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default CheckoutPage;
