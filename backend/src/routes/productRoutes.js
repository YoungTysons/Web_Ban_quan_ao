// file: src/routes/productRoutes.js
// CÁC TUYẾN ĐƯỜNG SẢN PHẨM (PRODUCT ROUTES)
// Định nghĩa các URL cho chức năng tìm kiếm sản phẩm và quản lý sản phẩm.

const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');

// Import các middleware xác thực để bảo vệ quyền Admin
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// 1. Tuyến đường công khai (Ai cũng có thể truy cập để xem hàng)
// Lấy danh sách sản phẩm: GET /api/products
router.get('/', getProducts);

// Lấy chi tiết một sản phẩm: GET /api/products/:id
router.get('/:id', getProductById);

// 2. Tuyến đường riêng tư (Chỉ dành cho Admin đã đăng nhập)
// Thêm sản phẩm mới: POST /api/products
router.post('/', protect, adminOnly, createProduct);

// Cập nhật sản phẩm: PUT /api/products/:id
router.put('/:id', protect, adminOnly, updateProduct);

// Xóa sản phẩm: DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
