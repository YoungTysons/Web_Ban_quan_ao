// file: src/routes/orderRoutes.js
// CÁC TUYẾN ĐƯỜNG ĐƠN HÀNG (ORDER ROUTES)
// Định nghĩa các URL cho chức năng đặt hàng, xem lịch sử đặt hàng và quản lý đơn hàng.

const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');

// Import middleware xác thực
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Tất cả các tuyến đường đơn hàng đều yêu cầu Đăng nhập (protect)

// Đặt hàng (Thanh toán giỏ hàng): POST /api/orders
router.post('/', protect, createOrder);

// Khách xem lịch sử đơn hàng cá nhân: GET /api/orders/myorders
router.get('/myorders', protect, getMyOrders);

// Admin xem tất cả đơn hàng hệ thống: GET /api/orders
router.get('/', protect, adminOnly, getAllOrders);

// Admin cập nhật trạng thái đơn hàng (duyệt, giao hàng, hủy): PUT /api/orders/:id/status
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
