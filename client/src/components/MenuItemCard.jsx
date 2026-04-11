import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

const MenuItemCard = ({ item }) => {
  const { addItem, items, updateQuantity, removeItem } = useContext(CartContext);
  
  const cartItem = items.find(i => i.menuItem._id === item._id);

  const displayPrice = `$${item.price.toFixed(2)}`;

  return (
    <div className="menu-card">
      <img src={item.imageUrl} alt={item.name} className="menu-img" />
      
      {!item.available && (
        <div className="sold-out-overlay">
          <span className="sold-out-text">SOLD OUT</span>
        </div>
      )}

      <div className="menu-card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3>{item.name}</h3>
          <span className={`badge`} style={{ background: 'var(--bg-surface-hover)' }}>{item.category}</span>
        </div>
        
        <p className="menu-price">{displayPrice}</p>
        <p style={{ flex: 1, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
        </p>

        {cartItem ? (
          <div className="qty-controls" style={{ justifyContent: 'center' }}>
            <button className="qty-btn" onClick={() => updateQuantity(item._id, cartItem.quantity - 1)}>-</button>
            <span style={{ fontWeight: '600', padding: '0 1rem' }}>{cartItem.quantity}</span>
            <button className="qty-btn" onClick={() => updateQuantity(item._id, cartItem.quantity + 1)} disabled={!item.available}>+</button>
          </div>
        ) : (
          <button 
            className="btn-primary" 
            style={{ width: '100%' }} 
            onClick={() => addItem(item)}
            disabled={!item.available}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
