USE DB_SieuThi_Hung;
GO

PRINT N'Categories: ' + CAST((SELECT COUNT(*) FROM Categories) AS NVARCHAR(10));
PRINT N'Users: ' + CAST((SELECT COUNT(*) FROM Users) AS NVARCHAR(10));
PRINT N'Products: ' + CAST((SELECT COUNT(*) FROM Products) AS NVARCHAR(10));
PRINT N'Orders: ' + CAST((SELECT COUNT(*) FROM Orders) AS NVARCHAR(10));
PRINT N'OrderItems: ' + CAST((SELECT COUNT(*) FROM OrderItems) AS NVARCHAR(10));

DECLARE @TotalOrders INT = (SELECT COUNT(*) FROM Orders WHERE created_at >= '2025-11-01' AND created_at <= '2025-12-31');
DECLARE @OrdersWithMultipleItems INT = (
    SELECT COUNT(DISTINCT order_id) 
    FROM OrderItems oi 
    JOIN Orders o ON oi.order_id = o.id 
    WHERE o.created_at >= '2025-11-01' AND o.created_at <= '2025-12-31'
    GROUP BY order_id 
    HAVING COUNT(*) >= 2
);
DECLARE @AssociationRate DECIMAL(5,2) = (CAST(@OrdersWithMultipleItems AS FLOAT) / @TotalOrders) * 100;

PRINT N'Association rate: ' + CAST(@AssociationRate AS NVARCHAR(10)) + N'%';
GO
