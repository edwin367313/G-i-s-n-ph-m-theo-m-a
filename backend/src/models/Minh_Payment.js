const { sql } = require('../config/database');

class Payment {
  /**
   * Create a new payment
   */
  static async create(data) {
    try {
      const pool = await require('../config/database').getPool();
      
      const result = await pool.request()
        .input('orderId', sql.Int, data.orderId)
        .input('paymentCode', sql.VarChar(50), data.paymentCode)
        .input('paymentMethod', sql.VarChar(50), data.paymentMethod)
        .input('amount', sql.Decimal(18, 2), data.amount)
        .input('status', sql.VarChar(20), data.status || 'pending')
        .input('transactionId', sql.VarChar(100), data.transactionId)
        .query(`
          INSERT INTO Payments (order_id, payment_code, payment_method, amount, status, transaction_id)
          OUTPUT INSERTED.*
          VALUES (@orderId, @paymentCode, @paymentMethod, @amount, @status, @transactionId)
        `);
      
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }
  }

  /**
   * Find payment by payment code
   */
  static async findOne(options) {
    try {
      const pool = await require('../config/database').getPool();
      const { where } = options;
      
      if (!where || !where.paymentCode) {
        throw new Error('Payment code is required');
      }
      
      const result = await pool.request()
        .input('paymentCode', sql.VarChar(50), where.paymentCode)
        .query('SELECT * FROM Payments WHERE payment_code = @paymentCode');
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      return {
        ...result.recordset[0],
        update: async function(updateData) {
          return await Payment.update(this.id, updateData);
        }
      };
    } catch (error) {
      throw new Error(`Error finding payment: ${error.message}`);
    }
  }

  /**
   * Update payment
   */
  static async update(paymentId, data) {
    try {
      const pool = await require('../config/database').getPool();
      
      const request = pool.request().input('id', sql.Int, paymentId);
      let updates = [];
      
      if (data.status !== undefined) {
        request.input('status', sql.VarChar(20), data.status);
        updates.push('status = @status');
      }
      
      if (data.transactionId !== undefined) {
        request.input('transactionId', sql.VarChar(100), data.transactionId);
        updates.push('transaction_id = @transactionId');
      }
      
      if (data.responseData !== undefined) {
        request.input('responseData', sql.NVarChar(sql.MAX), JSON.stringify(data.responseData));
        updates.push('response_data = @responseData');
      }
      
      updates.push('updated_at = GETDATE()');
      
      if (updates.length === 1) {
        return true;
      }
      
      const query = `UPDATE Payments SET ${updates.join(', ')} WHERE id = @id`;
      await request.query(query);
      
      return true;
    } catch (error) {
      throw new Error(`Error updating payment: ${error.message}`);
    }
  }

  /**
   * Find payment by ID
   */
  static async findById(paymentId) {
    try {
      const pool = await require('../config/database').getPool();
      
      const result = await pool.request()
        .input('id', sql.Int, paymentId)
        .query('SELECT * FROM Payments WHERE id = @id');
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error finding payment by ID: ${error.message}`);
    }
  }
}

module.exports = Payment;