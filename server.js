require('dotenv').config();
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const webhookUrl = process.env.N8N_WEBHOOK_KEY;
if (!webhookUrl) {
  console.error('N8N_WEBHOOK_KEY is not set in .env');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const indexPath = path.join(__dirname, 'index.html');

http
  .createServer((req, res) => {
    if (req.method !== 'GET' || (req.url !== '/' && req.url !== '/index.html')) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const html = fs
      .readFileSync(indexPath, 'utf8')
      .replace("'__N8N_WEBHOOK_URL__'", () => JSON.stringify(webhookUrl));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  })
  .listen(PORT, () => console.log(`Serving on http://localhost:${PORT}`));
