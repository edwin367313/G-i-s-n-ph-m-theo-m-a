-- Seed Categories

USE SieuThiABC;
GO

-- Delete existing data
DELETE FROM dbo.Categories;
DBCC CHECKIDENT ('dbo.Categories', RESEED, 0);
GO

INSERT INTO dbo.Categories (name, description, image, status)
VALUES 
(N'Thực phẩm tươi sống', N'Rau củ quả, thịt cá, hải sản tươi ngon', 'https://via.placeholder.com/300x200?text=Fresh+Food', 'active'),
(N'Thực phẩm khô', N'Gạo, mì, bột, đồ khô các loại', 'https://via.placeholder.com/300x200?text=Dry+Food', 'active'),
(N'Đồ uống', N'Nước giải khát, sữa, cà phê, trà', 'https://via.placeholder.com/300x200?text=Beverages', 'active'),
(N'Bánh kẹo', N'Bánh quy, kẹo, snack, đồ ăn vặt', 'https://via.placeholder.com/300x200?text=Snacks', 'active'),
(N'Gia vị', N'Nước mắm, dầu ăn, hạt nêm, gia vị', 'https://via.placeholder.com/300x200?text=Condiments', 'active'),
(N'Đồ gia dụng', N'Dụng cụ nhà bếp, đồ dùng sinh hoạt', 'https://via.placeholder.com/300x200?text=Household', 'active'),
(N'Chăm sóc cá nhân', N'Mỹ phẩm, vệ sinh cá nhân, sức khỏe', 'https://via.placeholder.com/300x200?text=Personal+Care', 'active');

PRINT 'Seeded ' + CAST(@@ROWCOUNT AS NVARCHAR) + ' categories';
GO