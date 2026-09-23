import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

/* ── Toast context ───────────────────────────────────── */
const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2 size={16} className="text-green-500 shrink-0" />,
  error:   <XCircle     size={16} className="text-red-500 shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-500 shrink-0" />,
  info:    <Info         size={16} className="text-blue-500 shrink-0" />,
};

const BG = {
  success: "border-green-200 bg-green-50",
  error:   "border-red-200 bg-red-50",
  warning: "border-amber-200 bg-amber-50",
  info:    "border-blue-200 bg-blue-50",
};

/* ── Single toast item ───────────────────────────────── */
const ToastItem = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 200);
  }, [toast.id, onDismiss]);

  // Auto-dismiss
  useEffect(() => {
    if (!toast.duration) return;
    const t = setTimeout(dismiss, toast.duration);
    return () => clearTimeout(t);
  }, [toast.duration, dismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-md max-w-sm w-full
        transition-all duration-200
        ${BG[toast.type] ?? BG.info}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {ICONS[toast.type] ?? ICONS.info}
      <p className="flex-1 text-sm font-medium text-gray-800 leading-snug">{toast.message}</p>
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-full p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

/* ── Provider ────────────────────────────────────────── */
let _nextId = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = "info", duration = 4000) => {
    const id = _nextId++;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  // Convenience wrappers
  toast.success = (msg, d) => toast(msg, "success", d);
  toast.error   = (msg, d) => toast(msg, "error",   d ?? 6000);
  toast.warning = (msg, d) => toast(msg, "warning", d);
  toast.info    = (msg, d) => toast(msg, "info",    d);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast stack — bottom-right on desktop, bottom-center on mobile */}
      <div
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none
          max-sm:left-4 max-sm:right-4 max-sm:items-stretch"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/* ── Hook ────────────────────────────────────────────── */
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};
