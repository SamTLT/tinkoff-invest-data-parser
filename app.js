require('dotenv').config();
const data = require('./scripts/data');
const http = require('http');

const PORT = process.env.PORT || 5000;
const USER_TOKEN = process.env.USER_TOKEN;

const server = http.createServer(async (req, res) => {
  if (req.url === '/stocks' && req.method === 'GET') {
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf('Bearer ' + USER_TOKEN) === -1
    ) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.write('Missing Authorization Header');
      res.end();
    } else {
      data.getData().then(data => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(data));
        res.end();
      }).catch((err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(err));
        res.end();
      });

    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
