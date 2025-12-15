-- Migration: 009_create_images_table
-- Description: Reserved for future Images table (currently using JSON in Products)
-- Date: 2024-01-09
-- Status: PLACEHOLDER - Not implemented yet

/*
 * NOTE: Currently, product images are stored as JSON array in Products.images column.
 * This migration file is reserved for future implementation if we need a separate Images table.
 * 
 * Possible future structure:
 * 
 * CREATE TABLE dbo.Images (
 *     id INT IDENTITY(1,1) PRIMARY KEY,
 *     entity_type NVARCHAR(50) NOT NULL, -- 'product', 'category', 'user', 'theme'
 *     entity_id INT NOT NULL,
 *     url NVARCHAR(500) NOT NULL,
 *     alt_text NVARCHAR(200),
 *     display_order INT DEFAULT 0,
 *     is_primary BIT DEFAULT 0,
 *     created_at DATETIME NOT NULL DEFAULT GETDATE()
 * );
 */

USE SieuThiABC;
GO

PRINT 'Migration 009: Placeholder - Images table not implemented (using JSON in Products)';