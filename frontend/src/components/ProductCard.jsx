// file: src/components/ProductCard.jsx
// COMPONENT THẺ SẢN PHẨM (PRODUCT CARD)
// Hiển thị tóm tắt thông tin sản phẩm (ảnh, tên, giá, size) trong danh sách sản phẩm.

import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Hàm định dạng giá tiền sang VNĐ (Ví dụ: 150000 -> 150.000 đ)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="product-card fade-in">
      <Link to={`/product/${product.id}`}>
        {/* Ảnh sản phẩm với hiệu ứng phóng to nhẹ khi hover */}
        <div className="product-card-image-wrapper">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="product-card-image"
            loading="lazy"
          />
          {product.stockQuantity === 0 && (
            <span className="product-card-badge" style={{ backgroundColor: 'var(--danger)' }}>Hết hàng</span>
          )}
        </div>
      </Link>

      {/* Thông tin sản phẩm bên dưới */}
      <div className="product-card-info">
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        
        <p className="product-card-price">{formatPrice(product.price)}</p>
        
        {/* Hiển thị các size đang có sẵn */}
        <div className="product-card-sizes">
          <span>Sizes:</span>
          {product.sizes && product.sizes.map(size => (
            <span key={size} className="size-tag">{size}</span>
          ))}
        </div>

        <Link 
          to={`/product/${product.id}`} 
          className="btn btn-outline" 
          style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', marginTop: '1rem', borderRadius: '4px' }}
        >
          Xem Chi Tiết
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
