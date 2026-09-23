import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import AppRouter from "./routes/AppRouter";

const App = () => (
  <AuthProvider>
    <CartProvider>
      <OrderProvider>
        <AppRouter />
      </OrderProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;
