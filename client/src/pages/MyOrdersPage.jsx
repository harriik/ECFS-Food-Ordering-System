import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders/mine');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No previous orders</h3>
          <p>You haven't placed any orders yet!</p>
          <Link to="/menu" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Browse Menu</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <Link key={order._id} to={`/track/${order._id}`} style={{ textDecoration: 'none', color: 'inherit', background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--rounded-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid transparent' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Order #{order._id.substring(order._id.length - 6)}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </p>
                <OrderStatusBadge status={order.status} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--accent-color)', marginBottom: '0' }}>
                  ₹{order.total.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
