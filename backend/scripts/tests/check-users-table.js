const sql = require('mssql');
require('dotenv').config();

async function checkUsersTable() {
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

    const result = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Users' 
      ORDER BY ORDINAL_POSITION
    `);

    console.log('📋 Users table structure:');
    console.table(result.recordset);

    // Test insert
    console.log('\n🧪 Testing register insert...');
    try {
      const testResult = await pool.request()
        .input('username', sql.VarChar, 'testuser123')
        .input('email', sql.VarChar, 'test@test.com')
        .input('password', sql.VarChar, '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890')
        .input('fullName', sql.NVarChar, 'Test User')
        .input('phone', sql.VarChar, '0123456789')
        .input('address', sql.NVarChar, 'Test Address')
        .query(`
          INSERT INTO Users (username, email, password, full_name, phone, address, role, is_active, created_at)
          OUTPUT INSERTED.*
          VALUES (@username, @email, @password, @fullName, @phone, @address, 'customer', 1, GETDATE())
        `);
      
      console.log('✅ Test insert successful:', testResult.recordset[0]);
      
      // Cleanup
      await pool.request()
        .input('username', sql.VarChar, 'testuser123')
        .query('DELETE FROM Users WHERE username = @username');
      console.log('🧹 Test data cleaned up');
    } catch (insertError) {
      console.error('❌ Insert failed:', insertError.message);
    }

    await pool.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsersTable();
