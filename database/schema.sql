
USE master;
GO

-- Create database if not exists
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SieuThiABC')
BEGIN
    CREATE DATABASE SieuThiABC;
END
GO

USE SieuThiABC;
GO

IF OBJECT_ID('dbo.OrderItems', 'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.Payments', 'U') IS NOT NULL DROP TABLE dbo.Payments;
IF OBJECT_ID('dbo.CartItems', 'U') IS NOT NULL DROP TABLE dbo.CartItems;
IF OBJECT_ID('dbo.Carts', 'U') IS NOT NULL DROP TABLE dbo.Carts;
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories;
IF OBJECT_ID('dbo.Vouchers', 'U') IS NOT NULL DROP TABLE dbo.Vouchers;
IF OBJECT_ID('dbo.Themes', 'U') IS NOT NULL DROP TABLE dbo.Themes;
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

CREATE INDEX idx_users_email ON dbo.Users(email);
CREATE INDEX idx_users_username ON dbo.Users(username);
CREATE INDEX idx_users_role ON dbo.Users(role);


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


CREATE TABLE dbo.Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(18,2) NOT NULL CHECK (price >= 0),
    discount_percent INT DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Categories(id),
    images NVARCHAR(MAX), -- JSON array of image URLs
    unit NVARCHAR(50) NOT NULL DEFAULT N'Cái',
    status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_products_category ON dbo.Products(category_id);
CREATE INDEX idx_products_status ON dbo.Products(status);
CREATE INDEX idx_products_price ON dbo.Products(price);


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



CREATE TABLE dbo.Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_code NVARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Users(id),
    subtotal DECIMAL(18,2) NOT NULL,
    discount DECIMAL(18,2) DEFAULT 0,
    shipping_fee DECIMAL(18,2) DEFAULT 0,
    total DECIMAL(18,2) NOT NULL,
    
    -- Customer info
    customer_name NVARCHAR(100) NOT NULL,
    customer_phone NVARCHAR(20) NOT NULL,
    customer_email NVARCHAR(100),
    shipping_address NVARCHAR(500) NOT NULL,
    
    -- Order details
    voucher_code NVARCHAR(50),
    payment_method NVARCHAR(50) NOT NULL,
    order_status NVARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (order_status IN ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled')),
    payment_status NVARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    note NVARCHAR(MAX),
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_orders_user ON dbo.Orders(user_id);
CREATE INDEX idx_orders_code ON dbo.Orders(order_code);
CREATE INDEX idx_orders_status ON dbo.Orders(order_status);
CREATE INDEX idx_orders_payment_status ON dbo.Orders(payment_status);
CREATE INDEX idx_orders_created ON dbo.Orders(created_at);


CREATE TABLE dbo.OrderItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL FOREIGN KEY REFERENCES dbo.Products(id),
    product_name NVARCHAR(200) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(18,2) NOT NULL,
    discount_percent INT DEFAULT 0,
    subtotal DECIMAL(18,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_orderitems_order ON dbo.OrderItems(order_id);
CREATE INDEX idx_orderitems_product ON dbo.OrderItems(product_id);


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
    response_data NVARCHAR(MAX), -- JSON response from gateway
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE INDEX idx_payments_code ON dbo.Payments(payment_code);
CREATE INDEX idx_payments_order ON dbo.Payments(order_id);
CREATE INDEX idx_payments_user ON dbo.Payments(user_id);
CREATE INDEX idx_payments_status ON dbo.Payments(status);

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
-- Users
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

-- Categories
CREATE TRIGGER trg_categories_updated_at ON dbo.Categories
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Categories
    SET updated_at = GETDATE()
    FROM dbo.Categories c
    INNER JOIN inserted i ON c.id = i.id;
END;
GO

-- Products
CREATE TRIGGER trg_products_updated_at ON dbo.Products
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Products
    SET updated_at = GETDATE()
    FROM dbo.Products p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- Carts
CREATE TRIGGER trg_carts_updated_at ON dbo.Carts
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Carts
    SET updated_at = GETDATE()
    FROM dbo.Carts c
    INNER JOIN inserted i ON c.id = i.id;
END;
GO

-- CartItems
CREATE TRIGGER trg_cartitems_updated_at ON dbo.CartItems
AFTER UPDATE AS
BEGIN
    UPDATE dbo.CartItems
    SET updated_at = GETDATE()
    FROM dbo.CartItems ci
    INNER JOIN inserted i ON ci.id = i.id;
END;
GO

-- Vouchers
CREATE TRIGGER trg_vouchers_updated_at ON dbo.Vouchers
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Vouchers
    SET updated_at = GETDATE()
    FROM dbo.Vouchers v
    INNER JOIN inserted i ON v.id = i.id;
END;
GO

-- Orders
CREATE TRIGGER trg_orders_updated_at ON dbo.Orders
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Orders
    SET updated_at = GETDATE()
    FROM dbo.Orders o
    INNER JOIN inserted i ON o.id = i.id;
END;
GO

-- Payments
CREATE TRIGGER trg_payments_updated_at ON dbo.Payments
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Payments
    SET updated_at = GETDATE()
    FROM dbo.Payments p
    INNER JOIN inserted i ON p.id = i.id;
END;
GO

-- Themes
CREATE TRIGGER trg_themes_updated_at ON dbo.Themes
AFTER UPDATE AS
BEGIN
    UPDATE dbo.Themes
    SET updated_at = GETDATE()
    FROM dbo.Themes t
    INNER JOIN inserted i ON t.id = i.id;
END;

