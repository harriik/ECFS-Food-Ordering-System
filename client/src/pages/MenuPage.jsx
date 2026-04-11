import React, { useState, useEffect } from 'react';
import axios from '../api/axios.js';
import MenuItemCard from '../components/MenuItemCard.jsx';

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/menu?category=${category}&search=${search}`);
      setItems(data);
      setError('');
    } catch (err) {
      setError('Failed to load menu items.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // debounce search slightly
    const delay = setTimeout(() => {
      fetchMenu();
    }, 300);
    return () => clearTimeout(delay);
  }, [category, search]);

  const categories = ['all', 'starters', 'mains', 'desserts', 'drinks'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>Our Menu</h1>
        <input 
          type="text" 
          placeholder="Search for food..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px', marginTop: 0 }}
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="category-filters">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`pill ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <h2 style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading our delicious food...</h2>
      ) : (
        <>
          {items.length === 0 ? (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
              <h3>No items found</h3>
              <p>Try tweaking your search or category filters.</p>
            </div>
          ) : (
            <div className="menu-grid">
              {items.map(item => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuPage;
