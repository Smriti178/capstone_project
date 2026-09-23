import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages — light theme
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CategoryPage from "../pages/CategoryPage";
import BrandsPage from "../pages/BrandsPage";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentPage from "../pages/PaymentPage";
import PaymentConfirmationPage from "../pages/PaymentConfirmationPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import OrderDetailPage from "../pages/OrderDetailPage";

// Pages — dark "Book Worm" theme (from screenshots)
import DarkCataloguePage from "../pages/DarkCataloguePage";
import DarkProductDetailPage from "../pages/DarkProductDetailPage";
import DarkCartCheckoutPage from "../pages/DarkCartCheckoutPage";
import DarkPaymentPage from "../pages/DarkPaymentPage";
import DarkPurchaseConfirmPage from "../pages/DarkPurchaseConfirmPage";

/** Redirects unauthenticated users to /login */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Default: redirect to dark Book Worm catalogue */}
      <Route path="/" element={<Navigate to="/dark" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/brands" element={<BrandsPage />} />
      <Route path="/books" element={<ProductListPage />} />
      <Route path="/books/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Protected — require login */}
      <Route
        path="/checkout"
        element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
      />
      <Route
        path="/payment"
        element={<ProtectedRoute><PaymentPage /></ProtectedRoute>}
      />
      <Route
        path="/payment/confirmation"
        element={<ProtectedRoute><PaymentConfirmationPage /></ProtectedRoute>}
      />
      <Route
        path="/order/confirmation"
        element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>}
      />
      <Route
        path="/orders"
        element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>}
      />
      <Route
        path="/orders/:id"
        element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>}
      />

      {/* ── Dark "Book Worm" theme routes (from screenshots) ── */}
      <Route path="/dark" element={<DarkCataloguePage />} />
      <Route path="/dark/books/:id" element={<DarkProductDetailPage />} />
      <Route path="/dark/cart" element={<DarkCartCheckoutPage />} />
      <Route path="/dark/payment" element={<DarkPaymentPage />} />
      <Route path="/dark/confirmation" element={<DarkPurchaseConfirmPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
