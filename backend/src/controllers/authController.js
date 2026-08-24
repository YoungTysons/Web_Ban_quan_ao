// file: src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');

// Hàm tạo JWT Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'shop_quan_ao_secret_key_123_456_789';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  });
};

// @desc    Đăng ký tài khoản người dùng mới (SQL Server)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Bước 1: Kiểm tra xem các trường bắt buộc có rỗng không
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ Tên, Email và Mật khẩu!' });
    }

    // Bước 2: Lấy Connection Pool kết nối tới SQL Server
    const pool = await poolPromise;
    if (!pool) {
      return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });
    }

    // Bước 3: Kiểm tra xem email đã tồn tại trong SQL Server chưa (Sử dụng tham số @email để chống SQL Injection)
    const userCheck = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'Email này đã được đăng ký sử dụng!' });
    }

    // Bước 4: Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Bước 5: Chèn người dùng mới vào bảng SQL Server và sử dụng OUTPUT để lấy trực tiếp dòng dữ liệu vừa chèn
    const insertResult = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('role', sql.NVarChar, role || 'customer')
      .input('phone', sql.NVarChar, phone || '')
      .input('address', sql.NVarChar, address || '')
      .query(`
        INSERT INTO users (name, email, password, role, phone, address)
        OUTPUT Inserted.id, Inserted.name, Inserted.email, Inserted.role, Inserted.phone, Inserted.address
        VALUES (@name, @email, @password, @role, @phone, @address)
      `);

    const newUser = insertResult.recordset[0];

    // Bước 6: Trả về thông tin đăng nhập thành công kèm Token
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
      token: generateToken(newUser.id)
    });

  } catch (error) {
    console.error('Lỗi khi đăng ký:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đăng nhập người dùng (SQL Server)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập Email và Mật khẩu!' });
    }

    // Bước 1: Lấy Connection Pool kết nối tới SQL Server
    const pool = await poolPromise;
    if (!pool) {
      return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });
    }

    // Bước 2: Tìm kiếm người dùng theo Email
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    const user = result.recordset[0];

    // Bước 3: Kiểm tra xem user có tồn tại và so sánh mật khẩu đã băm
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác!' });
    }

  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};
