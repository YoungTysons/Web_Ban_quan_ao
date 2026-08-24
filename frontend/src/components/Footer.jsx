// file: src/components/Footer.jsx
// COMPONENT CHÂN TRANG (FOOTER)
// Hiển thị chân trang của website với đầy đủ thông tin liên hệ và các chính sách hỗ trợ.

import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Cột 1: Thông tin thương hiệu */}
          <div>
            <div className="logo" style={{ color: '#ffffff', marginBottom: '1rem' }}>
              <Shirt size={24} style={{ color: 'var(--accent)' }} />
              SHOP<span style={{ color: 'var(--accent)' }}>QUANAO</span>
            </div>
            <p className="footer-text">
              Thương hiệu thời trang cung cấp các mẫu quần áo Unisex, Streetwear năng động, cá tính. Cam kết chất lượng vải cotton 100% dày mịn, thoáng mát.
            </p>
          </div>

          {/* Cột 2: Danh mục mua sắm */}
          <div>
            <h4 className="footer-heading">Danh Mục Mua Sắm</h4>
            <ul className="footer-links">
              <li><Link to="/">Áo Thun Cotton</Link></li>
              <li><Link to="/">Quần Jean Unisex</Link></li>
              <li><Link to="/">Áo Khoác & Hoodie</Link></li>
              <li><Link to="/">Áo Sơ Mi Hàn Quốc</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h4 className="footer-heading">Hỗ Trợ Khách Hàng</h4>
            <ul className="footer-links">
              <li><Link to="/">Hướng Dẫn Chọn Size</Link></li>
              <li><Link to="/">Chính Sách Đổi Trả (7 ngày)</Link></li>
              <li><Link to="/">Chính Sách Giao Hàng</Link></li>
              <li><Link to="/">Câu Hỏi Thường Gặp</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="footer-heading">Thông Tin Liên Hệ</h4>
            <p className="footer-text">
              📍 Địa chỉ: 123 Đường Ba Đình, Quận 1, TP. Hồ Chí Minh
            </p>
            <p className="footer-text">
              📞 Hotline: 0912.345.678
            </p>
            <p className="footer-text">
              ✉️ Email: support@shopquanao.vn
            </p>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SHOPQUANAO. Thiết kế và phát triển phục vụ học tập Node.js & React.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
