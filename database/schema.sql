USE DB_SieuThi_Nghi;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DB_SieuThi_Nghi')
BEGIN
    CREATE DATABASE DB_SieuThi_Nghi;
END
GO

USE DB_SieuThi_Nghi;
GO

IF OBJECT_ID('dbo.OrderItems', 'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID('dbo.Payments', 'U') IS NOT NULL DROP TABLE dbo.Payments;
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.CartItems', 'U') IS NOT NULL DROP TABLE dbo.CartItems;
IF OBJECT_ID('dbo.Carts', 'U') IS NOT NULL DROP TABLE dbo.Carts;
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories;
IF OBJECT_ID('dbo.Vouchers', 'U') IS NOT NULL DROP TABLE dbo.Vouchers;
IF OBJECT_ID('dbo.Themes', 'U') IS NOT NULL DROP TABLE dbo.Themes;
IF OBJECT_ID('dbo.Notifications', 'U') IS NOT NULL DROP TABLE dbo.Notifications;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
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

CREATE TABLE dbo.Categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    image NVARCHAR(500),
    status NVARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE dbo.Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(18,2) NOT NULL CHECK (price >= 0),
    discount_percent INT DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Categories(id),
    images NVARCHAR(MAX),
    unit NVARCHAR(50) NOT NULL DEFAULT N'Cái',
    status NVARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

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

CREATE TABLE dbo.Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(id),
    full_name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    total_amount DECIMAL(18,2) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_method NVARCHAR(50) DEFAULT 'COD',
    note NVARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE dbo.OrderItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(18,2) NOT NULL,
    total_price DECIMAL(18,2) NOT NULL
);

CREATE TABLE dbo.Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Orders(id) ON DELETE CASCADE,
    amount DECIMAL(18,2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method NVARCHAR(50),
    status NVARCHAR(20) DEFAULT 'completed'
);

CREATE TABLE dbo.Vouchers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) NOT NULL UNIQUE,
    discount_percent INT,
    discount_amount DECIMAL(18,2),
    min_order_amount DECIMAL(18,2),
    max_discount_amount DECIMAL(18,2),
    start_date DATETIME,
    end_date DATETIME,
    usage_limit INT,
    used_count INT DEFAULT 0,
    status NVARCHAR(20) DEFAULT 'active'
);

CREATE TABLE dbo.Themes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100),
    primary_color NVARCHAR(20),
    secondary_color NVARCHAR(20),
    is_active BIT DEFAULT 0,
    falling_icon NVARCHAR(50),
    event_name NVARCHAR(50),
    background_image NVARCHAR(500)
);

CREATE TABLE dbo.Notifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT FOREIGN KEY REFERENCES dbo.Users(id),
    title NVARCHAR(200) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    type NVARCHAR(50),
    reference_id INT,
    is_read BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE()
);

GO
CREATE TRIGGER trg_UpdateUsers ON dbo.Users AFTER UPDATE AS BEGIN UPDATE dbo.Users SET updated_at = GETDATE() FROM dbo.Users u INNER JOIN inserted i ON u.id = i.id; END;
GO
CREATE TRIGGER trg_UpdateProducts ON dbo.Products AFTER UPDATE AS BEGIN UPDATE dbo.Products SET updated_at = GETDATE() FROM dbo.Products p INNER JOIN inserted i ON p.id = i.id; END;
GO
CREATE TRIGGER trg_UpdateOrders ON dbo.Orders AFTER UPDATE AS BEGIN UPDATE dbo.Orders SET updated_at = GETDATE() FROM dbo.Orders o INNER JOIN inserted i ON o.id = i.id; END;
GO

PRINT '✅ Schema created successfully ';
GO
