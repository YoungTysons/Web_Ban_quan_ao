# LỘ TRÌNH THỰC HÀNH TỪNG BƯỚC (ROADMAP)
## DỰ ÁN WEB BÁN QUẦN ÁO (SHOPQUANAO)

Tài liệu này hướng dẫn bạn trình tự sửa từng file, từng giai đoạn và cách kiểm tra (xem) dữ liệu ở đâu để dễ học nhất. Hãy làm theo 4 giai đoạn dưới đây:

---

## GIAI ĐOẠN 1: Làm chủ Frontend cục bộ (Chưa cần chạy Backend)
*Mục tiêu: Học cách quản lý giỏ hàng và dữ liệu tạm thời trên trình duyệt.*

### 🛠️ Các file cần sửa theo thứ tự:
1. **[CartContext.jsx](file:///c:/PRJ/shopquanao/frontend/src/context/CartContext.jsx)**: 
   * Viết logic cho hàm `addToCart`, `removeFromCart`, `updateQuantity`, và tính toán `cartCount`, `cartTotal`.
   * Sử dụng `localStorage.setItem('shopquanao_cart', JSON.stringify(cartItems))` để lưu lại.
2. **[AuthContext.jsx](file:///c:/PRJ/shopquanao/frontend/src/context/AuthContext.jsx)**:
   * Viết logic cho hàm `logout` (xóa dữ liệu đăng nhập).

### 🔍 Cách xem và kiểm tra dữ liệu ở đâu?
* **Trên Giao Diện (UI)**: Mở trình duyệt (`http://localhost:5173`), click nút "Xem chi tiết" sản phẩm -> chọn size -> bấm "Thêm vào giỏ".
* **Xem trong Bộ nhớ Trình duyệt (LocalStorage)**:
  1. Nhấn **F12** trên bàn phím -> Chọn tab **Application** (hoặc **Storage** tùy trình duyệt).
  2. Ở menu trái, chọn **Local Storage** -> chọn `http://localhost:5173`.
  3. Bạn sẽ thấy dòng khóa `shopquanao_cart` tự động sinh ra và cập nhật giá trị mảng sản phẩm mỗi khi bạn thêm/sửa/xóa sản phẩm trên giao diện!

---

## GIAI ĐOẠN 2: Lập trình Backend (Chạy thử bằng Postman/Thunder Client)
*Mục tiêu: Xây dựng các hàm xử lý API ở máy chủ độc lập.*

### 🛠️ Các file cần sửa theo thứ tự:
1. **[authController.js](file:///c:/PRJ/shopquanao/backend/src/controllers/authController.js)**: Viết hàm đăng ký và đăng nhập (sử dụng mảng `users` trong `mockDb.js`).
2. **[authMiddleware.js](file:///c:/PRJ/shopquanao/backend/src/middleware/authMiddleware.js)**: Viết middleware giải mã token JWT để xác minh người dùng.
3. **[productController.js](file:///c:/PRJ/shopquanao/backend/src/controllers/productController.js)**: Viết CRUD cho sản phẩm (lọc mảng, thêm, sửa, xóa).
4. **[orderController.js](file:///c:/PRJ/shopquanao/backend/src/controllers/orderController.js)**: Viết logic trừ kho tồn, tính tiền đơn hàng và push vào mảng đơn hàng.

### 🔍 Cách xem và kiểm tra dữ liệu ở đâu?
* **Sử dụng Postman / Thunder Client**: 
  * Tạo request `POST` gửi tới `http://localhost:5000/api/auth/register` với JSON body để đăng ký tài khoản mới. Xem mã token trả về ở phần Body kết quả.
* **Xem trong Node.js Console (Terminal)**:
  * Trong các file Controller, bạn hãy đặt câu lệnh `console.log(users)` hoặc `console.log(req.body)`.
  * Dữ liệu sẽ được in ra trực tiếp tại **Terminal đang chạy Backend** (`npm run dev` ở cổng 5000) mỗi khi có request gửi tới.

---

## GIAI ĐOẠN 3: Kết nối hai đầu React 🔗 Express (Chạy thử toàn hệ thống)
*Mục tiêu: Cho phép giao diện React gửi yêu cầu mạng lên Node.js Backend thật.*

### 🛠️ Các file cần sửa theo thứ tự:
1. **[api.js](file:///c:/PRJ/shopquanao/frontend/src/services/api.js)**: 
   * Viết hàm `apiCall` sử dụng lệnh `fetch()` gửi lên cổng `5000` của Backend. Đính kèm Header `Authorization` chứa token.
2. **[AuthContext.jsx](file:///c:/PRJ/shopquanao/frontend/src/context/AuthContext.jsx)**:
   * Sửa hàm `login` và `register` gọi qua hàm `apiCall` thay vì dùng dữ liệu giả lập.

### 🔍 Cách xem và kiểm tra dữ liệu ở đâu?
* **Mở song song cả 2 terminal**: Backend chạy (cổng 5000), Frontend chạy (cổng 5173).
* **Kiểm tra luồng mạng (Network)**:
  1. Nhấn **F12** trên trình duyệt -> Chọn tab **Network** (Mạng).
  2. Thực hiện hành động Đăng nhập trên web.
  3. Bạn sẽ thấy xuất hiện một yêu cầu mạng tên là `login`. Click vào đó -> Chọn tab **Headers** (để xem tham số truyền đi) và tab **Response** (để xem JSON trả về từ Node.js server).

---

## GIAI ĐOẠN 4: Chuyển dữ liệu từ RAM lên SQL Server thực tế
*Mục tiêu: Đảm bảo dữ liệu được lưu vĩnh viễn vào các bảng SQL vật lý.*

### 🛠️ Các file cần sửa theo thứ tự:
1. **Khởi chạy CSDL**: Chạy file [schema.sql](file:///c:/PRJ/shopquanao/database/schema.sql) và [mock_data.sql](file:///c:/PRJ/shopquanao/database/mock_data.sql) trong SQL Server của bạn để tạo bảng.
2. **[db.js] (Tạo mới trong `backend/src/config/db.js`)**: Cấu hình thông số kết nối SQL Server (User, Password, Server, Database) bằng thư viện `mssql`.
3. **Sửa các Controller**: Thay đổi toàn bộ thao tác mảng trong [authController.js](file:///c:/PRJ/shopquanao/backend/src/controllers/authController.js), [productController.js](file:///c:/PRJ/shopquanao/backend/src/controllers/productController.js), và [orderController.js](file:///c:/PRJ/shopquanao/backend/src/controllers/orderController.js) thành câu lệnh `pool.request().query("SELECT / INSERT...")`.

### 🔍 Cách xem và kiểm tra dữ liệu ở đâu?
* **Sử dụng SSMS (SQL Server Management Studio)**:
  * Kết nối vào SQL Server -> Mở Database `shopquanao` -> Mở New Query.
  * Chạy lệnh `SELECT * FROM users` hoặc `SELECT * FROM products` để xem trực tiếp các dòng dữ liệu được chèn và cập nhật khi thao tác trên giao diện web!
