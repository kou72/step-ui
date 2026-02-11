# step-ui

step-ca の状態確認・起動を行う Web UI。
React + Tailwind CSS v4 (Vite) のフロントエンドと Express のバックエンドで構成。

## ディレクトリ構成

```
step-ui/
├── front/          # Vite + React + Tailwind CSS v4
│   └── src/
│       ├── App.jsx
│       ├── theme/
│       └── components/
│           ├── neu/       # ニューモーフィズム実装
│           ├── material/  # マテリアルデザイン実装
│           ├── SideBar.jsx
│           └── ThemeSwitcher.jsx
└── back/           # Express (HTTP, ポート 3001)
    └── server.js
```

## セットアップ

### 1. sudoers 設定（初回のみ・要 root）

バックエンドが `mgmt` ユーザーとして step-ca を起動できるよう権限を付与する。

#### 1-a. パスワードファイルを作成

step-ca はターミナルなしで起動する場合にパスワードファイルが必要。
CA 初期化時に設定したパスワードを記録しておく。

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

確認:

```bash
sudo -l -U mgmt | grep -E 'step-ca|pkill'
# → (ALL) NOPASSWD: /usr/bin/step-ca --password-file ...
# → (ALL) NOPASSWD: /usr/bin/pkill -x step-ca
```

### 2. フロントエンドのビルド

```bash
cd ~/step-ui/front
npm install       # 初回のみ
npm run build     # dist/ を生成
```

### 3. バックエンドの起動

```bash
cd ~/step-ui/back
node server.js
# → HTTP server listening on http://localhost:3001
```

ブラウザで `http://192.168.11.143:3001` を開く。

> **開発時 (HMR)**
> ```bash
> cd ~/step-ui/front && npm run dev
> # → http://localhost:5173 (/api/* は localhost:3001 にプロキシ)
> ```

## 機能

| 機能 | 説明 |
|------|------|
| ステータス確認 | step-ca の `/health` を叩いて OK / ERROR を表示 |
| CA 起動 | ステータスが ERROR の時に「CA起動」ボタンが出現。クリックで `sudo step-ca` を実行 |
| CA 停止 | ステータスが OK の時に「CA停止」ボタンが出現。クリックで `sudo pkill -x step-ca` を実行 |
| テーマ切替 | サイドバー下部のトグルで Neumorphism / Material を切替 |
| ダークモード | サイドバー下部のトグルで ON/OFF |

## API

| エンドポイント | メソッド | 説明 |
|---|---|---|
| `/api/status` | GET | step-ca のヘルスチェック結果を返す |
| `/api/ca/start` | POST | step-ca を起動する。起動済みなら `409 already_running` |
| `/api/ca/stop`  | POST | step-ca を停止する。未起動なら `404 not_running` |

## 証明書の更新

step-ca が発行するサーバ証明書 (`back/srv.crt`) の有効期限は 24 時間。
期限切れになったら以下で更新する:

```bash
cd ~/step-ui/back
step ca renew srv.crt srv.key
node server.js  # 再起動
```
