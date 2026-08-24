// file: src/controllers/orderController.js
// BỘ ĐIỀU KHIỂN ĐƠN HÀNG (ORDER CONTROLLER - SKELETON)
// ĐÂY LÀ KHUNG BÀI TẬP DÀNH CHO BẠN TỰ CODE LOGIC QUẢN LÝ ĐƠN HÀNG.

const { orders, products } = require('../models/mockDb');

// @desc    Tạo đơn hàng mới (Thanh toán giỏ hàng)
// @route   POST /api/orders
// @access  Private (Cần đăng nhập)
const createOrder = async (req, res) => {
  try {
    // === BÀI TẬP THỰC HÀNH CỦA BẠN ===
    // Bước 1: Lấy các dữ liệu đặt hàng từ req.body (items, address, phone)
    // Bước 2: Kiểm tra dữ liệu đầu vào. Giỏ hàng `items` có trống không? Địa chỉ, số điện thoại nhận có rỗng không? (Nếu có trả về status 400)
    // Bước 3: Duyệt qua từng sản phẩm trong giỏ hàng gửi lên:
    //         - Tìm sản phẩm trong mảng `products`.
    //         - Kiểm tra xem số lượng đặt mua có lớn hơn số lượng tồn kho (`stockQuantity`) của sản phẩm không.
    //         - Nếu đủ tồn kho, trừ số lượng tồn kho của sản phẩm đó trong mảng `products`.
    //         - Tính tổng tiền cho toàn bộ đơn hàng (cộng giá bán * số lượng mua). Có thể cộng thêm phí ship 20,000đ.
    // Bước 4: Tạo đối tượng đơn hàng mới lưu vào mảng `orders` với id tự tăng, userId lấy từ req.user.id (được gán bởi authMiddleware), trạng thái đơn mặc định là 'pending'.
    // Bước 5: Trả về trạng thái 201 kèm thông tin đơn hàng vừa đặt dưới dạng JSON.

    // CODE MẪU TRẢ VỀ TẠM THỜI (HÃY SỬA LẠI THEO CÁC BƯỚC TRÊN):
    res.status(201).json({ message: 'Đang chờ bạn tự code logic đặt hàng...' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống khi thanh toán' });
  }
};

// @desc    Lấy danh sách lịch sử đơn hàng của người dùng hiện tại
// @route   GET /api/orders/myorders
// @access  Private (Cần đăng nhập)
const getMyOrders = async (req, res) => {
  try {
    // === BÀI TẬP THỰC HÀNH CỦA BẠN ===
    // Bước 1: Lọc ra các đơn hàng trong mảng `orders` có `userId` khớp với `req.user.id`
    // Bước 2: Sắp xếp danh sách đơn hàng vừa lọc sao cho đơn mới nhất lên đầu
    // Bước 3: Trả về danh sách đơn hàng dưới dạng JSON

    // CODE MẪU TRẢ VỀ TẠM THỜI (HÃY SỬA LẠI THEO CÁC BƯỚC TRÊN):
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tải đơn hàng cá nhân' });
  }
};

// @desc    Lấy tất cả đơn hàng hệ thống (Chỉ dành cho Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    // === BÀI TẬP THỰC HÀNH CỦA BẠN ===
    // Bước 1: Lấy toàn bộ đơn hàng từ mảng `orders`
    // Bước 2: Sắp xếp theo ngày đặt hàng mới nhất lên đầu
    // Bước 3: Trả về danh sách đơn hàng dưới dạng JSON

    // CODE MẪU TRẢ VỀ TẠM THỜI (HÃY SỬA LẠI THEO CÁC BƯỚC TRÊN):
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tải danh sách đơn hàng' });
  }
};

// @desc    Cập nhật trạng thái đơn hàng (Chỉ dành cho Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    // === BÀI TẬP THỰC HÀNH CỦA BẠN ===
    // Bước 1: Lấy `id` đơn hàng từ req.params và trạng thái mới (`status`) từ req.body
    // Bước 2: Kiểm tra xem trạng thái mới gửi lên có nằm trong danh sách hợp lệ không: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    // Bước 3: Tìm đơn hàng trong mảng `orders` theo ID
    // Bước 4: Nếu thấy đơn hàng, cập nhật thuộc tính `status` bằng trạng thái mới. Trả về thông báo thành công và đơn hàng cập nhật.
    // Bước 5: Nếu không thấy, trả về lỗi 404.

    // CODE MẪU TRẢ VỀ TẠM THỜI (HÃY SỬA LẠI THEO CÁC BƯỚC TRÊN):
    res.json({ message: 'Đang chờ bạn tự code logic cập nhật đơn hàng...' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
