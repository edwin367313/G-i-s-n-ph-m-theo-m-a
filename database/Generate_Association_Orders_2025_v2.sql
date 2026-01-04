-- ============================================================================
-- Script: Generate Association Orders for Year 2025 (Version 2 - Fixed)
-- Mục đích: Tạo dữ liệu đơn hàng với các nhóm sản phẩm có tính kéo theo 70-80%
-- Phân bố: Đều hàng tháng trong suốt năm 2025
-- Tổng đơn: 1400 đơn hàng
-- ============================================================================

USE DB_SieuThi_Hung;
GO

PRINT N'===== BẮT ĐẦU TẠO DỮ LIỆU ĐƠN HÀNG NĂM 2025 =====';
PRINT N'Thời gian bắt đầu: ' + CONVERT(NVARCHAR(50), GETDATE(), 120);
GO

-- ============================================================================
-- XÁC ĐỊNH CÁC NHÓM SẢN PHẨM VÀ SẢNPHẨM KÉO THEO
-- ============================================================================

-- Nhóm 1: Thực phẩm tươi & Đồ uống (180 đơn)
-- Nhóm 2: Nấu ăn hàng ngày (200 đơn)
-- Nhóm 3: Đồ uống & Snack (150 đơn)
-- Nhóm 4: Chăm sóc cá nhân (160 đơn)
-- Nhóm 5: Mẹ và bé (140 đơn)
-- Nhóm 6: Gia dụng nhà bếp (170 đơn)
-- Nhóm 7: Văn phòng phẩm (120 đơn)
-- Nhóm 8: Làm sạch nhà cửa (180 đơn)
-- Nhóm 9: Random orders (100 đơn)

-- ============================================================================
-- NHÓM 1: THỰC PHẨM TƯƠI & ĐỒ UỐNG (180 đơn, tỉ lệ kéo theo 75%)
-- ============================================================================
PRINT N'';
PRINT N'[1/9] Đang tạo nhóm Thực phẩm tươi & Đồ uống (180 đơn)...';

DECLARE @counter INT = 0;
DECLARE @targetCount INT = 180;
DECLARE @withAssoc INT = CAST(@targetCount * 0.75 AS INT); -- 135 đơn có kéo theo

WHILE @counter < @targetCount
BEGIN
    DECLARE @userId INT = (ABS(CHECKSUM(NEWID())) % 99) + 2; -- User 2-100
    DECLARE @month INT = (ABS(CHECKSUM(NEWID())) % 12) + 1;
    DECLARE @day INT = (ABS(CHECKSUM(NEWID())) % 28) + 1;
    DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @day);
    
    -- Tạo đơn hàng
    DECLARE @totalAmount DECIMAL(18,2) = 80000 + (ABS(CHECKSUM(NEWID())) % 270000);
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    SELECT @userId, full_name, phone, address, @totalAmount, 'paid', @orderDate
    FROM Users WHERE id = @userId;
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Thêm 1-2 sản phẩm chính (Thực phẩm tươi: 555-570)
    DECLARE @mainProdId INT = 555 + (ABS(CHECKSUM(NEWID())) % 16);
    DECLARE @mainQty INT = (ABS(CHECKSUM(NEWID())) % 3) + 1;
    DECLARE @mainPrice DECIMAL(18,2);
    SELECT @mainPrice = price FROM Products WHERE id = @mainProdId;
    
    IF @mainPrice IS NOT NULL
    BEGIN
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@orderId, @mainProdId, @mainQty, @mainPrice, @mainPrice * @mainQty);
    END
    
    -- Thêm sản phẩm kéo theo nếu thuộc 75%
    IF @counter < @withAssoc
    BEGIN
        -- Đồ uống (451-460)
        DECLARE @assocProd1 INT = 451 + (ABS(CHECKSUM(NEWID())) % 10);
        DECLARE @assocPrice1 DECIMAL(18,2);
        SELECT @assocPrice1 = price FROM Products WHERE id = @assocProd1;
        
        IF @assocPrice1 IS NOT NULL
        BEGIN
            DECLARE @assocQty1 INT = (ABS(CHECKSUM(NEWID())) % 2) + 1;
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd1, @assocQty1, @assocPrice1, @assocPrice1 * @assocQty1);
        END
        
        -- Thực phẩm khô (505-515)
        DECLARE @assocProd2 INT = 505 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice2 DECIMAL(18,2);
        SELECT @assocPrice2 = price FROM Products WHERE id = @assocProd2;
        
        IF @assocPrice2 IS NOT NULL
        BEGIN
            DECLARE @assocQty2 INT = (ABS(CHECKSUM(NEWID())) % 2) + 1;
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd2, @assocQty2, @assocPrice2, @assocPrice2 * @assocQty2);
        END
    END
    
    SET @counter = @counter + 1;
END

PRINT N'✓ Hoàn thành nhóm 1: ' + CAST(@targetCount AS NVARCHAR(10)) + N' đơn hàng';
GO

-- ============================================================================
-- NHÓM 2: NẤU ĂN HÀNG NGÀY (200 đơn, tỉ lệ kéo theo 80%)
-- ============================================================================
PRINT N'';
PRINT N'[2/9] Đang tạo nhóm Nấu ăn hàng ngày (200 đơn)...';

DECLARE @counter INT = 0;
DECLARE @targetCount INT = 200;
DECLARE @withAssoc INT = CAST(@targetCount * 0.80 AS INT);

WHILE @counter < @targetCount
BEGIN
    DECLARE @userId INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
    DECLARE @month INT = (ABS(CHECKSUM(NEWID())) % 12) + 1;
    DECLARE @day INT = (ABS(CHECKSUM(NEWID())) % 28) + 1;
    DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @day);
    DECLARE @totalAmount DECIMAL(18,2) = 100000 + (ABS(CHECKSUM(NEWID())) % 350000);
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    SELECT @userId, full_name, phone, address, @totalAmount, 'paid', @orderDate
    FROM Users WHERE id = @userId;
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Sản phẩm chính: Thực phẩm khô (510-525)
    DECLARE @mainProdId INT = 510 + (ABS(CHECKSUM(NEWID())) % 16);
    DECLARE @mainQty INT = (ABS(CHECKSUM(NEWID())) % 3) + 1;
    DECLARE @mainPrice DECIMAL(18,2);
    SELECT @mainPrice = price FROM Products WHERE id = @mainProdId;
    
    IF @mainPrice IS NOT NULL
    BEGIN
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@orderId, @mainProdId, @mainQty, @mainPrice, @mainPrice * @mainQty);
    END
    
    -- Sản phẩm kéo theo nếu thuộc 80%
    IF @counter < @withAssoc
    BEGIN
        -- Gia vị (535-545)
        DECLARE @assocProd1 INT = 535 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice1 DECIMAL(18,2);
        SELECT @assocPrice1 = price FROM Products WHERE id = @assocProd1;
        
        IF @assocPrice1 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd1, 1, @assocPrice1, @assocPrice1);
        END
        
        -- Đồ uống (480-490)
        DECLARE @assocProd2 INT = 480 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice2 DECIMAL(18,2);
        SELECT @assocPrice2 = price FROM Products WHERE id = @assocProd2;
        
        IF @assocPrice2 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd2, 1, @assocPrice2, @assocPrice2);
        END
    END
    
    SET @counter = @counter + 1;
END

PRINT N'✓ Hoàn thành nhóm 2: ' + CAST(@targetCount AS NVARCHAR(10)) + N' đơn hàng';
GO

-- ============================================================================
-- NHÓM 3: ĐỒ UỐNG & SNACK (150 đơn, tỉ lệ kéo theo 70%)
-- ============================================================================
PRINT N'';
PRINT N'[3/9] Đang tạo nhóm Đồ uống & Snack (150 đơn)...';

DECLARE @counter INT = 0;
DECLARE @targetCount INT = 150;
DECLARE @withAssoc INT = CAST(@targetCount * 0.70 AS INT);

WHILE @counter < @targetCount
BEGIN
    DECLARE @userId INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
    DECLARE @month INT = (ABS(CHECKSUM(NEWID())) % 12) + 1;
    DECLARE @day INT = (ABS(CHECKSUM(NEWID())) % 28) + 1;
    DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @day);
    DECLARE @totalAmount DECIMAL(18,2) = 50000 + (ABS(CHECKSUM(NEWID())) % 230000);
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    SELECT @userId, full_name, phone, address, @totalAmount, 'paid', @orderDate
    FROM Users WHERE id = @userId;
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Đồ uống chính (465-475)
    DECLARE @mainProdId INT = 465 + (ABS(CHECKSUM(NEWID())) % 11);
    DECLARE @mainQty INT = (ABS(CHECKSUM(NEWID())) % 4) + 1;
    DECLARE @mainPrice DECIMAL(18,2);
    SELECT @mainPrice = price FROM Products WHERE id = @mainProdId;
    
    IF @mainPrice IS NOT NULL
    BEGIN
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@orderId, @mainProdId, @mainQty, @mainPrice, @mainPrice * @mainQty);
    END
    
    IF @counter < @withAssoc
    BEGIN
        -- Snack (485-495)
        DECLARE @assocProd1 INT = 485 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice1 DECIMAL(18,2);
        SELECT @assocPrice1 = price FROM Products WHERE id = @assocProd1;
        
        IF @assocPrice1 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd1, 2, @assocPrice1, @assocPrice1 * 2);
        END
    END
    
    SET @counter = @counter + 1;
END

PRINT N'✓ Hoàn thành nhóm 3: ' + CAST(@targetCount AS NVARCHAR(10)) + N' đơn hàng';
GO

-- ============================================================================
-- NHÓM 4: CHĂM SÓC CÁ NHÂN (160 đơn, tỉ lệ kéo theo 75%)
-- ============================================================================
PRINT N'';
PRINT N'[4/9] Đang tạo nhóm Chăm sóc cá nhân (160 đơn)...';

DECLARE @counter INT = 0;
DECLARE @targetCount INT = 160;
DECLARE @withAssoc INT = CAST(@targetCount * 0.75 AS INT);

WHILE @counter < @targetCount
BEGIN
    DECLARE @userId INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
    DECLARE @month INT = (ABS(CHECKSUM(NEWID())) % 12) + 1;
    DECLARE @day INT = (ABS(CHECKSUM(NEWID())) % 28) + 1;
    DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @day);
    DECLARE @totalAmount DECIMAL(18,2) = 60000 + (ABS(CHECKSUM(NEWID())) % 190000);
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    SELECT @userId, full_name, phone, address, @totalAmount, 'paid', @orderDate
    FROM Users WHERE id = @userId;
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Dầu gội, sữa tắm (265-280)
    DECLARE @mainProdId INT = 265 + (ABS(CHECKSUM(NEWID())) % 16);
    DECLARE @mainQty INT = (ABS(CHECKSUM(NEWID())) % 2) + 1;
    DECLARE @mainPrice DECIMAL(18,2);
    SELECT @mainPrice = price FROM Products WHERE id = @mainProdId;
    
    IF @mainPrice IS NOT NULL
    BEGIN
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@orderId, @mainProdId, @mainQty, @mainPrice, @mainPrice * @mainQty);
    END
    
    IF @counter < @withAssoc
    BEGIN
        -- Kem đánh răng, khăn giấy (295-305)
        DECLARE @assocProd1 INT = 295 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice1 DECIMAL(18,2);
        SELECT @assocPrice1 = price FROM Products WHERE id = @assocProd1;
        
        IF @assocPrice1 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd1, 1, @assocPrice1, @assocPrice1);
        END
        
        -- Vệ sinh (320-330)
        DECLARE @assocProd2 INT = 320 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice2 DECIMAL(18,2);
        SELECT @assocPrice2 = price FROM Products WHERE id = @assocProd2;
        
        IF @assocPrice2 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd2, 1, @assocPrice2, @assocPrice2);
        END
    END
    
    SET @counter = @counter + 1;
END

PRINT N'✓ Hoàn thành nhóm 4: ' + CAST(@targetCount AS NVARCHAR(10)) + N' đơn hàng';
GO

-- ============================================================================
-- NHÓM 5: MẸ VÀ BÉ (140 đơn, tỉ lệ kéo theo 80%)
-- ============================================================================
PRINT N'';
PRINT N'[5/9] Đang tạo nhóm Mẹ và bé (140 đơn)...';

DECLARE @counter INT = 0;
DECLARE @targetCount INT = 140;
DECLARE @withAssoc INT = CAST(@targetCount * 0.80 AS INT);

WHILE @counter < @targetCount
BEGIN
    DECLARE @userId INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
    DECLARE @month INT = (ABS(CHECKSUM(NEWID())) % 12) + 1;
    DECLARE @day INT = (ABS(CHECKSUM(NEWID())) % 28) + 1;
    DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @day);
    DECLARE @totalAmount DECIMAL(18,2) = 150000 + (ABS(CHECKSUM(NEWID())) % 450000);
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    SELECT @userId, full_name, phone, address, @totalAmount, 'paid', @orderDate
    FROM Users WHERE id = @userId;
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Tã, sữa công thức (205-220)
    DECLARE @mainProdId INT = 205 + (ABS(CHECKSUM(NEWID())) % 16);
    DECLARE @mainQty INT = (ABS(CHECKSUM(NEWID())) % 3) + 1;
    DECLARE @mainPrice DECIMAL(18,2);
    SELECT @mainPrice = price FROM Products WHERE id = @mainProdId;
    
    IF @mainPrice IS NOT NULL
    BEGIN
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@orderId, @mainProdId, @mainQty, @mainPrice, @mainPrice * @mainQty);
    END
    
    IF @counter < @withAssoc
    BEGIN
        -- Bình sữa, khăn ướt (225-235)
        DECLARE @assocProd1 INT = 225 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice1 DECIMAL(18,2);
        SELECT @assocPrice1 = price FROM Products WHERE id = @assocProd1;
        
        IF @assocPrice1 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd1, 2, @assocPrice1, @assocPrice1 * 2);
        END
        
        -- Đồ chơi (241-245)
        DECLARE @assocProd2 INT = 241 + (ABS(CHECKSUM(NEWID())) % 5);
        DECLARE @assocPrice2 DECIMAL(18,2);
        SELECT @assocPrice2 = price FROM Products WHERE id = @assocProd2;
        
        IF @assocPrice2 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd2, 1, @assocPrice2, @assocPrice2);
        END
    END
    
    SET @counter = @counter + 1;
END

PRINT N'✓ Hoàn thành nhóm 5: ' + CAST(@targetCount AS NVARCHAR(10)) + N' đơn hàng';
GO

-- ============================================================================
-- NHÓM 6: GIA DỤNG NHÀ BẾP (170 đơn, tỉ lệ kéo theo 70%)
-- ============================================================================
PRINT N'';
PRINT N'[6/9] Đang tạo nhóm Gia dụng nhà bếp (170 đơn)...';

DECLARE @counter INT = 0;
DECLARE @targetCount INT = 170;
DECLARE @withAssoc INT = CAST(@targetCount * 0.70 AS INT);

WHILE @counter < @targetCount
BEGIN
    DECLARE @userId INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
    DECLARE @month INT = (ABS(CHECKSUM(NEWID())) % 12) + 1;
    DECLARE @day INT = (ABS(CHECKSUM(NEWID())) % 28) + 1;
    DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @day);
    DECLARE @totalAmount DECIMAL(18,2) = 200000 + (ABS(CHECKSUM(NEWID())) % 700000);
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    SELECT @userId, full_name, phone, address, @totalAmount, 'paid', @orderDate
    FROM Users WHERE id = @userId;
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Nồi, chảo (365-380)
    DECLARE @mainProdId INT = 365 + (ABS(CHECKSUM(NEWID())) % 16);
    DECLARE @mainQty INT = 1;
    DECLARE @mainPrice DECIMAL(18,2);
    SELECT @mainPrice = price FROM Products WHERE id = @mainProdId;
    
    IF @mainPrice IS NOT NULL
    BEGIN
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@orderId, @mainProdId, @mainQty, @mainPrice, @mainPrice * @mainQty);
    END
    
    IF @counter < @withAssoc
    BEGIN
        -- Đồ nhựa (395-405)
        DECLARE @assocProd1 INT = 395 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice1 DECIMAL(18,2);
        SELECT @assocPrice1 = price FROM Products WHERE id = @assocProd1;
        
        IF @assocPrice1 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd1, 2, @assocPrice1, @assocPrice1 * 2);
        END
        
        -- Dao kéo (420-425)
        DECLARE @assocProd2 INT = 420 + (ABS(CHECKSUM(NEWID())) % 6);
        DECLARE @assocPrice2 DECIMAL(18,2);
        SELECT @assocPrice2 = price FROM Products WHERE id = @assocProd2;
        
        IF @assocPrice2 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd2, 1, @assocPrice2, @assocPrice2);
        END
    END
    
    SET @counter = @counter + 1;
END

PRINT N'✓ Hoàn thành nhóm 6: ' + CAST(@targetCount AS NVARCHAR(10)) + N' đơn hàng';
GO

-- ============================================================================
-- NHÓM 7: VĂN PHÒNG PHẨM (120 đơn, tỉ lệ kéo theo 75%)
-- ============================================================================
PRINT N'';
PRINT N'[7/9] Đang tạo nhóm Văn phòng phẩm (120 đơn)...';

DECLARE @counter INT = 0;
DECLARE @targetCount INT = 120;
DECLARE @withAssoc INT = CAST(@targetCount * 0.75 AS INT);

WHILE @counter < @targetCount
BEGIN
    DECLARE @userId INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
    DECLARE @month INT = (ABS(CHECKSUM(NEWID())) % 12) + 1;
    DECLARE @day INT = (ABS(CHECKSUM(NEWID())) % 28) + 1;
    DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @day);
    DECLARE @totalAmount DECIMAL(18,2) = 30000 + (ABS(CHECKSUM(NEWID())) % 150000);
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    SELECT @userId, full_name, phone, address, @totalAmount, 'paid', @orderDate
    FROM Users WHERE id = @userId;
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Vở, bút (60-70)
    DECLARE @mainProdId INT = 60 + (ABS(CHECKSUM(NEWID())) % 11);
    DECLARE @mainQty INT = (ABS(CHECKSUM(NEWID())) % 5) + 1;
    DECLARE @mainPrice DECIMAL(18,2);
    SELECT @mainPrice = price FROM Products WHERE id = @mainProdId;
    
    IF @mainPrice IS NOT NULL
    BEGIN
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@orderId, @mainProdId, @mainQty, @mainPrice, @mainPrice * @mainQty);
    END
    
    IF @counter < @withAssoc
    BEGIN
        -- Tẩy, thước (80-90)
        DECLARE @assocProd1 INT = 80 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice1 DECIMAL(18,2);
        SELECT @assocPrice1 = price FROM Products WHERE id = @assocProd1;
        
        IF @assocPrice1 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd1, 2, @assocPrice1, @assocPrice1 * 2);
        END
        
        -- Keo dán (91-95)
        DECLARE @assocProd2 INT = 91 + (ABS(CHECKSUM(NEWID())) % 5);
        DECLARE @assocPrice2 DECIMAL(18,2);
        SELECT @assocPrice2 = price FROM Products WHERE id = @assocProd2;
        
        IF @assocPrice2 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd2, 1, @assocPrice2, @assocPrice2);
        END
    END
    
    SET @counter = @counter + 1;
END

PRINT N'✓ Hoàn thành nhóm 7: ' + CAST(@targetCount AS NVARCHAR(10)) + N' đơn hàng';
GO

-- ============================================================================
-- NHÓM 8: LÀM SẠCH NHÀ CỬA (180 đơn, tỉ lệ kéo theo 80%)
-- ============================================================================
PRINT N'';
PRINT N'[8/9] Đang tạo nhóm Làm sạch nhà cửa (180 đơn)...';

DECLARE @counter INT = 0;
DECLARE @targetCount INT = 180;
DECLARE @withAssoc INT = CAST(@targetCount * 0.80 AS INT);

WHILE @counter < @targetCount
BEGIN
    DECLARE @userId INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
    DECLARE @month INT = (ABS(CHECKSUM(NEWID())) % 12) + 1;
    DECLARE @day INT = (ABS(CHECKSUM(NEWID())) % 28) + 1;
    DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @day);
    DECLARE @totalAmount DECIMAL(18,2) = 80000 + (ABS(CHECKSUM(NEWID())) % 270000);
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    SELECT @userId, full_name, phone, address, @totalAmount, 'paid', @orderDate
    FROM Users WHERE id = @userId;
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Bột giặt, nước lau sàn (255-265)
    DECLARE @mainProdId INT = 255 + (ABS(CHECKSUM(NEWID())) % 11);
    DECLARE @mainQty INT = (ABS(CHECKSUM(NEWID())) % 3) + 1;
    DECLARE @mainPrice DECIMAL(18,2);
    SELECT @mainPrice = price FROM Products WHERE id = @mainProdId;
    
    IF @mainPrice IS NOT NULL
    BEGIN
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@orderId, @mainProdId, @mainQty, @mainPrice, @mainPrice * @mainQty);
    END
    
    IF @counter < @withAssoc
    BEGIN
        -- Nước xả, túi rác (335-345)
        DECLARE @assocProd1 INT = 335 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice1 DECIMAL(18,2);
        SELECT @assocPrice1 = price FROM Products WHERE id = @assocProd1;
        
        IF @assocPrice1 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd1, 2, @assocPrice1, @assocPrice1 * 2);
        END
        
        -- Khăn lau (310-320)
        DECLARE @assocProd2 INT = 310 + (ABS(CHECKSUM(NEWID())) % 11);
        DECLARE @assocPrice2 DECIMAL(18,2);
        SELECT @assocPrice2 = price FROM Products WHERE id = @assocProd2;
        
        IF @assocPrice2 IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @assocProd2, 1, @assocPrice2, @assocPrice2);
        END
    END
    
    SET @counter = @counter + 1;
END

PRINT N'✓ Hoàn thành nhóm 8: ' + CAST(@targetCount AS NVARCHAR(10)) + N' đơn hàng';
GO

-- ============================================================================
-- NHÓM 9: RANDOM ORDERS (100 đơn - Không theo quy tắc)
-- ============================================================================
PRINT N'';
PRINT N'[9/9] Đang tạo nhóm Random (100 đơn)...';

DECLARE @counter INT = 0;
DECLARE @targetCount INT = 100;

WHILE @counter < @targetCount
BEGIN
    DECLARE @userId INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
    DECLARE @month INT = (ABS(CHECKSUM(NEWID())) % 12) + 1;
    DECLARE @day INT = (ABS(CHECKSUM(NEWID())) % 28) + 1;
    DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @day);
    DECLARE @totalAmount DECIMAL(18,2) = 50000 + (ABS(CHECKSUM(NEWID())) % 450000);
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    SELECT @userId, full_name, phone, address, @totalAmount, 'paid', @orderDate
    FROM Users WHERE id = @userId;
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Thêm 2-4 sản phẩm ngẫu nhiên
    DECLARE @itemCount INT = (ABS(CHECKSUM(NEWID())) % 3) + 2;
    DECLARE @itemCounter INT = 0;
    
    WHILE @itemCounter < @itemCount
    BEGIN
        DECLARE @randomProd INT = (ABS(CHECKSUM(NEWID())) % 630) + 1;
        DECLARE @randomQty INT = (ABS(CHECKSUM(NEWID())) % 3) + 1;
        DECLARE @randomPrice DECIMAL(18,2);
        
        SELECT @randomPrice = price FROM Products WHERE id = @randomProd;
        
        IF @randomPrice IS NOT NULL
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@orderId, @randomProd, @randomQty, @randomPrice, @randomPrice * @randomQty);
        END
        
        SET @itemCounter = @itemCounter + 1;
    END
    
    SET @counter = @counter + 1;
END

PRINT N'✓ Hoàn thành nhóm 9: ' + CAST(@targetCount AS NVARCHAR(10)) + N' đơn hàng';
GO

-- ============================================================================
-- THỐNG KÊ KẾT QUẢ
-- ============================================================================
PRINT N'';
PRINT N'===== THỐNG KÊ KẾT QUẢ =====';

-- Tổng số đơn hàng năm 2025
DECLARE @total2025 INT;
SELECT @total2025 = COUNT(*) 
FROM Orders 
WHERE YEAR(created_at) = 2025;

PRINT N'Tổng số đơn hàng năm 2025: ' + CAST(@total2025 AS NVARCHAR(10));

-- Doanh thu năm 2025
DECLARE @revenue2025 DECIMAL(18,2);
SELECT @revenue2025 = SUM(total_amount)
FROM Orders
WHERE YEAR(created_at) = 2025;

PRINT N'Tổng doanh thu năm 2025: ' + FORMAT(@revenue2025, 'N0') + N' VND';
PRINT N'Giá trị trung bình/đơn: ' + FORMAT(@revenue2025 / NULLIF(@total2025, 0), 'N0') + N' VND';

-- Phân bố theo tháng
PRINT N'';
PRINT N'Phân bố đơn hàng theo tháng:';
SELECT 
    MONTH(created_at) AS Thang,
    COUNT(*) AS SoDonHang,
    FORMAT(SUM(total_amount), 'N0') + ' VND' AS DoanhThu
FROM Orders
WHERE YEAR(created_at) = 2025
GROUP BY MONTH(created_at)
ORDER BY Thang;

PRINT N'';
PRINT N'===== HOÀN TẤT TẠO DỮ LIỆU =====';
PRINT N'Thời gian kết thúc: ' + CONVERT(NVARCHAR(50), GETDATE(), 120);
GO
