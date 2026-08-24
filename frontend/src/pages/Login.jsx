// file: src/pages/Login.jsx
// TRANG ĐĂNG NHẬP (LOGIN PAGE)
// Cung cấp biểu mẫu đăng nhập cho người dùng và quản trị viên, hỗ trợ tự động chuyển vai trò.

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Nếu đã đăng nhập sẵn rồi thì tự động chuyển trang
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMsg(result.message || 'Sai Email hoặc Mật khẩu!');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Có lỗi mạng hoặc máy chủ xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page-wrapper fade-in">
      <div className="auth-card">
        <h2 className="auth-title">Chào Mừng Trở Lại</h2>
        <p className="auth-subtitle">Đăng nhập tài khoản thời trang của bạn</p>

        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '0.8rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Ô Nhập Email */}
          <div className="form-group">
            <label className="form-label">Địa chỉ Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="ten@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Ô Nhập Mật khẩu */}
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', marginTop: '1rem' }}
          >
            {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <p className="auth-footer-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>

        {/* Hướng dẫn tài khoản test cực kỳ tiện lợi */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>💡 Thông tin tài khoản Demo có sẵn:</p>
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.8rem', borderRadius: '4px', border: '1px dashed #cbd5e1' }}>
            <p>🔑 <strong>Tài khoản Khách hàng:</strong></p>
            <p>Email: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>customer@gmail.com</span> | Mật khẩu: <code>123456</code></p>
            <p style={{ marginTop: '0.5rem' }}>🔑 <strong>Tài khoản Admin:</strong></p>
            <p>Email: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>admin@gmail.com</span> | Mật khẩu: <code>admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
