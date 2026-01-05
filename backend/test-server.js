const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'OK', message: 'Test server works!' }));
});

server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Test server listening on port 5000');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});
