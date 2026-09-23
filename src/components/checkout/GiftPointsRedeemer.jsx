import React, { useState } from "react";
import { Gift, Check, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Input from "../ui/Input";
import Button from "../ui/Button";

const POINTS_TO_DOLLAR_RATE = 0.01; // 100 points = $1

/**
 * Gift-points redemption widget.
 * Calls onRedeem(discountAmount) when points are applied.
 * Calls onRedeem(0) when points are removed.
 */
const GiftPointsRedeemer = ({ redeemedPoints, onRedeem }) => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const [appliedPts, setAppliedPts] = useState(0);

  const availablePoints = user?.giftPoints ?? 0;
  const maxDiscount = availablePoints * POINTS_TO_DOLLAR_RATE;

  const handleApply = () => {
    const pts = parseInt(input, 10);
    if (isNaN(pts) || pts <= 0) {
      setError("Enter a valid number of points.");
      return;
    }
    if (pts > availablePoints) {
      setError(`You only have ${availablePoints} points available.`);
      return;
    }
    setError("");
    setApplied(true);
    setAppliedPts(pts);
    onRedeem(pts, pts * POINTS_TO_DOLLAR_RATE);
  };

  const handleRemove = () => {
    setApplied(false);
    setAppliedPts(0);
    setInput("");
    setError("");
    onRedeem(0, 0);
  };

  if (!user || availablePoints === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Gift size={16} className="text-[#f59e0b]" />
        <h3 className="font-semibold text-gray-900 text-sm">Redeem Gift Points</h3>
        <span className="ml-auto text-xs text-gray-500">
          Balance: <span className="font-semibold text-[#1e3a5f]">{availablePoints.toLocaleString()} pts</span>
          {" "}(≈ ${maxDiscount.toFixed(2)})
        </span>
      </div>

      {applied ? (
        /* Applied state */
        <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Check size={15} className="text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {appliedPts.toLocaleString()} pts applied
              {" "}(−${(appliedPts * POINTS_TO_DOLLAR_RATE).toFixed(2)})
            </span>
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove gift points"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        /* Input state */
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              id="gift-points"
              label=""
              type="number"
              min={1}
              max={availablePoints}
              placeholder={`Up to ${availablePoints} points`}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              error={error}
            />
          </div>
          <Button onClick={handleApply} size="md" className="shrink-0 mb-0.5">
            Apply
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Every 100 points = $1.00 discount. Points are deducted from your balance on order placement.
      </p>
    </div>
  );
};

export default GiftPointsRedeemer;
