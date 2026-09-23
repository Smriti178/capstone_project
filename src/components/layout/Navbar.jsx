import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, BookOpen, User, LogOut } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CartDrawer from "../cart/CartDrawer";

const Navbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1e3a5f] shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white shrink-0">
            <BookOpen size={22} />
            <span className="text-lg font-bold tracking-tight hidden sm:inline">PageTurn</span>
          </Link>

          {/* Search — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-xl items-center bg-white/10 rounded-lg overflow-hidden border border-white/20 focus-within:border-white/60 transition-colors"
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Search books, authors…"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/60 outline-none"
            />
            <button type="submit" className="px-3 py-2 text-white/70 hover:text-white">
              <Search size={16} />
            </button>
          </form>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            {/* Cart — opens drawer */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1 rounded-lg px-2 py-2 text-white hover:bg-white/10 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f59e0b] text-xs font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link
                  to="/orders"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <User size={16} />
                  <span>{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-2 py-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                  title="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              >
                <User size={16} />
                Sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="sm:hidden rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[#1e3a5f] px-4 pb-4">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mt-3 flex items-center bg-white/10 rounded-lg overflow-hidden border border-white/20">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Search books, authors…"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/60 outline-none"
            />
            <button type="submit" className="px-3 py-2 text-white/70">
              <Search size={16} />
            </button>
          </form>

          {/* Nav links */}
          <nav className="mt-3 flex flex-col gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/categories", label: "Categories" },
              { to: "/brands", label: "Brands" },
              { to: "/books", label: "All Books" },
              ...(user ? [{ to: "/orders", label: "My Orders" }] : []),
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 transition-colors text-left"
              >
                <LogOut size={15} /> Log out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
      {/* Cart drawer — rendered outside sticky header so it overlays everything */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Navbar;
