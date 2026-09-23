import React from "react";
import { Truck, Zap, Check } from "lucide-react";
import { getTentativeDelivery } from "../../utils/deliveryDate";

const DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Standard Delivery",
    sub: "3–5 business days",
    price: 0,
    icon: Truck,
    getWindow: () => getTentativeDelivery(3, 5),
  },
  {
    id: "express",
    label: "Express Delivery",
    sub: "1–2 business days",
    price: 7.99,
    icon: Zap,
    getWindow: () => getTentativeDelivery(1, 2),
  },
];

/**
 * Lets the user choose a delivery speed.
 * Calls onSelect({ id, label, price, window }) when changed.
 */
const DeliveryDatePicker = ({ selectedId, onSelect }) => (
  <div className="flex flex-col gap-3">
    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
      <Truck size={16} className="text-[#1e3a5f]" /> Delivery Speed
    </h3>

    <div className="flex flex-col gap-3">
      {DELIVERY_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isSelected = selectedId === opt.id;
        const window = opt.getWindow();

        return (
          <button
            key={opt.id}
            onClick={() => onSelect({ id: opt.id, label: opt.label, price: opt.price, window })}
            className={`relative flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
              isSelected
                ? "border-[#1e3a5f] bg-[#1e3a5f]/5 ring-1 ring-[#1e3a5f]"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {/* Selected check */}
            {isSelected && (
              <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#1e3a5f]">
                <Check size={11} className="text-white" />
              </span>
            )}

            <div className={`rounded-lg p-2.5 ${isSelected ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-500"}`}>
              <Icon size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Arrives: <span className="font-medium text-gray-700">{window}</span>
              </p>
            </div>

            <div className="text-sm font-bold text-right shrink-0">
              {opt.price === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                <span className="text-gray-900">${opt.price.toFixed(2)}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default DeliveryDatePicker;
