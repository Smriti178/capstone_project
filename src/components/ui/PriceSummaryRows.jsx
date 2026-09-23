import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * Reusable price breakdown rows used in CartSummary, CheckoutPage OrderSummary,
 * and PaymentPage MiniSummary.
 *
 * Props:
 *   subtotal      {number}  — required
 *   deliveryFee   {number}  — required (pass 0 for FREE)
 *   giftDiscount  {number}  — optional, defaults to 0
 *   total         {number}  — required (pre-calculated so callers control the math)
 *   subtotalLabel {string}  — optional label override for the subtotal row
 */
const PriceSummaryRows = ({
  subtotal,
  deliveryFee,
  giftDiscount = 0,
  total,
  subtotalLabel = "Subtotal",
}) => (
  <dl className="flex flex-col gap-2 text-sm">
    <div className="flex justify-between text-gray-600">
      <dt>{subtotalLabel}</dt>
      <dd className="font-medium text-gray-900">{formatCurrency(subtotal)}</dd>
    </div>

    <div className="flex justify-between text-gray-600">
      <dt>Delivery</dt>
      <dd className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}>
        {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
      </dd>
    </div>

    {giftDiscount > 0 && (
      <div className="flex justify-between text-green-600">
        <dt>Gift Points</dt>
        <dd className="font-medium">−{formatCurrency(giftDiscount)}</dd>
      </div>
    )}

    <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-3 mt-1">
      <dt>Total</dt>
      <dd>{formatCurrency(Math.max(0, total))}</dd>
    </div>
  </dl>
);

export default PriceSummaryRows;
