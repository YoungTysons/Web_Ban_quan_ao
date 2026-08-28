// file: src/controllers/orderController.js
const { sql, poolPromise } = require('../config/db');

// @desc    Tạo đơn hàng mới (Thanh toán giỏ hàng)
// @route   POST /api/orders
// @access  Private (Cần đăng nhập)
const createOrder = async (req, res) => {
  try {
    const { items, address, phone } = req.body;
    const userId = req.user.id; // Lấy từ authMiddleware protect

    // Bước 1 & 2: Kiểm tra dữ liệu đầu vào
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống, vui lòng thêm sản phẩm!' });
    }
    if (!address || !phone) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ số điện thoại và địa chỉ nhận hàng!' });
    }

    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // Bước 3: Kiểm tra tồn kho và tính tổng tiền
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const productResult = await pool.request()
        .input('productId', sql.Int, item.productId)
        .query('SELECT * FROM products WHERE id = @productId');
      
      const product = productResult.recordset[0];
      if (!product) {
        return res.status(404).json({ message: `Không tìm thấy sản phẩm có ID: ${item.productId}` });
      }

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Sản phẩm "${product.name}" (size ${item.size}) không đủ tồn kho! Còn lại: ${product.stock_quantity}, yêu cầu: ${item.quantity}.` 
        });
      }

      totalAmount += Number(product.price) * item.quantity;
      verifiedItems.push({
        productId: product.id,
        size: item.size,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Cộng thêm phí ship 20,000đ
    const shippingFee = 20000;
    const grandTotal = totalAmount + shippingFee;

    // Bước 4: Chèn đơn hàng mới vào bảng orders
    const orderResult = await pool.request()
      .input('user_id', sql.Int, userId)
      .input('total_amount', sql.Decimal(10, 2), grandTotal)
      .input('address', sql.NVarChar, address)
      .input('phone', sql.NVarChar, phone)
      .query(`
        INSERT INTO orders (user_id, total_amount, address, phone, status)
        OUTPUT Inserted.*
        VALUES (@user_id, @total_amount, @address, @phone, 'pending')
      `);

    const newOrder = orderResult.recordset[0];

    // Chèn chi tiết đơn hàng (order_items) và trừ kho hàng (products)
    for (const item of verifiedItems) {
      await pool.request()
        .input('order_id', sql.Int, newOrder.id)
        .input('product_id', sql.Int, item.productId)
        .input('size', sql.NVarChar, item.size)
        .input('quantity', sql.Int, item.quantity)
        .input('price', sql.Decimal(10, 2), item.price)
        .query(`
          INSERT INTO order_items (order_id, product_id, size, quantity, price)
          VALUES (@order_id, @product_id, @size, @quantity, @price)
        `);

      await pool.request()
        .input('productId', sql.Int, item.productId)
        .input('qty', sql.Int, item.quantity)
        .query('UPDATE products SET stock_quantity = stock_quantity - @qty WHERE id = @productId');
    }

    // Bước 5: Trả về kết quả
    res.status(201).json({
      message: 'Đặt hàng thành công!',
      order: {
        id: newOrder.id,
        userId: newOrder.user_id,
        orderDate: newOrder.order_date,
        status: newOrder.status,
        totalAmount: Number(newOrder.total_amount),
        address: newOrder.address,
        phone: newOrder.phone,
        items: verifiedItems
      }
    });

  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error.message);
    res.status(500).json({ message: 'Lỗi hệ thống khi thanh toán: ' + error.message });
  }
};

// @desc    Lấy danh sách lịch sử đơn hàng của người dùng hiện tại
// @route   GET /api/orders/myorders
// @access  Private (Cần đăng nhập)
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // Bước 1 & 2: Lấy đơn hàng cá nhân, sắp xếp mới nhất lên đầu
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM orders WHERE user_id = @userId ORDER BY order_date DESC');

    const ordersList = [];
    for (const order of result.recordset) {
      const itemsResult = await pool.request()
        .input('orderId', sql.Int, order.id)
        .query(`
          SELECT oi.*, p.name, p.image_url 
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = @orderId
        `);

      ordersList.push({
        id: order.id,
        userId: order.user_id,
        orderDate: order.order_date,
        status: order.status,
        totalAmount: Number(order.total_amount),
        address: order.address,
        phone: order.phone,
        items: itemsResult.recordset.map(item => ({
          productId: item.product_id,
          size: item.size,
          quantity: item.quantity,
          price: Number(item.price),
          name: item.name,
          imageUrl: item.image_url
        }))
      });
    }

    // Bước 3: Trả về kết quả
    res.json(ordersList);
  } catch (error) {
    console.error('Lỗi tải đơn hàng cá nhân:', error.message);
    res.status(500).json({ message: 'Lỗi tải đơn hàng cá nhân: ' + error.message });
  }
};

// @desc    Lấy tất cả đơn hàng hệ thống (Chỉ dành cho Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // Bước 1 & 2: Lấy toàn bộ đơn hàng kèm thông tin người đặt, sắp xếp mới nhất lên đầu
    const result = await pool.request()
      .query(`
        SELECT o.*, u.name as user_name 
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.order_date DESC
      `);

    const ordersList = [];
    for (const order of result.recordset) {
      const itemsResult = await pool.request()
        .input('orderId', sql.Int, order.id)
        .query(`
          SELECT oi.*, p.name, p.image_url 
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = @orderId
        `);

      ordersList.push({
        id: order.id,
        userId: order.user_id,
        userName: order.user_name,
        orderDate: order.order_date,
        status: order.status,
        totalAmount: Number(order.total_amount),
        address: order.address,
        phone: order.phone,
        items: itemsResult.recordset.map(item => ({
          productId: item.product_id,
          size: item.size,
          quantity: item.quantity,
          price: Number(item.price),
          name: item.name,
          imageUrl: item.image_url
        }))
      });
    }

    // Bước 3: Trả về kết quả
    res.json(ordersList);
  } catch (error) {
    console.error('Lỗi tải danh sách đơn hàng:', error.message);
    res.status(500).json({ message: 'Lỗi tải danh sách đơn hàng: ' + error.message });
  }
};

// @desc    Cập nhật trạng thái đơn hàng (Chỉ dành cho Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Bước 2: Kiểm tra trạng thái hợp lệ
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ!' });
    }

    const pool = await poolPromise;
    if (!pool) return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });

    // Bước 3 & 4: Tìm đơn hàng và cập nhật status
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('status', sql.NVarChar, status)
      .query('UPDATE orders SET status = @status OUTPUT Inserted.* WHERE id = @id');

    const updatedOrder = result.recordset[0];
    if (!updatedOrder) {
      // Bước 5: Nếu không thấy, trả về lỗi 404
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng cần cập nhật!' });
    }

    res.json({
      message: 'Cập nhật trạng thái đơn hàng thành công!',
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        totalAmount: Number(updatedOrder.total_amount),
        address: updatedOrder.address,
        phone: updatedOrder.phone
      }
    });
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái đơn:', error.message);
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn: ' + error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
