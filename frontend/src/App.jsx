// file: src/App.jsx
// TỔNG HỢP CẤU TRÚC ỨNG DỤNG (MAIN APP LAYOUT & ROUTING)
// Đây là file trung tâm của React App, cấu hình định tuyến (Routing) 
// và cung cấp các Context (Auth, Cart) bao bọc toàn hệ thống.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import các Context cung cấp trạng thái toàn cục
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Import các Component dùng chung (Header, Footer)
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import các Trang hiển thị (Pages)
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import MyOrders from './pages/MyOrders';

// Import CSS
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            {/* Thanh điều hướng Navbar dùng chung ở mọi trang */}
            <Navbar />
            
            {/* Vùng hiển thị nội dung trang thay đổi theo URL */}
            <main>
              <Routes>
                {/* Các tuyến đường công khai */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/orders" element={<MyOrders />} />
                
                {/* Tuyến đường quản lý (Admin Dashboard) */}
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>

            {/* Chân trang Footer dùng chung */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
