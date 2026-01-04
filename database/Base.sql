USE DB_SieuThi_Hung;
GO

INSERT INTO dbo.Users (username, email, password, full_name, role, is_active) 
VALUES ('admin', 'admin@sieuthiabc.vn', '123456', N'Quản trị viên', 'admin', 1);

INSERT INTO dbo.Users (username, email, password, full_name, phone, address, role, created_at) 
VALUES 
('user1', 'user1@gmail.com', '123456', N'Nguyễn Văn A', '0900000001', N'123 Lê Lợi, Q1, TP.HCM', 'customer', DATEADD(day, -196, GETDATE())),
('user2', 'user2@gmail.com', '123456', N'Trần Thị B', '0900000002', N'456 Nguyễn Huệ, Q1, TP.HCM', 'customer', DATEADD(day, -272, GETDATE())),
('user3', 'user3@gmail.com', '123456', N'Phạm Văn C', '0900000003', N'789 Trần Hưng Đạo, Q5, TP.HCM', 'customer', DATEADD(day, -302, GETDATE())),
('user4', 'user4@gmail.com', '123456', N'Lê Thị D', '0900000004', N'321 Phan Xích Long, PN, TP.HCM', 'customer', DATEADD(day, -363, GETDATE())),
('user5', 'user5@gmail.com', '123456', N'Hoàng Văn E', '0900000005', N'654 Võ Văn Tần, Q3, TP.HCM', 'customer', DATEADD(day, -175, GETDATE())),
('user6', 'user6@gmail.com', '123456', N'Vũ Thị F', '0900000006', N'987 Hai Bà Trưng, Q3, TP.HCM', 'customer', DATEADD(day, -112, GETDATE())),
('user7', 'user7@gmail.com', '123456', N'Đỗ Văn G', '0900000007', N'147 Cách Mạng Tháng 8, Q10, TP.HCM', 'customer', DATEADD(day, -214, GETDATE())),
('user8', 'user8@gmail.com', '123456', N'Mai Thị H', '0900000008', N'258 Lý Thái Tổ, Q10, TP.HCM', 'customer', DATEADD(day, -34, GETDATE())),
('user9', 'user9@gmail.com', '123456', N'Bùi Văn I', '0900000009', N'369 Trường Chinh, TB, TP.HCM', 'customer', DATEADD(day, -28, GETDATE())),
('user10', 'user10@gmail.com', '123456', N'Đinh Thị K', '0900000010', N'741 Hoàng Văn Thụ, TB, TP.HCM', 'customer', DATEADD(day, -182, GETDATE()));
GO

PRINT '✅ Categories and Users';
GO
