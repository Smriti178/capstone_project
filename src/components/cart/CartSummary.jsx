import React from "react";
import { useNavigate } from "react-router-dom";
import { Tag, ChevronRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Button from "../ui/Button";
import PriceSummaryRows from "../ui/PriceSummaryRows";

const FREE_DELIVERY_THRESHOLD = 25;
const DELIVERY_FEE = 3.99;

/**
 * Order summary panel — shows subtotal, delivery, savings, total,
 * and a Proceed to Checkout CTA.
 * Used in CartPage (and optionally inline in the drawer).
 */
const CartSummary = ({ onCheckout }) => {
  const { items, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const totalSavings = items.reduce(
    (sum, i) => sum + (i.book?.originalPrice - i.book?.price) * i.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (onCheckout) return onCheckout();
    if (!user) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

      {totalSavings > 0 && (
        <div className="flex justify-between text-green-600 text-sm">
          <span className="flex items-center gap-1"><Tag size={13} /> You save</span>
          <span className="font-medium">-{formatCurrency(totalSavings)}</span>
        </div>
      )}

      <PriceSummaryRows
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        subtotalLabel={`Subtotal (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
      />

      {deliveryFee > 0 && (
        <p className="text-xs text-gray-400">
          Add {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
        </p>
      )}

      <Button fullWidth size="lg" onClick={handleCheckout}>
        {user ? "Proceed to Checkout" : "Sign in to Checkout"}
        <ChevronRight size={16} />
      </Button>

      {!user && (
        <p className="text-center text-xs text-gray-400">
          You'll be redirected to sign in first.
        </p>
      )}

      {/* Trust strip */}
      <div className="border-t border-gray-100 pt-3 flex justify-center gap-6 text-xs text-gray-400">
        <span>🔒 Secure checkout</span>
        <span>↩ Easy returns</span>
      </div>
    </div>
  );
};

export default CartSummary;
