// file: src/pages/Home.jsx
// TRANG CHỦ (HOME PAGE)
// Hiển thị Banner lớn, bộ tìm kiếm & lọc danh mục, và lưới hiển thị các thẻ sản phẩm quần áo.

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { apiCall } from '../services/api';
import { Search } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Bộ lọc tìm kiếm & Danh mục
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // null = Tất cả

  // Gọi API lấy danh sách sản phẩm khi render hoặc khi thay đổi tìm kiếm/danh mục
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let endpoint = '/products';
        const params = [];
        
        if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
        if (selectedCategory) params.push(`categoryId=${selectedCategory}`);
        
        if (params.length > 0) {
          endpoint += `?${params.join('&')}`;
        }
        
        const data = await apiCall(endpoint);
        setProducts(data);
        setError('');
      } catch (err) {
        console.error('Không thể lấy sản phẩm:', err);
        setError('Có lỗi xảy ra khi tải danh sách sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce nhẹ tìm kiếm để tránh gọi API liên tục khi gõ
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container fade-in">
      {/* 1. Hero Banner cuốn hút */}
      <section className="hero-banner">
        <div className="container" style={{ padding: '0 3rem' }}>
          <div className="hero-content">
            <span className="hero-tagline">New Collection 2026</span>
            <h1 className="hero-title">Định Hình Phong Cách Riêng Của Bạn</h1>
            <p className="hero-subtitle">
              Khám phá các mẫu áo thun Oversize, quần Jean ống rộng phong cách năng động độc quyền thương hiệu SHOPQUANAO.
            </p>
            <a href="#shop-now" className="btn btn-accent">Mua Sắm Ngay</a>
          </div>
        </div>
      </section>

      {/* 2. Bộ Lọc sản phẩm & Tìm Kiếm */}
      <section id="shop-now" style={{ scrollMarginTop: '100px' }}>
        <div className="filter-search-container">
          {/* Lọc nhanh theo Category */}
          <div className="categories-tabs">
            <button 
              className={`category-tab ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              Tất Cả
            </button>
            <button 
              className={`category-tab ${selectedCategory === 1 ? 'active' : ''}`}
              onClick={() => setSelectedCategory(1)}
            >
              Áo Thun
            </button>
            <button 
              className={`category-tab ${selectedCategory === 2 ? 'active' : ''}`}
              onClick={() => setSelectedCategory(2)}
            >
              Quần Jean
            </button>
            <button 
              className={`category-tab ${selectedCategory === 3 ? 'active' : ''}`}
              onClick={() => setSelectedCategory(3)}
            >
              Áo Khoác & Hoodie
            </button>
            <button 
              className={`category-tab ${selectedCategory === 4 ? 'active' : ''}`}
              onClick={() => setSelectedCategory(4)}
            >
              Sơ Mi
            </button>
          </div>

          {/* Ô tìm kiếm từ khóa */}
          <div className="search-box-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm mẫu quần áo..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 3. Lưới hiển thị danh sách sản phẩm */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            Đang tải sản phẩm...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>
            {error}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            Không tìm thấy sản phẩm quần áo nào phù hợp.
          </div>
        ) : (
          <div className="grid-products">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
