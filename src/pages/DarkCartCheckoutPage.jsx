import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkPageShell from "../components/dark/DarkPageShell";
import Breadcrumb from "../components/ui/Breadcrumb";
import { useCart } from "../context/CartContext";
import { coverColorAt } from "../data/coverColors";

const DarkCartItem = ({ item, idx }) => {
  const { updateQuantity, removeItem } = useCart();
  const { book, quantity } = item;
  if (!book) return null;
  const priceINR = Math.round(book.price * 83);

  return (
    <div className="rounded-xl bg-[#161b27] border border-white/5 p-4 flex gap-4">
      {/* Cover */}
      <div
        className="w-28 h-40 rounded-lg shrink-0 flex items-end justify-center pb-3 text-center text-white overflow-hidden"
        style={{ background: coverColorAt(idx) }}
      >
        <div>
          <p className="text-xs font-bold uppercase leading-tight px-2">{book.title}</p>
          <p className="text-xs opacity-70 mt-1">{book.author}</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <Link
          to={`/dark/books/${book.id}`}
          className="text-base font-semibold text-white hover:text-blue-300 transition-colors leading-snug"
        >
          {book.title}
        </Link>
        <p className="text-xs text-gray-400">
          by <span className="text-blue-400 hover:underline cursor-pointer">{book.author}</span>
        </p>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{book.description}</p>
        <p className="text-xs text-gray-500">Paperback</p>
        <div className="flex gap-2 text-xs">
          <Link to="#" className="text-blue-400 hover:underline">Non-Fiction</Link>
          <span className="text-gray-600">,</span>
          <Link to="#" className="text-blue-400 hover:underline">Self Help</Link>
        </div>
        <p className="text-base font-bold text-white mt-1">₹{priceINR}</p>
        <p className="text-xs text-gray-400">
          Delivery by <span className="text-white font-medium">Mon, 25 Jul</span>
        </p>

        {/* Quantity stepper — qty number first, then – + buttons */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-white font-medium">{quantity}</span>
          <div className="flex items-center gap-1 rounded border border-white/10 overflow-hidden">
            <button
              onClick={() => quantity <= 1 ? removeItem(book.id) : updateQuantity(book.id, quantity - 1)}
              className="px-2.5 py-1 text-gray-400 hover:bg-white/10 transition-colors text-sm"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button
              onClick={() => updateQuantity(book.id, quantity + 1)}
              className="px-2.5 py-1 text-gray-400 hover:bg-white/10 transition-colors text-sm"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Address form ─────────────────────────────────────── */
const AddressForm = ({ form, setForm }) => {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const inputCls = "w-full bg-[#1e2a4a] border border-white/10 rounded text-white text-xs px-3 py-2 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelCls = "text-xs text-gray-400 mb-1 block";

  return (
    <div className="rounded-xl bg-[#161b27] border border-white/5 p-5 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-white">Address</h2>

      {/* Use saved address toggle */}
      <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
        <input type="checkbox" className="accent-blue-500 rounded" />
        Use Saved Address
      </label>

      {/* Row 1: First Name, Last Name, Address */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><label className={labelCls}>First Name</label><input placeholder="First Name" value={form.firstName} onChange={set("firstName")} className={inputCls} /></div>
        <div><label className={labelCls}>Last Name</label><input placeholder="Last Name" value={form.lastName} onChange={set("lastName")} className={inputCls} /></div>
        <div className="col-span-2 sm:col-span-1"><label className={labelCls}>Address</label><input placeholder="Address Line 2" value={form.address} onChange={set("address")} className={inputCls} /></div>
      </div>

      {/* Row 2: e-mail, City, Pin */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-1"><label className={labelCls}>e-mail</label><input placeholder="e-mail" value={form.email} onChange={set("email")} className={inputCls} /></div>
        <div><label className={labelCls}>City</label><input placeholder="City" value={form.city} onChange={set("city")} className={inputCls} /></div>
        <div><label className={labelCls}>Pin</label><input placeholder="000000" value={form.pin ?? ""} onChange={set("pin")} className={inputCls} /></div>
      </div>

      {/* Row 3: Phone Number, State, Country */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Phone Number</label>
          <div className="flex items-center rounded border border-white/10 bg-[#1e2a4a] overflow-hidden">
            <select className="bg-transparent text-xs text-gray-400 px-2 py-2 border-r border-white/10 focus:outline-none cursor-pointer">
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input placeholder="12345567890" value={form.phone} onChange={set("phone")} className="flex-1 bg-transparent px-2 py-2 text-xs text-white placeholder-gray-600 focus:outline-none" />
          </div>
        </div>
        <div><label className={labelCls}>State</label><input placeholder="State" value={form.state} onChange={set("state")} className={inputCls} /></div>
        <div>
          <label className={labelCls}>Country</label>
          <select value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className={inputCls}>
            <option value="India">India</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>
      </div>
    </div>
  );
};

/* ── Grand Total sidebar ──────────────────────────────── */
const GrandTotal = ({ subtotal, onPayNow }) => {
  const [coupon, setCoupon] = useState("");
  const [discount] = useState(100);
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax - discount;

  return (
    <div className="rounded-xl bg-[#161b27] border border-white/5 overflow-hidden">
      {/* Illustration */}
      <div className="h-32 bg-gradient-to-br from-[#1a2a6c] via-[#2a4a8a] to-[#1a3a6c] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-400/20"
              style={{
                width: `${20 + i * 8}px`, height: `${20 + i * 8}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="relative flex gap-2 opacity-80">
          <div className="w-12 h-16 rounded bg-amber-600/80 flex items-end justify-center pb-1 text-white text-xs">📚</div>
          <div className="w-10 h-14 rounded bg-blue-700/80 flex items-end justify-center pb-1 text-white text-xs">📖</div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-white">Grand Total</h3>
        <dl className="flex flex-col gap-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <dt>Price (2 items)</dt>
            <dd className="text-white font-medium">₹{subtotal}.00</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd className="text-white font-medium">₹{tax}.00</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery Charges</dt>
            <dd className="text-green-400 font-medium">Free</dd>
          </div>
        </dl>

        {/* Coupon */}
        <div className="flex gap-2 mt-1">
          <input
            placeholder="Apply Coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 bg-[#1e2a4a] border border-white/10 rounded text-xs text-white px-2.5 py-1.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors">
            Apply
          </button>
        </div>

        <div className="flex justify-between text-xs text-gray-400">
          <span>Discount</span>
          <span className="text-white font-medium">₹{discount}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-3">
          <span>Total Amount</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={onPayNow}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 mt-1 transition-colors"
        >
          Pay Now 🔒
        </button>
      </div>
    </div>
  );
};

/* ── Page ─────────────────────────────────────────────── */
const DarkCartCheckoutPage = () => {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const [addrForm, setAddrForm] = useState({
    firstName: "", lastName: "", address: "", email: "",
    city: "", phone: "", state: "", country: "India",
  });

  const subtotalINR = Math.round(subtotal * 83);

  const handlePayNow = () => {
    navigate("/dark/payment", {
      state: { order: { items, subtotal: subtotalINR, deliveryFee: 0, giftDiscount: 100, total: subtotalINR + Math.round(subtotalINR * 0.12) - 100 } },
    });
  };

  return (
    <DarkPageShell>
        {/* Breadcrumb */}
        <Breadcrumb theme="dark" items={[
          { label: "Home", to: "/dark" },
          { label: "Non-Fiction", to: "/dark?cat=non-fiction" },
          { label: "Self Help", to: "/dark?cat=self-help" },
          { label: "Joy of Minimalism", to: "/dark/books/b001" },
          { label: "Checkout" },
        ]} />

        <h1 className="text-lg font-bold text-white">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left: cart items + address ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Cart items row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <DarkCartItem key={item.bookId} item={item} idx={idx} />
                ))
              ) : (
                /* Empty state — show mock items matching the screenshot */
                [
                  { id: "b001", title: "Joy of Minimalism", author: "Daniel Reed", price: 1.80, description: "Declutter your life to uncover peace, clarity, and joy.", category: "self-help" },
                  { id: "b002", title: "The Path to Success", author: "James Wright", price: 4.33, description: "A practical guide to achieving goals with clarity and confidence.", category: "self-help" },
                ].map((mockBook, idx) => (
                  <DarkCartItem
                    key={mockBook.id}
                    item={{ bookId: mockBook.id, quantity: 1, book: mockBook }}
                    idx={idx}
                  />
                ))
              )}
            </div>

            {/* Address form */}
            <AddressForm form={addrForm} setForm={setAddrForm} />
          </div>

          {/* ── Right: grand total ── */}
          <div className="lg:col-span-1">
            <GrandTotal subtotal={subtotalINR || 508} onPayNow={handlePayNow} />
          </div>
        </div>
    </DarkPageShell>
  );
};

export default DarkCartCheckoutPage;
