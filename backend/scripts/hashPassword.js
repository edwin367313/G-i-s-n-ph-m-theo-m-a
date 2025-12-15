const bcrypt = require('bcrypt');

const password = '123456';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Password: 123456');
  console.log('Hashed:', hash);
  console.log('\nSQL Update:');
  console.log(`UPDATE Users SET password = '${hash}' WHERE role IN ('admin', 'customer', 'manager');`);
});
