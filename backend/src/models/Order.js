const { sql } = require('../config/database');

class Order {
  /**
   * Create new order from cart
   */
  static async create(userId, orderData) {
    try {
      const {
        shipping_address,
        shipping_phone,
        payment_method,
        voucher_code,
        note
      } = orderData;
      
      const pool = await require('../config/database').getPool();
      const transaction = pool.transaction();
      
      await transaction.begin();
      
      try {
        // Get cart items
        const cart = await pool.request()
          .input('userId', sql.Int, userId)
          .query('SELECT id FROM Carts WHERE user_id = @userId');
        
        if (!cart[0]) {
          throw new Error('Cart not found');
        }
        
        const cartItems = await pool.request()
          .input('cartId', sql.Int, cart[0].id)
          .query(`
            SELECT ci.*, p.price, p.discount_percent, p.name, p.stock_quantity
            FROM CartItems ci
            INNER JOIN Products p ON ci.product_id = p.id
            WHERE ci.cart_id = @cartId AND p.is_active = 1
          `);
        
        if (cartItems.length === 0) {
          throw new Error('Cart is empty');
        }
        
        // Calculate total
        let total = 0;
        for (const item of cartItems) {
          const discountedPrice = item.price * (100 - item.discount_percent) / 100;
          total += discountedPrice * item.quantity;
          
          // Check stock
          if (item.stock_quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${item.name}`);
          }
        }
        
        // Apply voucher if provided
        let discount_amount = 0;
        let voucher_id = null;
        if (voucher_code) {
          const voucher = await pool.request()
            .input('code', sql.NVarChar, voucher_code)
            .query(`
              SELECT * FROM Vouchers 
              WHERE code = @code 
              AND is_active = 1 
              AND valid_from <= GETDATE() 
              AND valid_to >= GETDATE()
              AND usage_count < max_usage
            `);
          
          if (voucher[0]) {
            voucher_id = voucher[0].id;
            discount_amount = total * voucher[0].discount_percent / 100;
            
            if (voucher[0].max_discount_amount && discount_amount > voucher[0].max_discount_amount) {
              discount_amount = voucher[0].max_discount_amount;
            }
            
            // Update voucher usage
            await pool.request()
              .input('voucherId', sql.Int, voucher_id)
              .query('UPDATE Vouchers SET usage_count = usage_count + 1 WHERE id = @voucherId');
          }
        }
        
        const final_total = total - discount_amount;
        
        // Create order
        const order = await pool.request()
          .input('userId', sql.Int, userId)
          .input('total', sql.Decimal(10, 2), total)
          .input('discount', sql.Decimal(10, 2), discount_amount)
          .input('final_total', sql.Decimal(10, 2), final_total)
          .input('shipping_address', sql.NVarChar, shipping_address)
          .input('shipping_phone', sql.NVarChar, shipping_phone)
          .input('payment_method', sql.NVarChar, payment_method)
          .input('voucher_id', sql.Int, voucher_id)
          .input('note', sql.NVarChar, note)
          .input('status', sql.NVarChar, 'PENDING')
          .query(`
            INSERT INTO Orders (user_id, total_amount, discount_amount, final_amount, shipping_address, shipping_phone, payment_method, voucher_id, note, status)
            OUTPUT INSERTED.*
            VALUES (@userId, @total, @discount, @final_total, @shipping_address, @shipping_phone, @payment_method, @voucher_id, @note, @status)
          `);
        
        const orderId = order[0].id;
        
        // Create order items and update stock
        for (const item of cartItems) {
          const discountedPrice = item.price * (100 - item.discount_percent) / 100;
          
          await pool.request()
            .input('orderId', sql.Int, orderId)
            .input('productId', sql.Int, item.product_id)
            .input('quantity', sql.Int, item.quantity)
            .input('price', sql.Decimal(10, 2), discountedPrice)
            .input('subtotal', sql.Decimal(10, 2), discountedPrice * item.quantity)
            .query(`
              INSERT INTO OrderItems (order_id, product_id, quantity, price, subtotal)
              VALUES (@orderId, @productId, @quantity, @price, @subtotal)
            `);
          
          // Update product stock
          await pool.request()
            .input('productId', sql.Int, item.product_id)
            .input('quantity', sql.Int, item.quantity)
            .query('UPDATE Products SET stock_quantity = stock_quantity - @quantity WHERE id = @productId');
        }
        
        // Clear cart
        await pool.request()
          .input('cartId', sql.Int, cart[0].id)
          .query('DELETE FROM CartItems WHERE cart_id = @cartId');
        
        await transaction.commit();
        
        return await this.findById(orderId);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  /**
   * Find order by ID
   */
  static async findById(orderId) {
    try {
      const pool = await require('../config/database').getPool();
      
      const order = await pool.request()
        .input('orderId', sql.Int, orderId)
        .query('SELECT * FROM Orders WHERE id = @orderId');
      
      if (!order[0]) {
        return null;
      }
      
      const items = await pool.request()
        .input('orderId', sql.Int, orderId)
        .query(`
          SELECT oi.*, p.name, p.image_url
          FROM OrderItems oi
          INNER JOIN Products p ON oi.product_id = p.id
          WHERE oi.order_id = @orderId
        `);
      
      return {
        ...order[0],
        items: items
      };
    } catch (error) {
      throw new Error(`Error finding order: ${error.message}`);
    }
  }

  /**
   * Get user orders
   */
  static async getUserOrders(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const pool = await require('../config/database').getPool();
      
      const orders = await pool.request()
        .input('userId', sql.Int, userId)
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset)
        .query(`
          SELECT * FROM Orders 
          WHERE user_id = @userId 
          ORDER BY created_at DESC
          OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
        `);
      
      const countResult = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT COUNT(*) as total FROM Orders WHERE user_id = @userId');
      
      return {
        orders: orders,
        total: countResult[0].total,
        page,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      throw new Error(`Error getting user orders: ${error.message}`);
    }
  }

  /**
   * Update order status (Admin only)
   */
  static async updateStatus(orderId, status) {
    try {
      const pool = await require('../config/database').getPool();
      
      const result = await pool.request()
        .input('orderId', sql.Int, orderId)
        .input('status', sql.NVarChar, status)
        .query(`
          UPDATE Orders 
          SET status = @status, updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @orderId
        `);
      
      return result[0];
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  /**
   * Get all orders (Admin only)
   */
  static async getAll(filters = {}) {
    try {
      const { page = 1, limit = 20, status } = filters;
      const offset = (page - 1) * limit;
      const pool = await require('../config/database').getPool();
      
      let query = 'SELECT o.*, u.username, u.email FROM Orders o INNER JOIN Users u ON o.user_id = u.id WHERE 1=1';
      const request = pool.request()
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset);
      
      if (status) {
        query += ' AND o.status = @status';
        request.input('status', sql.NVarChar, status);
      }
      
      query += ' ORDER BY o.created_at DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      
      const orders = await request.query(query);
      
      let countQuery = 'SELECT COUNT(*) as total FROM Orders WHERE 1=1';
      const countRequest = pool.request();
      
      if (status) {
        countQuery += ' AND status = @status';
        countRequest.input('status', sql.NVarChar, status);
      }
      
      const countResult = await countRequest.query(countQuery);
      
      return {
        orders: orders,
        total: countResult[0].total,
        page,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      throw new Error(`Error getting orders: ${error.message}`);
    }
  }
}

module.exports = Order;
