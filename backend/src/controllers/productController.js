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
    const sizesString = Array.isArray(sizes) ? sizes.join(',') : (sizes || 'S,M,L,XL');
    const result = await pool.request()
      .input('category_id', sql.Int, parseInt(categoryId))
      .input('name', sql.NVarChar, name)
      .input('price', sql.Decimal(10, 2), parseFloat(price))
      .input('description', sql.NVarChar, description || '')
      .input('sizes', sql.NVarChar, sizesString)
      .input('stock_quantity', sql.Int, parseInt(stockQuantity))
      .input('image_url', sql.NVarChar, imageUrl || '')
      .query(`
        INSERT INTO products (category_id, name, price, description, sizes, stock_quantity, image_url)
        OUTPUT Inserted.*
        VALUES (@category_id, @name, @price, @description, @sizes, @stock_quantity, @image_url)
      `);
    const newProduct = result.recordset[0];
    if (!newProduct) {
      return res.status(400).json({ message: 'Không thể tạo sản phẩm!' });
    }
    res.status(201).json(formatProduct(newProduct));
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
    const sizesString = Array.isArray(sizes) ? sizes.join(',') : (sizes || 'S,M,L,XL');
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('category_id', sql.Int, parseInt(categoryId))
      .input('name', sql.NVarChar, name)
      .input('price', sql.Decimal(10, 2), parseFloat(price))
      .input('description', sql.NVarChar, description || '')
      .input('sizes', sql.NVarChar, sizesString)
      .input('stock_quantity', sql.Int, parseInt(stockQuantity))
      .input('image_url', sql.NVarChar, imageUrl || '')
      .query(`
        UPDATE products 
        SET category_id = @category_id, name = @name, price = @price, description = @description, sizes = @sizes, stock_quantity = @stock_quantity, image_url = @image_url 
        OUTPUT Inserted.*
        WHERE id = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm cần cập nhật!' });
    }

    const updatedProduct = formatProduct(result.recordset[0]);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. XÓA SẢN PHẨM
// Route: DELETE /api/products/:id
// 5. XÓA SẢN PHẨM
// Route: DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // 1. Thực thi câu lệnh DELETE với mệnh đề OUTPUT Deleted.id
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM products OUTPUT Deleted.id WHERE id = @id');

    // 2. Nếu không có dòng nào bị xóa (ID không tồn tại trong DB)
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm này để xóa!' });
    }

    // 3. Xóa thành công
    res.json({ message: 'Xóa sản phẩm thành công!', id: parseInt(id) });
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
