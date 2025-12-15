-- Migration: 008_create_themes_table
-- Description: Create Themes table for UI customization
-- Date: 2024-01-08

USE SieuThiABC;
GO

CREATE TABLE dbo.Themes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    primary_color NVARCHAR(20) NOT NULL DEFAULT '#1890ff',
    secondary_color NVARCHAR(20) NOT NULL DEFAULT '#52c41a',
    logo NVARCHAR(500),
    banner NVARCHAR(500),
    is_active BIT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

GO

CREATE TRIGGER trg_themes_updated_at ON dbo.Themes
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Themes
    SET updated_at = GETDATE()
    FROM dbo.Themes t
    INNER JOIN inserted i ON t.id = i.id;
END;
GO

PRINT 'Migration 008: Themes table created successfully';