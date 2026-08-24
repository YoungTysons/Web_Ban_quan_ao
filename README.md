# DỰ ÁN THỰC HÀNH FULL-STACK: WEB BÁN QUẦN ÁO (SHOPQUANAO)

Chào mừng bạn đến với dự án mẫu **Web Bán Quần Áo (ShopQuaAo)** được thiết kế tối ưu dành riêng cho việc học tập Full-stack: **React (Frontend) & Node.js/Express (Backend)**.

Dự án đã chia sẵn cấu trúc thành hai thư mục riêng biệt: `frontend` và `backend`. 
Đồng thời, cả hai bên đều được tích hợp tài liệu hướng dẫn thực hành từng bước (`PRACTICE_GUIDE.md`) viết hoàn toàn bằng **tiếng Việt**.

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN

- 📁 `database/`: Chứa file định nghĩa cấu trúc bảng CSDL (`schema.sql`) và dữ liệu mẫu (`mock_data.sql`).
- 📁 `backend/`: Máy chủ Node.js & Express sử dụng mô hình MVC, có bộ nhớ giả lập tạm thời.
- 📁 `frontend/`: Ứng dụng Single Page Application viết bằng React (Vite) và tạo kiểu bằng Vanilla CSS.

---

## ⚡ HƯỚNG DẪN KHỞI CHẠY NHANH

### 1. Khởi chạy Backend (Node.js + Express)
Mở terminal tại thư mục gốc của dự án và chạy các lệnh:
```bash
cd backend
npm install
npm run dev
```
*Máy chủ backend sẽ chạy tại địa chỉ: `http://localhost:5000`*

### 2. Khởi chạy Frontend (React + Vite)
Mở một terminal mới song song và chạy các lệnh:
```bash
cd frontend
npm install
npm run dev
```
*Ứng dụng frontend sẽ chạy tại địa chỉ: `http://localhost:5173` (hoặc cổng khác hiển thị trên terminal)*

---

## 💡 THÔNG TIN TÀI KHOẢN KHÁCH HÀNG & ADMIN (DEMO)

Để chạy thử các giao diện Đăng nhập, Đăng ký và Admin Dashboard, bạn có thể sử dụng dữ liệu mẫu có sẵn dưới đây (hoặc đăng ký tài khoản mới trực tiếp từ giao diện):

* **👤 Tài khoản Khách hàng (Customer)**:
  * Email: `customer@gmail.com`
  * Mật khẩu: `123456`
* **🛡️ Tài khoản Quản trị viên (Admin)**:
  * Email: `admin@gmail.com`
  * Mật khẩu: `admin123`

---

## 📖 LÀM THẾ NÀO ĐỂ TỰ HỌC VÀ THỰC HÀNH?

Chúng tôi đã viết sẵn hướng dẫn chi tiết dành riêng cho bạn ở 2 vị trí:
1. **Thực hành phía Backend**: Xem tài liệu [backend/PRACTICE_GUIDE.md](file:///c:/PRJ/shopquanao/backend/PRACTICE_GUIDE.md) để học cách viết Route, Controller, Middleware và hướng dẫn kết nối database SQL thực tế.
2. **Thực hành phía Frontend**: Xem tài liệu [frontend/PRACTICE_GUIDE.md](file:///c:/PRJ/shopquanao/frontend/PRACTICE_GUIDE.md) để học cách tạo Component, chia trang, quản lý trạng thái giỏ hàng (Context) và kết nối API.

Chúc bạn có những trải nghiệm học tập và lập trình thú vị với dự án này!
