# step-ui

step-ca の管理 Web UI。
React + Tailwind CSS v4 (Vite) のフロントエンドと Express の API サーバーで構成。

## ディレクトリ構成

```
step-ui/
├── server.js         # エントリーポイント (HTTPS:3000 + HTTP:3001)
├── cert/             # UI サーバー用 TLS 証明書 (git 管理外)
│   ├── server.crt
│   └── server.key
├── back/             # API ロジック
│   └── api.js        # Express ルート定義 (/api/*)
└── front/            # Vite + React + Tailwind CSS v4
    ├── src/
    │   ├── App.jsx
    │   ├── strings.js
    │   ├── theme/
    │   └── components/
    │       ├── neu/       # ニューモーフィズム実装
    │       └── material/  # マテリアルデザイン実装
    ├── dist/          # ビルド成果物 (npm run build)
    └── vite.config.js
```

## セットアップ

### 1. sudoers 設定（初回のみ・要 root）

バックエンドが `mgmt` ユーザーとして step-ca を起動/停止できるよう権限を付与する。

#### 1-a. パスワードファイルを作成

```bash
mkdir -p /home/mgmt/.step/secrets
echo -n 'CAのパスワード' > /home/mgmt/.step/secrets/ca-password
chmod 600 /home/mgmt/.step/secrets/ca-password
```

#### 1-b. sudoers ルールを追加

```bash
cat << 'EOF' | sudo tee /etc/sudoers.d/step-ca
mgmt ALL=(ALL) NOPASSWD: /usr/bin/step-ca --password-file /home/mgmt/.step/secrets/ca-password /home/mgmt/.step/config/ca.json
mgmt ALL=(ALL) NOPASSWD: /usr/bin/pkill -x step-ca
EOF
sudo chmod 440 /etc/sudoers.d/step-ca
```

### 2. 依存関係のインストール

```bash
cd ~/step-ui
npm install            # Express (ルート)
cd front && npm install  # React + Vite
```

### 3. フロントエンドのビルド

```bash
cd ~/step-ui/front
npm run build     # dist/ を生成
```

### 4. UI サーバー用証明書の生成

step-ca が起動中に実行する。有効期限は 24 時間。

```bash
step ca certificate "192.168.11.143" \
  cert/server.crt cert/server.key \
  --not-after=24h
```

詳細は [cert/README.md](cert/README.md) を参照。

### 5. サーバーの起動

```bash
cd ~/step-ui
npm start
# → HTTPS server listening on https://0.0.0.0:3000
# → HTTP server listening on http://localhost:3001
```

ブラウザで `https://192.168.11.143:3000` を開く。

証明書がない場合は HTTPS:3000 は起動せず、HTTP:3001 のみで動作する。

## 開発

```bash
npm run dev
# → Express (HTTP:3001) + Vite dev server (HTTP:5173) が同時起動
```

ブラウザで `http://192.168.11.143:5173` を開く。
Vite が `/api/*` を `http://localhost:3001` にプロキシするため、API も動作する。
HMR によりソース変更が即座に反映される。

## 機能

| 機能 | 説明 |
|------|------|
| ステータス確認 | step-ca の `/health` を叩いて OK / ERROR を表示 |
| CA 起動/停止 | ステータスに応じてトグル動作 |
| CA 初期化 | モーダルから `step ca init` を実行。現在の設定値がプリフィル |
| ログ表示 | step-ca のログをリアルタイム表示。自動更新のオン/オフ、折り畳み対応 |
| テーマ切替 | サイドバーで Neumorphism / Material を切替 |
| ダークモード | サイドバーで ON/OFF |

## API

| エンドポイント | メソッド | 説明 |
|---|---|---|
| `/api/status` | GET | step-ca のヘルスチェック結果を返す |
| `/api/ca/config` | GET | CA の設定情報 (名前, DNS, 証明書期限等) を返す |
| `/api/ca/logs` | GET | step-ca のログ (最新 300 行) を返す |
| `/api/ca/start` | POST | step-ca を起動する。起動済みなら `409 already_running` |
| `/api/ca/stop` | POST | step-ca を停止する。未起動なら `404 not_running` |
| `/api/ca/init` | POST | step-ca を初期化する |

## リリース

```bash
npm install
cd front && npm install && npm run build && cd ..
```

`cert/` ディレクトリに HTTPS 用の `.crt` と `.key` を配置する（ファイル名は任意）。

SSH 切断後もプロセスを維持するため、linger を有効にする（初回のみ）。

```bash
sudo loginctl enable-linger $(whoami)
```

## 起動

```bash
nohup node server.js > step-ui.log 2>&1 &
```

- HTTPS: `https://0.0.0.0:3000`
- HTTP: `http://localhost:3001`

## プロセス確認

```bash
ps aux | grep "node server.js"
```

## 停止

```bash
pkill -f "node server.js"
```

## ログ確認

```bash
tail -f step-ui.log
```
