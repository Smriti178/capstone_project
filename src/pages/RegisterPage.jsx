import React from "react";
import { Link, Navigate } from "react-router-dom";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../components/auth/RegisterForm";

const perks = [
  "Track all your orders in one place",
  "Redeem gift points on every purchase",
  "Get personalised book recommendations",
  "Cancel within 48 hours, hassle-free",
];

const RegisterPage = () => {
  const { user } = useAuth();

  // Already logged in → redirect home
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── Left panel: branding ── */}
      <div className="hidden md:flex md:w-5/12 lg:w-2/5 flex-col justify-between bg-[#1e3a5f] p-10 text-white">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen size={24} />
          <span className="text-xl font-bold tracking-tight">PageTurn</span>
        </Link>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold leading-snug">
              Join thousands<br />of happy readers.
            </h1>
            <p className="mt-3 text-white/70 text-sm leading-relaxed">
              Create a free account and unlock the full PageTurn experience.
            </p>
          </div>

          {/* Perk list */}
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm text-white/80">
                <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                {perk}
              </li>
            ))}
          </ul>

          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-4 rounded-xl bg-white/10 border border-white/10 p-5 text-center">
            {[
              { value: "50k+", label: "Books" },
              { value: "120k", label: "Readers" },
              { value: "4.8★", label: "Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

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
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="mt-1 text-sm text-gray-500">Free forever. No credit card required.</p>
            </div>

            <RegisterForm />
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1e3a5f] font-medium hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
