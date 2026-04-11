import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios.js';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';

const OrderTrackPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.patch(`/orders/${orderId}/cancel`);
        fetchOrder();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/orders/${orderId}`);
      setOrder(data);
      setError('');
    } catch (err) {
      setError('Could not fetch order data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 10 seconds for live updates
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading && !order) return <h2>Loading Order...</h2>;
  if (error) return <div className="error-msg">{error}</div>;

  const statuses = ['placed', 'preparing', 'ready', 'delivered'];
  const currentIndex = statuses.indexOf(order.status);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Order Tracking</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Order ID: {order._id}
      </p>

      {/* Visual Stepper */}
      {order.status === 'cancelled' ? (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '1.5rem', marginBottom: '2rem', borderRadius: '4px' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Order Cancelled</h3>
          {order.cancelledBy === 'admin' ? (
            <p style={{ margin: 0 }}>We are deeply sorry for the inconvenience, but the restaurant had to cancel this order.</p>
          ) : (
            <p style={{ margin: 0 }}>You successfully cancelled this order. It will not be prepared.</p>
          )}
        </div>
      ) : (
        <div className="stepper">
          {statuses.map((status, index) => {
            let stepClass = 'step';
            if (index < currentIndex) stepClass += ' completed';
            if (index === currentIndex) stepClass += ' active';
            
            return (
              <div key={status} className={stepClass}>
                <div className="step-dot">
                  {index <= currentIndex && '✓'}
                </div>
                <span style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: index === currentIndex ? 'bold' : 'normal' }}>
                  {status.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: 'var(--rounded-lg)', marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h2>Order Details</h2>
          <OrderStatusBadge status={order.status} />
        </div>

        <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
          {order.items.map(i => (
            <li key={i._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>{i.quantity}x {i.menuItem.name}</span>
              <span>₹{(i.quantity * i.priceAtOrder).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
          <span>Total Paid</span>
          <span style={{ color: 'var(--accent-color)' }}>₹{order.total.toFixed(2)}</span>
        </div>

        {order.status === 'placed' && (
          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button className="btn-danger" onClick={handleCancelOrder}>Cancel Order</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackPage;
