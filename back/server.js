'use strict';

const https   = require('https');
const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const express = require('express');

const app = express();

const CA_URL      = 'https://192.168.11.143';
const CA_HOSTNAME = '192.168.11.143';
const CA_PORT     = 443;
const ROOT_CA     = fs.readFileSync('/home/mgmt/.step/certs/root_ca.crt');

app.use(express.static(path.join(__dirname, '..', 'front', 'dist')));

app.get('/api/status', (_req, res) => {
  const opts = {
    hostname: CA_HOSTNAME,
    port:     CA_PORT,
    path:     '/health',
    method:   'GET',
    ca:       ROOT_CA,
  };
  const probe = https.request(opts, (r) => {
    let body = '';
    r.on('data', (c) => { body += c; });
    r.on('end', () => {
      try {
        res.json({ ca_url: CA_URL, http_status: r.statusCode, ...JSON.parse(body) });
      } catch (e) {
        res.status(500).json({ status: 'error', message: 'Invalid response from CA' });
      }
    });
  });
  probe.on('error', (e) => res.status(500).json({ status: 'error', message: e.message }));
  probe.end();
});

const PORT = 3001;

http.createServer(app).listen(PORT, () => {
  console.log(`HTTP server listening on http://localhost:${PORT}`);
});
