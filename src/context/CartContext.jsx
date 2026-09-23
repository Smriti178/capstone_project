import React, { createContext, useContext, useReducer, useCallback } from "react";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.bookId === action.payload.bookId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.bookId === action.payload.bookId
              ? { ...i, quantity: i.quantity + (action.payload.quantity ?? 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { bookId: action.payload.bookId, quantity: action.payload.quantity ?? 1, book: action.payload.book }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.bookId !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.bookId === action.payload.bookId
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

const initialState = { items: [] };

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((book, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { bookId: book.id, book, quantity } });
  }, []);

  const removeItem = useCallback((bookId) => {
    dispatch({ type: "REMOVE_ITEM", payload: bookId });
  }, []);

  const updateQuantity = useCallback((bookId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { bookId, quantity } });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + (i.book?.price ?? 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items: state.items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
