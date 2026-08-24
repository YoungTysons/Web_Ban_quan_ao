// file: src/middleware/adminMiddleware.js
// MIDDLEWARE PHÂN QUYỀN QUẢN TRỊ VIÊN (ADMIN AUTHORIZATION - SKELETON)
// ĐÂY LÀ KHUNG BÀI TẬP DÀNH CHO BẠN TỰ CODE LOGIC PHÂN QUYỀN ADMIN.

const adminOnly = (req, res, next) => {
  // === BÀI TẬP THỰC HÀNH CỦA BẠN ===
  // Bước 1: Kiểm tra xem `req.user` có tồn tại hay không (phải chạy middleware protect trước)
  // Bước 2: Kiểm tra trường `req.user.role` có phải là 'admin' hay không.
  // Bước 3: Nếu đúng là admin, gọi hàm `next()` để đi tiếp tới controller.
  // Bước 4: Nếu không phải admin, trả về trạng thái 403 (Forbidden) kèm thông tin từ chối truy cập.

  // CODE MẪU BỎ QUA KIỂM TRA TẠM THỜI (HÃY SỬA LẠI THEO CÁC BƯỚC TRÊN):
  next(); 
};

module.exports = { adminOnly };
