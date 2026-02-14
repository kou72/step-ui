'use strict';

const https   = require('https');
const fs      = require('fs');
const path    = require('path');
const { spawn } = require('child_process');

const CA_URL       = 'https://192.168.11.143';
const CA_HOSTNAME  = '192.168.11.143';
const CA_PORT      = 443;
const ROOT_CA_PATH = '/home/mgmt/.step/certs/root_ca.crt';
const INT_CA_PATH  = '/home/mgmt/.step/certs/intermediate_ca.crt';
const CA_CONFIG    = '/home/mgmt/.step/config/ca.json';
const CA_PASS_FILE = '/home/mgmt/.step/secrets/ca-password';
const CA_LOG_FILE  = path.join(__dirname, 'step-ca.log');
const DATA_DIR     = path.join(__dirname, '..', 'data');
const CERTS_DIR    = path.join(DATA_DIR, 'certs');
const CERTS_JSON   = path.join(DATA_DIR, 'certs.json');

// CA init 後に証明書が差し替わるため、毎回ディスクから読む
const readRootCA = () => {
  try { return fs.readFileSync(ROOT_CA_PATH); } catch { return undefined; }
};

module.exports = function (app) {
  app.get('/api/status', (_req, res) => {
    const opts = {
      hostname: CA_HOSTNAME,
      port:     CA_PORT,
      path:     '/health',
      method:   'GET',
      ca:       readRootCA(),
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

  app.get('/api/ca/logs', (_req, res) => {
    try {
      const content = fs.readFileSync(CA_LOG_FILE, 'utf8');
      const lines = content.split('\n').filter(Boolean);
      res.json({ lines: lines.slice(-300) });
    } catch {
      res.json({ lines: [] });
    }
  });

  app.get('/api/ca/config', (_req, res) => {
    try {
      const cfg = JSON.parse(fs.readFileSync(CA_CONFIG, 'utf8'));
      const { X509Certificate } = require('crypto');
      const fmtDate = (pem) => {
        try {
          const cert = new X509Certificate(fs.readFileSync(pem, 'utf8'));
          const cn = cert.subject.split('\n').find(l => l.startsWith('CN='))?.replace('CN=', '') || null;
          const expiry = new Date(cert.validTo).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
          return { cn, expiry };
        } catch { return { cn: null, expiry: null }; }
      };
      const root = fmtDate(cfg.root);
      const intm = fmtDate(cfg.crt);
      res.json({
        caName:       root.cn,
        dnsNames:     (cfg.dnsNames || []).join(', '),
        address:      cfg.address,
        provisioners: (cfg.authority?.provisioners || []).map(p => `${p.name} (${p.type})`).join(', '),
        rootExpiry:   root.expiry,
        intExpiry:    intm.expiry,
      });
    } catch (e) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

  app.post('/api/ca/start', (_req, res) => {
    const probe = https.request(
      { hostname: CA_HOSTNAME, port: CA_PORT, path: '/health', method: 'GET', ca: readRootCA() },
      () => res.status(409).json({ status: 'already_running' })
    );
    probe.on('error', () => {
      // 既存プロセスが DB ロックを保持している場合に備えて先に kill
      const killer = spawn('sudo', ['/usr/bin/pkill', '-x', 'step-ca'], { stdio: 'ignore' });
      killer.on('close', () => setTimeout(startProc, 300));
      killer.on('error', () => setTimeout(startProc, 300));
      function startProc() {
        const logStream = fs.createWriteStream(CA_LOG_FILE, { flags: 'w' });
        const proc = spawn('sudo', ['/usr/bin/step-ca', '--password-file', CA_PASS_FILE, CA_CONFIG], {
          detached: true,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        let stderr = '';
        proc.stdout.on('data', (d) => { logStream.write(d); });
        proc.stderr.on('data', (d) => { logStream.write(d); stderr += d; });
        proc.on('close', () => logStream.end());
        const timer = setTimeout(() => {
          if (!res.headersSent) { proc.unref(); res.json({ status: 'starting' }); }
        }, 500);
        proc.on('error', (e) => {
          clearTimeout(timer);
          if (!res.headersSent) res.status(500).json({ status: 'error', message: e.message });
        });
        proc.on('exit', (code) => {
          if (code !== null && code !== 0 && !res.headersSent) {
            clearTimeout(timer);
            res.status(500).json({ status: 'error', message: stderr.trim() || `exited with code ${code}` });
          }
        });
      }
    });
    probe.end();
  });

  app.post('/api/ca/init', (req, res) => {
    const { name, dns, address, provisioner, password } = req.body || {};
    if (!name || !dns || !address || !provisioner || !password) {
      return res.status(400).json({ status: 'error', message: 'すべてのフィールドを入力してください' });
    }
    const tmpFile = `/tmp/ca-init-pass-${Date.now()}`;
    try {
      fs.writeFileSync(tmpFile, password, { mode: 0o600 });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
    // step ca init がファイル競合しないよう既存 CA ディレクトリを削除
    const stepHome = '/home/mgmt/.step';
    for (const dir of ['config', 'certs', 'secrets', 'db']) {
      try { fs.rmSync(`${stepHome}/${dir}`, { recursive: true, force: true }); } catch {}
    }
    const dnsArgs = dns.split(',').map(d => d.trim()).filter(Boolean).flatMap(d => ['--dns', d]);
    const args = [
      'ca', 'init',
      '--name',                     name,
      ...dnsArgs,
      '--address',                  address,
      '--provisioner',              provisioner,
      '--password-file',            tmpFile,
      '--provisioner-password-file', tmpFile,
    ];
    const proc = spawn('/usr/bin/step', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, HOME: '/home/mgmt' },
    });
    let stdout = '', stderr = '';
    proc.stdout.on('data', (d) => { stdout += d; });
    proc.stderr.on('data', (d) => { stderr += d; });
    const cleanup = () => { try { fs.unlinkSync(tmpFile); } catch {} };
    proc.on('error', (e) => { cleanup(); res.status(500).json({ status: 'error', message: e.message }); });
    proc.on('close', (code) => {
      cleanup();
      if (code !== 0) {
        return res.status(500).json({ status: 'error', message: (stderr || stdout).trim() || `exited with code ${code}` });
      }
      try { fs.writeFileSync(CA_PASS_FILE, password, { mode: 0o600 }); } catch {}
      // プロビジョナーの最大証明書期間を引き上げ (デフォルト24h → 最大1年)
      try {
        const cfg = JSON.parse(fs.readFileSync(CA_CONFIG, 'utf8'));
        if (cfg.authority?.provisioners) {
          for (const p of cfg.authority.provisioners) {
            p.claims = {
              ...p.claims,
              maxTLSCertDuration: '8760h',
              defaultTLSCertDuration: '24h',
            };
          }
          fs.writeFileSync(CA_CONFIG, JSON.stringify(cfg, null, 4));
        }
      } catch {}
      res.json({ status: 'ok' });
    });
  });

  app.post('/api/ca/stop', (_req, res) => {
    const proc = spawn('sudo', ['/usr/bin/pkill', '-x', 'step-ca'], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('error', (e) => res.status(500).json({ status: 'error', message: e.message }));
    proc.on('close', (code) => {
      if (code === 0)    return res.json({ status: 'stopped' });
      if (code === 1)    return res.status(404).json({ status: 'not_running' });
      res.status(500).json({ status: 'error', message: stderr.trim() || `exited with code ${code}` });
    });
  });

  // ---------- 証明書 ----------

  const readCerts = () => {
    try { return JSON.parse(fs.readFileSync(CERTS_JSON, 'utf8')); } catch { return []; }
  };
  const writeCerts = (list) => {
    fs.mkdirSync(CERTS_DIR, { recursive: true });
    fs.writeFileSync(CERTS_JSON, JSON.stringify(list, null, 2));
  };

  app.get('/api/cert/list', (_req, res) => {
    res.json({ certs: readCerts() });
  });

  app.post('/api/cert/issue', (req, res) => {
    const { subject, sans, duration } = req.body || {};
    if (!subject || !sans) {
      return res.status(400).json({ status: 'error', message: 'サブジェクトと SAN を入力してください' });
    }
    const days = parseInt(duration, 10) || 1;
    const dur = `${days * 24}h`;

    // provisioner 名とパスワードファイルを取得
    let provName;
    try {
      const cfg = JSON.parse(fs.readFileSync(CA_CONFIG, 'utf8'));
      provName = cfg.authority?.provisioners?.[0]?.name;
    } catch {}
    if (!provName) {
      return res.status(500).json({ status: 'error', message: 'provisioner が見つかりません' });
    }

    const outDir = path.join(CERTS_DIR, subject);
    fs.mkdirSync(outDir, { recursive: true });
    const crtFile = path.join(outDir, `${subject}.crt`);
    const keyFile = path.join(outDir, `${subject}.key`);

    const sanArgs = sans.split(',').map(s => s.trim()).filter(Boolean).flatMap(s => ['--san', s]);
    const args = [
      'ca', 'certificate',
      subject, crtFile, keyFile,
      '--provisioner', provName,
      '--provisioner-password-file', CA_PASS_FILE,
      ...sanArgs,
      '--not-after', dur,
      '--force',
    ];

    const proc = spawn('/usr/bin/step', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, HOME: '/home/mgmt' },
    });
    let stdout = '', stderr = '';
    proc.stdout.on('data', (d) => { stdout += d; });
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('error', (e) => res.status(500).json({ status: 'error', message: e.message }));
    proc.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ status: 'error', message: (stderr || stdout).trim() || `exited with code ${code}` });
      }
      // 証明書情報を読み取ってメタデータに記録
      try {
        const { X509Certificate } = require('crypto');
        const pem = fs.readFileSync(crtFile, 'utf8');
        const x509 = new X509Certificate(pem);
        const issuerCN = x509.issuer.split('\n').find(l => l.startsWith('CN='))?.replace('CN=', '') || null;
        let issuerSerial = null;
        try {
          const issuerPem = fs.readFileSync(path.join('/home/mgmt/.step/certs', 'intermediate_ca.crt'), 'utf8');
          const issuerX509 = new X509Certificate(issuerPem);
          issuerSerial = issuerX509.serialNumber;
        } catch {}
        const entry = {
          id:        String(Date.now()),
          subject,
          sans,
          notBefore: new Date(x509.validFrom).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          notAfter:  new Date(x509.validTo).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          serial:    x509.serialNumber,
          issuerCN,
          issuerSerial,
          certPath:  path.relative(path.join(DATA_DIR, '..'), crtFile),
          keyPath:   path.relative(path.join(DATA_DIR, '..'), keyFile),
          issuedAt:  new Date().toISOString(),
        };
        const list = readCerts();
        list.push(entry);
        writeCerts(list);
        res.json({ status: 'ok', cert: entry });
      } catch (e) {
        res.status(500).json({ status: 'error', message: e.message });
      }
    });
  });

  app.get('/api/cert/download/:id/:type', (req, res) => {
    const { id, type } = req.params;
    if (type !== 'crt' && type !== 'key') {
      return res.status(400).json({ status: 'error', message: 'type は crt または key を指定してください' });
    }
    const list = readCerts();
    const entry = list.find(c => c.id === id);
    if (!entry) {
      return res.status(404).json({ status: 'error', message: '証明書が見つかりません' });
    }
    const filePath = path.join(__dirname, '..', type === 'crt' ? entry.certPath : entry.keyPath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ status: 'error', message: 'ファイルが見つかりません' });
    }
    const fileName = path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  });

  app.delete('/api/cert/:id', (req, res) => {
    const { id } = req.params;
    const list = readCerts();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ status: 'error', message: '証明書が見つかりません' });
    }
    const entry = list[idx];
    // ファイルとディレクトリを削除
    const subjectDir = path.join(CERTS_DIR, entry.subject);
    try { fs.rmSync(subjectDir, { recursive: true, force: true }); } catch {}
    list.splice(idx, 1);
    writeCerts(list);
    res.json({ status: 'ok' });
  });

  // ---------- CA証明書 ----------

  const inspectCert = (certPath) => {
    try {
      const { X509Certificate } = require('crypto');
      const pem = fs.readFileSync(certPath, 'utf8');
      const x509 = new X509Certificate(pem);
      const cn = x509.subject.split('\n').find(l => l.startsWith('CN='))?.replace('CN=', '') || null;
      return {
        subject:  cn,
        serial:   x509.serialNumber,
        notAfter: new Date(x509.validTo).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      };
    } catch { return null; }
  };

  app.get('/api/cert/ca', (_req, res) => {
    const root = inspectCert(ROOT_CA_PATH);
    const intermediate = inspectCert(INT_CA_PATH);
    if (!root && !intermediate) {
      return res.status(404).json({ status: 'error', message: 'CA証明書が見つかりません' });
    }
    res.json({ root, intermediate });
  });

  app.get('/api/cert/root/download', (_req, res) => {
    if (!fs.existsSync(ROOT_CA_PATH)) {
      return res.status(404).json({ status: 'error', message: 'ルート証明書が見つかりません' });
    }
    res.setHeader('Content-Disposition', 'attachment; filename="root_ca.crt"');
    res.setHeader('Content-Type', 'application/x-pem-file');
    fs.createReadStream(ROOT_CA_PATH).pipe(res);
  });

  app.get('/api/cert/intermediate/download', (_req, res) => {
    if (!fs.existsSync(INT_CA_PATH)) {
      return res.status(404).json({ status: 'error', message: '中間証明書が見つかりません' });
    }
    res.setHeader('Content-Disposition', 'attachment; filename="intermediate_ca.crt"');
    res.setHeader('Content-Type', 'application/x-pem-file');
    fs.createReadStream(INT_CA_PATH).pipe(res);
  });
};
