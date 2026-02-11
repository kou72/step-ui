// UI テキスト定数 — 表示文字列はすべてここで管理する
export const S = {

  // カード見出し
  page: {
    status: 'step-ca ステータス',
    config: 'CA設定',
    init:   'CA初期化',
  },

  // 汎用ラベル
  label: {
    status: 'ステータス',
  },

  // ボタン
  btn: {
    start:      'CA起動',
    stop:       'CA停止',
    refresh:    '更新',
    refreshing: '取得中…',
    init:       'CA初期化',
    initing:    '初期化中…',
  },

  // ステータスバッジ
  badge: {
    loading: '取得中…',
    ok:      'OK',
    error:   'ERROR',
  },

  // ステータス情報パネル
  info: {
    caUrl:      'CA URL',
    httpStatus: 'HTTP ステータス',
    fetchedAt:  '取得時刻',
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
  },

  // アクセシビリティ (aria-label)
  aria: {
    darkMode: (on)    => `ダークモード: 現在 ${on    ? 'ON'          : 'OFF'}`,
    theme:    (isNeu) => `テーマ切替: 現在 ${isNeu ? 'Neumorphism' : 'Material'}`,
  },
}
