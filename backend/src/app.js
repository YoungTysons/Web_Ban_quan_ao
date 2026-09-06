const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ override: true });

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API Hệ thống bán quần áo (ShopQuaAo) đang hoạt động bình thường...');
});

app.use((err, req, res, next) => {
  console.error('Lỗi hệ thống xảy ra:', err.stack);
  res.status(500).json({
    message: 'Đã xảy ra lỗi nội bộ máy chủ, vui lòng thử lại sau!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` Máy chủ Backend đang chạy tại: http://localhost:${PORT}`);
  console.log(` Nhấn Ctrl + C để dừng máy chủ.`);
  console.log(`===================================================`);
});
