# step-ui

step-ca の Web UI

## セットアップ

```bash
npm install
cd front && npm install && npm run build && cd ..
```

`cert/` ディレクトリに HTTPS 用の `.crt` と `.key` を配置する（ファイル名は任意）。

## 起動

```bash
nohup node server.js > step-ui.log 2>&1 &
```

- HTTPS: `https://0.0.0.0:3000`
- HTTP: `http://localhost:3001`

## 停止

```bash
pkill -f "node server.js"
```

## ログ確認

```bash
tail -f step-ui.log
```
