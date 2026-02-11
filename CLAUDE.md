# step-ui 開発ガイドライン

## デザインルール

### 配色・背景

| 用途 | クラス | 説明 |
|------|--------|------|
| ページ背景 | `bg-slate-200` | 最も外側の背景 |
| 領域・コンテナ | `bg-slate-100` | カード・パネル等の区画 |

領域の区別は **背景色の差のみ** で表現する。ボーダーや影は使わない。

### 影 (box-shadow) の使用ルール

| コンポーネント種別 | 影 | 理由 |
|------|------|------|
| 表示専用 (テキスト・バッジ・情報パネル等) | **付けない** | 静的な情報に立体感は不要 |
| アクション要素 (ボタン・クリッカブル要素等) | **付ける** | 操作可能であることを示す |

ニューモーフィズムの影定数 (参考値):
```js
const SHADOW_OUT = '3px 3px 6px #d1d5db, -3px -3px 6px #ffffff'
```
- 暗い影: Tailwind `gray-300` = `#d1d5db`
- 明るい影: `#ffffff`

## テーマ対応ルール

このプロジェクトはニューモーフィズム (`neu`) とマテリアルデザイン (`material`) の2テーマを持つ。
UIコンポーネントに変更・追加を行う際は **必ず両テーマ分を実装する**。

### ファイル構成

```
front/src/components/
├── neu/          # ニューモーフィズム実装
│   ├── Card.jsx
│   ├── StatusBadge.jsx
│   ├── InfoPanel.jsx
│   └── Button.jsx
├── material/     # マテリアルデザイン実装
│   ├── Card.jsx
│   ├── StatusBadge.jsx
│   ├── InfoPanel.jsx
│   └── Button.jsx
├── index.jsx     # useTheme でテーマ切替するラッパー (themed() HOF)
└── ThemeSwitcher.jsx  # サイドバー固定の縦型トグルスイッチ
```

新しいコンポーネントを追加する場合:
1. `neu/NewComponent.jsx` と `material/NewComponent.jsx` をそれぞれ作成
2. **`neu/index.js`** と **`material/index.js`** の両方にエクスポートを追記
3. `components/index.jsx` に `themed('NewComponent')` のラッパーを追加

### テーマ別スタイル指針

| 項目 | Neumorphism (`neu`) | Material (`material`) |
|------|--------------------|-----------------------|
| カード背景 | `bg-slate-100` (影なし) | `bg-white` + `shadow-md` |
| バッジ (ok) | `bg-emerald-100 text-emerald-700` | `bg-emerald-500 text-white` |
| バッジ (error) | `bg-rose-100 text-rose-700` | `bg-rose-500 text-white` |
| 情報パネル区切り | `border-b border-slate-300` | `divide-y divide-slate-200` |
| ボタン | `bg-slate-100` + `SHADOW_OUT` | `bg-blue-500 text-white` |
