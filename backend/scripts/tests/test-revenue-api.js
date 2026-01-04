const axios = require('axios');

async function testRevenue() {
  try {
    // Login first to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      usernameOrEmail: 'admin',
      password: '123456'
    });
    
    const token = loginRes.data.data.accessToken;
    console.log('✅ Logged in successfully\n');

    // Test revenue overview
    const revenueRes = await axios.get('http://localhost:5000/api/revenue/overview', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('📊 REVENUE OVERVIEW:');
    console.log(JSON.stringify(revenueRes.data.data, null, 2));

    // Test monthly revenue
    const monthlyRes = await axios.get('http://localhost:5000/api/revenue/monthly?year=2025', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('\n📅 MONTHLY REVENUE 2025:');
    console.log(JSON.stringify(monthlyRes.data.data, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testRevenue();
