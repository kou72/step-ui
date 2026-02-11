// Material: 表示専用 — divide-y で行区切り
function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-900 font-mono text-sm">{value ?? '—'}</span>
    </div>
  )
}

export function InfoPanel({ data, timestamp }) {
  return (
    <div className="divide-y divide-gray-200 mb-6">
      <Row label="CA URL"          value={data?.ca_url} />
      <Row label="HTTP ステータス" value={data?.http_status} />
      <Row label="取得時刻"         value={timestamp} />
    </div>
  )
}
