import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LayoutGrid, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

/**
 * Dark "Book Worm" navbar — exactly matches the screenshot layout:
 *   [≡ Book Worm] | [My Orders] [My Wishlist] [My Writers]  [search bar]  [cart] [user]
 */
const DarkNavbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#1a1a2e] border-b border-white/10 sticky top-0 z-40">
      <div className="flex h-12 items-center gap-0 px-4 sm:px-5">

        {/* Logo */}
        <Link
          to="/dark"
          className="flex items-center gap-2 text-white shrink-0 pr-4 mr-0"
        >
          <LayoutGrid size={15} className="text-blue-400" />
          <span className="text-sm font-bold tracking-wide">Book Worm</span>
        </Link>

        {/* Separator */}
        <div className="hidden md:block w-px h-5 bg-white/20 mr-0" />

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300 pl-5">
          <Link to="/orders" className="hover:text-white transition-colors whitespace-nowrap">My Orders</Link>
          <Link to="/dark/wishlist" className="hover:text-white transition-colors whitespace-nowrap">My Wishlist</Link>
          <Link to="/dark/writers" className="hover:text-white transition-colors whitespace-nowrap">My Writers</Link>
        </nav>

        {/* Spacer — pushes icons to right */}
        <div className="flex-1" />

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-gray-300 hover:text-white transition-colors"
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="text-gray-300 hover:text-white transition-colors"
              title={`Logged in as ${user.name} — click to log out`}
              aria-label="Log out"
            >
              <User size={18} />
            </button>
          ) : (
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors" aria-label="Log in">
              <User size={18} />
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-300 hover:text-white ml-3"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#16213e] px-4 pb-4 pt-2 flex flex-col gap-3 text-sm text-gray-300 border-t border-white/5">
          <Link to="/orders" onClick={() => setMenuOpen(false)} className="hover:text-white py-1">My Orders</Link>
          <Link to="/dark/wishlist" onClick={() => setMenuOpen(false)} className="hover:text-white py-1">My Wishlist</Link>
          <Link to="/dark/writers" onClick={() => setMenuOpen(false)} className="hover:text-white py-1">My Writers</Link>
          <hr className="border-white/10" />
          {user ? (
            <button
              onClick={() => { logout(); navigate("/login"); setMenuOpen(false); }}
              className="text-left text-red-400 hover:text-red-300 py-1"
            >
              Log out ({user.name})
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-white py-1">Log in</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default DarkNavbar;
