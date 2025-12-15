-- Seed Vouchers (mã giảm giá)

USE SieuThiABC;
GO

-- Delete existing data
DELETE FROM dbo.Vouchers;
DBCC CHECKIDENT ('dbo.Vouchers', RESEED, 0);
GO

DECLARE @Now DATETIME = GETDATE();
DECLARE @OneMonthLater DATETIME = DATEADD(MONTH, 1, @Now);
DECLARE @ThreeMonthsLater DATETIME = DATEADD(MONTH, 3, @Now);
DECLARE @SixMonthsLater DATETIME = DATEADD(MONTH, 6, @Now);
DECLARE @OneYearLater DATETIME = DATEADD(YEAR, 1, @Now);

INSERT INTO dbo.Vouchers (code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, used_count, start_date, end_date, status)
VALUES 
-- Voucher cho khách hàng mới
(N'WELCOME10', N'Giảm 10% cho đơn hàng đầu tiên', 'percent', 10, 100000, 50000, 1000, 0, @Now, @OneYearLater, 'active'),
(N'NEW50K', N'Giảm 50K cho đơn đầu từ 500K', 'fixed', 50000, 500000, NULL, 500, 0, @Now, @OneYearLater, 'active'),

-- Voucher freeship
(N'FREESHIP', N'Miễn phí vận chuyển', 'fixed', 30000, 200000, NULL, NULL, 0, @Now, @OneYearLater, 'active'),
(N'SHIP20K', N'Giảm 20K phí ship', 'fixed', 20000, 150000, NULL, 2000, 0, @Now, @ThreeMonthsLater, 'active'),

-- Voucher giảm giá theo %
(N'SUMMER15', N'Giảm 15% mùa hè', 'percent', 15, 300000, 100000, 1500, 0, @Now, @ThreeMonthsLater, 'active'),
(N'SALE20', N'Giảm 20% đơn từ 1 triệu', 'percent', 20, 1000000, 200000, 1000, 0, @Now, @SixMonthsLater, 'active'),
(N'VIP30', N'Giảm 30% cho VIP', 'percent', 30, 2000000, 500000, 500, 0, @Now, @OneYearLater, 'active'),

-- Voucher giảm giá cố định
(N'SAVE100K', N'Giảm 100K cho đơn từ 1 triệu', 'fixed', 100000, 1000000, NULL, 800, 0, @Now, @ThreeMonthsLater, 'active'),
(N'SAVE200K', N'Giảm 200K cho đơn từ 2 triệu', 'fixed', 200000, 2000000, NULL, 500, 0, @Now, @SixMonthsLater, 'active'),
(N'SAVE500K', N'Giảm 500K cho đơn từ 5 triệu', 'fixed', 500000, 5000000, NULL, 200, 0, @Now, @OneYearLater, 'active'),

-- Voucher dịp lễ
(N'NEWYEAR', N'Giảm 25% dịp Tết', 'percent', 25, 500000, 300000, 2000, 0, @Now, @OneMonthLater, 'active'),
(N'WOMEN8_3', N'Giảm 20% ngày Quốc tế Phụ nữ', 'percent', 20, 300000, 150000, 1500, 0, @Now, @ThreeMonthsLater, 'active'),
(N'BLACKFRIDAY', N'Giảm 50% Black Friday', 'percent', 50, 1000000, 500000, 1000, 0, @Now, @OneMonthLater, 'active'),

-- Voucher combo
(N'COMBO50K', N'Giảm 50K mua combo từ 500K', 'fixed', 50000, 500000, NULL, 1000, 0, @Now, @ThreeMonthsLater, 'active'),
(N'COMBO100K', N'Giảm 100K mua combo từ 1 triệu', 'fixed', 100000, 1000000, NULL, 800, 0, @Now, @ThreeMonthsLater, 'active'),

-- Voucher giới hạn số lượng
(N'FLASH50', N'Flash sale - Giảm 50K', 'fixed', 50000, 200000, NULL, 100, 0, @Now, @OneMonthLater, 'active'),
(N'FLASH100', N'Flash sale - Giảm 100K', 'fixed', 100000, 500000, NULL, 50, 0, @Now, @OneMonthLater, 'active'),

-- Voucher đã hết hạn (inactive)
(N'EXPIRED10', N'Voucher đã hết hạn', 'percent', 10, 100000, 50000, 500, 0, DATEADD(MONTH, -3, @Now), DATEADD(MONTH, -1, @Now), 'inactive');

PRINT 'Seeded ' + CAST(@@ROWCOUNT AS NVARCHAR) + ' vouchers';
GO
