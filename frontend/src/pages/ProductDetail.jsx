// file: src/pages/ProductDetail.jsx
// TRANG CHI TIẾT SẢN PHẨM (PRODUCT DETAIL PAGE)
// Hiển thị đầy đủ thông tin mô tả sản phẩm, hình ảnh lớn, chọn kích cỡ, chọn số lượng và thêm vào giỏ hàng.

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiCall } from '../services/api';
import { CartContext } from '../context/CartContext';
import { ChevronLeft, ShoppingCart, Check } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Trạng thái người dùng chọn trên giao diện
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  // Lấy chi tiết sản phẩm theo ID
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await apiCall(`/products/${id}`);
        setProduct(data);
        // Chọn size đầu tiên làm mặc định nếu có
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Không tìm thấy sản phẩm hoặc lỗi kết nối.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // Tăng giảm số lượng sản phẩm mua
  const handleQtyChange = (type) => {
    if (type === 'dec' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'inc') {
      // Giới hạn không mua quá tồn kho
      if (product && quantity < product.stockQuantity) {
        setQuantity(quantity + 1);
      }
    }
  };

  // Hàm thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích cỡ (Size) trước khi mua!');
      return;
    }
    
    addToCart(product, selectedSize, quantity);
    
    // Hiển thị thông báo thêm thành công trong 3 giây
    setSuccessMessage(`Đã thêm ${quantity} sản phẩm size ${selectedSize} vào giỏ hàng!`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>Đang tải thông tin sản phẩm...</div>;
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h3 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'Không tìm thấy sản phẩm!'}</h3>
        <Link to="/" className="btn btn-primary">Quay lại Trang Chủ</Link>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container fade-in" style={{ marginTop: '2rem' }}>
      {/* Nút quay lại */}
      <Link to="/" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '2rem' }}>
        <ChevronLeft size={16} /> Tiếp tục mua sắm
      </Link>

      <div className="product-detail-layout">
        {/* Khối Ảnh Trái */}
        <div className="detail-image-container">
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>

        {/* Khối Thông Tin Phải */}
        <div className="detail-info-pane">
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>

          <p className="detail-description">
            {product.description || 'Mẫu sản phẩm quần áo thiết kế thời thượng, phong cách tối giản nhưng tinh tế. Thích hợp cho cả mặc ở nhà và dạo phố.'}
          </p>

          {/* Chọn Size */}
          <div className="size-selector-section">
            <span className="size-selector-label">Chọn Size (Kích cỡ):</span>
            <div className="size-selector-buttons">
              {product.sizes && product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng mua & Nút Thêm vào giỏ */}
          <div className="size-selector-section" style={{ marginTop: '1rem' }}>
            <span className="size-selector-label">Số lượng mua (Kho: {product.stockQuantity} món):</span>
            
            {product.stockQuantity > 0 ? (
              <div className="qty-add-to-cart-wrapper">
                <div className="qty-spinner">
                  <button className="qty-btn" onClick={() => handleQtyChange('dec')}>-</button>
                  <span className="qty-val">{quantity}</span>
                  <button className="qty-btn" onClick={() => handleQtyChange('inc')}>+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart} 
                  className="btn btn-primary"
                  style={{ height: '48px', borderRadius: '4px', flexGrow: 1 }}
                >
                  <ShoppingCart size={18} /> Thêm Vào Giỏ Hàng
                </button>
              </div>
            ) : (
              <p style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Sản phẩm tạm thời Hết hàng!
              </p>
            )}
          </div>

          {/* Thông báo thành công */}
          {successMessage && (
            <div className="fade-in" style={{ backgroundColor: '#d1fae5', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', marginTop: '1rem' }}>
              <Check size={18} /> {successMessage}
            </div>
          )}

          {/* Các thông tin phụ cam kết chất lượng */}
          <div style={{ marginTop: 'auto', borderTop: '1px dashed #cbd5e1', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div>✔️ Đổi trả miễn phí trong vòng 7 ngày</div>
            <div>✔️ Giao hàng hoả tốc toàn quốc</div>
            <div>✔️ Cam kết hàng chính hãng 100%</div>
            <div>✔️ Kiểm tra hàng trước khi thanh toán</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
