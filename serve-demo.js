const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Add CORS headers to allow ES modules
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  let filePath = '.' + req.url;
  
  // Default to serving the demo HTML page
  if (filePath === './') {
    filePath = './example/index.html';
  }
  
  // Resolve the file path
  const fullPath = path.resolve(filePath);
  const basePath = path.resolve('.');
  
  // Security check: ensure the file is within our project directory
  if (!fullPath.startsWith(basePath)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'font/eot'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.log(`Requested: ${req.url} -> ${filePath}`);
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`File not found: ${req.url}`);
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Demo server running at http://localhost:${PORT}`);
  console.log('Open your browser and go to http://localhost:3000');
  console.log('\nAvailable files:');
  console.log('- Main demo: http://localhost:3000');
  console.log('- Test module: http://localhost:3000/example/mocks/test-module.js');
  console.log('- Another module: http://localhost:3000/example/mocks/another-module.js');
});