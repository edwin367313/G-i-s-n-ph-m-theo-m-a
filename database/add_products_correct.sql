-- =============================================
-- Script: Thêm sản phẩm với cấu trúc đúng
-- =============================================
USE SieuThiABC;
GO

PRINT 'Bắt đầu thêm sản phẩm...';

-- Lấy category IDs
DECLARE @cat_1 INT = (SELECT TOP 1 id FROM Categories ORDER BY id OFFSET 0 ROWS);
DECLARE @cat_2 INT = (SELECT TOP 1 id FROM Categories ORDER BY id OFFSET 1 ROWS);
DECLARE @cat_3 INT = (SELECT TOP 1 id FROM Categories ORDER BY id OFFSET 2 ROWS);
DECLARE @cat_4 INT = (SELECT TOP 1 id FROM Categories ORDER BY id OFFSET 3 ROWS);
DECLARE @cat_5 INT = (SELECT TOP 1 id FROM Categories ORDER BY id OFFSET 4 ROWS);
DECLARE @cat_6 INT = (SELECT TOP 1 id FROM Categories ORDER BY id OFFSET 5 ROWS);
DECLARE @cat_7 INT = (SELECT TOP 1 id FROM Categories ORDER BY id OFFSET 6 ROWS);

-- THÊM 300+ SẢN PHẨM ĐA DẠNG
INSERT INTO Products (name, description, price, discount_percent, stock, category_id, images, unit, status, created_at) VALUES
-- Rau củ quả tươi (50 sản phẩm)
(N'Cà chua bi 500g', N'Cà chua bi tươi ngon, giàu vitamin C', 25000, 5, 200, @cat_1, '/images/products/ca-chua-bi.jpg', N'gói', 'active', DATEADD(month, -24, GETDATE())),
(N'Rau cải xanh 500g', N'Rau cải xanh tươi mỗi ngày', 15000, 0, 150, @cat_1, '/images/products/rau-cai-xanh.jpg', N'gói', 'active', DATEADD(month, -24, GETDATE())),
(N'Rau muống 500g', N'Rau muống tươi sạch', 12000, 0, 180, @cat_1, '/images/products/rau-muong.jpg', N'gói', 'active', DATEADD(month, -24, GETDATE())),
(N'Củ hành tây 1kg', N'Củ hành tây Đà Lạt', 35000, 10, 250, @cat_1, '/images/products/cu-hanh-tay.jpg', N'kg', 'active', DATEADD(month, -24, GETDATE())),
(N'Khoai tây 1kg', N'Khoai tây Đà Lạt size lớn', 40000, 0, 300, @cat_1, '/images/products/khoai-tay.jpg', N'kg', 'active', DATEADD(month, -24, GETDATE())),
(N'Cà rốt 500g', N'Cà rốt tươi Đà Lạt', 18000, 0, 200, @cat_1, '/images/products/ca-rot.jpg', N'gói', 'active', DATEADD(month, -24, GETDATE())),
(N'Bắp cải trắng 1kg', N'Bắp cải trắng tươi giòn', 22000, 5, 180, @cat_1, '/images/products/bap-cai-trang.jpg', N'kg', 'active', DATEADD(month, -24, GETDATE())),
(N'Súp lơ xanh 500g', N'Súp lơ xanh dinh dưỡng', 32000, 0, 120, @cat_1, '/images/products/sup-lo-xanh.jpg', N'gói', 'active', DATEADD(month, -24, GETDATE())),
(N'Cà tím 500g', N'Cà tím tròn tươi ngon', 20000, 0, 150, @cat_1, '/images/products/ca-tim.jpg', N'gói', 'active', DATEADD(month, -24, GETDATE())),
(N'Ớt chuông đỏ 500g', N'Ớt chuông đỏ ngọt', 45000, 10, 100, @cat_1, '/images/products/ot-chuong-do.jpg', N'gói', 'active', DATEADD(month, -24, GETDATE())),
(N'Táo Fuji 1kg', N'Táo Fuji nhập khẩu', 85000, 15, 180, @cat_1, '/images/products/tao-fuji.jpg', N'kg', 'active', DATEADD(month, -20, GETDATE())),
(N'Cam sành 1kg', N'Cam sành Việt Nam', 35000, 5, 250, @cat_1, '/images/products/cam-sanh.jpg', N'kg', 'active', DATEADD(month, -24, GETDATE())),
(N'Chuối tiêu 1 nải', N'Chuối tiêu chín vàng', 28000, 0, 200, @cat_1, '/images/products/chuoi-tieu.jpg', N'nải', 'active', DATEADD(month, -24, GETDATE())),
(N'Xoài cát 1kg', N'Xoài cát Hoà Lộc', 65000, 10, 150, @cat_1, '/images/products/xoai-cat.jpg', N'kg', 'active', DATEADD(month, -18, GETDATE())),
(N'Nho đen 500g', N'Nho đen không hạt', 95000, 20, 80, @cat_1, '/images/products/nho-den.jpg', N'gói', 'active', DATEADD(month, -12, GETDATE())),
(N'Dưa hấu 1 trái', N'Dưa hấu không hạt 3-4kg', 45000, 5, 150, @cat_1, '/images/products/dua-hau.jpg', N'trái', 'active', DATEADD(month, -24, GETDATE())),
(N'Đu đủ 1kg', N'Đu đủ chín vàng', 28000, 0, 180, @cat_1, '/images/products/du-du.jpg', N'kg', 'active', DATEADD(month, -24, GETDATE())),
(N'Dứa 1 trái', N'Dứa Cayenne ngọt', 35000, 5, 200, @cat_1, '/images/products/dua.jpg', N'trái', 'active', DATEADD(month, -24, GETDATE())),
(N'Thanh long ruột đỏ 1kg', N'Thanh long Bình Thuận', 42000, 10, 160, @cat_1, '/images/products/thanh-long.jpg', N'kg', 'active', DATEADD(month, -24, GETDATE())),
(N'Măng cụt 500g', N'Măng cụt tươi ngon', 125000, 15, 90, @cat_1, '/images/products/mang-cut.jpg', N'gói', 'active', DATEADD(month, -15, GETDATE())),

-- Nước giải khát (80 sản phẩm)
(N'Coca Cola 330ml (6 lon)', N'Nước ngọt Coca', 42000, 5, 800, @cat_2, '/images/products/coca.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'Pepsi 330ml (6 lon)', N'Nước ngọt Pepsi', 40000, 5, 750, @cat_2, '/images/products/pepsi.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'7Up 330ml (6 lon)', N'Nước ngọt 7Up', 38000, 5, 720, @cat_2, '/images/products/7up.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'Sting dâu 330ml (6 lon)', N'Nước tăng lực Sting', 45000, 10, 680, @cat_2, '/images/products/sting.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'Number 1 chanh muối 330ml (6 lon)', N'Nước tăng lực Number 1', 42000, 5, 650, @cat_2, '/images/products/number1.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'Aquafina 500ml (6 chai)', N'Nước tinh khiết', 28000, 0, 1200, @cat_2, '/images/products/aquafina.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'Lavie 500ml (6 chai)', N'Nước khoáng', 25000, 0, 1150, @cat_2, '/images/products/lavie.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'Trà xanh 0 độ+ 350ml (6 chai)', N'Trà xanh không đường', 48000, 10, 520, @cat_2, '/images/products/tra-0-do.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'Trà Ô Long 350ml (6 chai)', N'Trà Ô Long Tea Plus', 50000, 10, 480, @cat_2, '/images/products/tra-olong.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'C2 chanh 230ml (6 chai)', N'Trà C2 hương chanh', 38000, 5, 620, @cat_2, '/images/products/c2.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'Sữa chua uống TH 180ml (4 hộp)', N'Yogurt uống TH True', 28000, 0, 450, @cat_2, '/images/products/th-yogurt.jpg', N'lốc', 'active', DATEADD(month, -24, GETDATE())),
(N'Nước cam Teppy 1L', N'Nước ép cam 100%', 35000, 5, 380, @cat_2, '/images/products/teppy.jpg', N'chai', 'active', DATEADD(month, -24, GETDATE())),
(N'Nước ép dứa 1L', N'Nước ép dứa Malee', 42000, 5, 320, @cat_2, '/images/products/malee.jpg', N'chai', 'active', DATEADD(month, -24, GETDATE())),
(N'Nước dừa 500ml', N'Nước dừa Cocoxim', 18000, 0, 550, @cat_2, '/images/products/cocoxim.jpg', N'chai', 'active', DATEADD(month, -24, GETDATE())),
(N'RedBull 250ml (6 lon)', N'Nước tăng lực RedBull', 120000, 15, 350, @cat_2, '/images/products/redbull.jpg', N'lốc', 'active', DATEADD(month, -20, GETDATE()));

-- Mì ăn liền (60 sản phẩm)
DECLARE @counter INT = 1;
WHILE @counter <= 60
BEGIN
    INSERT INTO Products (name, description, price, discount_percent, stock, category_id, images, unit, status, created_at)
    VALUES (
        CONCAT(N'Mì ăn liền vị ', @counter),
        CONCAT(N'Mì ăn liền tiện lợi số ', @counter),
        CAST((70000 + (@counter * 500)) AS DECIMAL(10,2)),
        CASE WHEN @counter % 3 = 0 THEN 10 ELSE 5 END,
        400 + (@counter * 5),
        @cat_3,
        '/images/products/mi.jpg',
        N'thùng',
        'active',
        DATEADD(day, -@counter, GETDATE())
    );
    SET @counter = @counter + 1;
END;

-- Gia vị (50 sản phẩm)
SET @counter = 1;
WHILE @counter <= 50
BEGIN
    INSERT INTO Products (name, description, price, discount_percent, stock, category_id, images, unit, status, created_at)
    VALUES (
        CONCAT(N'Gia vị nấu ăn số ', @counter),
        CONCAT(N'Gia vị chất lượng ', @counter),
        CAST((25000 + (@counter * 1000)) AS DECIMAL(10,2)),
        CASE WHEN @counter % 4 = 0 THEN 10 WHEN @counter % 4 = 1 THEN 5 ELSE 0 END,
        300 + (@counter * 8),
        @cat_4,
        '/images/products/giavi.jpg',
        N'gói',
        'active',
        DATEADD(day, -(@counter * 2), GETDATE())
    );
    SET @counter = @counter + 1;
END;

-- Bánh kẹo snack (70 sản phẩm)
SET @counter = 1;
WHILE @counter <= 70
BEGIN
    INSERT INTO Products (name, description, price, discount_percent, stock, category_id, images, unit, status, created_at)
    VALUES (
        CONCAT(N'Snack & Bánh số ', @counter),
        CONCAT(N'Snack ngon miệng ', @counter),
        CAST((8000 + (@counter * 500)) AS DECIMAL(10,2)),
        CASE WHEN @counter % 5 = 0 THEN 15 WHEN @counter % 5 = 1 THEN 10 WHEN @counter % 5 = 2 THEN 5 ELSE 0 END,
        500 + (@counter * 10),
        @cat_5,
        '/images/products/snack.jpg',
        N'gói',
        'active',
        DATEADD(day, -(@counter * 3), GETDATE())
    );
    SET @counter = @counter + 1;
END;

-- Vệ sinh gia đình (40 sản phẩm)
SET @counter = 1;
WHILE @counter <= 40
BEGIN
    INSERT INTO Products (name, description, price, discount_percent, stock, category_id, images, unit, status, created_at)
    VALUES (
        CONCAT(N'Vệ sinh nhà cửa số ', @counter),
        CONCAT(N'Sản phẩm vệ sinh ', @counter),
        CAST((35000 + (@counter * 2000)) AS DECIMAL(10,2)),
        CASE WHEN @counter % 3 = 0 THEN 15 WHEN @counter % 3 = 1 THEN 10 ELSE 5 END,
        200 + (@counter * 5),
        @cat_6,
        '/images/products/vesinh.jpg',
        N'chai',
        'active',
        DATEADD(day, -(@counter * 4), GETDATE())
    );
    SET @counter = @counter + 1;
END;

-- Chăm sóc cá nhân (50 sản phẩm)
SET @counter = 1;
WHILE @counter <= 50
BEGIN
    INSERT INTO Products (name, description, price, discount_percent, stock, category_id, images, unit, status, created_at)
    VALUES (
        CONCAT(N'Chăm sóc cá nhân số ', @counter),
        CONCAT(N'Sản phẩm chăm sóc ', @counter),
        CAST((45000 + (@counter * 1500)) AS DECIMAL(10,2)),
        CASE WHEN @counter % 4 = 0 THEN 20 WHEN @counter % 4 = 1 THEN 15 WHEN @counter % 4 = 2 THEN 10 ELSE 5 END,
        250 + (@counter * 6),
        @cat_7,
        '/images/products/canhan.jpg',
        N'chai',
        'active',
        DATEADD(day, -(@counter * 5), GETDATE())
    );
    SET @counter = @counter + 1;
END;

PRINT 'Kiểm tra tổng số sản phẩm...';
SELECT COUNT(*) as TotalProducts FROM Products;

PRINT 'Hoàn thành thêm sản phẩm!';
GO
