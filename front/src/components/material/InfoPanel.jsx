// Material: 表示専用 — divide-y で行区切り
function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-slate-500 dark:text-slate-400 text-sm">{label}</span>
      <span className="text-slate-900 dark:text-slate-100 font-mono text-sm">{value ?? '—'}</span>
    </div>
  )
}

export function InfoPanel({ data, timestamp }) {
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700 mb-6">
      <Row label="CA URL"          value={data?.ca_url} />
      <Row label="HTTP ステータス" value={data?.http_status} />
      <Row label="取得時刻"         value={timestamp} />
    </div>
  )
}
