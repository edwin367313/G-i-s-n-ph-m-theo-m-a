-- Seed Products (50 sản phẩm mẫu)

USE SieuThiABC;
GO

-- Delete existing data
DELETE FROM dbo.Products;
DBCC CHECKIDENT ('dbo.Products', RESEED, 0);
GO

-- Thực phẩm tươi sống (category_id = 1)
INSERT INTO dbo.Products (name, description, price, discount_percent, stock, category_id, images, unit, status)
VALUES 
(N'Gạo ST25', N'Gạo thơm ngon đạt giải World Best Rice', 180000, 10, 500, 0, '["https://via.placeholder.com/300"]', N'Kg', 'active'),
(N'Thịt heo ba chỉ', N'Thịt heo tươi sạch', 120000, 4, 200, 0, '["https://via.placeholder.com/300"]', N'Kg', 'active'),
(N'Cá hồi Na Uy', N'Cá hồi tươi nhập khẩu', 350000, 15, 100, 0, '["https://via.placeholder.com/300"]', N'Kg', 'active'),
(N'Tôm sú', N'Tôm sú tươi sống', 280000, 0, 150, 0, '["https://via.placeholder.com/300"]', N'Kg', 'active'),
(N'Rau cải xanh', N'Rau cải hữu cơ', 15000, 0, 300, 0, '["https://via.placeholder.com/300"]', N'Bó', 'active'),
(N'Cà chua', N'Cà chua Đà Lạt', 25000, 0, 250, 0, '["https://via.placeholder.com/300"]', N'Kg', 'active'),
(N'Trứng gà', N'Trứng gà ta', 45000, 0, 400, 0, '["https://via.placeholder.com/300"]', N'Hộp 10 quả', 'active'),
(N'Thịt gà', N'Thịt gà ta', 110000, 4, 180, 0, '["https://via.placeholder.com/300"]', N'Kg', 'active'),

-- Thực phẩm khô (category_id = 2)
(N'Mì gói Hảo Hảo', N'Mì gói vị tôm chua cay', 3000, 0, 1000, 1, '["https://via.placeholder.com/300"]', N'Gói', 'active'),
(N'Bột mì', N'Bột mì đa dụng', 35000, 0, 300, 1, '["https://via.placeholder.com/300"]', N'Kg', 'active'),
(N'Đường tinh luyện', N'Đường trắng', 18000, 0, 500, 1, '["https://via.placeholder.com/300"]', N'Kg', 'active'),
(N'Muối i-ốt', N'Muối tinh i-ốt', 8000, 0, 600, 1, '["https://via.placeholder.com/300"]', N'Gói 500g', 'active'),
(N'Bún khô', N'Bún khô đặc biệt', 25000, 0, 200, 1, '["https://via.placeholder.com/300"]', N'Gói', 'active'),

-- Đồ uống (category_id = 3)
(N'Coca Cola', N'Nước ngọt có ga', 10000, 0, 800, 2, '["https://via.placeholder.com/300"]', N'Lon 330ml', 'active'),
(N'Pepsi', N'Nước ngọt có ga', 10000, 0, 800, 2, '["https://via.placeholder.com/300"]', N'Lon 330ml', 'active'),
(N'Sting', N'Nước tăng lực', 10000, 0, 600, 2, '["https://via.placeholder.com/300"]', N'Lon 330ml', 'active'),
(N'Trà xanh 0 độ', N'Trà xanh không đường', 8000, 0, 500, 2, '["https://via.placeholder.com/300"]', N'Chai 450ml', 'active'),
(N'Sữa tươi Vinamilk', N'Sữa tươi thanh trùng', 30000, 4, 400, 2, '["https://via.placeholder.com/300"]', N'Hộp 1L', 'active'),
(N'Cà phê Trung Nguyên', N'Cà phê hòa tan', 85000, 10, 250, 2, '["https://via.placeholder.com/300"]', N'Hộp 18 gói', 'active'),
(N'Nước suối Lavie', N'Nước khoáng thiên nhiên', 5000, 0, 1000, 2, '["https://via.placeholder.com/300"]', N'Chai 500ml', 'active'),

-- Bánh kẹo (category_id = 4)
(N'Snack Oishi', N'Snack khoai tây', 12000, 0, 400, 3, '["https://via.placeholder.com/300"]', N'Gói', 'active'),
(N'Bánh quy Cosy', N'Bánh quy bơ', 25000, 0, 300, 3, '["https://via.placeholder.com/300"]', N'Hộp', 'active'),
(N'Kẹo dừa Bến Tre', N'Kẹo dừa truyền thống', 35000, 0, 200, 3, '["https://via.placeholder.com/300"]', N'Hộp', 'active'),
(N'Oreo', N'Bánh quy socola kem', 30000, 4, 350, 3, '["https://via.placeholder.com/300"]', N'Gói', 'active'),
(N'Kitkat', N'Socola sữa giòn', 15000, 0, 400, 3, '["https://via.placeholder.com/300"]', N'Thanh', 'active'),

-- Gia vị (category_id = 5)
(N'Nước mắm Nam Ngư', N'Nước mắm truyền thống', 45000, 0, 300, 4, '["https://via.placeholder.com/300"]', N'Chai 500ml', 'active'),
(N'Dầu ăn Tường An', N'Dầu ăn cao cấp', 55000, 4, 400, 4, '["https://via.placeholder.com/300"]', N'Chai 1L', 'active'),
(N'Hạt nêm Knorr', N'Hạt nêm thịt thăn xương ống', 28000, 0, 500, 4, '["https://via.placeholder.com/300"]', N'Gói 400g', 'active'),
(N'Tương ớt Chinsu', N'Tương ớt cay', 18000, 0, 350, 4, '["https://via.placeholder.com/300"]', N'Chai 270g', 'active'),
(N'Nước tương Maggi', N'Nước tương hảo hạng', 22000, 0, 300, 4, '["https://via.placeholder.com/300"]', N'Chai 500ml', 'active'),

-- Đồ gia dụng (category_id = 6)
(N'Dao inox', N'Dao inox cao cấp', 75000, 10, 150, 5, '["https://via.placeholder.com/300"]', N'Cái', 'active'),
(N'Thớt nhựa', N'Thớt nhựa an toàn', 45000, 0, 200, 5, '["https://via.placeholder.com/300"]', N'Cái', 'active'),
(N'Bát sứ', N'Bát ăn cơm', 15000, 0, 300, 5, '["https://via.placeholder.com/300"]', N'Cái', 'active'),
(N'Đũa inox', N'Đũa inox cao cấp', 25000, 0, 250, 5, '["https://via.placeholder.com/300"]', N'Đôi', 'active'),
(N'Nồi cơm điện', N'Nồi cơm điện 1.8L', 650000, 15, 80, 5, '["https://via.placeholder.com/300"]', N'Cái', 'active'),

-- Chăm sóc cá nhân (category_id = 7)
(N'Dầu gội Clear', N'Dầu gội đầu', 120000, 10, 200, 6, '["https://via.placeholder.com/300"]', N'Chai 650ml', 'active'),
(N'Kem đánh răng P/S', N'Kem đánh răng bạc hà', 35000, 0, 300, 6, '["https://via.placeholder.com/300"]', N'Tuýp', 'active'),
(N'Xà phòng Lifeb uoy', N'Xà phòng tắm', 25000, 0, 400, 6, '["https://via.placeholder.com/300"]', N'Cục', 'active'),
(N'Nước rửa tay Lifebuoy', N'Nước rửa tay diệt khuẩn', 45000, 4, 250, 6, '["https://via.placeholder.com/300"]', N'Chai 500ml', 'active'),
(N'Dầu xả Sunsilk', N'Dầu xả suôn mượt', 110000, 10, 180, 6, '["https://via.placeholder.com/300"]', N'Chai 650ml', 'active'),
(N'Sữa tắm Dove', N'Sữa tắm dưỡng ẩm', 95000, 10, 200, 6, '["https://via.placeholder.com/300"]', N'Chai 530ml', 'active'),
(N'Nước hoa Enchanteur', N'Nước hoa quyến rũ', 180000, 15, 120, 6, '["https://via.placeholder.com/300"]', N'Chai 100ml', 'active'),
(N'Bông tẩy trang', N'Bông tẩy trang 3 lớp', 28000, 0, 300, 6, '["https://via.placeholder.com/300"]', N'Túi 200 miếng', 'active'),
(N'Khăn giấy Tempo', N'Khăn giấy mềm mại', 15000, 0, 400, 6, '["https://via.placeholder.com/300"]', N'Gói', 'active'),
(N'Băng vệ sinh Kotex', N'Băng vệ sinh hàng ngày', 45000, 4, 250, 6, '["https://via.placeholder.com/300"]', N'Gói', 'active'),
(N'Tã Pampers', N'Tã em bé', 280000, 10, 150, 6, '["https://via.placeholder.com/300"]', N'Gói size M', 'active'),
(N'Sữa rửa mặt Acnes', N'Sữa rửa mặt trị mụn', 65000, 10, 200, 6, '["https://via.placeholder.com/300"]', N'Tuýp 100g', 'active');

PRINT 'Seeded ' + CAST(@@ROWCOUNT AS NVARCHAR) + ' products';
GO

