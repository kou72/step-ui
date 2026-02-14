'use strict';

const https   = require('https');
const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const express = require('express');

const app = express();
app.use(express.json());

// 静的ファイル配信 (front/dist/)
app.use(express.static(path.join(__dirname, 'front', 'dist')));

// API ルート (back/api.js)
require('./back/api')(app);

// HTTPS:3000 — UI 用 (証明書があれば)
const CERT_KEY  = path.join(__dirname, 'cert', 'server.key');
const CERT_FILE = path.join(__dirname, 'cert', 'server.crt');

if (fs.existsSync(CERT_KEY) && fs.existsSync(CERT_FILE)) {
  https.createServer({
    key:  fs.readFileSync(CERT_KEY),
    cert: fs.readFileSync(CERT_FILE),
  }, app).listen(3000, () => {
    console.log('HTTPS server listening on https://0.0.0.0:3000');
  });
} else {
  console.warn('証明書なし (cert/) — HTTPS:3000 は起動しません');
}

// HTTP:3001 — 内部/開発用
http.createServer(app).listen(3001, () => {
  console.log('HTTP server listening on http://localhost:3001');
});
