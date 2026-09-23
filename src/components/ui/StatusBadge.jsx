import React from "react";
import { CheckCircle2, Clock, XCircle, Truck } from "lucide-react";

/**
 * Shared order status configuration used by OrderHistoryPage and OrderDetailPage.
 * Maps a status string to a display label, Tailwind colour classes, icon, and
 * a numeric step position for the progress tracker.
 */
export const STATUS_CONFIG = {
  processing: { label: "Processing",  color: "bg-blue-100 text-blue-700",    icon: Clock,        step: 1 },
  shipped:    { label: "Shipped",     color: "bg-indigo-100 text-indigo-700", icon: Truck,        step: 2 },
  delivered:  { label: "Delivered",   color: "bg-green-100 text-green-700",   icon: CheckCircle2, step: 3 },
  cancelled:  { label: "Cancelled",   color: "bg-red-100 text-red-700",       icon: XCircle,      step: 0 },
};

/**
 * Pill badge that shows an order status with an icon.
 *
 * @param {"processing"|"shipped"|"delivered"|"cancelled"} status
 */
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.processing;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
