import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CartItem from "./CartItem";
import { formatCurrency } from "../../utils/formatCurrency";

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 49;

/**
 * Slide-in cart drawer — renders over the page from the right side.
 * Opened by passing isOpen=true; closed via onClose.
 */
const CartDrawer = ({ isOpen, onClose }) => {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleCheckout = () => {
    onClose();
    navigate(user ? "/checkout" : "/login");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#1e3a5f]" />
            <h2 className="font-bold text-gray-900">
              Your Cart
              {itemCount > 0 && (
                <span className="ml-2 rounded-full bg-[#1e3a5f] px-2 py-0.5 text-xs text-white font-medium">
                  {itemCount}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free delivery progress bar */}
        {subtotal < FREE_DELIVERY_THRESHOLD && itemCount > 0 && (
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
            <div className="flex justify-between text-xs text-amber-700 mb-1.5">
              <span>
                Add <strong>{formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)}</strong> more for free delivery
              </span>
              <span>{Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {subtotal >= FREE_DELIVERY_THRESHOLD && itemCount > 0 && (
          <div className="px-5 py-2.5 bg-green-50 border-b border-green-100 text-xs font-medium text-green-700">
            🎉 You've unlocked free delivery!
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="rounded-full bg-gray-100 p-6">
                <ShoppingCart size={32} className="text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Browse our books and add something you'll love.</p>
              </div>
              <Link
                to="/books"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2e5490] transition-colors"
              >
                Browse Books <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItem key={item.bookId} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {/* Footer — summary + CTA */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
            <dl className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <dt>Subtotal</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-gray-500">
                <dt>Delivery</dt>
                <dd className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}>
                  {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-1">
                <dt>Total</dt>
                <dd>{formatCurrency(total)}</dd>
              </div>
            </dl>

            <button
              onClick={handleCheckout}
              className="w-full rounded-xl bg-[#1e3a5f] hover:bg-[#2e5490] text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {user ? "Proceed to Checkout" : "Sign in to Checkout"}
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <Link to="/cart" onClick={onClose} className="hover:text-[#1e3a5f] hover:underline">
                View full cart
              </Link>
              <button onClick={clearCart} className="hover:text-red-500 transition-colors">
                Clear cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
