import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios.js';
import MenuItemCard from '../components/MenuItemCard.jsx';
import { CartContext } from '../context/CartContext.jsx';

const MenuPage = () => {
  const { items: cartItems, totalItems } = useContext(CartContext);
  
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
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.priceAtOrder * i.quantity), 0);

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

      {/* Floating Checkout Banner */}
      {totalItems > 0 && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-color)', padding: '1rem 2rem', borderRadius: '50px', display: 'flex', gap: '2rem', alignItems: 'center', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)', zIndex: 100 }}>
          <div style={{ color: 'white' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', marginRight: '0.5rem' }}>{totalItems} item{totalItems > 1 ? 's' : ''}</span>
            <span style={{ opacity: 0.9 }}>| ₹{cartTotal.toFixed(2)}</span>
          </div>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '25px', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
            View Cart &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
