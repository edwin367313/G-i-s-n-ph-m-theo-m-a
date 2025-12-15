-- Migration: 005_create_orders_table
-- Description: Create Orders and OrderItems tables
-- Date: 2024-01-05

USE SieuThiABC;
GO

CREATE TABLE dbo.Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_code NVARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(id),
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
    order_status NVARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (order_status IN ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled')),
    payment_status NVARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    note NVARCHAR(MAX),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_orders_user ON dbo.Orders(user_id);
CREATE INDEX idx_orders_code ON dbo.Orders(order_code);
CREATE INDEX idx_orders_status ON dbo.Orders(order_status);
CREATE INDEX idx_orders_payment_status ON dbo.Orders(payment_status);
CREATE INDEX idx_orders_created ON dbo.Orders(created_at);

GO

CREATE TABLE dbo.OrderItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Products(id),
    product_name NVARCHAR(200) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(18,2) NOT NULL,
    discount_percent INT DEFAULT 0,
    subtotal DECIMAL(18,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_orderitems_order ON dbo.OrderItems(order_id);
CREATE INDEX idx_orderitems_product ON dbo.OrderItems(product_id);

GO

CREATE TRIGGER trg_orders_updated_at ON dbo.Orders
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Orders
    SET updated_at = GETDATE()
    FROM dbo.Orders o
    INNER JOIN inserted i ON o.id = i.id;
END;
GO

PRINT 'Migration 005: Orders and OrderItems tables created successfully';