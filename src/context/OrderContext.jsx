import React, { createContext, useContext, useState, useCallback } from "react";
import { getEnrichedOrders } from "../data/orders";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(getEnrichedOrders());
  const [activeOrder, setActiveOrder] = useState(null); // most recently placed order

  const placeOrder = useCallback((orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: "processing",
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    return newOrder;
  }, []);

  const cancelOrder = useCallback((orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
    );
  }, []);

  return (
    <OrderContext.Provider value={{ orders, activeOrder, placeOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrderProvider>");
  return ctx;
};
