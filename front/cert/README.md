# cert/

このディレクトリには TLS 証明書を配置します。

## ファイル

| ファイル | 内容 |
|---|---|
| `srv.crt` | step-ca が発行したサーバ証明書 |
| `srv.key` | 秘密鍵 |

## 証明書の取得

step-ca が起動している状態で以下を実行してください:

```bash
step ca certificate 192.168.11.143 front/cert/srv.crt front/cert/srv.key \
  --san localhost \
  --san 192.168.11.143
```

## 有効期限

step-ca のデフォルト発行期間は **24時間** です。
期限切れの場合は以下で更新してください:

```bash
step ca renew front/cert/srv.crt front/cert/srv.key
```

> **注意:** `srv.crt` と `srv.key` は `.gitignore` により Git 管理対象外です。
