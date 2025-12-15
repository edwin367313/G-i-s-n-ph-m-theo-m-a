-- =============================================
-- Script: Tạo đơn hàng thực tế 2 năm (2023-2025)
-- Mô phỏng: 15-20 đơn/ngày, tổng ~12,000 đơn
-- FIX: Sử dụng DATETIME thay vì DATE, thêm DEFAULT values
-- =============================================
USE SieuThiABC;
GO

PRINT 'Bắt đầu tạo đơn hàng thực tế...';
PRINT 'Thời gian: 730 ngày (2 năm)';
GO

-- Tạo đơn hàng với phân bố thực tế
DECLARE @startDate DATETIME = DATEADD(year, -2, GETDATE());
DECLARE @endDate DATETIME = GETDATE();
DECLARE @currentDate DATETIME = @startDate;
DECLARE @orderCount INT = 0;
DECLARE @totalOrders INT = 0;

-- Lấy danh sách user IDs và product IDs
DECLARE @userIds TABLE (id INT, address NVARCHAR(500), row_num INT);
INSERT INTO @userIds SELECT id, address, ROW_NUMBER() OVER (ORDER BY id) FROM Users WHERE role = 'customer';

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
        
        -- Random shipping address từ user đã chọn
        DECLARE @shippingAddress NVARCHAR(500) = (
            SELECT TOP 1 COALESCE(address, N'123 Nguyễn Văn Cừ, Q5, TP.HCM') 
            FROM @userIds 
            WHERE id = @userId
        );
        
        -- Random payment method
        DECLARE @paymentMethod NVARCHAR(50) = CASE ABS(CHECKSUM(NEWID())) % 3
            WHEN 0 THEN 'COD'
            WHEN 1 THEN 'bank_transfer'
            ELSE 'momo'
        END;
        
        -- Tạo order datetime (8am - 8pm)
        DECLARE @orderDateTime DATETIME = DATEADD(
            MINUTE, 
            480 + (ABS(CHECKSUM(NEWID())) % 720), 
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
        
        -- Tính subtotal và discount
        SELECT 
            @subtotal = SUM(quantity * price),
            @discountAmount = SUM(quantity * price * discount_percent / 100.0)
        FROM @tempItems;
        
        SET @totalAmount = @subtotal - @discountAmount;
        
        -- Xác định order status dựa trên thời gian
        DECLARE @orderStatus NVARCHAR(50);
        DECLARE @paymentStatus NVARCHAR(50);
        DECLARE @daysOld INT = DATEDIFF(day, @orderDateTime, GETDATE());
        
        IF @daysOld > 60 
        BEGIN
            -- Đơn cũ: đã giao và thanh toán
            SET @orderStatus = 'delivered';
            SET @paymentStatus = 'paid';
        END
        ELSE IF @daysOld > 30
        BEGIN
            -- Đơn trung bình: 80% delivered, 20% shipping
            IF (ABS(CHECKSUM(NEWID())) % 10) < 8
            BEGIN
                SET @orderStatus = 'delivered';
                SET @paymentStatus = 'paid';
            END
            ELSE
            BEGIN
                SET @orderStatus = 'shipping';
                SET @paymentStatus = CASE WHEN @paymentMethod = 'COD' THEN 'pending' ELSE 'paid' END;
            END
        END
        ELSE
        BEGIN
            -- Đơn mới: mix các trạng thái
            DECLARE @random INT = ABS(CHECKSUM(NEWID())) % 10;
            IF @random < 5
            BEGIN
                SET @orderStatus = 'delivered';
                SET @paymentStatus = 'paid';
            END
            ELSE IF @random < 7
            BEGIN
                SET @orderStatus = 'shipping';
                SET @paymentStatus = CASE WHEN @paymentMethod = 'COD' THEN 'pending' ELSE 'paid' END;
            END
            ELSE IF @random < 9
            BEGIN
                SET @orderStatus = 'confirmed';
                SET @paymentStatus = CASE WHEN @paymentMethod = 'COD' THEN 'pending' ELSE 'paid' END;
            END
            ELSE
            BEGIN
                SET @orderStatus = 'pending';
                SET @paymentStatus = 'pending';
            END
        END;
        
        -- Insert order với created_at
        INSERT INTO Orders (
            user_id,
            total_amount,
            discount_amount,
            subtotal,
            payment_method,
            payment_status,
            shipping_address,
            status,
            created_at,
            updated_at
        )
        VALUES (
            @userId,
            @totalAmount,
            @discountAmount,
            @subtotal,
            @paymentMethod,
            @paymentStatus,
            @shippingAddress,
            @orderStatus,
            @orderDateTime,
            @orderDateTime
        );
        
        DECLARE @orderId INT = SCOPE_IDENTITY();
        
        -- Insert order items
        INSERT INTO OrderItems (order_id, product_id, quantity, price, discount_percent)
        SELECT @orderId, product_id, quantity, price, discount_percent
        FROM @tempItems;
        
        DELETE FROM @tempItems;
        
        SET @totalOrders = @totalOrders + 1;
        SET @i = @i + 1;
    END;
    
    -- In progress mỗi 30 ngày
    IF DATEDIFF(day, @startDate, @currentDate) % 30 = 0
    BEGIN
        PRINT CONCAT('Đã tạo ', @totalOrders, ' đơn hàng tính đến ', FORMAT(@currentDate, 'dd/MM/yyyy'));
    END;
    
    -- Tăng ngày
    SET @currentDate = DATEADD(day, 1, @currentDate);
END;

PRINT CONCAT('Hoàn thành! Tổng cộng: ', @totalOrders, ' đơn hàng');

-- Hiển thị thống kê
SELECT 
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value,
    MIN(created_at) as first_order,
    MAX(created_at) as last_order
FROM Orders;

SELECT 
    status,
    COUNT(*) as count,
    SUM(total_amount) as revenue
FROM Orders
GROUP BY status
ORDER BY count DESC;
