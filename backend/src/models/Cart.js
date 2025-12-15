const { sql } = require('../config/database');

class Cart {
  /**
   * Get user's cart with items
   */
  static async getByUserId(userId) {
    try {
      const pool = await require('../config/database').getPool();
      
      // Get or create cart
      let cart = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM Carts WHERE user_id = @userId');
      
      if (!cart[0]) {
        // Create new cart
        const newCart = await pool.request()
          .input('userId', sql.Int, userId)
          .query('INSERT INTO Carts (user_id) OUTPUT INSERTED.* VALUES (@userId)');
        cart = newCart;
      }
      
      const cartId = cart[0].id;
      
      // Get cart items with product details
      const items = await pool.request()
        .input('cartId', sql.Int, cartId)
        .query(`
          SELECT ci.*, p.name, p.price, p.discount_percent, p.image_url, p.stock_quantity,
                 (p.price * (100 - p.discount_percent) / 100) as discounted_price,
                 (ci.quantity * p.price * (100 - p.discount_percent) / 100) as subtotal
          FROM CartItems ci
          INNER JOIN Products p ON ci.product_id = p.id
          WHERE ci.cart_id = @cartId AND p.is_active = 1
        `);
      
      // Calculate total
      const total = items.reduce((sum, item) => sum + item.subtotal, 0);
      
      return {
        cart: cart[0],
        items: items,
        total,
        itemCount: items.length
      };
    } catch (error) {
      throw new Error(`Error getting cart: ${error.message}`);
    }
  }

  /**
   * Add item to cart
   */
  static async addItem(userId, productId, quantity = 1) {
    try {
      const pool = await require('../config/database').getPool();
      
      // Get or create cart
      let cart = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT id FROM Carts WHERE user_id = @userId');
      
      let cartId;
      if (!cart[0]) {
        const newCart = await pool.request()
          .input('userId', sql.Int, userId)
          .query('INSERT INTO Carts (user_id) OUTPUT INSERTED.id VALUES (@userId)');
        cartId = newCart[0].id;
      } else {
        cartId = cart[0].id;
      }
      
      // Check if item already exists
      const existingItem = await pool.request()
        .input('cartId', sql.Int, cartId)
        .input('productId', sql.Int, productId)
        .query('SELECT * FROM CartItems WHERE cart_id = @cartId AND product_id = @productId');
      
      if (existingItem[0]) {
        // Update quantity
        await pool.request()
          .input('cartId', sql.Int, cartId)
          .input('productId', sql.Int, productId)
          .input('quantity', sql.Int, quantity)
          .query(`
            UPDATE CartItems 
            SET quantity = quantity + @quantity, updated_at = GETDATE()
            WHERE cart_id = @cartId AND product_id = @productId
          `);
      } else {
        // Add new item
        await pool.request()
          .input('cartId', sql.Int, cartId)
          .input('productId', sql.Int, productId)
          .input('quantity', sql.Int, quantity)
          .query('INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (@cartId, @productId, @quantity)');
      }
      
      // Update cart updated_at
      await pool.request()
        .input('cartId', sql.Int, cartId)
        .query('UPDATE Carts SET updated_at = GETDATE() WHERE id = @cartId');
      
      return await this.getByUserId(userId);
    } catch (error) {
      throw new Error(`Error adding item to cart: ${error.message}`);
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateItemQuantity(userId, productId, quantity) {
    try {
      const pool = await require('../config/database').getPool();
      
      const cart = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT id FROM Carts WHERE user_id = @userId');
      
      if (!cart[0]) {
        throw new Error('Cart not found');
      }
      
      const cartId = cart[0].id;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await pool.request()
          .input('cartId', sql.Int, cartId)
          .input('productId', sql.Int, productId)
          .query('DELETE FROM CartItems WHERE cart_id = @cartId AND product_id = @productId');
      } else {
        // Update quantity
        await pool.request()
          .input('cartId', sql.Int, cartId)
          .input('productId', sql.Int, productId)
          .input('quantity', sql.Int, quantity)
          .query(`
            UPDATE CartItems 
            SET quantity = @quantity, updated_at = GETDATE()
            WHERE cart_id = @cartId AND product_id = @productId
          `);
      }
      
      return await this.getByUserId(userId);
    } catch (error) {
      throw new Error(`Error updating cart item: ${error.message}`);
    }
  }

  /**
   * Remove item from cart
   */
  static async removeItem(userId, productId) {
    try {
      const pool = await require('../config/database').getPool();
      
      const cart = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT id FROM Carts WHERE user_id = @userId');
      
      if (!cart[0]) {
        throw new Error('Cart not found');
      }
      
      await pool.request()
        .input('cartId', sql.Int, cart[0].id)
        .input('productId', sql.Int, productId)
        .query('DELETE FROM CartItems WHERE cart_id = @cartId AND product_id = @productId');
      
      return await this.getByUserId(userId);
    } catch (error) {
      throw new Error(`Error removing item from cart: ${error.message}`);
    }
  }

  /**
   * Clear cart
   */
  static async clear(userId) {
    try {
      const pool = await require('../config/database').getPool();
      
      const cart = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT id FROM Carts WHERE user_id = @userId');
      
      if (cart[0]) {
        await pool.request()
          .input('cartId', sql.Int, cart[0].id)
          .query('DELETE FROM CartItems WHERE cart_id = @cartId');
      }
      
      return { message: 'Cart cleared successfully' };
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }
}

module.exports = Cart;
