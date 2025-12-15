
USE SieuThiABC;
GO

UPDATE Users 
SET password = '123456'
WHERE username = 'admin';

SELECT 'Password updated for admin' as Message;
GO
