// Neumorphism: 表示専用 — CLAUDE.md ルール: 影なし、border-b で行区切り
function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="text-gray-800 font-mono text-sm">{value ?? '—'}</span>
    </div>
  )
}

export function InfoPanel({ data, timestamp }) {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-300">
        <Row label="CA URL"          value={data?.ca_url} />
      </div>
      <div className="border-b border-gray-300">
        <Row label="HTTP ステータス" value={data?.http_status} />
      </div>
      <Row label="取得時刻" value={timestamp} />
    </div>
  )
}
