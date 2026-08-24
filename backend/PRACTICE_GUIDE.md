# HƯỚNG DẪN THỰC HÀNH TỰ CODE BACKEND (NODE.JS + EXPRESS)

Chào mừng bạn đến với lộ trình thực hành lập trình Backend Node.js!
Để giúp bạn tự tay lập trình và làm quen với các khái niệm cốt lõi, tôi đã dọn sạch các logic xử lý bên trong và để lại các khung hàm (skeletons) kèm comment hướng dẫn từng bước.

---

## 📌 LỘ TRÌNH THỰC HÀNH 5 BÀI TẬP LỚN

### ⚡ BÀI TẬP 1: Tự code Đăng Ký và Đăng Nhập (`authController.js`)
Mở file [authController.js](file:///c:/PRJ/shopquanao/backend/src/controllers/authController.js) để viết code:
1. **Đăng ký người dùng (`registerUser`)**:
   - Nhận dữ liệu từ `req.body`.
   - Sử dụng thư viện `bcryptjs` để băm mật khẩu:
     ```javascript
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);
     ```
   - Tạo đối tượng người dùng mới, gán ID tự tăng và push vào mảng `users` của `mockDb.js`.
2. **Đăng nhập người dùng (`loginUser`)**:
   - Tìm user theo email.
   - So sánh mật khẩu đã mã hóa bằng: `await bcrypt.compare(password, user.password)`.
   - Trả về token định danh bằng hàm `generateToken(user.id)` đã viết sẵn.

---

### 📝 BÀI TẬP 2: Tự code Quản Lý Sản Phẩm CRUD (`productController.js`)
Mở file [productController.js](file:///c:/PRJ/shopquanao/backend/src/controllers/productController.js) để viết các API:
1. **`getProducts`**: Lọc mảng sản phẩm theo từ khóa tìm kiếm (`req.query.search`) và danh mục (`req.query.categoryId`).
2. **`getProductById`**: Tìm kiếm phần tử trong mảng theo ID và xử lý lỗi `404` nếu không tồn tại.
3. **`createProduct`**: Lấy thông tin từ body, tạo sản phẩm mới có ID tăng dần và đẩy vào mảng `products`.
4. **`updateProduct`**: Tìm kiếm phần tử và ghi đè thuộc tính bằng dữ liệu mới gửi lên.
5. **`deleteProduct`**: Sử dụng hàm `products.splice(index, 1)` để xóa sản phẩm khỏi mảng.

---

### 🛡️ BÀI TẬP 3: Tự code Middleware Bảo Mật (`authMiddleware.js` & `adminMiddleware.js`)
Mở các file tương ứng trong thư mục `src/middleware/` để hoàn thiện bảo mật:
1. **`protect` (Xác thực JWT)**:
   - Đọc header `req.headers.authorization`.
   - Cắt chuỗi để lấy phần token đứng sau từ khóa `"Bearer "`.
   - Sử dụng `jwt.verify(token, secret)` để giải mã lấy ra ID người dùng.
   - Tìm người dùng trong database và gán vào thuộc tính `req.user` để các hàm sau sử dụng.
2. **`adminOnly` (Phân quyền Admin)**:
   - Kiểm tra `req.user` đã được middleware trước gán chưa.
   - So sánh `req.user.role === 'admin'`. Nếu không phải admin, trả về lỗi status `403` và chặn yêu cầu.

---

### 🛒 BÀI TẬP 4: Tự code Đặt Hàng & Kiểm Tra Tồn Kho (`orderController.js`)
Mở file [orderController.js](file:///c:/PRJ/shopquanao/backend/src/controllers/orderController.js):
1. **Tạo đơn hàng (`createOrder`)**:
   - Nhận mảng giỏ hàng `items` và địa chỉ giao hàng.
   - Với mỗi sản phẩm trong giỏ, bạn tìm trong mảng `products` để kiểm tra số lượng tồn kho (`stockQuantity`).
   - Nếu còn đủ hàng, trừ đi tồn kho tương ứng: `product.stockQuantity -= item.quantity`.
   - Tính tổng tiền đơn hàng và push vào mảng `orders`.
2. **Cập nhật đơn hàng (`updateOrderStatus`)**:
   - Cho phép Admin thay đổi trạng thái đơn hàng: `pending` -> `processing` -> `shipped` -> `delivered` -> `cancelled`.

---

### 🗄️ BÀI TẬP 5: Kết Nối Cơ Sở Dữ Liệu SQL Server Thật
Khi đã làm chủ được các luồng xử lý mảng giả lập trên, bạn hãy thay thế việc tương tác với `mockDb.js` bằng câu lệnh SQL thực tế.
1. Cài đặt thư viện: `npm install mssql`
2. Tạo tệp kết nối cơ sở dữ liệu `src/config/db.js`.
3. Sửa các hàm trong controller để chạy câu lệnh truy vấn thực tế, ví dụ:
   ```javascript
   const pool = await poolPromise;
   const result = await pool.request().query('SELECT * FROM products');
   res.json(result.recordset);
   ```

Chúc bạn thực hành thành công! Việc tự tay viết những dòng code chức năng này sẽ giúp bạn hiểu sâu sắc nguyên lý hoạt động của Node.js Backend!
