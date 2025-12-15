-- =============================================
-- Script: Tạo đơn hàng thực tế đơn giản hóa
-- Mô phỏng: ~5000 đơn trong 365 ngày (1 năm)
-- =============================================
USE SieuThiABC;
GO

PRINT 'Bắt đầu tạo đơn hàng thực tế...';
GO

-- Lấy danh sách users và products
DECLARE @users TABLE (id INT, full_name NVARCHAR(255), phone NVARCHAR(20), email NVARCHAR(255), address NVARCHAR(500));
INSERT INTO @users 
SELECT id, full_name, phone, email, address 
FROM Users 
WHERE role = 'customer';

DECLARE @products TABLE (id INT, name NVARCHAR(255), price DECIMAL(10,2), discount_percent INT);
INSERT INTO @products 
SELECT id, name, price, discount_percent 
FROM Products;

DECLARE @totalUsers INT = (SELECT COUNT(*) FROM @users);
DECLARE @totalProducts INT = (SELECT COUNT(*) FROM @products);

PRINT CONCAT('Khách hàng: ', @totalUsers, ', Sản phẩm: ', @totalProducts);

-- Tạo 5000 đơn hàng trong 365 ngày (trung bình 14 đơn/ngày)
DECLARE @counter INT = 1;
DECLARE @maxOrders INT = 5000;
DECLARE @startDate DATETIME = DATEADD(year, -1, GETDATE());

WHILE @counter <= @maxOrders
BEGIN
    -- Random date trong khoảng 1 năm
    DECLARE @randomDays INT = ABS(CHECKSUM(NEWID())) % 365;
    DECLARE @orderDate DATETIME = DATEADD(day, @randomDays, @startDate);
    -- Random time 8am-8pm
    SET @orderDate = DATEADD(minute, 480 + (ABS(CHECKSUM(NEWID())) % 720), @orderDate);
    
    -- Random user
    DECLARE @userId INT = (SELECT TOP 1 id FROM @users ORDER BY NEWID());
    DECLARE @customerName NVARCHAR(255) = (SELECT TOP 1 COALESCE(full_name, N'Khách hàng') FROM @users WHERE id = @userId);
    DECLARE @customerPhone NVARCHAR(20) = (SELECT TOP 1 COALESCE(phone, '0900000000') FROM @users WHERE id = @userId);
    DECLARE @customerEmail NVARCHAR(255) = (SELECT TOP 1 email FROM @users WHERE id = @userId);
    DECLARE @shippingAddress NVARCHAR(500) = (SELECT TOP 1 COALESCE(address, N'123 Nguyễn Văn Cừ, Q5, TP.HCM') FROM @users WHERE id = @userId);
    
    -- Random payment method
    DECLARE @paymentMethod NVARCHAR(50) = CASE ABS(CHECKSUM(NEWID())) % 3
        WHEN 0 THEN 'COD'
        WHEN 1 THEN 'bank_transfer'
        ELSE 'momo'
    END;
    
    -- Random order và payment status
    DECLARE @daysOld INT = DATEDIFF(day, @orderDate, GETDATE());
    DECLARE @orderStatus NVARCHAR(50);
    DECLARE @paymentStatus NVARCHAR(50);
    
    IF @daysOld > 60 
    BEGIN
        SET @orderStatus = 'delivered';
        SET @paymentStatus = 'paid';
    END
    ELSE
    BEGIN
        DECLARE @r INT = ABS(CHECKSUM(NEWID())) % 10;
        IF @r < 7
        BEGIN
            SET @orderStatus = 'delivered';
            SET @paymentStatus = 'paid';
        END
        ELSE IF @r < 9
        BEGIN
            SET @orderStatus = 'shipping';
            SET @paymentStatus = CASE WHEN @paymentMethod = 'COD' THEN 'pending' ELSE 'paid' END;
        END
        ELSE
        BEGIN
            SET @orderStatus = 'confirmed';
            SET @paymentStatus = 'pending';
        END
    END;
    
    -- Tạo order_code
    DECLARE @orderCode NVARCHAR(50) = CONCAT('ORD', FORMAT(@orderDate, 'yyyyMMdd'), RIGHT('00000' + CAST(@counter AS VARCHAR), 5));
    
    -- Random items (1-5 items)
    DECLARE @itemCount INT = 1 + (ABS(CHECKSUM(NEWID())) % 5);
    DECLARE @subtotal DECIMAL(10,2) = 0;
    DECLARE @discount DECIMAL(10,2) = 0;
    
    -- Tạo temp table cho items
    DECLARE @items TABLE (
        product_id INT,
        product_name NVARCHAR(255),
        quantity INT,
        price DECIMAL(10,2),
        discount_percent INT
    );
    
    -- Chọn random products
    DECLARE @i INT = 1;
    WHILE @i <= @itemCount
    BEGIN
        DECLARE @prodId INT = (SELECT TOP 1 id FROM @products ORDER BY NEWID());
        DECLARE @prodName NVARCHAR(255) = (SELECT name FROM @products WHERE id = @prodId);
        DECLARE @prodPrice DECIMAL(10,2) = (SELECT price FROM @products WHERE id = @prodId);
        DECLARE @prodDiscount INT = (SELECT discount_percent FROM @products WHERE id = @prodId);
        DECLARE @qty INT = 1 + (ABS(CHECKSUM(NEWID())) % 3); -- 1-3
        
        INSERT INTO @items VALUES (@prodId, @prodName, @qty, @prodPrice, @prodDiscount);
        
        SET @i = @i + 1;
    END;
    
    -- Tính tổng
    SELECT 
        @subtotal = SUM(quantity * price),
        @discount = SUM(quantity * price * discount_percent / 100.0)
    FROM @items;
    
    DECLARE @shippingFee DECIMAL(10,2) = CASE WHEN @subtotal >= 300000 THEN 0 ELSE 25000 END;
    DECLARE @total DECIMAL(10,2) = @subtotal - @discount + @shippingFee;
    
    -- Insert order
    INSERT INTO Orders (
        order_code, user_id, subtotal, discount, shipping_fee, total,
        customer_name, customer_phone, customer_email, shipping_address,
        payment_method, order_status, payment_status,
        created_at, updated_at
    )
    VALUES (
        @orderCode, @userId, @subtotal, @discount, @shippingFee, @total,
        @customerName, @customerPhone, @customerEmail, @shippingAddress,
        @paymentMethod, @orderStatus, @paymentStatus,
        @orderDate, @orderDate
    );
    
    DECLARE @orderId INT = SCOPE_IDENTITY();
    
    -- Insert order items
    INSERT INTO OrderItems (order_id, product_id, product_name, quantity, price, discount_percent, subtotal, created_at)
    SELECT 
        @orderId, 
        product_id, 
        product_name,
        quantity, 
        price, 
        discount_percent,
        (quantity * price) - (quantity * price * discount_percent / 100.0),
        @orderDate
    FROM @items;
    
    DELETE FROM @items;
    
    -- Progress mỗi 500 đơn
    IF @counter % 500 = 0
    BEGIN
        PRINT CONCAT('Đã tạo ', @counter, ' / ', @maxOrders, ' đơn hàng');
    END;
    
    SET @counter = @counter + 1;
END;

PRINT CONCAT('Hoàn thành! Tổng: ', @maxOrders, ' đơn hàng');

-- Thống kê
SELECT 
    COUNT(*) as total_orders,
    SUM(total) as total_revenue,
    AVG(total) as avg_order_value
FROM Orders;

SELECT 
    order_status,
    COUNT(*) as count
FROM Orders
GROUP BY order_status;
