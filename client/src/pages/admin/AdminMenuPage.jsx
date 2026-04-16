import React, { useState, useEffect } from 'react';
import axios from '../../api/axios.js';

const AdminMenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'starters',
    imageUrl: '',
    available: true
  });

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
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`/menu/${id}`);
        fetchMenu();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'starters',
      imageUrl: '',
      available: true
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item._id);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl,
      available: item.available
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price) // Ensure it's a number
      };
      
      if (editingItem) {
        await axios.put(`/menu/${editingItem}`, payload);
      } else {
        await axios.post('/menu', payload);
      }
      setShowModal(false);
      fetchMenu();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save menu item');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Manage Menu</h1>
        <button className="btn-primary" onClick={openAddModal}>+ Add New</button>
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
                  <td>₹{item.price.toFixed(2)}</td>
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
                      <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openEditModal(item)}>Edit</button>
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

      {/* Modal Overlay */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--rounded-lg)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              {editingItem ? 'Edit Menu Item' : 'Add New Item'}
            </h2>
            
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" required 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Price (₹)</label>
                  <input 
                    type="number" step="0.01" min="0" required 
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select 
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="starters">Starters</option>
                    <option value="mains">Mains</option>
                    <option value="desserts">Desserts</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input 
                  type="url" required 
                  value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  rows="3" required
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingItem ? 'Update Item' : 'Save Item'}</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuPage;
