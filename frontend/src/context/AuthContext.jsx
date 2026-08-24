// file: src/context/AuthContext.jsx
// CONTEXT XÁC THỰC NGƯỜI DÙNG (AUTHENTICATION CONTEXT - SKELETON)
// ĐÂY LÀ KHUNG BÀI TẬP DÀNH CHO BẠN TỰ CODE LOGIC QUẢN LÝ TÀI KHOẢN TRONG REACT.

import React, { createContext, useState, useEffect } from 'react';
import { apiCall } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // === BÀI TẬP THỰC HÀNH CỦA BẠN ===
  
  // Nhiệm vụ 1: Đọc thông tin đăng nhập đã lưu trong LocalStorage khi ứng dụng khởi chạy
  useEffect(() => {
    // Gợi ý: 
    // Bước 1: Đọc chuỗi json từ localStorage với khóa 'shopquanao_user'
    const savedUser=localStorage.getItem('shopquanao_user');
    if(savedUser){
      try{
        setUser(JSON.parse(savedUser));
      }catch(error){
        console.error('Lỗi parsing local storage')
      }
    }
    setLoading(false);

    // Bước 2: Nếu tồn tại, phân tích cú pháp (JSON.parse) và set trạng thái `setUser`
    // Bước 3: Đặt trạng thái `setLoading(false)`
    
    // TẠM THỜI: Gắn tài khoản Admin giả lập để giao diện hiển thị được các chức năng quản trị
    const mockUser = {
      id: 2,
      name: 'Trần Admin Đẹp Trai (Khung Bài Tập)',
      email: 'admin@gmail.com',
      role: 'admin',
      token: 'mock-token'
    };
    setUser(mockUser);
    setLoading(false);
  }, []);

  // Nhiệm vụ 2: Hàm xử lý Đăng nhập (login)
  const login = async (email, password) => {
    try {
      // Gợi ý:
      // Bước 1: Gọi API bằng hàm apiCall('/auth/login', 'POST', { email, password })
      const data=await apiCall('/auth/login','POST',{email,password});
       setUser(data);
       localStorage.setItem('shopquanao_user', JSON.stringify(data));
       return { success: true };
      // Bước 2: Nhận kết quả trả về, dùng `setUser(data)` để cập nhật state.
      // Bước 3: Lưu trữ thông tin đăng nhập vào localStorage dưới dạng chuỗi string:
      //         localStorage.setItem('shopquanao_user', JSON.stringify(data))
      // Bước 4: Trả về đối tượng { success: true }
      
      // HÃY VIẾT CODE CỦA BẠN TẠI ĐÂY:
      console.log('Bạn đang gọi hàm login() với:', email, password);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Lỗi đăng nhập!' 
      };
    }
  };

  // Nhiệm vụ 3: Hàm xử lý Đăng ký (register)
  const register = async (name, email, password, role = 'customer', phone = '', address = '') => {
    try {
      // Gợi ý:
      // Bước 1: Gọi API bằng hàm apiCall('/auth/register', 'POST', { name, email, password, role, phone, address })
        const data =await  apiCall('/auth/register','POST',{name,email,password,role,phone,address});
        setUser(data)
        localStorage.setItem('shopquanao_user',JSON.stringify(data));
        console.log('Bạn đang gọi hàm register() với:', name, email);
        return {success:true};
      // Bước 2: Nhận kết quả trả về, cập nhật `setUser(data)`
      // Bước 3: Lưu trữ thông tin đăng nhập vào localStorage bằng localStorage.setItem()
      // Bước 4: Trả về đối tượng { success: true }

      // HÃY VIẾT CODE CỦA BẠN TẠI ĐÂY:
      
      
    } catch (error) {
      return { success: false, message: error.message || 'Lỗi đăng ký!' };
    }
  };

  // Nhiệm vụ 4: Hàm xử lý Đăng xuất (logout)
  const logout = () => {
    // Gợi ý:
    // Bước 1: Gán lại trạng thái `setUser(null)`
    
    // Bước 2: Xóa khóa 'shopquanao_user' khỏi localStorage bằng cách: localStorage.removeItem('shopquanao_user')
    
    // HÃY VIẾT CODE CỦA BẠN TẠI ĐÂY:
    setUser(null);
    localStorage.removeItem('shopquanao_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
