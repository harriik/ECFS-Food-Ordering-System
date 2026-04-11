import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import CartItem from '../components/CartItem.jsx';
import axios from '../api/axios.js';

const CartPage = () => {
  const { items, totalItems, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      // Construct payload
      const orderItems = items.map(i => ({
        menuItem: i.menuItem._id,
        quantity: i.quantity
      }));

      const { data } = await axios.post('/orders', { items: orderItems });
      
      clearCart();
      navigate(`/track/${data._id}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Something might be out of stock!');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Your cart is empty 😢</h2>
        <p style={{ marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Cart</h1>
      
      {error && <div className="error-msg">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="cart-list">
          {items.map(item => (
            <CartItem key={item.menuItem._id} data={item} />
          ))}
        </div>

        <div>
          <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--rounded-lg)', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Items ({totalItems})</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span>Taxes & Fees</span>
              <span>Calculated at checkout</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent-color)' }}>₹{totalPrice.toFixed(2)}</span>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order securely'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
