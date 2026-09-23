import React from "react";
import { Link, Navigate } from "react-router-dom";
import { BookOpen, Star, Quote } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";

/* Decorative testimonial shown on the left panel */
const testimonials = [
  {
    quote: "PageTurn helped me rediscover my love for reading. Outstanding selection!",
    name: "Sarah M.",
    role: "Book enthusiast",
  },
  {
    quote: "Fast delivery and great prices. My go-to bookstore for the whole family.",
    name: "James T.",
    role: "Parent & reader",
  },
];

const LoginPage = () => {
  const { user } = useAuth();

  // Already logged in → redirect home
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── Left panel: branding ── */}
      <div className="hidden md:flex md:w-5/12 lg:w-2/5 flex-col justify-between bg-[#1e3a5f] p-10 text-white">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <BookOpen size={24} />
          <span className="text-xl font-bold tracking-tight">PageTurn</span>
        </Link>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold leading-snug">
            Thousands of books,<br />one great destination.
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Sign in to access your reading history, track orders, redeem gift points, and get personalised recommendations.
          </p>

          {/* Testimonial */}
          <div className="mt-6 rounded-xl bg-white/10 border border-white/10 p-5 space-y-3">
            <Quote size={18} className="text-white/40" />
            <p className="text-sm text-white/80 italic leading-relaxed">
              "{testimonials[0].quote}"
            </p>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {testimonials[0].name[0]}
              </div>
              <div>
                <p className="text-xs font-semibold">{testimonials[0].name}</p>
                <p className="text-xs text-white/50">{testimonials[0].role}</p>
              </div>
              <div className="ml-auto flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} PageTurn Books. All rights reserved.
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-10 sm:py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="mb-6 flex items-center gap-2 text-[#1e3a5f] md:hidden">
            <BookOpen size={22} />
            <span className="text-lg font-bold">PageTurn</span>
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 sm:px-8 sm:py-10 shadow-sm">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-1 text-sm text-gray-500">
                Sign in to your PageTurn account
              </p>
            </div>

            <LoginForm />
          </div>

          {/* Register nudge below card on mobile */}
          <p className="mt-6 text-center text-xs text-gray-400">
            New to PageTurn?{" "}
            <Link to="/register" className="text-[#1e3a5f] font-medium hover:underline">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
