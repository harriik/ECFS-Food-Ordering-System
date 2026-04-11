import React, { useState, useEffect } from 'react';
import axios from '../../api/axios.js';
import OrderStatusBadge from '../../components/OrderStatusBadge.jsx';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Use proper websockets for real app, polling here for demo
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/orders/${id}/status`, { status: newStatus });
      fetchOrders(); // refresh
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getNextStatusOptions = (current) => {
    if (current === 'placed') return [{ label: 'Accept & Prepare', val: 'preparing' }, { label: 'Cancel', val: 'cancelled' }];
    if (current === 'preparing') return [{ label: 'Mark Ready', val: 'ready' }, { label: 'Cancel', val: 'cancelled' }];
    if (current === 'ready') return [{ label: 'Complete Delivery', val: 'delivered' }];
    return [];
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Live Orders</h1>

      {loading && orders.length === 0 ? <p>Loading orders...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--rounded-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>Order #{order._id.substring(order._id.length - 6)}</h3>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Customer: {order.userId?.name || 'Unknown'} | {new Date(order.createdAt).toLocaleString()}
                </p>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                  {order.items.map(i => (
                    <span key={i._id} style={{ marginRight: '1rem', background: 'var(--bg-color)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {i.quantity}x {i.menuItem?.name || 'Deleted Item'}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '1rem' }}>
                  ₹{order.total.toFixed(2)}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  {getNextStatusOptions(order.status).map(opt => (
                    <button 
                      key={opt.val} 
                      className="btn-primary" 
                      onClick={() => updateOrderStatus(order._id, opt.val)}
                      style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                  {order.status === 'delivered' && (
                    <span style={{ color: 'var(--status-delivered)' }}>Completed</span>
                  )}
                </div>
              </div>

            </div>
          ))}
          {orders.length === 0 && <p>No orders yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
