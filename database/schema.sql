-- file: database/schema.sql
-- BẢNG THIẾT KẾ CƠ SỞ DỮ LIỆU CHO WEB BÁN QUẦN ÁO (SHOPQUANAO) - T-SQL (SQL SERVER)

-- Xóa bảng cũ nếu tồn tại để tránh xung đột (xóa theo thứ tự phụ thuộc)
IF OBJECT_ID('order_items', 'U') IS NOT NULL DROP TABLE order_items;
IF OBJECT_ID('orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('products', 'U') IS NOT NULL DROP TABLE products;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
IF OBJECT_ID('categories', 'U') IS NOT NULL DROP TABLE categories;

-- 1. Tạo bảng Danh mục sản phẩm (Categories)
CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,              -- IDENTITY(1,1) là AUTO_INCREMENT trong SQL Server
    name NVARCHAR(255) NOT NULL,                   -- NVARCHAR hỗ trợ lưu Unicode tiếng Việt tốt hơn VARCHAR
    description NVARCHAR(MAX),                     -- NVARCHAR(MAX) thay cho TEXT trong SQL Server
    created_at DATETIME DEFAULT GETDATE()          -- GETDATE() trả về thời gian hiện tại
);

-- 2. Tạo bảng Người dùng (Users)
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) DEFAULT 'customer',          -- 'customer' hoặc 'admin'
    phone NVARCHAR(20),
    address NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE()
);

-- 3. Tạo bảng Sản phẩm (Products)
CREATE TABLE products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT,
    name NVARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description NVARCHAR(MAX),
    sizes NVARCHAR(100) DEFAULT 'S,M,L,XL',
    stock_quantity INT DEFAULT 0,
    image_url NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Tạo bảng Đơn hàng (Orders)
CREATE TABLE orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    order_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(50) DEFAULT 'pending',         -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    total_amount DECIMAL(10, 2) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Tạo bảng Chi tiết đơn hàng (Order Items)
CREATE TABLE order_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    size NVARCHAR(10) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
