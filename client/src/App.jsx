import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OrderTrackPage from './pages/OrderTrackPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import AdminMenuPage from './pages/admin/AdminMenuPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/menu" replace />} />
            
            {/* Public Routes */}
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Customer Routes */}
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/track/:orderId" element={
              <ProtectedRoute>
                <OrderTrackPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/menu" element={
              <ProtectedRoute adminOnly={true}>
                <AdminMenuPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute adminOnly={true}>
                <AdminOrdersPage />
              </ProtectedRoute>
            } />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
