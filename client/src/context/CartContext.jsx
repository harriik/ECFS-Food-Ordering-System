import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = sessionStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem) => {
    setItems((prev) => {
      const existing = prev.find(i => i.menuItem._id === menuItem._id);
      if (existing) {
        return prev.map(i => i.menuItem._id === menuItem._id 
          ? { ...i, quantity: i.quantity + 1 }
          : i
        );
      }
      return [...prev, { menuItem, quantity: 1, priceAtOrder: menuItem.price }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.menuItem._id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    
    setItems(prev => prev.map(i => i.menuItem._id === id
      ? { ...i, quantity: newQuantity }
      : i
    ));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.quantity * item.priceAtOrder), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
