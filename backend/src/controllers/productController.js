const { sql, poolPromise } = require('../config/db');

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
  };
};

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
    const formattedProducts = result.recordset.map(formatProduct);
    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM products OUTPUT Deleted.id WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm này để xóa!' });
    }

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
