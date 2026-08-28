// file: src/routes/userRoutes.js
// CÁC TUYẾN ĐƯỜNG QUẢN LÝ NHÂN SỰ (USER ROUTES)

const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  updateUserRole, 
  deleteUser 
} = require('../controllers/userController');

// Import middleware xác thực và phân quyền
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Áp dụng bảo vệ cho tất cả các tuyến đường này
router.use(protect);
router.use(adminOnly);

// Lấy danh sách nhân sự: GET /api/users
router.get('/', getAllUsers);

// Thay đổi phân quyền: PUT /api/users/:id/role
router.put('/:id/role', updateUserRole);

// Xóa tài khoản nhân sự: DELETE /api/users/:id
router.delete('/:id', deleteUser);

module.exports = router;
