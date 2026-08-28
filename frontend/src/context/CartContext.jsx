// file: src/context/CartContext.jsx
// CONTEXT GIỎ HÀNG (CART CONTEXT - SKELETON)
// ĐÂY LÀ KHUNG BÀI TẬP DÀNH CHO BẠN TỰ CODE LOGIC QUẢN LÝ GIỎ HÀNG TRONG REACT.

import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // === BÀI TẬP THỰC HÀNH CỦA BẠN ===
  
  /*
   * 💡 CẤU TRÚC DỮ LIỆU ĐỂ BẠN HÌNH DUNG:
   *
   * 1. Đối tượng `product` (Nhận vào từ trang ProductDetail):
   *    {
   *       id: 1,
   *       name: "Áo Thun Basic Trắng Unisex",
   *       price: 150000,
   *       imageUrl: "https://images.unsplash.com...",
   *       sizes: ["S", "M", "L", "XL"],
   *       stockQuantity: 50
   *    }
   *
   * 2. Đối tượng `item` trong giỏ hàng (Nằm trong mảng `cartItems`):
   *    {
   *       productId: 1,                  // Lấy từ product.id
   *       name: "Áo Thun Basic Trắng Unisex", // Lấy từ product.name
   *       price: 150000,                 // Lấy từ product.price
   *       imageUrl: "https://images.unsplash.com...", // Lấy từ product.imageUrl
   *       size: "M",                     // Size do khách chọn (S/M/L...)
   *       quantity: 2                    // Số lượng khách mua
   *    }
   */

  // Nhiệm vụ 1: Khôi phục giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    // Gợi ý: Đọc khóa 'shopquanao_cart' từ localStorage, nếu có thì parse và gán vào setCartItems()
    const savedCart = localStorage.getItem('shopquanao_cart');
    if (savedCart) {
      try{
         setCartItems(JSON.parse(savedCart));
      }
     catch(error){
      return console.error('Lỗi khi khôi phục giỏ hàng:',error);
     }
    }
  }, []);

  // Nhiệm vụ 2: Đồng bộ giỏ hàng vào localStorage mỗi khi trạng thái `cartItems` thay đổi
  useEffect(() => {
    // Gợi ý: Dùng localStorage.setItem('shopquanao_cart', JSON.stringify(cartItems))
    localStorage.setItem('shopquanao_cart', JSON.stringify(cartItems))
  }, [cartItems]);

  // Nhiệm vụ 3: Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, size, quantity = 1) => {
    // Gợi ý:
    // Bước 1: Tìm xem trong mảng `cartItems` hiện tại đã có sản phẩm trùng ID và trùng SIZE này chưa (dùng findIndex)
    // Bước 2: Nếu đã tồn tại: Cập nhật tăng số lượng `quantity` của phần tử đó lên.
    // Bước 3: Nếu chưa tồn tại: Tạo đối tượng sản phẩm giỏ hàng mới { productId, name, price, imageUrl, size, quantity } và nối vào mảng.
    
    // HÃY VIẾT CODE CỦA BẠN TẠI ĐÂY:
    const existIndex=cartItems.findIndex(item=>item.productId===product.id&& item.size===size );
    if(existIndex!==-1){
      const newCart=[...cartItems];
      newCart[existIndex].quantity+=quantity;
      setCartItems(newCart);
    }else{
      setCartItems([...cartItems,
        {productId:product.id,name:product.name,price:product.price,imageUrl:product.imageUrl,size:size,quantity:quantity}
      ])
    }
    console.log('addToCart() được gọi với sản phẩm:', product.name, 'Size:', size, 'SL:', quantity);
  };

  // Nhiệm vụ 4: Xóa sản phẩm ra khỏi giỏ hàng
  const removeFromCart = (productId, size) => {
    // Gợi ý: Dùng hàm filter() để lọc bỏ phần tử khớp cả `productId` và `size`
    const updateCart=cartItems.filter(item=>!(item.productId===productId&& item.size===size));
    setCartItems(updateCart);
    // HÃY VIẾT CODE CỦA BẠN TẠI ĐÂY:
    console.log('removeFromCart() được gọi với ID:', productId, 'Size:', size);
  };

  // Nhiệm vụ 5: Cập nhật số lượng của một mặt hàng trong giỏ
  const updateQuantity = (productId, size, quantity) => {
    // Bước 1: Nếu số lượng <= 0, hãy gọi hàm xóa removeFromCart(productId, size)
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    // Bước 2: Duyệt qua mảng bằng map(), tìm phần tử trùng ID và SIZE để gán giá trị `quantity` mới.
    const updatedCart = cartItems.map(item =>
      item.productId === productId && item.size === size
        ? { ...item, quantity }
        : item
    );
    setCartItems(updatedCart);
    console.log('updateQuantity() được gọi với ID:', productId, 'Size:', size, 'SL Mới:', quantity);
  };

  // Nhiệm vụ 6: Xóa sạch giỏ hàng (Sau khi thanh toán thành công)
  const clearCart = () => {
    setCartItems([]);
  };

  // Nhiệm vụ 7: Tính toán tổng số lượng sản phẩm trong giỏ hàng (cartCount)
  const cartCount = cartItems.reduce((cartTotal, item) => cartTotal + item.quantity, 0);

  // Nhiệm vụ 8: Tính toán tổng tiền của giỏ hàng chưa gồm ship (cartTotal)
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
