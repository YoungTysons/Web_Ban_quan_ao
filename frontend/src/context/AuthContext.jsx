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
    const savedUser = localStorage.getItem('shopquanao_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Lỗi parsing local storage:', error);
      }
    }
    setLoading(false);
  }, []);

  // Nhiệm vụ 2: Hàm xử lý Đăng nhập (login)
  const login = async (email, password) => {
    try {
      const data = await apiCall('/auth/login', 'POST', { email, password });
      setUser(data);
      localStorage.setItem('shopquanao_user', JSON.stringify(data));
      console.log('Đăng nhập thành công với email:', email);
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
      const data = await apiCall('/auth/register', 'POST', { name, email, password, role, phone, address });
      setUser(data);
      localStorage.setItem('shopquanao_user', JSON.stringify(data));
      console.log('Đăng ký thành công với email:', email);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Lỗi đăng ký!' };
    }
  };

  // Nhiệm vụ 4: Hàm xử lý Đăng xuất (logout)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopquanao_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
