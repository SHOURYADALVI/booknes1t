import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case "UPDATE_QTY":
      if (action.qty < 1) return { ...state, items: state.items.filter(i => i.id !== action.id) };
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "ADD_ORDER":
      return { ...state, orders: [action.order, ...state.orders] };
    case "UPDATE_ORDER_STATUS":
      return { ...state, orders: state.orders.map(o => o.id === action.id ? { ...o, status: action.status } : o) };
    default:
      return state;
  }
};

import { INITIAL_ORDERS } from "../data/mockData";

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    orders: INITIAL_ORDERS,
  });

  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);

  const addItem = (item) => dispatch({ type: "ADD_ITEM", item });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", id });
  const updateQty = (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const addOrder = (order) => dispatch({ type: "ADD_ORDER", order });
  const updateOrderStatus = (id, status) => dispatch({ type: "UPDATE_ORDER_STATUS", id, status });

  return (
    <CartContext.Provider value={{ items: state.items, orders: state.orders, total, itemCount, addItem, removeItem, updateQty, clearCart, addOrder, updateOrderStatus }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
