// file: src/pages/Cart.jsx
// TRANG GIỎ HÀNG (CART PAGE)
// Hiển thị danh sách quần áo được chọn, cho phép sửa số lượng, điền thông tin giao hàng và gửi đơn hàng lên server.

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { apiCall } from '../services/api';
import { Trash2, ShoppingBag, CreditCard, CheckCircle } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Trạng thái Form giao hàng
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Tự động điền thông tin của user nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  // Phí giao hàng mẫu
  const shippingFee = cartItems.length > 0 ? 20000 : 0;
  const grandTotal = cartTotal + shippingFee;

  // Hàm định dạng tiền VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Hàm xử lý Đặt hàng (Thanh toán)
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!user) {
      alert('Vui lòng Đăng Nhập trước khi tiến hành Thanh Toán!');
      return;
    }

    if (!name || !phone || !address) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Chuẩn bị dữ liệu gửi lên API đặt hàng
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl
        })),
        address,
        phone
      };

      const response = await apiCall('/orders', 'POST', orderData);
      
      // Thành công -> Lưu đơn hàng thành công để hiển thị giao diện, xóa giỏ hàng
      setSuccessOrder(response.order || { id: Date.now(), totalAmount: grandTotal });
      clearCart();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Lỗi hệ thống khi thanh toán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Giao diện khi đặt hàng thành công
  if (successOrder) {
    return (
      <div className="container fade-in" style={{ maxWidth: '600px', textAlign: 'center', padding: '5rem 1.5rem' }}>
        <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Đặt Hàng Thành Công!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Đơn hàng mã số <strong>#{successOrder.id}</strong> đã được lưu lại hệ thống. Chúng tôi sẽ nhanh chóng liên hệ để giao hàng cho bạn!
        </p>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Chi tiết giao hàng:</h4>
          <p>👤 <strong>Họ tên nhận:</strong> {name}</p>
          <p>📞 <strong>Số điện thoại:</strong> {phone}</p>
          <p>📍 <strong>Địa chỉ giao:</strong> {address}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>💰 <strong>Tổng thanh toán:</strong> <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{formatPrice(successOrder.totalAmount || grandTotal)}</span></p>
        </div>
        <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>Tiếp tục mua hàng</Link>
      </div>
    );
  }

  // Giao diện khi giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="container fade-in" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <ShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>Giỏ hàng của bạn đang trống</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Hãy dạo quanh cửa hàng và chọn những bộ quần áo thời thượng nhất nhé!
        </p>
        <Link to="/" className="btn btn-primary">Mua Sắm Ngay</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Giỏ Hàng Của Bạn</h2>

      <div className="cart-layout">
        {/* Cột Trái: Danh sách sản phẩm */}
        <div className="cart-items-panel">
          {cartItems.map((item, idx) => (
            <div key={`${item.productId}-${item.size}`} className="cart-item-row">
              <img src={item.imageUrl} alt={item.name} className="cart-item-thumb" />
              
              <div className="cart-item-details">
                <h4 className="cart-item-name">{item.name}</h4>
                <div className="cart-item-meta">
                  Size: <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>{item.size}</span>
                  Đơn giá: {formatPrice(item.price)}
                </div>
                <div className="cart-item-price">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>

              {/* Tăng giảm số lượng */}
              <div className="cart-item-actions">
                <div className="qty-spinner" style={{ height: '36px' }}>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                    style={{ width: '30px' }}
                  >
                    -
                  </button>
                  <span className="qty-val" style={{ width: '35px' }}>{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                    style={{ width: '30px' }}
                  >
                    +
                  </button>
                </div>

                {/* Nút xóa */}
                <button 
                  onClick={() => removeFromCart(item.productId, item.size)} 
                  className="delete-cart-item-btn"
                  title="Xóa món này"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cột Phải: Form thông tin & hóa đơn tổng */}
        <div>
          {/* Hóa đơn tóm tắt */}
          <div className="cart-summary-panel" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.75rem' }}>Tóm Tắt Đơn Hàng</h3>
            
            <div className="summary-row">
              <span>Tạm tính ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} món)</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>

            <div className="summary-row total">
              <span>Tổng cộng</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Form điền địa chỉ giao hàng */}
          <div className="cart-summary-panel">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.75rem' }}>
              <CreditCard size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> 
              Thông Tin Giao Hàng
            </h3>

            {!user ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Bạn cần đăng nhập để tiến hành thanh toán.
                </p>
                <Link to="/login" className="btn btn-outline" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem', borderRadius: '4px' }}>Đăng Nhập Ngay</Link>
              </div>
            ) : (
              <form onSubmit={handleCheckout}>
                <div className="form-group">
                  <label className="form-label">Tên người nhận</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Địa chỉ nhận hàng</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required 
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                {errorMsg && (
                  <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>❌ {errorMsg}</p>
                )}

                <button 
                  type="submit" 
                  className="btn btn-accent" 
                  disabled={loading}
                  style={{ width: '100%', height: '48px', fontWeight: 700, borderRadius: '4px', fontSize: '1rem' }}
                >
                  {loading ? 'Đang Xử Lý Đặt Hàng...' : 'Đặt Hàng Ngay'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
