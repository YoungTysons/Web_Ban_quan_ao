-- file: database/mock_data.sql
-- DỮ LIỆU MẪU ĐỂ CHẠY THỬ (MOCK DATA) - SQL SERVER

-- 1. Chèn dữ liệu danh mục sản phẩm (Categories)
SET IDENTITY_INSERT categories ON;
INSERT INTO categories (id, name, description) VALUES
(1, N'Áo Thun', N'Các mẫu áo thun cotton 100% thoáng mát, form rộng unisex'),
(2, N'Quần Jean', N'Quần jean nam nữ ống suông, skinny, rách gối cá tính'),
(3, N'Áo Khoác & Hoodie', N'Áo hoodie nỉ bông ấm áp, áo khoác gió chống nước nhẹ'),
(4, N'Sơ Mi', N'Sơ mi tay dài, tay ngắn phong cách lịch lãm, công sở hoặc Hàn Quốc');
SET IDENTITY_INSERT categories OFF;

-- 2. Chèn dữ liệu người dùng mẫu (Users)
-- Tài khoản đăng nhập demo:
-- - Khách hàng: customer@gmail.com / mật khẩu gốc: 123456 (dưới đây là mật khẩu đã mã hóa bằng bcrypt)
-- - Quản trị viên: admin@gmail.com / mật khẩu gốc: admin123 (dưới đây là mật khẩu đã mã hóa bằng bcrypt)
SET IDENTITY_INSERT users ON;
INSERT INTO users (id, name, email, password, role, phone, address) VALUES
(1, N'Nguyễn Văn Khách', N'customer@gmail.com', N'$2a$10$f/d27jGzR6VjEa3dJ5tQ.Ou.Q12Pz5JqPq0.v/91k.v1X.G/K5Fye', N'customer', N'0912345678', N'123 Đường Ba Đình, Quận 1, TP. HCM'),
(2, N'Trần Admin Đẹp Trai', N'admin@gmail.com', N'$2a$10$wOaA6e4f3/k/X5oF/d1Fhe/9J1m0P7L32ZJqN/rG7b7b7b7b7b7b', N'admin', N'0987654321', N'456 Đường Lê Lợi, Quận Hoàn Kiếm, Hà Nội');
SET IDENTITY_INSERT users OFF;

-- 3. Chèn dữ liệu sản phẩm quần áo (Products)
SET IDENTITY_INSERT products ON;
INSERT INTO products (id, category_id, name, price, description, sizes, stock_quantity, image_url) VALUES
(1, 1, N'Áo Thun Basic Trắng Unisex', 150000.00, N'Áo thun basic 100% cotton co giãn 4 chiều, dày dặn, thấm hút mồ hôi tốt. Phù hợp cho cả nam và nữ.', N'S,M,L,XL', 50, N'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'),
(2, 1, N'Áo Thun Local Brand Oversize Đen', 220000.00, N'Áo thun đen in hình đồ họa phong cách streetwear cực ngầu, form rộng chất lừ.', N'M,L,XL', 40, N'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'),
(3, 2, N'Quần Jean Ống Rộng Xanh Nhạt', 350000.00, N'Quần jean denim mềm, ống rộng thời thượng. Dễ phối với áo thun hay sơ mi.', N'S,M,L', 30, N'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'),
(4, 3, N'Áo Hoodie Nỉ Bông Xám Tro', 320000.00, N'Áo hoodie nỉ bông dày dặn ấm áp, nón to 2 lớp đứng form cực đẹp.', N'M,L,XL', 25, N'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'),
(5, 4, N'Áo Sơ Mi Hàn Quốc Trắng Cổ V', 280000.00, N'Áo sơ mi lụa mềm mịn, chống nhăn tốt. Mang lại vẻ ngoài trẻ trung thanh lịch.', N'S,M,L,XL', 35, N'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500');
SET IDENTITY_INSERT products OFF;

-- 4. Chèn dữ liệu đơn hàng mẫu (Orders)
SET IDENTITY_INSERT orders ON;
INSERT INTO orders (id, user_id, status, total_amount, address, phone) VALUES
(1, 1, N'pending', 520000.00, N'123 Đường Ba Đình, Quận 1, TP. HCM', N'0912345678');
SET IDENTITY_INSERT orders OFF;

-- 5. Chi tiết sản phẩm trong đơn hàng số 1 (Order Items)
SET IDENTITY_INSERT order_items ON;
INSERT INTO order_items (id, order_id, product_id, size, quantity, price) VALUES
(1, 1, 1, N'L', 1, 150000.00),
(2, 1, 3, N'M', 1, 350000.00);
SET IDENTITY_INSERT order_items OFF;
