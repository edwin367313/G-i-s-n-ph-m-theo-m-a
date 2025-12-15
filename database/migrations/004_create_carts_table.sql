-- Migration: 004_create_carts_table
-- Description: Create Carts and CartItems tables
-- Date: 2024-01-04

USE SieuThiABC;
GO

CREATE TABLE dbo.Carts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(id) ON DELETE CASCADE,
    voucher_code NVARCHAR(50),
    discount DECIMAL(18,2) DEFAULT 0,
    total DECIMAL(18,2) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE(),
    UNIQUE(user_id)
);

CREATE INDEX idx_carts_user ON dbo.Carts(user_id);

GO

CREATE TABLE dbo.CartItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cart_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Carts(id) ON DELETE CASCADE,
    product_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(18,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE(),
    UNIQUE(cart_id, product_id)
);

CREATE INDEX idx_cartitems_cart ON dbo.CartItems(cart_id);
CREATE INDEX idx_cartitems_product ON dbo.CartItems(product_id);

GO

CREATE TRIGGER trg_carts_updated_at ON dbo.Carts
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Carts
    SET updated_at = GETDATE()
    FROM dbo.Carts c
    INNER JOIN inserted i ON c.id = i.id;
END;
GO

CREATE TRIGGER trg_cartitems_updated_at ON dbo.CartItems
AFTER UPDATE AS
BEGIN
    UPDATE dbo.CartItems
    SET updated_at = GETDATE()
    FROM dbo.CartItems ci
    INNER JOIN inserted i ON ci.id = i.id;
END;
GO

PRINT 'Migration 004: Carts and CartItems tables created successfully';