// file: src/middleware/authMiddleware.js
// MIDDLEWARE XÁC THỰC NGƯỜI DÙNG (JWT AUTHENTICATION - SKELETON)
// ĐÂY LÀ KHUNG BÀI TẬP DÀNH CHO BẠN TỰ CODE LOGIC XÁC THỰC TOKEN.

const jwt = require('jsonwebtoken');
const { users } = require('../models/mockDb');

const protect = (req, res, next) => {
  let token;

  // === BÀI TẬP THỰC HÀNH CỦA BẠN ===
  // Bước 1: Kiểm tra xem header "authorization" có tồn tại trong `req.headers` và có bắt đầu bằng chữ "Bearer" không.
  // Bước 2: Nếu hợp lệ, tiến hành tách chuỗi lấy phần token (Gợi ý: req.headers.authorization.split(' ')[1])
  // Bước 3: Dùng `jwt.verify(token, secret)` để giải mã token lấy ra ID người dùng (Gợi ý: secret là process.env.JWT_SECRET hoặc chuỗi khóa bí mật mặc định)
  // Bước 4: Tìm người dùng trong mảng `users` theo ID vừa giải mã. Nếu không thấy, trả về status 401.
  // Bước 5: Gắn thông tin người dùng tìm thấy (ngoại trừ mật khẩu) vào thuộc tính `req.user` (Ví dụ: req.user = { id, name, email, role... })
  // Bước 6: Gọi hàm `next()` để chuyển yêu cầu tới middleware/controller tiếp theo.
  // Bước 7: Trong khối catch, nếu có lỗi xác thực token, trả về status 401.
  // Bước 8: Nếu không tìm thấy token nào gửi lên, trả về lỗi status 401.

  // CODE MẪU BỎ QUA XÁC THỰC TẠM THỜI (HÃY SỬA LẠI THEO CÁC BƯỚC TRÊN):
  // (Mặc định gắn tạm tài khoản Admin số 2 để hệ thống không bị lỗi lúc chạy giao diện)
  const mockAdmin = users.find(u => u.id === 2);
  req.user = mockAdmin;
  next(); 
};

module.exports = { protect };
