-- Seed Users
-- Password for all: 123456 (hashed with bcrypt)
-- Default password hash: $2b$10$YourHashedPasswordHere

USE SieuThiABC;
GO

-- Delete existing data
DELETE FROM dbo.Users;
DBCC CHECKIDENT ('dbo.Users', RESEED, 0);
GO

-- Admin users
INSERT INTO dbo.Users (username, email, password, full_name, phone, address, role, is_active)
VALUES 
('admin', 'admin@sieuthiabc.vn', '$2b$10$dummyhashedpassword', N'Quản trị viên', '0901234567', N'Hà Nội', 'admin', 1),
('manager', 'manager@sieuthiabc.vn', '$2b$10$dummyhashedpassword', N'Nguyễn Văn Quản', '0901234568', N'Hà Nội', 'manager', 1);

-- Customer users
INSERT INTO dbo.Users (username, email, password, full_name, phone, address, role, is_active)
VALUES 
('nguyenvanan', 'nguyenvanan@gmail.com', '$2b$10$dummyhashedpassword', N'Nguyễn Văn An', '0912345678', N'123 Trần Duy Hưng, Cầu Giấy, Hà Nội', 'customer', 1),
('tranthib', 'tranthib@gmail.com', '$2b$10$dummyhashedpassword', N'Trần Thị Bình', '0912345679', N'456 Nguyễn Trãi, Thanh Xuân, Hà Nội', 'customer', 1),
('leminchau', 'leminchau@gmail.com', '$2b$10$dummyhashedpassword', N'Lê Minh Châu', '0912345680', N'789 Láng Hạ, Đống Đa, Hà Nội', 'customer', 1),
('phamtuandung', 'phamtuandung@gmail.com', '$2b$10$dummyhashedpassword', N'Phạm Tuấn Dũng', '0912345681', N'321 Giải Phóng, Hai Bà Trưng, Hà Nội', 'customer', 1),
('vuthao', 'vuthao@gmail.com', '$2b$10$dummyhashedpassword', N'Vũ Thảo', '0912345682', N'654 Tây Sơn, Đống Đa, Hà Nội', 'customer', 1),
('doquang', 'doquang@gmail.com', '$2b$10$dummyhashedpassword', N'Đỗ Quang', '0912345683', N'987 Xã Đàn, Đống Đa, Hà Nội', 'customer', 1),
('builinh', 'builinh@gmail.com', '$2b$10$dummyhashedpassword', N'Bùi Linh', '0912345684', N'147 Chùa Bộc, Đống Đa, Hà Nội', 'customer', 1),
('phanhuy', 'phanhuy@gmail.com', '$2b$10$dummyhashedpassword', N'Phan Huy', '0912345685', N'258 Khâm Thiên, Đống Đa, Hà Nội', 'customer', 1),
('hoangminhtuan', 'hoangminhtuan@gmail.com', '$2b$10$dummyhashedpassword', N'Hoàng Minh Tuấn', '0912345686', N'369 Thái Hà, Đống Đa, Hà Nội', 'customer', 1),
('dangth uha', 'dangthuha@gmail.com', '$2b$10$dummyhashedpassword', N'Đặng Thu Hà', '0912345687', N'741 Ô Chợ Dừa, Đống Đa, Hà Nội', 'customer', 1);

PRINT 'Seeded ' + CAST(@@ROWCOUNT + 2 AS NVARCHAR) + ' users';
GO