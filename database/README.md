# 🗄️ Database - Siêu Thị ABC

SQL Server database cho hệ thống Siêu Thị ABC.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Database Schema](#database-schema)
- [Cài đặt](#cài-đặt)
- [Migrations](#migrations)
- [Seed Data](#seed-data)
- [Tables](#tables)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Stored Procedures](#stored-procedures)
- [Views](#views)
- [Migration từ SupermarketDB](#migration-từ-supermarketdb)

## 🎯 Giới thiệu

Database **SieuThiABC** sử dụng SQL Server với schema được thiết kế cho hệ thống ecommerce bán lẻ.

**Database Name**: `SieuThiABC`

**Tables**: 9 bảng chính

**Features**:
- ✅ Foreign Key Constraints
- ✅ Check Constraints
- ✅ Indexes for performance
- ✅ Triggers for `updated_at`
- ✅ Migration scripts
- ✅ Seed data

## 🗂️ Database Schema

### Tables Overview

| Table | Description | Records (Seed) |
|-------|-------------|----------------|
| `Users` | Người dùng (admin, manager, customer) | 12 |
| `Categories` | Danh mục sản phẩm | 7 |
| `Products` | Sản phẩm | 50 |
| `Carts` | Giỏ hàng | 0 |
| `CartItems` | Chi tiết giỏ hàng | 0 |
| `Orders` | Đơn hàng | 0 |
| `OrderItems` | Chi tiết đơn hàng | 0 |
| `Payments` | Thanh toán | 0 |
| `Vouchers` | Mã giảm giá | 18 |
| `Themes` | Giao diện | 0 |

### ER Diagram (Text)

```
Users (1) ----< (N) Carts (1) ----< (N) CartItems >---- (N) Products (N) >---- (1) Categories
  |                                                           |
  |                                                           |
  (1)                                                        (N)
  |                                                           |
  ----< (N) Orders (1) ----< (N) OrderItems >----------------
        |
        (1)
        |
        ----< (N) Payments

Vouchers (independent)
Themes (independent)
```

## 🔧 Cài đặt

### 1. Yêu cầu

- SQL Server 2016 hoặc mới hơn
- SQL Server Management Studio (SSMS) hoặc Azure Data Studio

### 2. Tạo Database từ Schema

```sql
-- Method 1: Run schema.sql
:r schema.sql

-- Method 2: Run migrations in order
:r migrations/001_create_users_table.sql
:r migrations/002_create_products_table.sql
-- ... run all 9 migrations
```

### 3. Seed Data

```sql
:r seeds/seed_users.sql
:r seeds/seed_categories.sql
:r seeds/seed_products.sql
:r seeds/seed_vouchers.sql
```

### 4. Verify Installation

```sql
USE SieuThiABC;

SELECT 
    t.name AS TableName,
    SUM(p.rows) AS RowCount
FROM 
    sys.tables t
    INNER JOIN sys.partitions p ON t.object_id = p.object_id
WHERE 
    p.index_id IN (0,1)
    AND t.is_ms_shipped = 0
GROUP BY t.name
ORDER BY t.name;
```

Expected output:
```
TableName        RowCount
--------------------------
CartItems        0
Carts            0
Categories       7
OrderItems       0
Orders           0
Payments         0
Products         50
Themes           0
Users            12
Vouchers         18
```

## 📦 Migrations

Migration files trong `migrations/` directory:

```
001_create_users_table.sql        - Users table
002_create_products_table.sql     - Products table
003_create_categories_table.sql   - Categories table
004_create_carts_table.sql        - Carts + CartItems
005_create_orders_table.sql       - Orders + OrderItems
006_create_payments_table.sql     - Payments table
007_create_vouchers_table.sql     - Vouchers table
008_create_themes_table.sql       - Themes table
009_create_images_table.sql       - Placeholder (not implemented)
```

### Run Migrations

```bash
# PowerShell
cd database/migrations
Get-ChildItem -Filter *.sql | Sort-Object Name | ForEach-Object {
    sqlcmd -S localhost -d SieuThiABC -i $_.FullName
}
```

## 🌱 Seed Data

Seed files trong `seeds/` directory:

```
seed_users.sql       - 2 admin + 10 customers
seed_categories.sql  - 7 categories
seed_products.sql    - 50 products
seed_vouchers.sql    - 18 vouchers
```

### Default Accounts

**Admin:**
- Username: `admin`
- Email: `admin@sieuthiabc.vn`
- Password: `123456` (hashed: `$2b$10$dummyhashedpassword`)
- Role: `admin`

**Manager:**
- Username: `manager`
- Email: `manager@sieuthiabc.vn`
- Password: `123456`
- Role: `manager`

**Customers:**
- 10 customer accounts (nguyenvanan, tranthib, etc.)
- Password: `123456` (all)

⚠️ **IMPORTANT**: Change default passwords in production!

## 📊 Tables

### 1. Users

**Purpose**: Quản lý người dùng

```sql
CREATE TABLE dbo.Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100),
    phone NVARCHAR(20),
    address NVARCHAR(255),
    role NVARCHAR(20) NOT NULL DEFAULT 'customer',
    avatar NVARCHAR(500),
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);
```

**Roles**: `customer`, `admin`, `manager`

**Indexes**: email, username, role

### 2. Categories

**Purpose**: Danh mục sản phẩm

```sql
CREATE TABLE dbo.Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    image NVARCHAR(500),
    status NVARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);
```

**7 Categories**:
1. Thực phẩm tươi sống
2. Thực phẩm khô
3. Đồ uống
4. Bánh kẹo
5. Gia vị
6. Đồ gia dụng
7. Chăm sóc cá nhân

### 3. Products

**Purpose**: Sản phẩm

```sql
CREATE TABLE dbo.Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(18,2) NOT NULL CHECK (price >= 0),
    discount_percent INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    category_id INT NOT NULL FOREIGN KEY REFERENCES Categories(id),
    images NVARCHAR(MAX), -- JSON array
    unit NVARCHAR(50) NOT NULL DEFAULT N'Cái',
    status NVARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);
```

**Status**: `active`, `inactive`, `out_of_stock`

**Images**: JSON array `["url1", "url2"]`

### 4. Carts & CartItems

**Purpose**: Giỏ hàng

```sql
CREATE TABLE dbo.Carts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE,
    voucher_code NVARCHAR(50),
    discount DECIMAL(18,2) DEFAULT 0,
    total DECIMAL(18,2) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE(),
    UNIQUE(user_id)
);

CREATE TABLE dbo.CartItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cart_id INT NOT NULL FOREIGN KEY REFERENCES Carts(id) ON DELETE CASCADE,
    product_id INT NOT NULL FOREIGN KEY REFERENCES Products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(18,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE(),
    UNIQUE(cart_id, product_id)
);
```

**Constraint**: Mỗi user chỉ có 1 cart

### 5. Orders & OrderItems

**Purpose**: Đơn hàng

```sql
CREATE TABLE dbo.Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_code NVARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(id),
    subtotal DECIMAL(18,2) NOT NULL,
    discount DECIMAL(18,2) DEFAULT 0,
    shipping_fee DECIMAL(18,2) DEFAULT 0,
    total DECIMAL(18,2) NOT NULL,
    
    customer_name NVARCHAR(100) NOT NULL,
    customer_phone NVARCHAR(20) NOT NULL,
    customer_email NVARCHAR(100),
    shipping_address NVARCHAR(500) NOT NULL,
    
    voucher_code NVARCHAR(50),
    payment_method NVARCHAR(50) NOT NULL,
    order_status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    note NVARCHAR(MAX),
    
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);
```

**Order Status**: `pending`, `confirmed`, `shipping`, `delivered`, `cancelled`

**Payment Status**: `pending`, `paid`, `failed`, `refunded`

### 6. Payments

**Purpose**: Thanh toán

```sql
CREATE TABLE dbo.Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    payment_code NVARCHAR(50) NOT NULL UNIQUE,
    order_id INT NOT NULL FOREIGN KEY REFERENCES Orders(id),
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(id),
    amount DECIMAL(18,2) NOT NULL,
    payment_method NVARCHAR(50) NOT NULL,
    gateway NVARCHAR(50), -- momo, zalopay, paypal, cod
    transaction_id NVARCHAR(100),
    status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    response_data NVARCHAR(MAX),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);
```

**Payment Methods**: momo, zalopay, paypal, cod

**Status**: `pending`, `processing`, `success`, `failed`, `refunded`

### 7. Vouchers

**Purpose**: Mã giảm giá

```sql
CREATE TABLE dbo.Vouchers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(500),
    discount_type NVARCHAR(20) NOT NULL, -- percent, fixed
    discount_value DECIMAL(18,2) NOT NULL,
    min_order_value DECIMAL(18,2) DEFAULT 0,
    max_discount DECIMAL(18,2),
    usage_limit INT,
    used_count INT NOT NULL DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);
```

**Discount Types**: `percent` (%), `fixed` (VNĐ)

### 8. Themes

**Purpose**: Giao diện tùy chỉnh

```sql
CREATE TABLE dbo.Themes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    primary_color NVARCHAR(20) NOT NULL DEFAULT '#1890ff',
    secondary_color NVARCHAR(20) NOT NULL DEFAULT '#52c41a',
    logo NVARCHAR(500),
    banner NVARCHAR(500),
    is_active BIT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);
```

## 🔗 Relationships

```sql
-- Users -> Carts (1:1)
Users.id = Carts.user_id

-- Carts -> CartItems (1:N)
Carts.id = CartItems.cart_id

-- Products -> CartItems (1:N)
Products.id = CartItems.product_id

-- Categories -> Products (1:N)
Categories.id = Products.category_id

-- Users -> Orders (1:N)
Users.id = Orders.user_id

-- Orders -> OrderItems (1:N)
Orders.id = OrderItems.order_id

-- Products -> OrderItems (1:N)
Products.id = OrderItems.product_id

-- Orders -> Payments (1:N)
Orders.id = Payments.order_id

-- Users -> Payments (1:N)
Users.id = Payments.user_id
```

## 📈 Indexes

### Performance Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_users_role ON Users(role);

-- Products
CREATE INDEX idx_products_category ON Products(category_id);
CREATE INDEX idx_products_status ON Products(status);
CREATE INDEX idx_products_price ON Products(price);

-- Orders
CREATE INDEX idx_orders_user ON Orders(user_id);
CREATE INDEX idx_orders_code ON Orders(order_code);
CREATE INDEX idx_orders_status ON Orders(order_status);
CREATE INDEX idx_orders_payment_status ON Orders(payment_status);
CREATE INDEX idx_orders_created ON Orders(created_at);

-- Payments
CREATE INDEX idx_payments_order ON Payments(order_id);
CREATE INDEX idx_payments_user ON Payments(user_id);
CREATE INDEX idx_payments_status ON Payments(status);

-- Vouchers
CREATE INDEX idx_vouchers_code ON Vouchers(code);
CREATE INDEX idx_vouchers_status ON Vouchers(status);
```

## 🔄 Triggers

### Auto Update `updated_at`

Tất cả tables có `updated_at` column đều có trigger tự động update:

```sql
CREATE TRIGGER trg_[table]_updated_at ON dbo.[Table]
AFTER UPDATE AS
BEGIN
    UPDATE dbo.[Table]
    SET updated_at = GETDATE()
    FROM dbo.[Table] t
    INNER JOIN inserted i ON t.id = i.id;
END;
```

## 📦 Stored Procedures

*Reserved for future implementation*

Planned stored procedures:
- `sp_CreateOrder` - Tạo đơn hàng
- `sp_UpdateStock` - Cập nhật tồn kho
- `sp_CalculateRevenue` - Tính doanh thu
- `sp_ApplyVoucher` - Áp dụng voucher

## 👁️ Views

*Reserved for future implementation*

Planned views:
- `vw_ProductsWithCategory` - Products with category info
- `vw_OrderDetails` - Order details with items
- `vw_RevenueStatistics` - Revenue statistics
- `vw_TopProducts` - Top selling products

## 🔄 Migration từ SupermarketDB

Nếu bạn có database `SupermarketDB` cũ, sử dụng script migration:

```bash
sqlcmd -S localhost -i migrate_from_supermarketdb.sql
```

Script này sẽ:
1. ✅ Tạo database `SieuThiABC`
2. ✅ Chạy schema.sql
3. ✅ Migrate customers → users
4. ✅ Migrate products → products
5. ✅ Tạo categories mặc định
6. ✅ Tạo admin user
7. ✅ Tạo default theme
8. ✅ Tạo sample vouchers

## 🔧 Maintenance

### Backup Database

```sql
BACKUP DATABASE SieuThiABC
TO DISK = 'C:\Backup\SieuThiABC.bak'
WITH FORMAT, MEDIANAME = 'SieuThiABC_Backup';
```

### Restore Database

```sql
RESTORE DATABASE SieuThiABC
FROM DISK = 'C:\Backup\SieuThiABC.bak'
WITH REPLACE;
```

### Reset Database

```sql
-- Drop all data
DELETE FROM dbo.OrderItems;
DELETE FROM dbo.Orders;
DELETE FROM dbo.Payments;
DELETE FROM dbo.CartItems;
DELETE FROM dbo.Carts;
DELETE FROM dbo.Products;
DELETE FROM dbo.Categories;
DELETE FROM dbo.Vouchers;
DELETE FROM dbo.Themes;
DELETE FROM dbo.Users;

-- Re-seed
:r seeds/seed_users.sql
:r seeds/seed_categories.sql
:r seeds/seed_products.sql
:r seeds/seed_vouchers.sql
```

## 📊 Statistics Queries

### Total Records

```sql
SELECT 
    'Users' AS TableName, COUNT(*) AS Records FROM Users
UNION ALL
SELECT 'Products', COUNT(*) FROM Products
UNION ALL
SELECT 'Orders', COUNT(*) FROM Orders
UNION ALL
SELECT 'Vouchers', COUNT(*) FROM Vouchers;
```

### Revenue by Month

```sql
SELECT 
    YEAR(created_at) AS Year,
    MONTH(created_at) AS Month,
    COUNT(*) AS TotalOrders,
    SUM(total) AS TotalRevenue
FROM Orders
WHERE order_status = 'delivered'
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY Year DESC, Month DESC;
```

### Top 10 Products

```sql
SELECT TOP 10
    p.name,
    COUNT(oi.id) AS OrderCount,
    SUM(oi.quantity) AS TotalQuantity,
    SUM(oi.subtotal) AS TotalRevenue
FROM Products p
JOIN OrderItems oi ON p.id = oi.product_id
JOIN Orders o ON oi.order_id = o.id
WHERE o.order_status = 'delivered'
GROUP BY p.id, p.name
ORDER BY TotalRevenue DESC;
```

## 🐛 Troubleshooting

### Connection String

```
Server=localhost;Database=SieuThiABC;User Id=sa;Password=yourpassword;TrustServerCertificate=True;
```

### Common Issues

**Issue**: Foreign key constraint errors
```sql
-- Check constraints
SELECT * FROM sys.foreign_keys WHERE parent_object_id = OBJECT_ID('TableName');
```

**Issue**: Identity insert errors
```sql
-- Reset identity
DBCC CHECKIDENT ('TableName', RESEED, 0);
```

## 📚 Resources

- [SQL Server Documentation](https://learn.microsoft.com/en-us/sql/sql-server/)
- [Sequelize Documentation](https://sequelize.org/)
- [Database Design Best Practices](https://learn.microsoft.com/en-us/sql/relational-databases/tables/table-design-best-practices)

---

**Developed with ❤️ for Siêu Thị ABC**
