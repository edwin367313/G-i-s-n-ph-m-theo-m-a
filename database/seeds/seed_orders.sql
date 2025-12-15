-- Seed Orders and OrderItems (20 đơn hàng mẫu)

USE SIEUTHIABC;
GO

-- Tạo đơn hàng mẫu cho các user khác nhau
-- User ID 2: nguyenvanan - 3 đơn hàng
INSERT INTO Orders (user_id, order_code, subtotal, shipping_fee, discount, total, customer_name, customer_phone, shipping_address, payment_method, payment_status, order_status, note, created_at, updated_at)
VALUES 
(2, 'ORD202412010001', 450000, 30000, 0, 480000, N'Nguyễn Văn An', '0912345678', N'123 Lê Lợi, Quận 1, TP.HCM', 'cod', 'paid', 'delivered', N'Giao hàng giờ hành chính', '2024-11-28 09:15:00', '2024-11-30 14:20:00'),
(2, 'ORD202412010002', 620000, 0, 50000, 570000, N'Nguyễn Văn An', '0912345678', N'123 Lê Lợi, Quận 1, TP.HCM', 'momo', 'paid', 'delivered', NULL, '2024-11-25 14:30:00', '2024-11-27 10:15:00'),
(2, 'ORD202412010003', 280000, 30000, 0, 310000, N'Nguyễn Văn An', '0912345678', N'123 Lê Lợi, Quận 1, TP.HCM', 'cod', 'paid', 'shipping', NULL, '2024-12-01 08:20:00', '2024-12-02 09:00:00');

-- User ID 3: tranthib - 4 đơn hàng
INSERT INTO Orders (user_id, order_code, subtotal, shipping_fee, discount, total, customer_name, customer_phone, shipping_address, payment_method, payment_status, order_status, note, created_at, updated_at)
VALUES 
(3, 'ORD202411200001', 890000, 0, 0, 890000, N'Trần Thị Bình', '0923456789', N'456 Nguyễn Huệ, Quận 3, TP.HCM', 'zalopay', 'paid', 'delivered', NULL, '2024-11-20 10:45:00', '2024-11-22 16:30:00'),
(3, 'ORD202411250002', 1250000, 0, 100000, 1150000, N'Trần Thị Bình', '0923456789', N'456 Nguyễn Huệ, Quận 3, TP.HCM', 'momo', 'paid', 'delivered', N'Giao buổi tối', '2024-11-25 15:20:00', '2024-11-27 18:45:00'),
(3, 'ORD202411280003', 420000, 30000, 0, 450000, N'Trần Thị Bình', '0923456789', N'456 Nguyễn Huệ, Quận 3, TP.HCM', 'cod', 'paid', 'delivered', NULL, '2024-11-28 11:10:00', '2024-11-30 09:20:00'),
(3, 'ORD202412010004', 350000, 30000, 30000, 350000, N'Trần Thị Bình', '0923456789', N'456 Nguyễn Huệ, Quận 3, TP.HCM', 'cod', 'pending', 'confirmed', NULL, '2024-12-01 16:40:00', '2024-12-01 16:40:00');

-- User ID 4: leminchau - 3 đơn hàng
INSERT INTO Orders (user_id, order_code, subtotal, shipping_fee, discount, total, customer_name, customer_phone, shipping_address, payment_method, payment_status, order_status, note, created_at, updated_at)
VALUES 
(4, 'ORD202411220001', 580000, 0, 0, 580000, N'Lê Minh Châu', '0934567890', N'789 Trần Hưng Đạo, Quận 5, TP.HCM', 'momo', 'paid', 'delivered', NULL, '2024-11-22 13:25:00', '2024-11-24 15:10:00'),
(4, 'ORD202411270002', 720000, 0, 50000, 670000, N'Lê Minh Châu', '0934567890', N'789 Trần Hưng Đạo, Quận 5, TP.HCM', 'zalopay', 'paid', 'delivered', NULL, '2024-11-27 09:50:00', '2024-11-29 14:30:00'),
(4, 'ORD202412020003', 195000, 30000, 0, 225000, N'Lê Minh Châu', '0934567890', N'789 Trần Hưng Đạo, Quận 5, TP.HCM', 'cod', 'pending', 'pending', N'Gọi trước khi giao', '2024-12-02 10:15:00', '2024-12-02 10:15:00');

-- User ID 5: phamtuandung - 3 đơn hàng
INSERT INTO Orders (user_id, order_code, subtotal, shipping_fee, discount, total, customer_name, customer_phone, shipping_address, payment_method, payment_status, order_status, note, created_at, updated_at)
VALUES 
(5, 'ORD202411210001', 960000, 0, 0, 960000, N'Phạm Tuấn Dũng', '0945678901', N'321 Lý Thường Kiệt, Quận 10, TP.HCM', 'momo', 'paid', 'delivered', NULL, '2024-11-21 08:30:00', '2024-11-23 11:45:00'),
(5, 'ORD202411260002', 440000, 30000, 0, 470000, N'Phạm Tuấn Dũng', '0945678901', N'321 Lý Thường Kiệt, Quận 10, TP.HCM', 'cod', 'paid', 'delivered', NULL, '2024-11-26 14:20:00', '2024-11-28 16:50:00'),
(5, 'ORD202412010005', 830000, 0, 70000, 760000, N'Phạm Tuấn Dũng', '0945678901', N'321 Lý Thường Kiệt, Quận 10, TP.HCM', 'zalopay', 'paid', 'shipping', NULL, '2024-12-01 11:30:00', '2024-12-02 08:20:00');

-- User ID 6: vuthao - 2 đơn hàng
INSERT INTO Orders (user_id, order_code, subtotal, shipping_fee, discount, total, customer_name, customer_phone, shipping_address, payment_method, payment_status, order_status, note, created_at, updated_at)
VALUES 
(6, 'ORD202411240001', 680000, 0, 50000, 630000, N'Vũ Thảo', '0956789012', N'654 Võ Văn Tần, Quận 3, TP.HCM', 'momo', 'paid', 'delivered', NULL, '2024-11-24 12:10:00', '2024-11-26 09:40:00'),
(6, 'ORD202411290002', 290000, 30000, 0, 320000, N'Vũ Thảo', '0956789012', N'654 Võ Văn Tần, Quận 3, TP.HCM', 'cod', 'paid', 'delivered', N'Để hàng bảo vệ', '2024-11-29 17:15:00', '2024-12-01 10:25:00');

-- User ID 7: doquang - 2 đơn hàng
INSERT INTO Orders (user_id, order_code, subtotal, shipping_fee, discount, total, customer_name, customer_phone, shipping_address, payment_method, payment_status, order_status, note, created_at, updated_at)
VALUES 
(7, 'ORD202411230001', 530000, 0, 0, 530000, N'Đỗ Quang', '0967890123', N'987 Hai Bà Trưng, Quận 1, TP.HCM', 'zalopay', 'paid', 'delivered', NULL, '2024-11-23 10:20:00', '2024-11-25 13:55:00'),
(7, 'ORD202412010006', 380000, 30000, 30000, 380000, N'Đỗ Quang', '0967890123', N'987 Hai Bà Trưng, Quận 1, TP.HCM', 'momo', 'pending', 'confirmed', NULL, '2024-12-01 15:45:00', '2024-12-01 15:45:00');

-- User ID 8: builinh - 3 đơn hàng
INSERT INTO Orders (user_id, order_code, subtotal, shipping_fee, discount, total, customer_name, customer_phone, shipping_address, payment_method, payment_status, order_status, note, created_at, updated_at)
VALUES 
(8, 'ORD202411190001', 750000, 0, 0, 750000, N'Bùi Linh', '0978901234', N'159 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM', 'momo', 'paid', 'delivered', NULL, '2024-11-19 09:40:00', '2024-11-21 14:15:00'),
(8, 'ORD202411270003', 425000, 30000, 0, 455000, N'Bùi Linh', '0978901234', N'159 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM', 'cod', 'paid', 'delivered', NULL, '2024-11-27 13:30:00', '2024-11-29 11:20:00'),
(8, 'ORD202412020004', 180000, 30000, 0, 210000, N'Bùi Linh', '0978901234', N'159 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM', 'cod', 'pending', 'pending', NULL, '2024-12-02 09:25:00', '2024-12-02 09:25:00');

GO

-- OrderItems cho các đơn hàng trên
-- ORD202412010001 (User 2) - 480,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(1, 1, N'Gạo ST25', 162000, 2, 324000),
(1, 5, N'Rau cải xanh', 15000, 4, 60000),
(1, 7, N'Trứng gà', 45000, 2, 90000);

-- ORD202412010002 (User 2) - 570,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(2, 3, N'Cá hồi Na Uy', 297500, 2, 595000),
(2, 6, N'Cà chua', 25000, 1, 25000);

-- ORD202412010003 (User 2) - 310,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(3, 2, N'Thịt heo ba chỉ', 114000, 2, 228000),
(3, 5, N'Rau cải xanh', 15000, 2, 30000),
(3, 6, N'Cà chua', 25000, 1, 25000);

-- ORD202411200001 (User 3) - 890,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(4, 3, N'Cá hồi Na Uy', 297500, 3, 892500);

-- ORD202411250002 (User 3) - 1,150,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(5, 10, N'Bò Mỹ', 450000, 2, 900000),
(5, 3, N'Cá hồi Na Uy', 297500, 1, 297500),
(5, 7, N'Trứng gà', 45000, 1, 45000);

-- ORD202411280003 (User 3) - 450,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(6, 8, N'Thịt gà', 104500, 3, 313500),
(6, 1, N'Gạo ST25', 162000, 1, 162000);

-- ORD202412010004 (User 3) - 350,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(7, 4, N'Tôm sú', 280000, 1, 280000),
(7, 5, N'Rau cải xanh', 15000, 3, 45000),
(7, 6, N'Cà chua', 25000, 2, 50000);

-- ORD202411220001 (User 4) - 580,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(8, 1, N'Gạo ST25', 162000, 3, 486000),
(8, 7, N'Trứng gà', 45000, 2, 90000);

-- ORD202411270002 (User 4) - 670,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(9, 3, N'Cá hồi Na Uy', 297500, 2, 595000),
(9, 2, N'Thịt heo ba chỉ', 114000, 1, 114000);

-- ORD202412020003 (User 4) - 225,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(10, 5, N'Rau cải xanh', 15000, 5, 75000),
(10, 6, N'Cà chua', 25000, 3, 75000),
(10, 7, N'Trứng gà', 45000, 1, 45000);

-- ORD202411210001 (User 5) - 960,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(11, 10, N'Bò Mỹ', 450000, 2, 900000),
(11, 5, N'Rau cải xanh', 15000, 4, 60000);

-- ORD202411260002 (User 5) - 470,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(12, 2, N'Thịt heo ba chỉ', 114000, 3, 342000),
(12, 8, N'Thịt gà', 104500, 1, 104500);

-- ORD202412010005 (User 5) - 760,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(13, 3, N'Cá hồi Na Uy', 297500, 2, 595000),
(13, 4, N'Tôm sú', 280000, 1, 280000);

-- ORD202411240001 (User 6) - 630,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(14, 1, N'Gạo ST25', 162000, 4, 648000),
(14, 7, N'Trứng gà', 45000, 1, 45000);

-- ORD202411290002 (User 6) - 320,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(15, 2, N'Thịt heo ba chỉ', 114000, 2, 228000),
(15, 5, N'Rau cải xanh', 15000, 4, 60000);

-- ORD202411230001 (User 7) - 530,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(16, 8, N'Thịt gà', 104500, 3, 313500),
(16, 1, N'Gạo ST25', 162000, 1, 162000),
(16, 7, N'Trứng gà', 45000, 1, 45000);

-- ORD202412010006 (User 7) - 380,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(17, 4, N'Tôm sú', 280000, 1, 280000),
(17, 6, N'Cà chua', 25000, 3, 75000),
(17, 5, N'Rau cải xanh', 15000, 3, 45000);

-- ORD202411190001 (User 8) - 750,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(18, 3, N'Cá hồi Na Uy', 297500, 2, 595000),
(18, 1, N'Gạo ST25', 162000, 1, 162000);

-- ORD202411270003 (User 8) - 455,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(19, 2, N'Thịt heo ba chỉ', 114000, 3, 342000),
(19, 8, N'Thịt gà', 104500, 1, 104500);

-- ORD202412020004 (User 8) - 210,000đ
INSERT INTO OrderItems (order_id, product_id, product_name, price, quantity, subtotal)
VALUES 
(20, 5, N'Rau cải xanh', 15000, 6, 90000),
(20, 6, N'Cà chua', 25000, 4, 100000);

GO

PRINT '✅ Đã tạo 20 đơn hàng mẫu với 56 OrderItems';
PRINT 'Trạng thái: 15 delivered, 2 shipping, 2 confirmed, 1 pending';
PRINT 'Phương thức: COD (8), Momo (7), ZaloPay (5)';
GO
