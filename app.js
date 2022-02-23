require('dotenv').config();
const http = require('http');
const getData = require('./scripts/data');

const PORT = process.env.PORT || 5000;
const { USER_TOKEN } = process.env;

const server = http.createServer(async (req, res) => {
  if (req.url === '/stocks' && req.method === 'GET') {
    if (
      !req.headers.authorization ||
      req.headers.authorization.indexOf(`Bearer ${USER_TOKEN}`) === -1
    ) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.write('Missing Authorization Header');
      res.end();
    } else {
      getData
        .getData()
        .then((result) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(result));
          res.end();
        })
        .catch((err) => {
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
  // eslint-disable-next-line no-console
  console.log(`server started on port: ${PORT}`);
});
