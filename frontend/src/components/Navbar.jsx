// file: src/components/Navbar.jsx
// COMPONENT THANH DIỀU HƯỚNG (NAVBAR)
// Thanh điều hướng trên cùng hiển thị Logo, Giỏ hàng (kèm badge số lượng), và thông tin tài khoản đăng nhập.

import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, User, LogOut, LayoutDashboard, Shirt } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo Thương hiệu */}
        <Link to="/" className="logo">
          <Shirt size={28} className="logo-icon" />
          SHOP<span>QUANAO</span>
        </Link>

        {/* Menu Điều hướng chính */}
        <ul className="nav-menu">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Trang Chủ
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Giỏ Hàng
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Đơn Hàng
              </NavLink>
            </li>
          )}
          {/* Chỉ hiển thị link Admin Dashboard nếu người dùng đăng nhập có vai trò admin */}
          {user && user.role === 'admin' && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} style={{ color: 'var(--accent)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <LayoutDashboard size={16} /> Admin Panel
                </span>
              </NavLink>
            </li>
          )}
        </ul>

        {/* Khối Hành động bên phải (Giỏ hàng & Đăng nhập) */}
        <div className="nav-actions">
          {/* Nút Giỏ Hàng kèm số lượng */}
          <Link to="/cart" className="cart-icon-btn" title="Giỏ hàng">
            <ShoppingBag size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            // Nếu ĐÃ ĐĂNG NHẬP: Hiển thị tên người dùng và nút Đăng xuất
            <div className="user-profile-nav">
              <div className="user-info-text">
                <span className="user-name-label">{user.name}</span>
                <span className="user-role-badge">
                  {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '4px' }} title="Đăng xuất">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            // Nếu CHƯA ĐĂNG NHẬP: Hiển thị nút Đăng nhập
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', borderRadius: '4px' }}>
              <User size={16} /> Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
