-- =============================================
-- Script: Tạo đơn hàng thực tế 2 năm (2023-2025)
-- Mô phỏng: 15-20 đơn/ngày, tổng ~12,000 đơn
-- =============================================
USE SieuThiABC;
GO

PRINT 'Bắt đầu tạo đơn hàng thực tế...';
PRINT 'Thời gian: 730 ngày (2 năm)';
GO

-- Tạo đơn hàng với phân bố thực tế
DECLARE @startDate DATE = DATEADD(year, -2, GETDATE());
DECLARE @endDate DATE = GETDATE();
DECLARE @currentDate DATE = @startDate;
DECLARE @orderCount INT = 0;
DECLARE @totalOrders INT = 0;

-- Lấy danh sách user IDs và product IDs
DECLARE @userIds TABLE (id INT, row_num INT);
INSERT INTO @userIds SELECT id, ROW_NUMBER() OVER (ORDER BY id) FROM Users WHERE role = 'customer';

DECLARE @productIds TABLE (id INT, price DECIMAL(10,2), discount_percent INT, row_num INT);
INSERT INTO @productIds SELECT id, price, discount_percent, ROW_NUMBER() OVER (ORDER BY id) FROM Products;

DECLARE @totalUsers INT = (SELECT COUNT(*) FROM @userIds);
DECLARE @totalProducts INT = (SELECT COUNT(*) FROM @productIds);

PRINT CONCAT('Tổng khách hàng: ', @totalUsers);
PRINT CONCAT('Tổng sản phẩm: ', @totalProducts);

-- Loop qua từng ngày
WHILE @currentDate <= @endDate
BEGIN
    -- Số đơn hàng mỗi ngày (phân bố theo thực tế)
    SET @orderCount = CASE 
        -- Cuối tuần nhiều hơn (20-30 đơn)
        WHEN DATEPART(weekday, @currentDate) IN (1, 7) THEN 20 + ABS(CHECKSUM(NEWID())) % 11
        -- Thứ 6 khá đông (18-25 đơn)
        WHEN DATEPART(weekday, @currentDate) = 6 THEN 18 + ABS(CHECKSUM(NEWID())) % 8
        -- Ngày lễ Tết (30-50 đơn)
        WHEN (MONTH(@currentDate) = 1 AND DAY(@currentDate) <= 7) THEN 30 + ABS(CHECKSUM(NEWID())) % 21
        WHEN (MONTH(@currentDate) = 12 AND DAY(@currentDate) >= 20) THEN 35 + ABS(CHECKSUM(NEWID())) % 16
        -- Ngày thường (12-18 đơn)
        ELSE 12 + ABS(CHECKSUM(NEWID())) % 7
    END;
    
    -- Tạo đơn hàng cho ngày này
    DECLARE @i INT = 1;
    WHILE @i <= @orderCount
    BEGIN
        -- Random chọn user
        DECLARE @userId INT = (SELECT TOP 1 id FROM @userIds ORDER BY NEWID());
        
        -- Random shipping address
        DECLARE @shippingAddress NVARCHAR(500) = (
            SELECT TOP 1 address FROM Users WHERE id = @userId
        );
        
        -- Random payment method
        DECLARE @paymentMethod NVARCHAR(50) = CASE ABS(CHECKSUM(NEWID())) % 3
            WHEN 0 THEN 'COD'
            WHEN 1 THEN 'bank_transfer'
            ELSE 'momo'
        END;
        
        -- Tạo order
        DECLARE @orderDate DATETIME = DATEADD(
            MINUTE, 
            480 + (ABS(CHECKSUM(NEWID())) % 720), -- 8am - 8pm
            @currentDate
        );
        
        -- Tính total và discount
        DECLARE @subtotal DECIMAL(10,2) = 0;
        DECLARE @discountAmount DECIMAL(10,2) = 0;
        DECLARE @totalAmount DECIMAL(10,2) = 0;
        
        -- Random số lượng items trong đơn (1-8 items)
        DECLARE @itemCount INT = 1 + (ABS(CHECKSUM(NEWID())) % 8);
        
        -- Tạo temp table để lưu order items
        DECLARE @tempItems TABLE (
            product_id INT,
            quantity INT,
            price DECIMAL(10,2),
            discount_percent INT
        );
        
        -- Chọn random products
        DECLARE @j INT = 1;
        WHILE @j <= @itemCount
        BEGIN
            DECLARE @productId INT = (SELECT TOP 1 id FROM @productIds ORDER BY NEWID());
            DECLARE @quantity INT = 1 + (ABS(CHECKSUM(NEWID())) % 5); -- 1-5 sản phẩm
            DECLARE @price DECIMAL(10,2) = (SELECT price FROM @productIds WHERE id = @productId);
            DECLARE @discount INT = (SELECT discount_percent FROM @productIds WHERE id = @productId);
            
            INSERT INTO @tempItems VALUES (@productId, @quantity, @price, @discount);
            
            SET @j = @j + 1;
        END;
        
        -- Tính tổng tiền
        SELECT 
            @subtotal = SUM(price * quantity),
            @discountAmount = SUM(price * quantity * discount_percent / 100.0)
        FROM @tempItems;
        
        SET @totalAmount = @subtotal - @discountAmount;
        
        -- Random order status dựa trên thời gian
        DECLARE @orderStatus NVARCHAR(50);
        DECLARE @paymentStatus NVARCHAR(50);
        DECLARE @daysDiff INT = DATEDIFF(day, @orderDate, GETDATE());
        
        IF @daysDiff > 30 BEGIN
            -- Đơn cũ đã hoàn thành
            SET @orderStatus = 'delivered';
            SET @paymentStatus = 'paid';
        END
        ELSE IF @daysDiff > 7 BEGIN
            -- Đơn tuần trước có thể đang shipping hoặc delivered
            IF ABS(CHECKSUM(NEWID())) % 10 < 8 BEGIN
                SET @orderStatus = 'delivered';
                SET @paymentStatus = 'paid';
            END ELSE BEGIN
                SET @orderStatus = 'shipping';
                SET @paymentStatus = CASE WHEN @paymentMethod = 'COD' THEN 'pending' ELSE 'paid' END;
            END
        END
        ELSE BEGIN
            -- Đơn mới có nhiều trạng thái
            DECLARE @randStatus INT = ABS(CHECKSUM(NEWID())) % 10;
            IF @randStatus < 2 BEGIN
                SET @orderStatus = 'pending';
                SET @paymentStatus = 'pending';
            END
            ELSE IF @randStatus < 5 BEGIN
                SET @orderStatus = 'processing';
                SET @paymentStatus = CASE WHEN @paymentMethod = 'COD' THEN 'pending' ELSE 'paid' END;
            END
            ELSE IF @randStatus < 8 BEGIN
                SET @orderStatus = 'shipping';
                SET @paymentStatus = CASE WHEN @paymentMethod = 'COD' THEN 'pending' ELSE 'paid' END;
            END
            ELSE BEGIN
                SET @orderStatus = 'delivered';
                SET @paymentStatus = 'paid';
            END
        END;
        
        -- Insert order
        INSERT INTO Orders (
            user_id, total, discount, shipping_address, payment_method, 
            order_status, payment_status, note, created_at, updated_at
        ) VALUES (
            @userId, @totalAmount, @discountAmount, @shippingAddress, @paymentMethod,
            @orderStatus, @paymentStatus, NULL, @orderDate, @orderDate
        );
        
        DECLARE @orderId INT = SCOPE_IDENTITY();
        
        -- Insert order items
        INSERT INTO OrderItems (order_id, product_id, quantity, price, discount_percent)
        SELECT @orderId, product_id, quantity, price, discount_percent
        FROM @tempItems;
        
        -- Clear temp table
        DELETE FROM @tempItems;
        
        SET @i = @i + 1;
        SET @totalOrders = @totalOrders + 1;
    END;
    
    -- Tiến sang ngày tiếp theo
    SET @currentDate = DATEADD(day, 1, @currentDate);
    
    -- Print progress mỗi 30 ngày
    IF DATEPART(day, @currentDate) = 1 BEGIN
        PRINT CONCAT('Đã tạo ', @totalOrders, ' đơn hàng đến ', FORMAT(@currentDate, 'yyyy-MM-dd'));
    END;
END;

PRINT '===========================================';
PRINT CONCAT('HOÀN THÀNH! Tổng ', @totalOrders, ' đơn hàng');
PRINT '===========================================';

-- Thống kê
PRINT 'Thống kê dữ liệu:';
SELECT 
    COUNT(*) as TotalOrders,
    COUNT(DISTINCT user_id) as UniqueCustomers,
    SUM(total) as TotalRevenue,
    AVG(total) as AvgOrderValue,
    MIN(created_at) as FirstOrder,
    MAX(created_at) as LastOrder
FROM Orders;

SELECT order_status, COUNT(*) as Count 
FROM Orders 
GROUP BY order_status 
ORDER BY Count DESC;

GO
