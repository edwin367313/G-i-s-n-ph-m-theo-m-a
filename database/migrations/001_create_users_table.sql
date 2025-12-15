-- Migration: 001_create_users_table
-- Description: Create Users table with authentication fields
-- Date: 2024-01-01

USE SieuThiABC;
GO

CREATE TABLE dbo.Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100),
    phone NVARCHAR(20),
    address NVARCHAR(255),
    role NVARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    avatar NVARCHAR(500),
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_users_email ON dbo.Users(email);
CREATE INDEX idx_users_username ON dbo.Users(username);
CREATE INDEX idx_users_role ON dbo.Users(role);

GO

CREATE TRIGGER trg_users_updated_at ON dbo.Users
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Users
    SET updated_at = GETDATE()
    FROM dbo.Users u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO

PRINT 'Migration 001: Users table created successfully';
