
USE DB_SieuThi_Hung;
GO

SET IDENTITY_INSERT Products ON;
GO

-- Category 1: Thịt lợn/Gà tươi (10 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(1, N'Thịt ba chỉ lợn', N'Thịt ba chỉ lợn tươi ngon, nhiều lớp mỡ nạc xen kẽ', 85000, 0, 50, 1, N'thit-ba-chi.jpg', N'kg', 1),
(2, N'Thịt nạc vai lợn', N'Thịt nạc vai lợn tươi, thích hợp làm món xào, nướng', 95000, 5, 45, 1, N'thit-nac-vai.jpg', N'kg', 1),
(3, N'Thịt đùi gà', N'Đùi gà công nghiệp, tươi sạch', 65000, 0, 60, 1, N'dui-ga.jpg', N'kg', 1),
(4, N'Cánh gà', N'Cánh gà tươi, phù hợp chiên giòn hoặc nướng', 55000, 10, 55, 1, N'canh-ga.jpg', N'kg', 1),
(5, N'Thịt nạc dăm lợn', N'Thịt nạc dăm lợn, thích hợp làm thịt băm', 90000, 0, 40, 1, N'thit-nac-dam.jpg', N'kg', 1),
(6, N'Sườn lợn non', N'Sườn lợn non, nhiều xương ống', 120000, 0, 30, 1, N'suon-non.jpg', N'kg', 1),
(7, N'Gà ta nguyên con', N'Gà ta chạy bộ, thịt săn chắc', 150000, 0, 20, 1, N'ga-ta.jpg', N'con', 1),
(8, N'Thịt mông lợn', N'Thịt mông lợn, ít mỡ, nhiều nạc', 100000, 0, 35, 1, N'thit-mong.jpg', N'kg', 1),
(9, N'Chân giò lợn', N'Chân giò lợn trước, thích hợp hầm, ninh', 75000, 0, 25, 1, N'chan-gio.jpg', N'kg', 1),
(10, N'Gà công nghiệp nguyên con', N'Gà công nghiệp sạch', 70000, 5, 40, 1, N'ga-cong-nghiep.jpg', N'con', 1);

-- Category 2: Gia vị (Nước mắm, hạt nêm) (12 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(11, N'Nước mắm Nam Ngư 500ml', N'Nước mắm truyền thống, độ đạm 40', 35000, 0, 100, 2, N'nuoc-mam-nam-ngu.jpg', N'chai', 1),
(12, N'Hạt nêm Knorr 900g', N'Hạt nêm thịt thăn, xương ống', 45000, 10, 120, 2, N'hat-nem-knorr.jpg', N'gói', 1),
(13, N'Dầu hào Maggi 510g', N'Dầu hào đặc biệt, tăng hương vị', 38000, 0, 80, 2, N'dau-hao-maggi.jpg', N'chai', 1),
(14, N'Tương ớt Cholimex 270g', N'Tương ớt cay đặc biệt', 18000, 0, 90, 2, N'tuong-ot-cholimex.jpg', N'chai', 1),
(15, N'Hạt nêm Aji-ngon 400g', N'Hạt nêm hương vị tự nhiên', 28000, 5, 110, 2, N'hat-nem-aji-ngon.jpg', N'gói', 1),
(16, N'Muối I-ốt 500g', N'Muối iốt tinh khiết', 8000, 0, 150, 2, N'muoi-iot.jpg', N'gói', 1),
(17, N'Đường trắng Biên Hòa 1kg', N'Đường tinh luyện trắng sạch', 22000, 0, 100, 2, N'duong-trang.jpg', N'gói', 1),
(18, N'Bột canh Ajinomoto 200g', N'Bột canh hạt nhỏ', 15000, 0, 130, 2, N'bot-canh-ajinomoto.jpg', N'gói', 1),
(19, N'Nước tương Maggi 300ml', N'Nước tương đậm đặc', 20000, 0, 85, 2, N'nuoc-tuong-maggi.jpg', N'chai', 1),
(20, N'Tiêu đen xay 50g', N'Tiêu đen xay từ tiêu thượng hạng', 25000, 0, 70, 2, N'tieu-den.jpg', N'gói', 1),
(21, N'Bột nghệ 50g', N'Bột nghệ nguyên chất', 12000, 0, 60, 2, N'bot-nghe.jpg', N'gói', 1),
(22, N'Ngũ vị hương 50g', N'Ngũ vị hương thơm nồng', 18000, 0, 55, 2, N'ngu-vi-huong.jpg', N'gói', 1);

-- Category 3: Mì tôm (10 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(23, N'Mì Hao Hao tôm chua cay (30 gói)', N'Thùng 30 gói mì Hao Hao vị tôm chua cay', 105000, 5, 80, 3, N'mi-hao-hao.jpg', N'thùng', 1),
(24, N'Mì Kokomi tôm chua cay (30 gói)', N'Thùng 30 gói mì Kokomi', 120000, 0, 70, 3, N'mi-kokomi.jpg', N'thùng', 1),
(25, N'Mì Omachi xào tôm (30 gói)', N'Thùng 30 gói mì xào Omachi', 135000, 10, 60, 3, N'mi-omachi.jpg', N'thùng', 1),
(26, N'Mì 3 Miền tôm (30 gói)', N'Thùng 30 gói mì 3 Miền', 100000, 0, 75, 3, N'mi-3-mien.jpg', N'thùng', 1),
(27, N'Mì Gấu Đỏ bò (30 gói)', N'Thùng 30 gói mì Gấu Đỏ', 95000, 5, 65, 3, N'mi-gau-do.jpg', N'thùng', 1),
(28, N'Miến Phú Hương gà (20 gói)', N'Thùng 20 gói miến Phú Hương', 80000, 0, 50, 3, N'mien-phu-huong.jpg', N'thùng', 1),
(29, N'Hủ tiếu Nam Vang Vifon (30 gói)', N'Thùng 30 gói hủ tiếu Nam Vang', 125000, 0, 55, 3, N'hu-tieu-vifon.jpg', N'thùng', 1),
(30, N'Mì Ly Hảo Hảo tôm chua cay (24 ly)', N'Thùng 24 ly mì Hảo Hảo', 140000, 5, 45, 3, N'mi-ly-hao-hao.jpg', N'thùng', 1),
(31, N'Mì Ly Cung Đình bò (24 ly)', N'Thùng 24 ly mì Cung Đình', 160000, 0, 40, 3, N'mi-ly-cung-dinh.jpg', N'thùng', 1),
(32, N'Mì gói Indomie (30 gói)', N'Thùng 30 gói mì Indomie', 110000, 0, 50, 3, N'mi-indomie.jpg', N'thùng', 1);

-- Category 4: Trứng (6 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(33, N'Trứng gà công nghiệp (vỉ 10 quả)', N'Trứng gà tươi, vỉ 10 quả', 35000, 0, 200, 4, N'trung-ga.jpg', N'vỉ', 1),
(34, N'Trứng gà Omega 3 (vỉ 10 quả)', N'Trứng gà bổ sung Omega 3', 45000, 0, 150, 4, N'trung-ga-omega.jpg', N'vỉ', 1),
(35, N'Trứng vịt (vỉ 10 quả)', N'Trứng vịt tươi', 38000, 0, 120, 4, N'trung-vit.jpg', N'vỉ', 1),
(36, N'Trứng cút (khay 20 quả)', N'Trứng cút tươi', 25000, 0, 100, 4, N'trung-cut.jpg', N'khay', 1),
(37, N'Trứng gà ta (vỉ 10 quả)', N'Trứng gà ta thả vườn', 55000, 5, 80, 4, N'trung-ga-ta.jpg', N'vỉ', 1),
(38, N'Trứng vịt muối (4 quả)', N'Trứng vịt muối đóng gói', 28000, 0, 90, 4, N'trung-vit-muoi.jpg', N'gói', 1);

-- Category 5: Tã giấy (8 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(39, N'Tã Bobby Fresh S 84 miếng', N'Tã Bobby cho trẻ sơ sinh', 210000, 10, 50, 5, N'ta-bobby-s.jpg', N'gói', 1),
(40, N'Tã Bobby Fresh M 72 miếng', N'Tã Bobby cho trẻ 6-11kg', 220000, 10, 45, 5, N'ta-bobby-m.jpg', N'gói', 1),
(41, N'Tã Bobby Fresh L 60 miếng', N'Tã Bobby cho trẻ 9-14kg', 230000, 10, 40, 5, N'ta-bobby-l.jpg', N'gói', 1),
(42, N'Tã Huggies Dry Pants M 68 miếng', N'Tã quần Huggies khô thoáng', 280000, 5, 35, 5, N'ta-huggies-m.jpg', N'gói', 1),
(43, N'Tã Huggies Dry Pants L 56 miếng', N'Tã quần Huggies size L', 290000, 5, 30, 5, N'ta-huggies-l.jpg', N'gói', 1),
(44, N'Tã Pampers Premium S 84 miếng', N'Tã Pampers cao cấp', 350000, 0, 25, 5, N'ta-pampers-s.jpg', N'gói', 1),
(45, N'Tã Pampers Premium M 68 miếng', N'Tã Pampers cao cấp size M', 360000, 0, 20, 5, N'ta-pampers-m.jpg', N'gói', 1),
(46, N'Tã Diana Sensi S 80 miếng', N'Tã Diana Sensi siêu mềm', 180000, 5, 40, 5, N'ta-diana-s.jpg', N'gói', 1);

-- Category 6: Gạo (8 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(47, N'Gạo ST25 5kg', N'Gạo ST25 thơm ngon, hạt dài', 180000, 0, 60, 6, N'gao-st25.jpg', N'túi', 1),
(48, N'Gạo Thái Hom Mali 5kg', N'Gạo Thái Lan hảo hạng', 150000, 5, 70, 6, N'gao-thai.jpg', N'túi', 1),
(49, N'Gạo Nàng Hoa 9 5kg', N'Gạo Nàng Hoa thơm dẻo', 95000, 0, 80, 6, N'gao-nang-hoa.jpg', N'túi', 1),
(50, N'Gạo Jasmine 5kg', N'Gạo Jasmine thơm nhẹ', 85000, 0, 90, 6, N'gao-jasmine.jpg', N'túi', 1),
(51, N'Gạo Hạt Ngọc Trời 5kg', N'Gạo Hạt Ngọc Trời Vĩnh Long', 110000, 0, 65, 6, N'gao-hat-ngoc-troi.jpg', N'túi', 1),
(52, N'Gạo Tài Nguyên 10kg', N'Gạo Tài Nguyên túi 10kg', 180000, 10, 50, 6, N'gao-tai-nguyen.jpg', N'túi', 1),
(53, N'Gạo Sóc Thái 5kg', N'Gạo Sóc Thái trắng sạch', 90000, 0, 75, 6, N'gao-soc-thai.jpg', N'túi', 1),
(54, N'Gạo lức huyết rồng 1kg', N'Gạo lức đỏ giàu dinh dưỡng', 45000, 0, 40, 6, N'gao-luc-do.jpg', N'túi', 1);

-- Category 7: Sữa tươi (10 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(55, N'Sữa tươi Vinamilk không đường 1L', N'Sữa tươi 100% không đường', 32000, 0, 150, 7, N'sua-vinamilk-khong-duong.jpg', N'hộp', 1),
(56, N'Sữa tươi Vinamilk có đường 1L', N'Sữa tươi có đường thơm ngon', 30000, 0, 160, 7, N'sua-vinamilk-co-duong.jpg', N'hộp', 1),
(57, N'Sữa tươi TH True Milk không đường 1L', N'Sữa organic không đường', 38000, 5, 120, 7, N'sua-th-khong-duong.jpg', N'hộp', 1),
(58, N'Sữa tươi TH True Milk có đường 1L', N'Sữa organic có đường', 36000, 5, 130, 7, N'sua-th-co-duong.jpg', N'hộp', 1),
(59, N'Sữa chua uống Vinamilk dâu 180ml (lốc 4)', N'Sữa chua uống vị dâu', 18000, 0, 200, 7, N'sua-chua-uong-dau.jpg', N'lốc', 1),
(60, N'Sữa chua uống TH True Yogurt (lốc 4)', N'Sữa chua uống TH nhiều vị', 22000, 0, 180, 7, N'sua-chua-th.jpg', N'lốc', 1),
(61, N'Sữa tươi Mộc Châu không đường 1L', N'Sữa tươi Mộc Châu nguyên chất', 35000, 0, 100, 7, N'sua-moc-chau.jpg', N'hộp', 1),
(62, N'Sữa tươi Dutch Lady 1L', N'Sữa tươi Dutch Lady dinh dưỡng', 42000, 0, 90, 7, N'sua-dutch-lady.jpg', N'hộp', 1),
(63, N'Sữa chua vinamilk nếp cẩm (lốc 4)', N'Sữa chua nếp cẩm thơm ngon', 20000, 0, 170, 7, N'sua-chua-nep-cam.jpg', N'lốc', 1),
(64, N'Sữa chua có đường Vinamilk (lốc 4)', N'Sữa chua có đường 100g', 16000, 0, 190, 7, N'sua-chua-co-duong.jpg', N'lốc', 1);

-- Category 8: Bia (8 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(65, N'Bia Tiger (thùng 24 lon)', N'Bia Tiger lon 330ml', 290000, 5, 100, 8, N'bia-tiger.jpg', N'thùng', 1),
(66, N'Bia Heineken (thùng 24 lon)', N'Bia Heineken lon 330ml', 380000, 5, 80, 8, N'bia-heineken.jpg', N'thùng', 1),
(67, N'Bia Sài Gòn Đỏ (thùng 24 lon)', N'Bia Sài Gòn Đỏ lon 330ml', 260000, 0, 120, 8, N'bia-saigon-do.jpg', N'thùng', 1),
(68, N'Bia Sài Gòn Xanh (thùng 24 lon)', N'Bia Sài Gòn Xanh lon 330ml', 250000, 0, 130, 8, N'bia-saigon-xanh.jpg', N'thùng', 1),
(69, N'Bia 333 (thùng 24 lon)', N'Bia 333 lon 330ml', 245000, 5, 110, 8, N'bia-333.jpg', N'thùng', 1),
(70, N'Bia Budweiser (thùng 24 lon)', N'Bia Budweiser lon 330ml', 400000, 0, 60, 8, N'bia-budweiser.jpg', N'thùng', 1),
(71, N'Bia Larue (thùng 24 lon)', N'Bia Larue lon 330ml', 240000, 0, 90, 8, N'bia-larue.jpg', N'thùng', 1),
(72, N'Bia Bivina (thùng 24 lon)', N'Bia Bivina lon 330ml', 235000, 5, 95, 8, N'bia-bivina.jpg', N'thùng', 1);

-- Category 9: Trái cây (12 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(73, N'Táo Envy New Zealand', N'Táo Envy nhập khẩu New Zealand', 120000, 0, 50, 9, N'tao-envy.jpg', N'kg', 1),
(74, N'Cam sành Cao Phong', N'Cam sành Hòa Bình', 35000, 0, 80, 9, N'cam-sanh.jpg', N'kg', 1),
(75, N'Nho Mỹ không hạt', N'Nho đen không hạt nhập Mỹ', 180000, 10, 40, 9, N'nho-my.jpg', N'kg', 1),
(76, N'Xoài cát Hòa Lộc', N'Xoài cát Hòa Lộc Tiền Giang', 55000, 0, 60, 9, N'xoai-cat.jpg', N'kg', 1),
(77, N'Bưởi da xanh', N'Bưởi da xanh Bến Tre', 25000, 0, 70, 9, N'buoi-da-xanh.jpg', N'kg', 1),
(78, N'Thanh long ruột đỏ', N'Thanh long ruột đỏ Bình Thuận', 28000, 0, 90, 9, N'thanh-long.jpg', N'kg', 1),
(79, N'Dưa hấu không hạt', N'Dưa hấu không hạt ngọt', 18000, 0, 100, 9, N'dua-hau.jpg', N'kg', 1),
(80, N'Dứa Cayenne', N'Dứa Cayenne thơm ngọt', 22000, 0, 85, 9, N'dua-cayenne.jpg', N'kg', 1),
(81, N'Măng cụt', N'Măng cụt tươi ngon', 65000, 5, 45, 9, N'mang-cut.jpg', N'kg', 1),
(82, N'Chôm chôm', N'Chôm chôm tươi ngọt', 30000, 0, 75, 9, N'chom-chom.jpg', N'kg', 1),
(83, N'Chuối tiêu', N'Chuối tiêu chín vừa', 15000, 0, 120, 9, N'chuoi-tieu.jpg', N'kg', 1),
(84, N'Đu đủ chín', N'Đu đủ chín ngọt', 20000, 0, 65, 9, N'du-du.jpg', N'kg', 1);

-- Category 10: Nước giặt (8 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(85, N'Nước giặt OMO Matic 3.8kg', N'Nước giặt OMO dành cho máy giặt', 185000, 10, 60, 10, N'nuoc-giat-omo.jpg', N'túi', 1),
(86, N'Nước giặt Ariel 3.5kg', N'Nước giặt Ariel dạng túi', 175000, 10, 65, 10, N'nuoc-giat-ariel.jpg', N'túi', 1),
(87, N'Nước giặt Tide 3.8kg', N'Nước giặt Tide trắng sạch', 170000, 5, 70, 10, N'nuoc-giat-tide.jpg', N'túi', 1),
(88, N'Nước giặt Comfort 3.8kg', N'Nước giặt Comfort hương hoa', 165000, 5, 55, 10, N'nuoc-giat-comfort.jpg', N'túi', 1),
(89, N'Nước giặt Attack 3.4kg', N'Nước giặt Attack khử khuẩn', 160000, 0, 50, 10, N'nuoc-giat-attack.jpg', N'túi', 1),
(90, N'Nước giặt IZI Home 3.8kg', N'Nước giặt IZI Home túi 3.8kg', 140000, 10, 75, 10, N'nuoc-giat-izi.jpg', N'túi', 1),
(91, N'Nước giặt NET 3.5kg', N'Nước giặt NET an toàn', 145000, 5, 60, 10, N'nuoc-giat-net.jpg', N'túi', 1),
(92, N'Nước giặt Viso 3.8kg', N'Nước giặt Viso thơm lâu', 155000, 0, 55, 10, N'nuoc-giat-viso.jpg', N'túi', 1);

-- Category 11: Rau củ (10 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(93, N'Cải thảo', N'Cải thảo tươi', 15000, 0, 100, 11, N'cai-thao.jpg', N'kg', 1),
(94, N'Cà rót', N'Cà rót tươi ngon', 18000, 0, 90, 11, N'ca-rot.jpg', N'kg', 1),
(95, N'Súp lơ xanh', N'Súp lơ xanh tươi', 35000, 0, 60, 11, N'sup-lo-xanh.jpg', N'kg', 1),
(96, N'Cà chua bi', N'Cà chua bi Đà Lạt', 25000, 0, 80, 11, N'ca-chua-bi.jpg', N'kg', 1),
(97, N'Khoai tây', N'Khoai tây Đà Lạt', 20000, 0, 120, 11, N'khoai-tay.jpg', N'kg', 1),
(98, N'Hành tây', N'Hành tây tím', 22000, 0, 100, 11, N'hanh-tay.jpg', N'kg', 1),
(99, N'Rau muống', N'Rau muống tươi', 10000, 0, 150, 11, N'rau-muong.jpg', N'kg', 1),
(100, N'Bí đao', N'Bí đao trắng', 12000, 0, 70, 11, N'bi-dao.jpg', N'kg', 1),
(101, N'Đậu que', N'Đậu que tươi xanh', 16000, 0, 85, 11, N'dau-que.jpg', N'kg', 1),
(102, N'Dưa leo', N'Dưa leo giòn ngọt', 14000, 0, 95, 11, N'dua-leo.jpg', N'kg', 1);

-- Category 12: Cà phê (8 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(103, N'Cà phê Trung Nguyên G7 3in1 (hộp 21 gói)', N'Cà phê hòa tan G7', 68000, 5, 100, 12, N'cafe-g7.jpg', N'hộp', 1),
(104, N'Cà phê Vinacafe 3in1 (hộp 20 gói)', N'Cà phê hòa tan Vinacafe', 55000, 0, 120, 12, N'cafe-vinacafe.jpg', N'hộp', 1),
(105, N'Cà phê Nescafe Gold 200g', N'Cà phê hòa tan cao cấp', 135000, 10, 60, 12, N'cafe-nescafe.jpg', N'hộp', 1),
(106, N'Cà phê phin Trung Nguyên 500g', N'Cà phê bột rang xay', 85000, 0, 80, 12, N'cafe-trung-nguyen-bot.jpg', N'gói', 1),
(107, N'Cà phê Highlands 200g', N'Cà phê hạt Highlands', 120000, 5, 50, 12, N'cafe-highlands.jpg', N'gói', 1),
(108, N'Cà phê MacCoffee 3in1 (hộp 20 gói)', N'Cà phê hòa tan MacCoffee', 48000, 0, 90, 12, N'cafe-maccoffee.jpg', N'hộp', 1),
(109, N'Cà phê đen NesCafe Đen Đá (hộp 24 gói)', N'Cà phê đen hòa tan', 62000, 0, 85, 12, N'cafe-den-da.jpg', N'hộp', 1),
(110, N'Cà phê sữa Kopiko (hộp 24 gói)', N'Cà phê hòa tan Kopiko', 58000, 5, 95, 12, N'cafe-kopiko.jpg', N'hộp', 1);

-- Category 13: Bánh mì (6 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(111, N'Bánh mì sandwich bơ sữa', N'Bánh mì sandwich mềm', 28000, 0, 80, 13, N'banh-mi-sandwich.jpg', N'gói', 1),
(112, N'Bánh mì que vị bơ', N'Bánh mì que giòn vị bơ', 12000, 0, 100, 13, N'banh-mi-que.jpg', N'gói', 1),
(113, N'Bánh mì gối Kinh Đô', N'Bánh mì gối nhân kem', 15000, 0, 90, 13, N'banh-mi-goi.jpg', N'gói', 1),
(114, N'Bánh mì tươi Phúc Long', N'Bánh mì tươi không nhân', 20000, 0, 60, 13, N'banh-mi-tuoi.jpg', N'gói', 1),
(115, N'Bánh mì croissant', N'Bánh mì croissant bơ', 25000, 5, 50, 13, N'banh-mi-croissant.jpg', N'gói', 1),
(116, N'Bánh mì nguyên cám', N'Bánh mì nguyên cám lành mạnh', 32000, 0, 45, 13, N'banh-mi-nguyen-cam.jpg', N'gói', 1);

-- Category 14: Dầu gội (8 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(117, N'Dầu gội Clear Men 630ml', N'Dầu gội Clear Men sạch gàu', 118000, 10, 70, 14, N'dau-goi-clear.jpg', N'chai', 1),
(118, N'Dầu gội Sunsilk 650ml', N'Dầu gội Sunsilk mượt mà', 95000, 10, 80, 14, N'dau-goi-sunsilk.jpg', N'chai', 1),
(119, N'Dầu gội Head & Shoulders 600ml', N'Dầu gội H&S sạch gàu', 125000, 5, 65, 14, N'dau-goi-hs.jpg', N'chai', 1),
(120, N'Dầu gội Dove 620ml', N'Dầu gội Dove phục hồi', 112000, 5, 75, 14, N'dau-goi-dove.jpg', N'chai', 1),
(121, N'Dầu gội Pantene 600ml', N'Dầu gội Pantene dưỡng chất', 105000, 0, 85, 14, N'dau-goi-pantene.jpg', N'chai', 1),
(122, N'Dầu gội Romano 650ml', N'Dầu gội Romano nam giới', 130000, 10, 60, 14, N'dau-goi-romano.jpg', N'chai', 1),
(123, N'Dầu gội Tresemmé 640ml', N'Dầu gội Tresemmé salon', 115000, 0, 55, 14, N'dau-goi-tresemme.jpg', N'chai', 1),
(124, N'Dầu gội X-Men 650ml', N'Dầu gội X-Men Energy', 98000, 5, 70, 14, N'dau-goi-xmen.jpg', N'chai', 1);

-- Category 15: Khăn giấy (6 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(125, N'Khăn giấy Kleenex (hộp 3 lớp)', N'Khăn giấy Kleenex hộp 180 tờ', 18000, 0, 150, 15, N'khan-giay-kleenex.jpg', N'hộp', 1),
(126, N'Khăn giấy Tempo (gói 10 tờ)', N'Khăn giấy Tempo bỏ túi', 5000, 0, 200, 15, N'khan-giay-tempo.jpg', N'gói', 1),
(127, N'Giấy vệ sinh Pulppy (lốc 10 cuộn)', N'Giấy vệ sinh Pulppy 3 lớp', 42000, 5, 100, 15, N'giay-vs-pulppy.jpg', N'lốc', 1),
(128, N'Giấy vệ sinh Saigon (lốc 10 cuộn)', N'Giấy vệ sinh Saigon 2 lớp', 35000, 0, 120, 15, N'giay-vs-saigon.jpg', N'lốc', 1),
(129, N'Khăn giấy Elene (hộp 3 lớp)', N'Khăn giấy Elene hộp 200 tờ', 16000, 0, 130, 15, N'khan-giay-elene.jpg', N'hộp', 1),
(130, N'Giấy ướt Bobby (gói 100 tờ)', N'Giấy ướt Bobby cho bé', 35000, 5, 90, 15, N'giay-uot-bobby.jpg', N'gói', 1);

-- Category 16: Dầu ăn (8 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(131, N'Dầu ăn Neptune Gold 2L', N'Dầu ăn Neptune cao cấp', 88000, 5, 80, 16, N'dau-an-neptune.jpg', N'chai', 1),
(132, N'Dầu ăn Cái Lân 2L', N'Dầu ăn Cái Lân thơm ngon', 75000, 0, 90, 16, N'dau-an-cai-lan.jpg', N'chai', 1),
(133, N'Dầu ăn Simply 1L', N'Dầu ăn Simply olive', 65000, 10, 70, 16, N'dau-an-simply.jpg', N'chai', 1),
(134, N'Dầu olive Filippo Berio 500ml', N'Dầu olive nguyên chất', 180000, 0, 40, 16, N'dau-olive.jpg', N'chai', 1),
(135, N'Dầu ăn Meizan Gold 2L', N'Dầu ăn Meizan cao cấp', 85000, 5, 75, 16, N'dau-an-meizan.jpg', N'chai', 1),
(136, N'Dầu thực vật Tường An 2L', N'Dầu thực vật Tường An', 70000, 0, 85, 16, N'dau-tuong-an.jpg', N'chai', 1),
(137, N'Dầu gạo Riceoil 1L', N'Dầu gạo nguyên chất', 95000, 5, 55, 16, N'dau-gao.jpg', N'chai', 1),
(138, N'Dầu dừa Virgin Ben Tre 500ml', N'Dầu dừa ép lạnh', 120000, 0, 45, 16, N'dau-dua.jpg', N'chai', 1);

-- Category 17: Bò nhám (6 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(139, N'Thịt bò Úc nhập khẩu', N'Thịt bò Úc cao cấp', 250000, 5, 40, 17, N'thit-bo-uc.jpg', N'kg', 1),
(140, N'Thịt bò nạc vai', N'Thịt bò nạc vai tươi', 220000, 0, 50, 17, N'thit-bo-nac-vai.jpg', N'kg', 1),
(141, N'Thịt bò ba chỉ', N'Thịt bò ba chỉ nhiều mỡ', 210000, 0, 45, 17, N'thit-bo-ba-chi.jpg', N'kg', 1),
(142, N'Thịt bò nạm', N'Thịt bò nạm thích hợp hầm', 200000, 5, 55, 17, N'thit-bo-nam.jpg', N'kg', 1),
(143, N'Thịt bò mông', N'Thịt bò mông nạc', 230000, 0, 38, 17, N'thit-bo-mong.jpg', N'kg', 1),
(144, N'Sườn bò Mỹ', N'Sườn bò Mỹ nhập khẩu', 280000, 10, 30, 17, N'suon-bo-my.jpg', N'kg', 1);

-- Category 18: Muối chấm (6 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(145, N'Muối ớt xanh 100g', N'Muối ớt xanh đặc biệt', 15000, 0, 100, 18, N'muoi-ot-xanh.jpg', N'gói', 1),
(146, N'Muối tiêu chanh 100g', N'Muối tiêu chanh thơm cay', 12000, 0, 110, 18, N'muoi-tieu-chanh.jpg', N'gói', 1),
(147, N'Muối ớt Tây Ninh 100g', N'Muối ớt Tây Ninh truyền thống', 18000, 0, 90, 18, N'muoi-ot-tay-ninh.jpg', N'gói', 1),
(148, N'Muối ớt sa tế 100g', N'Muối ớt sa tế cay nồng', 20000, 5, 85, 18, N'muoi-sa-te.jpg', N'gói', 1),
(149, N'Muối me 100g', N'Muối me chua ngọt', 16000, 0, 95, 18, N'muoi-me.jpg', N'gói', 1),
(150, N'Muối ớt tỏi 100g', N'Muối ớt tỏi thơm nồng', 14000, 0, 105, 18, N'muoi-ot-toi.jpg', N'gói', 1);

-- Category 19: Nước xả (6 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(151, N'Nước xả Comfort 3.8L', N'Nước xả vải Comfort hương hoa', 155000, 10, 70, 19, N'nuoc-xa-comfort.jpg', N'túi', 1),
(152, N'Nước xả Downy 3.5L', N'Nước xả Downy thơm lâu', 165000, 10, 65, 19, N'nuoc-xa-downy.jpg', N'túi', 1),
(153, N'Nước xả Hygiene 3.5L', N'Nước xả Hygiene kháng khuẩn', 148000, 5, 75, 19, N'nuoc-xa-hygiene.jpg', N'túi', 1),
(154, N'Nước xả Viso 3.5L', N'Nước xả Viso hương nước hoa', 158000, 5, 60, 19, N'nuoc-xa-viso.jpg', N'túi', 1),
(155, N'Nước xả Pigeon 3.2L', N'Nước xả Pigeon cho bé', 140000, 0, 55, 19, N'nuoc-xa-pigeon.jpg', N'túi', 1),
(156, N'Nước xả Sunlight 3.6L', N'Nước xả Sunlight giữ màu', 145000, 5, 68, 19, N'nuoc-xa-sunlight.jpg', N'túi', 1);

-- Category 20: Thịt bò (đã có ở category 17 - bò nhám, nhưng thêm vài sản phẩm khác)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(157, N'Bò viên 500g', N'Bò viên tươi ngon', 65000, 0, 80, 20, N'bo-vien.jpg', N'gói', 1),
(158, N'Bò bía 500g', N'Bò bía đông lạnh', 70000, 5, 70, 20, N'bo-bia.jpg', N'gói', 1),
(159, N'Thăn nội bò Úc', N'Thăn nội bò Úc cao cấp', 350000, 10, 25, 20, N'than-noi-bo.jpg', N'kg', 1),
(160, N'Thịt bò xay 500g', N'Thịt bò xay tươi', 110000, 0, 60, 20, N'thit-bo-xay.jpg', N'gói', 1),
(161, N'Bò kho hộp 150g', N'Bò kho đóng hộp tiện lợi', 35000, 0, 90, 20, N'bo-kho-hop.jpg', N'hộp', 1),
(162, N'Bò nạm gân', N'Bò nạm gân thích hợp hầm', 215000, 0, 42, 20, N'bo-nam-gan.jpg', N'kg', 1);

-- Category 21: Sữa đặc (6 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(163, N'Sữa đặc Ông Thọ 380g', N'Sữa đặc có đường Ông Thọ', 28000, 0, 150, 21, N'sua-dac-ong-tho.jpg', N'lon', 1),
(164, N'Sữa đặc Ngôi Sao Phương Nam 380g', N'Sữa đặc có đường NSPM', 25000, 0, 140, 21, N'sua-dac-nspm.jpg', N'lon', 1),
(165, N'Sữa đặc Dutch Lady 380g', N'Sữa đặc có đường Dutch Lady', 32000, 5, 120, 21, N'sua-dac-dutch.jpg', N'lon', 1),
(166, N'Sữa đặc Vinamilk 380g', N'Sữa đặc có đường Vinamilk', 30000, 0, 130, 21, N'sua-dac-vinamilk.jpg', N'lon', 1),
(167, N'Sữa đặc không đường Ông Thọ 380g', N'Sữa đặc không đường', 30000, 0, 100, 21, N'sua-dac-khong-duong.jpg', N'lon', 1),
(168, N'Sữa đặc Daisy 380g', N'Sữa đặc Daisy thơm ngon', 26000, 0, 110, 21, N'sua-dac-daisy.jpg', N'lon', 1);

-- Category 22: Bơ/Mứt (8 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(169, N'Bơ Anchor 227g', N'Bơ lạt Anchor New Zealand', 85000, 5, 60, 22, N'bo-anchor.jpg', N'hộp', 1),
(170, N'Bơ Elle & Vire 250g', N'Bơ mặn Elle & Vire Pháp', 95000, 0, 50, 22, N'bo-elle-vire.jpg', N'hộp', 1),
(171, N'Mứt dâu Darbo 200g', N'Mứt dâu Áo nguyên chất', 65000, 0, 45, 22, N'mut-dau.jpg', N'lọ', 1),
(172, N'Mứt cam Darbo 200g', N'Mứt cam Áo thơm ngon', 68000, 0, 40, 22, N'mut-cam.jpg', N'lọ', 1),
(173, N'Pate gan Develey 125g', N'Pate gan Đức cao cấp', 45000, 5, 55, 22, N'pate-gan.jpg', N'hộp', 1),
(174, N'Phô mai Con Bò Cười 120g', N'Phô mai lát Con Bò Cười', 38000, 0, 80, 22, N'pho-mai-cbc.jpg', N'hộp', 1),
(175, N'Phô mai Anchor Cream 250g', N'Phô mai kem Anchor', 52000, 0, 70, 22, N'pho-mai-anchor.jpg', N'hộp', 1),
(176, N'Sữa chua Hy Lạp Greek 150g', N'Sữa chua Hy Lạp đặc', 25000, 0, 90, 22, N'sua-chua-greek.jpg', N'hộp', 1);

-- Category 23: Dầu xả (6 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(177, N'Dầu xả Clear 630ml', N'Dầu xả Clear mềm mượt', 115000, 10, 65, 23, N'dau-xa-clear.jpg', N'chai', 1),
(178, N'Dầu xả Sunsilk 650ml', N'Dầu xả Sunsilk phục hồi', 92000, 10, 75, 23, N'dau-xa-sunsilk.jpg', N'chai', 1),
(179, N'Dầu xả Dove 620ml', N'Dầu xả Dove dưỡng ẩm', 108000, 5, 70, 23, N'dau-xa-dove.jpg', N'chai', 1),
(180, N'Dầu xả Pantene 600ml', N'Dầu xả Pantene chống rụng tóc', 102000, 0, 80, 23, N'dau-xa-pantene.jpg', N'chai', 1),
(181, N'Dầu xả Tresemmé 640ml', N'Dầu xả Tresemmé salon', 112000, 0, 55, 23, N'dau-xa-tresemme.jpg', N'chai', 1),
(182, N'Dầu xả Rejoice 600ml', N'Dầu xả Rejoice mềm mượt', 95000, 5, 68, 23, N'dau-xa-rejoice.jpg', N'chai', 1);

-- Category 24: Bánh ngọt (10 sản phẩm)
INSERT INTO Products (id, name, description, price, discount_percent, stock, category_id, images, unit, status) VALUES
(183, N'Bánh Chocopie Orion (hộp 12 cái)', N'Bánh Chocopie hộp 12 cái', 48000, 5, 100, 24, N'banh-chocopie.jpg', N'hộp', 1),
(184, N'Bánh Oishi Bí Đỏ 150g', N'Bánh snack Oishi vị bí đỏ', 12000, 0, 120, 24, N'banh-oishi.jpg', N'gói', 1),
(185, N'Bánh Lays Potato Chips 52g', N'Snack khoai tây Lays', 10000, 0, 150, 24, N'banh-lays.jpg', N'gói', 1),
(186, N'Bánh quy Gấu Đỏ 378g', N'Bánh quy bơ Gấu Đỏ', 35000, 5, 90, 24, N'banh-quy-gau-do.jpg', N'hộp', 1),
(187, N'Bánh Kitkat 4 fingers', N'Bánh socola Kitkat', 18000, 0, 110, 24, N'banh-kitkat.jpg', N'thanh', 1),
(188, N'Bánh Oreo 137g', N'Bánh Oreo kem socola', 22000, 0, 130, 24, N'banh-oreo.jpg', N'gói', 1),
(189, N'Bánh Cosy Marie 360g', N'Bánh quy bơ Cosy', 38000, 5, 85, 24, N'banh-cosy.jpg', N'hộp', 1),
(190, N'Bánh snack Swing 56g', N'Bánh snack khoai tây Swing', 8000, 0, 140, 24, N'banh-swing.jpg', N'gói', 1),
(191, N'Bánh AFC Ritz 300g', N'Bánh quy ngọt AFC', 42000, 0, 75, 24, N'banh-ritz.jpg', N'hộp', 1),
(192, N'Bánh Goute Wafer 180g', N'Bánh xốp Goute kem', 25000, 5, 95, 24, N'banh-goute.jpg', N'gói', 1);

SET IDENTITY_INSERT Products OFF;
GO

-- Kết thúc file Products.sql
PRINT N'Đã thêm 192 sản phẩm vào database';
GO
