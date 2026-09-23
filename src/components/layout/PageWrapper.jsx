import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Wraps every page with the shared Navbar and Footer.
 * Optional `noPadding` for pages that manage their own top spacing.
 */
const PageWrapper = ({ children, noPadding = false }) => (
  <div className="flex min-h-screen flex-col bg-gray-50">
    <Navbar />
    <main className={`flex-1 ${noPadding ? "" : "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8"}`}>
      {children}
    </main>
    <Footer />
  </div>
);

export default PageWrapper;
