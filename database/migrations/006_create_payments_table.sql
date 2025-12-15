-- Migration: 006_create_payments_table
-- Description: Create Payments table
-- Date: 2024-01-06

USE SieuThiABC;
GO

CREATE TABLE dbo.Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    payment_code NVARCHAR(50) NOT NULL UNIQUE,
    order_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Orders(id),
    user_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(id),
    amount DECIMAL(18,2) NOT NULL,
    payment_method NVARCHAR(50) NOT NULL,
    gateway NVARCHAR(50), -- momo, zalopay, paypal, cod
    transaction_id NVARCHAR(100),
    status NVARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'success', 'failed', 'refunded')),
    response_data NVARCHAR(MAX),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_payments_code ON dbo.Payments(payment_code);
CREATE INDEX idx_payments_order ON dbo.Payments(order_id);
CREATE INDEX idx_payments_user ON dbo.Payments(user_id);
CREATE INDEX idx_payments_status ON dbo.Payments(status);

GO

CREATE TRIGGER trg_payments_updated_at ON dbo.Payments
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Payments
    SET updated_at = GETDATE()
    FROM dbo.Payments p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

PRINT 'Migration 006: Payments table created successfully';