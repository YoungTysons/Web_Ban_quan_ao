// file: src/pages/Register.jsx
// TRANG ĐĂNG KÝ (REGISTER PAGE)
// Cung cấp biểu mẫu đăng ký tài khoản mới cho người dùng.

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, KeyRound, Phone, MapPin, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Các trường biểu thông tin đăng ký
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); // Cho phép chọn 'customer' hoặc 'admin' để dễ dàng test các tính năng admin
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
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
    setErrorMsg('');

    // 1. Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp!');
      return;
    }

    // 2. Kiểm tra độ dài mật khẩu tối thiểu
    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);

    try {
      const result = await register(name, email, password, role, phone, address);
      if (!result.success) {
        setErrorMsg(result.message || 'Đăng ký tài khoản thất bại!');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi mạng hoặc máy chủ xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page-wrapper fade-in" style={{ padding: '3rem 0' }}>
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <h2 className="auth-title">Tạo Tài Khoản Mới</h2>
        <p className="auth-subtitle">Trở thành thành viên của cửa hàng quần áo ShopQuaAo</p>

        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '0.8rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Ô Nhập Họ Tên */}
          <div className="form-group">
            <label className="form-label">Họ và Tên *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Nguyễn Văn A" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Ô Nhập Email */}
          <div className="form-group">
            <label className="form-label">Địa chỉ Email *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="a@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Chọn vai trò (Role Selector) - Hỗ trợ cho học tập */}
          <div className="form-group">
            <label className="form-label">Chọn Vai Trò Tài Khoản (Phục vụ học tập)</label>
            <select 
              className="form-input" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="customer">Khách hàng (Customer)</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>
          </div>

          {/* Điện thoại & Địa chỉ */}
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="tel" 
                className="form-input" 
                placeholder="0912345678" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ mặc định</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '15px', color: 'var(--text-muted)' }} />
              <textarea 
                className="form-input" 
                rows="2" 
                placeholder="Nhập địa chỉ nhà của bạn..." 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ paddingLeft: '2.5rem', resize: 'none', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Ô Nhập Mật khẩu */}
          <div className="form-group">
            <label className="form-label">Mật khẩu *</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="Tối thiểu 6 ký tự" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu *</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="Nhập lại mật khẩu" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Đang Đăng Ký...' : 'Đăng Ký Tài Khoản'}
          </button>
        </form>

        <p className="auth-footer-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
