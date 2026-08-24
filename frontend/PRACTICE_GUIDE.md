# HƯỚNG DẪN THỰC HÀNH TỰ CODE FRONTEND (REACT)

Chào mừng bạn đến với lộ trình thực hành Frontend sử dụng React!
Để bạn tự học cách xử lý dữ liệu và tương tác API, tôi đã dọn sạch các logic xử lý bên trong của các Context Provider và API client, chỉ giữ lại giao diện (HTML/CSS) và khung hàm trống kèm chỉ dẫn chi tiết.

---

## 📌 LỘ TRÌNH THỰC HÀNH 4 BÀI TẬP LỚN

### ⚡ BÀI TẬP 1: Tự code gọi API chung (`api.js`)
Mở file [api.js](file:///c:/PRJ/shopquanao/frontend/src/services/api.js) để viết hàm `apiCall`:
* **Mục tiêu**: Tự viết hàm thực hiện request HTTP gửi lên Node.js Backend.
* **Gợi ý**:
  1. Sử dụng hàm `fetch()` mặc định của trình duyệt để gọi đến địa chỉ: `http://localhost:5000/api` + `endpoint`.
  2. Đính kèm token xác thực lấy từ hàm `getAuthHeaders()` vào header `Authorization` của request.
  3. Đọc dữ liệu JSON trả về, kiểm tra `response.ok`. Nếu có lỗi, ném ra lỗi để hiển thị lên UI.

---

### 🧱 BÀI TẬP 2: Tự code Đăng Ký, Đăng Nhập & Lưu Phiên Đăng Nhập (`AuthContext.jsx`)
Mở file [AuthContext.jsx](file:///c:/PRJ/shopquanao/frontend/src/context/AuthContext.jsx):
1. **Hàm Đăng Nhập (`login`)**:
   - Sử dụng hàm `apiCall('/auth/login', 'POST', { email, password })`.
   - Cập nhật state `setUser` khi thành công.
   - Lưu thông tin người dùng kèm token vào LocalStorage để duy trì phiên khi F5 trang: `localStorage.setItem('shopquanao_user', JSON.stringify(data))`.
2. **Hàm Đăng Ký (`register`)**:
   - Gọi API bằng cách dùng `apiCall('/auth/register', 'POST', { name, email, password, role, phone, address })`.
3. **Đọc phiên khi ứng dụng mở ra**:
   - Dùng `useEffect` đọc localStorage với key `'shopquanao_user'` để phục hồi thông tin người dùng vào state `user`.

---

### 🛒 BÀI TẬP 3: Tự code Quản Lý Giỏ Hàng (`CartContext.jsx`)
Mở file [CartContext.jsx](file:///c:/PRJ/shopquanao/frontend/src/context/CartContext.jsx) để thực hành xử lý mảng Javascript:
1. **`addToCart`**:
   - Tìm kiếm sản phẩm trong mảng `cartItems` xem đã tồn tại trùng ID và SIZE chưa.
   - Nếu đã có: Tăng `quantity` của phần tử đó.
   - Nếu chưa có: Thêm phần tử mới dạng `{ productId, name, price, imageUrl, size, quantity }` vào mảng.
2. **`removeFromCart`**: Dùng hàm `filter` lọc bỏ sản phẩm trùng ID và SIZE được chọn.
3. **`updateQuantity`**: Cập nhật số lượng mới. Nếu số lượng giảm về `<= 0`, tự động xóa món đó khỏi giỏ.
4. **`cartCount` và `cartTotal`**: Sử dụng `cartItems.reduce()` để tính tổng số lượng món đồ và tổng tiền tương ứng.
5. **Đồng bộ hóa**: Lưu và khôi phục mảng giỏ hàng qua LocalStorage với key `'shopquanao_cart'`.

---

### 🗺️ BÀI TẬP 4: Tự thiết kế một Trang mới (Ví dụ: Profile Page)
* **Yêu cầu**: Hãy tạo một trang thông tin cá nhân của người dùng đã đăng nhập.
* **Các bước tự làm**:
  1. Tạo tệp [Profile.jsx](file:///c:/PRJ/shopquanao/frontend/src/pages/Profile.jsx) mới.
  2. Dùng `useContext(AuthContext)` để lấy thông tin `user` hiện tại (Tên, Email, Điện thoại, Địa chỉ).
  3. Đăng ký tuyến đường định tuyến mới trong file [App.jsx](file:///c:/PRJ/shopquanao/frontend/src/App.jsx):
     ```jsx
     <Route path="/profile" element={<Profile />} />
     ```
  4. Hiển thị link dẫn tới trang `/profile` trên thanh menu [Navbar.jsx](file:///c:/PRJ/shopquanao/frontend/src/components/Navbar.jsx) khi người dùng đã đăng nhập thành công.

Chúc bạn thực hành React thành công và làm chủ được các luồng truyền dữ liệu toàn cục!
