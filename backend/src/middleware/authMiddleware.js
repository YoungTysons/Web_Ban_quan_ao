const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'shop_quan_ao_secret_key_123_456_789';
      const decoded = jwt.verify(token, secret);

      const pool = await poolPromise;
      if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

      const result = await pool.request()
        .input('id', sql.Int, decoded.id)
        .query('SELECT id, name, email, role, phone, address FROM users WHERE id = @id');

      const user = result.recordset[0];
      if (!user) {
        return res.status(401).json({ message: 'Không tìm thấy người dùng này trên hệ thống!' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Lỗi xác thực Token:', error.message);
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Không tìm thấy token xác thực!' });
  }
};

module.exports = { protect };
