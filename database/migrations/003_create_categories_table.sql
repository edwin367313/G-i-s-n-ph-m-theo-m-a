-- Migration: 003_create_categories_table
-- Description: Create Categories table
-- Date: 2024-01-03

USE SieuThiABC;
GO

CREATE TABLE dbo.Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    image NVARCHAR(500),
    status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_categories_status ON dbo.Categories(status);

GO

CREATE TRIGGER trg_categories_updated_at ON dbo.Categories
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Categories
    SET updated_at = GETDATE()
    FROM dbo.Categories c
    INNER JOIN inserted i ON c.id = i.id;
END;
GO

PRINT 'Migration 003: Categories table created successfully';
