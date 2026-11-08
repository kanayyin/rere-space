import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.optionId === product.optionId);
      if (existing) return prev.map((i) => i.optionId === product.optionId ? { ...i, quantity: Math.min(20, i.quantity + qty) } : i);
      return [...prev, { ...product, quantity: qty }];
    });
  }

  function updateQty(optionId, qty) {
    if (qty < 1) return removeItem(optionId);
    setItems((prev) => prev.map((i) => i.optionId === optionId ? { ...i, quantity: Math.min(20, qty) } : i));
  }

  function removeItem(optionId) {
    setItems((prev) => prev.filter((i) => i.optionId !== optionId));
  }

  function clear() { setItems([]); }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, addItem, updateQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }
