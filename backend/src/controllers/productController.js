// file: src/controllers/productController.js
// BÀI TẬP THỰC HÀNH: QUẢN LÝ SẢN PHẨM VỚI SQL SERVER (CRUD)
const { sql, poolPromise } = require('../config/db');

// Helper định dạng dữ liệu sản phẩm từ SQL Server (snake_case, sizes dạng chuỗi)
// thành dữ liệu Frontend React yêu cầu (camelCase, sizes dạng mảng)
const formatProduct = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    categoryId: p.category_id,
    name: p.name,
    price: Number(p.price),
    description: p.description,
    sizes: p.sizes ? (typeof p.sizes === 'string' ? p.sizes.split(',') : p.sizes) : [],
    stockQuantity: p.stock_quantity,
    imageUrl: p.image_url,
    createdAt: p.created_at
  }
  // === BÀI TẬP CỦA BẠN (Helper format) ===
  // Hãy trả về đối tượng sản phẩm với các thuộc tính đã được chuẩn hóa:
  // - id: p.id
  // - categoryId: p.category_id
  // - name: p.name
  // - price: Chuyển p.price sang kiểu số thực bằng Number(p.price)
  // - description: p.description
  // - sizes: Nếu p.sizes là chuỗi, tách thành mảng bằng dấu phẩy: p.sizes.split(',')
  //          Nếu p.sizes không có giá trị hoặc trống, trả về mảng rỗng []
  // - stockQuantity: p.stock_quantity
  // - imageUrl: p.image_url
  // - createdAt: p.created_at

  return {
    // TODO: Viết các thuộc tính ở đây...
  };
};

// 1. LẤY DANH SÁCH SẢN PHẨM (Có bộ lọc tìm kiếm và danh mục)
// Route: GET /api/products?search=...&categoryId=...
const getProducts = async (req, res) => {
  try {
    const { search, categoryId } = req.query;
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    let queryStr = 'SELECT * FROM products WHERE 1=1';
    const request = pool.request();

    if (search) {
      request.input('search', sql.NVarChar, `%${search}%`);
      queryStr += ' AND name LIKE @search';
    }

    if (categoryId) {
      request.input('categoryId', sql.Int, parseInt(categoryId));
      queryStr += ' AND category_id = @categoryId';
    }

    const result = await request.query(queryStr);

    // Định dạng danh sách sản phẩm trước khi gửi về cho React
    const formattedProducts = result.recordset.map(formatProduct);
    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. LẤY CHI TIẾT 1 SẢN PHẨM THEO ID
// Route: GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM products WHERE id = @id');

    const product = result.recordset[0];
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm này!' });
    }

    res.json(formatProduct(product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 3. TẠO MỚI SẢN PHẨM (Chỉ dành cho Admin)
// Route: POST /api/products
const createProduct = async (req, res) => {
  try {
    const { categoryId, name, price, description, sizes, stockQuantity, imageUrl } = req.body;
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // === BÀI TẬP CỦA BẠN (Tạo mới sản phẩm) ===
    // Bước 1: Viết câu lệnh INSERT INTO products (category_id, name, price, description, sizes, stock_quantity, image_url)
    //         Kết hợp với mệnh đề 'OUTPUT Inserted.*' để lấy đối tượng vừa insert thành công
    //         Lưu ý: tham số `sizes` nếu client gửi lên dạng Mảng thì hãy chuyển thành chuỗi bằng `.join(',')` trước khi gán .input()
    // Bước 2: Dùng .input() để gán các tham số tương ứng một cách an toàn
    // Bước 3: Thực thi truy vấn, lấy bản ghi đầu tiên, gọi formatProduct(...) và trả về res.status(201).json(...)

    res.status(201).json({ message: 'Chưa triển khai...' }); // TODO: Thay thế
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. CẬP NHẬT SẢN PHẨM
// Route: PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, name, price, description, sizes, stockQuantity, imageUrl } = req.body;
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // === BÀI TẬP CỦA BẠN (Cập nhật) ===
    // Bước 1: Viết câu lệnh UPDATE products SET ... OUTPUT Inserted.* WHERE id = @id
    //         (Nhớ chuyển đổi sizes thành chuỗi bằng .join(',') nếu sizes là Mảng)
    // Bước 2: Dùng .input() truyền tất cả các trường mới và 'id' của sản phẩm cần sửa
    // Bước 3: Thực thi truy vấn, nếu result.recordset.length === 0 tức là sản phẩm không tồn tại -> Trả về lỗi 404
    // Bước 4: Nếu sửa thành công, gọi formatProduct(result.recordset[0]) và trả về res.json(...)

    res.json({ message: 'Chưa triển khai...' }); // TODO: Thay thế
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. XÓA SẢN PHẨM
// Route: DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // === BÀI TẬP CỦA BẠN (Xóa sản phẩm) ===
    // Bước 1: Viết câu lệnh DELETE FROM products OUTPUT Deleted.id WHERE id = @id
    // Bước 2: Dùng .input() để gán tham số 'id'
    // Bước 3: Thực thi truy vấn, nếu không tìm thấy bản ghi nào bị xóa (length === 0) -> Trả về lỗi 404
    // Bước 4: Nếu xóa thành công, trả về res.json({ message: 'Xóa sản phẩm thành công!' })

    res.json({ message: 'Chưa triển khai...' }); // TODO: Thay thế
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
