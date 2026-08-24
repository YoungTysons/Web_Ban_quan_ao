// file: src/app.js
// FILE ENTRY POINT - KHỞI CHẠY MÁY CHỦ BACKEND (EXPRESS APP)
// Đây là file chính liên kết tất cả các thành phần: Router, Middleware, Controller.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Tải các biến môi trường từ file .env (ghi đè biến hệ thống trùng tên nếu có)
dotenv.config({ override: true });

// Khởi tạo ứng dụng Express
const app = express();

// 2. Cấu hình các Middlewares chung
// CORS cho phép ứng dụng frontend React (ở cổng khác, ví dụ: 5173) gọi được các API này
app.use(cors({
  origin: '*', // Trong thực tế nên để domain cụ thể của frontend để bảo mật hơn
  credentials: true
}));

// Cho phép Express đọc và hiểu dữ liệu JSON từ body của request gửi lên
app.use(express.json());

// Cho phép đọc dữ liệu từ form-urlencoded (nếu có)
app.use(express.urlencoded({ extended: true }));

// 3. Khai báo các Tuyến đường (Routes) của API
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Gắn các tuyến đường vào các tiền tố URL tương ứng
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Tuyến đường mặc định kiểm tra máy chủ hoạt động (GET /)
app.get('/', (req, res) => {
  res.send('API Hệ thống bán quần áo (ShopQuaAo) đang hoạt động bình thường...');
});

// 4. Middleware xử lý lỗi tập trung (Error Handling Middleware)
// Nếu có bất cứ lỗi nào phát sinh trong quá trình chạy, nó sẽ được chuyển tới đây để xử lý
app.use((err, req, res, next) => {
  console.error('Lỗi hệ thống xảy ra:', err.stack);
  res.status(500).json({
    message: 'Đã xảy ra lỗi nội bộ máy chủ, vui lòng thử lại sau!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 5. Khởi chạy máy chủ lắng nghe ở cổng được cấu hình (Mặc định là 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` Máy chủ Backend đang chạy tại: http://localhost:${PORT}`);
  console.log(` Nhấn Ctrl + C để dừng máy chủ.`);
  console.log(`===================================================`);
});
