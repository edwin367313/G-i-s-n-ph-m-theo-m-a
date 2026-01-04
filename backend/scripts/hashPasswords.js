const bcrypt = require('bcryptjs');
const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function hashAllPasswords() {
  try {
    console.log('🔐 Connecting to database...');
    const pool = await sql.connect(config);
    
    // Get all users with plain passwords
    const result = await pool.request().query('SELECT id, username, password FROM Users');
    const users = result.recordset;
    
    console.log(`📊 Found ${users.length} users`);
    
    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        console.log(`  ⏭️  ${user.username} - already hashed`);
        continue;
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Update in database
      await pool.request()
        .input('id', sql.Int, user.id)
        .input('password', sql.VarChar(255), hashedPassword)
        .query('UPDATE Users SET password = @password WHERE id = @id');
      
      console.log(`  ✅ ${user.username} - password hashed`);
    }
    
    console.log('\n✅ All passwords have been hashed successfully!');
    console.log('\n📝 You can now login with:');
    console.log('   Username: admin');
    console.log('   Password: 123456\n');
    
    await pool.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

hashAllPasswords();
