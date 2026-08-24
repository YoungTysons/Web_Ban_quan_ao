// file: src/pages/AdminDashboard.jsx
// TRANG QUẢN TRỊ VIÊN (ADMIN DASHBOARD PAGE)
// Cung cấp giao diện quản lý Sản phẩm (Thêm, Sửa, Xóa) và Quản lý Đơn hàng (Cập nhật trạng thái) cho Admin.

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiCall } from '../services/api';
import { Plus, Edit2, Trash2, Shirt, ShoppingCart, DollarSign, Package, X } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tab đang kích hoạt: 'products' (sản phẩm) hoặc 'orders' (đơn hàng)
  const [activeTab, setActiveTab] = useState('products');

  // Trạng thái Sản phẩm
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Trạng thái Đơn hàng
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Trạng thái Modal (Thêm/Sửa sản phẩm)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Thêm mới, ngược lại = Đang sửa sản phẩm này
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    categoryId: 1,
    sizes: 'S,M,L,XL',
    stockQuantity: 10,
    imageUrl: '',
    description: ''
  });

  // Kiểm soát quyền truy cập: Chỉ cho phép admin vào trang này
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('Quyền truy cập bị từ chối! Chỉ dành cho Quản trị viên (Admin).');
      navigate('/');
    }
  }, [user, navigate]);

  // Load danh sách sản phẩm
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await apiCall('/products');
      setProducts(data);
    } catch (err) {
      console.error('Lỗi tải sản phẩm admin:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Load danh sách đơn hàng
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await apiCall('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Lỗi tải đơn hàng admin:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  // Đóng/Mở Modal và xóa form trắng
  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      categoryId: 1,
      sizes: 'S,M,L,XL',
      stockQuantity: 10,
      imageUrl: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : product.sizes,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      description: product.description || ''
    });
    setIsModalOpen(true);
  };

  // Xử lý Xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await apiCall(`/products/${id}`, 'DELETE');
        alert('Xóa sản phẩm thành công!');
        fetchProducts(); // Tải lại danh sách
      } catch (err) {
        alert(err.message || 'Lỗi khi xóa sản phẩm');
      }
    }
  };

  // Gửi Form Thêm/Sửa sản phẩm
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // Cập nhật sản phẩm
        await apiCall(`/products/${editingProduct.id}`, 'PUT', productForm);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        // Tạo sản phẩm mới
        await apiCall('/products', 'POST', productForm);
        alert('Thêm sản phẩm mới thành công!');
      }
      setIsModalOpen(false);
      fetchProducts(); // Tải lại danh sách
    } catch (err) {
      alert(err.message || 'Lỗi xử lý sản phẩm');
    }
  };

  // Admin Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiCall(`/orders/${orderId}/status`, 'PUT', { status: newStatus });
      alert(`Đã cập nhật trạng thái đơn hàng sang: ${newStatus}`);
      fetchOrders(); // Tải lại danh sách đơn hàng
    } catch (err) {
      alert(err.message || 'Lỗi cập nhật trạng thái');
    }
  };

  // Định dạng hiển thị tiền VNĐ
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Tính toán số liệu thống kê
  const totalRevenue = orders.reduce((acc, order) => {
    // Chỉ tính tiền cho các đơn không bị hủy
    return order.status !== 'cancelled' ? acc + order.totalAmount : acc;
  }, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="container fade-in" style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Trang Quản Trị Hệ Thống</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Chào mừng quản trị viên: {user.name}</p>

      <div className="admin-layout">
        {/* Thanh Sidebar bên trái */}
        <aside className="admin-sidebar">
          <h4 className="admin-sidebar-title">Menu quản lý</h4>
          <ul className="admin-sidebar-menu">
            <li>
              <button 
                className={`admin-sidebar-btn ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <Shirt size={18} /> Quản Lý Sản Phẩm
              </button>
            </li>
            <li>
              <button 
                className={`admin-sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingCart size={18} /> Quản Lý Đơn Hàng ({pendingOrders})
              </button>
            </li>
          </ul>
        </aside>

        {/* Nội dung bên phải */}
        <main style={{ paddingBottom: 0 }}>
          {/* TAB 1: QUẢN LÝ SẢN PHẨM */}
          {activeTab === 'products' && (
            <div>
              {/* Grid Thống Kê Sản Phẩm */}
              <div className="admin-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper"><Shirt style={{ color: 'var(--primary)' }} /></div>
                  <div>
                    <div className="stat-num">{products.length}</div>
                    <div className="stat-label">Tổng sản phẩm</div>
                  </div>
                </div>
                <div className="stat-card gold">
                  <div className="stat-icon-wrapper"><Package style={{ color: 'var(--accent)' }} /></div>
                  <div>
                    <div className="stat-num">
                      {products.filter(p => p.stockQuantity < 10).length}
                    </div>
                    <div className="stat-label">Sắp hết hàng (&lt; 10 cái)</div>
                  </div>
                </div>
              </div>

              {/* Header điều khiển */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Danh Sách Sản Phẩm</h3>
                <button onClick={openAddModal} className="btn btn-accent" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderRadius: '4px' }}>
                  <Plus size={16} /> Thêm Sản Phẩm Mới
                </button>
              </div>

              {/* Bảng sản phẩm */}
              {productsLoading ? (
                <div>Đang tải sản phẩm...</div>
              ) : (
                <div className="admin-data-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Phân loại</th>
                        <th>Giá bán</th>
                        <th>Tồn kho</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id}>
                          <td><img src={p.imageUrl} alt={p.name} className="table-product-thumb" /></td>
                          <td><strong style={{ display: 'block' }}>{p.name}</strong><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sizes: {Array.isArray(p.sizes) ? p.sizes.join(',') : p.sizes}</span></td>
                          <td>
                            {p.categoryId === 1 && 'Áo Thun'}
                            {p.categoryId === 2 && 'Quần Jean'}
                            {p.categoryId === 3 && 'Áo Khoác & Hoodie'}
                            {p.categoryId === 4 && 'Sơ Mi'}
                          </td>
                          <td><strong style={{ color: 'var(--primary)' }}>{formatPrice(p.price)}</strong></td>
                          <td>
                            <span style={{ fontWeight: 600, color: p.stockQuantity < 10 ? 'var(--danger)' : 'inherit' }}>
                              {p.stockQuantity} món
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button onClick={() => openEditModal(p)} className="table-action-btn edit" title="Sửa thông tin"><Edit2 size={14} /></button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="table-action-btn delete" title="Xóa"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUẢN LÝ ĐƠN HÀNG */}
          {activeTab === 'orders' && (
            <div>
              {/* Grid Thống Kê Đơn Hàng */}
              <div className="admin-stats-grid">
                <div className="stat-card green">
                  <div className="stat-icon-wrapper"><DollarSign style={{ color: 'var(--success)' }} /></div>
                  <div>
                    <div className="stat-num">{formatPrice(totalRevenue)}</div>
                    <div className="stat-label">Doanh thu (Không tính Đơn Hủy)</div>
                  </div>
                </div>
                <div className="stat-card blue">
                  <div className="stat-icon-wrapper"><ShoppingCart style={{ color: '#0284c7' }} /></div>
                  <div>
                    <div className="stat-num">{orders.length}</div>
                    <div className="stat-label">Tổng số đơn hàng</div>
                  </div>
                </div>
                <div className="stat-card gold">
                  <div className="stat-icon-wrapper"><Package style={{ color: 'var(--accent)' }} /></div>
                  <div>
                    <div className="stat-num">{pendingOrders}</div>
                    <div className="stat-label">Đơn chờ duyệt</div>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Danh Sách Đơn Hàng Khách Hàng</h3>

              {ordersLoading ? (
                <div>Đang tải đơn hàng...</div>
              ) : (
                <div className="admin-data-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Thông tin giao hàng</th>
                        <th>Sản phẩm đặt mua</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái đơn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td><strong>#{order.id}</strong></td>
                          <td style={{ fontSize: '0.85rem' }}>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <div style={{ fontSize: '0.85rem' }}>
                              <p>👤 <strong>{order.name || 'Khách Hàng'}</strong></p>
                              <p>📞 {order.phone}</p>
                              <p style={{ color: 'var(--text-muted)' }}>📍 {order.address}</p>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              {order.items && order.items.map((item, idx) => (
                                <div key={idx}>
                                  👕 {item.name} (Size: {item.size}) x <strong>{item.quantity}</strong>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td><strong style={{ color: 'var(--accent)' }}>{formatPrice(order.totalAmount)}</strong></td>
                          <td>
                            {/* Dropdown thay đổi trạng thái đơn hàng */}
                            <select 
                              value={order.status} 
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`badge badge-${order.status}`}
                              style={{ border: '1px solid #cbd5e1', cursor: 'pointer', fontFamily: 'inherit', padding: '0.25rem 0.5rem' }}
                            >
                              <option value="pending">Chờ Duyệt (Pending)</option>
                              <option value="processing">Đang Xử Lý (Processing)</option>
                              <option value="shipped">Đang Giao (Shipped)</option>
                              <option value="delivered">Đã Giao (Delivered)</option>
                              <option value="cancelled">Đã Hủy (Cancelled)</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL THÊM / SỬA SẢN PHẨM */}
      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card fade-in">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                {editingProduct ? `Sửa thông tin sản phẩm: #${editingProduct.id}` : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Tên sản phẩm *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={productForm.name} 
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Giá bán (VNĐ) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={productForm.price} 
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Danh mục sản phẩm</label>
                  <select 
                    className="form-input" 
                    value={productForm.categoryId} 
                    onChange={(e) => setProductForm({ ...productForm, categoryId: parseInt(e.target.value) })}
                  >
                    <option value={1}>Áo Thun</option>
                    <option value={2}>Quần Jean</option>
                    <option value={3}>Áo Khoác & Hoodie</option>
                    <option value={4}>Sơ Mi</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Kích thước (Ngăn cách bởi dấu phẩy) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={productForm.sizes} 
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                    placeholder="S,M,L,XL"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số lượng tồn kho *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={productForm.stockQuantity} 
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Đường dẫn ảnh sản phẩm (URL)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={productForm.imageUrl} 
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..." 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả sản phẩm</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  value={productForm.description} 
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Vải cotton 100%, dày dặn, bền màu..."
                  style={{ resize: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', borderRadius: '4px' }}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.6rem', borderRadius: '4px' }}>Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
