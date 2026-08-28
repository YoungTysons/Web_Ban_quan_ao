// file: src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  // Bước 1: Kiểm tra xem header "authorization" có tồn tại và bắt đầu bằng "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Bước 2: Tách lấy phần token
      token = req.headers.authorization.split(' ')[1];

      // Bước 3: Giải mã token lấy ra ID người dùng
      const secret = process.env.JWT_SECRET || 'shop_quan_ao_secret_key_123_456_789';
      const decoded = jwt.verify(token, secret);

      // Bước 4 & 5: Tìm người dùng trong SQL Server theo ID vừa giải mã
      const pool = await poolPromise;
      if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

      const result = await pool.request()
        .input('id', sql.Int, decoded.id)
        .query('SELECT id, name, email, role, phone, address FROM users WHERE id = @id');

      const user = result.recordset[0];
      if (!user) {
        return res.status(401).json({ message: 'Không tìm thấy người dùng này trên hệ thống!' });
      }

      // Gắn thông tin người dùng vào thuộc tính req.user
      req.user = user;
      
      // Bước 6: Cho phép đi tiếp
      return next();
    } catch (error) {
      console.error('Lỗi xác thực Token:', error.message);
      // Bước 7: Trả về lỗi 401 khi token sai hoặc hết hạn
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }
  }

  // Bước 8: Trả về lỗi khi không tìm thấy token nào gửi lên
  if (!token) {
    return res.status(401).json({ message: 'Không tìm thấy token xác thực!' });
  }
};

module.exports = { protect };
