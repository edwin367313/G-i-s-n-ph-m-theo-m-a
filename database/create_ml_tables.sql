-- Tạo các bảng cho ML Recommendation Engine
USE [Order];
GO

-- Bảng lưu sản phẩm theo mùa
IF OBJECT_ID('SeasonalProducts', 'U') IS NOT NULL
    DROP TABLE SeasonalProducts;
GO

CREATE TABLE SeasonalProducts (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Season NVARCHAR(20) NOT NULL, -- 'Xuân', 'Hạ', 'Thu', 'Đông'
    ProductName NVARCHAR(255) NOT NULL,
    PurchaseCount INT NOT NULL,
    CustomerCount INT NOT NULL,
    PopularityScore FLOAT NOT NULL,
    LastUpdated DATETIME DEFAULT GETDATE(),
    CONSTRAINT UQ_SeasonalProduct UNIQUE (Season, ProductName)
);
GO

CREATE INDEX IX_SeasonalProducts_Season ON SeasonalProducts(Season);
CREATE INDEX IX_SeasonalProducts_Score ON SeasonalProducts(PopularityScore DESC);
GO

-- Bảng lưu mối quan hệ giữa các sản phẩm (Apriori)
IF OBJECT_ID('ProductAssociations', 'U') IS NOT NULL
    DROP TABLE ProductAssociations;
GO

CREATE TABLE ProductAssociations (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    ProductA NVARCHAR(255) NOT NULL,
    ProductB NVARCHAR(255) NOT NULL,
    Support FLOAT NOT NULL,
    Confidence FLOAT NOT NULL,
    Lift FLOAT NOT NULL,
    Season NVARCHAR(20) NULL, -- NULL = tất cả mùa, hoặc 'Xuân', 'Hạ', 'Thu', 'Đông'
    LastUpdated DATETIME DEFAULT GETDATE(),
    CONSTRAINT UQ_ProductAssociation UNIQUE (ProductA, ProductB, Season)
);
GO

CREATE INDEX IX_ProductAssociations_ProductA ON ProductAssociations(ProductA);
CREATE INDEX IX_ProductAssociations_Season ON ProductAssociations(Season);
CREATE INDEX IX_ProductAssociations_Confidence ON ProductAssociations(Confidence DESC);
GO

PRINT 'ML tables created successfully!';
