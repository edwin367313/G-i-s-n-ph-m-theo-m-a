const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { isValidEmail } = require('../utils/helpers');

/**
 * Đăng ký user mới
 */
const register = async (userData) => {
  const { username, email, password, fullName, phone, address } = userData;

  // Kiểm tra username đã tồn tại
  const existingUsername = await query(
    'SELECT id FROM Users WHERE username = @username',
    { username }
  );
  if (existingUsername && existingUsername.length > 0) {
    throw new Error('Username đã được sử dụng');
  }

  // Kiểm tra email đã tồn tại
  const existingEmail = await query(
    'SELECT id FROM Users WHERE email = @email',
    { email }
  );
  if (existingEmail && existingEmail.length > 0) {
    throw new Error('Email đã được sử dụng');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user mới
  const result = await query(`
    INSERT INTO Users (username, email, password, full_name, phone, address, role, is_active, created_at)
    OUTPUT INSERTED.*
    VALUES (@username, @email, @password, @fullName, @phone, @address, 'customer', 1, GETDATE())
  `, {
    username,
    email,
    password: hashedPassword,
    fullName,
    phone,
    address
  });

  const user = result[0];

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // Return user without password
  delete user.password;

  return {
    user,
    accessToken,
    refreshToken
  };
};

/**
 * Đăng nhập
 */
const login = async (usernameOrEmail, password) => {
  // Tìm user theo username hoặc email
  const field = isValidEmail(usernameOrEmail) ? 'email' : 'username';
  console.log('🔍 Login attempt:', { usernameOrEmail, field });
  
  const result = await query(
    `SELECT * FROM Users WHERE ${field} = @value`,
    { value: usernameOrEmail }
  );

  console.log('📊 Query result:', { found: result?.length, user: result?.[0]?.username });

  if (!result || result.length === 0) {
    throw new Error('Tài khoản hoặc mật khẩu không đúng');
  }

  const user = result[0];
  console.log('👤 User found:', { id: user.id, username: user.username, is_active: user.is_active });

  // Kiểm tra is_active
  if (!user.is_active) {
    throw new Error('Tài khoản đã bị khóa');
  }

  // Kiểm tra password
  console.log('🔐 Comparing passwords...');
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log('🔐 Password valid:', isPasswordValid);
  
  if (!isPasswordValid) {
    throw new Error('Tài khoản hoặc mật khẩu không đúng');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // Return user without password
  delete user.password;

  return {
    user,
    accessToken,
    refreshToken
  };
};

/**
 * Lấy thông tin user hiện tại
 */
const getCurrentUser = async (userId) => {
  const result = await query(
    'SELECT id, username, email, full_name, phone, address, role, is_active, avatar, created_at FROM Users WHERE id = @userId',
    { userId }
  );

  if (!result || result.length === 0) {
    throw new Error('User không tồn tại');
  }

  return result[0];
};

/**
 * Cập nhật profile
 */
const updateProfile = async (userId, updateData) => {
  const { fullName, phone, address, avatar } = updateData;

  const result = await query(`
    UPDATE Users
    SET full_name = COALESCE(@fullName, full_name),
        phone = COALESCE(@phone, phone),
        address = COALESCE(@address, address),
        avatar = COALESCE(@avatar, avatar),
        updated_at = GETDATE()
    OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.full_name, INSERTED.phone, INSERTED.address, INSERTED.role, INSERTED.is_active, INSERTED.avatar
    WHERE id = @userId
  `, {
    userId,
    fullName,
    phone,
    address,
    avatar
  });

  if (!result || result.length === 0) {
    throw new Error('User không tồn tại');
  }

  return result[0];
};

/**
 * Đổi mật khẩu
 */
const changePassword = async (userId, oldPassword, newPassword) => {
  // Lấy user
  const userResult = await query(
    'SELECT password FROM Users WHERE id = @userId',
    { userId }
  );

  if (!userResult || userResult.length === 0) {
    throw new Error('User không tồn tại');
  }

  const user = userResult[0];

  // Kiểm tra mật khẩu cũ
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Mật khẩu cũ không đúng');
  }

  // Hash mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await query(
    'UPDATE Users SET password = @password WHERE id = @userId',
    { userId, password: hashedPassword }
  );

  return { message: 'Đổi mật khẩu thành công' };
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword
};
