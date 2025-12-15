const { sql } = require('../config/database');

class Product {
  /**
   * Find product by ID
   */
  static async findById(productId) {
    try {
      const pool = await require('../config/database').getPool();
      const result = await pool.request()
        .input('productId', sql.Int, productId)
        .query(`
          SELECT p.*, c.name as category_name
          FROM Products p
          LEFT JOIN Categories c ON p.category_id = c.id
          WHERE p.id = @productId AND p.is_active = 1
        `);
      
      return result[0] || null;
    } catch (error) {
      throw new Error(`Error finding product: ${error.message}`);
    }
  }

  /**
   * Get all products with pagination and filters
   */
  static async getAll(filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category_id,
        search,
        min_price,
        max_price,
        sort_by = 'created_at',
        order = 'DESC'
      } = filters;
      
      const offset = (page - 1) * limit;
      const pool = await require('../config/database').getPool();
      
      let query = `
        SELECT p.*, c.name as category_name
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        WHERE p.is_active = 1
      `;
      
      const request = pool.request()
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset);
      
      if (category_id) {
        query += ' AND p.category_id = @category_id';
        request.input('category_id', sql.Int, category_id);
      }
      
      if (search) {
        query += ' AND (p.name LIKE @search OR p.description LIKE @search)';
        request.input('search', sql.NVarChar, `%${search}%`);
      }
      
      if (min_price) {
        query += ' AND p.price >= @min_price';
        request.input('min_price', sql.Decimal(10, 2), min_price);
      }
      
      if (max_price) {
        query += ' AND p.price <= @max_price';
        request.input('max_price', sql.Decimal(10, 2), max_price);
      }
      
      query += ` ORDER BY p.${sort_by} ${order}`;
      query += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      
      const result = await request.query(query);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM Products p WHERE p.is_active = 1';
      const countRequest = pool.request();
      
      if (category_id) {
        countQuery += ' AND p.category_id = @category_id';
        countRequest.input('category_id', sql.Int, category_id);
      }
      
      if (search) {
        countQuery += ' AND (p.name LIKE @search OR p.description LIKE @search)';
        countRequest.input('search', sql.NVarChar, `%${search}%`);
      }
      
      const countResult = await countRequest.query(countQuery);
      
      return {
        products: result,
        total: countResult[0].total,
        page,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  /**
   * Create new product (Admin only)
   */
  static async create(productData) {
    try {
      const {
        name,
        description,
        price,
        discount_percent = 0,
        stock_quantity,
        category_id,
        image_url,
        unit
      } = productData;
      
      const pool = await require('../config/database').getPool();
      const result = await pool.request()
        .input('name', sql.NVarChar, name)
        .input('description', sql.NVarChar, description)
        .input('price', sql.Decimal(10, 2), price)
        .input('discount_percent', sql.Int, discount_percent)
        .input('stock_quantity', sql.Int, stock_quantity)
        .input('category_id', sql.Int, category_id)
        .input('image_url', sql.NVarChar, image_url)
        .input('unit', sql.NVarChar, unit)
        .query(`
          INSERT INTO Products (name, description, price, discount_percent, stock_quantity, category_id, image_url, unit, is_active)
          OUTPUT INSERTED.*
          VALUES (@name, @description, @price, @discount_percent, @stock_quantity, @category_id, @image_url, @unit, 1)
        `);
      
      return result[0];
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  /**
   * Update product (Admin only)
   */
  static async update(productId, updateData) {
    try {
      const {
        name,
        description,
        price,
        discount_percent,
        stock_quantity,
        category_id,
        image_url,
        unit
      } = updateData;
      
      const pool = await require('../config/database').getPool();
      const result = await pool.request()
        .input('productId', sql.Int, productId)
        .input('name', sql.NVarChar, name)
        .input('description', sql.NVarChar, description)
        .input('price', sql.Decimal(10, 2), price)
        .input('discount_percent', sql.Int, discount_percent)
        .input('stock_quantity', sql.Int, stock_quantity)
        .input('category_id', sql.Int, category_id)
        .input('image_url', sql.NVarChar, image_url)
        .input('unit', sql.NVarChar, unit)
        .query(`
          UPDATE Products
          SET name = COALESCE(@name, name),
              description = COALESCE(@description, description),
              price = COALESCE(@price, price),
              discount_percent = COALESCE(@discount_percent, discount_percent),
              stock_quantity = COALESCE(@stock_quantity, stock_quantity),
              category_id = COALESCE(@category_id, category_id),
              image_url = COALESCE(@image_url, image_url),
              unit = COALESCE(@unit, unit),
              updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @productId
        `);
      
      return result[0];
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  /**
   * Delete product (soft delete - Admin only)
   */
  static async delete(productId) {
    try {
      const pool = await require('../config/database').getPool();
      await pool.request()
        .input('productId', sql.Int, productId)
        .query('UPDATE Products SET is_active = 0, updated_at = GETDATE() WHERE id = @productId');
      
      return true;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  /**
   * Update stock quantity
   */
  static async updateStock(productId, quantity) {
    try {
      const pool = await require('../config/database').getPool();
      const result = await pool.request()
        .input('productId', sql.Int, productId)
        .input('quantity', sql.Int, quantity)
        .query(`
          UPDATE Products
          SET stock_quantity = stock_quantity + @quantity,
              updated_at = GETDATE()
          OUTPUT INSERTED.id, INSERTED.name, INSERTED.stock_quantity
          WHERE id = @productId
        `);
      
      return result[0];
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }
}

module.exports = Product;
