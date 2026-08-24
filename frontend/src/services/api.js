// file: src/services/api.js
// DỊCH VỤ GỌI API HỆ THỐNG (API CLIENT SERVICE - SKELETON)
// ĐÂY LÀ KHUNG BÀI TẬP DÀNH CHO BẠN TỰ CODE LOGIC GỌI HTTP REQUESTS.

const API_BASE_URL = 'http://localhost:5000/api';

// Hàm helper để đọc token đã lưu của user từ localStorage (Học cách đính kèm token vào header)
const getAuthHeaders = () => {
  const userJson = localStorage.getItem('shopquanao_user');
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      if (user && user.token) {
        return { 'Authorization': `Bearer ${user.token}` };
      }
    } catch (e) {
      console.error('Lỗi đọc token:', e);
    }
  }
  return {};
};

/**
 * Hàm chung để gọi API tới Backend
 * @param {string} endpoint - Đường dẫn con (ví dụ: '/products', '/auth/login')
 * @param {string} method - Phương thức HTTP (GET, POST, PUT, DELETE)
 * @param {object|null} body - Dữ liệu gửi đi dưới dạng JSON (nếu có)
 */
export const apiCall = async (endpoint, method = 'GET', body = null) => {
  // === BÀI TẬP THỰC HÀNH CỦA BẠN ===
  // Bước 1: Xây dựng cấu hình Options cho fetch():
  //         - method: method
  //         - headers: bao gồm 'Content-Type': 'application/json' và các token bảo mật lấy từ getAuthHeaders()
  //         - body: nếu có dữ liệu truyền vào, dùng JSON.stringify(body) để chuyển đổi.
  // Bước 2: Gọi fetch(`${API_BASE_URL}${endpoint}`, options)
  // Bước 3: Đọc phản hồi (response.json()). Nếu response.ok = false, ném ra lỗi (throw new Error) với thông báo từ máy chủ.
  // Bước 4: Trả về dữ liệu JSON nhận được.
  
  // CODE THỬ NGHIỆM BAN ĐẦU (HÃY SỬA LẠI THEO CÁC BƯỚC TRÊN):
  console.log(`Đang gọi API: ${method} ${API_BASE_URL}${endpoint}`);
  try{
    const options={
      method:method,
      headers:{
        'content-type':'application/json',...getAuthHeaders()

      }
    }
    if(body){
      options.body=JSON.stringify(body);
    }
    const response=await fetch(`${API_BASE_URL}${endpoint}`,options);
    const data =await response.json();
    if(!response.ok){
      throw new Error(data.message || 'Đã xảy ra lỗi kết nối mạng!');
    }
    return data;
  }catch(error){
    console.error('')
  }
  // Trả về dữ liệu cứng tạm thời cho giao diện Trang chủ hoạt động khi bạn chưa viết code fetch:
  if (endpoint.startsWith('/products')) {
    return [
      {
        id: 1,
        name: "Áo Thun Cotton Unisex Oversize (Bài Tập)",
        price: 180000,
        categoryId: 1,
        sizes: ["S", "M", "L"],
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60",
        stockQuantity: 15,
        description: "Mẫu áo thun unisex chất liệu cotton 100% cực mát."
      },
      {
        id: 2,
        name: "Quần Jean Ống Suông Unisex (Bài Tập)",
        price: 350000,
        categoryId: 2,
        sizes: ["M", "L", "XL"],
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60",
        stockQuantity: 8,
        description: "Quần jean ống rộng phong cách streetwear năng động."
      }
    ];
  }

  return {};
};
