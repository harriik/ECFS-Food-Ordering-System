import React, { useState, useEffect } from 'react';
import axios from '../../api/axios.js';

const AdminMenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const { data } = await axios.get('/menu?all=true');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await axios.put(`/menu/${id}`, { available: !currentStatus });
      fetchMenu(); // reload list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteItem = async (id) => {
    if(window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`/menu/${id}`);
        fetchMenu();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Manage Menu</h1>
        <button className="btn-primary" onClick={() => alert('Add New Item form coming soon (demo limit)')}>+ Add New</button>
      </div>

      {loading ? <p>Loading menu...</p> : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td><img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                  <td style={{ fontWeight: '500' }}>{item.name}</td>
                  <td><span className="badge" style={{ background: 'var(--bg-surface-hover)' }}>{item.category}</span></td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => toggleAvailability(item._id, item.available)}
                      className={item.available ? "btn-secondary" : "btn-danger"}
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                    >
                      {item.available ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>Edit</button>
                      <button className="btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => deleteItem(item._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No menu items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMenuPage;
