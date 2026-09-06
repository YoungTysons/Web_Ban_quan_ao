const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/db');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'shop_quan_ao_secret_key_123_456_789';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ Tên, Email và Mật khẩu!' });
    }

    const pool = await poolPromise;
    if (!pool) {
      return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });
    }

    const userCheck = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'Email này đã được đăng ký sử dụng!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập Email và Mật khẩu!' });
    }

    const pool = await poolPromise;
    if (!pool) {
      return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });
    }

    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    const user = result.recordset[0];

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
