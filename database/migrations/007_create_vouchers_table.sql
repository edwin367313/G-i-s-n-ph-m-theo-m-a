-- Migration: 007_create_vouchers_table
-- Description: Create Vouchers table
-- Date: 2024-01-07

USE SieuThiABC;
GO

CREATE TABLE dbo.Vouchers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(500),
    discount_type NVARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value DECIMAL(18,2) NOT NULL CHECK (discount_value > 0),
    min_order_value DECIMAL(18,2) DEFAULT 0,
    max_discount DECIMAL(18,2),
    usage_limit INT,
    used_count INT NOT NULL DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE(),
    CHECK (end_date > start_date)
);

CREATE INDEX idx_vouchers_code ON dbo.Vouchers(code);
CREATE INDEX idx_vouchers_status ON dbo.Vouchers(status);

GO

CREATE TRIGGER trg_vouchers_updated_at ON dbo.Vouchers
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Vouchers
    SET updated_at = GETDATE()
    FROM dbo.Vouchers v
    INNER JOIN inserted i ON v.id = i.id;
END;
GO

PRINT 'Migration 007: Vouchers table created successfully';