import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

const CartItem = ({ data }) => {
  const { updateQuantity, removeItem } = useContext(CartContext);
  
  const increase = () => updateQuantity(data.menuItem._id, data.quantity + 1);
  const decrease = () => updateQuantity(data.menuItem._id, data.quantity - 1);
  
  return (
    <div className="cart-item">
      <div style={{ flex: 2 }}>
        <h3 style={{ fontSize: '1.1rem' }}>{data.menuItem.name}</h3>
        <p style={{ fontSize: '0.9rem' }}>${data.priceAtOrder.toFixed(2)} each</p>
      </div>
      
      <div className="qty-controls" style={{ margin: '0 1rem' }}>
        <button className="qty-btn" onClick={decrease}>-</button>
        <span style={{ width: '20px', textAlign: 'center' }}>{data.quantity}</span>
        <button className="qty-btn" onClick={increase}>+</button>
      </div>
      
      <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
        ${(data.priceAtOrder * data.quantity).toFixed(2)}
      </div>
      
      <button 
        className="btn-danger" 
        style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem' }} 
        onClick={() => removeItem(data.menuItem._id)}
      >
        ×
      </button>
    </div>
  );
};

export default CartItem;
