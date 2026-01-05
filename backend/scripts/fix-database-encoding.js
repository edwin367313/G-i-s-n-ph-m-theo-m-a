const sql = require('mssql');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER || 'EDWIN',
  database: process.env.DB_DATABASE || 'DB_SieuThi_Hung',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    useUTC: false
  }
};

async function fixEncoding() {
  let pool;
  
  try {
    console.log('🔄 Kết nối database...');
    pool = await sql.connect(config);
    
    // 1. Xóa dữ liệu cũ (giữ lại cấu trúc)
    console.log('\n🗑️  Xóa dữ liệu cũ...');
    
    await pool.request().query('DELETE FROM OrderItems');
    await pool.request().query('DELETE FROM Orders');
    await pool.request().query('DELETE FROM CartItems');
    await pool.request().query('DELETE FROM Carts');
    await pool.request().query('DELETE FROM Payments');
    await pool.request().query('DELETE FROM Notifications');
    await pool.request().query('DELETE FROM Products');
    await pool.request().query('DELETE FROM Categories');
    await pool.request().query('DELETE FROM Users');
    await pool.request().query('DELETE FROM Vouchers');
    
    // Reset IDENTITY counters
    await pool.request().query('DBCC CHECKIDENT (Categories, RESEED, 0)');
    await pool.request().query('DBCC CHECKIDENT (Products, RESEED, 0)');
    await pool.request().query('DBCC CHECKIDENT (Users, RESEED, 0)');
    
    console.log('✅ Đã xóa dữ liệu cũ và reset ID counters');
    
    // 2. Seed Categories với encoding đúng
    console.log('\n📦 Tạo Categories...');
    const categories = [
      { name: 'Thịt tươi sống', description: 'Thịt heo, gà, bò tươi sống' },
      { name: 'Rau củ quả', description: 'Rau xanh, củ quả tươi' },
      { name: 'Trái cây', description: 'Trái cây trong nước và nhập khẩu' },
      { name: 'Hải sản', description: 'Cá, tôm, mực tươi sống' },
      { name: 'Sữa và sản phẩm sữa', description: 'Sữa tươi, sữa chua, phô mai' },
      { name: 'Bánh kẹo', description: 'Bánh ngọt, kẹo các loại' },
      { name: 'Đồ uống', description: 'Nước ngọt, nước ép, bia rượu' },
      { name: 'Gia vị', description: 'Dầu ăn, nước mắm, gia vị nấu ăn' },
      { name: 'Đồ khô', description: 'Mì, miến, bún khô' },
      { name: 'Đồ dùng gia đình', description: 'Nước rửa chén, bột giặt' }
    ];
    
    for (const cat of categories) {
      await pool.request()
        .input('name', sql.NVarChar, cat.name)
        .input('description', sql.NVarChar, cat.description)
        .query(`
          INSERT INTO Categories (name, description, created_at, updated_at)
          VALUES (@name, @description, GETDATE(), GETDATE())
        `);
    }
    console.log(`✅ Đã tạo ${categories.length} categories`);
    
    // 3. Seed Products với encoding đúng
    console.log('\n🛒 Tạo Products...');
    const products = [
      // Thịt tươi sống (category 1)
      { name: 'Thịt ba chỉ lợn', price: 85000, category_id: 1, stock: 50, unit: 'kg' },
      { name: 'Thịt nạc vai lợn', price: 95000, category_id: 1, stock: 40, unit: 'kg' },
      { name: 'Thịt đùi gà', price: 65000, category_id: 1, stock: 60, unit: 'kg' },
      { name: 'Cánh gà', price: 55000, category_id: 1, stock: 45, unit: 'kg' },
      { name: 'Thịt nạc dăm lợn', price: 90000, category_id: 1, stock: 35, unit: 'kg' },
      
      // Rau củ quả (category 2)
      { name: 'Cà chua', price: 15000, category_id: 2, stock: 100, unit: 'kg' },
      { name: 'Rau cải xanh', price: 12000, category_id: 2, stock: 80, unit: 'bó' },
      { name: 'Khoai tây', price: 18000, category_id: 2, stock: 90, unit: 'kg' },
      { name: 'Hành tây', price: 20000, category_id: 2, stock: 70, unit: 'kg' },
      { name: 'Cà rót', price: 16000, category_id: 2, stock: 60, unit: 'kg' },
      
      // Sữa (category 5)
      { name: 'Sữa tươi Vinamilk 1L', price: 32000, category_id: 5, stock: 200, unit: 'hộp' },
      { name: 'Sữa chua uống TH True Milk', price: 8000, category_id: 5, stock: 150, unit: 'chai' },
      { name: 'Sữa đặc có đường Ông Thọ', price: 28000, category_id: 5, stock: 100, unit: 'lon' },
      
      // Đồ uống (category 7)
      { name: 'Nước tăng lực Comfort 3.8L', price: 139500, category_id: 7, stock: 80, unit: 'chai', discount: 10 },
      { name: 'Nước tăng lực Downy 3.5L', price: 148500, category_id: 7, stock: 75, unit: 'chai', discount: 10 },
      { name: 'Nước tăng lực Hygiene 3.5L', price: 140600, category_id: 7, stock: 70, unit: 'chai', discount: 5 },
      { name: 'Nước tăng lực Viso 3.5L', price: 150100, category_id: 7, stock: 65, unit: 'chai', discount: 5 },
      { name: 'Nước tăng lực Pigeon 3.2L', price: 125000, category_id: 7, stock: 85, unit: 'chai' },
      { name: 'Nước tăng lực Sunlight 3.6L', price: 145000, category_id: 7, stock: 60, unit: 'chai', discount: 5 },
      
      // Đồ dùng gia đình (category 10)
      { name: 'Bột giặt Omo 6kg', price: 250000, category_id: 10, stock: 40, unit: 'túi' },
      { name: 'Nước rửa chén Sunlight 1.5L', price: 45000, category_id: 10, stock: 90, unit: 'chai' },
      { name: 'Bột giặt Tide 2.5kg', price: 120000, category_id: 10, stock: 50, unit: 'túi' },
      
      // Bánh kẹo (category 6)
      { name: 'Bánh Oreo 137g', price: 25000, category_id: 6, stock: 150, unit: 'gói' },
      { name: 'Kẹo Alpenliebe 120g', price: 18000, category_id: 6, stock: 200, unit: 'gói' },
      
      // Gia vị (category 8)
      { name: 'Dầu ăn Simply 1L', price: 38000, category_id: 8, stock: 100, unit: 'chai' },
      { name: 'Nước mắm Nam Ngư 500ml', price: 22000, category_id: 8, stock: 120, unit: 'chai' }
    ];
    
    for (const product of products) {
      await pool.request()
        .input('name', sql.NVarChar, product.name)
        .input('price', sql.Decimal(18, 2), product.price)
        .input('category_id', sql.Int, product.category_id)
        .input('stock', sql.Int, product.stock)
        .input('unit', sql.NVarChar, product.unit)
        .input('discount', sql.Int, product.discount || 0)
        .query(`
          INSERT INTO Products (name, price, category_id, stock, unit, discount_percent, status, created_at, updated_at)
          VALUES (@name, @price, @category_id, @stock, @unit, @discount, '1', GETDATE(), GETDATE())
        `);
    }
    console.log(`✅ Đã tạo ${products.length} products`);
    
    // 4. Seed Users
    console.log('\n👥 Tạo Users...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const users = [
      { username: 'admin', email: 'admin@sieuthiabc.com', full_name: 'Quản trị viên', role: 'admin' },
      { username: 'user1', email: 'user1@example.com', full_name: 'Nguyễn Văn A', role: 'customer' },
      { username: 'user2', email: 'user2@example.com', full_name: 'Trần Thị B', role: 'customer' },
      { username: 'user3', email: 'user3@example.com', full_name: 'Lê Văn C', role: 'customer' }
    ];
    
    for (const user of users) {
      await pool.request()
        .input('username', sql.NVarChar, user.username)
        .input('email', sql.NVarChar, user.email)
        .input('password', sql.NVarChar, hashedPassword)
        .input('full_name', sql.NVarChar, user.full_name)
        .input('role', sql.NVarChar, user.role)
        .query(`
          INSERT INTO Users (username, email, password, full_name, role, created_at, updated_at)
          VALUES (@username, @email, @password, @full_name, @role, GETDATE(), GETDATE())
        `);
    }
    console.log(`✅ Đã tạo ${users.length} users (password: 123456)`);
    
    console.log('\n🎉 HOÀN THÀNH! Database đã được fix encoding.');
    console.log('📝 Thông tin đăng nhập:');
    console.log('   - Admin: admin / 123456');
    console.log('   - User1: user1 / 123456');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    throw error;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Chạy script
console.log('⚠️  CẢNH BÁO: Script này sẽ XÓA toàn bộ dữ liệu hiện tại!');
console.log('⏱️  Bắt đầu sau 5 giây...\n');

setTimeout(() => {
  fixEncoding().catch(err => {
    console.error('Lỗi nghiêm trọng:', err);
    process.exit(1);
  });
}, 5000);
