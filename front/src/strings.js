// UI テキスト定数 — 表示文字列はすべてここで管理する
export const S = {

  // カード見出し
  page: {
    ca:        'CA',
    cert:      '証明書',
    init:      'CA初期化',
    certIssue: '証明書発行',
  },

  // ボタン
  btn: {
    initOpen:    '初期化',
    init:        'CA初期化',
    initing:     '初期化中…',
    certIssue:   '発行',
    certSubmit:  '証明書を発行',
    certIssuing: '発行中…',
  },

  // ステータスバッジ
  badge: {
    loading: '取得中',
    ok:      '起動中',
    error:   '停止中',
  },

  // CA設定パネル
  config: {
    caName:      'CA名前',
    dns:         'FQDN / IP',
    address:     'アドレス',
    provisioner: '管理者',
    rootExpiry:  'ルートCA期限',
    intExpiry:   '中間CA期限',
    loading:     '設定ファイルを読み込み中…',
    loadError:   '設定ファイルの読み込みに失敗しました',
  },

  // CA初期化フォーム
  init: {
    warning:         '⚠ 既存の CA を上書きします。発行済み証明書はすべて無効になります。',
    caName:          'CA名前',
    dns:             'FQDN / IP (カンマ区切り)',
    address:         'リスニングアドレス',
    provisioner:     '管理者',
    password:        'パスワード',
    confirmPassword: 'パスワード確認',
    ph: {
      caName:      'My CA',
      dns:         '192.168.11.143',
      address:     ':443',
      provisioner: 'admin@example.com',
      password:    '••••••••',
    },
    err: {
      required: 'すべてのフィールドを入力してください',
      mismatch: 'パスワードが一致しません',
      generic:  '初期化中にエラーが発生しました',
    },
  },

  // サイドバー
  sidebar: {
    ca: 'CA',
    cert: 'CERT',
  },

  // ログパネル
  logs: {
    title: 'ログ',
    empty: 'ログがありません（CA起動後に表示されます）',
  },

  // 証明書ページ
  cert: {
    empty:    '発行済みの証明書はありません',
    subject:  'サブジェクト (CN)',
    san:      'SAN (カンマ区切り)',
    duration: '有効期間 (日数)',
    ph: {
      subject:  'myserver',
      san:      '192.168.11.143',
      duration: '1',
    },
    err: {
      required: 'サブジェクトと SAN を入力してください',
      generic:  '証明書の発行中にエラーが発生しました',
    },
    table: {
      subject:  'サブジェクト',
      san:      'SAN',
      expiry:   '有効期限',
      download: 'DL',
      action:   '',
    },
    deleteConfirm: 'この証明書を削除しますか？',
  },

  // ルート証明書パネル
  rootCert: {
    title:    'ルート証明書',
    subject:  'サブジェクト',
    expiry:   '有効期限',
    serial:   'シリアル',
    download: 'ダウンロード',
    empty:    'ルート証明書が見つかりません',
  },

  // アクセシビリティ (aria-label)
  aria: {
    darkMode: (on)    => `ダークモード: 現在 ${on    ? 'ON'          : 'OFF'}`,
    theme:    (isNeu) => `テーマ切替: 現在 ${isNeu ? 'Neumorphism' : 'Material'}`,
  },
}
