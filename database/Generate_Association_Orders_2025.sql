-- ============================================================================
-- Script: Generate Association Orders for Year 2025
-- Mục đích: Tạo dữ liệu đơn hàng với các nhóm sản phẩm có tính kéo theo 70-80%
-- Phân bố: Đều hàng tháng trong suốt năm 2025
-- ============================================================================

USE DB_SieuThi_Hung;
GO

-- ============================================================================
-- ĐỊNH NGHĨA CÁC NHÓM SẢN PHẨM KÉO THEO (PRODUCT ASSOCIATION GROUPS)
-- Dựa trên cấu trúc database thực tế:
-- - Category 1 (Thực phẩm tươi sống): Products 551-600
-- - Category 2 (Thực phẩm khô): Products 501-550
-- - Category 3 (Đồ uống): Products 451-500
-- - Category 4 (Gia dụng): Products 351-450
-- - Category 5 (Sinh hoạt): Products 251-350
-- - Category 6 (Mẹ và bé): Products 201-250
-- - Category 7 (Điện tử): Products 151-200
-- - Category 8 (Thời trang): Products 101-150
-- - Category 9 (Văn phòng phẩm): Products 51-100
-- - Category 10 (Khác): Products 1-50
-- ============================================================================

/*
NHÓM 1: Thực phẩm tươi sống & Đồ uống (Fresh Food Bundle) - 180 đơn hàng
- Sản phẩm chính: Thực phẩm tươi (551-570)
- Sản phẩm kéo theo: Đồ uống (451-470), Thực phẩm khô (501-510)
- Tỉ lệ kéo theo: 75%

NHÓM 2: Nấu ăn hàng ngày (Daily Cooking) - 200 đơn hàng  
- Sản phẩm chính: Thực phẩm khô - Gạo, dầu ăn (510-530)
- Sản phẩm kéo theo: Gia vị, nước mắm (531-550), Đồ uống (480-490)
- Tỉ lệ kéo theo: 80%

NHÓM 3: Đồ uống & Snack (Beverages) - 150 đơn hàng
- Sản phẩm chính: Bia, Nước ngọt (460-480)
- Sản phẩm kéo theo: Snack (481-500), Thực phẩm khô (540-550)
- Tỉ lệ kéo theo: 70%

NHÓM 4: Chăm sóc cá nhân (Personal Care) - 160 đơn hàng
- Sản phẩm chính: Sinh hoạt - Dầu gội, sữa tắm (260-280)
- Sản phẩm kéo theo: Khăn giấy, kem đánh răng (290-310), Vệ sinh (320-330)
- Tỉ lệ kéo theo: 75%

NHÓM 5: Mẹ và bé (Mother & Baby) - 140 đơn hàng
- Sản phẩm chính: Tã, sữa công thức (201-220)
- Sản phẩm kéo theo: Bình sữa, khăn ướt (221-240), Đồ chơi (241-250)
- Tỉ lệ kéo theo: 80%

NHÓM 6: Gia dụng nhà bếp (Kitchen Essentials) - 170 đơn hàng
- Sản phẩm chính: Nồi, chảo (360-380)
- Sản phẩm kéo theo: Đồ nhựa (390-410), Dao kéo (420-430)
- Tỉ lệ kéo theo: 70%

NHÓM 7: Văn phòng phẩm & Học tập (Study & Office) - 120 đơn hàng
- Sản phẩm chính: Vở, bút (55-70)
- Sản phẩm kéo theo: Tẩy, thước (75-90), Keo dán (91-100)
- Tỉ lệ kéo theo: 75%

NHÓM 8: Làm sạch nhà cửa (Home Cleaning) - 180 đơn hàng
- Sản phẩm chính: Bột giặt, nước lau sàn (251-270)
- Sản phẩm kéo theo: Nước xả, túi rác (330-350), Khăn lau (310-320)
- Tỉ lệ kéo theo: 80%

Random Orders (Không theo quy tắc): 100 đơn hàng
Tổng: 1400 đơn hàng
*/

-- ============================================================================
-- TẠO BẢNG TẠM LƯU TRỮ CẤU HÌNH NHÓM SẢN PHẨM
-- ============================================================================

IF OBJECT_ID('tempdb..#ProductGroups', 'U') IS NOT NULL DROP TABLE #ProductGroups;
CREATE TABLE #ProductGroups (
    GroupID INT,
    GroupName NVARCHAR(100),
    MainProductIDs NVARCHAR(200),      -- Danh sách ID sản phẩm chính (phân tách bằng dấu phẩy)
    AssocProductIDs NVARCHAR(200),     -- Danh sách ID sản phẩm kéo theo
    AssocRate DECIMAL(3,2),            -- Tỉ lệ kéo theo (0.70 - 0.80)
    OrderCount INT,                    -- Số lượng đơn hàng cần tạo
    MinAmount DECIMAL(18,2),           -- Giá trị đơn hàng tối thiểu
    MaxAmount DECIMAL(18,2)            -- Giá trị đơn hàng tối đa
);

-- Chèn cấu hình nhóm với product_id thực tế
INSERT INTO #ProductGroups VALUES 
(1, N'Thực phẩm tươi & Đồ uống', '555,560,565,570', '451,455,460,505,510', 0.75, 180, 80000, 350000),
(2, N'Nấu ăn hàng ngày', '510,515,520,525', '535,540,545,480,485', 0.80, 200, 100000, 450000),
(3, N'Đồ uống & Snack', '465,470,475', '485,490,495,542,547', 0.70, 150, 50000, 280000),
(4, N'Chăm sóc cá nhân', '265,270,275,280', '295,300,305,325', 0.75, 160, 60000, 250000),
(5, N'Mẹ và bé', '205,210,215,220', '225,230,235,245', 0.80, 140, 150000, 600000),
(6, N'Gia dụng nhà bếp', '365,370,375,380', '395,400,405,425', 0.70, 170, 200000, 900000),
(7, N'Văn phòng phẩm', '60,65,70', '80,85,90,95', 0.75, 120, 30000, 180000),
(8, N'Làm sạch nhà cửa', '255,260,265', '335,340,345,315', 0.80, 180, 80000, 350000);

-- ============================================================================
-- HÀM HỖ TRỢ: Lấy ngày ngẫu nhiên trong năm 2025
-- ============================================================================
IF OBJECT_ID('tempdb..#RandomDates', 'U') IS NOT NULL DROP TABLE #RandomDates;
CREATE TABLE #RandomDates (
    OrderIndex INT IDENTITY(1,1),
    OrderDate DATE,
    MonthNum INT
);

-- Tạo 1500 ngày ngẫu nhiên phân bố đều trong 12 tháng năm 2025
DECLARE @month INT = 1;
DECLARE @ordersPerMonth INT;
DECLARE @i INT;

WHILE @month <= 12
BEGIN
    SET @ordersPerMonth = 120; -- Trung bình 120 đơn/tháng
    SET @i = 0;
    
    WHILE @i < @ordersPerMonth
    BEGIN
        -- Tạo ngày ngẫu nhiên trong tháng
        DECLARE @randomDay INT = ABS(CHECKSUM(NEWID())) % 28 + 1; -- 1-28 để tránh lỗi tháng 2
        DECLARE @orderDate DATE = DATEFROMPARTS(2025, @month, @randomDay);
        
        INSERT INTO #RandomDates (OrderDate, MonthNum)
        VALUES (@orderDate, @month);
        
        SET @i = @i + 1;
    END
    
    SET @month = @month + 1;
END

-- ============================================================================
-- BƯỚC 1: TẠO ĐỀ XUẤT CÁC ĐƠN HÀNG (Order Proposals)
-- ============================================================================
IF OBJECT_ID('tempdb..#OrderProposals', 'U') IS NOT NULL DROP TABLE #OrderProposals;
CREATE TABLE #OrderProposals (
    ProposalID INT IDENTITY(1,1),
    GroupID INT,
    UserID INT,
    OrderDate DATE,
    HasAssociation BIT,                -- 1: Có sản phẩm kéo theo, 0: Không có
    TotalAmount DECIMAL(18,2)
);

-- Tạo đề xuất đơn hàng cho từng nhóm
DECLARE @currentGroup INT = 1;
DECLARE @maxGroup INT = 8;
DECLARE @orderIdx INT = 1;

WHILE @currentGroup <= @maxGroup
BEGIN
    DECLARE @targetOrders INT;
    DECLARE @assocRate DECIMAL(3,2);
    DECLARE @minAmt DECIMAL(18,2);
    DECLARE @maxAmt DECIMAL(18,2);
    
    SELECT @targetOrders = OrderCount, 
           @assocRate = AssocRate,
           @minAmt = MinAmount,
           @maxAmt = MaxAmount
    FROM #ProductGroups 
    WHERE GroupID = @currentGroup;
    
    DECLARE @createdOrders INT = 0;
    
    WHILE @createdOrders < @targetOrders
    BEGIN
        -- Chọn user ngẫu nhiên (user_id từ 2-100, bỏ qua admin)
        DECLARE @randomUser INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
        
        -- Lấy ngày từ bảng RandomDates
        DECLARE @randomDate DATE;
        SELECT TOP 1 @randomDate = OrderDate 
        FROM #RandomDates 
        WHERE OrderIndex = @orderIdx;
        SET @orderIdx = @orderIdx + 1;
        
        -- Xác định có kéo theo hay không (dựa trên tỉ lệ)
        DECLARE @hasAssoc BIT = CASE 
            WHEN (ABS(CHECKSUM(NEWID())) % 100) < (@assocRate * 100) THEN 1 
            ELSE 0 
        END;
        
        -- Tính giá trị đơn hàng ngẫu nhiên
        DECLARE @amount DECIMAL(18,2) = @minAmt + (ABS(CHECKSUM(NEWID())) % (@maxAmt - @minAmt));
        
        INSERT INTO #OrderProposals (GroupID, UserID, OrderDate, HasAssociation, TotalAmount)
        VALUES (@currentGroup, @randomUser, @randomDate, @hasAssoc, @amount);
        
        SET @createdOrders = @createdOrders + 1;
    END
    
    SET @currentGroup = @currentGroup + 1;
END

-- Thêm đơn hàng random (không theo quy tắc)
DECLARE @randomOrderCount INT = 0;
WHILE @randomOrderCount < 100
BEGIN
    DECLARE @randUser INT = (ABS(CHECKSUM(NEWID())) % 99) + 2;
    DECLARE @randDate DATE;
    
    SELECT TOP 1 @randDate = OrderDate 
    FROM #RandomDates 
    WHERE OrderIndex = @orderIdx;
    SET @orderIdx = @orderIdx + 1;
    
    DECLARE @randAmount DECIMAL(18,2) = 50000 + (ABS(CHECKSUM(NEWID())) % 450000);
    
    INSERT INTO #OrderProposals (GroupID, UserID, OrderDate, HasAssociation, TotalAmount)
    VALUES (0, @randUser, @randDate, 0, @randAmount); -- GroupID = 0 cho random
    
    SET @randomOrderCount = @randomOrderCount + 1;
END

-- ============================================================================
-- BƯỚC 2: CHÈN DỮ LIỆU VÀO BẢNG ORDERS VÀ ORDERITEMS
-- ============================================================================

PRINT N'===== BẮT ĐẦU CHÈN DỮ LIỆU ĐỆ XUẤT =====';
PRINT N'Tổng số đơn hàng đề xuất: ' + CAST((SELECT COUNT(*) FROM #OrderProposals) AS NVARCHAR(10));

DECLARE @proposalID INT;
DECLARE @groupID INT;
DECLARE @userID INT;
DECLARE @orderDate DATE;
DECLARE @hasAssoc BIT;
DECLARE @totalAmt DECIMAL(18,2);
DECLARE @newOrderID INT;

DECLARE proposal_cursor CURSOR FOR 
SELECT ProposalID, GroupID, UserID, OrderDate, HasAssociation, TotalAmount
FROM #OrderProposals
ORDER BY OrderDate, ProposalID;

OPEN proposal_cursor;
FETCH NEXT FROM proposal_cursor INTO @proposalID, @groupID, @userID, @orderDate, @hasAssoc, @totalAmt;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Lấy thông tin user
    DECLARE @fullName NVARCHAR(100);
    DECLARE @phone NVARCHAR(20);
    DECLARE @address NVARCHAR(255);
    
    SELECT @fullName = full_name, @phone = phone, @address = address
    FROM dbo.Users
    WHERE id = @userID;
    
    -- Nếu không tìm thấy user, dùng giá trị mặc định
    IF @fullName IS NULL
    BEGIN
        SET @fullName = N'Khach hang ' + CAST(@userID AS NVARCHAR(10));
        SET @phone = '0900000000';
        SET @address = N'Dia chi giao hang';
    END
    
    -- Chèn đơn hàng
    INSERT INTO dbo.Orders (user_id, full_name, phone, address, total_amount, status, created_at)
    VALUES (@userID, @fullName, @phone, @address, @totalAmt, 'paid', @orderDate);
    
    SET @newOrderID = SCOPE_IDENTITY();
    
    -- Chèn OrderItems dựa trên nhóm
    IF @groupID > 0 -- Đơn hàng theo nhóm
    BEGIN
        DECLARE @mainProducts NVARCHAR(200);
        DECLARE @assocProducts NVARCHAR(200);
        
        SELECT @mainProducts = MainProductIDs, @assocProducts = AssocProductIDs
        FROM #ProductGroups
        WHERE GroupID = @groupID;
        
        -- Thêm 1-2 sản phẩm chính
        DECLARE @mainCount INT = (ABS(CHECKSUM(NEWID())) % 2) + 1; -- 1 hoặc 2 sản phẩm
        DECLARE @remainingAmount DECIMAL(18,2) = @totalAmt;
        
        DECLARE @productCounter INT = 0;
        WHILE @productCounter < @mainCount
        BEGIN
            -- Chọn product_id ngẫu nhiên từ danh sách chính
            DECLARE @mainProdList TABLE (ProductID INT);
            INSERT INTO @mainProdList
            SELECT value FROM STRING_SPLIT(@mainProducts, ',');
            
            DECLARE @selectedMainProd INT;
            SELECT TOP 1 @selectedMainProd = ProductID 
            FROM @mainProdList 
            ORDER BY NEWID();
            
            -- Kiểm tra product có tồn tại không
            DECLARE @productPrice DECIMAL(18,2);
            SELECT @productPrice = price FROM dbo.Products WHERE id = @selectedMainProd;
            
            IF @productPrice IS NULL
                SET @productPrice = 100000; -- Giá mặc định nếu không tìm thấy
            
            DECLARE @quantity INT = (ABS(CHECKSUM(NEWID())) % 3) + 1; -- 1-3 sản phẩm
            DECLARE @itemTotal DECIMAL(18,2) = @productPrice * @quantity;
            
            -- Đảm bảo không vượt quá tổng số tiền
            IF @itemTotal > @remainingAmount * 0.6
                SET @itemTotal = @remainingAmount * 0.6;
            
            INSERT INTO dbo.OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@newOrderID, @selectedMainProd, @quantity, @productPrice, @itemTotal);
            
            SET @remainingAmount = @remainingAmount - @itemTotal;
            DELETE FROM @mainProdList;
            SET @productCounter = @productCounter + 1;
        END
        
        -- Thêm sản phẩm kéo theo nếu HasAssociation = 1
        IF @hasAssoc = 1 AND @remainingAmount > 0
        BEGIN
            DECLARE @assocCount INT = (ABS(CHECKSUM(NEWID())) % 3) + 1; -- 1-3 sản phẩm kéo theo
            DECLARE @assocCounter INT = 0;
            
            WHILE @assocCounter < @assocCount AND @remainingAmount > 10000
            BEGIN
                DECLARE @assocProdList TABLE (ProductID INT);
                INSERT INTO @assocProdList
                SELECT value FROM STRING_SPLIT(@assocProducts, ',');
                
                DECLARE @selectedAssocProd INT;
                SELECT TOP 1 @selectedAssocProd = ProductID 
                FROM @assocProdList 
                ORDER BY NEWID();
                
                DECLARE @assocPrice DECIMAL(18,2);
                SELECT @assocPrice = price FROM dbo.Products WHERE id = @selectedAssocProd;
                
                IF @assocPrice IS NULL
                    SET @assocPrice = 50000;
                
                DECLARE @assocQty INT = (ABS(CHECKSUM(NEWID())) % 2) + 1; -- 1-2 sản phẩm
                DECLARE @assocTotal DECIMAL(18,2) = @assocPrice * @assocQty;
                
                IF @assocTotal > @remainingAmount
                    SET @assocTotal = @remainingAmount;
                
                INSERT INTO dbo.OrderItems (order_id, product_id, quantity, price, total_price)
                VALUES (@newOrderID, @selectedAssocProd, @assocQty, @assocPrice, @assocTotal);
                
                SET @remainingAmount = @remainingAmount - @assocTotal;
                DELETE FROM @assocProdList;
                SET @assocCounter = @assocCounter + 1;
            END
        END
    END
    ELSE -- Đơn hàng random
    BEGIN
        -- Chọn 1-4 sản phẩm ngẫu nhiên
        DECLARE @randomProdCount INT = (ABS(CHECKSUM(NEWID())) % 4) + 1;
        DECLARE @randCounter INT = 0;
        DECLARE @randRemaining DECIMAL(18,2) = @totalAmt;
        
        WHILE @randCounter < @randomProdCount AND @randRemaining > 0
        BEGIN
            -- Chọn product_id ngẫu nhiên từ 1-600
            DECLARE @randProdID INT = (ABS(CHECKSUM(NEWID())) % 600) + 1;
            
            DECLARE @randPrice DECIMAL(18,2);
            SELECT @randPrice = price FROM dbo.Products WHERE id = @randProdID;
            
            IF @randPrice IS NOT NULL -- Chỉ thêm nếu sản phẩm tồn tại
            BEGIN
                DECLARE @randQty INT = (ABS(CHECKSUM(NEWID())) % 3) + 1;
                DECLARE @randTotal DECIMAL(18,2) = @randPrice * @randQty;
                
                IF @randTotal > @randRemaining
                    SET @randTotal = @randRemaining;
                
                INSERT INTO dbo.OrderItems (order_id, product_id, quantity, price, total_price)
                VALUES (@newOrderID, @randProdID, @randQty, @randPrice, @randTotal);
                
                SET @randRemaining = @randRemaining - @randTotal;
            END
            
            SET @randCounter = @randCounter + 1;
        END
    END
    
    -- In tiến trình mỗi 100 đơn
    IF @proposalID % 100 = 0
        PRINT N'Đã xử lý: ' + CAST(@proposalID AS NVARCHAR(10)) + N' đơn hàng';
    
    FETCH NEXT FROM proposal_cursor INTO @proposalID, @groupID, @userID, @orderDate, @hasAssoc, @totalAmt;
END

CLOSE proposal_cursor;
DEALLOCATE proposal_cursor;

-- ============================================================================
-- BƯỚC 3: THỐNG KÊ KẾT QUẢ
-- ============================================================================

PRINT N'';
PRINT N'===== THỐNG KÊ KẾT QUẢ =====';

-- Tổng số đơn hàng đã tạo
DECLARE @totalOrders INT;
SELECT @totalOrders = COUNT(*) 
FROM dbo.Orders 
WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01';

PRINT N'Tổng số đơn hàng năm 2025: ' + CAST(@totalOrders AS NVARCHAR(10));

-- Thống kê theo tháng
PRINT N'';
PRINT N'Phân bố đơn hàng theo tháng:';
SELECT 
    MONTH(created_at) AS Thang,
    COUNT(*) AS SoDonHang,
    FORMAT(SUM(total_amount), 'N0') + ' VND' AS TongDoanhThu
FROM dbo.Orders
WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01'
GROUP BY MONTH(created_at)
ORDER BY Thang;

-- Thống kê theo nhóm (dựa trên OrderItems)
PRINT N'';
PRINT N'Phân tích tỉ lệ kéo theo (dự kiến):';
SELECT 
    GroupName,
    OrderCount AS SoDonMucTieu,
    CAST(AssocRate * 100 AS DECIMAL(5,2)) AS TiLeKeoTheo
FROM #ProductGroups
ORDER BY GroupID;

-- Tổng giá trị đơn hàng năm 2025
DECLARE @totalRevenue DECIMAL(18,2);
SELECT @totalRevenue = SUM(total_amount)
FROM dbo.Orders
WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01';

PRINT N'';
PRINT N'Tổng doanh thu năm 2025: ' + FORMAT(@totalRevenue, 'N0') + ' VND';
PRINT N'Giá trị trung bình mỗi đơn: ' + FORMAT(@totalRevenue / NULLIF(@totalOrders, 0), 'N0') + ' VND';

-- ============================================================================
-- DỌN DẸP BẢNG TẠM
-- ============================================================================
DROP TABLE #ProductGroups;
DROP TABLE #RandomDates;
DROP TABLE #OrderProposals;

PRINT N'';
PRINT N'===== HOÀN THÀNH =====';
GO
