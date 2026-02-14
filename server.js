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

// SPA フォールバック — クライアントサイドルーティング用
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'dist', 'index.html'));
});

// HTTPS:3000 — UI 用 (cert/ 内の .crt / .key を自動検出)
const CERT_DIR = path.join(__dirname, 'cert');
const findFile = (dir, ext) => {
  try {
    return fs.readdirSync(dir).find(f => f.endsWith(ext));
  } catch { return null; }
};
const keyName  = findFile(CERT_DIR, '.key');
const crtName  = findFile(CERT_DIR, '.crt');

if (keyName && crtName) {
  https.createServer({
    key:  fs.readFileSync(path.join(CERT_DIR, keyName)),
    cert: fs.readFileSync(path.join(CERT_DIR, crtName)),
  }, app).listen(3000, () => {
    console.log(`HTTPS server listening on https://0.0.0.0:3000 (${crtName} / ${keyName})`);
  });
} else {
  console.warn('証明書なし (cert/*.crt, cert/*.key) — HTTPS:3000 は起動しません');
}

// HTTP:3001 — 内部/開発用
http.createServer(app).listen(3001, () => {
  console.log('HTTP server listening on http://localhost:3001');
});
