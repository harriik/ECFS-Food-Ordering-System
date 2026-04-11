import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('customer'); // 'customer' or 'admin'
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/users/login', { email, password });
      
      if (loginType === 'admin') {
        if (data.role !== 'admin') {
          setError('Access Denied: You do not have administrator privileges.');
          setLoading(false);
          return;
        }
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/admin/orders');
      } else {
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/menu');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      if (loading) setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Welcome Back</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          type="button"
          onClick={() => setLoginType('customer')}
          style={{ flex: 1, padding: '0.5rem', borderBottom: loginType === 'customer' ? '2px solid var(--accent-color)' : '2px solid transparent', color: loginType === 'customer' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
        >
          Customer
        </button>
        <button 
          type="button"
          onClick={() => setLoginType('admin')}
          style={{ flex: 1, padding: '0.5rem', borderBottom: loginType === 'admin' ? '2px solid var(--status-placed)' : '2px solid transparent', color: loginType === 'admin' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
        >
          Administrator
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">{loginType === 'admin' ? 'Admin Email' : 'Email'}</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ position: 'relative' }}>
          <label className="form-label">Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Enter your password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: '3rem' }}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '0.75rem', top: '2.4rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '1rem', background: loginType === 'admin' ? 'var(--status-placed)' : 'var(--accent-color)' }} 
          disabled={loading}
        >
          {loading ? 'Authenticating...' : (loginType === 'admin' ? 'Login as Admin' : 'Sign In')}
        </button>
      </form>

      {loginType === 'customer' && (
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)' }}>Register here</Link>
        </p>
      )}
    </div>
  );
};

export default LoginPage;
