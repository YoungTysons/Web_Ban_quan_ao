// file: src/controllers/userController.js
// BỘ ĐIỀU KHIỂN QUẢN LÝ NHÂN SỰ (USER/PERSONNEL CONTROLLER)
// Xử lý các logic liên quan đến danh sách tài khoản, cập nhật phân quyền và xóa tài khoản từ CSDL.

const { sql, poolPromise } = require('../config/db');

// 1. Lấy toàn bộ danh sách người dùng (Chỉ Admin)
// Route: GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    const result = await pool.request().query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.phone, 
        u.address, 
        u.created_at,
        (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as orders_count
      FROM users u
      ORDER BY u.role DESC, u.name ASC
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Cập nhật vai trò của người dùng (Chỉ Admin)
// Route: PUT /api/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || (role !== 'admin' && role !== 'customer')) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ!' });
    }

    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // Kiểm tra người dùng tồn tại
    const userCheck = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM users WHERE id = @id');

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng này!' });
    }

    // Không cho phép tự hạ quyền của chính mình
    if (parseInt(id) === req.user.id && role === 'customer') {
      return res.status(400).json({ message: 'Bạn không thể tự hạ quyền của chính mình!' });
    }

    await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('role', sql.NVarChar, role)
      .query('UPDATE users SET role = @role WHERE id = @id');

    res.json({ message: 'Cập nhật vai trò người dùng thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Xóa tài khoản người dùng (Chỉ Admin)
// Route: DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // Kiểm tra người dùng tồn tại
    const userCheck = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM users WHERE id = @id');

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng này!' });
    }

    // Không cho phép tự xóa tài khoản của chính mình
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Bạn không thể tự xóa tài khoản của chính mình!' });
    }

    // Kiểm tra xem người dùng đã từng đặt đơn hàng nào chưa
    const orderCheck = await pool.request()
      .input('user_id', sql.Int, parseInt(id))
      .query('SELECT COUNT(*) as count FROM orders WHERE user_id = @user_id');

    if (orderCheck.recordset[0].count > 0) {
      return res.status(400).json({ message: 'Không thể xóa tài khoản này vì họ đã có đơn hàng trên hệ thống!' });
    }

    await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM users WHERE id = @id');

    res.json({ message: 'Xóa tài khoản người dùng thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser
};
