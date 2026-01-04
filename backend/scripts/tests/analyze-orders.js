const sql = require('mssql');
require('dotenv').config();

async function analyzeOrders() {
  try {
    const pool = await sql.connect({
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: {
        encrypt: true,
        trustServerCertificate: true
      }
    });

    // Check schema
    const schema = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Orders' 
      ORDER BY ORDINAL_POSITION
    `);
    console.log('📋 Orders table columns:');
    console.table(schema.recordset);

    // Total orders and revenue
    const total = await pool.request().query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue
      FROM Orders
    `);
    console.log('\n💰 Total Orders & Revenue:');
    console.table(total.recordset);

    // Group by status
    const byStatus = await pool.request().query(`
      SELECT 
        status,
        payment_method,
        COUNT(*) as count,
        SUM(total_amount) as revenue
      FROM Orders
      GROUP BY status, payment_method
    `);
    console.log('\n📊 Orders by Status:');
    console.table(byStatus.recordset);

    // Recent orders
    const recent = await pool.request().query(`
      SELECT TOP 20
        id, user_id, total_amount, payment_method, status, created_at
      FROM Orders
      ORDER BY created_at DESC
    `);
    console.log('\n🕐 Recent 20 Orders:');
    console.table(recent.recordset);

    await pool.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

analyzeOrders();
