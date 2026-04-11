import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';

const Navbar = () => {
  const { totalItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    clearCart(); // Optional: clear cart on logout
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to={userInfo?.role === 'admin' ? "/admin/orders" : "/menu"} className="nav-brand">Hidden Fork</Link>
      <nav className="nav-links">
        {(!userInfo || userInfo.role !== 'admin') && (
          <>
            <Link to="/menu" className="nav-link">Menu</Link>
            <Link to="/cart" className="nav-link">
              Cart {totalItems > 0 && <span style={{ background: 'var(--accent-color)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', marginLeft: '4px' }}>{totalItems}</span>}
            </Link>
          </>
        )}
        
        {userInfo ? (
          <>
            {userInfo.role !== 'admin' && (
              <Link to="/orders" className="nav-link">My Orders</Link>
            )}
            {userInfo.role === 'admin' && (
              <>
                <Link to="/admin/menu" className="nav-link" style={{ color: 'var(--status-preparing)' }}>Admin Menu</Link>
                <Link to="/admin/orders" className="nav-link" style={{ color: 'var(--status-preparing)' }}>Admin Orders</Link>
              </>
            )}
            <span style={{ color: 'var(--text-secondary)' }}>Welcome, {userInfo.name}</span>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn-primary">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
