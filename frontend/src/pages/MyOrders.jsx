// file: src/pages/MyOrders.jsx
// TRANG ĐƠN HÀNG CỦA TÔI (USER ORDERS HISTORY PAGE)
// Hiển thị lịch sử mua hàng và trạng thái đơn hàng của người dùng hiện tại.

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiCall } from '../services/api';
import { Package, Clock, Phone, MapPin, DollarSign, Calendar, ArrowRight } from 'lucide-react';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      setLoading(true);
      try {
        const data = await apiCall('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Lỗi tải đơn hàng của tôi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  // Hàm định dạng tiền VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Helper chuyển đổi nhãn trạng thái tiếng Việt
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao thành công';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (!user) return null;

  return (
    <div className="container fade-in" style={{ marginTop: '6rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Đơn Hàng Của Bạn</h2>
          <p style={{ color: 'var(--text-muted)' }}>Theo dõi trạng thái và lịch sử mua sắm của bạn</p>
        </div>
        <Link to="/" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '4px' }}>
          Tiếp tục mua sắm
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Đang tải danh sách đơn hàng...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1.5rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <Package size={60} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem' }}>Bạn chưa có đơn hàng nào</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Hãy chọn ngay cho mình những bộ cánh thời trang mới nhất!</p>
          <Link to="/" className="btn btn-primary">Mua Sắm Ngay</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              
              {/* Header của Đơn hàng */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <span>Mã đơn: <strong>#{order.id}</strong></span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <Calendar size={14} /> {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div>
                  <span className={`badge badge-${order.status}`} style={{ padding: '0.35rem 0.75rem', borderRadius: '50px' }}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Chi tiết sản phẩm trong đơn */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#f1f5f9' }} />
                      <div style={{ flexGrow: 1 }}>
                        <h5 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{item.name}</h5>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Size: <strong>{item.size}</strong> | Số lượng: <strong>{item.quantity}</strong>
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Thông tin giao hàng và tổng tiền */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} /> {order.phone}
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} style={{ flexShrink: 0 }} /> {order.address}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Tổng thanh toán:</span>
                    <strong style={{ fontSize: '1.3rem', color: 'var(--accent)' }}>{formatPrice(order.totalAmount)}</strong>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
