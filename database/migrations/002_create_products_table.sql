-- Migration: 002_create_products_table
-- Description: Create Products table
-- Date: 2024-01-02

USE SieuThiABC;
GO

CREATE TABLE dbo.Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(18,2) NOT NULL CHECK (price >= 0),
    discount_percent INT DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Categories(id),
    images NVARCHAR(MAX), -- JSON array
    unit NVARCHAR(50) NOT NULL DEFAULT N'Cái',
    status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_products_category ON dbo.Products(category_id);
CREATE INDEX idx_products_status ON dbo.Products(status);
CREATE INDEX idx_products_price ON dbo.Products(price);

GO

CREATE TRIGGER trg_products_updated_at ON dbo.Products
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Products
    SET updated_at = GETDATE()
    FROM dbo.Products p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

PRINT 'Migration 002: Products table created successfully';
