# cert/

UI サーバー (Express HTTPS:3000) 用の TLS 証明書を格納するディレクトリ。

このディレクトリの内容は `.gitignore` により git 管理外。

## ファイル

| ファイル | 説明 |
|---|---|
| `server.crt` | サーバー証明書 (step-ca 発行) |
| `server.key` | 秘密鍵 |

## 証明書の生成

step-ca が起動中に、プロジェクトルートから実行する。

```bash
step ca certificate "192.168.11.143" \
  cert/server.crt cert/server.key \
  --not-after=24h
```

プロビジョナーとパスワードの入力を求められる。

## 証明書の更新

有効期限は 24 時間。期限切れ後は再生成し、Express を再起動する。

```bash
# 再生成
step ca certificate "192.168.11.143" \
  cert/server.crt cert/server.key \
  --not-after=24h --force

# サーバー再起動
npm start
```

## 証明書がない場合

`server.js` は証明書の存在をチェックし、なければ HTTPS:3000 を起動しない。
HTTP:3001 は常に起動するため、証明書なしでも API と UI は HTTP 経由で利用可能。
