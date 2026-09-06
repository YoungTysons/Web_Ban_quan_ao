const categories = [
  { id: 1, name: 'Áo Thun', description: 'Các mẫu áo thun cotton 100% thoáng mát, form rộng unisex' },
  { id: 2, name: 'Quần Jean', description: 'Quần jean nam nữ ống suông, skinny, rách gối cá tính' },
  { id: 3, name: 'Áo Khoác & Hoodie', description: 'Áo hoodie nỉ bông ấm áp, áo khoác gió chống nước nhẹ' },
  { id: 4, name: 'Sơ Mi', description: 'Sơ mi tay dài, tay ngắn phong cách lịch lãm, công sở hoặc Hàn Quốc' }
];

const users = [
  {
    id: 1,
    name: 'Nguyễn Văn Khách',
    email: 'customer@gmail.com',
    password: '$2a$10$wN194x/5k1kX5Z6f16C/yeD9K20u63g6V3UfNn/7t42FzXNlK6lPq', 
    role: 'customer',
    phone: '0912345678',
    address: '123 Đường Ba Đình, Quận 1, TP. HCM',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Trần Admin Đẹp Trai',
    email: 'admin@gmail.com',
    password: '$2a$10$K9p7.LhQ3K7h0D/Z5KjOtefFkC6x/kM95W231Q.xJj6.B7l.vJ1Y2', 
    role: 'admin',
    phone: '0987654321',
    address: '456 Đường Lê Lợi, Quận Hoàn Kiếm, Hà Nội',
    createdAt: new Date()
  }
];

const products = [
  {
    id: 1,
    categoryId: 1,
    name: 'Áo Thun Basic Trắng Unisex',
    price: 150000,
    description: 'Áo thun basic 100% cotton co giãn 4 chiều, dày dặn, thấm hút mồ hôi tốt. Phù hợp cho cả nam và nữ.',
    sizes: ['S', 'M', 'L', 'XL'],
    stockQuantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'
  },
  {
    id: 2,
    categoryId: 1,
    name: 'Áo Thun Local Brand Oversize Đen',
    price: 220000,
    description: 'Áo thun đen in hình đồ họa phong cách streetwear cực ngầu, form rộng chất lừ.',
    sizes: ['M', 'L', 'XL'],
    stockQuantity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'
  },
  {
    id: 3,
    categoryId: 2,
    name: 'Quần Jean Ống Rộng Xanh Nhạt',
    price: 350000,
    description: 'Quần jean denim mềm, ống rộng thời thượng. Dễ phối với áo thun hay sơ mi.',
    sizes: ['S', 'M', 'L'],
    stockQuantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'
  },
  {
    id: 4,
    categoryId: 3,
    name: 'Áo Hoodie Nỉ Bông Xám Tro',
    price: 320000,
    description: 'Áo hoodie nỉ bông dày dặn ấm áp, nón to 2 lớp đứng form cực đẹp.',
    sizes: ['M', 'L', 'XL'],
    stockQuantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'
  },
  {
    id: 5,
    categoryId: 4,
    name: 'Áo Sơ Mi Hàn Quốc Trắng Cổ V',
    price: 280000,
    description: 'Áo sơ mi lụa mềm mịn, chống nhăn tốt. Mang lại vẻ ngoài trẻ trung thanh lịch.',
    sizes: ['S', 'M', 'L', 'XL'],
    stockQuantity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'
  }
];

const orders = [
  {
    id: 1,
    userId: 1,
    orderDate: new Date(),
    status: 'pending',
    totalAmount: 520000,
    address: '123 Đường Ba Đình, Quận 1, TP. HCM',
    phone: '0912345678',
    items: [
      { productId: 1, size: 'L', quantity: 1, price: 150000 },
      { productId: 3, size: 'M', quantity: 1, price: 350000 }
    ]
  }
];

module.exports = {
  categories,
  users,
  products,
  orders
};
