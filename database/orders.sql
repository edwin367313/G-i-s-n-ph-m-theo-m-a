
USE DB_SieuThi_Hung;
GO

DECLARE @StartDate DATE = '2025-11-01';
DECLARE @EndDate DATE = '2025-12-31';
DECLARE @CurrentDate DATETIME;
DECLARE @OrderID INT;
DECLARE @UserID INT;
DECLARE @TotalAmount DECIMAL(18,2);
DECLARE @OrderCount INT = 0;
DECLARE @TargetOrders INT = 5000; 


SET @OrderCount = 0;
WHILE @OrderCount < 100
BEGIN
    SET @CurrentDate = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 61, @StartDate);
    SET @UserID = (ABS(CHECKSUM(NEWID())) % 10) + 2; 
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, payment_method, note, created_at, updated_at)
    VALUES (
        @UserID,
        (SELECT full_name FROM Users WHERE id = @UserID),
        (SELECT phone FROM Users WHERE id = @UserID),
        (SELECT address FROM Users WHERE id = @UserID),
        0,
        N'Đã giao',
        N'COD',
        @CurrentDate,
        @CurrentDate
    );
    
    SET @OrderID = SCOPE_IDENTITY();
    SET @TotalAmount = 0;
    DECLARE @ProductID INT = (ABS(CHECKSUM(NEWID())) % 10) + 1;
    DECLARE @Quantity INT = (ABS(CHECKSUM(NEWID())) % 3) + 1;
    DECLARE @Price DECIMAL(18,2) = (SELECT price FROM Products WHERE id = @ProductID);
    DECLARE @ItemTotal DECIMAL(18,2) = @Price * @Quantity;
    
    INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
    SET @TotalAmount = @TotalAmount + @ItemTotal;
    
    IF RAND() < 0.8
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 12) + 11;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 3) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    IF RAND() < 0.7
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 10) + 93;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 4) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    UPDATE Orders SET total_amount = @TotalAmount WHERE id = @OrderID;
    SET @OrderCount = @OrderCount + 1;
END

SET @OrderCount = 0;
WHILE @OrderCount < 150
BEGIN
    SET @CurrentDate = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 61, @StartDate);
    SET @UserID = (ABS(CHECKSUM(NEWID())) % 10) + 2;
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, payment_method, note, created_at, updated_at)
    VALUES (@UserID, (SELECT full_name FROM Users WHERE id = @UserID), (SELECT phone FROM Users WHERE id = @UserID),
            (SELECT address FROM Users WHERE id = @UserID), 0, N'Đã giao', N'Chuyển khoản', NULL, @CurrentDate, @CurrentDate);
    
    SET @OrderID = SCOPE_IDENTITY();
    SET @TotalAmount = 0;
    
    SET @ProductID = (ABS(CHECKSUM(NEWID())) % 8) + 47;
    SET @Quantity = (ABS(CHECKSUM(NEWID())) % 2) + 1;
    SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
    SET @ItemTotal = @Price * @Quantity;
    INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
    SET @TotalAmount = @TotalAmount + @ItemTotal;
    
    IF RAND() < 0.75
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 8) + 131;
        SET @Quantity = 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    IF RAND() < 0.7
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 12) + 11;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 2) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    UPDATE Orders SET total_amount = @TotalAmount WHERE id = @OrderID;
    SET @OrderCount = @OrderCount + 1;
END

SET @OrderCount = 0;
WHILE @OrderCount < 120
BEGIN
    SET @CurrentDate = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 61, @StartDate);
    SET @UserID = (ABS(CHECKSUM(NEWID())) % 10) + 2;
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, payment_method, note, created_at, updated_at)
    VALUES (@UserID, (SELECT full_name FROM Users WHERE id = @UserID), (SELECT phone FROM Users WHERE id = @UserID),
            (SELECT address FROM Users WHERE id = @UserID), 0, N'Đã giao', N'COD', NULL, @CurrentDate, @CurrentDate);
    
    SET @OrderID = SCOPE_IDENTITY();
    SET @TotalAmount = 0;
    
    SET @ProductID = (ABS(CHECKSUM(NEWID())) % 10) + 23;
    SET @Quantity = (ABS(CHECKSUM(NEWID())) % 2) + 1;
    SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
    SET @ItemTotal = @Price * @Quantity;
    INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
    SET @TotalAmount = @TotalAmount + @ItemTotal;
    
    IF RAND() < 0.8
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 6) + 33;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 3) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    IF RAND() < 0.75
    BEGIN
        SET @ProductID = 11;
        SET @Quantity = 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    UPDATE Orders SET total_amount = @TotalAmount WHERE id = @OrderID;
    SET @OrderCount = @OrderCount + 1;
END

SET @OrderCount = 0;
WHILE @OrderCount < 200
BEGIN
    SET @CurrentDate = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 61, @StartDate);
    SET @UserID = (ABS(CHECKSUM(NEWID())) % 10) + 2;
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, payment_method, note, created_at, updated_at)
    VALUES (@UserID, (SELECT full_name FROM Users WHERE id = @UserID), (SELECT phone FROM Users WHERE id = @UserID),
            (SELECT address FROM Users WHERE id = @UserID), 0, N'Đã giao', N'Chuyển khoản', N'Giao nhanh', @CurrentDate, @CurrentDate);
    
    SET @OrderID = SCOPE_IDENTITY();
    SET @TotalAmount = 0;
    SET @ProductID = (ABS(CHECKSUM(NEWID())) % 10) + 55;
    SET @Quantity = (ABS(CHECKSUM(NEWID())) % 3) + 1;
    SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
    SET @ItemTotal = @Price * @Quantity;
    INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
    SET @TotalAmount = @TotalAmount + @ItemTotal;

    IF RAND() < 0.75
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 10) + 183;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 3) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    IF RAND() < 0.7
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 12) + 73;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 3) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    UPDATE Orders SET total_amount = @TotalAmount WHERE id = @OrderID;
    SET @OrderCount = @OrderCount + 1;
END

SET @OrderCount = 0;
WHILE @OrderCount < 150
BEGIN
    SET @CurrentDate = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 61, @StartDate);
    SET @UserID = (ABS(CHECKSUM(NEWID())) % 10) + 2;
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, payment_method, note, created_at, updated_at)
    VALUES (@UserID, (SELECT full_name FROM Users WHERE id = @UserID), (SELECT phone FROM Users WHERE id = @UserID),
            (SELECT address FROM Users WHERE id = @UserID), 0, N'Đã giao', N'COD', N'Liên hệ trước', @CurrentDate, @CurrentDate);
    
    SET @OrderID = SCOPE_IDENTITY();
    SET @TotalAmount = 0;
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 8) + 65;
    SET @Quantity = (ABS(CHECKSUM(NEWID())) % 2) + 1;
    SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
    SET @ItemTotal = @Price * @Quantity;
    INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
    SET @TotalAmount = @TotalAmount + @ItemTotal;
        IF RAND() < 0.8
    BEGIN
        IF RAND() < 0.5
            SET @ProductID = (ABS(CHECKSUM(NEWID())) % 6) + 139;
        ELSE
            SET @ProductID = (ABS(CHECKSUM(NEWID())) % 6) + 157;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 2) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
        IF RAND() < 0.75
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 6) + 145;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 2) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    UPDATE Orders SET total_amount = @TotalAmount WHERE id = @OrderID;
    SET @OrderCount = @OrderCount + 1;
END

SET @OrderCount = 0;
WHILE @OrderCount < 220
BEGIN
    SET @CurrentDate = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 61, @StartDate);
    SET @UserID = (ABS(CHECKSUM(NEWID())) % 10) + 2;
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, payment_method, note, created_at, updated_at)
    VALUES (@UserID, (SELECT full_name FROM Users WHERE id = @UserID), (SELECT phone FROM Users WHERE id = @UserID),
            (SELECT address FROM Users WHERE id = @UserID), 0, N'Đã giao', N'Chuyển khoản', NULL, @CurrentDate, @CurrentDate);
    
    SET @OrderID = SCOPE_IDENTITY();
    SET @TotalAmount = 0;
    
    SET @ProductID = (ABS(CHECKSUM(NEWID())) % 8) + 39;
    SET @Quantity = (ABS(CHECKSUM(NEWID())) % 2) + 1;
    SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
    SET @ItemTotal = @Price * @Quantity;
    INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
    SET @TotalAmount = @TotalAmount + @ItemTotal;
    
    IF RAND() < 0.75
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 6) + 125;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 3) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    IF RAND() < 0.7
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 8) + 117;
        SET @Quantity = 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    UPDATE Orders SET total_amount = @TotalAmount WHERE id = @OrderID;
    SET @OrderCount = @OrderCount + 1;
END

SET @OrderCount = 0;
WHILE @OrderCount < 300
BEGIN
    SET @CurrentDate = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 61, @StartDate);
    SET @UserID = (ABS(CHECKSUM(NEWID())) % 10) + 2;
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, payment_method, note, created_at, updated_at)
    VALUES (@UserID, (SELECT full_name FROM Users WHERE id = @UserID), (SELECT phone FROM Users WHERE id = @UserID),
            (SELECT address FROM Users WHERE id = @UserID), 0, N'Đã giao', N'COD', NULL, @CurrentDate, @CurrentDate);
    
    SET @OrderID = SCOPE_IDENTITY();
    SET @TotalAmount = 0;
    
    SET @ProductID = (ABS(CHECKSUM(NEWID())) % 8) + 85;
    SET @Quantity = 1;
    SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
    SET @ItemTotal = @Price * @Quantity;
    INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
    SET @TotalAmount = @TotalAmount + @ItemTotal;
    
    IF RAND() < 0.8
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 6) + 151;
        SET @Quantity = 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    IF RAND() < 0.7
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 6) + 177;
        SET @Quantity = 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    UPDATE Orders SET total_amount = @TotalAmount WHERE id = @OrderID;
    SET @OrderCount = @OrderCount + 1;
END

SET @OrderCount = 0;
WHILE @OrderCount < 280
BEGIN
    SET @CurrentDate = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 61, @StartDate);
    SET @UserID = (ABS(CHECKSUM(NEWID())) % 10) + 2;
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, payment_method, note, created_at, updated_at)
    VALUES (@UserID, (SELECT full_name FROM Users WHERE id = @UserID), (SELECT phone FROM Users WHERE id = @UserID),
            (SELECT address FROM Users WHERE id = @UserID), 0, N'Đã giao', N'Chuyển khoản', N'Hẹn giờ giao', @CurrentDate, @CurrentDate);
    
    SET @OrderID = SCOPE_IDENTITY();
    SET @TotalAmount = 0;
    
    SET @ProductID = (ABS(CHECKSUM(NEWID())) % 8) + 103;
    SET @Quantity = (ABS(CHECKSUM(NEWID())) % 2) + 1;
    SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
    SET @ItemTotal = @Price * @Quantity;
    INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
    VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
    SET @TotalAmount = @TotalAmount + @ItemTotal;
    
    IF RAND() < 0.75
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 6) + 163;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 2) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    IF RAND() < 0.6
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 6) + 111;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 3) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
        SET @TotalAmount = @TotalAmount + @ItemTotal;
    END
    
    UPDATE Orders SET total_amount = @TotalAmount WHERE id = @OrderID;
    SET @OrderCount = @OrderCount + 1;
END

SET @OrderCount = 0;
WHILE @OrderCount < 140
BEGIN
    SET @CurrentDate = DATEADD(DAY, ABS(CHECKSUM(NEWID())) % 61, @StartDate);
    SET @UserID = (ABS(CHECKSUM(NEWID())) % 10) + 2;
    
    INSERT INTO Orders (user_id, full_name, phone, address, total_amount, status, payment_method, note, created_at, updated_at)
    VALUES (@UserID, (SELECT full_name FROM Users WHERE id = @UserID), (SELECT phone FROM Users WHERE id = @UserID),
            (SELECT address FROM Users WHERE id = @UserID), 0, N'Đã giao', 
            CASE WHEN RAND() < 0.5 THEN N'COD' ELSE N'Chuyển khoản' END, NULL, @CurrentDate, @CurrentDate);
    
    SET @OrderID = SCOPE_IDENTITY();
    SET @TotalAmount = 0;
    
    DECLARE @ItemCount INT = (ABS(CHECKSUM(NEWID())) % 4) + 2;
    DECLARE @Counter INT = 0;
    
    WHILE @Counter < @ItemCount
    BEGIN
        SET @ProductID = (ABS(CHECKSUM(NEWID())) % 192) + 1;
        SET @Quantity = (ABS(CHECKSUM(NEWID())) % 3) + 1;
        SET @Price = (SELECT price FROM Products WHERE id = @ProductID);
        SET @ItemTotal = @Price * @Quantity;
        
        IF NOT EXISTS (SELECT 1 FROM OrderItems WHERE order_id = @OrderID AND product_id = @ProductID)
        BEGIN
            INSERT INTO OrderItems (order_id, product_id, quantity, price, total_price)
            VALUES (@OrderID, @ProductID, @Quantity, @Price, @ItemTotal);
            SET @TotalAmount = @TotalAmount + @ItemTotal;
        END
        
        SET @Counter = @Counter + 1;
    END
    
    UPDATE Orders SET total_amount = @TotalAmount WHERE id = @OrderID;
    SET @OrderCount = @OrderCount + 1;
END

GO

PRINT N'THỐNG KÊ ĐƠN HÀNG';
PRINT N'Tổng đơn hàng: ' + CAST((SELECT COUNT(*) FROM Orders WHERE created_at >= '2025-11-01' AND created_at <= '2025-12-31') AS NVARCHAR(10));
PRINT N'Tổng OrderItems: ' + CAST((SELECT COUNT(*) FROM OrderItems oi JOIN Orders o ON oi.order_id = o.id WHERE o.created_at >= '2025-11-01' AND o.created_at <= '2025-12-31') AS NVARCHAR(10));
PRINT N'Tổng doanh thu: ' + FORMAT((SELECT SUM(total_amount) FROM Orders WHERE created_at >= '2025-11-01' AND created_at <= '2025-12-31'), 'N0') + N' VNĐ';
GO
