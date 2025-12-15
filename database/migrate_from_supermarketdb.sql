-- ================================================
-- Migration from SupermarketDB to SieuThiABC
-- ================================================
-- This script migrates data from the old SupermarketDB schema
-- to the new SieuThiABC ecommerce schema
-- ================================================

USE master;
GO

PRINT '========================================';
PRINT 'Starting migration from SupermarketDB to SieuThiABC';
PRINT '========================================';

-- Step 1: Create new database if not exists
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SieuThiABC')
BEGIN
    PRINT 'Creating SieuThiABC database...';
    CREATE DATABASE SieuThiABC;
    PRINT '✓ Database created';
END
ELSE
BEGIN
    PRINT '⚠ SieuThiABC database already exists';
END
GO

USE SieuThiABC;
GO

-- Step 2: Run schema creation
PRINT 'Creating schema...';
:r schema.sql
PRINT '✓ Schema created';
GO

-- Step 3: Migrate Customers to Users
PRINT 'Migrating customers to users...';

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'SupermarketDB')
BEGIN
    INSERT INTO SieuThiABC.dbo.Users (username, email, password, full_name, role, is_active, created_at)
    SELECT 
        'customer_' + CAST(customer_id AS NVARCHAR(10)) AS username,
        'customer' + CAST(customer_id AS NVARCHAR(10)) + '@sieuthiabc.vn' AS email,
        '$2b$10$dummyhashedpassword' AS password, -- Default password, users need to reset
        full_name,
        'customer' AS role,
        CAST(member_flag AS BIT) AS is_active,
        GETDATE() AS created_at
    FROM SupermarketDB.dbo.customers;
    
    PRINT '✓ Migrated ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' customers to users';
END
ELSE
BEGIN
    PRINT '⚠ SupermarketDB not found - skipping customer migration';
END
GO

-- Step 4: Create default categories
PRINT 'Creating default categories...';

INSERT INTO dbo.Categories (name, description, status, created_at) VALUES
(N'Thực phẩm tươi sống', N'Rau củ, trái cây, thịt cá', 'active', GETDATE()),
(N'Thực phẩm khô', N'Gạo, mì, đồ khô', 'active', GETDATE()),
(N'Đồ uống', N'Nước giải khát, sữa, cà phê', 'active', GETDATE()),
(N'Bánh kẹo', N'Bánh quy, kẹo, snack', 'active', GETDATE()),
(N'Gia vị', N'Nước mắm, dầu ăn, hạt nêm', 'active', GETDATE()),
(N'Đồ gia dụng', N'Dụng cụ nhà bếp, đồ dùng', 'active', GETDATE()),
(N'Chăm sóc cá nhân', N'Mỹ phẩm, vệ sinh', 'active', GETDATE());

PRINT '✓ Created ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' categories';
GO

-- Step 5: Migrate Products
PRINT 'Migrating products...';

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'SupermarketDB')
BEGIN
    -- Map categories
    DECLARE @categoryMapping TABLE (
        old_category NVARCHAR(50),
        new_category_id INT
    );
    
    INSERT INTO @categoryMapping (old_category, new_category_id)
    SELECT DISTINCT 
        p.category,
        CASE 
            WHEN p.category LIKE N'%rau%' OR p.category LIKE N'%thịt%' OR p.category LIKE N'%cá%' THEN 1
            WHEN p.category LIKE N'%gạo%' OR p.category LIKE N'%mì%' THEN 2
            WHEN p.category LIKE N'%nước%' OR p.category LIKE N'%sữa%' THEN 3
            WHEN p.category LIKE N'%bánh%' OR p.category LIKE N'%kẹo%' THEN 4
            WHEN p.category LIKE N'%dầu%' OR p.category LIKE N'%mắm%' THEN 5
            ELSE 7 -- Default to 'Khác'
        END
    FROM SupermarketDB.dbo.products p;
    
    -- Insert products
    INSERT INTO SieuThiABC.dbo.Products (name, price, stock, category_id, status, created_at)
    SELECT 
        p.product_name,
        p.unit_price,
        100 AS stock, -- Default stock
        COALESCE(cm.new_category_id, 7) AS category_id,
        'active' AS status,
        GETDATE()
    FROM SupermarketDB.dbo.products p
    LEFT JOIN @categoryMapping cm ON p.category = cm.old_category;
    
    PRINT '✓ Migrated ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' products';
END
ELSE
BEGIN
    PRINT '⚠ SupermarketDB not found - skipping product migration';
END
GO

-- Step 6: Create default admin user
PRINT 'Creating default admin user...';

IF NOT EXISTS (SELECT * FROM dbo.Users WHERE username = 'admin')
BEGIN
    INSERT INTO dbo.Users (username, email, password, full_name, role, is_active, created_at)
    VALUES (
        'admin',
        'admin@sieuthiabc.vn',
        '123456', -- Change this!
        N'Quản trị viên',
        'admin',
        1,
        GETDATE()
    );
   
END
ELSE
BEGIN
    PRINT '⚠ Admin user already exists';
END
GO

-- Step 7: Create default theme
PRINT 'Creating default theme...';

IF NOT EXISTS (SELECT * FROM dbo.Themes WHERE name = N'Mặc định')
BEGIN
    INSERT INTO dbo.Themes (name, primary_color, secondary_color, is_active, created_at)
    VALUES (
        N'Mặc định',
        '#1890ff',
        '#52c41a',
        1,
        GETDATE()
    );
    PRINT '✓ Default theme created';
END
GO

-- Step 8: Create sample vouchers
PRINT 'Creating sample vouchers...';

INSERT INTO dbo.Vouchers (code, description, discount_type, discount_value, min_order_value, start_date, end_date, usage_limit, status, created_at)
VALUES 
(N'WELCOME10', N'Giảm 10% cho đơn hàng đầu tiên', 'percent', 10, 100000, GETDATE(), DATEADD(YEAR, 1, GETDATE()), 1000, 'active', GETDATE()),
(N'FREESHIP', N'Miễn phí vận chuyển', 'fixed', 30000, 200000, GETDATE(), DATEADD(YEAR, 1, GETDATE()), NULL, 'active', GETDATE()),
(N'SUMMER50', N'Giảm 50k cho đơn từ 500k', 'fixed', 50000, 500000, GETDATE(), DATEADD(MONTH, 3, GETDATE()), 500, 'active', GETDATE());

PRINT '✓ Created ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' sample vouchers';
GO

-- Step 9: Verification
PRINT '';
PRINT '========================================';
PRINT 'Migration Summary';
PRINT '========================================';

DECLARE @userCount INT, @productCount INT, @categoryCount INT, @voucherCount INT;

SELECT @userCount = COUNT(*) FROM dbo.Users;
SELECT @productCount = COUNT(*) FROM dbo.Products;
SELECT @categoryCount = COUNT(*) FROM dbo.Categories;
SELECT @voucherCount = COUNT(*) FROM dbo.Vouchers;

PRINT 'Users: ' + CAST(@userCount AS NVARCHAR(10));
PRINT 'Products: ' + CAST(@productCount AS NVARCHAR(10));
PRINT 'Categories: ' + CAST(@categoryCount AS NVARCHAR(10));
PRINT 'Vouchers: ' + CAST(@voucherCount AS NVARCHAR(10));
PRINT '========================================';
GO
