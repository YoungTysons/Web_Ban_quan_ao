// file: src/middleware/adminMiddleware.js
// MIDDLEWARE PHÂN QUYỀN QUẢN TRỊ VIÊN (ADMIN AUTHORIZATION - SKELETON)
// ĐÂY LÀ KHUNG BÀI TẬP DÀNH CHO BẠN TỰ CODE LOGIC PHÂN QUYỀN ADMIN.

const adminOnly = (req, res, next) => {
  // Bước 1 & 2: Kiểm tra xem req.user có tồn tại và role có phải 'admin' không
  if (req.user && req.user.role === 'admin') {
    // Bước 3: Nếu đúng là admin, đi tiếp
    next();
  } else {
    // Bước 4: Trả về trạng thái 403 khi không phải admin
    res.status(403).json({ message: 'Truy cập bị từ chối! Chức năng này chỉ dành cho quản trị viên.' });
  }
};

module.exports = { adminOnly };
