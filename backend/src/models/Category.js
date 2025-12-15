const { query } = require('../config/database');

class Category {
  /**
   * Get all categories
   */
  static async findAll() {
    try {
      const result = await query('SELECT id, name, description, icon FROM Categories ORDER BY name ASC');
      return result;
    } catch (error) {
      throw new Error(`Error getting categories: ${error.message}`);
    }
  }

  /**
   * Find category by ID
   */
  static async findById(categoryId) {
    try {
      const result = await query(
        'SELECT id, name, description, icon FROM Categories WHERE id = @categoryId',
        { categoryId }
      );
      return result[0] || null;
    } catch (error) {
      throw new Error(`Error finding category: ${error.message}`);
    }
  }

  /**
   * Create new category
   */
  static async create(categoryData) {
    try {
      const { name, description, icon } = categoryData;
      const result = await query(
        `INSERT INTO Categories (name, description, icon) 
         OUTPUT INSERTED.id, INSERTED.name, INSERTED.description, INSERTED.icon
         VALUES (@name, @description, @icon)`,
        { name, description, icon }
      );
      return result[0];
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  /**
   * Update category
   */
  static async update(categoryId, categoryData) {
    try {
      const { name, description, icon } = categoryData;
      const result = await query(
        `UPDATE Categories 
         SET name = COALESCE(@name, name),
             description = COALESCE(@description, description),
             icon = COALESCE(@icon, icon)
         OUTPUT INSERTED.id, INSERTED.name, INSERTED.description, INSERTED.icon
         WHERE id = @categoryId`,
        { categoryId, name, description, icon }
      );
      return result[0];
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  /**
   * Delete category
   */
  static async delete(categoryId) {
    try {
      await query('DELETE FROM Categories WHERE id = @categoryId', { categoryId });
      return true;
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }
}

module.exports = Category;
