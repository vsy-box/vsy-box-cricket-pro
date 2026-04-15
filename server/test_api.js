const jwt = require('jsonwebtoken');
const http = require('http');

const token = jwt.sign({ id: 'any_id', role: 'admin' }, 'vsy_box_cricket_pro_jwt_secret_2024_change_in_production', { expiresIn: '1h' });

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/admin/stats',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});

req.on('error', console.error);
req.end();
