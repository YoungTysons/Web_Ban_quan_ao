// file: src/routes/authRoutes.js
// CÁC TUYẾN ĐƯỜNG XÁC THỰC (AUTH ROUTES)
// Khai báo các endpoint liên quan đến Đăng nhập, Đăng ký.

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Tuyến đường Đăng ký tài khoản mới: POST /api/auth/register
router.post('/register', registerUser);

// Tuyến đường Đăng nhập: POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;
