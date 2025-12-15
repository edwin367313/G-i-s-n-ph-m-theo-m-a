const { query } = require('../config/database');

/**
 * Lấy theme đang active
 */
const getActiveTheme = async () => {
  const result = await query(
    'SELECT * FROM Themes WHERE is_active = 1',
    {}
  );

  return result[0] || null;
};

/**
 * Lấy tất cả themes
 */
const getAllThemes = async () => {
  const result = await query(
    'SELECT * FROM Themes ORDER BY created_at DESC',
    {}
  );

  return result;
};

/**
 * Tạo theme mới (Admin)
 */
const createTheme = async (themeData) => {
  const { name, primary_color, secondary_color, logo, banner } = themeData;
  
  const result = await query(
    `INSERT INTO Themes (name, primary_color, secondary_color, logo, banner, is_active)
     OUTPUT INSERTED.*
     VALUES (@name, @primary_color, @secondary_color, @logo, @banner, 0)`,
    {
      name,
      primary_color: primary_color || '#1890ff',
      secondary_color: secondary_color || '#52c41a',
      logo: logo || null,
      banner: banner || null
    }
  );

  return result[0];
};

/**
 * Cập nhật theme (Admin)
 */
const updateTheme = async (themeId, updateData) => {
  const { name, primary_color, secondary_color, logo, banner } = updateData;

  const result = await query(
    `UPDATE Themes 
     SET name = COALESCE(@name, name),
         primary_color = COALESCE(@primary_color, primary_color),
         secondary_color = COALESCE(@secondary_color, secondary_color),
         logo = COALESCE(@logo, logo),
         banner = COALESCE(@banner, banner)
     OUTPUT INSERTED.*
     WHERE id = @id`,
    {
      id: themeId,
      name: name || null,
      primary_color: primary_color || null,
      secondary_color: secondary_color || null,
      logo: logo || null,
      banner: banner || null
    }
  );

  if (!result[0]) {
    throw new Error('Theme không tồn tại');
  }

  return result[0];
};

/**
 * Xóa theme (Admin)
 */
const deleteTheme = async (themeId) => {
  // Check if theme exists and is not active
  const themeResult = await query(
    'SELECT * FROM Themes WHERE id = @id',
    { id: themeId }
  );

  if (!themeResult[0]) {
    throw new Error('Theme không tồn tại');
  }

  if (themeResult[0].is_active) {
    throw new Error('Không thể xóa theme đang active');
  }

  await query(
    'DELETE FROM Themes WHERE id = @id',
    { id: themeId }
  );

  return true;
};

/**
 * Set theme làm active (Admin)
 */
const setActiveTheme = async (themeId) => {
  // Tắt tất cả themes
  await query(
    'UPDATE Themes SET is_active = 0',
    {}
  );

  // Bật theme được chọn
  const result = await query(
    `UPDATE Themes 
     SET is_active = 1
     OUTPUT INSERTED.*
     WHERE id = @id`,
    { id: themeId }
  );

  if (!result[0]) {
    throw new Error('Theme không tồn tại');
  }

  return result[0];
};

module.exports = {
  getActiveTheme,
  getAllThemes,
  createTheme,
  updateTheme,
  deleteTheme,
  setActiveTheme
};
