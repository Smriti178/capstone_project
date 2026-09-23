import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-[#1e3a5f] text-white mt-auto">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={20} />
            <span className="text-lg font-bold">PageTurn</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Your favourite online bookstore. Discover thousands of titles across every genre.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-white/80 uppercase tracking-wide">Browse</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {[
              { to: "/", label: "Home" },
              { to: "/categories", label: "Categories" },
              { to: "/brands", label: "Publishers" },
              { to: "/books", label: "All Books" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-white/80 uppercase tracking-wide">Account</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {[
              { to: "/login", label: "Sign In" },
              { to: "/register", label: "Register" },
              { to: "/orders", label: "Order History" },
              { to: "/cart", label: "Shopping Cart" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-white/80 uppercase tracking-wide">Contact</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-start gap-2 min-w-0"><Mail size={14} className="shrink-0 mt-0.5" /><span className="break-all">support@pageturn.com</span></li>
            <li className="flex items-center gap-2"><Phone size={14} className="shrink-0" /> 1-800-BOOKS-99</li>
            <li className="flex items-center gap-2"><MapPin size={14} className="shrink-0" /> San Francisco, CA</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
        <span>© {new Date().getFullYear()} PageTurn Books. All rights reserved.</span>
        <span className="flex gap-4">
          <Link to="#" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-white/70 transition-colors">Terms of Service</Link>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
